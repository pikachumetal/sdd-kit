import { rootOption, text } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { measureSession, textLines, timingOf, toJson } from './measure.ts';
import { marginWarning, writeTiming } from './timing.ts';

export const sessionTokensVerb: Verb = {
  noun: 'session',
  verb: 'tokens',
  summary: 'Mide los tokens y el coste de las sesiones de Claude Code de un worktree',
  options: {
    path: { type: 'string' },
    'project-root': { type: 'string' },
    branch: { type: 'string' },
    'projects-root': { type: 'string', multiple: true },
    json: { type: 'boolean' },
    artifact: { type: 'string' },
  },
  async run(args, io) {
    const roots = args.values['projects-root'];
    const options = {
      path: rootOption(args, 'path') ?? '.',
      branch: text(args, 'branch') ?? '',
      projectsRoots: Array.isArray(roots) ? roots.map(String) : [],
    };
    const measurement = measureSession(options);
    const artifact = text(args, 'artifact');
    if (artifact !== null) {
      const timing = timingOf(measurement, options, artifact);
      writeTiming(artifact, timing);
      const warning = marginWarning(timing);
      if (warning !== null) io.err(warning);
    }
    if (args.values.json === true) io.json(toJson(measurement));
    else textLines(measurement).forEach((line) => io.out(line));
    return 0;
  },
};
