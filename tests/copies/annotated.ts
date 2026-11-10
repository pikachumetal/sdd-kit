// La fuente anotada de una copia frente a su original: sus marcas, sus bloques y cada diferencia que no lleva marca.
import { INCLUDE_MARK, nextBlock, stripMarks, WHOLE_LINE_MARK, type Block as Region } from '../../build/dist.ts';
import { abbreviate } from '../upstream/clones.ts';

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
  fenced: boolean;
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
const ABSOLUTE = /\b(only|never|always|must|every)\b/i;
const QUOTE_INSIDE = /[«»]|-->/;
const OVERCITE_RUN = 2;
const SHINGLE = 6;
const MIN_KEPT = 50;
const EAT_RUN = 2;

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
  ownNow: (kept: number, path: string): string => `conserva el ${kept} % de su original ${path}; por debajo del ${MIN_KEPT} % es propia: pásala a own`,
  includeOutside: 'una inclusión en una copia va dentro de un bloque del kit',
  includeFenced: 'una inclusión va en el texto, fuera de un bloque de código',
  eats: (count: number, first: string): string =>
    `el bloque lleva ${count} líneas seguidas del original en su sitio, desde «${abbreviate(first)}»: ciérralo con <!-- kit: fin --> antes de ellas`,
};

export function formatProblem(problem: Problem): string {
  const where = problem.line === undefined ? problem.file : `${problem.file}:${problem.line}`;
  return `${where}: ${problem.message}${problem.fixes ? ` → ${problem.fixes}` : ''}`;
}

const words = (text: string): string[] => text.split(/\s+/).filter(Boolean);
const normalize = (text: string): string => words(text).join(' ');

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

export function kitBlockLines(file: string, annotated: string): Set<number> {
  const kit = new Set<number>();
  for (const block of new Reader(file, annotated).read().blocks) {
    if (block.mark.kind === 'quita') continue;
    for (let index = block.index + 1; index <= block.last; index++) kit.add(index);
  }
  return kit;
}

// Para cada línea, si la siguiente marca de línea entera es fin: un bloque con fin cruza sus líneas en blanco.
function finAhead(all: string[]): boolean[] {
  const ahead = new Array<boolean>(all.length).fill(false);
  let next = false;
  for (let index = all.length - 1; index >= 0; index--) {
    ahead[index] = next;
    if (WHOLE_LINE_MARK.test(all[index]) && !INCLUDE_MARK.test(all[index])) next = 'fin' in parseMark(all[index]);
  }
  return ahead;
}

class Reader {
  readonly result: Annotated;
  private readonly file: string;
  private readonly finAhead: boolean[];
  private open: KitBlock | null = null;

  constructor(file: string, text: string) {
    this.file = file;
    this.result = { lines: lines(text), text: [], blocks: [], problems: [] };
    this.finAhead = finAhead(this.result.lines);
  }

  read(): Annotated {
    let region: Region = this.result.lines[0]?.trimEnd() === '---' ? 'frontmatter' : 'text';
    this.result.lines.forEach((line, index) => {
      const next = nextBlock(region, line, index);
      if (typeof region === 'object' && next === 'text' && this.open?.fenced) this.close(index - 1);
      if (region !== 'frontmatter') this.take(line, index, region === 'text');
      region = next;
    });
    this.close(this.result.lines.length - 1);
    return this.result;
  }

  private problem(index: number, message: string, fixes?: string): void {
    this.result.problems.push({ file: this.file, line: index + 1, message, fixes });
  }

  private take(line: string, index: number, inText: boolean): void {
    if (INCLUDE_MARK.test(line)) return this.takeInclude(line, index, inText);
    if (WHOLE_LINE_MARK.test(line)) return this.takeMark(line, index, !inText);
    if (!this.open) this.result.text.push({ index, text: line });
    else if (inText && line.trim() === '' && !this.finAhead[index]) this.close(index);
    else this.open.content.push(line);
  }

  // Una inclusión no abre ni cierra bloque: es una línea más del bloque abierto, que el build expande.
  private takeInclude(line: string, index: number, inText: boolean): void {
    if (!inText) return this.problem(index, MESSAGES.includeFenced);
    if (!this.open) return this.problem(index, MESSAGES.includeOutside);
    this.open.content.push(line);
  }

  private takeMark(line: string, index: number, fenced: boolean): void {
    const hadOpen = this.open !== null;
    this.close(index - 1);
    const parsed = parseMark(line);
    if ('error' in parsed) return this.problem(index, parsed.error);
    if ('fin' in parsed) {
      if (!hadOpen) this.problem(index, MESSAGES.orphanEnd);
      return;
    }
    this.open = { mark: parsed.mark, index, last: index, content: [], fenced };
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
export function lcsPairs(a: string[], b: string[]): [number, number][] {
  const table = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
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

function report(context: Context, problem: Omit<Problem, 'file'>): void {
  context.problems.push({ file: context.input.file, ...problem });
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

function checkCite(context: Context, block: KitBlock, state: CiteState): boolean {
  const { mark } = block;
  const cite = mark.cite ?? '';
  const fail = (message: string): boolean => {
    report(context, { line: block.index + 1, message, fixes: mark.fixes });
    return false;
  };
  if (!citePattern(cite).test(context.original)) return fail(MESSAGES.stale(mark, context.input.label));
  const fragments = fragmentsOf(cite);
  const resaid = MESSAGES.resaid(mark, fragments.length > 1 ? `${fragments[0]}…` : cite, fragments[0]);
  const pattern = new RegExp(citePattern(cite).source, 'g');
  pattern.lastIndex = state.cursor;
  const match = pattern.exec(state.removedText);
  const indexes = match ? spanWords(state.removedWords, match.index, match.index + match[0].length) : [];
  if (indexes.length > 0 && indexes.every((index) => state.kept.has(index))) return fail(resaid);
  if (!match || overcites(indexes, state.kept)) return fail(MESSAGES.mismatch(mark, strictRemoved(state.removedWords, state.kept)));
  indexes.forEach((index) => state.covered.add(index));
  state.cursor = match.index + match[0].length;
  return true;
}

// La racha más larga de líneas con texto que el bloque repite seguidas del tramo que quita su sitio.
function eatenRun(content: string[], removed: string[]): { count: number; first: string } {
  const [kit, gone] = [content.filter((line) => !isBlank(line)), removed.filter((line) => !isBlank(line))];
  let best = { count: 0, first: '' };
  for (let i = 0; i < kit.length; i++)
    for (let j = 0; j < gone.length; j++) {
      let count = 0;
      while (i + count < kit.length && kit[i + count] === gone[j + count]) count++;
      if (count > best.count) best = { count, first: kit[i] };
    }
  return best;
}

function checkEaten(context: Context, block: KitBlock, removed: string[]): void {
  if (block.mark.kind === 'quita') return;
  const run = eatenRun(block.content, removed);
  if (run.count >= EAT_RUN) report(context, { line: block.index + 1, message: MESSAGES.eats(run.count, run.first), fixes: block.mark.fixes });
}

// Una marca con un rojo de su cita ya lo dice: la racha solo habla de las que no tienen otro.
function checkSite(context: Context, site: Site): void {
  checkCites(context, site);
  const reported = new Set(context.problems.map((problem) => problem.line));
  for (const block of site.blocks) if (!reported.has(block.index + 1)) checkEaten(context, block, site.removed);
}

function checkCites(context: Context, site: Site): void {
  const removedWords = words(site.removed.join(' '));
  const contentWords = words(site.blocks.flatMap((block) => block.content).join(' '));
  const cited = site.blocks.filter((block) => block.mark.cite !== undefined);
  const kept = new Set(lcsPairs(removedWords, contentWords).map(([index]) => index));
  if (cited.length === 0) {
    if (kept.size < removedWords.length) report(context, { line: site.prior, message: MESSAGES.missing(strictRemoved(removedWords, kept)) });
    return;
  }
  const state: CiteState = { removedWords, removedText: removedWords.join(' '), kept, covered: new Set(), cursor: 0 };
  if (!cited.every((block) => checkCite(context, block, state))) return;
  const uncovered = removedWords.filter((_, index) => !state.covered.has(index));
  if (isSubsequence(uncovered, contentWords)) return;
  const [first] = cited;
  report(context, { line: first.index + 1, message: MESSAGES.mismatch(first.mark, strictRemoved(removedWords, kept)), fixes: first.mark.fixes });
}

function checkBlock(context: Context, annotated: Annotated, block: KitBlock): void {
  const { mark } = block;
  const line = block.index + 1;
  if (mark.kind === 'sustituye' && block.content.every((text) => text.trim() === '')) report(context, { line, message: MESSAGES.empty, fixes: mark.fixes });
  if (mark.de !== undefined) checkFragment(context, block);
  if (mark.kind !== 'add' || block.content.length === 0) return;
  const word = absoluteNear(annotated, block);
  if (word) report(context, { line, message: MESSAGES.absolute(word), fixes: mark.fixes });
}

function checkFragment(context: Context, block: KitBlock): void {
  const de = block.mark.de ?? '';
  const fragment = context.input.fragments.get(de);
  const line = block.index + 1;
  if (fragment === undefined) report(context, { line, message: MESSAGES.foreign(de), fixes: block.mark.fixes });
  else if (!normalize(fragment).includes(normalize(block.content.join(' ')))) report(context, { line, message: MESSAGES.notInFragment(de), fixes: block.mark.fixes });
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

const isBlank = (line: string): boolean => line.trim() === '';

// Ancla en las líneas con texto: una línea en blanco tras un bloque no parte en dos lo que el bloque quita.
function anchorPairs(texts: string[], original: string[]): [number, number][] {
  const keep = (lines: string[]): number[] => lines.flatMap((line, index) => (isBlank(line) ? [] : [index]));
  const [a, b] = [keep(texts), keep(original)];
  return lcsPairs(a.map((index) => texts[index]), b.map((index) => original[index])).map(([i, j]) => [a[i], b[j]]);
}

function blankPairs(texts: string[], original: string[], anchors: [number, number][]): [number, number][] {
  const pairs: [number, number][] = [];
  const bounds = [[-1, -1], ...anchors, [texts.length, original.length]];
  for (let k = 1; k < bounds.length; k++) {
    const between = (lines: string[], from: number, to: number): number[] => lines.flatMap((line, index) => (index > from && index < to && isBlank(line) ? [index] : []));
    const [a, b] = [between(texts, bounds[k - 1][0], bounds[k][0]), between(original, bounds[k - 1][1], bounds[k][1])];
    a.slice(0, b.length).forEach((index, n) => pairs.push([index, b[n]]));
  }
  return pairs;
}

function sitesOf(annotated: Annotated, original: string[]): Site[] {
  const texts = annotated.text.map((line) => line.text);
  const pairs = [[-1, -1], ...anchorPairs(texts, original), [texts.length, original.length]];
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
  const texts = annotated.text.map((line) => line.text);
  const anchors = anchorPairs(texts, original);
  const matched = new Set([...anchors, ...blankPairs(texts, original, anchors)].map(([index]) => index));
  return annotated.text.filter((_, index) => !matched.has(index)).map((line) => line.index + 1);
}

const byLine = (a: Problem, b: Problem): number => (a.line ?? 0) - (b.line ?? 0);

export function checkCopy(input: CopyInput): Problem[] {
  if (input.annotated.includes('\r')) return [{ file: input.file, message: MESSAGES.crlf }];
  const conflicts = conflictProblems(input.file, lines(input.annotated));
  if (conflicts.length > 0) return conflicts;
  const annotated = new Reader(input.file, input.annotated).read();
  const original = withoutFrontmatter(lines(input.original.replace(/\r\n/g, '\n')));
  const context: Context = { input, original: normalize(original.join(' ')), problems: [...annotated.problems] };
  for (const line of unmatchedLines(annotated, original)) report(context, { line, message: MESSAGES.unmarked });
  for (const site of sitesOf(annotated, original)) checkSite(context, site);
  for (const block of annotated.blocks) checkBlock(context, annotated, block);
  return context.problems.sort(byLine);
}

export type IndexEol = 'lf' | 'crlf' | 'mixed' | 'none' | '-text';

// El índice de git decide si una copia tiene CRLF; el disco, qué texto se compara. Un checkout anterior a
// `eol=lf` con autocrlf guarda LF en el índice y CRLF en el disco: esa copia está limpia (feature 0311).
export function eolVerdict(indexEol: IndexEol | undefined, text: string): { problem: 'crlf' } | { text: string } {
  if (indexEol === 'crlf' || indexEol === 'mixed') return { problem: 'crlf' };
  if (indexEol === 'lf') return { text: text.replace(/\r\n/g, '\n') };
  return text.includes('\r') ? { problem: 'crlf' } : { text };
}

export function checkVerbatim({ file, annotated, original, label }: Omit<CopyInput, 'fragments'>): Problem[] {
  if (annotated.includes('\r')) return [{ file, message: MESSAGES.crlf }];
  return annotated === original.replace(/\r\n/g, '\n') ? [] : [{ file, message: MESSAGES.notVerbatim(label) }];
}

export function copyShareProblem({ file, output, original, path }: { file: string; output: string; original: string; path: string }): Problem | null {
  const kept = keptShare(output, original);
  return kept >= MIN_KEPT ? null : { file, message: MESSAGES.ownNow(kept, path) };
}

// Los marcadores de git merge-file se buscan en todo el fichero, también en el frontmatter y en una valla: allí no los vería nadie más.
function conflictProblems(file: string, all: string[]): Problem[] {
  const problems: Problem[] = [];
  let open = false;
  all.forEach((line, index) => {
    const opens = line.startsWith('<<<<<<< ');
    const closes = open && line.startsWith('>>>>>>> ');
    if (opens || closes || (open && line === '=======')) problems.push({ file, line: index + 1, message: MESSAGES.conflict });
    if (opens) open = true;
    if (closes) open = false;
  });
  return problems;
}

export function splitFrontmatter(text: string): { front: string; body: string } {
  const all = text.replace(/\r\n/g, '\n').split(/(?<=\n)/);
  const close = all[0]?.trimEnd() === '---' ? all.findIndex((line, index) => index > 0 && line.trimEnd() === '---') : -1;
  return close < 0 ? { front: '', body: all.join('') } : { front: all.slice(0, close + 1).join(''), body: all.slice(close + 1).join('') };
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
