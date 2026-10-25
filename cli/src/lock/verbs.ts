import { resolve } from 'node:path';
import { UsageError, lockTimeoutOption } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { commonDir, gitLines } from '../git/git.ts';
import { withLock } from '../git/lock.ts';
import { runInherited } from '../tasks/command.ts';

// Una suite lenta tarda ~11 min y puede haber varias de otros worktrees en cola.
const SUITE_LOCK_TIMEOUT_MINUTES = 60;

export const lockRunVerb: Verb = {
  noun: 'lock',
  verb: 'run',
  summary: 'Corre un comando con el cerrojo de las suites del clon: la de otro worktree espera',
  usage: 'uso: sdd lock run [--lock-timeout <min>] -- COMMAND [ARGS...]',
  options: { 'lock-timeout': { type: 'string' } },
  positionals: ['--', 'COMMAND', '[ARGS...]'],
  async run(args, io) {
    const command = args.positionals;
    if (!args.hasSeparator || command.length === 0) throw new UsageError('falta el comando tras --');
    const cwd = process.cwd();
    const [branch = ''] = await gitLines(cwd, ['branch', '--show-current']);
    const lock = { path: resolve(await commonDir(cwd), 'sdd-tests.lock'), label: 'suites', io, owner: { branch, worktree: cwd } };
    return withLock(lock, lockTimeoutOption(args, SUITE_LOCK_TIMEOUT_MINUTES), () => runInherited(command, cwd));
  },
};
