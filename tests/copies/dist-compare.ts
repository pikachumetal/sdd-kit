// Uso: node tests/copies/dist-compare.ts [--base <ref>] <ruta de dist/>… (moon run kit:dist-compare), desde la raíz del repo.
// Compara cada fichero con el de la referencia (develop por defecto) dos veces: por párrafos, con los espacios
// normalizados, y por su forma, la sangría y las líneas en blanco byte a byte.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { nextBlock, type Block } from '../../build/dist.ts';
import { git } from '../../cli/src/git/git.ts';

interface Change<T> {
  sign: '-' | '+';
  item: T;
}

interface Token {
  key: string;
  line: number;
  text: string;
}

const DEFAULT_BASE = 'develop';
const ITEM = /^(\s*)([-*+]|\d+\.|\||>|#+)(\s|$)/;
const FENCE = /^(\s*)(`{3,}|~{3,})/;

const lf = (text: string): string => text.replace(/\r\n/g, '\n');

// LCS clásico; en un empate sale antes lo que quita la referencia, como en git diff.
function lcsChanges<T>(a: T[], b: T[], same: (x: T, y: T) => boolean): Change<T>[] {
  const t = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) t[i][j] = same(a[i], b[j]) ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
  const changes: Change<T>[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && same(a[i], b[j])) (i++, j++);
    else if (i < a.length && (j === b.length || t[i + 1][j] >= t[i][j + 1])) changes.push({ sign: '-', item: a[i++] });
    else changes.push({ sign: '+', item: b[j++] });
  }
  return changes;
}

const paragraphs = (text: string): string[] =>
  lf(text)
    .split(/\n[ \t]*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

export function paragraphDiff(base: string, now: string): string[] {
  return lcsChanges(paragraphs(base), paragraphs(now), (x, y) => x === y).map(({ sign, item }) => `  ${sign} ${item}`);
}

function lineKey(block: Block, next: Block, content: string): string {
  const fence = FENCE.exec(content);
  if (typeof block === 'object') return next === 'text' ? `fence:${fence?.[0] ?? content}` : `code:${/^\s*/.exec(content)?.[0]}`;
  if (typeof next === 'object') return `fence:${fence?.[0] ?? content}`;
  if (content.trim() === '') return `blank:${content}`;
  const item = ITEM.exec(content);
  return item ? `item:${item[1]}${item[2]}` : `text:${/^\s*/.exec(content)?.[0]}`;
}

// Las líneas seguidas de un párrafo con la misma sangría son un solo token: así no cuentan los saltos de línea.
function shapeTokens(text: string): Token[] {
  const tokens: Token[] = [];
  let block: Block = 'text';
  let previous = '';
  const all = lf(text).split('\n');
  if (all.at(-1) === '') all.pop();
  all.forEach((content, index) => {
    const next = nextBlock(block, content, index);
    const key = lineKey(block, next, content);
    if (!(key.startsWith('text:') && key === previous)) tokens.push({ key, line: index + 1, text: content });
    previous = key;
    block = next;
  });
  return tokens;
}

export function shapeDiff(base: string, now: string, ref: string): string[] {
  return lcsChanges(shapeTokens(base), shapeTokens(now), (x, y) => x.key === y.key).map(({ sign, item }) =>
    sign === '-' ? `  - ${ref}:${item.line} «${item.text}»` : `  + ${item.line} «${item.text}»`,
  );
}

async function atRef(ref: string, path: string): Promise<string> {
  const shown = await git(process.cwd(), ['show', `${ref}:${path}`]);
  return shown.code === 0 ? shown.stdout : '';
}

async function compareFile(ref: string, path: string): Promise<string[]> {
  const [base, now] = [await atRef(ref, path), existsSync(path) ? readFileSync(path, 'utf8') : ''];
  const words = paragraphDiff(base, now);
  const shape = shapeDiff(base, now, ref);
  if (words.length + shape.length === 0) return [`${path}: igual`];
  return [
    ...(words.length > 0 ? [`${path}: ${words.length} párrafos distintos`, ...words] : []),
    ...(shape.length > 0 ? [`${path}: ${shape.length} líneas con otra forma`, ...shape] : []),
  ];
}

async function main(argv: string[]): Promise<number> {
  const at = argv.indexOf('--base');
  const ref = at >= 0 ? argv.splice(at, 2)[1] : DEFAULT_BASE;
  if ((await git(process.cwd(), ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`])).code !== 0) {
    console.error(`kit:dist-compare: la referencia ${ref} no existe: usa --base <ref>`);
    return 1;
  }
  let changed = 0;
  for (const path of argv) {
    const lines = await compareFile(ref, path);
    if (!lines[0].endsWith(': igual')) changed++;
    console.log(lines.join('\n'));
  }
  return changed > 0 ? 1 : 0;
}

if (resolve(process.argv[1] ?? '') === import.meta.filename) process.exitCode = await main(process.argv.slice(2));
