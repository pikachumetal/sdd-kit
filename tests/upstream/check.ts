// Uso: node tests/upstream/check.ts [<ruta de upstream.json>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
// El package.json de esta carpeta ("type": "module") evita que Node avise por stderr y ensucie la salida.
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { BuildError } from '../../build/errors.ts';
import { readRegistry, type Entry, type Registry, type Source } from '../../build/sources.ts';
import { git } from '../../cli/src/git/git.ts';

interface ParsedTag {
  prefix: string;
  version: number[];
}

interface SourceClone {
  name: string;
  clone: string;
  newest: string;
}

const DEFAULT_REGISTRY = resolve(import.meta.dirname, '../../upstream.json');

function repoOfUrl(url: string): string | null {
  const match = /github\.com[/:]([^/\s)]+)\/([^/\s)]+?)(?:\.git)?(?:[)\s]|$)/i.exec(url);
  return match ? `${match[1]}/${match[2]}`.toLowerCase() : null;
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

// Se lee la configuración cruda: `git remote get-url` aplicaría `url.<base>.insteadOf`.
async function originRepo(clone: string): Promise<string | null> {
  const result = await git(clone, ['config', '--get', 'remote.origin.url']);
  return result.code === 0 ? repoOfUrl(result.stdout.trim()) : null;
}

async function findClones(dir: string): Promise<Map<string, string>> {
  const clones = new Map<string, string>();
  const entries = existsSync(dir) ? readdirSync(dir, { withFileTypes: true }) : [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (!entry.isDirectory() || !existsSync(join(path, '.git'))) continue;
    const repo = await originRepo(path);
    if (repo) clones.set(repo, path);
  }
  return clones;
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

async function exists(clone: string, revision: string): Promise<boolean> {
  return (await git(clone, ['cat-file', '-e', revision])).code === 0;
}

async function checkEntry(entry: Entry, { name, clone, newest }: SourceClone): Promise<string[]> {
  if (!(await exists(clone, `${entry.version}^{commit}`))) return [`${name}: falta ${entry.version} en el clon ${clone}`];
  if (entry.version === newest) return [];
  const where = `${name} · ${entry.kit.join(', ')}`;
  const gone: string[] = [];
  for (const path of entry.paths) if (!(await exists(clone, `${newest}:${path}`))) gone.push(`${where}: la ruta ${path} no existe en ${newest}`);
  if (gone.length > 0) return gone;
  const diff = await git(clone, ['diff', '--quiet', entry.version, newest, '--', ...entry.paths]);
  if (diff.code === 0) return [];
  if (diff.code !== 1) return [`${where}: git diff falló: ${firstLine(diff.stderr)}`];
  return [`${where}: ${entry.version} → ${newest}, cambian sus rutas: git -C ${clone} diff ${entry.version} ${newest} -- ${entry.paths.join(' ')}`];
}

async function checkRegistry(registry: Registry, dir: string): Promise<string[]> {
  const clones = await findClones(dir);
  const problems: string[] = [];
  for (const [name, source] of Object.entries(registry.sources)) {
    const entries = registry.entries.filter((entry) => entry.source === name);
    if (entries.length === 0) continue;
    const clone = clones.get(source.repo.toLowerCase());
    const prepared = clone ? await prepareSource(name, source, clone) : `${name}: sin clone de ${source.repo} en ${dir}.`;
    if (typeof prepared === 'string') problems.push(prepared);
    else for (const entry of entries) problems.push(...(await checkEntry(entry, prepared)));
  }
  return problems;
}

function report(lines: string[], code = 1): number {
  for (const line of lines) console.log(line);
  return code;
}

async function main(argv: string[]): Promise<number> {
  const registryPath = argv[0] ?? DEFAULT_REGISTRY;
  const dir = process.env.SDD_UPSTREAM_DIR;
  if (!dir) return report(['Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.']);
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
