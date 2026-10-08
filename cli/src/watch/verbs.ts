import { requiredOption, text } from '../cli/args.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { watch, type WatchTarget } from './watch.ts';

interface WatchVerbSpec {
  verb: string;
  summary: string;
  options: Verb['options'];
  target: (args: VerbArgs) => WatchTarget;
}

function watchVerb({ verb, summary, options, target }: WatchVerbSpec): Verb {
  return {
    noun: 'watch',
    verb,
    summary,
    options: { ...options, worktree: { type: 'string' }, once: { type: 'boolean' } },
    async run(args, io) {
      const roots = args.values['projects-root'];
      const lines = await watch({
        target: target(args),
        worktree: text(args, 'worktree'),
        projectsRoots: Array.isArray(roots) ? roots.map(String) : [],
        once: args.values.once === true,
      });
      lines.forEach((line) => io.out(line));
      return 0;
    },
  };
}

export const watchSubagentVerb = watchVerb({
  verb: 'subagent',
  summary: 'Vigila el transcript de un subagente y termina cuando se cuelga o cuando acaba',
  options: { description: { type: 'string' }, 'projects-root': { type: 'string', multiple: true } },
  target: (args) => ({ kind: 'subagent', description: requiredOption(args, 'description') }),
});

export const watchCommandVerb = watchVerb({
  verb: 'command',
  summary: 'Vigila la salida de un comando en segundo plano y termina cuando se queda en silencio',
  options: { path: { type: 'string' } },
  target: (args) => ({ kind: 'command', path: requiredOption(args, 'path') }),
});
