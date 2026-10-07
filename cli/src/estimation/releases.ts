import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { formatNumber, median, sum } from './numbers.ts';
import type { Row } from './artifacts.ts';
import { MISSING, readText } from './text.ts';

const UNPUBLISHED = 'sin publicar';
const UNDATED = 'sin fecha';
const RELEASE_HEADING = /^##\s*\[([^\]]+)\]\s*[-—]\s*(\d{4}-\d{2}-\d{2})\s*$/gm;

interface Version {
  name: string;
  date: string;
}

function readVersions(changelogPath: string): Version[] {
  if (!existsSync(changelogPath)) return [];
  const content = readText(changelogPath);
  const versions = [...content.matchAll(RELEASE_HEADING)].map((found) => ({ name: found[1]!, date: found[2]! }));
  return versions.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

function releaseLabel(row: Row, versions: Version[]): string {
  if (row.date === MISSING) return UNDATED;
  return versions.find((version) => version.date >= row.date)?.name ?? UNPUBLISHED;
}

function costSum(rows: Row[], field: 'subjectCost' | 'sessionCost'): string {
  const numbers = rows
    .map((row) => row[field])
    .filter((value): value is string => value !== null && /^\d+(\.\d+)?$/.test(value));
  return numbers.length === 0 ? MISSING : formatNumber(sum(numbers.map(Number)));
}

function releaseRow(label: string, rows: Row[]): string {
  const ratios = rows.flatMap((row) => (row.ratio === null ? [] : [row.ratio]));
  const medianText = ratios.length > 0 ? formatNumber(median(ratios)) : MISSING;
  const hours = formatNumber(sum(rows.map((row) => row.real)));
  return `| ${label} | ${rows.length} | ${hours} | ${medianText} | ${costSum(rows, 'subjectCost')} | ${costSum(rows, 'sessionCost')} |`;
}

export function releaseTable(rows: Row[], docsPath: string): string[] {
  const versions = readVersions(join(docsPath, 'changelog.md'));
  if (versions.length === 0) return [];
  const byLabel = Map.groupBy(rows, (row) => releaseLabel(row, versions));
  const labels = [...versions.map((version) => version.name), UNPUBLISHED, UNDATED];
  return [
    '',
    '| Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($) |',
    '| --- | --- | --- | --- | --- | --- |',
    ...labels.flatMap((label) => (byLabel.has(label) ? [releaseRow(label, byLabel.get(label)!)] : [])),
  ];
}
