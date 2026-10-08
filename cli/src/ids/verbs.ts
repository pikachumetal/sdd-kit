import { UsageError, lockTimeoutOption } from '../cli/args.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { nextIds } from './next.ts';

const ID_LOCK_TIMEOUT_MINUTES = 2;

function countOption(args: VerbArgs): number {
  const text = args.values.count;
  if (text === undefined) return 1;
  const count = Number(text);
  if (!Number.isInteger(count) || count < 1 || count > 99) throw new UsageError('--count debe estar entre 1 y 99');
  return count;
}

export const idNextVerb: Verb = {
  noun: 'id',
  verb: 'next',
  summary: 'Propone o reserva el siguiente id SDD (ids.mode=sequence)',
  options: {
    'project-root': { type: 'string' },
    reserve: { type: 'boolean' },
    count: { type: 'string' },
    'lock-timeout': { type: 'string' },
    json: { type: 'boolean' },
  },
  async run(args, io) {
    const projectRoot = typeof args.values['project-root'] === 'string' ? args.values['project-root'] : '.';
    const reserve = args.values.reserve === true;
    const options = { projectRoot, reserve, count: countOption(args), lockTimeoutMinutes: lockTimeoutOption(args, ID_LOCK_TIMEOUT_MINUTES) };
    const ids = await nextIds(options, io);
    if (args.values.json) io.json({ ids, reserved: reserve });
    else ids.forEach((id) => io.out(id));
    return 0;
  },
};
