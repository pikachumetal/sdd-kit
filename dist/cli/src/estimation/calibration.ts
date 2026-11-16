import { formatNumber, formatPercent, median, percentile, sum } from './numbers.ts';
import type { Row } from './artifacts.ts';
import { MISSING } from './text.ts';

const MIN_FOR_DISPERSION = 5;
const MIN_FOR_TREND = 20;
const MIN_FOR_CONFIDENCE = 10;
const TREND_WINDOW = 10;
const BANDS = ['<0.5', '0.5–0.8', '0.8–1.25', '1.25–2', '≥2'];
const BAND_LIMITS = [0.5, 0.8, 1.25, 2];

export type WithRatio = Row & { ratio: number };

function headerLine(ratios: number[]): string {
  const unit = ratios.length === 1 ? 'artefacto' : 'artefactos';
  const mean = formatNumber(sum(ratios) / ratios.length);
  return `**Factor de calibración** (ratio mediano real/estimado, ${ratios.length} ${unit}): **${formatNumber(median(ratios))}** · media ${mean}`;
}

function bandIndex(ratio: number): number {
  const index = BAND_LIMITS.findIndex((limit) => ratio < limit);
  return index === -1 ? BAND_LIMITS.length : index;
}

function histogram(ratios: number[]): string[] {
  if (ratios.length < MIN_FOR_DISPERSION) return [];
  const counts = BANDS.map((_, band) => ratios.filter((ratio) => bandIndex(ratio) === band).length);
  return [
    '',
    '| Tramo del ratio | n | % |',
    '| --- | --- | --- |',
    ...BANDS.map((label, band) => `| ${label} | ${counts[band]} | ${formatPercent(counts[band]!, ratios.length)} |`),
  ];
}

function absoluteErrorLine(rows: WithRatio[]): string {
  const errors = rows.map((row) => Math.abs(row.real - (row.estimate ?? 0)));
  const mean = formatNumber(sum(errors) / errors.length);
  return `- Error absoluto (h): media ${mean} · mediana ${formatNumber(median(errors))}`;
}

function quartileRange(ratios: number[]): string {
  return `${formatNumber(percentile(ratios, 0.25))}–${formatNumber(percentile(ratios, 0.75))}`;
}

function dispersion(rows: WithRatio[]): string[] {
  if (rows.length < MIN_FOR_DISPERSION) return ['- n insuficiente (hacen falta 5)'];
  const ratios = rows.map((row) => row.ratio);
  const share = (matches: (ratio: number) => boolean) => formatPercent(ratios.filter(matches).length, ratios.length);
  const within = share((r) => r >= 0.75 && r <= 1.25);
  return [
    `- p25–p75: ${quartileRange(ratios)}`,
    `- p80: ${formatNumber(percentile(ratios, 0.8))} — para comprometer una fecha, multiplica la estimación por el p80: así cubre 4 de cada 5 artefactos.`,
    `- Dentro de ±25 %: ${within} · sobreestimadas: ${share((r) => r < 0.75)} · infraestimadas: ${share((r) => r > 1.25)}`,
    absoluteErrorLine(rows),
  ];
}

function trendLine(ratios: number[]): string {
  if (ratios.length < MIN_FOR_TREND) return '- Tendencia: n insuficiente (hacen falta 20)';
  const first = formatNumber(median(ratios.slice(0, TREND_WINDOW)));
  const last = formatNumber(median(ratios.slice(-TREND_WINDOW)));
  return `- Tendencia (mediana de las 10 primeras frente a las 10 últimas): ${first} frente a ${last}`;
}

function groupByType(rows: WithRatio[]): { name: string; ratios: number[] }[] {
  const groups = new Map<string, { name: string; ratios: number[] }>();
  for (const row of rows) {
    const key = row.type.toLowerCase();
    const group = groups.get(key) ?? { name: row.type, ratios: [] };
    group.ratios.push(row.ratio);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function typeTable(rows: WithRatio[]): string[] {
  const lines = ['| Tipo | n | Mediana | p25–p75 |', '| --- | --- | --- | --- |'];
  for (const { name, ratios } of groupByType(rows)) {
    const range = ratios.length >= MIN_FOR_DISPERSION ? quartileRange(ratios) : MISSING;
    lines.push(`| ${name} | ${ratios.length} | ${formatNumber(median(ratios))} | ${range} |`);
  }
  return lines;
}

export function calibrationSection(rows: Row[], releaseTable: (rows: Row[]) => string[]): string[] {
  const withRatio = rows.filter((row): row is WithRatio => row.ratio !== null);
  if (withRatio.length === 0) return [];
  const ratios = withRatio.map((row) => row.ratio);
  const caveat = withRatio.length < MIN_FOR_CONFIDENCE ? 'Con menos de 10 tareas con ratio la calibración es orientativa. ' : '';
  return [
    '',
    headerLine(ratios),
    '',
    ...dispersion(withRatio),
    trendLine(ratios),
    ...histogram(ratios),
    '',
    ...typeTable(withRatio),
    ...releaseTable(rows),
    '',
    `> ${caveat}Ver \`estimation.md\`.`,
  ];
}
