import { UsageError } from '../cli/args.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { mergeBranch } from './run.ts';

const DEFAULT_LOCK_TIMEOUT_MINUTES = 30;

function text(args: VerbArgs, name: string): string | null {
  const value = args.values[name];
  return typeof value === 'string' ? value : null;
}

function lockTimeoutOption(args: VerbArgs): number {
  const raw = text(args, 'lock-timeout');
  if (raw === null) return DEFAULT_LOCK_TIMEOUT_MINUTES;
  const minutes = Number(raw);
  if (raw === '' || !Number.isFinite(minutes) || minutes < 0) throw new UsageError('--lock-timeout debe ser un número de minutos');
  return minutes;
}

export const mergeVerb: Verb = {
  noun: 'merge',
  summary: 'Fusiona la rama del cierre en la rama destino, con cerrojo, base integrada y push opcional',
  options: {
    'project-root': { type: 'string' },
    branch: { type: 'string' },
    push: { type: 'boolean' },
    verify: { type: 'string' },
    'lock-timeout': { type: 'string' },
  },
  async run(args, io) {
    const options = {
      projectRoot: text(args, 'project-root') ?? '.',
      branch: text(args, 'branch'),
      push: args.values.push === true,
      verify: text(args, 'verify'),
      lockTimeoutMinutes: lockTimeoutOption(args),
    };
    await mergeBranch(options, io);
    return 0;
  },
};
