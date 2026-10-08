import { describe, it, expect } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { findLockedFile, runVerification, shellCommand } from '../../src/merge/verify.ts';

const WINDOWS_POWERSHELL_DIR = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0';

describe('merge --verify shell', () => {
  it.runIf(process.platform === 'win32')('runs the gate with powershell.exe when pwsh is not on the PATH', async () => {
    const saved = process.env.PATH;
    process.env.PATH = WINDOWS_POWERSHELL_DIR;
    const io = memoryIo();
    try {
      await runVerification({ worktree: process.cwd(), command: 'Write-Output hola', io });
    } finally {
      process.env.PATH = saved;
    }
    expect(io.stdout).toContain('hola');
  });

  it('prefers pwsh on Windows', () => {
    expect(shellCommand('echo x', 'win32', () => true)).toEqual(['pwsh', ['-NoProfile', '-Command', 'echo x']]);
  });

  it('falls back to powershell.exe on Windows', () => {
    const [program] = shellCommand('echo x', 'win32', (candidate) => candidate === 'powershell.exe');
    expect(program).toBe('powershell.exe');
  });

  it('names the shells it tried when none runs', () => {
    expect(() => shellCommand('echo x', 'win32', () => false)).toThrow(/pwsh.*powershell\.exe/);
  });

  it('uses sh outside Windows without probing', () => {
    expect(shellCommand('echo x', 'linux', () => false)).toEqual(['sh', ['-c', 'echo x']]);
  });
});

describe('merge --verify locked file', () => {
  it('names the file and the process MSBuild reports', () => {
    const output = 'warning MSB3026: Could not copy "obj\\App.dll" to "bin\\App.dll". The process cannot access the file \'bin\\App.dll\' because it is being used by another process. The file is locked by: "App.Api (4242)"';
    expect(findLockedFile(output)).toBe("'bin\\App.dll' lo tiene abierto App.Api (4242)");
  });

  it('names the file from the Spanish .NET message', () => {
    const output = "El proceso no tiene acceso al archivo 'C:\\b\\App.dll' porque está siendo utilizado en otro proceso.";
    expect(findLockedFile(output)).toBe("'C:\\b\\App.dll' lo tiene abierto otro proceso");
  });

  it('names the file from a Node EBUSY error', () => {
    expect(findLockedFile("Error: EBUSY: resource busy or locked, unlink 'dist/app.js'")).toBe("'dist/app.js' lo tiene abierto otro proceso");
  });

  it('returns nothing for a red test run', () => {
    expect(findLockedFile('Tests Failed: 3')).toBeUndefined();
  });
});
