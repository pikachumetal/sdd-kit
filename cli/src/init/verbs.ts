import { fileURLToPath } from 'node:url';
import { requiredRootOption, text, UsageError } from '../cli/args.ts';
import { localDay } from '../cli/dates.ts';
import { readText } from '../cli/files.ts';
import { isRecord } from '../cli/records.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { runInit, validateIgnore, type InitAction } from './run.ts';

const pluginJson = fileURLToPath(new URL('../../../.claude-plugin/plugin.json', import.meta.url));

export function kitVersion(file: string = pluginJson): string {
  return JSON.parse(readText(file)).version;
}

function parseConfig(raw: string): Record<string, unknown> {
  let config: unknown;
  try {
    config = JSON.parse(raw);
  } catch {
    throw new UsageError('--config debe ser un objeto JSON');
  }
  if (!isRecord(config)) throw new UsageError('--config debe ser un objeto JSON');
  return config;
}

function action(args: VerbArgs): InitAction {
  const approved = text(args, 'approved');
  const config = text(args, 'config');
  const finish = args.values.finish === true;
  if ([approved !== null, config !== null, finish].filter(Boolean).length !== 1) {
    throw new UsageError('indica una sola acción: --approved, --config o --finish');
  }
  if (approved !== null) return { kind: 'approved', path: approved };
  if (config !== null) return { kind: 'config', config: parseConfig(config) };
  const ignores = Array.isArray(args.values.ignore) ? (args.values.ignore as string[]) : [];
  return { kind: 'finish', ignores: ignores.map(validateIgnore), memoryOff: args.values['memory-off'] === true };
}

export const initVerb: Verb = {
  noun: 'init',
  summary: 'Registra el progreso de la init (--approved, --config) y escribe settings, .gitignore y sdd-kit.json (--finish)',
  options: {
    root: { type: 'string' },
    'project-root': { type: 'string' },
    approved: { type: 'string' },
    config: { type: 'string' },
    finish: { type: 'boolean' },
    ignore: { type: 'string', multiple: true },
    'memory-off': { type: 'boolean' },
  },
  async run(args, io) {
    const root = requiredRootOption(args, 'root', (root) => root);
    const today = localDay(new Date());
    return runInit({ root, action: action(args), kitVersion: kitVersion(), today }, io);
  },
};
