import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { caseInsensitiveGet, isRecord, type Json } from '../cli/records.ts';
import { parseJsonFile } from '../cli/json-file.ts';
import type { Session } from './session.ts';
import { CATEGORIES, mergeTotals, type ModelTotals, type Usage } from './usage.ts';

export type SessionCost =
  | { kind: 'unpriced' }
  | { kind: 'missing'; models: string[] }
  | { kind: 'priced'; thread: number; subagents: number; hasDispatches: boolean };

export function readPrices(worktreePath: string): Json | null {
  const configPath = join(worktreePath, '.docs/sdd/sdd-kit.json');
  if (!existsSync(configPath)) return null;
  const config = parseJsonFile(configPath);
  const pricing = isRecord(config) ? caseInsensitiveGet(config, 'pricing') : undefined;
  const prices = isRecord(pricing) ? caseInsensitiveGet(pricing, 'usdPerMillionTokens') : undefined;
  return isRecord(prices) ? prices : null;
}

export function modelCost(usage: Usage, modelPrices: unknown): number | null {
  if (!isRecord(modelPrices)) return null;
  let cost = 0;
  for (const category of CATEGORIES) {
    if (usage[category] === 0) continue;
    const price = caseInsensitiveGet(modelPrices, category);
    if (price == null || Number.isNaN(Number(price))) return null;
    cost += (usage[category] * Number(price)) / 1000000;
  }
  return cost;
}

export const costOfModel = (usage: Usage, model: string, prices: Json): number | null => modelCost(usage, caseInsensitiveGet(prices, model));

function scopeCost(totals: ModelTotals, prices: Json): { sum: number; missing: string[] } {
  let sum = 0;
  const missing: string[] = [];
  for (const [model, usage] of totals) {
    const cost = costOfModel(usage, model, prices);
    if (cost === null) missing.push(model);
    else sum += cost;
  }
  return { sum, missing };
}

export function sessionCost(session: Session, prices: Json | null): SessionCost {
  if (prices === null) return { kind: 'unpriced' };
  const thread = scopeCost(session.thread, prices);
  const subagents = scopeCost(mergeTotals(session.dispatches.map((dispatch) => dispatch.totals)), prices);
  const missing = [...new Set([...thread.missing, ...subagents.missing])];
  if (missing.length > 0) return { kind: 'missing', models: missing };
  return { kind: 'priced', thread: thread.sum, subagents: subagents.sum, hasDispatches: session.dispatches.length > 0 };
}
