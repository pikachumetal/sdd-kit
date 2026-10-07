import { lockTimeoutOption, text } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { mergeBranch } from './run.ts';

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
