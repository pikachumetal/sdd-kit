import { join, resolve } from 'node:path';
import { lineAt, parseSections, tableBlocks } from './parse.ts';
import type { Block } from './parse.ts';
import { CLOSING_PREFIX } from './releases.ts';
import { formProseProblems, formSectionProblems } from './structure.ts';
import type { FormRules } from './structure.ts';
import { headerIs, headerProblem, rowsOf, tableBlockProblems } from './tables.ts';
import type { Row } from './tables.ts';

const HEADERS = new Map([
  ['Por triar', '| Ítem | Origen | Fecha |'],
  ['En espera', '| Ítem | Causa | Origen | Impacto | Falta | Fecha |'],
  ['Lista', '| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |'],
  ['Descartadas', '| Ítem | Causa | Origen | Motivo | Fecha |'],
]);
const DATE_COLUMN = new Map([
  ['Por triar', 2],
  ['En espera', 5],
  ['Descartadas', 4],
]);
const PRODUCT_DEFECT = 'defecto del producto';
const UNDETERMINED = 'sin determinar';
const CAUSES = [
  'entorno de la máquina',
  'carga o paralelismo',
  'herramienta del kit',
  'regla lejos de su paso',
  'decisión que no era del agente',
  'fusión de registros',
  'prueba o molde',
  PRODUCT_DEFECT,
  UNDETERMINED,
];
const FIX_TYPES = ['comprobación automática', 'conectar comprobación', 'mover regla', 'línea nueva'];
const LINK_TARGET = /\]\(([^)]+)\)/g;
const SETTLED_ROW = new RegExp(`^${CLOSING_PREFIX}saldada — `, 'i');
export const LIST_COLUMN = { item: 0, cause: 1, origin: 2, evidence: 4, remedy: 5, fix: 6, destination: 7 };
const RULES: FormRules = { names: [...HEADERS.keys()], kindOf: (section) => section.title, subject: 'debt.md' };
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const RELEASES_TO_EXPIRE = 2;
const WARNING_TEXT = new Map([
  ['En espera', (date: string) => `en espera desde ${date}, dos releases sin 2.º caso: caduca`],
  ['Descartadas', (date: string) => `descartada el ${date}, dos releases después: sale en el corte`],
]);

export function debtPath(docsPath: string): string {
  return join(resolve(docsPath), 'steering', 'debt.md');
}

function isBlank(value: string | undefined): boolean {
  return value === undefined || value === '' || value === '—';
}

function causeProblems(row: Row): string[] {
  const cause = row.cells[LIST_COLUMN.cause] || '—';
  return CAUSES.includes(cause) ? [] : [`línea ${row.index + 1}: causa «${cause}» no admitida: ${CAUSES.join(', ')}`];
}

function fixProblems(row: Row): string[] {
  const fix = row.cells[LIST_COLUMN.fix] || '—';
  if (FIX_TYPES.includes(fix) || (fix === '—' && row.cells[LIST_COLUMN.cause] === PRODUCT_DEFECT)) return [];
  return [`línea ${row.index + 1}: arreglo «${fix}» no admitido: ${FIX_TYPES.join(', ')}`];
}

export function caseCount(origin: string): number {
  return new Set([...origin.matchAll(LINK_TARGET)].map((link) => link[1])).size;
}

export function isSettledRow(row: Row): boolean {
  return SETTLED_ROW.test(row.cells[LIST_COLUMN.item] ?? '');
}

function triageProblems(row: Row): string[] {
  if (isSettledRow(row)) return [];
  return [
    ...causeProblems(row),
    ...(row.cells[LIST_COLUMN.cause] === UNDETERMINED ? [`línea ${row.index + 1}: una fila de «Lista» no admite la causa «${UNDETERMINED}»`] : []),
    ...fixProblems(row),
    ...(caseCount(row.cells[LIST_COLUMN.origin] ?? '') >= 2 && isBlank(row.cells[LIST_COLUMN.remedy]) ? [`línea ${row.index + 1}: fila de problema sin «Remedio temporal»`] : []),
  ];
}

function listProblems(row: Row): string[] {
  return [
    ...triageProblems(row),
    ...(isBlank(row.cells[LIST_COLUMN.evidence]) ? [`línea ${row.index + 1}: fila de «Lista» sin «Evidencia»`] : []),
    ...(isBlank(row.cells[LIST_COLUMN.destination]) ? [`línea ${row.index + 1}: fila de «Lista» sin «Destino»`] : []),
  ];
}

function dateProblems(row: Row, column: number): string[] {
  const date = row.cells[column] ?? '';
  return DATE.test(date) ? [] : [`línea ${row.index + 1}: «Fecha» «${date}» no es AAAA-MM-DD`];
}

function rowProblems(row: Row, kind: string): string[] {
  const column = DATE_COLUMN.get(kind);
  return [
    ...(kind === 'Lista' ? listProblems(row) : []),
    ...(kind === 'En espera' || kind === 'Descartadas' ? causeProblems(row) : []),
    ...(column === undefined ? [] : dateProblems(row, column)),
  ];
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
