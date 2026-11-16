import { UsageError, lockTimeoutOption, text } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { mergeBranch } from './run.ts';
import { syncBranch } from './sync.ts';

export const mergeVerb: Verb = {
  noun: 'merge',
  summary: 'Fusiona la rama del cierre en la rama destino, con cerrojo, base integrada y push opcional',
  options: {
    'project-root': { type: 'string' },
    branch: { type: 'string' },
    push: { type: 'boolean' },
    check: { type: 'boolean' },
    sync: { type: 'boolean' },
    verify: { type: 'string' },
    'verified-at': { type: 'string' },
    into: { type: 'string' },
    order: { type: 'string' },
    tag: { type: 'string' },
    'lock-timeout': { type: 'string' },
  },
  async run(args, io) {
    // Sin opciones fusionaría la rama actual: quien la llama así busca la ayuda.
    if (Object.keys(args.values).length === 0) throw new UsageError('sdd merge necesita al menos una opción; para fusionar el worktree actual, --project-root .');
    const options = {
      projectRoot: text(args, 'project-root') ?? '.',
      branch: text(args, 'branch'),
      push: args.values.push === true,
      check: args.values.check === true,
      verify: text(args, 'verify'),
      verifiedAt: text(args, 'verified-at'),
      into: text(args, 'into'),
      order: text(args, 'order'),
      tag: text(args, 'tag'),
      lockTimeoutMinutes: lockTimeoutOption(args),
    };
    await (args.values.sync === true ? syncBranch(options, io) : mergeBranch(options, io));
    return 0;
  },
};
