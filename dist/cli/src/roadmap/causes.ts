import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readLines } from '../cli/files.ts';
import { caseCount, isSettledRow, LIST_COLUMN } from './debt.ts';
import { parseSections, tableBlocks } from './parse.ts';
import { headerIs, rowsOf } from './tables.ts';
import type { Row } from './tables.ts';

const OPEN_SECTION = 'Abiertas en «Lista»';
const OPEN_HEADER = '| Ítem | Causa | Casos | Destino | Abierta desde |';
const ITEM_COLUMN = 0;
const CAUSE_COLUMN = 1;
const SINCE_COLUMN = 4;
export const VERSION = /^\d+\.\d+\.\d+$/;
const VERSION_FOLDER = /^v(\d+\.\d+\.\d+)$/;

export interface CauseCount {
  cause: string;
  waiting: number;
  listed: number;
}

export interface OpenRow {
  item: string;
  cause: string;
  cases: number;
  destination: string;
  openSince: string;
}

export interface CausesReport {
  causes: CauseCount[];
  open: OpenRow[];
  closedSinceLast: number | null;
  previous: string | null;
}

export interface PreviousRetro {
  version: string;
  since: Map<string, string>;
}

function sectionRows(lines: string[], title: string): Row[] {
  return tableBlocks(lines, parseSections(lines))
    .filter((block) => block.section?.title === title && block.header !== null)
    .flatMap((block) => rowsOf(lines, block));
}

function hasOpenTable(lines: string[]): boolean {
  const blocks = tableBlocks(lines, parseSections(lines)).filter((block) => block.section?.title === OPEN_SECTION);
  return blocks.length > 0 && blocks.every((block) => headerIs(lines, block, OPEN_HEADER));
}

function compareVersions(left: string, right: string): number {
  const [a, b] = [left, right].map((version) => version.split('.').map(Number));
  return (a?.[0] ?? 0) - (b?.[0] ?? 0) || (a?.[1] ?? 0) - (b?.[1] ?? 0) || (a?.[2] ?? 0) - (b?.[2] ?? 0);
}

function earlierVersions(docsPath: string, version: string): string[] {
  const releases = join(docsPath, 'releases');
  if (!existsSync(releases)) return [];
  return readdirSync(releases)
    .flatMap((folder) => VERSION_FOLDER.exec(folder)?.[1] ?? [])
    .filter((candidate) => compareVersions(candidate, version) < 0)
    .sort((left, right) => compareVersions(right, left));
}

function readRetro(docsPath: string, version: string): PreviousRetro | null {
  const path = join(docsPath, 'releases', `v${version}`, 'retro.md');
  if (!existsSync(path)) return null;
  const lines = readLines(path);
  if (!hasOpenTable(lines)) return null;
  return { version, since: new Map(sectionRows(lines, OPEN_SECTION).map((row) => [row.cells[ITEM_COLUMN] ?? '', row.cells[SINCE_COLUMN] ?? ''])) };
}

export function previousRetro(docsPath: string, version: string): PreviousRetro | null {
  for (const candidate of earlierVersions(docsPath, version)) {
    const retro = readRetro(docsPath, candidate);
    if (retro) return retro;
  }
  return null;
}

function countCauses(waiting: Row[], listed: Row[]): CauseCount[] {
  const counts = new Map<string, CauseCount>();
  const tally = (rows: Row[], field: 'waiting' | 'listed') => {
    for (const row of rows) {
      const cause = row.cells[CAUSE_COLUMN] ?? '';
      const count = counts.get(cause) ?? { cause, waiting: 0, listed: 0 };
      count[field]++;
      counts.set(cause, count);
    }
  };
  tally(waiting, 'waiting');
  tally(listed, 'listed');
  return [...counts.values()].sort((left, right) => right.listed - left.listed || left.cause.localeCompare(right.cause, 'es'));
}

function openRow(row: Row, since: Map<string, string> | undefined, version: string): OpenRow {
  const item = row.cells[LIST_COLUMN.item] ?? '';
  const inherited = since?.get(item) ?? '';
  return {
    item,
    cause: row.cells[LIST_COLUMN.cause] ?? '',
    cases: caseCount(row.cells[LIST_COLUMN.origin] ?? ''),
    destination: row.cells[LIST_COLUMN.destination] ?? '',
    openSince: VERSION.test(inherited) ? inherited : version,
  };
}

export function causesReport(lines: string[], previous: PreviousRetro | null, version: string): CausesReport {
  const listed = sectionRows(lines, 'Lista').filter((row) => !isSettledRow(row));
  const open = listed.map((row) => openRow(row, previous?.since, version)).sort((left, right) => compareVersions(left.openSince, right.openSince));
  const stillOpen = new Set(open.map((row) => row.item));
  return {
    causes: countCauses(sectionRows(lines, 'En espera'), listed),
    open,
    closedSinceLast: previous === null ? null : [...previous.since.keys()].filter((item) => !stillOpen.has(item)).length,
    previous: previous?.version ?? null,
  };
}

function tableLine(cells: (string | number)[]): string {
  return `| ${cells.join(' | ')} |`;
}

export function renderCauses(report: CausesReport): string[] {
  if (report.causes.length === 0) return ['Sin deuda triada'];
  return [
    '## Repaso por causa', '',
    '| Causa | En espera | Lista |', '| --- | --- | --- |',
    ...report.causes.map(({ cause, waiting, listed }) => tableLine([cause, waiting, listed])), '',
    `## ${OPEN_SECTION}`, '',
    OPEN_HEADER, '| --- | --- | --- | --- | --- |',
    ...report.open.map(({ item, cause, cases, destination, openSince }) => tableLine([item, cause, cases, destination, openSince])),
    ...(report.previous === null ? [] : ['', `Cerradas desde la ${report.previous}: ${report.closedSinceLast}`]),
  ];
}
