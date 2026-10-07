import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { caseInsensitiveGet, isRecord } from '../cli/records.ts';
import { readText } from '../estimation/text.ts';
import { defaultProjectsRoots, transcriptFolders } from '../session/transcripts.ts';
import { toplevel } from '../git/git.ts';
import { sameText } from '../cli/records.ts';
import { readThresholds } from './thresholds.ts';
import { headVerdict, subagentVerdict, type Thresholds, type Verdict } from './verdict.ts';

export type WatchTarget = { kind: 'subagent'; description: string } | { kind: 'command'; path: string };

export interface WatchOptions {
  target: WatchTarget;
  worktree: string | null;
  projectsRoots: string[];
  once: boolean;
}

interface Context {
  options: WatchOptions;
  worktree: string;
  roots: string[];
  thresholds: Thresholds;
  startedAt: number;
}

const POLL_MILLIS = 30_000;
const TRANSCRIPT_GRACE_MILLIS = 120_000;
const DISPATCH_MARGIN_MILLIS = 60_000;

function readDescription(metaPath: string): unknown {
  try {
    const meta: unknown = JSON.parse(readText(metaPath));
    return isRecord(meta) ? caseInsensitiveGet(meta, 'description') : undefined;
  } catch {
    return undefined;
  }
}

function metaFiles(folder: string): string[] {
  const subfolders = readdirSync(folder, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  return subfolders.flatMap((directory) => {
    const subagents = join(folder, directory.name, 'subagents');
    if (!existsSync(subagents)) return [];
    return readdirSync(subagents).filter((name) => /^agent-.*\.meta\.json$/i.test(name)).map((name) => join(subagents, name));
  });
}

function findTranscript(description: string, context: Context): string | null {
  const notBefore = context.options.once ? -Infinity : context.startedAt - DISPATCH_MARGIN_MILLIS;
  const candidates = transcriptFolders(context.worktree, context.roots)
    .flatMap(metaFiles)
    .map((file) => ({ file, modified: statSync(file).mtimeMs }))
    .filter(({ file, modified }) => modified >= notBefore && sameText(readDescription(file), description))
    .sort((first, second) => second.modified - first.modified);
  if (candidates.length === 0) return null;
  const transcript = candidates[0].file.replace(/\.meta\.json$/i, '.jsonl');
  return existsSync(transcript) ? transcript : null;
}

function verdictFor(context: Context, graceOver: boolean): Verdict {
  const { target } = context.options;
  const label = target.kind === 'command' ? basename(target.path) : target.description;
  const file = target.kind === 'command' ? (existsSync(target.path) ? target.path : null) : findTranscript(target.description, context);
  if (file === null) {
    if (!graceOver) return { status: 'BUSCANDO', lines: [] };
    return { status: 'SIN TRANSCRIPT', lines: [`SIN TRANSCRIPT: ${label}; el vigía de silencio no funciona en esta sesión`] };
  }
  if (target.kind === 'command') return headVerdict({ file, label }, 'longCommandMinutes', context.thresholds);
  return subagentVerdict({ file, label }, context.thresholds);
}

const pause = (millis: number): Promise<void> => new Promise((done) => setTimeout(done, millis));

export async function watch(options: WatchOptions): Promise<string[]> {
  const startedAt = Date.now();
  const worktree = options.worktree ?? (await toplevel(process.cwd())) ?? process.cwd();
  const context: Context = { options, worktree, roots: options.projectsRoots.length > 0 ? options.projectsRoots : defaultProjectsRoots(), thresholds: readThresholds(worktree), startedAt };
  for (;;) {
    const graceOver = options.once || Date.now() - startedAt >= TRANSCRIPT_GRACE_MILLIS;
    const verdict = verdictFor(context, graceOver);
    if (options.once || (verdict.status !== 'EN MARCHA' && verdict.status !== 'BUSCANDO')) return verdict.lines;
    await pause(POLL_MILLIS);
  }
}
