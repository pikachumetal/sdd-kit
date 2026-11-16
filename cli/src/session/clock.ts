import { isRecord, sameText, type Json } from '../cli/records.ts';
import { readText } from '../cli/files.ts';
import { inRange, readResponses, type Selector } from './usage.ts';

export interface Clock {
  clockMillis: number;
  hours: number;
  clockHours: number;
  start: string;
  waitMinutes: number;
  waits: number;
  idleMinutes: number;
  idleGaps: number;
  sessions: number;
}

export interface Span {
  from: number;
  to: number;
}

export interface ToolCall extends Span {
  name: string;
  input: Json;
}

export interface Timeline extends Span {
  waitSpans: Span[];
  idleSpans: Span[];
  runSpans: Span[];
  calls: ToolCall[];
}

interface ClockState {
  turnClosedAt: number | null;
  previous: number | null;
  questions: Map<string, number>;
  answered: Set<string>;
  running: Map<string, number>;
  calls: Map<string, ToolCall>;
  waitSpans: Span[];
  idleSpans: Span[];
  runSpans: Span[];
}

const TASK_NOTIFICATION = '<task-notification>';
const HARNESS_PREFIXES = [TASK_NOTIFICATION, '<system-reminder>', '<local-command-stdout>', '<local-command-stderr>', '<local-command-caveat>'];
const TURN_CLOSERS = ['end_turn', 'stop_sequence'];
const MILLIS_PER_MINUTE = 60_000;
const MILLIS_PER_HOUR = 60 * MILLIS_PER_MINUTE;
const IDLE_MILLIS = MILLIS_PER_HOUR;

const roundToHundredths = (value: number): number => Math.round(value * 100) / 100;
const earlier = (first: number, second: number): number => Math.min(first, second);
const later = (first: number, second: number): number => Math.max(first, second);

function parseEntry(text: string): Json | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isRecord(parsed) || !(sameText(parsed.type, 'user') || sameText(parsed.type, 'assistant'))) return null;
    return Number.isFinite(Date.parse(String(parsed.timestamp))) ? (parsed as Json) : null;
  } catch {
    return null;
  }
}

const blocksOf = (entry: Json): Json[] => (Array.isArray(entry.message?.content) ? entry.message.content : []);

function typedText(entry: Json): string | null {
  if (entry.isMeta === true) return null;
  const content = entry.message?.content;
  if (typeof content === 'string') return content;
  const blocks = blocksOf(entry);
  if (blocks.length === 0 || blocks.some((block) => sameText(block.type, 'tool_result'))) return null;
  return blocks.filter((block) => sameText(block.type, 'text')).map((block) => String(block.text ?? '')).join('');
}

function isTypedByUser(entry: Json): boolean {
  if (entry.isCompactSummary === true) return false;
  const text = typedText(entry)?.trim();
  return text !== undefined && text !== '' && !HARNESS_PREFIXES.some((prefix) => text.startsWith(prefix));
}

const isTaskNotification = (entry: Json): boolean => typedText(entry)?.trim().startsWith(TASK_NOTIFICATION) === true;

const closesTurn = (entry: Json): boolean => TURN_CLOSERS.some((reason) => sameText(entry.message?.stop_reason, reason));

// Una llamada sin resultado (sesión cortada) no está en curso: si lo estuviera, la noche tras el corte contaría como trabajo.
function answeredTools(entries: Json[]): Set<string> {
  const results = entries.flatMap((entry) => blocksOf(entry).filter((block) => sameText(block.type, 'tool_result')));
  return new Set(results.map((block) => String(block.tool_use_id)));
}

function addIdle(state: ClockState, entry: Json, time: number): void {
  const gap = state.previous === null ? 0 : time - state.previous;
  if (state.turnClosedAt !== null || state.running.size > 0 || gap <= IDLE_MILLIS || isTaskNotification(entry)) return;
  state.idleSpans.push({ from: state.previous!, to: time });
}

function readAgentEntry(state: ClockState, entry: Json, time: number): void {
  state.turnClosedAt = closesTurn(entry) ? time : null;
  for (const block of blocksOf(entry)) {
    if (!sameText(block.type, 'tool_use')) continue;
    const id = String(block.id);
    state.calls.set(id, { name: String(block.name), input: { skill: block.input?.skill, command: block.input?.command }, from: time, to: time });
    if (state.answered.has(id)) state.running.set(id, time);
    if (sameText(block.name, 'AskUserQuestion')) state.questions.set(id, time);
  }
}

// Una pregunta al usuario es espera, no ejecución: lo que tarda es el dev-lead.
function closeTool(state: ClockState, id: string, time: number): void {
  const started = state.running.get(id);
  state.running.delete(id);
  const call = state.calls.get(id);
  if (call !== undefined) call.to = time;
  const asked = state.questions.get(id);
  state.questions.delete(id);
  if (asked !== undefined) state.waitSpans.push({ from: asked, to: time });
  else if (started !== undefined) state.runSpans.push({ from: started, to: time });
}

function readUserEntry(state: ClockState, entry: Json, time: number): void {
  for (const block of blocksOf(entry)) {
    if (!sameText(block.type, 'tool_result')) continue;
    closeTool(state, String(block.tool_use_id), time);
  }
  if (state.turnClosedAt === null) return;
  if (isTypedByUser(entry)) state.waitSpans.push({ from: state.turnClosedAt, to: time });
  if (isTaskNotification(entry)) state.runSpans.push({ from: state.turnClosedAt, to: time });
  // El hueco que acaba en el aviso de una tarea en segundo plano es trabajo, no espera al dev-lead.
  if (isTypedByUser(entry) || isTaskNotification(entry)) state.turnClosedAt = null;
}

interface Range {
  from?: number;
  to?: number;
}

const rangeOf = ({ until, window }: Selector): Range => (window === undefined ? { to: until } : { from: window.from, to: window.to });

function initialState(entries: Json[]): ClockState {
  return {
    turnClosedAt: null,
    previous: null,
    questions: new Map(),
    answered: answeredTools(entries),
    running: new Map(),
    calls: new Map(),
    waitSpans: [],
    idleSpans: [],
    runSpans: [],
  };
}

function timeline(file: string, range: Range): Timeline | null {
  const all = readText(file).split(/\r\n|\n|\r/).map(parseEntry).filter((entry): entry is Json => entry !== null);
  const entries = all.filter((entry) => inRange(Date.parse(String(entry.timestamp)), range.from, range.to));
  if (entries.length === 0) return null;
  const state = initialState(entries);
  const times = entries.map((entry) => Date.parse(String(entry.timestamp)));
  entries.forEach((entry, index) => {
    addIdle(state, entry, times[index]!);
    if (sameText(entry.type, 'assistant')) readAgentEntry(state, entry, times[index]!);
    else readUserEntry(state, entry, times[index]!);
    state.previous = times[index]!;
  });
  const { waitSpans, idleSpans, runSpans, calls } = state;
  return { from: range.from ?? times.reduce(earlier), to: times.reduce(later), waitSpans, idleSpans, runSpans, calls: [...calls.values()] };
}

export const formatMinute = (millis: number): string => `${new Date(millis).toISOString().slice(0, 16)}Z`;

// En la ventana, los transcripts se solapan con su inicio común: el reloj es de pared, no la suma de cada uno.
function clockMillisOf(timelines: Timeline[], { window }: Selector): number {
  if (window !== undefined) return Math.max(...timelines.map((item) => item.to)) - window.from;
  return timelines.reduce((total, item) => total + item.to - item.from, 0);
}

const spansMillis = (spans: Span[]): number => spans.reduce((total, span) => total + span.to - span.from, 0);

export function readTimelines(files: string[], selector: Selector): Timeline[] {
  return files
    .filter((file) => readResponses(file, selector).length > 0)
    .map((file) => timeline(file, rangeOf(selector)))
    .filter((item): item is Timeline => item !== null);
}

export function clockOf(timelines: Timeline[], selector: Selector): Clock | null {
  if (timelines.length === 0) return null;
  const clockMillis = clockMillisOf(timelines, selector);
  const waitMillis = timelines.reduce((total, item) => total + spansMillis(item.waitSpans), 0);
  const idleMillis = timelines.reduce((total, item) => total + spansMillis(item.idleSpans), 0);
  return {
    clockMillis,
    hours: roundToHundredths((clockMillis - waitMillis - idleMillis) / MILLIS_PER_HOUR),
    clockHours: roundToHundredths(clockMillis / MILLIS_PER_HOUR),
    start: formatMinute(timelines.map((item) => item.from).reduce(earlier)),
    waitMinutes: Math.round(waitMillis / MILLIS_PER_MINUTE),
    waits: timelines.reduce((total, item) => total + item.waitSpans.length, 0),
    idleMinutes: Math.round(idleMillis / MILLIS_PER_MINUTE),
    idleGaps: timelines.reduce((total, item) => total + item.idleSpans.length, 0),
    sessions: timelines.length,
  };
}
