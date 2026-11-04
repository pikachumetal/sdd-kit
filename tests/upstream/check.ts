// Uso: node tests/upstream/check.ts [<ruta de upstream.json>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
// El package.json de esta carpeta ("type": "module") evita que Node avise por stderr y ensucie la salida.
import { existsSync } from 'node:fs';
import { BuildError } from '../../build/errors.ts';
import { readRegistry, watchedRefs, type Registry, type Source, type WatchedRef } from '../../build/sources.ts';
import { git } from '../../cli/src/git/git.ts';
import { DEFAULT_REGISTRY, findClones, hasCommit, MISSING_UPSTREAM_DIR, report } from './clones.ts';

interface ParsedTag {
  prefix: string;
  version: number[];
}

interface SourceClone {
  name: string;
  clone: string;
  newest: string;
}

interface KitRef extends WatchedRef {
  kit: string[];
}

// Prefijo distinto es otra familia de tags (OpenSpec publica `v1.14.1` y `@fission-ai/openspec@1.14.1`); un sufijo es prerelease.
function parseTag(tag: string): ParsedTag | null {
  const match = /^(.*?)(\d+)\.(\d+)\.(\d+)$/.exec(tag);
  return match ? { prefix: match[1], version: match.slice(2).map(Number) } : null;
}

function isNewer(candidate: number[], current: number[]): boolean {
  const index = candidate.findIndex((part, i) => part !== current[i]);
  return index >= 0 && candidate[index] > current[index];
}

function newestTag(tags: string[], prefix: string): string | null {
  let newest: { tag: string; version: number[] } | null = null;
  for (const tag of tags) {
    const parsed = parseTag(tag);
    if (parsed?.prefix === prefix && (newest === null || isNewer(parsed.version, newest.version))) newest = { tag, version: parsed.version };
  }
  return newest?.tag ?? null;
}

const firstLine = (text: string): string => text.split(/\r?\n/).find((line) => line.trim() !== '')?.trim().replace(/\.$/, '') ?? 'sin detalle';

async function prepareSource(name: string, source: Source, clone: string): Promise<SourceClone | string> {
  const fetch = await git(clone, ['fetch', '--tags', '--force', '--quiet', 'origin']);
  if (fetch.code !== 0) return `${name}: no se pudo actualizar el clone: ${firstLine(fetch.stderr)}.`;
  const tags = (await git(clone, ['tag', '--list'])).stdout.split(/\r?\n/).filter(Boolean);
  const newest = newestTag(tags, source.tagPrefix);
  if (newest === null) return `${name}: el clon ${clone} no tiene tags ${source.tagPrefix}X.Y.Z`;
  return { name, clone, newest };
}

async function checkRef(ref: KitRef, { name, clone, newest }: SourceClone): Promise<string[]> {
  if (!(await hasCommit(clone, ref.version))) return [`${name}: falta ${ref.version} en el clon ${clone}`];
  if (ref.version === newest) return [];
  const where = `${name} · ${ref.kit.join(', ')}`;
  const gone: string[] = [];
  for (const path of ref.paths) if ((await git(clone, ['cat-file', '-e', `${newest}:${path}`])).code !== 0) gone.push(`${where}: la ruta ${path} no existe en ${newest}`);
  if (gone.length > 0) return gone;
  const diff = await git(clone, ['diff', '--quiet', ref.version, newest, '--', ...ref.paths]);
  if (diff.code === 0) return [];
  if (diff.code !== 1) return [`${where}: git diff falló: ${firstLine(diff.stderr)}`];
  return [`${where}: ${ref.version} → ${newest}, cambian sus rutas: git -C ${clone} diff ${ref.version} ${newest} -- ${ref.paths.join(' ')}`];
}

const kitRefs = (registry: Registry): KitRef[] => registry.entries.flatMap((entry) => watchedRefs(entry).map((ref) => ({ ...ref, kit: entry.kit })));

async function checkRegistry(registry: Registry, dir: string): Promise<string[]> {
  const clones = await findClones(dir);
  const refs = kitRefs(registry);
  const problems: string[] = [];
  for (const [name, source] of Object.entries(registry.sources)) {
    const own = refs.filter((ref) => ref.source === name);
    if (own.length === 0) continue;
    const clone = clones.get(source.repo.toLowerCase());
    const prepared = clone ? await prepareSource(name, source, clone) : `${name}: sin clone de ${source.repo} en ${dir}.`;
    if (typeof prepared === 'string') problems.push(prepared);
    else for (const ref of own) problems.push(...(await checkRef(ref, prepared)));
  }
  return problems;
}

async function main(argv: string[]): Promise<number> {
  const registryPath = argv[0] ?? DEFAULT_REGISTRY;
  const dir = process.env.SDD_UPSTREAM_DIR;
  if (!dir) return report([MISSING_UPSTREAM_DIR]);
  if (!existsSync(registryPath)) return report([`Sin el registro de fuentes en ${registryPath}.`]);
  let registry: Registry;
  try {
    registry = readRegistry(registryPath);
  } catch (error) {
    if (error instanceof BuildError) return report([error.message]);
    throw error;
  }
  const problems = await checkRegistry(registry, dir);
  return problems.length > 0 ? report(problems) : report([`Fuentes al día: ${registry.entries.length} entradas.`], 0);
}

process.exitCode = await main(process.argv.slice(2));
