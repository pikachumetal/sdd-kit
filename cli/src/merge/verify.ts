import { spawn } from 'node:child_process';
import { createWriteStream, readFileSync, rmSync, type WriteStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { git, gitLines } from '../git/git.ts';
import { launchSpec, resolveCommand } from '../tasks/command.ts';

export interface Verification {
  worktree: string;
  argv: string[];
  io: Io;
}

const LINE_BREAK = /\r?\n/;

const OPERATORS = ['&&', '||', ';', '|', '>', '<'];

function chained(operator: string): UsageError {
  return new UsageError(`--verify: el gate encadena comandos con '${operator}'; hazlo una tarea de moon o un script de package.json`);
}

export function parseGate(text: string): string[] {
  const words: string[] = [];
  let word: string | null = null;
  let quote: string | null = null;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (quote !== null) {
      if (char === quote) quote = null;
      else word += char;
      continue;
    }
    const operator = OPERATORS.find((candidate) => text.startsWith(candidate, index));
    if (operator !== undefined) throw chained(operator);
    if (char === '"' || char === "'") {
      quote = char;
      word ??= '';
    } else if (/\s/.test(char)) {
      if (word !== null) words.push(word);
      word = null;
    } else word = (word ?? '') + char;
  }
  if (word !== null) words.push(word);
  return words;
}

export class VerificationFailed extends DomainError {}

function logPath(kind: string): string {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  return join(tmpdir(), `sdd-merge-${kind}-${stamp}-${process.pid}.log`);
}

function lineSink(io: Io, file: WriteStream) {
  const decoder = new StringDecoder('utf8');
  let pending = '';
  return {
    push(chunk: Buffer) {
      file.write(chunk);
      const lines = (pending + decoder.write(chunk)).split(LINE_BREAK);
      pending = lines.pop() ?? '';
      lines.forEach((line) => io.out(line));
    },
    flush() {
      const rest = pending + decoder.end();
      if (rest !== '') io.out(rest);
    },
  };
}

function runTee({ worktree, argv, io }: Verification, log: string): Promise<number> {
  const resolved = resolveCommand(argv[0]);
  if (resolved === null) throw new DomainError(`verificación: no se encuentra '${argv[0]}' en el PATH`);
  const { file: program, args } = launchSpec(resolved, argv.slice(1));
  const file = createWriteStream(log);
  const sink = lineSink(io, file);
  const child = spawn(program, args, { cwd: worktree, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], windowsVerbatimArguments: program !== resolved });
  child.stdout.on('data', sink.push);
  child.stderr.on('data', sink.push);
  const finish = (code: number, done: (code: number) => void) => {
    sink.flush();
    file.end(() => done(code));
  };
  return new Promise((done) => {
    child.on('close', (code) => finish(code ?? 1, done));
    child.on('error', () => finish(127, done));
  });
}

// ponytail: reconoce los mensajes de .NET/MSBuild (inglés y castellano) y de Node; otro idioma o herramienta cae en verificación:.
const LOCKED_FILE = /(?:cannot access the file|no tiene acceso al archivo) '(?<file>[^']+)'|EBUSY: [^']*'(?<busy>[^']+)'/;
const LOCKING_PROCESS = /(?:locked by|bloqueado por): "(?<process>[^"]+)"/;

export function findLockedFile(output: string): string | undefined {
  const file = LOCKED_FILE.exec(output)?.groups;
  if (file === undefined) return undefined;
  const holder = LOCKING_PROCESS.exec(output)?.groups?.process ?? 'otro proceso';
  return `'${file.file ?? file.busy}' lo tiene abierto ${holder}`;
}

const FAILED_TEST = /(?:^|[\s|])(?:\[-\]|×|FAIL)\s/;
export const SHOWN_LINES = 20;

export function failedTestLines(lines: string[]): string[] {
  return lines.filter((line) => FAILED_TEST.test(line)).slice(0, SHOWN_LINES);
}

export function failureReport(lines: string[]): string {
  const failed = failedTestLines(lines);
  const header = failed.length === 0 ? [] : ['tests fallidos:', ...failed];
  return [...header, ...lines.slice(-SHOWN_LINES)].join('\n');
}

export async function onlyDocsSince(worktree: string, commit: string): Promise<boolean> {
  return (await git(worktree, ['diff', '--quiet', commit, 'HEAD', '--', '.', ':!.docs', ':!*.md'])).code === 0;
}

export async function resolveCommit(root: string, value: string): Promise<string> {
  const [commit] = await gitLines(root, ['rev-parse', '--verify', '--quiet', `${value}^{commit}`]);
  if (commit === undefined) throw new UsageError(`--verified-at: '${value}' no es un commit`);
  return commit;
}

export async function runVerification(verification: Verification): Promise<void> {
  const log = logPath('verify');
  const code = await runTee(verification, log);
  if (code === 0) return void rmSync(log, { force: true });
  const output = readFileSync(log, 'utf8');
  const locked = findLockedFile(output);
  if (locked !== undefined) throw new DomainError(`bloqueado: ${locked}; ciérralo y relanza el merge. Salida completa en ${log}`);
  const report = failureReport(output.split(LINE_BREAK).filter((line) => line !== ''));
  throw new VerificationFailed(`verificación: código de salida ${code}; salida completa en ${log}\n${report}`);
}

export interface VerifyRequest {
  command: string | null;
  verifiedAt: string | null;
}

export async function verifyMerge(worktree: string, { command, verifiedAt }: VerifyRequest, io: Io): Promise<void> {
  if (command === null || command.trim() === '') return;
  if (verifiedAt !== null && (await onlyDocsSince(worktree, verifiedAt))) {
    const [shortHash] = await gitLines(worktree, ['rev-parse', '--short', verifiedAt]);
    return io.out(`verificación: omitida: desde ${shortHash} solo cambian docs`);
  }
  await runVerification({ worktree, argv: parseGate(command), io });
}

// Tras deshacer el merge, el worktree ya está en la base: el mismo comando dice si el rojo es de la rama.
export async function explainFailure(error: unknown, { worktree, command, io }: Omit<Verification, 'argv'> & { command: string | null }): Promise<unknown> {
  if (!(error instanceof VerificationFailed) || command === null) return error;
  return new DomainError(`${error.message}\n${await baseVerdict({ worktree, argv: parseGate(command), io })}`);
}

async function baseVerdict(verification: Verification): Promise<string> {
  const log = logPath('verify-base');
  if ((await runTee(verification, log)) === 0) {
    rmSync(log, { force: true });
    return 'base: en verde: el rojo lo trae la rama';
  }
  return `base: en rojo: el mismo comando también falla sin la rama (salida en ${log}); mira la deuda del proyecto antes de investigar`;
}
