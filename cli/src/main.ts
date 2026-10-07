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

function usageLine(noun: string | undefined, verbs: Verb[]): string {
  const ofNoun = verbs.filter((verb) => verb.noun === noun);
  if (ofNoun.length === 0) return `uso: sdd ${[...new Set(verbs.map((verb) => verb.noun))].join('|')}`;
  return `uso: sdd ${noun} ${ofNoun.flatMap((verb) => verb.verb ?? []).join('|')}`.trimEnd();
}

function helpLines(verbs: Verb[]): string[] {
  const commands = verbs.map((verb) => ['sdd', verb.noun, verb.verb].filter(Boolean).join(' '));
  const width = Math.max(0, ...commands.map((command) => command.length));
  return verbs.map((verb, index) => `${commands[index].padEnd(width)}  ${verb.summary}`);
}

export async function run(argv: string[], io: Io, verbs: Verb[] = VERBS): Promise<number> {
  if (argv[0] === '--help') {
    io.out('uso: sdd <sustantivo> <verbo> [opciones]');
    helpLines(verbs).forEach((line) => io.out(line));
    return 0;
  }
  try {
    const { verb, rest } = resolveVerb(argv, verbs);
    return await verb.run(parseVerbArgs(verb, rest), io);
  } catch (error) {
    if (!(error instanceof UsageError)) throw error;
    io.err(error.message);
    io.err(usageLine(argv[0], verbs));
    return 2;
  }
}
