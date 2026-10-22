import { fileURLToPath } from 'node:url';
import { requiredOption } from '../cli/args.ts';
import { readText } from '../cli/files.ts';
import type { Verb } from '../cli/verbs.ts';
import { parseSteps, startValidationServer } from './server.ts';

const panelPath = fileURLToPath(new URL('../../../skills/sdd-archive/references/validation-panel.js', import.meta.url));

function untilStopped(): Promise<void> {
  return new Promise((resolve) => {
    process.once('SIGINT', resolve);
    process.once('SIGTERM', resolve);
  });
}

function readSteps(path: string): string {
  try {
    return readText(path);
  } catch {
    return '';
  }
}

export const validationServeVerb: Verb = {
  noun: 'validation',
  verb: 'serve',
  summary: 'Sirve el panel de validación y guarda las marcas',
  options: { steps: { type: 'string' }, out: { type: 'string' } },
  async run(args, io) {
    const stepsPath = requiredOption(args, 'steps');
    const out = requiredOption(args, 'out');
    const steps = parseSteps(readSteps(stepsPath), stepsPath);
    const server = await startValidationServer({ steps, out, panelSource: readText(panelPath) });
    io.out(`panel: ${server.url}`);
    await untilStopped();
    await server.close();
    return 0;
  },
};
