import { existsSync } from 'node:fs';
import { requiredOption } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { validateCapabilities } from './check.ts';
import { capabilityIndex, indexLines } from './index.ts';
import { mergeDelta } from './merge.ts';

function artifactOption(args: VerbArgs, io: Io): string | undefined {
  const artifact = args.values.artifact;
  if (typeof artifact !== 'string') return undefined;
  if (existsSync(artifact)) return artifact;
  io.err(`no existe el artefacto: ${artifact}`);
  return undefined;
}

export const capabilityIndexVerb: Verb = {
  noun: 'capability',
  verb: 'index',
  summary: 'Lista las capacidades con su propósito',
  options: { path: { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const entries = capabilityIndex(requiredOption(args, 'path'));
    if (args.values.json) io.json(entries);
    else indexLines(entries).forEach((line) => io.out(line));
    return 0;
  },
};

export const capabilityCheckVerb: Verb = {
  noun: 'capability',
  verb: 'check',
  summary: 'Valida las capacidades y, con --artifact, el bloque «Capacidades» de una spec o un patch',
  options: { path: { type: 'string' }, artifact: { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const path = requiredOption(args, 'path');
    const artifact = artifactOption(args, io);
    if (typeof args.values.artifact === 'string' && !artifact) return 1;
    const { lines, code, valid } = validateCapabilities(path, artifact);
    if (!args.values.json) lines.forEach((line) => io.out(line));
    else io.json({ valid, errors: code ? lines : [] });
    return code;
  },
};

export const capabilityMergeVerb: Verb = {
  noun: 'capability',
  verb: 'merge',
  summary: 'Fusiona el delta de una spec o un patch en capabilities/',
  options: { path: { type: 'string' }, artifact: { type: 'string' } },
  async run(args, io) {
    const path = requiredOption(args, 'path');
    const artifact = requiredOption(args, 'artifact');
    if (!existsSync(artifact)) {
      io.err(`no existe el artefacto: ${artifact}`);
      return 1;
    }
    const { lines, code } = mergeDelta(path, artifact);
    lines.forEach((line) => io.out(line));
    return code;
  },
};
