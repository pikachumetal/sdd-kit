import { basename, extname } from 'node:path';

interface Family {
  line: string[];
  blocks: [open: string, close: string][];
  strings: string[];
  multilineStrings: string[];
  lineNeedsSpaceBefore?: boolean;
}

// shortcut: un literal regex de JS o un apóstrofo en shell o YAML abren una cadena hasta el fin de línea y un comentario detrás se pierde; pide un parser por lenguaje si el revisor echa de menos casos.
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

function commentSpans(source: string, family: Family): [start: number, end: number][] {
  const spans: [number, number][] = [];
  let index = 0;
  while (index < source.length) {
    const block = family.blocks.find(([open]) => source.startsWith(open, index));
    const end = block ? endOfBlock(source, index + block[0].length, block[1]) : opensLineComment(source, index, family) ? endOfLine(source, index) : null;
    if (end !== null) spans.push([index, end]);
    index = end ?? stringEnd(source, index, family) ?? index + 1;
  }
  return spans;
}

export function commentLinesOf(path: string, source: string): Map<number, string> | null {
  const family = familyOf(path);
  if (family === null) return null;
  const spans = commentSpans(source, family);
  const comments = new Map<number, string>();
  let lineStart = 0;
  source.split('\n').forEach((text, index) => {
    const lineEnd = lineStart + text.length;
    if (spans.some(([start, end]) => start <= lineEnd && end > lineStart)) comments.set(index + 1, text.trim());
    lineStart = lineEnd + 1;
  });
  return comments;
}
