import { statSync } from 'node:fs';
import { diagnosis } from './diagnosis.ts';
import { isFinished, isPending, isShellTool, readEvents, selectWatched, toolUses } from './events.ts';

export interface Thresholds {
  betweenStepsMinutes: number;
  longCommandMinutes: number;
}

export interface Verdict {
  status: 'SILENCIO' | 'EN MARCHA' | 'TERMINADO' | 'SIN TRANSCRIPT' | 'BUSCANDO';
  lines: string[];
}

export interface Watched {
  file: string;
  label: string;
}

const silenceMinutes = (file: string): number => (Date.now() - statSync(file).mtimeMs) / 60000;

export function headVerdict(watched: Watched, key: keyof Thresholds, thresholds: Thresholds): Verdict {
  const minutes = silenceMinutes(watched.file);
  const shown = Math.floor(minutes);
  const limit = `(umbral ${thresholds[key]} min, ${key})`;
  if (minutes > thresholds[key]) return { status: 'SILENCIO', lines: [`SILENCIO: ${watched.label} lleva ${shown} min sin escribir ${limit}`] };
  return { status: 'EN MARCHA', lines: [`EN MARCHA: ${watched.label} escribió hace ${shown} min ${limit}`] };
}

export function subagentVerdict(watched: Watched, thresholds: Thresholds): Verdict {
  const events = readEvents(watched.file);
  if (isFinished(events)) return { status: 'TERMINADO', lines: [`TERMINADO: ${watched.label} devolvió su resultado`] };
  const uses = toolUses(events);
  const pendingUses = uses.filter((use) => isPending(events, use));
  const lastUse = selectWatched(uses, pendingUses);
  const pending = lastUse !== undefined && pendingUses.includes(lastUse);
  const isLongCommand = pending && isShellTool(lastUse);
  const verdict = headVerdict(watched, isLongCommand ? 'longCommandMinutes' : 'betweenStepsMinutes', thresholds);
  if (verdict.status === 'SILENCIO' && events.length > 0) verdict.lines.push(...diagnosis(events, lastUse, pending));
  return verdict;
}
