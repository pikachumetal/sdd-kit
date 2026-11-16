import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { readText } from '../cli/files.ts';
import { PHASE_ESTIMATE_LABELS, getFieldText, toHours, type Warn } from '../estimation/fields.ts';
import { TIMING_VERSION, type MeasuredTiming, type PhaseName, type Timing, type TimingPhase } from '../estimation/timing-file.ts';
import { breakdown, coveredMillis, kitEvents, type Commit, type PhaseTimes } from './phases.ts';
import type { Timeline, ToolCall } from './clock.ts';

const GATE_LINE = /^\s*-\s*\*\*Gate de cierre\*\*\s*:\s*`([^`]+)`/m;
const SEGMENTS = /&&|;|\|/;
const FILTER_FLAGS = new Set(['--affected']);
const FILTER_OPTIONS = new Set(['--base', '--head']);
const TASK_HEADING = /^#{2,4} Task \d+/gm;
const MARGIN_SECONDS = 60;
const MARGIN_SHARE = 0.01;

export function readGateCommand(docsPath: string): string | null {
  for (const path of ['steering/operations.md', 'operations.md', 'tech-stack.md'].map((name) => join(docsPath, name))) {
    const gate = existsSync(path) ? GATE_LINE.exec(readText(path))?.[1] : undefined;
    if (gate !== undefined) return gate;
  }
  return null;
}

// Solo se quitan las opciones que filtran: una pasada con otra `--base` sigue siendo el gate, y `--test` de `node --test` no es prescindible.
function gateWords(segment: string): string[] {
  const words = segment.trim().split(/\s+/);
  return words.filter((word, index) => !FILTER_FLAGS.has(word) && !FILTER_OPTIONS.has(word) && !FILTER_OPTIONS.has(words[index - 1] ?? ''));
}

export function isGateCall(command: string, gate: string): boolean {
  const segments = command.split(SEGMENTS).map((segment) => segment.trim().split(/\s+/));
  return gate.split(SEGMENTS).map(gateWords).every((words) => segments.some((tokens) => tokens[0] === words[0] && words.every((word) => tokens.includes(word))));
}

function planText(folder: string): string {
  const source = ['plan.md', 'spec.md'].map((name) => join(folder, name)).find((path) => existsSync(path));
  return source === undefined ? '' : readText(source);
}

function readEstimate(text: string, name: PhaseName, warn: Warn): number | null {
  return toHours(getFieldText(text, PHASE_ESTIMATE_LABELS[name]), 'plan', warn);
}

function gateSpans(timelines: Timeline[], gate: string): ToolCall[] {
  return timelines.flatMap((line) => line.calls).filter((call) => isGateCall(String(call.input.command ?? ''), gate));
}

function gateSecondsIn(phase: PhaseTimes, calls: ToolCall[] | null): number | null {
  if (calls === null || !phase.measured) return null;
  return Math.round(coveredMillis(calls, phase.window) / 1000);
}

function phaseJson(phase: PhaseTimes, gate: number | null, estimateHours: number | null): TimingPhase {
  const { name, ceremony, measured, reason, agentSeconds, execSeconds, waitSeconds, idleSeconds, tasks } = phase;
  return { name, ceremony, measured, ...(reason === undefined ? {} : { reason }), agentSeconds, execSeconds, waitSeconds, idleSeconds, gateSeconds: gate, estimateHours, ...(tasks === undefined ? {} : { tasks }) };
}

const sumOf = (phases: TimingPhase[], read: (phase: TimingPhase) => number | null): number => phases.reduce((total, phase) => total + (read(phase) ?? 0), 0);

export interface TimingInput {
  timelines: Timeline[];
  commits: Commit[];
  branch: string;
  clockSeconds: number;
  folder: string;
  docsPath: string;
  warn: Warn;
}

const phasesSeconds = ({ agentSeconds, execSeconds, waitSeconds, idleSeconds }: MeasuredTiming['totals']): number => agentSeconds + execSeconds + waitSeconds + idleSeconds;

export function buildTiming({ timelines, commits, branch, clockSeconds, folder, docsPath, warn }: TimingInput): MeasuredTiming {
  const gateCommand = readGateCommand(docsPath);
  const text = planText(folder);
  const calls = gateCommand === null ? null : gateSpans(timelines, gateCommand);
  const tasksInPlan = text.match(TASK_HEADING)?.length ?? 0;
  const phases = breakdown(timelines, kitEvents(timelines, commits), tasksInPlan).map((phase) => phaseJson(phase, gateSecondsIn(phase, calls), readEstimate(text, phase.name, warn)));
  const totals = {
    agentSeconds: sumOf(phases, (phase) => phase.agentSeconds),
    execSeconds: sumOf(phases, (phase) => phase.execSeconds),
    waitSeconds: sumOf(phases, (phase) => phase.waitSeconds),
    idleSeconds: sumOf(phases, (phase) => phase.idleSeconds),
    gateSeconds: gateCommand === null ? null : sumOf(phases, (phase) => phase.gateSeconds),
  };
  const withinMargin = Math.abs(phasesSeconds(totals) - clockSeconds) <= Math.max(MARGIN_SECONDS, clockSeconds * MARGIN_SHARE);
  return { version: TIMING_VERSION, branch, measured: true, clockSeconds, withinMargin, totals, gateCommand, phases };
}

export const unmeasuredTiming = (reason: string): Timing => ({ version: TIMING_VERSION, measured: false, reason });

export function marginWarning(timing: Timing): string | null {
  if (!timing.measured || timing.withinMargin) return null;
  return `timing.json fuera del margen: fases ${phasesSeconds(timing.totals)} s, reloj ${timing.clockSeconds} s`;
}

export function writeTiming(folder: string, timing: Timing): void {
  if (!existsSync(folder)) throw new DomainError(`no existe la carpeta del artefacto: ${folder}`);
  writeFileSync(join(folder, 'timing.json'), `${JSON.stringify(timing, null, 2)}\n`, 'utf8');
}
