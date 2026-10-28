import { execFile } from 'node:child_process';
import { basename } from 'node:path';
import { launchSpec, resolveCommand } from '../tasks/command.ts';

export interface MoonGate {
  before: string[];
  targets: string[];
  options: string[];
  affected: boolean;
  base: string | null;
  relations: boolean;
  blocker: string | null;
}

export interface Plan {
  run: string[] | null;
  contrast: string[] | null;
  lines: string[];
}

export interface Sides {
  branch: string[];
  base: string[] | null;
}

export interface Bases {
  mergeBase: string;
  verifiedAt: string | null;
}

const MOON = ['moon', 'moon.exe'];
const CROSSABLE_TARGET = /^[^:#~^]+:[^:]+$|^:[^:]+$/;
const BLOCKING_OPTIONS = ['--stdin', '--status', '--force'];

const optionName = (token: string) => token.split('=')[0];

function moonRunIndex(argv: string[]): number {
  return argv.findIndex((token, index) => MOON.includes(basename(token).toLowerCase()) && argv[index + 1] === 'run');
}

function splitOptions(tokens: string[]): { options: string[]; base: string | null } {
  const options: string[] = [];
  let base: string | null = null;
  for (let index = 0; index < tokens.length; index++) {
    const [name, value] = [optionName(tokens[index]), tokens[index].split('=')[1]];
    if (name !== '--base' && name !== '--head') options.push(tokens[index]);
    else if (value === undefined) index++;
    if (name === '--base') base = value ?? tokens[index] ?? null;
  }
  return { options, base };
}

export function readMoonGate(argv: string[]): MoonGate | null {
  const at = moonRunIndex(argv);
  if (at === -1) return null;
  const rest = argv.slice(at + 2);
  const firstOption = rest.findIndex((token) => token.startsWith('-'));
  const targets = firstOption === -1 ? rest : rest.slice(0, firstOption);
  const { options, base } = splitOptions(firstOption === -1 ? [] : rest.slice(firstOption));
  const names = options.map(optionName);
  const blocker = options.find((token) => BLOCKING_OPTIONS.includes(optionName(token))) ?? targets.find((target) => !CROSSABLE_TARGET.test(target)) ?? null;
  return {
    before: argv.slice(0, at + 2),
    targets,
    options,
    affected: names.includes('--affected'),
    base,
    relations: names.includes('-g') || names.includes('--include-relations'),
    blocker,
  };
}

export function matches(target: string, task: string): boolean {
  return target.startsWith(':') ? task.endsWith(target) : target === task;
}

export function parseTaskTargets(json: string): string[] {
  const tasks = (JSON.parse(json) as { tasks: Record<string, Record<string, { target: string }>> }).tasks;
  return Object.values(tasks).flatMap((project) => Object.values(project).map((task) => task.target));
}

export function queryTasks(worktree: string, base: string, head: string, relations: boolean): Promise<string[]> {
  const resolved = resolveCommand('moon');
  if (resolved === null) return Promise.reject(new Error("no se encuentra 'moon' en el PATH"));
  const { file, args } = launchSpec(resolved, ['query', 'tasks', '--affected']);
  const env = { ...process.env, MOON_BASE: base, MOON_HEAD: head, ...(relations ? { MOON_INCLUDE_RELATIONS: 'true' } : {}) };
  return new Promise((done, fail) => {
    const child = execFile(file, args, { cwd: worktree, env, windowsHide: true, maxBuffer: 64 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error !== null) return fail(new Error(stderr.trim().split(/\r?\n/)[0] || error.message));
      try {
        done(parseTaskTargets(stdout));
      } catch {
        fail(new Error(`la salida no es JSON: ${stdout.trim().split(/\r?\n/)[0] ?? ''}`));
      }
    });
    child.stdin?.end();
  });
}

const withoutAffected = (options: string[]) => options.filter((token) => optionName(token) !== '--affected');
const named = (gate: MoonGate, tasks: string[]) => tasks.filter((task) => gate.targets.some((target) => matches(target, task)));

export function branchOnly(gate: MoonGate, mergeBase: string): Omit<Plan, 'lines'> {
  return { run: [...gate.before, ...gate.targets, ...gate.options, '--base', mergeBase], contrast: [...gate.before, ...gate.targets, ...withoutAffected(gate.options)] };
}

export function planGate(gate: MoonGate, sides: Sides, bases: Bases): Plan {
  const branch = named(gate, sides.branch);
  if (sides.base === null || bases.verifiedAt === null) {
    if (branch.length === 0) return { run: null, contrast: null, lines: [] };
    return { run: [...gate.before, ...branch, ...gate.options, '--base', bases.mergeBase], contrast: [...gate.before, ...branch, ...withoutAffected(gate.options)], lines: [] };
  }
  const base = named(gate, sides.base);
  const crossed = branch.filter((task) => base.includes(task));
  const skipped = [
    ...branch.filter((task) => !crossed.includes(task)).map((task) => `verificación: ${task}: saltada (la base no toca sus inputs)`),
    ...base.filter((task) => !crossed.includes(task)).map((task) => `verificación: ${task}: saltada (solo la toca la base)`),
  ];
  if (crossed.length === 0) return { run: null, contrast: null, lines: skipped };
  return {
    run: [...gate.before, ...crossed, ...gate.options, '--base', bases.verifiedAt],
    contrast: [...gate.before, ...crossed, ...withoutAffected(gate.options)],
    lines: [`verificación: corre ${crossed.join(' ')} (las tocan la rama y la base)`, ...skipped],
  };
}
