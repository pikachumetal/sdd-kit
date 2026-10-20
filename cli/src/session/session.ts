import { caseInsensitiveGet, isRecord } from '../cli/records.ts';
import { existsSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { readText } from '../cli/files.ts';
import { parseJsonFile } from '../cli/json-file.ts';
import { readClock, type Clock } from './clock.ts';
import { elapsedMinutes, isInProgress, modelTotals, readResponses, type ModelTotals, type Selector } from './usage.ts';

export interface Dispatch {
  description: string;
  totals: ModelTotals;
  minutes: number;
  inProgress: boolean;
}

export interface Session {
  thread: ModelTotals;
  dispatches: Dispatch[];
  clock: Clock | null;
}

function entries(folder: string, kind: 'file' | 'directory'): string[] {
  try {
    const wanted = readdirSync(folder, { withFileTypes: true }).filter((entry) => (kind === 'file' ? entry.isFile() : entry.isDirectory()));
    return wanted.map((entry) => entry.name).sort();
  } catch {
    return [];
  }
}

const threadFiles = (folder: string): string[] =>
  entries(folder, 'file').filter((name) => name.toLowerCase().endsWith('.jsonl')).map((name) => join(folder, name));

function agentFiles(folder: string): string[] {
  return entries(folder, 'directory').flatMap((directory) => {
    const subagents = join(folder, directory, 'subagents');
    return entries(subagents, 'file').filter((name) => /^agent-.*\.jsonl$/i.test(name)).map((name) => join(subagents, name));
  });
}

function describeDispatch(file: string): string {
  const fallback = basename(file, '.jsonl');
  const metaPath = file.replace(/\.jsonl$/i, '.meta.json');
  if (!existsSync(metaPath)) return fallback;
  const meta = parseJsonFile(metaPath);
  const description = isRecord(meta) ? caseInsensitiveGet(meta, 'description') : undefined;
  return description ? String(description) : fallback;
}

function readDispatch(file: string, selector: Selector): Dispatch | null {
  const responses = readResponses(file, selector);
  if (responses.length === 0) return null;
  return { description: describeDispatch(file), totals: modelTotals(responses), minutes: elapsedMinutes(responses), inProgress: isInProgress(responses) };
}

// En la ventana solo cuenta la sesión que creó la rama: otra que solo la nombra (un git worktree list) no trabajó en ella.
function sessionFiles(folders: string[], selector: Selector): { files: string[]; agents: string[] } {
  const all = folders.flatMap(threadFiles);
  const agents = folders.flatMap(agentFiles).sort((first, second) => first.localeCompare(second));
  const createdBy = selector.window?.createdBy;
  if (createdBy === undefined) return { files: all, agents };
  const files = all.filter((file) => createdBy.test(readText(file)));
  const sessions = new Set(files.map((file) => basename(file, '.jsonl')));
  return { files, agents: agents.filter((agent) => sessions.has(basename(dirname(dirname(agent))))) };
}

export function readSession(folders: string[], selector: Selector): Session {
  const { files, agents } = sessionFiles(folders, selector);
  const thread = files.flatMap((file) => readResponses(file, selector));
  const dispatches = agents.map((file) => readDispatch(file, selector)).filter((dispatch): dispatch is Dispatch => dispatch !== null);
  return { thread: modelTotals(thread), dispatches, clock: readClock(files, selector) };
}

export const isEmpty = (session: Session): boolean => session.thread.size === 0 && session.dispatches.length === 0;
