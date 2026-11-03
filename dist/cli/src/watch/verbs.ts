import { UsageError, requiredOption, text } from '../cli/args.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { watch, type WatchTarget } from './watch.ts';

interface WatchVerbSpec {
  verb: string;
  summary: string;
  usage?: string;
  options: Verb['options'];
  positionals?: string[];
  target: (args: VerbArgs) => WatchTarget;
}

function watchVerb({ verb, summary, usage, options, positionals, target }: WatchVerbSpec): Verb {
  return {
    noun: 'watch',
    verb,
    summary,
    usage,
    positionals,
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

function commandTarget(args: VerbArgs): WatchTarget {
  if (!args.hasSeparator && args.positionals.length > 0) throw new UsageError(`argumento inesperado: «${args.positionals[0]}»`);
  if (!args.hasSeparator) return { kind: 'command', path: requiredOption(args, 'path') };
  if (args.positionals.length === 0) throw new UsageError('falta el comando tras --');
  if (args.values.path !== undefined || args.values.once === true) throw new UsageError('-- no va con --path ni con --once');
  return { kind: 'run', command: args.positionals };
}

export const watchCommandVerb = watchVerb({
  verb: 'command',
  summary: 'Lanza un comando (o vigila la salida de uno que ya corre, con --path) y termina cuando acaba o se queda en silencio',
  usage: 'uso: sdd watch command [--worktree <ruta>] -- COMMAND [ARGS...] | sdd watch command --path <fichero> [--once]',
  options: { path: { type: 'string' } },
  positionals: ['--', 'COMMAND', '[ARGS...]'],
  target: commandTarget,
});
