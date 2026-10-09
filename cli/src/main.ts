import { UsageError, parseVerbArgs } from './cli/args.ts';
import type { Io } from './cli/io.ts';
import { VERBS, type Verb } from './cli/verbs.ts';

type Resolved = { verb: Verb; rest: string[] };

function resolveVerb(argv: string[], verbs: Verb[]): Resolved {
  const [noun, name] = argv;
  if (!noun) throw new UsageError('falta el comando');
  const ofNoun = verbs.filter((verb) => verb.noun === noun);
  if (ofNoun.length === 0) throw new UsageError(`comando desconocido: «${noun}»`);
  const bare = ofNoun.find((verb) => verb.verb === undefined);
  if (bare) return { verb: bare, rest: argv.slice(1) };
  if (!name) throw new UsageError(`falta el verbo de «${noun}»`);
  const verb = ofNoun.find((candidate) => candidate.verb === name);
  if (!verb) throw new UsageError(`verbo desconocido: «${name}»`);
  return { verb, rest: argv.slice(2) };
}

function verbUsage(verb: Verb): string {
  const options = Object.entries(verb.options).map(([name, option]) => (option.type === 'boolean' ? `[--${name}]` : `[--${name} <valor>]`));
  return ['uso: sdd', verb.noun, verb.verb, ...options, ...(verb.positionals ?? [])].filter(Boolean).join(' ');
}

function usageLine(noun: string | undefined, verbs: Verb[]): string {
  const ofNoun = verbs.filter((verb) => verb.noun === noun);
  if (ofNoun.length === 0) return `uso: sdd ${[...new Set(verbs.map((verb) => verb.noun))].join('|')}`;
  const bare = ofNoun.find((verb) => verb.verb === undefined);
  if (bare) return verbUsage(bare);
  return `uso: sdd ${noun} ${ofNoun.flatMap((verb) => verb.verb ?? []).join('|')}`;
}

function helpLines(verbs: Verb[]): string[] {
  const commands = verbs.map((verb) => ['sdd', verb.noun, verb.verb].filter(Boolean).join(' '));
  const width = Math.max(0, ...commands.map((command) => command.length));
  return verbs.map((verb, index) => `${commands[index].padEnd(width)}  ${verb.summary}`);
}

// Lo que va tras «--» es del comando de task done, no de la CLI.
function asksForHelp(argv: string[]): boolean {
  const separator = argv.indexOf('--');
  return (separator === -1 ? argv : argv.slice(0, separator)).includes('--help');
}

function help(argv: string[], verbs: Verb[]): string[] {
  const [noun, name] = argv.filter((arg) => arg !== '--help');
  const ofNoun = verbs.filter((verb) => verb.noun === noun);
  const verb = ofNoun.find((candidate) => candidate.verb === undefined) ?? ofNoun.find((candidate) => candidate.verb === name);
  if (verb) return [verbUsage(verb), verb.summary];
  if (ofNoun.length > 0) return [usageLine(noun, verbs), ...helpLines(ofNoun)];
  return ['uso: sdd <sustantivo> <verbo> [opciones]', ...helpLines(verbs)];
}

function reportFailure(error: unknown, context: { argv: string[]; verbs: Verb[]; io: Io }): number {
  const { argv, verbs, io } = context;
  if (error instanceof UsageError) {
    io.err(error.message);
    io.err(usageLine(argv[0], verbs));
    return 2;
  }
  io.err(error instanceof Error ? error.message : String(error));
  return 1;
}

export async function run(argv: string[], io: Io, verbs: Verb[] = VERBS): Promise<number> {
  if (asksForHelp(argv)) {
    help(argv, verbs).forEach((line) => io.out(line));
    return 0;
  }
  try {
    const { verb, rest } = resolveVerb(argv, verbs);
    return await verb.run(parseVerbArgs(verb, rest), io);
  } catch (error) {
    return reportFailure(error, { argv, verbs, io });
  }
}
