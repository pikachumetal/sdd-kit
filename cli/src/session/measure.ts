import type { Json } from '../cli/records.ts';
import { resolve } from 'node:path';
import { readPrices, sessionCost, type SessionCost } from './cost.ts';
import { notMeasuredLines, reportLines, mainModel } from './format.ts';
import { readSession, type Session } from './session.ts';
import { defaultProjectsRoots, transcriptFolders } from './transcripts.ts';
import { mergeTotals, modelsByTokens, tokenSum, totalTokens, type ModelTotals } from './usage.ts';

export interface MeasureOptions {
  path: string;
  branch: string;
  projectsRoots: string[];
}

export type Measurement =
  | { kind: 'notMeasured'; reason: string }
  | { kind: 'measured'; session: Session; prices: Json | null; cost: SessionCost };

export function measureSession(options: MeasureOptions): Measurement {
  const worktreePath = resolve(options.path);
  const roots = options.projectsRoots.length > 0 ? options.projectsRoots : defaultProjectsRoots();
  const folders = transcriptFolders(worktreePath, roots);
  if (folders.length === 0) return { kind: 'notMeasured', reason: `sin transcripts de Claude Code para ${worktreePath}` };
  const session = readSession(folders, options.branch);
  if (session.thread.size === 0 && session.dispatches.length === 0) {
    return { kind: 'notMeasured', reason: `sin respuestas de ${options.branch || 'ninguna rama'} en los transcripts` };
  }
  const prices = readPrices(worktreePath);
  return { kind: 'measured', session, prices, cost: sessionCost(session, prices) };
}

export function textLines(measurement: Measurement): string[] {
  if (measurement.kind === 'notMeasured') return notMeasuredLines(measurement.reason);
  return reportLines(measurement.session, measurement.prices, measurement.cost);
}

function costJson(cost: SessionCost): object {
  if (cost.kind === 'unpriced') return { measured: true, usd: null, missingModels: [] };
  if (cost.kind === 'missing') return { measured: true, usd: null, missingModels: cost.models };
  return { measured: true, usd: cost.thread + cost.subagents, threadUsd: cost.thread, subagentsUsd: cost.subagents, missingModels: [] };
}

const modelsJson = (totals: ModelTotals) => modelsByTokens(totals).map((model) => ({ model, tokens: tokenSum(totals.get(model)!) }));

function dispatchesJson(session: Session): object {
  const dispatches = session.dispatches.map((dispatch) => ({
    description: dispatch.description,
    model: mainModel(dispatch.totals) ?? null,
    tokens: totalTokens(dispatch.totals),
    minutes: dispatch.minutes,
    inProgress: dispatch.inProgress,
  }));
  return { measured: true, tokens: totalTokens(mergeTotals(session.dispatches.map((item) => item.totals))), dispatches };
}

export function toJson(measurement: Measurement): object {
  if (measurement.kind === 'notMeasured') {
    const unmeasured = { measured: false, reason: measurement.reason };
    return { thread: unmeasured, subagents: unmeasured, cost: unmeasured };
  }
  const { session, cost } = measurement;
  return {
    thread: { measured: true, tokens: totalTokens(session.thread), models: modelsJson(session.thread) },
    subagents: dispatchesJson(session),
    cost: costJson(cost),
  };
}
