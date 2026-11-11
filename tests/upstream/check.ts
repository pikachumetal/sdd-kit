// Uso: node tests/upstream/check.ts [<ruta de upstream.json>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
// El package.json de esta carpeta ("type": "module") evita que Node avise por stderr y ensucie la salida.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { WHOLE_LINE_MARK } from '../../build/dist.ts';
import { BuildError } from '../../build/errors.ts';
import { readRegistry, watchedRefs, type Registry, type Source, type WatchedRef } from '../../build/sources.ts';
import { git, isolatedEnv } from '../../cli/src/git/git.ts';
import { abbreviate, DEFAULT_REGISTRY, findClones, hasCommit, MISSING_UPSTREAM_DIR, report } from './clones.ts';

const MIN_LITERAL = 70;

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

interface OwnLine {
  file: string;
  line: number;
  text: string;
}

interface Hit {
  path: string;
  content: string;
}

function filesAt(repoRoot: string, path: string): string[] {
  const full = join(repoRoot, path);
  if (!existsSync(full)) return [];
  if (!statSync(full).isDirectory()) return [path];
  return readdirSync(full, { recursive: true, encoding: 'utf8' })
    .filter((name) => statSync(join(full, name)).isFile())
    .map((name) => `${path.replace(/\/$/, '')}/${name.replaceAll('\\', '/')}`);
}

function ownLines(registry: Registry, repoRoot: string): OwnLine[] {
  const files = (registry.own ?? []).flatMap((path) => filesAt(repoRoot, path)).filter((file) => !file.endsWith('/NOTICE'));
  return files.flatMap((file) =>
    readFileSync(join(repoRoot, file), 'utf8')
      .split(/\r?\n/)
      .flatMap((content, index) => {
        const text = content.trim();
        return text.length >= MIN_LITERAL && !WHOLE_LINE_MARK.test(content) ? [{ file, line: index + 1, text }] : [];
      }),
  );
}

// Las líneas van por la entrada estándar: en la línea de órdenes, los cientos de líneas largas de los own pasan del tope de Windows.
// git() no acepta entrada, por eso este spawnSync con su mismo entorno.
function grepAt(clone: string, version: string, patterns: string[]): Hit[] | string {
  const args = ['-C', clone, '-c', 'core.quotePath=false', 'grep', '-F', '-I', '-z', '-f', '-', version];
  const result = spawnSync('git', args, { input: patterns.join('\n'), encoding: 'utf8', env: isolatedEnv(), maxBuffer: 64 * 1024 * 1024, windowsHide: true });
  if (result.error) return result.error.message;
  if (result.status !== 0 && result.status !== 1) return firstLine(result.stderr ?? '');
  return (result.stdout ?? '')
    .split('\n')
    .filter(Boolean)
    .map((hit) => {
      const [where, content = ''] = hit.split('\0');
      return { path: where.slice(version.length + 1), content };
    });
}

// Una versión que falta en el clon ya sale como «falta <versión>»: no se busca en ella.
async function versionsOf(registry: Registry, source: SourceClone): Promise<string[]> {
  const versions = [...new Set([source.newest, ...kitRefs(registry).filter((ref) => ref.source === source.name).map((ref) => ref.version)])];
  const present = await Promise.all(versions.map((version) => hasCommit(source.clone, version)));
  return versions.filter((_, index) => present[index]);
}

const literalMessage = (line: OwnLine, source: string, where: string): string =>
  `${line.file}:${line.line}: línea literal de ${source} ${where}, y un own no lleva NOTICE: reescríbela o pasa el fichero a copia: «${abbreviate(line.text)}»`;

function recordHits(found: Map<OwnLine, string>, lines: OwnLine[], at: { source: string; version: string; hits: Hit[] }): void {
  for (const line of lines.filter((candidate) => !found.has(candidate))) {
    const hit = at.hits.find((candidate) => candidate.content.includes(line.text));
    if (hit) found.set(line, literalMessage(line, at.source, `${hit.path}@${at.version}`));
  }
}

// Un own no genera NOTICE: una línea suya que está en una fuente se quedaría sin su aviso de licencia.
async function ownLiterals(registry: Registry, repoRoot: string, prepared: SourceClone[]): Promise<string[]> {
  const lines = ownLines(registry, repoRoot);
  if (lines.length === 0) return [];
  const patterns = [...new Set(lines.map((line) => line.text))];
  const problems: string[] = [];
  const found = new Map<OwnLine, string>();
  for (const source of prepared)
    for (const version of await versionsOf(registry, source)) {
      const hits = grepAt(source.clone, version, patterns);
      if (typeof hits === 'string') problems.push(`${source.name}: git grep falló en ${version}: ${hits}`);
      else recordHits(found, lines, { source: source.name, version, hits });
    }
  return [...problems, ...lines.flatMap((line) => found.get(line) ?? [])];
}

interface ReviewSection {
  review: string;
  source: string;
  from: string;
  to: string;
  scope: string[];
  named: string[];
  unread: string[];
}

const REVIEW_DIRS = ['.docs/sdd/specs', '.docs/sdd/changes'];
const SECTION_TITLE = /^## (.+) `([^`]+)` → `([^`]+)`$/;
// Solo las secciones que abren con `git diff --stat`: las revisiones de la 0181 y la 0289, sin él, son historia y no se reescriben.
const STAT_COMMAND = /^`git -C \S+ diff (?:-\S+ )*--stat (?:-\S+ )*\S+ -- ([^`]+)`/;

const backticked = (line: string): string[] => [...line.matchAll(/`([^`]+)`/g)].map((match) => match[1]);

function parseSection(review: string, chunk: string): ReviewSection | null {
  const [heading, ...body] = chunk.split(/\r?\n/);
  const title = SECTION_TITLE.exec(heading);
  const stat = STAT_COMMAND.exec(body.find((line) => line.trim() !== '') ?? '');
  if (!title || !stat) return null;
  const tokens = (start: string): string[] => body.filter((line) => line.startsWith(start)).flatMap(backticked);
  return { review, source: title[1], from: title[2], to: title[3], scope: stat[1].trim().split(/\s+/), named: tokens('|'), unread: tokens('Sin leer') };
}

function reviewSections(repoRoot: string): ReviewSection[] {
  const reviews = REVIEW_DIRS.flatMap((dir) => (existsSync(join(repoRoot, dir)) ? readdirSync(join(repoRoot, dir)).map((name) => `${dir}/${name}/upstream-review.md`) : []));
  return reviews
    .filter((review) => existsSync(join(repoRoot, review)))
    .flatMap((review) => readFileSync(join(repoRoot, review), 'utf8').split(/\r?\n(?=## )/).flatMap((chunk) => parseSection(review, chunk) ?? []));
}

// Una fila solo cubre su fichero exacto; «Sin leer» admite una carpeta (`src/`), que declara sin leer todo lo que cuelga de ella.
const covered = (section: ReviewSection, file: string): boolean =>
  section.named.includes(file) || section.unread.some((token) => token === file || (token.endsWith('/') && file.startsWith(token)));

async function checkSection(section: ReviewSection, clone: string): Promise<string[]> {
  const range = `${section.from}..${section.to}`;
  const at = `${section.review} · ${section.source} ${section.from} → ${section.to}`;
  const diff = await git(clone, ['diff', '--name-only', range, '--', ...section.scope]);
  if (diff.code !== 0) return [`${at}: git diff falló: ${firstLine(diff.stderr)}`];
  const missing = diff.stdout.split(/\r?\n/).filter((file) => file !== '' && !covered(section, file));
  if (missing.length === 0) return [];
  return [`${at}: sin fila ni «Sin leer» para ${missing.join(', ')}; los lista git -C ${clone} diff --name-only ${range} -- ${section.scope.join(' ')}`];
}

// Una fuente entra en la comprobación con su primera sección --stat: desde ahí, la versión vista no pasa de la última revisada.
function unreviewedBump(registry: Registry, source: SourceClone, sections: ReviewSection[]): string[] {
  const prefix = registry.sources[source.name].tagPrefix;
  const reviewed = sections.filter((section) => section.source === source.name);
  const last = newestTag(reviewed.map((section) => section.to), prefix);
  const seen = newestTag(kitRefs(registry).filter((ref) => ref.source === source.name).map((ref) => ref.version), prefix);
  if (last === null || seen === null || seen === last || newestTag([seen, last], prefix) !== seen) return [];
  const review = reviewed.find((section) => section.to === last)?.review;
  return [`${source.name}: la versión vista sube a ${seen} sin revisión: la última sección --stat, en ${review}, llega a ${last}`];
}

async function reviewProblems(registry: Registry, repoRoot: string, ready: SourceClone[]): Promise<string[]> {
  const sections = reviewSections(repoRoot);
  const problems: string[] = [];
  for (const section of sections) {
    const source = ready.find((candidate) => candidate.name === section.source);
    if (!(section.source in registry.sources)) problems.push(`${section.review}: la sección de ${section.source} no nombra una fuente de upstream.json`);
    else if (source) problems.push(...(await checkSection(section, source.clone)));
  }
  return [...problems, ...ready.flatMap((source) => unreviewedBump(registry, source, sections))];
}

async function checkRegistry(registry: Registry, dir: string, repoRoot: string): Promise<string[]> {
  const clones = await findClones(dir);
  const refs = kitRefs(registry);
  const problems: string[] = [];
  const ready: SourceClone[] = [];
  for (const [name, source] of Object.entries(registry.sources)) {
    const own = refs.filter((ref) => ref.source === name);
    if (own.length === 0) continue;
    const clone = clones.get(source.repo.toLowerCase());
    const prepared = clone ? await prepareSource(name, source, clone) : `${name}: sin clone de ${source.repo} en ${dir}.`;
    if (typeof prepared === 'string') problems.push(prepared);
    else {
      ready.push(prepared);
      for (const ref of own) problems.push(...(await checkRef(ref, prepared)));
    }
  }
  return [...problems, ...(await reviewProblems(registry, repoRoot, ready)), ...(await ownLiterals(registry, repoRoot, ready))];
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
  const problems = await checkRegistry(registry, dir, dirname(resolve(registryPath)));
  return problems.length > 0 ? report(problems) : report([`Fuentes al día: ${registry.entries.length} entradas.`], 0);
}

process.exitCode = await main(process.argv.slice(2));
