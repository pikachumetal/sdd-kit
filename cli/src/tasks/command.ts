import { spawn } from 'node:child_process';
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

function launchSpec(path: string, args: string[]): { file: string; args: string[] } {
  const isScript = process.platform === 'win32' && ['.cmd', '.bat'].includes(extname(path).toLowerCase());
  return isScript ? windowsScriptCall(path, args) : { file: path, args };
}

export async function runToLog(command: string[], log: string): Promise<number> {
  writeFileSync(log, '');
  const resolved = resolveCommand(command[0]);
  if (resolved === null) return COMMAND_NOT_FOUND;
  const fd = openSync(log, 'w');
  const { file, args } = launchSpec(resolved, command.slice(1));
  try {
    return await new Promise<number>((done) => {
      const child = spawn(file, args, { stdio: ['ignore', fd, fd], windowsHide: true, windowsVerbatimArguments: file !== resolved });
      child.on('error', () => done(COMMAND_NOT_FOUND));
      child.on('close', (code) => done(code ?? 1));
    });
  } finally {
    closeSync(fd);
  }
}
