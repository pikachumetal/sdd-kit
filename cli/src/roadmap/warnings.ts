import type { Block } from './parse.ts';
import { CLOSING_PREFIX } from './releases.ts';
import { headerMatches, openRows, rowsOf } from './tables.ts';
import type { Row } from './tables.ts';

const CLOSING_CELL = new RegExp(`^${CLOSING_PREFIX}(?:saldada — |parcial — .*; queda: )`, 'i');
const CLOSING_HELP = '«**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**» ni con «…: parcial — <enlace>; queda: <lo pendiente>]**»';
const DEBT = 'Deuda técnica';
const ITEM_COLUMN = new Map([
  ['Backlog', 1],
  [DEBT, 0],
]);

function closingWarning(item: string): string[] {
  if (!item.startsWith('**[') || CLOSING_CELL.test(item)) return [];
  return [`el prefijo de cierre no casa con ${CLOSING_HELP}`];
}

function blockWarnings(lines: string[], block: Block): string[] {
  const column = ITEM_COLUMN.get(block.section?.kind ?? '') ?? 0;
  return rowsOf(lines, block).flatMap((row) => closingWarning(row.cells[column] ?? '').map((text) => `línea ${row.index + 1}: ${text}`));
}

const ABSORBED = /\*\*Absorbida por ([^*]*)\*\*/;
const ACTING = /^\*\*Actuar → ([^*]*)\*\*/;
const TASK_ID = /\b\d{4}\b/g;
const WITHOUT_LINKS = /\[[^\]]*\]\([^)]*\)/g;

interface Pointer {
  item: number;
  pointerColumn: number;
  pattern: RegExp;
}

const ABSORBED_ROW: Pointer = { item: 1, pointerColumn: 1, pattern: ABSORBED };
const DEBT_ROW: Pointer = { item: 0, pointerColumn: 2, pattern: ACTING };

function pointedIds(row: Row, { item, pointerColumn, pattern }: Pointer): string[] {
  if (row.cells[item]?.startsWith('**[')) return [];
  const text = pattern.exec(row.cells[pointerColumn] ?? '')?.[1].replace(WITHOUT_LINKS, '') ?? '';
  const arrow = text.indexOf('→');
  return (arrow === -1 ? text : text.slice(arrow)).match(TASK_ID) ?? [];
}

const stateIs = (row: Row, prefix: string): boolean => (row.cells.at(-1) ?? '').startsWith(prefix);

function pointerWarnings(lines: string[], blocks: Block[]): string[] {
  const open = openRows(lines, blocks);
  const closed = new Set(open.filter((row) => stateIs(row, '✅')).map((row) => row.cells[0]));
  const debtRows = blocks.filter((block) => block.section?.kind === DEBT && headerMatches(lines, block)).flatMap((block) => rowsOf(lines, block));
  const candidates = [
    ...open.filter((row) => stateIs(row, '⏳')).map((row) => ({ row, ids: pointedIds(row, ABSORBED_ROW) })),
    ...debtRows.map((row) => ({ row, ids: pointedIds(row, DEBT_ROW) })),
  ];
  return candidates
    .filter(({ ids }) => ids.length > 0 && ids.every((id) => closed.has(id)))
    .map(({ row, ids }) => `línea ${row.index + 1}: apunta a ${ids.join(', ')}, ya ✅: sáldala`);
}

export function roadmapWarnings(lines: string[], blocks: Block[]): string[] {
  const watched = blocks.filter((block) => ['Backlog', DEBT].includes(block.section?.kind ?? '') && headerMatches(lines, block));
  return [...watched.flatMap((block) => blockWarnings(lines, block)), ...pointerWarnings(lines, blocks)];
}
