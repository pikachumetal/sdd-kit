// Uso: node tests/upstream/check.ts [<ruta de THIRD_PARTY_NOTICES.md>], con SDD_UPSTREAM_DIR apuntando a la carpeta de los clones.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { git } from '../../cli/src/git/git.ts';

interface Source {
  name: string;
  repo: string;
  seen: string;
}

interface ParsedTag {
  prefix: string;
  version: number[];
}

const TABLE_HEADER = '| Fuente | Repo | Versión vista | Fecha |';
const DEFAULT_NOTICES = resolve(import.meta.dirname, '../../THIRD_PARTY_NOTICES.md');

const cells = (line: string): string[] => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());

function repoOfUrl(url: string): string | null {
  const match = /github\.com[/:]([^/\s)]+)\/([^/\s)]+?)(?:\.git)?(?:[)\s]|$)/i.exec(url);
  return match ? `${match[1]}/${match[2]}`.toLowerCase() : null;
}

function parseSources(markdown: string): Source[] | null {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === TABLE_HEADER);
  if (start < 0) return null;
  const sources: Source[] = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.startsWith('|')) break;
    const [name, repoCell, seenCell] = cells(line);
    sources.push({ name, repo: repoOfUrl(repoCell) ?? repoCell, seen: seenCell.replace(/^`(.*)`$/, '$1') });
  }
  return sources;
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

function newestTag(tags: string[], seen: string): string {
  const seenTag = parseTag(seen);
  if (!seenTag) return seen;
  let newest = { tag: seen, version: seenTag.version };
  for (const tag of tags) {
    const parsed = parseTag(tag);
    if (parsed?.prefix === seenTag.prefix && isNewer(parsed.version, newest.version)) newest = { tag, version: parsed.version };
  }
  return newest.tag;
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

async function checkSource(source: Source, clone: string | undefined, dir: string): Promise<string | null> {
  if (!clone) return `${source.name}: sin clone de ${source.repo} en ${dir}.`;
  const fetch = await git(clone, ['fetch', '--tags', '--force', '--quiet', 'origin']);
  if (fetch.code !== 0) return `${source.name}: no se pudo actualizar el clone: ${firstLine(fetch.stderr)}.`;
  const tags = (await git(clone, ['tag', '--list'])).stdout.split(/\r?\n/).filter(Boolean);
  if (!tags.includes(source.seen)) return `${source.name}: la versión vista ${source.seen} no es un tag del clone.`;
  const newest = newestTag(tags, source.seen);
  if (newest === source.seen) return null;
  return `${source.name}: vista ${source.seen}, última ${newest}. Revisa: git -C ${clone} diff ${source.seen}..${newest}`;
}

function report(lines: string[], code = 1): number {
  for (const line of lines) console.log(line);
  return code;
}

async function main(argv: string[]): Promise<number> {
  const noticesPath = argv[0] ?? DEFAULT_NOTICES;
  const dir = process.env.SDD_UPSTREAM_DIR;
  if (!dir) return report(['Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.']);
  const sources = parseSources(existsSync(noticesPath) ? readFileSync(noticesPath, 'utf8') : '');
  if (!sources) return report([`Sin la tabla de «Fuentes vigiladas» en ${noticesPath}.`]);
  const clones = await findClones(dir);
  const problems: string[] = [];
  for (const source of sources) {
    const problem = await checkSource(source, clones.get(source.repo.toLowerCase()), dir);
    if (problem) problems.push(problem);
  }
  return problems.length > 0 ? report(problems) : report([`Fuentes al día: ${sources.length}.`], 0);
}

process.exitCode = await main(process.argv.slice(2));
