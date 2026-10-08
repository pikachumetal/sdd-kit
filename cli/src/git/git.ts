import { execFile, execFileSync } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { normalize, resolve } from 'node:path';

const GIT_ENV_VARS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY'];
const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

export interface GitResult {
  code: number;
  stdout: string;
  stderr: string;
}

export interface Worktree {
  path: string;
  branch: string | null;
}

function isolatedEnv(): NodeJS.ProcessEnv {
  const kept = Object.entries(process.env).filter(([name]) => !GIT_ENV_VARS.includes(name.toUpperCase()));
  return Object.fromEntries(kept);
}

export function git(cwd: string, args: string[]): Promise<GitResult> {
  const options = { cwd, env: isolatedEnv(), encoding: 'utf8', maxBuffer: MAX_OUTPUT_BYTES, windowsHide: true } as const;
  return new Promise((done) => {
    execFile('git', ['-c', 'core.quotePath=false', ...args], options, (error, stdout, stderr) => {
      const code = error === null ? 0 : typeof error.code === 'number' ? error.code : 1;
      done({ code, stdout, stderr });
    });
  });
}

// Para los verbos síncronos; null si git no está o el comando sale con error.
export function gitSync(cwd: string, args: string[]): string[] | null {
  try {
    const stdout = execFileSync('git', ['-c', 'core.quotePath=false', ...args], {
      cwd, env: isolatedEnv(), encoding: 'utf8', maxBuffer: MAX_OUTPUT_BYTES, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'],
    });
    return stdout.split(/\r?\n/).filter((line) => line !== '');
  } catch {
    return null;
  }
}

export async function gitLines(cwd: string, args: string[]): Promise<string[]> {
  const { code, stdout } = await git(cwd, args);
  if (code !== 0) return [];
  return stdout.split(/\r?\n/).filter((line) => line !== '');
}

export async function toplevel(cwd: string): Promise<string | null> {
  const [top] = await gitLines(cwd, ['rev-parse', '--show-toplevel']);
  return top === undefined ? null : resolve(top);
}

export async function commonDir(cwd: string): Promise<string> {
  const [dir] = await gitLines(cwd, ['rev-parse', '--git-common-dir']);
  if (dir === undefined) throw new Error(`no es un repositorio git: ${cwd}`);
  return resolve(cwd, dir);
}

export async function worktrees(cwd: string): Promise<Worktree[]> {
  const found: Worktree[] = [];
  for (const line of await gitLines(cwd, ['worktree', 'list', '--porcelain'])) {
    if (line.startsWith('worktree ')) found.push({ path: normalize(line.slice('worktree '.length)), branch: null });
    else if (line.startsWith('branch refs/heads/')) found[found.length - 1].branch = line.slice('branch refs/heads/'.length);
  }
  return found;
}

function comparable(path: string): string {
  return resolve(path).replace(/[\\/]+$/, '').toLowerCase();
}

function realComparable(path: string): string | null {
  try {
    return realpathSync.native(path).toLowerCase();
  } catch {
    return null;
  }
}

export function samePath(first: string, second: string): boolean {
  if (comparable(first) === comparable(second)) return true;
  const real = realComparable(first);
  return real !== null && real === realComparable(second);
}
