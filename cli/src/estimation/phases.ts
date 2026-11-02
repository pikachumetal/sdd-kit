import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { readText } from '../cli/files.ts';
import { TIMING_VERSION, PHASE_NAMES, type PhaseName, type Timing, type TimingPhase } from './timing-file.ts';
import type { Warn } from './fields.ts';
import { formatNumber } from './numbers.ts';
import { MISSING } from './text.ts';

type PhaseRecord = Omit<TimingPhase, 'agentSeconds' | 'execSeconds' | 'waitSeconds'> & { agentSeconds: number; execSeconds: number; waitSeconds: number };

const PHASE_LABELS: Record<PhaseName, string> = { apertura: 'apertura', implementacion: 'implementación', revision: 'revisión', cierre: 'cierre' };
const HEADING = '## Tiempos por fase';
const NO_DATA = 'Sin datos: ninguna tarea tiene timing.json.';
const TABLE_HEADER = '| Fase | n | Agente (h) | Ejecución (h) | Espera (h) | Gate (h) | % del trabajo | Ceremonia | Est (h) | Real (h) | Ratio |';
const TABLE_RULE = '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |';
const SECONDS_PER_HOUR = 3600;

const hours = (seconds: number): string => formatNumber(seconds / SECONDS_PER_HOUR);
const workSeconds = (phase: PhaseRecord): number => phase.agentSeconds + phase.execSeconds;
const totalOf = (phases: PhaseRecord[], read: (phase: PhaseRecord) => number): number => phases.reduce((total, phase) => total + read(phase), 0);
const percent = (part: number, whole: number): string => `${whole === 0 ? 0 : Math.round((100 * part) / whole)} %`;

function parseTiming(path: string): Timing | null {
  try {
    return JSON.parse(readText(path)) as Timing;
  } catch {
    return null;
  }
}

const hasTimes = (phase: TimingPhase): boolean => !phase.measured || [phase.agentSeconds, phase.execSeconds, phase.waitSeconds].every(Number.isFinite);

function isReadable(timing: Timing | null): timing is Timing {
  if (typeof timing !== 'object' || timing === null) return false;
  return !timing.measured || (Array.isArray(timing.phases) && timing.phases.length > 0 && timing.phases.every(hasTimes));
}

function readTiming(root: string, folder: string, warn: Warn): PhaseRecord[] | null {
  const path = join(root, folder, 'timing.json');
  if (!existsSync(path)) return null;
  const timing = parseTiming(path);
  if (!isReadable(timing)) {
    warn(`timing.json ilegible, fuera de la tabla de fases: ${folder}.`);
    return null;
  }
  if (timing.version !== TIMING_VERSION) {
    warn(`timing.json de versión desconocida, fuera de la tabla de fases: ${folder}.`);
    return null;
  }
  if (!timing.measured) return null;
  if (timing.withinMargin) return timing.phases as PhaseRecord[];
  warn(`timing.json fuera del margen, fuera de la tabla de fases: ${folder}.`);
  return null;
}

function readTimings(roots: string[], warn: Warn): PhaseRecord[][] {
  return roots.flatMap((root) => {
    const folders = readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
    return folders.map((folder) => readTiming(root, folder, warn)).filter((phases): phases is PhaseRecord[] => phases !== null);
  });
}

function ratioCells(phases: PhaseRecord[]): string {
  const estimated = phases.filter((phase) => phase.estimateHours !== null);
  const estimate = totalOf(estimated, (phase) => phase.estimateHours!);
  const real = hours(totalOf(phases, workSeconds));
  if (estimated.length === 0 || estimate === 0) return `${MISSING} | ${real} | ${MISSING}`;
  return `${formatNumber(estimate)} | ${real} | ${formatNumber(totalOf(estimated, workSeconds) / SECONDS_PER_HOUR / estimate)}`;
}

function phaseRow(label: string, phases: PhaseRecord[], allWork: number): string {
  const seconds = [(phase: PhaseRecord) => phase.agentSeconds, (phase: PhaseRecord) => phase.execSeconds, (phase: PhaseRecord) => phase.waitSeconds, (phase: PhaseRecord) => phase.gateSeconds ?? 0];
  const times = seconds.map((read) => hours(totalOf(phases, read))).join(' | ');
  const ceremony = phases[0]!.ceremony ? 'sí' : 'no';
  return `| ${label} | ${phases.length} | ${times} | ${percent(totalOf(phases, workSeconds), allWork)} | ${ceremony} | ${ratioCells(phases)} |`;
}

function ceremonyLine(timings: PhaseRecord[][]): string {
  const complete = timings.filter((phases) => phases.every((phase) => phase.measured));
  const left = timings.length - complete.length;
  const leftText = left === 0 ? '' : `, ${left} fuera por una fase sin eventos`;
  if (complete.length === 0) return `Ceremonia: ${MISSING} (0 tareas${leftText}).`;
  const measured = complete.flat();
  const share = percent(totalOf(measured.filter((phase) => phase.ceremony), workSeconds), totalOf(measured, workSeconds));
  return `Ceremonia: ${share} del trabajo (${complete.length} tareas${leftText}).`;
}

export function phaseSection(roots: string[], warn: Warn): string[] {
  const timings = readTimings(roots, warn);
  if (timings.length === 0) return ['', HEADING, '', NO_DATA];
  const measured = timings.flat().filter((phase) => phase.measured);
  const allWork = totalOf(measured, workSeconds);
  const rows = PHASE_NAMES.map((name) => [PHASE_LABELS[name], measured.filter((phase) => phase.name === name)] as const)
    .filter(([, phases]) => phases.length > 0)
    .map(([label, phases]) => phaseRow(label, phases, allWork));
  return ['', HEADING, '', TABLE_HEADER, TABLE_RULE, ...rows, '', ceremonyLine(timings)];
}
