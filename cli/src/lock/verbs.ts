import { resolve } from 'node:path';
import { UsageError, lockTimeoutOption } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { commonDir, gitLines } from '../git/git.ts';
import { lockHolderPid, withLock } from '../git/lock.ts';
import { runInherited } from '../tasks/command.ts';

// Un gate entero va en un turno, y puede haber varios de otros worktrees en cola.
const SUITE_LOCK_TIMEOUT_MINUTES = 180;
// Lo hereda el comando: un `sdd lock run` dentro de él ve que su padre ya tiene el cerrojo.
const SUITE_LOCK_OWNER = 'SDD_SUITE_LOCK_OWNER';

function heldByParent(lockPath: string): boolean {
  const inherited = Number(process.env[SUITE_LOCK_OWNER]);
  return Number.isInteger(inherited) && inherited > 0 && lockHolderPid(lockPath) === inherited;
}

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
    const common = await commonDir(cwd);
    const lock = { path: resolve(common, 'sdd-tests.lock'), label: 'suites', io, owner: { branch, worktree: cwd }, queue: resolve(common, 'sdd-tests.queue') };
    if (heldByParent(lock.path)) return runInherited(command, cwd);
    return withLock(lock, lockTimeoutOption(args, SUITE_LOCK_TIMEOUT_MINUTES), () => {
      process.env[SUITE_LOCK_OWNER] = String(process.pid);
      return runInherited(command, cwd);
    });
  },
};
