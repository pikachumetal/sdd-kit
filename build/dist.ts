// Construye dist/, lo único que viaja en el plugin: la lista blanca, con las marcas del kit quitadas de los .md.
// Uso: node build/dist.ts (moon run kit:build).
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { git } from '../cli/src/git/git.ts';

export const WHITELIST: readonly string[] = [
  '.claude-plugin/plugin.json',
  'agents/',
  'cli/bin/',
  'cli/src/',
  'cli/package.json',
  'hooks/',
  'skills/',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
];

export class BuildError extends Error {}

const MARK_OPENER = '<!-- kit:';
const WHOLE_LINE_MARK = /^\s*<!-- kit:.*-->\s*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const MISPLACED = 'marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código';

type Block = 'frontmatter' | 'text' | { fence: string };

function nextBlock(block: Block, content: string, index: number): Block {
  if (block === 'frontmatter') return index > 0 && content.trimEnd() === '---' ? 'text' : 'frontmatter';
  const fence = FENCE.exec(content)?.[1];
  if (block === 'text') return fence ? { fence } : 'text';
  const closes = fence !== undefined && fence[0] === block.fence[0] && fence.length >= block.fence.length && content.trim() === fence;
  return closes ? 'text' : block;
}

function isMarkToDrop(block: Block, content: string, location: string): boolean {
  if (!content.includes(MARK_OPENER)) return false;
  if (typeof block === 'object') return false;
  if (block === 'text' && WHOLE_LINE_MARK.test(content)) return true;
  throw new BuildError(`${location}: ${MISPLACED}`);
}

export function stripMarks(text: string, file: string): string {
  const lines = text.split(/(?<=\n)/);
  let block: Block = lines[0]?.trimEnd() === '---' ? 'frontmatter' : 'text';
  const kept: string[] = [];
  lines.forEach((line, index) => {
    const content = line.replace(/\r?\n$/, '');
    if (!isMarkToDrop(block, content, `${file}:${index + 1}`)) kept.push(line);
    block = nextBlock(block, content, index);
  });
  return kept.join('');
}

const inWhitelist = (path: string): boolean => WHITELIST.some((entry) => (entry.endsWith('/') ? path.startsWith(entry) : path === entry));

export async function listSources(repoRoot: string): Promise<string[]> {
  const result = await git(repoRoot, ['ls-files', '--cached', '--others', '--exclude-standard', '-z']);
  if (result.code !== 0) throw new BuildError(`git ls-files falló en ${repoRoot}: ${result.stderr.trim()}`);
  return result.stdout.split('\0').filter((path) => path !== '' && inWhitelist(path)).sort();
}

export function buildDist(repoRoot: string, files: string[], outDir: string): void {
  for (const file of files) {
    const source = join(repoRoot, file);
    if (!existsSync(source)) continue;
    const target = join(outDir, file);
    mkdirSync(dirname(target), { recursive: true });
    if (file.endsWith('.md')) writeFileSync(target, stripMarks(readFileSync(source, 'utf8'), file));
    else copyFileSync(source, target);
  }
}

function relativeFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root, { recursive: true, encoding: 'utf8' })
    .filter((path) => statSync(join(root, path)).isFile())
    .map((path) => path.replaceAll('\\', '/'));
}

function removeEmptyDirs(dir: string): void {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) continue;
    removeEmptyDirs(path);
    if (readdirSync(path).length === 0) rmdirSync(path);
  }
}

export function syncDir(from: string, to: string): void {
  const wanted = relativeFiles(from);
  for (const path of wanted) {
    const content = readFileSync(join(from, path));
    const target = join(to, path);
    if (existsSync(target) && readFileSync(target).equals(content)) continue;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
  const keep = new Set(wanted);
  for (const path of relativeFiles(to)) if (!keep.has(path)) rmSync(join(to, path));
  removeEmptyDirs(to);
}

export async function buildInto(repoRoot: string, distDir: string): Promise<void> {
  const files = await listSources(repoRoot);
  const staging = mkdtempSync(join(tmpdir(), 'sdd-dist-'));
  try {
    buildDist(repoRoot, files, staging);
    mkdirSync(distDir, { recursive: true });
    syncDir(staging, distDir);
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) {
  const root = resolve(import.meta.dirname, '..');
  try {
    await buildInto(root, join(root, 'dist'));
    console.log(`dist/: ${relativeFiles(join(root, 'dist')).length} ficheros desde ${relative(process.cwd(), root) || '.'}`);
  } catch (error) {
    if (!(error instanceof BuildError)) throw error;
    console.error(error.message);
    process.exitCode = 1;
  }
}
