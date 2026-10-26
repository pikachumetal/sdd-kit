import { existsSync } from 'node:fs';
import { requiredOption, requiredRootOption } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { docsFolder } from '../cli/layout.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { validateCapabilities } from './check.ts';
import { capabilityIndex, indexLines } from './index.ts';
import { mergeDelta } from './merge.ts';

function reportMissingArtifact(artifact: string, asJson: boolean, io: Io): number {
  const message = `no existe el artefacto: ${artifact}`;
  if (asJson) io.json({ validCount: 0, errors: [message] });
  else io.err(message);
  return 1;
}

export const capabilityIndexVerb: Verb = {
  noun: 'capability',
  verb: 'index',
  summary: 'Lista las capacidades con su propósito',
  options: { path: { type: 'string' }, 'project-root': { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const entries = capabilityIndex(requiredRootOption(args, 'path', docsFolder));
    if (args.values.json) io.json(entries);
    else indexLines(entries).forEach((line) => io.out(line));
    return 0;
  },
};

export const capabilityCheckVerb: Verb = {
  noun: 'capability',
  verb: 'check',
  summary: 'Valida las capacidades y, con --artifact, el bloque «Capacidades» de una spec o un patch',
  options: { path: { type: 'string' }, 'project-root': { type: 'string' }, artifact: { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const path = requiredRootOption(args, 'path', docsFolder);
    const artifact = typeof args.values.artifact === 'string' ? args.values.artifact : undefined;
    if (artifact !== undefined && !existsSync(artifact)) return reportMissingArtifact(artifact, args.values.json === true, io);
    const { lines, code, validCount, foreign } = validateCapabilities(path, artifact);
    if (args.values.json) {
      const errors = code ? lines : [];
      io.json(artifact === undefined ? { validCount, errors } : { validCount, errors, foreign });
      return code;
    }
    lines.forEach((line) => io.out(line));
    if (foreign.length) {
      io.out(`Ajenos al artefacto, no cambian el código de salida: ${foreign.length}`);
      foreign.forEach((line) => io.out(`  ${line}`));
    }
    return code;
  },
};

export const capabilityMergeVerb: Verb = {
  noun: 'capability',
  verb: 'merge',
  summary: 'Fusiona el delta de una spec o un patch en capabilities/',
  options: { path: { type: 'string' }, 'project-root': { type: 'string' }, artifact: { type: 'string' } },
  async run(args, io) {
    const path = requiredRootOption(args, 'path', docsFolder);
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
