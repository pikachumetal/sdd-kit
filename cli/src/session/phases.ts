import { PHASE_NAMES, type PhaseName, type TaskTimes } from '../estimation/timing-file.ts';
import type { BranchCommit } from './branches.ts';
import type { Span, Timeline } from './clock.ts';


export type Commit = BranchCommit;

interface Stamp {
  name: string;
  time: number;
}

interface TaskStamp {
  task: number;
  time: number;
}

export interface KitEvents {
  skills: Stamp[];
  taskStarts: TaskStamp[];
  taskDones: Set<number>;
  commits: Commit[];
}

export interface PhaseStarts {
  implementacion: number | null;
  revision: number | null;
  cierre: number | null;
}

export interface PhaseTimes {
  name: PhaseName;
  ceremony: boolean;
  measured: boolean;
  reason?: string;
  window: Span;
  agentSeconds: number | null;
  execSeconds: number | null;
  waitSeconds: number | null;
  idleSeconds: number | null;
  tasks?: TaskTimes[];
}

const COMMAND_SEGMENTS = /&&|;|\||\n/;
const TASK_COMMAND = /^(?:&\s*)?(?:node\s+)?["']?[^\s"']*\bsdd(?:\.js)?["']?\s+task (start|done)\s+\S+\s+(\d+)(?=\s|$)/;
const SKILL_PREFIX = /^sdd-kit:/;
const earliest = (times: number[]): number | null => (times.length === 0 ? null : Math.min(...times));
const byTime = <T extends { time: number }>(first: T, second: T): number => first.time - second.time;

function readCall(events: KitEvents, call: Timeline['calls'][number]): void {
  if (call.name === 'Skill') events.skills.push({ name: String(call.input.skill ?? '').replace(SKILL_PREFIX, ''), time: call.from });
  for (const segment of String(call.input.command ?? '').split(COMMAND_SEGMENTS)) {
    const match = TASK_COMMAND.exec(segment.trim());
    if (match === null) continue;
    if (match[1] === 'done') events.taskDones.add(Number(match[2]));
    else events.taskStarts.push({ task: Number(match[2]), time: call.from });
  }
}

export function kitEvents(timelines: Timeline[], commits: Commit[]): KitEvents {
  const events: KitEvents = { skills: [], taskStarts: [], taskDones: new Set(), commits };
  timelines.flatMap((line) => line.calls).forEach((call) => readCall(events, call));
  events.skills.sort(byTime);
  events.taskStarts.sort(byTime);
  return events;
}

const skillTimes = (events: KitEvents, ...names: string[]): number[] => events.skills.filter(({ name }) => names.includes(name)).map(({ time }) => time);

function closingStart(events: KitEvents, after: number): number | null {
  const closingCommits = events.commits.filter(({ closing }) => closing).map(({ time }) => time);
  return earliest([...skillTimes(events, 'sdd-archive', 'sdd-retro'), ...closingCommits].filter((time) => time > after));
}

function reviewStart(events: KitEvents, after: number, closing: number | null): number | null {
  const lastTask = events.taskStarts.at(-1)?.time ?? -Infinity;
  const verifies = skillTimes(events, 'sdd-verify').filter((time) => time > Math.max(lastTask, after) && time < (closing ?? Infinity));
  return verifies.at(-1) ?? null;
}

function implementationStart(events: KitEvents): number | null {
  const opening = events.commits.find(({ closing }) => !closing)?.time;
  const firstTask = events.taskStarts[0]?.time;
  const stamps = [...skillTimes(events, 'sdd-implement'), opening, firstTask].filter((time): time is number => time !== undefined);
  return earliest(stamps);
}

export function phaseStarts(events: KitEvents): PhaseStarts {
  const implementacion = implementationStart(events);
  const after = implementacion ?? -Infinity;
  const cierre = closingStart(events, after);
  return { implementacion, revision: reviewStart(events, after, cierre), cierre };
}

function merged(spans: Span[]): Span[] {
  const result: Span[] = [];
  for (const span of [...spans].sort((first, second) => first.from - second.from)) {
    const last = result.at(-1);
    if (last !== undefined && span.from <= last.to) last.to = Math.max(last.to, span.to);
    else result.push({ ...span });
  }
  return result;
}

const clipped = (spans: Span[], window: Span): Span[] =>
  spans.map(({ from, to }) => ({ from: Math.max(from, window.from), to: Math.min(to, window.to) })).filter(({ from, to }) => to > from);

export const coveredMillis = (spans: Span[], window: Span): number => merged(clipped(spans, window)).reduce((total, { from, to }) => total + to - from, 0);

interface Millis {
  agent: number;
  exec: number;
  wait: number;
  idle: number;
}

function timesIn(line: Timeline, window: Span): Millis {
  const inLine = { from: Math.max(window.from, line.from), to: Math.min(window.to, line.to) };
  if (inLine.to <= inLine.from) return { agent: 0, exec: 0, wait: 0, idle: 0 };
  const wait = coveredMillis(line.waitSpans, inLine);
  const idle = coveredMillis(line.idleSpans, inLine);
  const stopped = coveredMillis([...line.waitSpans, ...line.idleSpans], inLine);
  const exec = coveredMillis([...line.runSpans, ...line.waitSpans, ...line.idleSpans], inLine) - stopped;
  return { agent: inLine.to - inLine.from - stopped - exec, exec, wait, idle };
}

const toSeconds = (millis: number): number => Math.round(millis / 1000);

function secondsIn(timelines: Timeline[], window: Span): { agentSeconds: number; execSeconds: number; waitSeconds: number; idleSeconds: number } {
  const totals = timelines.map((line) => timesIn(line, window)).reduce(
    (sum, item) => ({ agent: sum.agent + item.agent, exec: sum.exec + item.exec, wait: sum.wait + item.wait, idle: sum.idle + item.idle }),
    { agent: 0, exec: 0, wait: 0, idle: 0 },
  );
  return { agentSeconds: toSeconds(totals.agent), execSeconds: toSeconds(totals.exec), waitSeconds: toSeconds(totals.wait), idleSeconds: toSeconds(totals.idle) };
}

interface TaskSpan extends Span {
  task: number;
  source: TaskTimes['source'];
  done: boolean;
}

function spansFromEvents(events: KitEvents, end: number): TaskSpan[] {
  const firstStarts = new Map<number, TaskStamp>();
  for (const stamp of events.taskStarts) if (!firstStarts.has(stamp.task)) firstStarts.set(stamp.task, stamp);
  const starts = [...firstStarts.values()];
  return starts.map(({ task, time }, index) => ({ task, source: 'events', done: events.taskDones.has(task), from: time, to: starts[index + 1]?.time ?? end }));
}

// Con las tasks sin eventos, la historia de la rama las da: apertura, un commit por task y cierre.
function spansFromCommits(events: KitEvents, window: Span, tasksInPlan: number): TaskSpan[] {
  const interior = events.commits.filter(({ closing }) => !closing).slice(1);
  if (tasksInPlan === 0 || interior.length !== tasksInPlan) return [];
  return interior.map(({ time }, index) => ({ task: index + 1, source: 'commits', done: true, from: interior[index - 1]?.time ?? window.from, to: Math.min(time, window.to) }));
}

interface TaskSource {
  events: KitEvents;
  window: Span;
  tasksInPlan: number;
}

function tasksIn(timelines: Timeline[], { events, window, tasksInPlan }: TaskSource): TaskTimes[] | undefined {
  const spans = events.taskStarts.length > 0 ? spansFromEvents(events, window.to) : spansFromCommits(events, window, tasksInPlan);
  if (spans.length === 0) return undefined;
  return spans.map(({ task, source, done, from, to }) => {
    const { agentSeconds, execSeconds, waitSeconds } = secondsIn(timelines, { from, to });
    return { task, source, done, agentSeconds, execSeconds, waitSeconds };
  });
}

function emptyPhase(name: PhaseName, previous: PhaseName): PhaseTimes {
  const window = { from: 0, to: 0 };
  const nothing = { agentSeconds: null, execSeconds: null, waitSeconds: null, idleSeconds: null };
  return { name, ceremony: name !== 'implementacion', measured: false, reason: `sin eventos: su tiempo queda en ${previous}`, window, ...nothing };
}

export function breakdown(timelines: Timeline[], events: KitEvents, tasksInPlan: number): PhaseTimes[] {
  const starts = phaseStarts(events);
  const opens: Record<PhaseName, number | null> = { apertura: -Infinity, ...starts };
  const present = PHASE_NAMES.filter((name) => opens[name] !== null);
  return PHASE_NAMES.map((name) => {
    if (opens[name] === null) return emptyPhase(name, present.filter((other) => PHASE_NAMES.indexOf(other) < PHASE_NAMES.indexOf(name)).at(-1)!);
    const next = present[present.indexOf(name) + 1];
    const window = { from: opens[name]!, to: next === undefined ? Infinity : opens[next]! };
    const tasks = name === 'implementacion' ? tasksIn(timelines, { events, window, tasksInPlan }) : undefined;
    return { name, ceremony: name !== 'implementacion', measured: true, window, ...secondsIn(timelines, window), ...(tasks === undefined ? {} : { tasks }) };
  });
}
