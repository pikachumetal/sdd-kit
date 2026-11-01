import { basename, extname } from 'node:path';

interface Family {
  line: string[];
  blocks: [open: string, close: string][];
  strings: string[];
  multilineStrings: string[];
  lineNeedsSpaceBefore?: boolean;
}

type Span = [start: number, end: number];

export interface CommentLine {
  text: string;
  comment: string;
}

// shortcut: no entiende literales regex de JS (un «\//» abre un comentario falso), lifetimes de Rust, cadenas verbatim de C#, el «#» de PHP ni un apóstrofo en shell o YAML, que abre una cadena hasta el fin de línea y pierde el comentario de detrás; pide un parser por lenguaje si el revisor echa de menos casos.
const C_LIKE: Family = { line: ['//'], blocks: [['/*', '*/']], strings: ['"', "'"], multilineStrings: ['`'] };
const CSS: Family = { line: [], blocks: [['/*', '*/']], strings: ['"', "'"], multilineStrings: [] };
const HASH: Family = { line: ['#'], blocks: [], strings: ['"', "'"], multilineStrings: [], lineNeedsSpaceBefore: true };
// shortcut: un docstring es una cadena y no se lista; pide distinguirlo de una asignación si hacen falta los docstrings.
const PYTHON: Family = { ...HASH, multilineStrings: ['"""', "'''"] };
const POWERSHELL: Family = { ...HASH, blocks: [['<#', '#>']] };
const SQL: Family = { line: ['--'], blocks: [['/*', '*/']], strings: ["'"], multilineStrings: [] };
// shortcut: no se lee el <script> de una página; pide separar sus bloques si llega a importar.
const MARKUP: Family = { line: [], blocks: [['<!--', '-->']], strings: [], multilineStrings: [] };
const RAZOR: Family = { ...MARKUP, blocks: [['<!--', '-->'], ['@*', '*@']] };

const FAMILY_EXTENSIONS: [Family, string[]][] = [
  [C_LIKE, ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'cs', 'java', 'kt', 'go', 'rs', 'swift', 'c', 'h', 'cpp', 'hpp', 'php', 'scss', 'less']],
  [CSS, ['css']],
  [HASH, ['rb', 'sh', 'bash', 'yml', 'yaml', 'toml']],
  [PYTHON, ['py']],
  [POWERSHELL, ['ps1']],
  [SQL, ['sql']],
  [MARKUP, ['html', 'xml', 'csproj']],
  [RAZOR, ['cshtml', 'razor']],
];
const BY_EXTENSION = new Map(FAMILY_EXTENSIONS.flatMap(([family, extensions]) => extensions.map((extension) => [extension, family] as const)));
const BY_NAME = new Map([['Dockerfile', HASH], ['Makefile', HASH]]);

function familyOf(path: string): Family | null {
  return BY_NAME.get(basename(path)) ?? BY_EXTENSION.get(extname(path).slice(1).toLowerCase()) ?? null;
}

export const hasLexer = (path: string): boolean => familyOf(path) !== null;

function endOfLine(source: string, from: number): number {
  const newline = source.indexOf('\n', from);
  return newline === -1 ? source.length : newline;
}

function endOfBlock(source: string, from: number, close: string): number {
  const at = source.indexOf(close, from);
  return at === -1 ? source.length : at + close.length;
}

function endOfString(source: string, from: number, delimiter: string, multiline: boolean): number {
  let index = from;
  while (index < source.length) {
    if (source.startsWith(delimiter, index)) return index + delimiter.length;
    if (!multiline && source[index] === '\n') return index;
    index += source[index] === '\\' ? 2 : 1;
  }
  return source.length;
}

function stringEnd(source: string, index: number, family: Family): number | null {
  const multiline = family.multilineStrings.find((delimiter) => source.startsWith(delimiter, index));
  if (multiline) return endOfString(source, index + multiline.length, multiline, true);
  const single = family.strings.find((delimiter) => source.startsWith(delimiter, index));
  return single ? endOfString(source, index + single.length, single, false) : null;
}

function opensLineComment(source: string, index: number, family: Family): boolean {
  if (!family.line.some((token) => source.startsWith(token, index))) return false;
  return !family.lineNeedsSpaceBefore || index === 0 || /\s/.test(source[index - 1]);
}

function commentEnd(source: string, index: number, family: Family): number | null {
  const block = family.blocks.find(([open]) => source.startsWith(open, index));
  if (block) return endOfBlock(source, index + block[0].length, block[1]);
  return opensLineComment(source, index, family) ? endOfLine(source, index) : null;
}

function commentSpans(source: string, family: Family): Span[] {
  const spans: Span[] = [];
  let index = 0;
  while (index < source.length) {
    const end = commentEnd(source, index, family);
    if (end !== null) spans.push([index, end]);
    index = end ?? stringEnd(source, index, family) ?? index + 1;
  }
  return spans;
}

function commentOfLine(source: string, spans: Span[], [lineStart, lineEnd]: Span): string {
  return spans
    .map(([start, end]) => source.slice(Math.max(start, lineStart), Math.min(end, lineEnd)).trim())
    .join(' ');
}

export function commentLinesOf(path: string, source: string): Map<number, CommentLine> | null {
  const family = familyOf(path);
  if (family === null) return null;
  const spans = commentSpans(source, family);
  const comments = new Map<number, CommentLine>();
  let first = 0;
  let lineStart = 0;
  source.split('\n').forEach((text, index) => {
    const lineEnd = lineStart + text.length;
    while (first < spans.length && spans[first][1] <= lineStart) first++;
    let past = first;
    while (past < spans.length && spans[past][0] <= lineEnd) past++;
    if (past > first) comments.set(index + 1, { text: text.trim(), comment: commentOfLine(source, spans.slice(first, past), [lineStart, lineEnd]) });
    lineStart = lineEnd + 1;
  });
  return comments;
}
