import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface MergirafOptions {
  onSolved: (line: string) => void;
  onUnsolved: (line: string) => void;
  command?: string[];
}

const MERGIRAF = ['mergiraf'];
export const MARKER = /^(<<<<<<<|\|\|\|\|\|\|\||=======|>>>>>>>)/m;

export function mergirafRuns(command = MERGIRAF): boolean {
  const probe = spawnSync(command[0], [...command.slice(1), '--version'], { stdio: 'ignore', windowsHide: true });
  return probe.error === undefined && probe.status === 0;
}

function solvedCleanly(path: string): boolean {
  try {
    return !MARKER.test(readFileSync(path, 'utf8'));
  } catch {
    return false;
  }
}

function solve(worktree: string, file: string, command: string[]): Promise<boolean> {
  return new Promise((done) => {
    const child = spawn(command[0], [...command.slice(1), 'solve', '--keep-backup=false', file], { cwd: worktree, stdio: 'ignore', windowsHide: true });
    child.on('error', () => done(false));
    child.on('close', (code) => done(code === 0 && solvedCleanly(join(worktree, file))));
  });
}

export async function solveWithMergiraf(worktree: string, files: string[], { onSolved, onUnsolved, command = MERGIRAF }: MergirafOptions): Promise<string[]> {
  const left: string[] = [];
  for (const file of files) {
    if (await solve(worktree, file, command)) {
      onSolved(`mergiraf: resuelto ${file}`);
      continue;
    }
    onUnsolved(`mergiraf: no resuelve ${file}`);
    left.push(file);
  }
  return left;
}
