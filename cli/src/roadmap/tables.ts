import { cells, indices, lineAt } from './parse.ts';
import type { Block } from './parse.ts';

const EMPTY_ROW = /^\|[\s|]*$/;
const STATE_PREFIXES = ['⏳', '🔄', '✅', '🧪 validación diferida a', '⏸️ aparcada:'];
const STATE_HELP = '⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …';
const HEADERS = new Map([
  ['Próximo', '| # | Ítem | Estado |'],
  ['Release', '| id | Feature | Origen | Ficheros que toca | Estado |'],
  ['Backlog', '| # | Ítem | Origen |'],
  ['Deuda técnica', '| Ítem | Impacto | Destino |'],
  ['Patches', '| Fecha | Id | Descripción |'],
]);

export interface Row {
  index: number;
  title: string;
  cells: string[];
}

function isEmptyRow(line: string): boolean {
  return EMPTY_ROW.test(line);
}

export function headerMatches(lines: string[], block: Block): boolean {
  if (block.header === null || !block.section) return false;
  return lineAt(lines, block.header).trim() === HEADERS.get(block.section.kind);
}

function cellCountProblems(lines: string[], header: number): string[] {
  const headerCells = cells(lineAt(lines, header)).length;
  const separatorCells = cells(lineAt(lines, header + 1)).length;
  if (headerCells === separatorCells) return [];
  return [`línea ${header + 1}: la cabecera tiene ${headerCells} celdas y el separador ${separatorCells}`];
}

export function tableBlockProblems(lines: string[], block: Block): string[] {
  const firstRow = block.header ?? block.end + 1;
  const problems = indices(block.start, block.end).flatMap((index) => {
    if (index < firstRow) return [`línea ${index + 1}: fila fuera de una tabla con cabecera y separador`];
    return isEmptyRow(lineAt(lines, index)) ? [`línea ${index + 1}: fila vacía`] : [];
  });
  if (block.header === null) return problems;
  return [...problems, ...cellCountProblems(lines, block.header)];
}

export function tableHeaderProblems(lines: string[], block: Block): string[] {
  if (block.header === null || !block.section) return [];
  const expected = HEADERS.get(block.section.kind);
  if (!expected || headerMatches(lines, block)) return [];
  return [`línea ${block.header + 1}: la cabecera de «${block.section.title}» debe ser «${expected}»`];
}

export function rowsOf(lines: string[], block: Block): Row[] {
  const rows: Row[] = [];
  const title = block.section?.title ?? '';
  for (let index = (block.header ?? 0) + 2; index <= block.end; index++) {
    const line = lineAt(lines, index);
    if (!isEmptyRow(line)) rows.push({ index, title, cells: cells(line) });
  }
  return rows;
}

export function openRows(lines: string[], blocks: Block[]): Row[] {
  return blocks
    .filter((block) => ['Próximo', 'Release'].includes(block.section?.kind ?? '') && headerMatches(lines, block))
    .flatMap((block) => rowsOf(lines, block));
}

export function stateProblem(row: Row): string[] {
  const state = row.cells.at(-1) ?? '';
  if (STATE_PREFIXES.some((prefix) => state.startsWith(prefix))) return [];
  return [`línea ${row.index + 1}: estado «${state}» no admitido: ${STATE_HELP}`];
}
