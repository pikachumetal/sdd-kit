import { describe, it, expect } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { runVerification, shellCommand } from '../../src/merge/verify.ts';

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
