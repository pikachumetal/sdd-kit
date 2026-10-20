import { isRecord, sameText, type Json } from '../cli/records.ts';
import { readText } from '../cli/files.ts';
import { inRange, readResponses, type Selector } from './usage.ts';

export interface Clock {
  hours: number;
  clockHours: number;
  start: string;
  waitMinutes: number;
  waits: number;
  sessions: number;
}

interface Timeline {
  first: number;
  last: number;
  waitMillis: number;
  waits: number;
}

interface WaitState {
  lastAgent: number | null;
  questions: Map<string, number>;
  waitMillis: number;
  waits: number;
}

const HARNESS_PREFIXES = ['<task-notification>', '<system-reminder>', '<local-command-stdout>', '<local-command-stderr>', '<local-command-caveat>'];
const MILLIS_PER_HOUR = 3_600_000;

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
  const text = typedText(entry)?.trim();
  return text !== undefined && text !== '' && !HARNESS_PREFIXES.some((prefix) => text.startsWith(prefix));
}

function addWait(state: WaitState, since: number, until: number): void {
  state.waitMillis += until - since;
  state.waits += 1;
}

function readAgentEntry(state: WaitState, entry: Json, time: number): void {
  state.lastAgent = time;
  for (const block of blocksOf(entry)) {
    if (sameText(block.type, 'tool_use') && sameText(block.name, 'AskUserQuestion')) state.questions.set(String(block.id), time);
  }
}

function readUserEntry(state: WaitState, entry: Json, time: number): void {
  for (const block of blocksOf(entry)) {
    const asked = state.questions.get(String(block.tool_use_id));
    if (!sameText(block.type, 'tool_result') || asked === undefined) continue;
    addWait(state, asked, time);
    state.questions.delete(String(block.tool_use_id));
  }
  if (!isTypedByUser(entry) || state.lastAgent === null) return;
  addWait(state, state.lastAgent, time);
  state.lastAgent = null;
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
  const state: WaitState = { lastAgent: null, questions: new Map(), waitMillis: 0, waits: 0 };
  const times = entries.map((entry) => Date.parse(String(entry.timestamp)));
  entries.forEach((entry, index) => {
    if (sameText(entry.type, 'assistant')) readAgentEntry(state, entry, times[index]!);
    else readUserEntry(state, entry, times[index]!);
  });
  return { first: range.from ?? times.reduce(earlier), last: times.reduce(later), waitMillis: state.waitMillis, waits: state.waits };
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
  return {
    hours: roundToHundredths((clockMillis - waitMillis) / MILLIS_PER_HOUR),
    clockHours: roundToHundredths(clockMillis / MILLIS_PER_HOUR),
    start: formatMinute(timelines.map((item) => item.first).reduce(earlier)),
    waitMinutes: Math.round(waitMillis / 60_000),
    waits: timelines.reduce((total, item) => total + item.waits, 0),
    sessions: timelines.length,
  };
}
