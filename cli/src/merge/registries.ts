import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { estimationLogPath } from '../cli/layout.ts';
import { generateEstimationLog, writeEstimationLog } from '../estimation/log.ts';
import { git } from '../git/git.ts';
import type { MergeAttempt } from './attempt.ts';
import { mergirafRuns, solveWithMergiraf } from './mergiraf.ts';

const LOG = /estimation-log\.md$/i;
const HUNK = /^<<<<<<< [^\n]*\n(.*?)^\|\|\|\|\|\|\| [^\n]*\n(.*?)^=======\r?\n(.*?)^>>>>>>> [^\n]*(?:\n|(?![\s\S]))/gms;
const MARKER = /^(<<<<<<<|\|\|\|\|\|\|\||=======|>>>>>>>)/m;

async function mergeAddedLines(worktree: string, file: string): Promise<boolean> {
  // Sin versión en la base (los dos lados crean el fichero) no hay líneas existentes que respetar: decide una persona.
  if ((await git(worktree, ['rev-parse', '--verify', '--quiet', `:1:${file}`])).code !== 0) return false;
  if ((await git(worktree, ['checkout', '--conflict=diff3', '--', file])).code !== 0) return false;
  const path = join(worktree, file);
  const content = readFileSync(path, 'utf8');
  const hunks = [...content.matchAll(HUNK)];
  // Un binario no lleva marcas: no hay nada que unir.
  if (hunks.length === 0 || hunks.some((match) => match[2] !== '')) return false;
  const merged = content.replace(HUNK, (_all, ours: string, _base: string, theirs: string) => ours + theirs);
  if (MARKER.test(merged)) return false;
  writeFileSync(path, merged, 'utf8');
  return true;
}

function regenerateLog(worktree: string): void {
  const { text, docsPath } = generateEstimationLog(worktree, () => undefined);
  writeEstimationLog(text, estimationLogPath(docsPath), () => undefined);
}

async function unresolvedByKit(worktree: string, files: string[]): Promise<string[]> {
  const left: string[] = [];
  for (const file of files) {
    if (!(await mergeAddedLines(worktree, file))) left.push(file);
  }
  return left;
}

async function commitResolution(worktree: string, conflicted: string[]): Promise<boolean> {
  if (conflicted.some((file) => LOG.test(file))) regenerateLog(worktree);
  await git(worktree, ['add', '--', ...conflicted]);
  return (await git(worktree, ['commit', '--no-edit'])).code === 0;
}

// Devuelve los ficheros que siguen en conflicto; sin ninguno, el merge queda commiteado.
export async function resolveConflicts({ worktree, report }: MergeAttempt, conflicted: string[]): Promise<string[]> {
  let left = await unresolvedByKit(worktree, conflicted.filter((name) => !LOG.test(name)));
  if (left.length > 0 && mergirafRuns()) left = await solveWithMergiraf(worktree, left, { report });
  if (left.length > 0) return left;
  return (await commitResolution(worktree, conflicted)) ? [] : conflicted;
}
