// Uso: node tests/copies/check.ts [<ruta de upstream.json>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
// Compara cada copia anotada de skills/ con su original en el tag del registro, sin red.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, posix, resolve } from 'node:path';
import { BuildError } from '../../build/errors.ts';
import { readRegistry, type Entry, type Registry } from '../../build/sources.ts';
import { git } from '../../cli/src/git/git.ts';
import { findClones } from '../upstream/clones.ts';
import { checkCopy, checkVerbatim, formatProblem, keptShare, outputOf } from './annotated.ts';

const DEFAULT_REGISTRY = resolve(import.meta.dirname, '../../upstream.json');
const MIN_KEPT = 50;

interface Originals {
  registry: Registry;
  clones: Map<string, string>;
  dir: string;
}

function cloneOf(originals: Originals, source: string): string | undefined {
  return originals.clones.get(originals.registry.sources[source].repo.toLowerCase());
}

export async function showAt(clone: string, version: string, path: string): Promise<string | null> {
  const result = await git(clone, ['show', `${version}:${path}`]);
  return result.code === 0 ? result.stdout : null;
}

async function missingVersion(originals: Originals, source: string, version: string): Promise<string | null> {
  const clone = cloneOf(originals, source);
  if (!clone) return `${source}: sin clone de ${originals.registry.sources[source].repo} en ${originals.dir}.`;
  const found = (await git(clone, ['cat-file', '-e', `${version}^{commit}`])).code === 0;
  return found ? null : `${source}: falta ${version} en el clon ${clone}`;
}

function mappedPaths(registry: Registry, source: string): Set<string> {
  const paths = registry.entries.filter((entry) => entry.source === source).flatMap((entry) => entry.paths);
  const fromPaths = registry.entries.flatMap((entry) => entry.from ?? []).filter((ref) => ref.source === source).map((ref) => ref.path);
  return new Set([...paths, ...fromPaths, ...(registry.sources[source].notCopied ?? [])]);
}

async function unmapped(originals: Originals, entry: Entry): Promise<string[]> {
  const clone = cloneOf(originals, entry.source) ?? '';
  const folder = posix.dirname(entry.paths[0]);
  const listed = (await git(clone, ['ls-tree', '-r', '--name-only', entry.version, `${folder}/`])).stdout.split(/\r?\n/).filter(Boolean);
  const mapped = mappedPaths(originals.registry, entry.source);
  return listed
    .filter((path) => !mapped.has(path))
    .map((path) => `${entry.source}@${entry.version}: ${path} está en la carpeta de una copia y no en upstream.json: mapéalo en paths, from o notCopied`);
}

async function fragmentsOf(originals: Originals, entry: Entry): Promise<Map<string, string>> {
  const fragments = new Map<string, string>();
  for (const ref of entry.from ?? []) {
    const clone = cloneOf(originals, ref.source);
    const text = clone ? await showAt(clone, ref.version, ref.path) : null;
    if (text !== null) fragments.set(`${ref.source} ${ref.path}`, text);
  }
  return fragments;
}

function keptProblem(kit: string, annotated: string, original: string, path: string): string[] {
  let output: string;
  try {
    output = outputOf(annotated);
  } catch (error) {
    if (error instanceof BuildError) return [];
    throw error;
  }
  const kept = keptShare(output, original);
  return kept >= MIN_KEPT ? [] : [`${kit}: conserva el ${kept} % de su original ${path}; por debajo del ${MIN_KEPT} % es propia: pásala a own`];
}

async function checkFile(originals: Originals, entry: Entry, repoRoot: string): Promise<string[]> {
  const [kit] = entry.kit;
  const [path] = entry.paths;
  const original = await showAt(cloneOf(originals, entry.source) ?? '', entry.version, path);
  if (original === null) return [`${kit}: su original ${path} no existe en ${entry.version}`];
  const annotated = readFileSync(resolve(repoRoot, kit), 'utf8');
  const label = `${path}@${entry.version}`;
  if (!kit.endsWith('.md')) return checkVerbatim(kit, annotated, original, label).map(formatProblem);
  const problems = checkCopy({ file: kit, annotated, original, label, fragments: await fragmentsOf(originals, entry) }).map(formatProblem);
  return [...keptProblem(kit, annotated, original, path), ...problems];
}

async function checkEntry(originals: Originals, entry: Entry, repoRoot: string): Promise<string[]> {
  if (entry.pending !== undefined) return [`${entry.kit.join(', ')}: sin anotar → ${entry.pending}`];
  const versions = [{ source: entry.source, version: entry.version }, ...(entry.from ?? [])];
  for (const { source, version } of versions) {
    const missing = await missingVersion(originals, source, version);
    if (missing) return [missing];
  }
  return [...(await unmapped(originals, entry)), ...(await checkFile(originals, entry, repoRoot))];
}

export async function checkRegistryCopies(registry: Registry, repoRoot: string, clonesDir: string): Promise<string[]> {
  const originals: Originals = { registry, clones: await findClones(clonesDir), dir: clonesDir };
  const lines: string[] = [];
  for (const entry of registry.entries.filter((candidate) => candidate.kind === 'copy')) lines.push(...(await checkEntry(originals, entry, repoRoot)));
  return [...new Set(lines)];
}

function report(lines: string[], code = 1): number {
  for (const line of lines) console.log(line);
  return code;
}

async function main(argv: string[]): Promise<number> {
  const registryPath = resolve(argv[0] ?? DEFAULT_REGISTRY);
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
  const lines = await checkRegistryCopies(registry, dirname(registryPath), dir);
  const annotated = registry.entries.filter((entry) => entry.kind === 'copy' && entry.pending === undefined).length;
  return lines.length > 0 ? report(lines) : report([`Copias al día: ${annotated} ficheros.`], 0);
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) process.exitCode = await main(process.argv.slice(2));
