import type { Block } from './parse.ts';
import { CLOSING_PREFIX } from './releases.ts';
import { headerMatches, rowsOf } from './tables.ts';
import type { Row } from './tables.ts';

const CLOSING_CELL = new RegExp(`^${CLOSING_PREFIX}(?:saldada — |parcial — .*; queda: )`, 'i');
const CLOSING_HELP = '«**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**» ni con «…: parcial — <enlace>; queda: <lo pendiente>]**»';
const DESTINATIONS = ['Actuar', 'Esperar 2.º ticket', 'Descartada'];
const DEBT = 'Deuda técnica';
const ITEM_COLUMN = new Map([
  ['Backlog', 1],
  [DEBT, 0],
]);
const MAX_SHOWN_DESTINATION = 60;

function closingWarning(item: string): string[] {
  if (!item.startsWith('**[') || CLOSING_CELL.test(item)) return [];
  return [`el prefijo de cierre no casa con ${CLOSING_HELP}`];
}

function destinationWarning(destination: string): string[] {
  if (DESTINATIONS.some((name) => destination.replace(/^\*+/, '').startsWith(name))) return [];
  const long = destination.length > MAX_SHOWN_DESTINATION;
  const shown = long ? `${destination.slice(0, MAX_SHOWN_DESTINATION)}…` : destination;
  return [`«Destino» «${shown}» no empieza por ${DESTINATIONS[0]}, ${DESTINATIONS[1]} o ${DESTINATIONS[2]}`];
}

function rowWarnings(row: Row, kind: string): string[] {
  const warnings = closingWarning(row.cells[ITEM_COLUMN.get(kind) ?? 0] ?? '');
  if (kind !== DEBT) return warnings;
  return [...warnings, ...destinationWarning(row.cells.at(-1) ?? '')];
}

export function roadmapWarnings(lines: string[], blocks: Block[]): string[] {
  const watched = blocks.filter((block) => ['Backlog', DEBT].includes(block.section?.kind ?? '') && headerMatches(lines, block));
  return watched.flatMap((block) =>
    rowsOf(lines, block).flatMap((row) => rowWarnings(row, block.section?.kind ?? '').map((text) => `línea ${row.index + 1}: ${text}`)),
  );
}
