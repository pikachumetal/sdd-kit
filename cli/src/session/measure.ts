import type { Json } from '../cli/records.ts';
import { resolve } from 'node:path';
import { docsFolder } from '../cli/layout.ts';
import { commitsOf } from './branches.ts';
import type { Timing } from '../estimation/timing-file.ts';
import { buildTiming, unmeasuredTiming } from './timing.ts';
import { readPrices, sessionCost, type SessionCost } from './cost.ts';
import { notMeasuredLines, reportLines, mainModel } from './format.ts';
import { formatMinute, type Clock, type Timeline } from './clock.ts';
import { isEmpty, readSession, type Session } from './session.ts';
import { defaultProjectsRoots, transcriptFolders } from './transcripts.ts';
import { measureWindow, mergedAt, repositoryOf, type Repository } from './window.ts';
import { mergeTotals, modelsByTokens, tokenSum, totalTokens, type ModelTotals } from './usage.ts';

export interface MeasureOptions {
  path: string;
  branch: string;
  projectsRoots: string[];
  now?: number;
}

export interface WindowInfo {
  folder: string;
  from: number;
  to: number;
}

export type Measurement =
  | { kind: 'notMeasured'; reason: string }
  | { kind: 'measured'; session: Session; prices: Json | null; cost: SessionCost; window?: WindowInfo };

function measured(worktreePath: string, session: Session, window?: WindowInfo): Measurement {
  const prices = readPrices(worktreePath);
  return { kind: 'measured', session, prices, cost: sessionCost(session, prices), window };
}

function byWindow(repo: Repository, worktreePath: string, options: MeasureOptions): Measurement | null {
  const result = measureWindow(repo, { worktreePath, branch: options.branch, now: options.now ?? Date.now() });
  if (result.kind === 'noReflog') return { kind: 'notMeasured', reason: `sin reflog de ${options.branch}: no se sabe cuándo se creó` };
  if (result.kind === 'empty') return null;
  return measured(worktreePath, result.session, { folder: result.folder, from: result.from, to: result.to });
}

const untilOf = (repo: Repository | null, branch: string): number | undefined => (repo === null ? undefined : (mergedAt(repo, branch) ?? undefined));

const rootsOf = ({ projectsRoots }: MeasureOptions): string[] => (projectsRoots.length > 0 ? projectsRoots : defaultProjectsRoots());

export function measureSession(options: MeasureOptions): Measurement {
  const worktreePath = resolve(options.path);
  const roots = rootsOf(options);
  const folders = transcriptFolders(worktreePath, roots);
  const repo = options.branch === '' ? null : repositoryOf(worktreePath, roots);
  const own = readSession(folders, { branch: options.branch, until: untilOf(repo, options.branch) });
  if (!isEmpty(own)) return measured(worktreePath, own);
  const windowed = repo === null ? null : byWindow(repo, worktreePath, options);
  if (windowed !== null) return windowed;
  if (folders.length === 0) return { kind: 'notMeasured', reason: `sin transcripts de Claude Code para ${worktreePath}` };
  return { kind: 'notMeasured', reason: `sin respuestas de ${options.branch || 'ninguna rama'} en los transcripts` };
}

export interface TimingTarget {
  folder: string;
  warn: (message: string) => void;
}

export function timingOf(measurement: Measurement, options: MeasureOptions, { folder, warn }: TimingTarget): Timing {
  if (measurement.kind === 'notMeasured') return unmeasuredTiming(measurement.reason);
  const { timelines, clock } = measurement.session;
  if (clock === null) return unmeasuredTiming('sin respuestas del hilo en los transcripts');
  const worktreePath = resolve(options.path);
  const repo = options.branch === '' ? null : repositoryOf(worktreePath, rootsOf(options));
  const commits = repo === null || repo.into === null ? [] : commitsOf(repo.root, options.branch, repo.into);
  const clockSeconds = Math.round(clock.clockMillis / 1000);
  return buildTiming({ timelines, commits, branch: options.branch, clockSeconds, folder, docsPath: docsFolder(worktreePath), warn });
}

function windowLine({ folder, from }: WindowInfo): string {
  return `- Medición: por ventana — transcripts de ${folder} desde ${formatMinute(from)} (la rama no tiene transcripts propios)`;
}

function stopsLine(timelines: Timeline[]): string[] {
  const stops = timelines.flatMap((line) => [...line.waitSpans, ...line.idleSpans]).sort((first, second) => first.from - second.from);
  if (stops.length === 0) return [];
  const items = stops.map(({ from, to }) => `${new Date(from).toISOString().slice(11, 16)}Z ${Math.round((to - from) / 60_000)} min`);
  return [`- Esperas y huecos: ${items.join('; ')}`];
}

export function textLines(measurement: Measurement): string[] {
  if (measurement.kind === 'notMeasured') return notMeasuredLines(measurement.reason);
  const lines = reportLines(measurement.session, measurement.prices, measurement.cost);
  const window = measurement.window === undefined ? [] : [windowLine(measurement.window)];
  return [...lines, ...window, ...stopsLine(measurement.session.timelines)];
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

function realJson(clock: Clock | null): object {
  if (clock === null) return { measured: false, reason: 'sin respuestas del hilo en los transcripts' };
  const { hours, clockHours, start, waitMinutes, waits, idleMinutes, idleGaps } = clock;
  return { measured: true, hours, clockHours, start, waitMinutes, waits, idleMinutes, idleGaps };
}

export function toJson(measurement: Measurement): object {
  if (measurement.kind === 'notMeasured') {
    const unmeasured = { measured: false, reason: measurement.reason };
    return { thread: unmeasured, subagents: unmeasured, cost: unmeasured, real: unmeasured };
  }
  const { session, cost, window } = measurement;
  return {
    thread: { measured: true, tokens: totalTokens(session.thread), models: modelsJson(session.thread) },
    subagents: dispatchesJson(session),
    cost: costJson(cost),
    real: realJson(session.clock),
    ...(window === undefined ? {} : { window: { folder: window.folder, from: formatMinute(window.from), to: formatMinute(window.to) } }),
  };
}
