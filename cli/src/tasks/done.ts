import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { DomainError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { git, gitLines } from '../git/git.ts';
import { requireRepo } from './repo.ts';
import { requireRevision } from './revision.ts';
import { runToLog } from './command.ts';
import { workspaceFor } from './workspace.ts';

export interface DoneRequest {
  plan: string;
  task: string;
  base: string;
  command: string[];
}

const TAIL_LINES = 5;
const NEEDS_QUOTES = /[\s";|&]/;

export function renderCommand(command: string[]): string {
  return command.map((arg) => (NEEDS_QUOTES.test(arg) ? `'${arg}'` : arg)).join(' ');
}

function logLines(log: string): string[] {
  const text = readFileSync(log, 'utf8').replace(/\r\n/g, '\n');
  return text === '' ? [] : text.replace(/\n$/, '').split('\n');
}

async function shortSha(rev: string): Promise<string> {
  return (await git(process.cwd(), ['rev-parse', '--short=7', rev])).stdout.trim();
}

// vitest cierra con `Duration`; el recuento es la línea `Tests`.
export function resultLine(lines: string[]): string {
  const filled = lines.filter((line) => line.trim() !== '');
  return filled.findLast((line) => line.trimStart().startsWith('Tests ')) ?? filled.at(-1) ?? '(sin salida)';
}

async function completionLine(request: DoneRequest, lines: string[]): Promise<string> {
  const last = resultLine(lines);
  const range = `${await shortSha(request.base)}..${await shortSha('HEAD')}`;
  return `Task ${request.task}: complete (commits ${range}, tests: ${renderCommand(request.command)} → ${last})`;
}

function appendToLedger(workspace: string, request: DoneRequest, line: string): void {
  const ledger = join(workspace, 'progress.md');
  if (!existsSync(ledger)) writeFileSync(ledger, `# SDD ledger — plan: ${request.plan}\n`);
  appendFileSync(ledger, `${line}\n`);
}

async function requireCommitsSince(request: DoneRequest): Promise<void> {
  const [base, head] = await Promise.all([`${request.base}^{commit}`, 'HEAD'].map(async (rev) => (await git(process.cwd(), ['rev-parse', rev])).stdout.trim()));
  if (base === head) throw new DomainError(`Task ${request.task} NOT recorded: sin commits en el rango: ¿falló el pre-commit?`);
}

const VITEST = /(^|[\\/])vitest(\.\w+)?$/i;
const TEST_TIMEOUT = /^--test-?timeout/i;

// ponytail: solo las opciones con valor más usadas; otra con valor separado (`--pool forks`) cuenta como filtro: añadirla aquí.
const VALUE_OPTIONS = new Set(['-t', '--testNamePattern', '-c', '--config', '-r', '--root', '--dir', '--reporter', '--maxWorkers', '--minWorkers', '--project', '--pool', '--outputFile', '--shard', '--environment', '--exclude']);
const NAMED_FILES = 3;

function vitestFilters(args: string[], root: string): string[] {
  const filters = args.filter((arg, index) => arg !== 'run' && !arg.startsWith('-') && !VALUE_OPTIONS.has(args[index - 1]));
  return filters.map((arg) => (isAbsolute(arg) ? relative(root, arg) : arg).replace(/\\/g, '/').replace(/^\.\//, ''));
}

// Vitest corre los ficheros cuya ruta contiene algún filtro, y todos sin filtros (0319: 5 s no bastan a los lentos).
async function slowWithoutTimeout(command: string[], root: string): Promise<string[]> {
  const at = command.findIndex((arg) => VITEST.test(arg));
  if (at === -1 || command.some((arg) => TEST_TIMEOUT.test(arg))) return [];
  const filters = vitestFilters(command.slice(at + 1), root);
  const slow = await gitLines(root, ['ls-files', '--cached', '--others', '--exclude-standard', '--', '*.slow.test.ts']);
  return slow.filter((file) => filters.length === 0 || filters.some((filter) => file.includes(filter)));
}

async function requireTestTimeout(request: DoneRequest, root: string): Promise<void> {
  const slow = await slowWithoutTimeout(request.command, root);
  if (slow.length === 0) return;
  const more = slow.length > NAMED_FILES ? ` y ${slow.length - NAMED_FILES} más` : '';
  throw new DomainError(`Task ${request.task} NOT recorded: vitest corre ${slow.slice(0, NAMED_FILES).join(', ')}${more} sin --test-timeout: añade --test-timeout 120000`);
}

export async function finishTask(request: DoneRequest, io: Io): Promise<number> {
  const root = await requireRepo('commit');
  await requireRevision(request.base, 'BASE');
  await requireCommitsSince(request);
  await requireTestTimeout(request, root);
  const workspace = await workspaceFor(request.plan);
  const log = join(workspace, `task-${request.task}-tests.log`);
  const code = await runToLog(request.command, log);
  const lines = logLines(log);
  lines.slice(-TAIL_LINES).forEach((line) => io.out(line));
  if (code !== 0) {
    io.err(`task-done: test command exited ${code}; Task ${request.task} NOT recorded (full output: ${log})`);
    return code;
  }
  const line = await completionLine(request, lines);
  appendToLedger(workspace, request, line);
  io.out(`ledger: ${line}`);
  return 0;
}
