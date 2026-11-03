import { spawn, spawnSync } from 'node:child_process';
import { closeSync, openSync, statSync, writeFileSync } from 'node:fs';
import { delimiter, extname, isAbsolute, join } from 'node:path';

export const COMMAND_NOT_FOUND = 127;

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function extensions(command: string): string[] {
  if (process.platform !== 'win32') return [''];
  const listed = (process.env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD').split(';').filter((ext) => ext !== '');
  const hasExtension = listed.some((ext) => command.toLowerCase().endsWith(ext.toLowerCase()));
  return hasExtension ? ['', ...listed] : listed;
}

function searchDirectories(command: string): string[] {
  if (isAbsolute(command) || /[\\/]/.test(command)) return [''];
  return (process.env.PATH ?? '').split(delimiter).filter((dir) => dir !== '');
}

export function resolveCommand(command: string): string | null {
  for (const dir of searchDirectories(command)) {
    for (const ext of extensions(command)) {
      const candidate = dir === '' ? command + ext : join(dir, command + ext);
      if (isFile(candidate)) return candidate;
    }
  }
  return null;
}

function windowsScriptCall(path: string, args: string[]): { file: string; args: string[] } {
  const quoted = [path, ...args].map((arg) => `"${arg.replace(/"/g, '""')}"`).join(' ');
  return { file: process.env.ComSpec ?? 'cmd.exe', args: ['/d', '/s', '/c', `"${quoted}"`] };
}

export interface LaunchSpec {
  file: string;
  args: string[];
  windowsVerbatimArguments: boolean;
}

export function launchSpec(path: string, args: string[]): LaunchSpec {
  const isScript = process.platform === 'win32' && ['.cmd', '.bat'].includes(extname(path).toLowerCase());
  return isScript ? { ...windowsScriptCall(path, args), windowsVerbatimArguments: true } : { file: path, args, windowsVerbatimArguments: false };
}

export function runInherited(command: string[], cwd: string): Promise<number> {
  const resolved = resolveCommand(command[0]);
  if (resolved === null) return Promise.resolve(COMMAND_NOT_FOUND);
  const { file, args, windowsVerbatimArguments } = launchSpec(resolved, command.slice(1));
  return new Promise<number>((done) => {
    const child = spawn(file, args, { cwd, stdio: 'inherit', windowsHide: true, windowsVerbatimArguments });
    child.on('error', () => done(COMMAND_NOT_FOUND));
    child.on('close', (code) => done(code ?? 1));
  });
}

export interface Started {
  exit: Promise<number>;
  stop: () => void;
}

// En POSIX el comando va en su propio grupo de procesos para poder pararlo con sus hijos; en Windows, taskkill /T.
function stopTree(pid: number | undefined): void {
  if (pid === undefined) return;
  try {
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
    else process.kill(-pid, 'SIGKILL');
  } catch {
    // ya había salido
  }
}

export function startToLog(command: string[], log: string): Started {
  const fd = openSync(log, 'w');
  const resolved = resolveCommand(command[0]);
  if (resolved === null) {
    closeSync(fd);
    return { exit: Promise.resolve(COMMAND_NOT_FOUND), stop: () => undefined };
  }
  const { file, args, windowsVerbatimArguments } = launchSpec(resolved, command.slice(1));
  const child = spawn(file, args, { stdio: ['ignore', fd, fd], windowsHide: true, windowsVerbatimArguments, detached: process.platform !== 'win32' });
  closeSync(fd);
  const exit = new Promise<number>((done) => {
    child.on('error', () => done(COMMAND_NOT_FOUND));
    child.on('close', (code) => done(code ?? 1));
  });
  return { exit, stop: () => stopTree(child.pid) };
}

export async function runToLog(command: string[], log: string): Promise<number> {
  writeFileSync(log, '');
  const resolved = resolveCommand(command[0]);
  if (resolved === null) return COMMAND_NOT_FOUND;
  const fd = openSync(log, 'w');
  const { file, args, windowsVerbatimArguments } = launchSpec(resolved, command.slice(1));
  try {
    return await new Promise<number>((done) => {
      const child = spawn(file, args, { stdio: ['ignore', fd, fd], windowsHide: true, windowsVerbatimArguments });
      child.on('error', () => done(COMMAND_NOT_FOUND));
      child.on('close', (code) => done(code ?? 1));
    });
  } finally {
    closeSync(fd);
  }
}
