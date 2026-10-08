import { text } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { measureSession, textLines, toJson } from './measure.ts';

export const sessionTokensVerb: Verb = {
  noun: 'session',
  verb: 'tokens',
  summary: 'Mide los tokens y el coste de las sesiones de Claude Code de un worktree',
  options: {
    path: { type: 'string' },
    branch: { type: 'string' },
    'projects-root': { type: 'string', multiple: true },
    json: { type: 'boolean' },
  },
  async run(args, io) {
    const roots = args.values['projects-root'];
    const measurement = measureSession({
      path: text(args, 'path') ?? '.',
      branch: text(args, 'branch') ?? '',
      projectsRoots: Array.isArray(roots) ? roots.map(String) : [],
    });
    if (args.values.json === true) io.json(toJson(measurement));
    else textLines(measurement).forEach((line) => io.out(line));
    return 0;
  },
};
