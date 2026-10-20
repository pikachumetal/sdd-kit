import { DomainError } from '../cli/args.ts';
import { git, gitLines } from '../git/git.ts';
import { resolveConflicts } from './registries.ts';

export interface MergeAttempt {
  worktree: string;
  stepName: string;
  output: string[];
  report: (line: string) => void;
  // En un merge de sincronización la rama destino es el lado que entra: su ref.
  mergedDestination?: string;
}

export class MergeConflict extends DomainError {
  readonly files: string[];

  constructor(stepName: string, files: string[]) {
    super(`${stepName}: conflicto en ${files.join(', ')}.`);
    this.files = files;
  }
}

export function mergeArgs(args: string[]): string[] {
  return ['-c', 'merge.conflictStyle=zdiff3', 'merge', '-X', 'diff-algorithm=histogram', ...args];
}

export async function gitWithOutput(cwd: string, args: string[]): Promise<{ code: number; output: string[] }> {
  const { code, stdout, stderr } = await git(cwd, args);
  const output = `${stdout}\n${stderr}`.split(/\r?\n/).filter((line) => line !== '');
  return { code, output };
}

// Con MERGE_HEAD, git preparó el merge y fue el hook quien no dejó commitearlo; sin él, git no llegó a empezar.
async function abortedMergeError({ worktree, stepName, output }: MergeAttempt): Promise<DomainError> {
  const prepared = (await git(worktree, ['rev-parse', '--verify', '--quiet', 'MERGE_HEAD'])).code === 0;
  await git(worktree, ['merge', '--abort']);
  const tail = output.slice(-20).join('\n');
  if (prepared) return new DomainError(`verificación: el hook rechazó el merge.\n${tail}`);
  return new DomainError(`${stepName}: git merge falló sin conflictos.\n${tail}`);
}

export async function completeMergeAttempt(attempt: MergeAttempt, mergeCode: number): Promise<void> {
  if (mergeCode === 0) return;
  const conflicted = await gitLines(attempt.worktree, ['diff', '--name-only', '--diff-filter=U']);
  if (conflicted.length === 0) throw await abortedMergeError(attempt);
  const left = await resolveConflicts(attempt, conflicted);
  if (left.length === 0) return;
  await git(attempt.worktree, ['merge', '--abort']);
  throw new MergeConflict(attempt.stepName, left);
}
