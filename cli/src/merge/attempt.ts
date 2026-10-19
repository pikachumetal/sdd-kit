import { DomainError } from '../cli/args.ts';
import { git, gitLines } from '../git/git.ts';
import { resolveConflicts } from './registries.ts';

export interface MergeAttempt {
  worktree: string;
  stepName: string;
  output: string[];
  report: (line: string) => void;
  destinationIsTheirs?: boolean;
}

export function mergeArgs(args: string[]): string[] {
  return ['-c', 'merge.conflictStyle=zdiff3', 'merge', '-X', 'diff-algorithm=histogram', ...args];
}

export async function gitWithOutput(cwd: string, args: string[]): Promise<{ code: number; output: string[] }> {
  const { code, stdout, stderr } = await git(cwd, args);
  const output = `${stdout}\n${stderr}`.split(/\r?\n/).filter((line) => line !== '');
  return { code, output };
}

export async function completeMergeAttempt(attempt: MergeAttempt, mergeCode: number): Promise<void> {
  if (mergeCode === 0) return;
  const { worktree, stepName, output } = attempt;
  const conflicted = await gitLines(worktree, ['diff', '--name-only', '--diff-filter=U']);
  const left = conflicted.length === 0 ? [] : await resolveConflicts(attempt, conflicted);
  if (conflicted.length > 0 && left.length === 0) return;
  await git(worktree, ['merge', '--abort']);
  if (conflicted.length === 0) throw new DomainError(`verificación: el hook rechazó el merge.\n${output.slice(-20).join('\n')}`);
  throw new DomainError(`${stepName}: conflicto en ${left.join(', ')}.`);
}
