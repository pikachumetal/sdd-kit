import { isRecord, sameText, type Json } from '../cli/records.ts';
import { readText } from '../cli/files.ts';
import { inRange, readResponses, type Selector } from './usage.ts';

export interface Clock {
  hours: number;
  clockHours: number;
  start: string;
  waitMinutes: number;
  waits: number;
  idleMinutes: number;
  idleGaps: number;
  sessions: number;
}

interface Timeline {
  first: number;
  last: number;
  waitMillis: number;
  waits: number;
  idleMillis: number;
  idleGaps: number;
}

interface WaitState {
  turnClosedAt: number | null;
  previous: number | null;
  questions: Map<string, number>;
  answered: Set<string>;
  running: Set<string>;
  waitMillis: number;
  waits: number;
  idleMillis: number;
  idleGaps: number;
}

const TASK_NOTIFICATION = '<task-notification>';
const HARNESS_PREFIXES = [TASK_NOTIFICATION, '<system-reminder>', '<local-command-stdout>', '<local-command-stderr>', '<local-command-caveat>'];
const TURN_CLOSERS = ['end_turn', 'stop_sequence'];
const MILLIS_PER_HOUR = 3_600_000;
const IDLE_MILLIS = 60 * 60_000;

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

function addWait(state: WaitState, since: number, until: number): void {
  state.waitMillis += until - since;
  state.waits += 1;
}

function addIdle(state: WaitState, time: number): void {
  const gap = state.previous === null ? 0 : time - state.previous;
  if (state.turnClosedAt !== null || state.running.size > 0 || gap <= IDLE_MILLIS) return;
  state.idleMillis += gap;
  state.idleGaps += 1;
}

function readAgentEntry(state: WaitState, entry: Json, time: number): void {
  state.turnClosedAt = closesTurn(entry) ? time : null;
  for (const block of blocksOf(entry)) {
    if (!sameText(block.type, 'tool_use')) continue;
    if (state.answered.has(String(block.id))) state.running.add(String(block.id));
    if (sameText(block.name, 'AskUserQuestion')) state.questions.set(String(block.id), time);
  }
}

function readUserEntry(state: WaitState, entry: Json, time: number): void {
  for (const block of blocksOf(entry)) {
    if (!sameText(block.type, 'tool_result')) continue;
    state.running.delete(String(block.tool_use_id));
    const asked = state.questions.get(String(block.tool_use_id));
    if (asked === undefined) continue;
    addWait(state, asked, time);
    state.questions.delete(String(block.tool_use_id));
  }
  if (state.turnClosedAt === null) return;
  if (isTypedByUser(entry)) addWait(state, state.turnClosedAt, time);
  // El hueco que acaba en el aviso de una tarea en segundo plano es trabajo, no espera al dev-lead.
  if (isTypedByUser(entry) || isTaskNotification(entry)) state.turnClosedAt = null;
}

interface Range {
  from?: number;
  to?: number;
}

const rangeOf = ({ until, window }: Selector): Range => (window === undefined ? { to: until } : { from: window.from, to: window.to });

function timeline(file: string, range: Range): Timeline | null {
  const all = readText(file).split(/\r\n|\n|\r/).map(parseEntry).filter((entry): entry is Json => entry !== null);
  const entries = all.filter((entry) => inRange(Date.parse(String(entry.timestamp)), range.from, range.to));
  if (entries.length === 0) return null;
  const state: WaitState = {
    turnClosedAt: null,
    previous: null,
    questions: new Map(),
    answered: answeredTools(entries),
    running: new Set(),
    waitMillis: 0,
    waits: 0,
    idleMillis: 0,
    idleGaps: 0,
  };
  const times = entries.map((entry) => Date.parse(String(entry.timestamp)));
  entries.forEach((entry, index) => {
    addIdle(state, times[index]!);
    if (sameText(entry.type, 'assistant')) readAgentEntry(state, entry, times[index]!);
    else readUserEntry(state, entry, times[index]!);
    state.previous = times[index]!;
  });
  const { waitMillis, waits, idleMillis, idleGaps } = state;
  return { first: range.from ?? times.reduce(earlier), last: times.reduce(later), waitMillis, waits, idleMillis, idleGaps };
}

export const formatMinute = (millis: number): string => `${new Date(millis).toISOString().slice(0, 16)}Z`;

// En la ventana, los transcripts se solapan con su inicio común: el reloj es de pared, no la suma de cada uno.
function clockMillisOf(timelines: Timeline[], { window }: Selector): number {
  if (window !== undefined) return Math.max(...timelines.map((item) => item.last)) - window.from;
  return timelines.reduce((total, item) => total + item.last - item.first, 0);
}

export function readClock(files: string[], selector: Selector): Clock | null {
  const timelines = files
    .filter((file) => readResponses(file, selector).length > 0)
    .map((file) => timeline(file, rangeOf(selector)))
    .filter((item): item is Timeline => item !== null);
  if (timelines.length === 0) return null;
  const clockMillis = clockMillisOf(timelines, selector);
  const waitMillis = timelines.reduce((total, item) => total + item.waitMillis, 0);
  const idleMillis = timelines.reduce((total, item) => total + item.idleMillis, 0);
  return {
    hours: roundToHundredths((clockMillis - waitMillis - idleMillis) / MILLIS_PER_HOUR),
    clockHours: roundToHundredths(clockMillis / MILLIS_PER_HOUR),
    start: formatMinute(timelines.map((item) => item.first).reduce(earlier)),
    waitMinutes: Math.round(waitMillis / 60_000),
    waits: timelines.reduce((total, item) => total + item.waits, 0),
    idleMinutes: Math.round(idleMillis / 60_000),
    idleGaps: timelines.reduce((total, item) => total + item.idleGaps, 0),
    sessions: timelines.length,
  };
}
