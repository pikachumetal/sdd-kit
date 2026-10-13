import { lineAt, parseSections, tableBlocks } from './parse.ts';
import type { Block } from './parse.ts';
import { formProseProblems, formSectionProblems } from './structure.ts';
import type { FormRules } from './structure.ts';
import { headerIs, headerProblem, rowsOf, tableBlockProblems } from './tables.ts';
import type { Row } from './tables.ts';

const HEADERS = new Map([
  ['Por triar', '| Ítem | Origen | Fecha |'],
  ['En espera', '| Ítem | Origen | Impacto | Falta | Fecha |'],
  ['Lista', '| Ítem | Origen | Impacto | Evidencia | Destino |'],
  ['Descartadas', '| Ítem | Origen | Motivo | Fecha |'],
]);
const DATE_COLUMN = new Map([
  ['Por triar', 2],
  ['En espera', 4],
  ['Descartadas', 3],
]);
const RULES: FormRules = { names: [...HEADERS.keys()], kindOf: (section) => section.title, subject: 'debt.md' };
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const RELEASES_TO_EXPIRE = 2;
const WARNING_TEXT = new Map([
  ['En espera', (date: string) => `en espera desde ${date}, dos releases sin 2.º caso: caduca`],
  ['Descartadas', (date: string) => `descartada el ${date}, dos releases después: sale en el corte`],
]);

function isBlank(value: string | undefined): boolean {
  return value === undefined || value === '' || value === '—';
}

function listProblems(row: Row): string[] {
  const [evidence, destination] = row.cells.slice(3);
  return [
    ...(isBlank(evidence) ? [`línea ${row.index + 1}: fila de «Lista» sin «Evidencia»`] : []),
    ...(isBlank(destination) ? [`línea ${row.index + 1}: fila de «Lista» sin «Destino»`] : []),
  ];
}

function dateProblems(row: Row, column: number): string[] {
  const date = row.cells[column] ?? '';
  return DATE.test(date) ? [] : [`línea ${row.index + 1}: «Fecha» «${date}» no es AAAA-MM-DD`];
}

function rowProblems(row: Row, kind: string): string[] {
  const column = DATE_COLUMN.get(kind);
  return [...(kind === 'Lista' ? listProblems(row) : []), ...(column === undefined ? [] : dateProblems(row, column))];
}

function blockProblems(lines: string[], block: Block): string[] {
  const kind = block.section?.title ?? '';
  const expected = HEADERS.get(kind);
  if (expected === undefined) return [];
  const rows = headerIs(lines, block, expected) ? rowsOf(lines, block).flatMap((row) => rowProblems(row, kind)) : [];
  return [...tableBlockProblems(lines, block), ...headerProblem(lines, block, kind, expected), ...rows];
}

export function debtProblems(lines: string[]): string[] {
  const sections = parseSections(lines);
  return [
    ...(/^# Deuda técnica\b/i.test(lineAt(lines, 0)) ? [] : ['línea 1: no empieza por «# Deuda técnica»']),
    ...formSectionProblems(sections, RULES),
    ...formProseProblems(lines, sections, RULES),
    ...tableBlocks(lines, sections).flatMap((block) => blockProblems(lines, block)),
  ];
}

function rowWarning(row: Row, kind: string, releaseDates: string[]): string[] {
  const date = row.cells[DATE_COLUMN.get(kind) ?? 0] ?? '';
  const text = WARNING_TEXT.get(kind);
  const later = releaseDates.filter((released) => released > date).length;
  if (!text || !DATE.test(date) || later < RELEASES_TO_EXPIRE) return [];
  return [`línea ${row.index + 1}: ${text(date)}`];
}

function watchedBlocks(lines: string[], blocks: Block[]): Block[] {
  return blocks.filter((block) => {
    const kind = block.section?.title ?? '';
    return WARNING_TEXT.has(kind) && headerIs(lines, block, HEADERS.get(kind) ?? '');
  });
}

export function debtWarnings(lines: string[], releaseDates: string[]): string[] {
  const blocks = watchedBlocks(lines, tableBlocks(lines, parseSections(lines)));
  return blocks.flatMap((block) => rowsOf(lines, block).flatMap((row) => rowWarning(row, block.section?.title ?? '', releaseDates)));
}
