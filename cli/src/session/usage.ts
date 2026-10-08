import { compare, sameText, toCount, type Json } from '../cli/records.ts';
import { readText } from '../cli/files.ts';

export const CATEGORIES = ['input', 'cacheWrite5m', 'cacheWrite1h', 'cacheRead', 'output'] as const;
export type Category = (typeof CATEGORIES)[number];
export type Usage = Record<Category, number>;
export type ModelTotals = Map<string, Usage>;

export interface Response {
  model: string;
  usage: Usage;
  times: string[];
  lastBlock: unknown;
}


function parseLine(text: string): Json | null {
  if (!text.toLowerCase().includes('"assistant"')) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Json) : null;
  } catch {
    return null;
  }
}

function isCounted(line: Json, branch: string): boolean {
  if (!sameText(line.type, 'assistant') || line.message?.usage == null) return false;
  if (sameText(line.message.model, '<synthetic>')) return false;
  return branch === '' || sameText(line.gitBranch, branch);
}

function toUsage(raw: Json): Usage {
  const split = raw.cache_creation;
  const hasSplit = split != null;
  return {
    input: toCount(raw.input_tokens),
    cacheWrite5m: toCount(hasSplit ? split.ephemeral_5m_input_tokens : raw.cache_creation_input_tokens),
    cacheWrite1h: toCount(hasSplit ? split.ephemeral_1h_input_tokens : 0),
    cacheRead: toCount(raw.cache_read_input_tokens),
    output: toCount(raw.output_tokens),
  };
}

function modelKey(message: Json): string {
  const model = String(message.model ?? '');
  return sameText(message.usage.speed, 'fast') ? `${model}:fast` : model;
}

function lastBlockOf(message: Json): unknown {
  return Array.isArray(message.content) ? message.content.at(-1) : message.content;
}

function mergeResponse(responses: Map<string, Response>, line: Json): void {
  const key = String(line.message.id || line.uuid).toLowerCase();
  const usage = toUsage(line.message.usage);
  const existing = responses.get(key);
  const time = line.timestamp ? [String(line.timestamp)] : [];
  if (existing === undefined) {
    responses.set(key, { model: modelKey(line.message), usage, times: time, lastBlock: lastBlockOf(line.message) });
    return;
  }
  for (const category of CATEGORIES) existing.usage[category] = Math.max(existing.usage[category], usage[category]);
  existing.times.push(...time);
  existing.lastBlock = lastBlockOf(line.message);
}

export function readResponses(file: string, branch: string): Response[] {
  const responses = new Map<string, Response>();
  for (const text of readText(file).split(/\r\n|\n|\r/)) {
    const line = parseLine(text);
    if (line !== null && isCounted(line, branch)) mergeResponse(responses, line);
  }
  return [...responses.values()];
}

export function addUsage(totals: ModelTotals, model: string, usage: Usage): void {
  const current = totals.get(model) ?? { input: 0, cacheWrite5m: 0, cacheWrite1h: 0, cacheRead: 0, output: 0 };
  for (const category of CATEGORIES) current[category] += usage[category];
  totals.set(model, current);
}

export function modelTotals(responses: Response[]): ModelTotals {
  const totals: ModelTotals = new Map();
  for (const response of responses) addUsage(totals, response.model, response.usage);
  return totals;
}

export function mergeTotals(all: ModelTotals[]): ModelTotals {
  const merged: ModelTotals = new Map();
  for (const totals of all) totals.forEach((usage, model) => addUsage(merged, model, usage));
  return merged;
}

export const tokenSum = (usage: Usage): number => CATEGORIES.reduce((sum, category) => sum + usage[category], 0);

export const totalTokens = (totals: ModelTotals): number => [...totals.values()].reduce((sum, usage) => sum + tokenSum(usage), 0);

export function modelsByTokens(totals: ModelTotals): string[] {
  return [...totals.keys()].sort((first, second) => tokenSum(totals.get(second)!) - tokenSum(totals.get(first)!));
}

const toMillis = (times: string[]): number[] => times.map((time) => Date.parse(time)).filter(Number.isFinite);

function roundHalfEven(value: number): number {
  const rounded = Math.round(value);
  return value % 1 === 0.5 && rounded % 2 !== 0 ? rounded - 1 : rounded;
}

export function elapsedMinutes(responses: Response[]): number {
  const times = toMillis(responses.flatMap((response) => response.times)).sort((first, second) => first - second);
  if (times.length < 2) return 0;
  return roundHalfEven((times[times.length - 1] - times[0]) / 60000);
}

const latestTime = (response: Response): number => Math.max(-Infinity, ...toMillis(response.times));

// Un subagente que terminó acaba en texto o en SubagentHandback; si su último bloque es otra herramienta o un
// razonamiento, sigue trabajando y lo medido es parcial. stop_reason no sirve: muchas líneas no lo llevan.
export function isInProgress(responses: Response[]): boolean {
  const last = [...responses].sort((first, second) => compare(latestTime(first), latestTime(second))).at(-1);
  const block = last?.lastBlock as Json | null | undefined;
  return !sameText(block?.type, 'text') && !sameText(block?.name, 'SubagentHandback');
}
