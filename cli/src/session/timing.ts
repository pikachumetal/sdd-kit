import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readText } from '../cli/files.ts';
import { getFieldText, toHours } from '../estimation/fields.ts';
import { breakdown, coveredMillis, kitEvents, type Commit, type PhaseName, type PhaseTimes } from './phases.ts';
import type { Timeline, ToolCall } from './clock.ts';

const GATE_LINE = /^\s*-\s*\*\*Gate de cierre\*\*\s*:\s*`([^`]+)`/m;
const SEGMENTS = /&&|;|\|/;
const TASK_HEADING = /^#{2,4} Task \d+/gm;
const MARGIN_SECONDS = 60;
const MARGIN_SHARE = 0.01;
const VERSION = 1;

const ESTIMATE_LABELS: Record<PhaseName, string> = {
  apertura: String.raw`Esfuerzo spec \+ plan|Esfuerzo spec`,
  implementacion: 'Estimaci[oó]n de implementaci[oó]n',
  revision: 'Estimaci[oó]n de revisi[oó]n',
  cierre: 'Estimaci[oó]n de cierre',
};

export type Timing = Record<string, unknown>;

export function readGateCommand(docsPath: string): string | null {
  for (const path of ['steering/operations.md', 'operations.md', 'tech-stack.md'].map((name) => join(docsPath, name))) {
    const gate = existsSync(path) ? GATE_LINE.exec(readText(path))?.[1] : undefined;
    if (gate !== undefined) return gate;
  }
  return null;
}

// Las opciones van detrás de las tareas: una pasada con otra `--base` o con `--force` sigue siendo el gate.
function gateWords(gate: string): string[] {
  const words = gate.trim().split(/\s+/);
  const firstOption = words.findIndex((word) => word.startsWith('-'));
  return firstOption === -1 ? words : words.slice(0, firstOption);
}

export function isGateCall(command: string, gate: string): boolean {
  const words = gateWords(gate);
  return command.split(SEGMENTS).some((segment) => {
    const tokens = segment.trim().split(/\s+/);
    return tokens[0] === words[0] && words.every((word) => tokens.includes(word));
  });
}

function planText(folder: string): string {
  const candidates = ['plan.md', 'spec.md'].map((name) => join(folder, name)).filter((path) => existsSync(path));
  return candidates.map((path) => readText(path)).join('\n');
}

function readEstimate(text: string, name: PhaseName): number | null {
  return toHours(getFieldText(text, ESTIMATE_LABELS[name]), 'plan', () => undefined);
}

function gateSpans(timelines: Timeline[], gate: string): ToolCall[] {
  return timelines.flatMap((line) => line.calls).filter((call) => isGateCall(String(call.input.command ?? ''), gate));
}

function gateSecondsIn(phase: PhaseTimes, calls: ToolCall[] | null): number | null {
  if (calls === null || !phase.measured) return null;
  return Math.round(coveredMillis(calls, phase.window) / 1000);
}

function phaseJson(phase: PhaseTimes, gate: number | null, estimateHours: number | null): Timing {
  const { name, ceremony, measured, reason, agentSeconds, execSeconds, waitSeconds, idleSeconds, tasks } = phase;
  return { name, ceremony, measured, ...(reason === undefined ? {} : { reason }), agentSeconds, execSeconds, waitSeconds, idleSeconds, gateSeconds: gate, estimateHours, ...(tasks === undefined ? {} : { tasks }) };
}

const sumOf = (phases: Timing[], key: string): number => phases.reduce((total, phase) => total + Number(phase[key] ?? 0), 0);

export interface TimingInput {
  timelines: Timeline[];
  commits: Commit[];
  branch: string;
  clockSeconds: number;
  folder: string;
  docsPath: string;
}

export function buildTiming({ timelines, commits, branch, clockSeconds, folder, docsPath }: TimingInput): Timing {
  const gateCommand = readGateCommand(docsPath);
  const text = planText(folder);
  const calls = gateCommand === null ? null : gateSpans(timelines, gateCommand);
  const tasksInPlan = text.match(TASK_HEADING)?.length ?? 0;
  const phases = breakdown(timelines, kitEvents(timelines, commits), tasksInPlan).map((phase) => phaseJson(phase, gateSecondsIn(phase, calls), readEstimate(text, phase.name)));
  const [agentSeconds, execSeconds, waitSeconds, idleSeconds] = ['agentSeconds', 'execSeconds', 'waitSeconds', 'idleSeconds'].map((key) => sumOf(phases, key));
  const measuredSeconds = agentSeconds! + execSeconds! + waitSeconds! + idleSeconds!;
  const withinMargin = Math.abs(measuredSeconds - clockSeconds) <= Math.max(MARGIN_SECONDS, clockSeconds * MARGIN_SHARE);
  const totals = { agentSeconds, execSeconds, waitSeconds, idleSeconds, gateSeconds: gateCommand === null ? null : sumOf(phases, 'gateSeconds') };
  return { version: VERSION, branch, measured: true, clockSeconds, withinMargin, totals, gateCommand, phases };
}

export const unmeasuredTiming = (reason: string): Timing => ({ version: VERSION, measured: false, reason });

export function marginWarning(timing: Timing): string | null {
  if (timing.measured !== true || timing.withinMargin === true) return null;
  const totals = timing.totals as Record<string, number>;
  const phases = totals.agentSeconds! + totals.execSeconds! + totals.waitSeconds! + totals.idleSeconds!;
  return `timing.json fuera del margen: fases ${phases} s, reloj ${String(timing.clockSeconds)} s`;
}

export function writeTiming(folder: string, timing: Timing): void {
  writeFileSync(join(folder, 'timing.json'), `${JSON.stringify(timing, null, 2)}\n`, 'utf8');
}
