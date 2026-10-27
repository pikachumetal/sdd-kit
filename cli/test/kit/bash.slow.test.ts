import { describe, expect, it } from 'vitest';
import { resolveBash } from './bash.ts';
import { cleanGitEnv, run } from './process.ts';

const withoutProgramFiles = (path: string): NodeJS.ProcessEnv => ({ ...cleanGitEnv, ProgramFiles: undefined, 'ProgramFiles(x86)': undefined, PATH: path });

describe('resolveBash', () => {
  it('resolveBash prefiere Git Bash al lanzador de WSL', () => {
    const bash = resolveBash();
    expect(bash).not.toMatch(/System32/i);
    expect(run(bash, ['-c', 'echo ok']).output).toBe('ok');
  });

  it.runIf(process.platform === 'win32')('salta el bash de System32 aunque vaya antes en el PATH', () => {
    const bash = resolveBash(withoutProgramFiles(`C:\\Windows\\System32;${process.env.ProgramFiles}\\Git\\bin`));

    expect(bash).toMatch(/[\\/]Git[\\/]bin[\\/]bash\.exe$/i);
  });

  it.runIf(process.platform === 'win32')('sin Git Bash ni otro bash falla, en vez de devolver el aviso de where', () => {
    expect(() => resolveBash(withoutProgramFiles('C:\\Windows\\System32'))).toThrow(/no hay Git Bash/);
  });
});
