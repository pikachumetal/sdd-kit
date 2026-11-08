import type { Block } from './parse.ts';
import { openRows } from './tables.ts';
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
const FILES_LABEL = 'Ficheros:';
const RELEASE_FILES_COLUMN = 3;
const WILDCARD_ID = '0000';

export function isOpenState(state: string): boolean {
  return OPEN_STATES.some((prefix) => state.startsWith(prefix));
}

export function quotedPaths(text: string): string[] {
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
  const inRelease = row.title !== 'Próximo';
  const middle = row.cells.slice(1, -1);
  const orderText = inRelease ? middle.filter((_, index) => index !== RELEASE_FILES_COLUMN - 1) : middle;
  const filesText = inRelease ? (row.cells[RELEASE_FILES_COLUMN] ?? '') : afterLastFilesLabel(middle[0] ?? '');
  const base = { id: row.cells[0] ?? '', line: row.index + 1, open: isOpenState(row.cells.at(-1) ?? '') };
  return { ...base, paths: quotedPaths(filesText), ...orderIds(orderText.join(' ')) };
}

export function twoPointOverlapRows(lines: string[], blocks: Block[]): OverlapRow[] {
  return openRows(lines, blocks).map(twoPointRow);
}

function orderGraph(rows: OverlapRow[]): OrderGraph {
  const graph: OrderGraph = new Map();
  const link = (later: string, earlier: string) => graph.set(later, (graph.get(later) ?? new Set()).add(earlier));
  for (const row of rows) {
    row.after.forEach((id) => link(row.id, id));
    row.before.forEach((id) => link(id, row.id));
  }
  return graph;
}

function reaches(graph: OrderGraph, from: string, to: string): boolean {
  const seen = new Set<string>();
  const pending = [from];
  while (pending.length > 0) {
    const id = pending.pop() ?? '';
    if (seen.has(id)) continue;
    seen.add(id);
    const next = graph.get(id) ?? new Set<string>();
    if (next.has(to)) return true;
    pending.push(...next);
  }
  return false;
}

function covers(folder: string, path: string): boolean {
  return path === folder || path.startsWith(folder.endsWith('/') ? folder : `${folder}/`);
}

function sharedPaths(first: string[], second: string[]): string[] {
  const inner = first.flatMap((path) => second.filter((other) => covers(path, other) || covers(other, path)).map((other) => (other.length > path.length ? other : path)));
  return [...new Set(inner)];
}

function pairWarning(graph: OrderGraph, earlier: OverlapRow, later: OverlapRow): string[] {
  if (earlier.id === later.id && earlier.id !== WILDCARD_ID) return [];
  if (reaches(graph, earlier.id, later.id) || reaches(graph, later.id, earlier.id)) return [];
  const shared = sharedPaths(earlier.paths, later.paths).map((path) => `\`${path}\``);
  if (shared.length === 0) return [];
  return [`aviso: línea ${later.line}: la ${later.id} y la ${earlier.id} (línea ${earlier.line}) tocan ${shared.join(', ')} sin «tras» entre ellas`];
}

export function overlapWarnings(rows: OverlapRow[]): string[] {
  const graph = orderGraph(rows);
  const open = rows.filter((row) => row.open).sort((first, second) => first.line - second.line);
  return open.flatMap((later, index) => open.slice(0, index).flatMap((earlier) => pairWarning(graph, earlier, later)));
}
