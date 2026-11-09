import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { text, UsageError } from '../cli/args.ts';
import type { VerbArgs } from '../cli/verbs.ts';
import { git } from '../git/git.ts';

export const DIRECTORY_OPTION = { directory: { type: 'string', short: 'C' } } as const;

const STOP = 'Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas';
const NEW_PROJECT = 'Si es un proyecto nuevo, haz git init';

export function enterDirectory(args: VerbArgs): void {
  const dir = text(args, 'directory');
  if (dir === null) return;
  if (!existsSync(dir) || !statSync(dir).isDirectory()) throw new UsageError(`directorio de -C no válido: ${dir}`);
  process.chdir(dir);
}

function stop(need: 'repo' | 'commit', stderr: string): UsageError {
  const here = `directorio actual: ${process.cwd()}`;
  const message =
    need === 'repo'
      ? `${STOP} (${here}). ${NEW_PROJECT} y vuelve a lanzarlo.`
      : `${STOP}, con al menos un commit (${here}). ${NEW_PROJECT} y un primer commit, y vuelve a lanzarlo.`;
  return new UsageError(`${message}\ngit dijo: ${stderr.split('\n')[0].trim()}`);
}

export async function requireRepo(need: 'repo' | 'commit'): Promise<string> {
  const top = await git(process.cwd(), ['rev-parse', '--show-toplevel']);
  if (top.code !== 0) throw stop(need, top.stderr);
  const root = resolve(top.stdout.trim());
  if (need === 'commit') {
    const head = await git(root, ['rev-parse', '--verify', 'HEAD']);
    if (head.code !== 0) throw stop(need, head.stderr);
  }
  return root;
}
