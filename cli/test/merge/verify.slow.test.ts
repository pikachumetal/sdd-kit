import { describe, it, expect } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { runVerification } from '../../src/merge/verify.ts';

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
});
