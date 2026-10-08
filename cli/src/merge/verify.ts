import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream, readFileSync, rmSync, type WriteStream } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { DomainError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';

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

function logPath(): string {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  return join(tmpdir(), `sdd-merge-verify-${stamp}-${process.pid}.log`);
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

export async function runVerification(verification: Verification): Promise<void> {
  const log = logPath();
  const code = await runTee(verification, log);
  if (code === 0) return void rmSync(log, { force: true });
  const tail = readFileSync(log, 'utf8').split(LINE_BREAK).filter((line) => line !== '').slice(-20);
  throw new DomainError(`verificación: código de salida ${code}; salida completa en ${log}\n${tail.join('\n')}`);
}
