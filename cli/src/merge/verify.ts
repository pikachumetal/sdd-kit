import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream, readFileSync, rmSync, type WriteStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { git, gitLines } from '../git/git.ts';

export interface Verification {
  worktree: string;
  command: string;
  io: Io;
}

const LINE_BREAK = /\r?\n/;

const WINDOWS_SHELLS = ['pwsh', 'powershell.exe'];

type ShellProbe = (program: string) => boolean;

function runs(program: string): boolean {
  return spawnSync(program, ['-NoProfile', '-Command', 'exit 0'], { stdio: 'ignore', windowsHide: true }).error === undefined;
}

export function shellCommand(command: string, platform = process.platform, probe: ShellProbe = runs): [string, string[]] {
  if (platform !== 'win32') return ['sh', ['-c', command]];
  const program = WINDOWS_SHELLS.find(probe);
  if (program === undefined) {
    throw new DomainError(`verificación: no hay shell para ejecutar el gate; se probó ${WINDOWS_SHELLS.join(' y ')}`);
  }
  return [program, ['-NoProfile', '-Command', command]];
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

function runTee({ worktree, command, io }: Verification, log: string): Promise<number> {
  const [program, args] = shellCommand(command);
  const file = createWriteStream(log);
  const sink = lineSink(io, file);
  const child = spawn(program, args, { cwd: worktree, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
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
const SHOWN_LINES = 20;

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
  await runVerification({ worktree, command, io });
}

// Tras deshacer el merge, el worktree ya está en la base: el mismo comando dice si el rojo es de la rama.
export async function explainFailure(error: unknown, { worktree, command, io }: Omit<Verification, 'command'> & { command: string | null }): Promise<unknown> {
  if (!(error instanceof VerificationFailed) || command === null) return error;
  return new DomainError(`${error.message}\n${await baseVerdict({ worktree, command, io })}`);
}

async function baseVerdict(verification: Verification): Promise<string> {
  const log = logPath('verify-base');
  if ((await runTee(verification, log)) === 0) {
    rmSync(log, { force: true });
    return 'base: en verde: el rojo lo trae la rama';
  }
  return `base: en rojo: el mismo comando también falla sin la rama (salida en ${log}); mira la deuda del proyecto antes de investigar`;
}
