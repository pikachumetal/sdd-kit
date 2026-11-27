import { resolve } from 'node:path';
import { estimationLogPath } from '../cli/layout.ts';
import { rootOption } from '../cli/args.ts';
import type { Verb } from '../cli/verbs.ts';
import { generateEstimationLog, writeEstimationLog } from './log.ts';
import { attributeRows } from './authors.ts';
import { buildReport } from './report.ts';

export const estimationLogVerb: Verb = {
  noun: 'estimation',
  verb: 'log',
  summary: 'Regenera estimation-log.md a partir de los bloques de tiempo de los artefactos',
  options: { root: { type: 'string' }, 'project-root': { type: 'string' }, out: { type: 'string' } },
  async run(args, io) {
    const root = rootOption(args, 'root') ?? '.';
    const { text, rowCount, docsPath } = generateEstimationLog(root, io.err);
    const requested = args.values.out;
    const named = typeof requested === 'string' && requested.trim() !== '';
    const outFile = resolve(named ? requested : estimationLogPath(docsPath));
    writeEstimationLog(text, outFile, io.err);
    io.out(`Generado ${outFile} con ${rowCount} filas.`);
    return 0;
  },
};

export const estimationReportVerb: Verb = {
  noun: 'estimation',
  verb: 'report',
  summary: 'Saca el tiempo del proyecto por persona, carril, versión del kit y fase',
  options: { root: { type: 'string' }, 'project-root': { type: 'string' }, release: { type: 'string' } },
  async run(args, io) {
    const root = rootOption(args, 'root') ?? '.';
    const requested = args.values.release;
    const release = typeof requested === 'string' && requested.trim() !== '' ? requested.trim() : null;
    io.out(buildReport(root, { release, attribute: attributeRows }, io.err));
    return 0;
  },
};
