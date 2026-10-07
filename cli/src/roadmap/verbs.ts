import { requiredOption } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { checkRoadmap } from './check.ts';

export const roadmapCheckVerb: Verb = {
  noun: 'roadmap',
  verb: 'check',
  summary: 'Valida que el roadmap tiene la forma de la plantilla',
  options: { path: { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const { errors, warnings, lines, code } = checkRoadmap(requiredOption(args, 'path'));
    if (args.values.json) io.json({ valid: errors.length === 0, errors, warnings });
    else lines.forEach((line) => io.out(line));
    return code;
  },
};
