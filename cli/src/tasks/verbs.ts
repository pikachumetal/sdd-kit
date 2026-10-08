import { UsageError } from '../cli/args.ts';
import type { Verb, VerbArgs } from '../cli/verbs.ts';
import { git } from '../git/git.ts';
import { writeBrief } from './brief.ts';
import { finishTask } from './done.ts';
import { writePackage } from './package.ts';
import { listRulings } from './rulings.ts';
import { workspaceFor } from './workspace.ts';

function positional(args: VerbArgs, index: number, usage: string): string {
  const value = args.positionals[index];
  if (value === undefined) throw new UsageError(`usage: ${usage}`);
  return value;
}

function taskNumber(value: string, usage: string): string {
  if (!/^[0-9]+$/.test(value)) throw new UsageError(`usage: ${usage}`);
  return value;
}

function exactly(args: VerbArgs, count: number, usage: string): string[] {
  if (args.positionals.length !== count) throw new UsageError(`usage: ${usage}`);
  return args.positionals;
}

function between(args: VerbArgs, range: [number, number], usage: string): string[] {
  const size = args.positionals.length;
  if (size < range[0] || size > range[1]) throw new UsageError(`usage: ${usage}`);
  return args.positionals;
}

export const workspaceVerb: Verb = {
  noun: 'workspace',
  summary: 'Resuelve y crea el workspace de SDD de un plan',
  options: {},
  positionals: ['plan'],
  async run(args, io) {
    const [plan] = exactly(args, 1, 'sdd workspace PLAN_FILE');
    io.out(await workspaceFor(plan));
    return 0;
  },
};

export const taskStartVerb: Verb = {
  noun: 'task',
  verb: 'start',
  summary: 'Extrae el brief de una task y registra el commit base',
  options: {},
  positionals: ['plan', 'n'],
  async run(args, io) {
    const usage = 'sdd task start PLAN_FILE TASK_NUMBER';
    const [plan, number] = exactly(args, 2, usage);
    const task = taskNumber(number, usage);
    const { path } = await writeBrief({ plan, task });
    io.out(`brief: ${path}`);
    io.out(`base: ${(await git(process.cwd(), ['rev-parse', 'HEAD'])).stdout.trim()}`);
    return 0;
  },
};

export const taskBriefVerb: Verb = {
  noun: 'task',
  verb: 'brief',
  summary: 'Extrae el texto de una task del plan a un fichero',
  options: {},
  positionals: ['plan', 'n', 'out'],
  async run(args, io) {
    const usage = 'sdd task brief PLAN_FILE TASK_NUMBER [OUTFILE]';
    const [plan, number, out] = between(args, [2, 3], usage);
    const task = taskNumber(number, usage);
    const written = await writeBrief({ plan, task, out });
    io.out(`wrote ${written.path}: ${written.lines} lines`);
    return 0;
  },
};

export const taskDoneVerb: Verb = {
  noun: 'task',
  verb: 'done',
  summary: 'Ejecuta los tests de una task y, si pasan, la anota en el ledger',
  options: {},
  positionals: ['plan', 'n', 'base', 'command'],
  async run(args, io) {
    const usage = 'sdd task done PLAN_FILE TASK_NUMBER BASE -- TEST_COMMAND [ARGS...]';
    const [plan, number, base, ...command] = args.positionals;
    if (!args.hasSeparator || command.length === 0 || base === undefined) throw new UsageError(`usage: ${usage}`);
    return finishTask({ plan, task: taskNumber(number, usage), base, command }, io);
  },
};

export const reviewPackageVerb: Verb = {
  noun: 'review',
  verb: 'package',
  summary: 'Genera el paquete de revisión de un rango de commits',
  options: {},
  positionals: ['plan', 'base', 'head', 'out'],
  async run(args, io) {
    const [plan, base, head, out] = between(args, [3, 4], 'sdd review package PLAN_FILE BASE HEAD [OUTFILE]');
    const written = await writePackage({ plan, base, head, out });
    io.out(`wrote ${written.path}: ${written.commits} commit(s), ${written.bytes} bytes`);
    return 0;
  },
};

export const ledgerRulingsVerb: Verb = {
  noun: 'ledger',
  verb: 'rulings',
  summary: 'Lista los rulings y los minor diferidos del ledger de un plan',
  options: { json: { type: 'boolean' } },
  positionals: ['plan'],
  async run(args, io) {
    const rulings = listRulings(await workspaceFor(positional(args, 0, 'sdd ledger rulings PLAN_FILE [--json]')));
    if (args.values.json) io.json(rulings);
    else if (rulings.length === 0) io.out('Sin rulings');
    else rulings.forEach((line) => io.out(line));
    return 0;
  },
};
