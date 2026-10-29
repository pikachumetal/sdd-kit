import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { startToLog, type Started } from '../tasks/command.ts';
import { caseInsensitiveGet, isRecord } from '../cli/records.ts';
import { readText } from '../cli/files.ts';
import { defaultProjectsRoots, transcriptFolders } from '../session/transcripts.ts';
import { toplevel } from '../git/git.ts';
import { sameText } from '../cli/records.ts';
import { readThresholds } from './thresholds.ts';
import { headVerdict, subagentVerdict, type Thresholds, type Verdict } from './verdict.ts';

export type WatchTarget = { kind: 'subagent'; description: string } | { kind: 'command'; path: string } | { kind: 'run'; command: string[] };

interface Run {
  label: string;
  log: string;
  started: Started;
  code?: number;
}

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
  activity?: { size: number; at: number };
  run?: Run;
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

const MOON_HEARTBEAT = /^▮+ \S+ \(running for [^)]+\)$/;

// moon escribe su latido cada 30 s aunque la tarea esté colgada: lo añadido que solo son latidos no cuenta como actividad.
function commandActivity(context: Context, file: string): number {
  const { size, mtimeMs } = statSync(file);
  const previous = context.activity;
  const onlyHeartbeats = (from: number): boolean =>
    readFileSync(file).subarray(from).toString('utf8').split(/\r?\n/).filter((line) => line !== '').every((line) => MOON_HEARTBEAT.test(line));
  const quiet = previous !== undefined && (size === previous.size || (size > previous.size && onlyHeartbeats(previous.size)));
  context.activity = { size, at: quiet ? previous.at : mtimeMs };
  return context.activity.at;
}

function runVerdict(context: Context, run: Run): Verdict {
  const output = `salida: ${run.log}`;
  if (run.code !== undefined) return { status: 'TERMINADO', lines: [`TERMINADO: ${run.label} salió con ${run.code}`, output] };
  const verdict = headVerdict({ file: run.log, label: run.label, activeAt: commandActivity(context, run.log) }, 'longCommandMinutes', context.thresholds);
  verdict.lines.push(output);
  return verdict;
}

function verdictFor(context: Context, graceOver: boolean): Verdict {
  const { target } = context.options;
  if (target.kind === 'run') return runVerdict(context, context.run!);
  const label = target.kind === 'command' ? basename(target.path) : target.description;
  const file = target.kind === 'command' ? (existsSync(target.path) ? target.path : null) : findTranscript(target.description, context);
  if (file === null) {
    if (!graceOver) return { status: 'BUSCANDO', lines: [] };
    return { status: 'SIN TRANSCRIPT', lines: [`SIN TRANSCRIPT: ${label}; el vigía de silencio no funciona en esta sesión`] };
  }
  if (target.kind === 'command') return headVerdict({ file, label, activeAt: commandActivity(context, file) }, 'longCommandMinutes', context.thresholds);
  return subagentVerdict({ file, label }, context.thresholds);
}

// Corta la espera si el comando sale antes: el vigía termina con él, no en el siguiente sondeo.
function pause(millis: number, until?: Promise<unknown>): Promise<void> {
  return new Promise((done) => {
    const timer = setTimeout(done, millis);
    void until?.then(() => {
      clearTimeout(timer);
      done();
    });
  });
}

function startRun(command: string[], worktree: string): Run {
  const folder = join(worktree, '.temp', 'sdd', 'watch');
  mkdirSync(folder, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
  const log = join(folder, `${stamp}-${process.pid}.log`);
  const run: Run = { label: command.join(' '), log, started: startToLog(command, log) };
  void run.started.exit.then((code) => (run.code = code));
  return run;
}

export async function watch(options: WatchOptions): Promise<string[]> {
  const startedAt = Date.now();
  const worktree = options.worktree ?? (await toplevel(process.cwd())) ?? process.cwd();
  const context: Context = { options, worktree, roots: options.projectsRoots.length > 0 ? options.projectsRoots : defaultProjectsRoots(), thresholds: readThresholds(worktree), startedAt };
  if (options.target.kind === 'run') context.run = startRun(options.target.command, worktree);
  for (;;) {
    const graceOver = options.once || Date.now() - startedAt >= TRANSCRIPT_GRACE_MILLIS;
    const verdict = verdictFor(context, graceOver);
    if (options.once || (verdict.status !== 'EN MARCHA' && verdict.status !== 'BUSCANDO')) {
      if (verdict.status === 'SILENCIO') context.run?.started.stop();
      return verdict.lines;
    }
    await pause(POLL_MILLIS, context.run?.started.exit);
  }
}
