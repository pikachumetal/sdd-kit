import type { Block } from './parse.ts';
import { HEADER as NOW_NEXT_LATER_HEADER, kindOf } from './now-next-later.ts';
import { headerIs, openRows, rowsOf } from './tables.ts';
import type { Row } from './tables.ts';

export interface OverlapRow {
  id: string;
  line: number;
  open: boolean;
  paths: string[];
  after: string[];
  before: string[];
}

type OrderGraph = Map<string, Set<string>>;

const OPEN_STATES = ['⏳', '🔄'];
const ORDER = /(?<!\p{L})(tras|antes de) (?:(?:la|el) )?(\d{4}(?:(?:, | y | e )\d{4})*)/giu;
const TASK_ID = /\d{4}/g;
const QUOTED = /`([^`]+)`/g;
const NEXT_SECTION = 'Próximo';
const FILES_LABEL = 'Ficheros:';
const RELEASE_FILES_COLUMN = 3;
const WILDCARD_ID = '0000';
const TOUCHES_LABEL = '**Toca:**';
const BRIEF_END = '</details>';
const LAUNCHABLE_KINDS = ['Now', 'Next'];

function isOpenState(state: string): boolean {
  return OPEN_STATES.some((prefix) => state.startsWith(prefix));
}

function quotedPaths(text: string): string[] {
  return [...text.matchAll(QUOTED)]
    .map((match) => match[1].replace(/\\/g, '/').replace(/^\.\//, ''))
    .filter((token) => !/\s/.test(token) && /[/.]/.test(token));
}

function orderIds(text: string): Pick<OverlapRow, 'after' | 'before'> {
  const after: string[] = [];
  const before: string[] = [];
  for (const [, word, list] of text.matchAll(ORDER)) (word.toLowerCase() === 'tras' ? after : before).push(...(list.match(TASK_ID) ?? []));
  return { after, before };
}

function afterLastFilesLabel(text: string): string {
  const start = text.lastIndexOf(FILES_LABEL);
  return start === -1 ? '' : text.slice(start);
}

function twoPointRow(row: Row): OverlapRow {
  const inRelease = row.title !== NEXT_SECTION;
  const last = row.cells.length - 1;
  const orderCells = row.cells.filter((_, index) => index > 0 && index < last && !(inRelease && index === RELEASE_FILES_COLUMN));
  const filesText = inRelease ? (row.cells[RELEASE_FILES_COLUMN] ?? '') : afterLastFilesLabel(row.cells[1] ?? '');
  const base = { id: row.cells[0] ?? '', line: row.index + 1, open: isOpenState(row.cells.at(-1) ?? '') };
  return { ...base, paths: quotedPaths(filesText), ...orderIds(orderCells.join(' ')) };
}

export function twoPointOverlapRows(lines: string[], blocks: Block[]): OverlapRow[] {
  return openRows(lines, blocks).map(twoPointRow);
}

function touchedText(task: string): string {
  const start = task.indexOf(TOUCHES_LABEL);
  return start === -1 ? '' : task.slice(start).split(BRIEF_END)[0];
}

function nowNextRow(row: Row): OverlapRow {
  const [id = '', , task = '', state = '', after = ''] = row.cells;
  const afterIds = after.split(',').map((value) => value.trim()).filter((value) => value !== '' && value !== '—');
  return { id, line: row.index + 1, open: isOpenState(state), paths: quotedPaths(touchedText(task)), after: afterIds, before: [] };
}

function isLaunchableTable(lines: string[], block: Block): boolean {
  return block.section !== undefined && LAUNCHABLE_KINDS.includes(kindOf(block.section)) && headerIs(lines, block, NOW_NEXT_LATER_HEADER);
}

export function nowNextOverlapRows(lines: string[], blocks: Block[]): OverlapRow[] {
  return blocks.filter((block) => isLaunchableTable(lines, block)).flatMap((block) => rowsOf(lines, block).map(nowNextRow));
}

function nodeOf(row: OverlapRow): string {
  return row.id === WILDCARD_ID ? `${row.id}@${row.line}` : row.id;
}

function orderGraph(rows: OverlapRow[]): OrderGraph {
  const graph: OrderGraph = new Map();
  const link = (later: string, earlier: string) => graph.set(later, (graph.get(later) ?? new Set()).add(earlier));
  for (const row of rows) {
    row.after.forEach((id) => link(nodeOf(row), id));
    row.before.forEach((id) => link(id, nodeOf(row)));
  }
  return graph;
}

function reaches(graph: OrderGraph, from: string, to: string): boolean {
  const seen = new Set<string>();
  const pending = [from];
  while (pending.length > 0) {
    const node = pending.pop() ?? '';
    if (seen.has(node)) continue;
    seen.add(node);
    const next = graph.get(node) ?? new Set<string>();
    if (next.has(to)) return true;
    pending.push(...next);
  }
  return false;
}

function covers(folder: string, path: string): boolean {
  return path === folder || path.startsWith(folder.endsWith('/') ? folder : `${folder}/`);
}

function innerOverlap(path: string, other: string): string[] {
  if (!covers(path, other) && !covers(other, path)) return [];
  return [other.length > path.length ? other : path];
}

function sharedPaths(first: string[], second: string[]): string[] {
  return [...new Set(first.flatMap((path) => second.flatMap((other) => innerOverlap(path, other))))];
}

function pairWarning(graph: OrderGraph, earlier: OverlapRow, later: OverlapRow): string[] {
  if (earlier.id === later.id && earlier.id !== WILDCARD_ID) return [];
  const shared = sharedPaths(earlier.paths, later.paths).map((path) => `\`${path}\``);
  if (shared.length === 0) return [];
  if (reaches(graph, nodeOf(earlier), nodeOf(later)) || reaches(graph, nodeOf(later), nodeOf(earlier))) return [];
  return [`aviso: línea ${later.line}: la ${later.id} y la ${earlier.id} (línea ${earlier.line}) tocan ${shared.join(', ')} sin «tras» entre ellas`];
}

export function overlapWarnings(rows: OverlapRow[]): string[] {
  const graph = orderGraph(rows);
  const open = rows.filter((row) => row.open).sort((first, second) => first.line - second.line);
  return open.flatMap((later, index) => open.slice(0, index).flatMap((earlier) => pairWarning(graph, earlier, later)));
}
