import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { changeFolders } from '../cli/layout.ts';
import { readRows } from './artifacts.ts';
import type { Row } from './artifacts.ts';
import type { Warn } from './fields.ts';
import { resolveDocsPath } from './log.ts';
import { formatNumber, median } from './numbers.ts';
import { NO_DATA, PHASE_LABELS, readTiming } from './phases.ts';
import { releaseIndex, UNDATED, UNPUBLISHED } from './releases.ts';
import type { PhaseRecord } from './phases.ts';
import { MISSING } from './text.ts';
import { PHASE_NAMES } from './timing-file.ts';

export const UNATTRIBUTED = 'sin atribuir';
export const UNMARKED = 'sin marcador';
const SMALL_SAMPLE = 5;
const NOTE = '* n < 5: mediana orientativa.';
const SECONDS_PER_HOUR = 3600;

export interface ReportSource {
  row: Row;
  root: string;
}

export interface Attribution {
  person: string;
  kitVersion: string;
}

export interface ReportRow extends Row, Attribution {
  root: string;
}

export interface ReportOptions {
  release: string | null;
  attribute?: (docsPath: string, sources: ReportSource[], warn: Warn) => Attribution[];
}

type Compare = (first: string, second: string) => number;

const unattributed = (_docsPath: string, sources: ReportSource[]): Attribution[] =>
  sources.map(() => ({ person: UNATTRIBUTED, kitVersion: UNMARKED }));

const specialsLast = (name: string): number => (name === UNATTRIBUTED || name === UNMARKED ? 1 : 0);
const byName: Compare = (first, second) => specialsLast(first) - specialsLast(second) || first.localeCompare(second);

function versionParts(version: string): number[] {
  return version.split('.').map(Number);
}

const bySemVer: Compare = (first, second) => {
  const special = specialsLast(first) - specialsLast(second);
  if (special !== 0) return special;
  const [a, b] = [versionParts(first), versionParts(second)];
  const differing = a.findIndex((part, index) => part !== b[index]);
  return differing < 0 ? 0 : a[differing]! - (b[differing] ?? 0);
};

const sampleCell = (n: number): string => (n < SMALL_SAMPLE ? `${n} *` : String(n));
const noteFor = (sizes: number[]): string[] => (sizes.some((n) => n < SMALL_SAMPLE) ? ['', NOTE] : []);

function groupLine(name: string, rows: ReportRow[]): string {
  const ratios = rows.flatMap((row) => (row.ratio === null ? [] : [row.ratio]));
  const ratio = ratios.length === 0 ? MISSING : formatNumber(median(ratios));
  const over = ratios.filter((value) => value > 1).length;
  return `| ${name} | ${sampleCell(rows.length)} | ${formatNumber(median(rows.map((row) => row.real)))} | ${ratio} | ${over} |`;
}

function groupTable(label: string, rows: ReportRow[], key: (row: ReportRow) => string, compare: Compare, empty: string): string[] {
  if (rows.length === 0) return [empty];
  const groups = Map.groupBy(rows, key);
  const names = [...groups.keys()].sort(compare);
  const sizes = names.map((name) => groups.get(name)!.length);
  const header = [`| ${label} | n | Real (h) | Ratio | Real > est |`, '| --- | --- | --- | --- | --- |'];
  return [...header, ...names.map((name) => groupLine(name, groups.get(name)!)), ...noteFor(sizes)];
}

interface PersonPhase {
  person: string;
  phase: PhaseRecord;
}

const workHours = (phase: PhaseRecord): number => (phase.agentSeconds + phase.execSeconds) / SECONDS_PER_HOUR;

function phaseLine(label: string, person: string, phases: PhaseRecord[]): string {
  const estimated = phases.filter((phase) => phase.estimateHours !== null && phase.estimateHours > 0);
  const ratio = estimated.length === 0 ? MISSING : formatNumber(median(estimated.map((phase) => workHours(phase) / phase.estimateHours!)));
  return `| ${label} | ${person} | ${sampleCell(phases.length)} | ${formatNumber(median(phases.map(workHours)))} | ${ratio} |`;
}

function phaseLines(entries: PersonPhase[]): { lines: string[]; sizes: number[] } {
  const lines: string[] = [];
  const sizes: number[] = [];
  for (const name of PHASE_NAMES) {
    const byPerson = Map.groupBy(entries.filter((entry) => entry.phase.name === name), (entry) => entry.person);
    for (const person of [...byPerson.keys()].sort(byName)) {
      const phases = byPerson.get(person)!.map((entry) => entry.phase);
      lines.push(phaseLine(PHASE_LABELS[name], person, phases));
      sizes.push(phases.length);
    }
  }
  return { lines, sizes };
}

function phaseTable(rows: ReportRow[], warn: Warn): string[] {
  const entries = rows.flatMap((row) =>
    (readTiming(row.root, row.folder, warn) ?? []).filter((phase) => phase.measured).map((phase) => ({ person: row.person, phase })),
  );
  if (entries.length === 0) return [NO_DATA];
  const { lines, sizes } = phaseLines(entries);
  return ['| Fase | Persona | n | Real (h) | Ratio |', '| --- | --- | --- | --- | --- |', ...lines, ...noteFor(sizes)];
}

function render(rows: ReportRow[], empty: string, warn: Warn): string {
  const sections = [
    ['Por persona', groupTable('Persona', rows, (row) => row.person, byName, empty)],
    ['Por carril', groupTable('Carril', rows, (row) => row.type, byName, empty)],
    ['Por versión marcada del kit', groupTable('Versión marcada del kit', rows, (row) => row.kitVersion, bySemVer, empty)],
    ['Por fase y persona', phaseTable(rows, warn)],
  ] as const;
  return sections.map(([title, lines]) => [`### ${title}`, '', ...lines].join('\n')).join('\n\n');
}

function readSources(docsPath: string, warn: Warn): ReportSource[] {
  return changeFolders(docsPath).flatMap((root) => readRows(root, warn).map((row) => ({ row, root })));
}

function selectRelease(sources: ReportSource[], docsPath: string, release: string, warn: Warn): ReportSource[] {
  const index = releaseIndex(docsPath);
  if (index.changelog === null) throw new DomainError(`Sin changelog en ${docsPath}: --release necesita las versiones del changelog.`);
  if (!index.versions.includes(release)) {
    throw new DomainError(`La versión ${release} no está con fecha en el changelog (${index.changelog}): nada que informar.`);
  }
  const labels = sources.map((source) => index.label(source.row));
  const outside = labels.filter((label) => label === UNPUBLISHED || label === UNDATED).length;
  if (outside > 0) warn(`Fuera de toda release: ${outside} cierres sin publicar o sin fecha; no cuentan en la ${release}.`);
  return sources.filter((_, position) => labels[position] === release);
}

export function buildReport(root: string, options: ReportOptions, warn: Warn): string {
  if (!existsSync(root)) throw new DomainError(`No existe la carpeta del proyecto '${root}'.`);
  const docsPath = resolveDocsPath(resolve(root));
  const release = options.release?.replace(/^v/, '') ?? null;
  const all = readSources(docsPath, warn);
  const sources = release === null ? all : selectRelease(all, docsPath, release, warn);
  const attributions = (options.attribute ?? unattributed)(docsPath, sources, warn);
  const rows = sources.map(({ row, root: folderRoot }, position) => ({ ...row, ...attributions[position]!, root: folderRoot }));
  return render(rows, release === null ? 'Sin cierres.' : `Sin cierres en la ${release}.`, warn);
}
