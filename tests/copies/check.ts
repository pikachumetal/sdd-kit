// Uso: node tests/copies/check.ts [<ruta de upstream.json>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
// Compara cada copia anotada de skills/ con su original en el tag del registro, sin red.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, posix, resolve } from 'node:path';
import { BuildError } from '../../build/errors.ts';
import { readRegistry, watchedRefs, type Entry, type Registry } from '../../build/sources.ts';
import { git } from '../../cli/src/git/git.ts';
import { DEFAULT_REGISTRY, findClones, hasCommit, MISSING_UPSTREAM_DIR, report, showAt } from '../upstream/clones.ts';
import { checkCopy, checkVerbatim, copyShareProblem, eolVerdict, formatProblem, outputOf, type IndexEol } from './annotated.ts';

interface Originals {
  registry: Registry;
  clones: Map<string, string>;
  dir: string;
  repoRoot: string;
  eols: Map<string, IndexEol>;
}

// Una sola llamada para todas las copias; `-z` deja las rutas con espacios o acentos sin escapar. Sin repo, o con
// git fallando, el mapa queda vacío y el disco decide.
export async function indexEols(repoRoot: string, files: string[]): Promise<Map<string, IndexEol>> {
  const eols = new Map<string, IndexEol>();
  if (files.length === 0) return eols;
  const result = await git(repoRoot, ['ls-files', '--eol', '-z', '--', ...files]);
  if (result.code !== 0) return eols;
  for (const record of result.stdout.split('\0').filter((line) => line !== '')) {
    const match = /^i\/(\S+)\s+w\/\S*\s+attr\/[^\t]*\t(.+)$/.exec(record);
    if (match) eols.set(match[2], match[1] as IndexEol);
  }
  return eols;
}

function cloneOf(originals: Originals, source: string): string | undefined {
  return originals.clones.get(originals.registry.sources[source].repo.toLowerCase());
}

async function missingVersion(originals: Originals, source: string, version: string): Promise<string | null> {
  const clone = cloneOf(originals, source);
  if (!clone) return `${source}: sin clone de ${originals.registry.sources[source].repo} en ${originals.dir}.`;
  return (await hasCommit(clone, version)) ? null : `${source}: falta ${version} en el clon ${clone}`;
}

function mappedPaths(registry: Registry, source: string): Set<string> {
  const paths = registry.entries.flatMap(watchedRefs).filter((ref) => ref.source === source).flatMap((ref) => ref.paths);
  return new Set([...paths, ...(registry.sources[source].notCopied ?? [])]);
}

async function unmapped(originals: Originals, entry: Entry, clone: string): Promise<string[]> {
  const at = `${entry.source}@${entry.version}`;
  const listing = await git(clone, ['ls-tree', '-r', '--name-only', entry.version, `${posix.dirname(entry.paths[0])}/`]);
  if (listing.code !== 0) return [`${at}: git ls-tree falló: ${listing.stderr.trim()}`];
  const mapped = mappedPaths(originals.registry, entry.source);
  return listing.stdout
    .split(/\r?\n/)
    .filter((path) => path !== '' && !mapped.has(path))
    .map((path) => `${at}: ${path} está en la carpeta de una copia y no en upstream.json: mapéalo en paths, from o notCopied`);
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

function shareProblems(file: string, annotated: string, original: { text: string; path: string }): string[] {
  let output: string;
  try {
    output = outputOf(annotated);
  } catch (error) {
    // Una marca mal puesta ya sale de checkCopy como texto sin marca; aquí solo falta la medida.
    if (error instanceof BuildError) return [];
    throw error;
  }
  const problem = copyShareProblem({ file, output, original: original.text, path: original.path });
  return problem ? [formatProblem(problem)] : [];
}

async function checkFile(originals: Originals, entry: Entry, clone: string): Promise<string[]> {
  const [file] = entry.kit;
  const [path] = entry.paths;
  const original = await showAt(clone, entry.version, path);
  if (original === null) return [`${file}: su original ${path} no existe en ${entry.version}`];
  const verdict = eolVerdict(originals.eols.get(file), readFileSync(resolve(originals.repoRoot, file), 'utf8'));
  if ('problem' in verdict) return [formatProblem({ file, message: 'tiene finales de línea CRLF; la fuente de una copia va en LF' })];
  const annotated = verdict.text;
  const label = `${path}@${entry.version}`;
  if (!file.endsWith('.md')) return checkVerbatim({ file, annotated, original, label }).map(formatProblem);
  const problems = checkCopy({ file, annotated, original, label, fragments: await fragmentsOf(originals, entry) }).map(formatProblem);
  return [...shareProblems(file, annotated, { text: original, path }), ...problems];
}

async function checkEntry(originals: Originals, entry: Entry): Promise<string[]> {
  if (entry.pending !== undefined) return [`${entry.kit.join(', ')}: sin anotar → ${entry.pending}`];
  for (const { source, version } of watchedRefs(entry)) {
    const missing = await missingVersion(originals, source, version);
    if (missing) return [missing];
  }
  const clone = cloneOf(originals, entry.source) as string;
  return [...(await unmapped(originals, entry, clone)), ...(await checkFile(originals, entry, clone))];
}

export async function checkRegistryCopies(registry: Registry, repoRoot: string, clonesDir: string): Promise<string[]> {
  const copies = registry.entries.filter((candidate) => candidate.kind === 'copy');
  const eols = await indexEols(repoRoot, copies.flatMap((entry) => entry.kit));
  const originals: Originals = { registry, clones: await findClones(clonesDir), dir: clonesDir, repoRoot, eols };
  const lines: string[] = [];
  for (const entry of copies) lines.push(...(await checkEntry(originals, entry)));
  return [...new Set(lines)];
}

async function main(argv: string[]): Promise<number> {
  const registryPath = resolve(argv[0] ?? DEFAULT_REGISTRY);
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
  const lines = await checkRegistryCopies(registry, dirname(registryPath), dir);
  const annotated = registry.entries.filter((entry) => entry.kind === 'copy' && entry.pending === undefined).length;
  return lines.length > 0 ? report(lines) : report([`Copias al día: ${annotated} ficheros.`], 0);
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) process.exitCode = await main(process.argv.slice(2));
