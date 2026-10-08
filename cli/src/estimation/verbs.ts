import { resolve } from 'node:path';
import { estimationLogPath } from '../cli/layout.ts';
import type { Verb } from '../cli/verbs.ts';
import { generateEstimationLog, writeEstimationLog } from './log.ts';

export const estimationLogVerb: Verb = {
  noun: 'estimation',
  verb: 'log',
  summary: 'Regenera estimation-log.md a partir de los bloques de tiempo de los artefactos',
  options: { root: { type: 'string' }, out: { type: 'string' } },
  async run(args, io) {
    const root = typeof args.values.root === 'string' ? args.values.root : '.';
    const { text, rowCount, docsPath } = generateEstimationLog(root, io.err);
    const requested = args.values.out;
    const named = typeof requested === 'string' && requested.trim() !== '';
    const outFile = resolve(named ? requested : estimationLogPath(docsPath));
    writeEstimationLog(text, outFile, io.err);
    io.out(`Generado ${outFile} con ${rowCount} filas.`);
    return 0;
  },
};
