import { execFile } from 'node:child_process';
import { basename } from 'node:path';
import { isolatedEnv } from '../git/git.ts';
import { launchSpec, resolveCommand } from '../tasks/command.ts';

export interface MoonGate {
  before: string[];
  targets: string[];
  options: string[];
  passthrough: string[];
  affected: boolean;
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

export interface Range {
  base: string;
  head: string;
  relations: boolean;
}

const MOON = ['moon', 'moon.exe'];
const CROSSABLE_TARGET = /^[^:#~^-]+:[^:]+$|^:[^:]+$/;
const BLOCKING_OPTIONS = ['--stdin', '--status', '--force'];
const DROPPED_OPTIONS = ['--base', '--head'];
const QUERY_TIMEOUT_MS = 5 * 60 * 1000;

// Lo que moon exporta a sus tareas: heredado, el moon del worktree usaría el workspace de fuera (patch 0258).
const MOON_TASK_CONTEXT = /^MOON_(WORKSPACE_ROOT|WORKING_DIR|CACHE_DIR|PROJECT_\w+|TARGET|TASK_\w+)$/i;

export function withoutMoonTask(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return Object.fromEntries(Object.entries(env).filter(([name]) => !MOON_TASK_CONTEXT.test(name)));
}

const optionName =(token: string) => token.split('=')[0];
const firstLine = (text: string) => text.trim().split(/\r?\n/)[0] ?? '';

export const noCross = (reason: string) => `verificación: sin cruce: ${reason}; corre lo que toca la rama`;

function moonRunIndex(argv: string[]): number {
  return argv.findIndex((token, index) => MOON.includes(basename(token).toLowerCase()) && argv[index + 1] === 'run');
}

const looksLikeTarget = (token: string) => !token.startsWith('-') && token.includes(':');

// Un target tras las opciones vuelve con los demás; el resto (opciones y sus valores) se queda en su orden.
function splitOptions(tokens: string[]): { options: string[]; lateTargets: string[] } {
  const options: string[] = [];
  const lateTargets: string[] = [];
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const dropped = DROPPED_OPTIONS.includes(optionName(token));
    if (dropped && !token.includes('=')) index++;
    else if (!dropped) (looksLikeTarget(token) ? lateTargets : options).push(token);
  }
  return { options, lateTargets };
}

export function readMoonGate(argv: string[]): MoonGate | null {
  const at = moonRunIndex(argv);
  if (at === -1) return null;
  const rest = argv.slice(at + 2);
  const separator = rest.indexOf('--');
  const own = separator === -1 ? rest : rest.slice(0, separator);
  const firstOption = own.findIndex((token) => token.startsWith('-'));
  const { options, lateTargets } = splitOptions(firstOption === -1 ? [] : own.slice(firstOption));
  const targets = [...(firstOption === -1 ? own : own.slice(0, firstOption)), ...lateTargets];
  const names = options.map(optionName);
  const blockingOption = options.find((token) => BLOCKING_OPTIONS.includes(optionName(token)));
  return {
    before: argv.slice(0, at + 2),
    targets,
    options,
    passthrough: separator === -1 ? [] : rest.slice(separator),
    affected: names.includes('--affected'),
    relations: names.includes('-g') || names.includes('--include-relations'),
    blocker: blockingOption ?? targets.find((target) => !CROSSABLE_TARGET.test(target)) ?? null,
  };
}

export function matches(target: string, task: string): boolean {
  return target.startsWith(':') ? task.endsWith(target) : target === task;
}

export function parseTaskTargets(json: string): string[] {
  const tasks = (JSON.parse(json) as { tasks: Record<string, Record<string, { target: string }>> }).tasks;
  return Object.values(tasks).flatMap((project) => Object.values(project).map((task) => task.target));
}

// El stdin se cierra al lanzar: con él abierto, moon query espera la lista de ficheros y no acaba.
export function queryTasks(worktree: string, { base, head, relations }: Range, moon = 'moon'): Promise<string[]> {
  const resolved = resolveCommand(moon);
  if (resolved === null) return Promise.reject(new Error(`no se encuentra '${moon}' en el PATH`));
  const { file, args, windowsVerbatimArguments } = launchSpec(resolved, ['query', 'tasks', '--affected']);
  const env = { ...withoutMoonTask(isolatedEnv()), MOON_BASE: base, MOON_HEAD: head, ...(relations ? { MOON_INCLUDE_RELATIONS: 'true' } : {}) };
  const options = { cwd: worktree, env, windowsHide: true, windowsVerbatimArguments, timeout: QUERY_TIMEOUT_MS, maxBuffer: 64 * 1024 * 1024 };
  return new Promise((done, fail) => {
    const child = execFile(file, args, options, (error, stdout, stderr) => {
      if (error !== null) return fail(new Error(firstLine(stderr) || firstLine(stdout) || firstLine(error.message)));
      try {
        done(parseTaskTargets(stdout));
      } catch {
        fail(new Error(`la salida no es JSON: ${firstLine(stdout)}`));
      }
    });
    child.stdin?.end();
  });
}

// Sin --affected (y su valor, si lo lleva aparte), el contraste corre los targets enteros sobre la base.
function withoutAffected(options: string[]): string[] {
  const at = options.findIndex((token) => optionName(token) === '--affected');
  if (at === -1) return options;
  const valued = !options[at].includes('=') && options[at + 1] !== undefined && !options[at + 1].startsWith('-');
  return [...options.slice(0, at), ...options.slice(at + (valued ? 2 : 1))];
}
const named = (gate: MoonGate, tasks: string[]) => tasks.filter((task) => gate.targets.some((target) => matches(target, task)));

function planFor(gate: MoonGate, targets: string[], base: string): Omit<Plan, 'lines'> {
  return {
    run: [...gate.before, ...targets, ...gate.options, '--base', base, ...gate.passthrough],
    contrast: [...gate.before, ...targets, ...withoutAffected(gate.options), ...gate.passthrough],
  };
}

export function branchOnly(gate: MoonGate, mergeBase: string): Omit<Plan, 'lines'> {
  return planFor(gate, gate.targets, mergeBase);
}

export function planGate(gate: MoonGate, sides: Sides, bases: Bases): Plan {
  const branch = named(gate, sides.branch);
  if (sides.base === null || bases.verifiedAt === null) {
    if (branch.length === 0) return { run: null, contrast: null, lines: [] };
    return { ...planFor(gate, branch, bases.mergeBase), lines: [] };
  }
  const base = named(gate, sides.base);
  const crossed = branch.filter((task) => base.includes(task));
  const skipped = [
    ...branch.filter((task) => !crossed.includes(task)).map((task) => `verificación: ${task}: saltada (la base no toca sus inputs)`),
    ...base.filter((task) => !crossed.includes(task)).map((task) => `verificación: ${task}: saltada (solo la toca la base)`),
  ];
  if (crossed.length === 0) return { run: null, contrast: null, lines: skipped };
  return { ...planFor(gate, crossed, bases.verifiedAt), lines: [`verificación: corre ${crossed.join(' ')} (las tocan la rama y la base)`, ...skipped] };
}
