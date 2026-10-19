import { readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { estimationLogPath } from '../cli/layout.ts';
import { generateEstimationLog, writeEstimationLog } from '../estimation/log.ts';
import { git } from '../git/git.ts';
import type { MergeAttempt } from './attempt.ts';
import { mergeKeyedHunk, type KeyedMerge } from './keyed.ts';
import { mergirafRuns, solveWithMergiraf } from './mergiraf.ts';

const LOG = /estimation-log\.md$/i;
const HUNK = /^<<<<<<< [^\n]*\n(.*?)^\|\|\|\|\|\|\| [^\n]*\n(.*?)^=======\r?\n(.*?)^>>>>>>> [^\n]*(?:\n|(?![\s\S]))/gms;
const MARKER = /^(<<<<<<<|\|\|\|\|\|\|\||=======|>>>>>>>)/m;

const KEYED_REGISTRIES = ['.docs/sdd/roadmap.md', '.docs/sdd/changelog.md', 'ROADMAP.md', 'CHANGELOG.md', '.docs/sdd/steering/debt.md'];

export function isRegistry(file: string): boolean {
  return KEYED_REGISTRIES.includes(file) || basename(file).toLowerCase() === 'estimation-log.md';
}

interface Conflict {
  path: string;
  content: string;
  hunks: RegExpMatchArray[];
}

async function readConflict(worktree: string, file: string): Promise<Conflict | null> {
  // Sin versión en la base (los dos lados crean el fichero) no hay líneas existentes que respetar: decide una persona.
  if ((await git(worktree, ['rev-parse', '--verify', '--quiet', `:1:${file}`])).code !== 0) return null;
  if ((await git(worktree, ['checkout', '--conflict=diff3', '--', file])).code !== 0) return null;
  const path = join(worktree, file);
  const content = readFileSync(path, 'utf8');
  const hunks = [...content.matchAll(HUNK)];
  // Un binario no lleva marcas: no hay nada que unir.
  return hunks.length === 0 ? null : { path, content, hunks };
}

function writeMerged(path: string, merged: string): boolean {
  if (MARKER.test(merged)) return false;
  writeFileSync(path, merged, 'utf8');
  return true;
}

async function mergeAddedLines(worktree: string, file: string): Promise<boolean> {
  const conflict = await readConflict(worktree, file);
  if (conflict === null || conflict.hunks.some((match) => match[2] !== '')) return false;
  return writeMerged(conflict.path, conflict.content.replace(HUNK, (_all, ours: string, _base: string, theirs: string) => ours + theirs));
}

const toLines = (text: string) => (text === '' ? [] : text.replace(/\n$/, '').split('\n'));

async function mergeRowsById({ worktree, report }: MergeAttempt, file: string): Promise<boolean> {
  const conflict = await readConflict(worktree, file);
  if (conflict === null) return false;
  const merges = conflict.hunks.map(([, ours, base, theirs]) => mergeKeyedHunk({ ours: toLines(ours), base: toLines(base), theirs: toLines(theirs) }));
  const resolved = merges.filter((merge): merge is KeyedMerge => merge !== null);
  if (resolved.length !== merges.length) return false;
  let next = 0;
  const merged = conflict.content.replace(HUNK, () => resolved[next++].lines.map((line) => `${line}\n`).join(''));
  if (!writeMerged(conflict.path, merged)) return false;
  resolved.flatMap((merge) => merge.duplicates).forEach((id) => report(`registros: dos filas distintas con el id '${id}' en ${file}; se quedan las dos, revísalas`));
  return true;
}

function regenerateLog(worktree: string): void {
  const { text, docsPath } = generateEstimationLog(worktree, () => undefined);
  writeEstimationLog(text, estimationLogPath(docsPath), () => undefined);
}

async function resolvedByKit(attempt: MergeAttempt, file: string): Promise<boolean> {
  if (KEYED_REGISTRIES.includes(file) && (await mergeRowsById(attempt, file))) return true;
  return mergeAddedLines(attempt.worktree, file);
}

async function unresolvedByKit(attempt: MergeAttempt, files: string[]): Promise<string[]> {
  const left: string[] = [];
  for (const file of files) {
    if (!(await resolvedByKit(attempt, file))) left.push(file);
  }
  return left;
}

async function commitResolution(worktree: string, conflicted: string[]): Promise<boolean> {
  if (conflicted.some((file) => LOG.test(file))) regenerateLog(worktree);
  await git(worktree, ['add', '--', ...conflicted]);
  return (await git(worktree, ['commit', '--no-edit'])).code === 0;
}

// Devuelve los ficheros que siguen en conflicto; sin ninguno, el merge queda commiteado.
export async function resolveConflicts(attempt: MergeAttempt, conflicted: string[]): Promise<string[]> {
  const { worktree, report } = attempt;
  let left = await unresolvedByKit(attempt, conflicted.filter((name) => !LOG.test(name)));
  if (left.length > 0 && mergirafRuns()) left = await solveWithMergiraf(worktree, left, { report });
  if (left.length > 0) return left;
  return (await commitResolution(worktree, conflicted)) ? [] : conflicted;
}
