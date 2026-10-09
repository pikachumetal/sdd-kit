import { requiredOption } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { checkDecisions } from './check.ts';
import { decisionIndex } from './index.ts';

export const decisionCheckVerb: Verb = {
  noun: 'decision',
  verb: 'check',
  summary: 'Valida la forma de las ADR de decisions/',
  options: { path: { type: 'string' }, json: { type: 'boolean' } },
  async run(args, io) {
    const { lines, code } = checkDecisions(requiredOption(args, 'path'));
    if (args.values.json) io.json({ valid: code === 0, errors: code ? lines : [] });
    else lines.forEach((line) => io.out(line));
    return code;
  },
};

export const decisionIndexVerb: Verb = {
  noun: 'decision',
  verb: 'index',
  summary: 'Lista las ADR y, con --files, las vigentes que gobiernan esos ficheros',
  options: { path: { type: 'string' }, files: { type: 'string', multiple: true }, json: { type: 'boolean' } },
  positionals: ['[FILES...]'],
  async run(args, io) {
    const named = Array.isArray(args.values.files) ? (args.values.files as string[]) : [];
    const listed = [...named, ...args.positionals];
    const files = listed.length > 0 ? listed : undefined;
    const lines = decisionIndex(requiredOption(args, 'path'), files);
    if (args.values.json) io.json(lines);
    else lines.forEach((line) => io.out(line));
    return 0;
  },
};
