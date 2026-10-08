import { caseInsensitiveGet, isRecord } from '../cli/records.ts';
import { existsSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseJsonFile } from '../cli/json-file.ts';
import { elapsedMinutes, isInProgress, modelTotals, readResponses, type ModelTotals } from './usage.ts';

export interface Dispatch {
  description: string;
  totals: ModelTotals;
  minutes: number;
  inProgress: boolean;
}

export interface Session {
  thread: ModelTotals;
  dispatches: Dispatch[];
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

function readDispatch(file: string, branch: string): Dispatch | null {
  const responses = readResponses(file, branch);
  if (responses.length === 0) return null;
  return { description: describeDispatch(file), totals: modelTotals(responses), minutes: elapsedMinutes(responses), inProgress: isInProgress(responses) };
}

export function readSession(folders: string[], branch: string): Session {
  const thread = folders.flatMap(threadFiles).flatMap((file) => readResponses(file, branch));
  const files = folders.flatMap(agentFiles).sort((first, second) => first.localeCompare(second));
  const dispatches = files.map((file) => readDispatch(file, branch)).filter((dispatch): dispatch is Dispatch => dispatch !== null);
  return { thread: modelTotals(thread), dispatches };
}
