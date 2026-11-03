// La fuente anotada de una copia frente a su original: sus marcas, sus bloques y cada diferencia que no lleva marca.
import { nextBlock, stripMarks, WHOLE_LINE_MARK, type Block as Region } from '../../build/dist.ts';

export interface Problem {
  file: string;
  line?: number;
  message: string;
  fixes?: string;
}

export interface CopyInput {
  file: string;
  annotated: string;
  original: string;
  label: string;
  fragments: Map<string, string>;
}

type Kind = 'add' | 'sustituye' | 'quita';

interface Mark {
  task: string;
  kind: Kind;
  cite?: string;
  de?: string;
  fixes?: string;
}

interface KitBlock {
  mark: Mark;
  index: number;
  last: number;
  content: string[];
}

interface TextLine {
  index: number;
  text: string;
}

interface Annotated {
  lines: string[];
  text: TextLine[];
  blocks: KitBlock[];
  problems: Problem[];
}

type Parsed = { fin: true } | { mark: Mark } | { error: string };

const TASK = /^(\d{4}|[0-9a-f]{7,40})$/;
const FIELD = /^(sustituye|quita|de|arregla): (.*)$/;
const CONFLICT = /^(<{7}|={7}|>{7})( |$)/;
const ABSOLUTE = /\b(only|never|always|must|every)\b/i;
const QUOTE_INSIDE = /[«»]|-->/;
const ABBREVIATE_AFTER = 6;
const OVERCITE_RUN = 2;
const SHINGLE = 6;

const MESSAGES = {
  unmarked: 'texto que no es del original ni está en un bloque del kit',
  missing: (removed: string): string => `falta texto del original sin marca quita: «${abbreviate(removed)}»`,
  mismatch: (mark: Mark, removed: string): string => `la marca ${mark.kind} «${mark.cite}», y el bloque quita «${abbreviate(removed)}»`,
  resaid: (mark: Mark, shown: string, fragment: string): string => `la marca ${mark.kind} «${shown}», y el bloque vuelve a decir «${fragment}»`,
  stale: (mark: Mark, label: string): string => `la marca ${mark.kind} «${mark.cite}», que no está en el original ${label}: la marca es vieja`,
  absolute: (word: string): string => `añadido del kit sin sustituye en un párrafo con una absoluta del original («${word}»)`,
  badField: (field: string): string => `marca del kit sin tarea o con un campo desconocido: ${field}`,
  empty: 'la marca sustituye no tiene contenido: para quitar sin sustituir, usa quita',
  orphanEnd: '<!-- kit: fin --> sin bloque abierto',
  quoted: 'la cita de la marca no puede llevar «, » ni -->: sáltalos con …',
  foreign: (de: string): string => `el bloque dice de ${de}, que no está en el from de su entrada`,
  notInFragment: (de: string): string => `el bloque dice de ${de}, y su texto no está en ese original`,
  conflict: 'conflicto de git merge-file sin resolver',
  crlf: 'tiene finales de línea CRLF; la fuente de una copia va en LF',
  notVerbatim: (label: string): string => `no es su original ${label} byte a byte`,
};

export function formatProblem(problem: Problem): string {
  const where = problem.line === undefined ? problem.file : `${problem.file}:${problem.line}`;
  return `${where}: ${problem.message}${problem.fixes ? ` → ${problem.fixes}` : ''}`;
}

const words = (text: string): string[] => text.split(/\s+/).filter(Boolean);
const normalize = (text: string): string => words(text).join(' ');

function abbreviate(text: string): string {
  const all = words(text);
  return all.length > ABBREVIATE_AFTER ? `${all.slice(0, ABBREVIATE_AFTER).join(' ')}…` : all.join(' ');
}

function lines(text: string): string[] {
  const all = text.split('\n');
  if (all.at(-1) === '') all.pop();
  return all;
}

function splitFields(inner: string): string[] {
  const fields: string[] = [];
  let quoted = 0;
  let current = '';
  for (let index = 0; index < inner.length; index++) {
    if (inner[index] === '«') quoted++;
    if (inner[index] === '»') quoted = Math.max(0, quoted - 1);
    if (quoted === 0 && inner.startsWith(' · ', index)) {
      fields.push(current);
      current = '';
      index += 2;
    } else current += inner[index];
  }
  return [...fields, current].map((field) => field.trim());
}

function applyField(mark: Mark, name: string, value: string): string | null {
  if (name === 'arregla') mark.fixes = value;
  else if (name === 'de') mark.de = value;
  else {
    const cite = /^«(.*)»$/.exec(value)?.[1];
    if (cite === undefined) return MESSAGES.badField(name);
    if (QUOTE_INSIDE.test(cite)) return MESSAGES.quoted;
    mark.kind = name as Kind;
    mark.cite = cite;
  }
  return null;
}

function parseMark(line: string): Parsed {
  const inner = /<!-- kit:(.*)-->/.exec(line)?.[1].trim() ?? '';
  if (inner === 'fin') return { fin: true };
  const [task, ...fields] = splitFields(inner);
  if (!TASK.test(task)) return { error: MESSAGES.badField(task) };
  const mark: Mark = { task, kind: 'add' };
  for (const field of fields) {
    const match = FIELD.exec(field);
    const error = match ? applyField(mark, match[1], match[2].trim()) : MESSAGES.badField(field.split(':')[0]);
    if (error) return { error };
  }
  return { mark };
}

export function markTask(line: string): string | null {
  if (!WHOLE_LINE_MARK.test(line)) return null;
  const parsed = parseMark(line);
  return 'mark' in parsed ? parsed.mark.task : null;
}

export const outputOf = (annotated: string): string => stripMarks(annotated, 'fuente anotada');

class Reader {
  readonly result: Annotated;
  private readonly file: string;
  private open: KitBlock | null = null;

  constructor(file: string, text: string) {
    this.file = file;
    this.result = { lines: lines(text), text: [], blocks: [], problems: [] };
  }

  read(): Annotated {
    let region: Region = this.result.lines[0]?.trimEnd() === '---' ? 'frontmatter' : 'text';
    this.result.lines.forEach((line, index) => {
      if (region !== 'frontmatter') this.take(line, index, region === 'text');
      region = nextBlock(region, line, index);
    });
    this.close(this.result.lines.length - 1);
    return this.result;
  }

  private problem(index: number, message: string, fixes?: string): void {
    this.result.problems.push({ file: this.file, line: index + 1, message, fixes });
  }

  private take(line: string, index: number, inText: boolean): void {
    if (inText && CONFLICT.test(line)) this.problem(index, MESSAGES.conflict);
    if (inText && WHOLE_LINE_MARK.test(line)) return this.takeMark(line, index);
    if (!this.open) return void this.result.text.push({ index, text: line });
    if (inText && line.trim() === '') return this.close(index);
    this.open.content.push(line);
  }

  private takeMark(line: string, index: number): void {
    const hadOpen = this.open !== null;
    this.close(index - 1);
    const parsed = parseMark(line);
    if ('error' in parsed) return this.problem(index, parsed.error);
    if ('fin' in parsed) return hadOpen ? undefined : this.problem(index, MESSAGES.orphanEnd);
    this.open = { mark: parsed.mark, index, last: index, content: [] };
    if (parsed.mark.kind === 'quita') this.close(index);
  }

  private close(last: number): void {
    if (!this.open) return;
    this.open.last = Math.max(last, this.open.index);
    this.result.blocks.push(this.open);
    this.open = null;
  }
}

// LCS clásico; en un empate casa la primera pareja posible, así gana el alineado que casa antes en el original.
function lcsPairs(a: string[], b: string[]): [number, number][] {
  const table = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--) table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const pairs: [number, number][] = [];
  for (let i = 0, j = 0; i < a.length && j < b.length; ) {
    if (a[i] === b[j] && table[i][j] === table[i + 1][j + 1] + 1) pairs.push([i++, j++]);
    else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

const isSubsequence = (needle: string[], haystack: string[]): boolean => lcsPairs(needle, haystack).length === needle.length;

function withoutFrontmatter(all: string[]): string[] {
  if (all[0]?.trimEnd() !== '---') return all;
  const close = all.findIndex((line, index) => index > 0 && line.trimEnd() === '---');
  return close < 0 ? all : all.slice(close + 1);
}

function fragmentsOf(cite: string): string[] {
  return cite.split('…').map(normalize).filter(Boolean);
}

const escape = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const citePattern = (cite: string): RegExp => new RegExp(fragmentsOf(cite).map(escape).join('[\\s\\S]*?'));

interface Site {
  removed: string[];
  blocks: KitBlock[];
  prior: number;
}

interface Context {
  input: CopyInput;
  original: string;
  problems: Problem[];
}

function report(context: Context, line: number, message: string, fixes?: string): void {
  context.problems.push({ file: context.input.file, line, message, fixes });
}

function wordOffsets(removedWords: string[]): number[] {
  const offsets: number[] = [];
  let at = 0;
  for (const word of removedWords) {
    offsets.push(at);
    at += word.length + 1;
  }
  return offsets;
}

function spanWords(removedWords: string[], start: number, end: number): number[] {
  const offsets = wordOffsets(removedWords);
  return offsets.map((offset, index) => index).filter((index) => offsets[index] < end && offsets[index] + removedWords[index].length > start);
}

function edgeRun(indexes: number[], kept: Set<number>): number {
  let run = 0;
  while (run < indexes.length && kept.has(indexes[run])) run++;
  return run;
}

function overcites(indexes: number[], kept: Set<number>): boolean {
  return edgeRun(indexes, kept) >= OVERCITE_RUN || edgeRun([...indexes].reverse(), kept) >= OVERCITE_RUN;
}

function strictRemoved(removedWords: string[], kept: Set<number>): string {
  const pieces: string[][] = [];
  removedWords.forEach((word, index) => {
    if (kept.has(index)) return;
    if (index === 0 || kept.has(index - 1) || pieces.length === 0) pieces.push([]);
    pieces.at(-1)?.push(word);
  });
  return pieces.map((piece) => piece.join(' ')).join('…');
}

interface CiteState {
  removedWords: string[];
  removedText: string;
  kept: Set<number>;
  covered: Set<number>;
  cursor: number;
}

function resaidFragment(mark: Mark, block: KitBlock): string | undefined {
  const content = normalize(block.content.join(' '));
  return fragmentsOf(mark.cite ?? '').find((fragment) => content.includes(fragment));
}

function checkCite(context: Context, block: KitBlock, state: CiteState): boolean {
  const { mark } = block;
  const line = block.index + 1;
  const fragments = fragmentsOf(mark.cite ?? '');
  if (!citePattern(mark.cite ?? '').test(context.original)) return report(context, line, MESSAGES.stale(mark, context.input.label), mark.fixes), false;
  const resaid = resaidFragment(mark, block);
  const shown = fragments.length > 1 ? `${fragments[0]}…` : (mark.cite ?? '');
  if (resaid) return report(context, line, MESSAGES.resaid(mark, shown, resaid), mark.fixes), false;
  const pattern = new RegExp(citePattern(mark.cite ?? '').source, 'g');
  pattern.lastIndex = state.cursor;
  const match = pattern.exec(state.removedText);
  const indexes = match ? spanWords(state.removedWords, match.index, match.index + match[0].length) : [];
  if (!match || overcites(indexes, state.kept)) return report(context, line, MESSAGES.mismatch(mark, strictRemoved(state.removedWords, state.kept)), mark.fixes), false;
  indexes.forEach((index) => state.covered.add(index));
  state.cursor = match.index + match[0].length;
  return true;
}

function checkSite(context: Context, site: Site): void {
  const removedWords = words(site.removed.join(' '));
  const contentWords = words(site.blocks.flatMap((block) => block.content).join(' '));
  const cited = site.blocks.filter((block) => block.mark.cite !== undefined);
  const kept = new Set(lcsPairs(removedWords, contentWords).map(([index]) => index));
  if (cited.length === 0) {
    if (kept.size < removedWords.length) report(context, site.prior, MESSAGES.missing(strictRemoved(removedWords, kept)));
    return;
  }
  const state: CiteState = { removedWords, removedText: removedWords.join(' '), kept, covered: new Set(), cursor: 0 };
  if (!cited.every((block) => checkCite(context, block, state))) return;
  const uncovered = removedWords.filter((_, index) => !state.covered.has(index));
  if (isSubsequence(uncovered, contentWords)) return;
  const [first] = cited;
  report(context, first.index + 1, MESSAGES.mismatch(first.mark, strictRemoved(removedWords, kept)), first.mark.fixes);
}

function checkBlock(context: Context, annotated: Annotated, block: KitBlock): void {
  const { mark } = block;
  const line = block.index + 1;
  if (mark.kind === 'sustituye' && block.content.every((text) => text.trim() === '')) report(context, line, MESSAGES.empty, mark.fixes);
  if (mark.de !== undefined) checkFragment(context, block);
  if (mark.kind !== 'add' || block.content.length === 0) return;
  const word = absoluteNear(annotated, block);
  if (word) report(context, line, MESSAGES.absolute(word), mark.fixes);
}

function checkFragment(context: Context, block: KitBlock): void {
  const de = block.mark.de ?? '';
  const fragment = context.input.fragments.get(de);
  if (fragment === undefined) return report(context, block.index + 1, MESSAGES.foreign(de), block.mark.fixes);
  if (!normalize(fragment).includes(normalize(block.content.join(' ')))) report(context, block.index + 1, MESSAGES.notInFragment(de), block.mark.fixes);
}

function absoluteNear(annotated: Annotated, block: KitBlock): string | undefined {
  const blank = (index: number): boolean => (annotated.lines[index] ?? '').trim() === '';
  let start = block.index;
  while (start > 0 && !blank(start - 1)) start--;
  let end = block.last;
  while (!blank(end) && end + 1 < annotated.lines.length && !blank(end + 1)) end++;
  const source = annotated.text.filter((line) => line.index >= start && line.index <= end);
  for (const line of source) {
    const word = ABSOLUTE.exec(line.text)?.[1];
    if (word) return word.toLowerCase();
  }
  return undefined;
}

function sitesOf(annotated: Annotated, original: string[]): Site[] {
  const texts = annotated.text.map((line) => line.text);
  const pairs = [[-1, -1], ...lcsPairs(texts, original), [texts.length, original.length]];
  const sites: Site[] = [];
  for (let k = 1; k < pairs.length; k++) {
    const [prevText, prevOriginal] = pairs[k - 1];
    const [nextText, nextOriginal] = pairs[k];
    const from = prevText < 0 ? -1 : annotated.text[prevText].index;
    const to = nextText >= texts.length ? Infinity : annotated.text[nextText].index;
    const blocks = annotated.blocks.filter((block) => block.index > from && block.index < to);
    sites.push({ removed: original.slice(prevOriginal + 1, nextOriginal), blocks, prior: from < 0 ? 1 : from + 1 });
  }
  return sites;
}

function unmatchedLines(annotated: Annotated, original: string[]): number[] {
  const matched = new Set(lcsPairs(annotated.text.map((line) => line.text), original).map(([index]) => index));
  return annotated.text.filter((_, index) => !matched.has(index)).map((line) => line.index + 1);
}

const byLine = (a: Problem, b: Problem): number => (a.line ?? 0) - (b.line ?? 0);

export function checkCopy(input: CopyInput): Problem[] {
  if (input.annotated.includes('\r')) return [{ file: input.file, message: MESSAGES.crlf }];
  const annotated = new Reader(input.file, input.annotated).read();
  const conflicts = annotated.problems.filter((problem) => problem.message === MESSAGES.conflict);
  if (conflicts.length > 0) return conflicts;
  const original = withoutFrontmatter(lines(input.original.replace(/\r\n/g, '\n')));
  const context: Context = { input, original: normalize(original.join(' ')), problems: [...annotated.problems] };
  for (const line of unmatchedLines(annotated, original)) report(context, line, MESSAGES.unmarked);
  for (const site of sitesOf(annotated, original)) checkSite(context, site);
  for (const block of annotated.blocks) checkBlock(context, annotated, block);
  return context.problems.sort(byLine);
}

export function checkVerbatim(file: string, kit: string, original: string, label: string): Problem[] {
  if (kit.includes('\r')) return [{ file, message: MESSAGES.crlf }];
  return kit === original.replace(/\r\n/g, '\n') ? [] : [{ file, message: MESSAGES.notVerbatim(label) }];
}

function shingles(text: string): Set<string> {
  const all = text.toLowerCase().replace(/[`*_>#|]/g, ' ').split(/\s+/).filter(Boolean);
  const set = new Set<string>();
  for (let index = 0; index + SHINGLE <= all.length; index++) set.add(all.slice(index, index + SHINGLE).join(' '));
  return set;
}

export function keptShare(output: string, original: string): number {
  const source = shingles(original);
  if (source.size === 0) return 100;
  const kit = shingles(output);
  let kept = 0;
  for (const shingle of source) if (kit.has(shingle)) kept++;
  return Math.round((100 * kept) / source.size);
}
