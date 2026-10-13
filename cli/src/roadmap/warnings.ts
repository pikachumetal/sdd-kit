import type { Block } from './parse.ts';
import { CLOSING_PREFIX } from './releases.ts';
import { headerMatches, rowsOf } from './tables.ts';

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

export function roadmapWarnings(lines: string[], blocks: Block[]): string[] {
  const watched = blocks.filter((block) => ['Backlog', DEBT].includes(block.section?.kind ?? '') && headerMatches(lines, block));
  return watched.flatMap((block) => blockWarnings(lines, block));
}
