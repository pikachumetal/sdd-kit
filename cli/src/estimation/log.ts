import { existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { readRows } from './artifacts.ts';
import type { Row } from './artifacts.ts';
import { calibrationSection } from './calibration.ts';
import type { Warn } from './fields.ts';
import { formatNumber } from './numbers.ts';
import { releaseTable } from './releases.ts';
import { MISSING, readText } from './text.ts';

const HEADER =
  '<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit) — no editar a mano. Regenerar: pwsh -NoProfile -File <sdd-templates>/scripts/Build-EstimationLog.ps1 -Root <proyecto> -->';
const TABLE_HEADER =
  '| Fecha | Id | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Sesión ($) | Carpeta |';

export interface GeneratedLog {
  text: string;
  rowCount: number;
  docsPath: string;
}

function notFound(root: string): DomainError {
  return new DomainError(`No se encuentra '.docs/sdd/specs' ni 'docs/sdd/specs' bajo '${root}'.`);
}

function resolveDocsPath(root: string): string {
  const candidates = ['.docs/sdd', 'docs/sdd'].map((candidate) => join(root, candidate));
  const docsPath = candidates.find((path) => existsSync(join(path, 'specs')));
  if (docsPath === undefined) throw notFound(root);
  return docsPath;
}

function textOrMissing(value: string | null): string {
  return value === null || value.trim() === '' ? MISSING : value;
}

function formatRow(row: Row): string {
  const hours = [row.estimate, row.real, row.ratio].map(formatNumber).join(' | ');
  const costs = [row.threadTokens, row.subagentTokens, row.subjectCost, row.sessionCost].map(textOrMissing).join(' | ');
  return `| ${row.date} | ${row.id} | ${row.type} | ${hours} | ${costs} | ${row.folder} |`;
}

function formatLog(rows: Row[], docsPath: string): string {
  const lines = [
    HEADER,
    '# Estimation log (estimado vs real)',
    '',
    TABLE_HEADER,
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(formatRow),
    ...calibrationSection(rows, (all) => releaseTable(all, docsPath)),
  ];
  return `${lines.join('\n')}\n`;
}

export function generateEstimationLog(root: string, warn: Warn): GeneratedLog {
  if (!existsSync(root)) throw notFound(root);
  const docsPath = resolveDocsPath(resolve(root));
  const rows = readRows(join(docsPath, 'specs'), warn);
  return { text: formatLog(rows, docsPath), rowCount: rows.length, docsPath };
}

export function buildEstimationLog(root: string, warn: Warn = (message) => void process.stderr.write(`${message}\n`)): string {
  return generateEstimationLog(root, warn).text;
}

function isManualLog(path: string): boolean {
  if (!existsSync(path)) return false;
  const firstLine = readText(path).split(/\r\n|\r|\n/)[0] ?? '';
  return !/^<!-- AUTO-GENERADO/i.test(firstLine);
}

export function writeEstimationLog(text: string, outFile: string, warn: Warn): void {
  if (isManualLog(outFile)) {
    warn(
      `El fichero ${outFile} no es un log generado (sin cabecera AUTO-GENERADO): se sobreescribe un log mantenido a mano. Revisa el diff antes de commitear.`,
    );
  }
  writeFileSync(outFile, text, 'utf8');
}
