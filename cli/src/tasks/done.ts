import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DomainError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { git } from '../git/git.ts';
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

async function completionLine(request: DoneRequest, lines: string[]): Promise<string> {
  const last = lines.filter((line) => line.trim() !== '').at(-1) ?? '(sin salida)';
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

export async function finishTask(request: DoneRequest, io: Io): Promise<number> {
  await requireRevision(request.base, 'BASE');
  await requireCommitsSince(request);
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
