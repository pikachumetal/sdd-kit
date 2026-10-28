import { describe, it, expect, vi } from 'vitest';
import type { PathLike } from 'node:fs';
import { gitBashTmpPath, repairGitBashTmp, withSystemMessage } from '../../bin/git-bash-tmp.js';

const DELETED = 'D:\\code\\.worktrees\\gone\\.temp\\vitest-CU4Bs3';

function memoryFs(existing: string[]) {
  const created: string[] = [];
  return {
    created,
    existsSync: (path: PathLike) => existing.includes(String(path)) || created.includes(String(path)),
    mkdirSync: (path: PathLike) => {
      created.push(String(path));
    },
  };
}

describe('repairGitBashTmp', () => {
  it('creates the deleted folder /tmp is mounted on and says so in one line', () => {
    const fs = memoryFs([]);
    const notice = repairGitBashTmp(DELETED, fs);
    expect(fs.created).toEqual([DELETED]);
    expect(notice).toBe(`sdd-kit: Git Bash tenía /tmp montado sobre una carpeta borrada; la he creado vacía: ${DELETED}`);
  });

  it('does nothing when the folder exists', () => {
    const fs = memoryFs([DELETED]);
    expect(repairGitBashTmp(DELETED, fs)).toBe('');
    expect(fs.created).toEqual([]);
  });

  it('does nothing without a mount', () => {
    const fs = memoryFs([]);
    expect(repairGitBashTmp('', fs)).toBe('');
    expect(fs.created).toEqual([]);
  });
});

describe('gitBashTmpPath', () => {
  const gitRoot = 'C:\\Program Files\\Git';
  const cygpath = `${gitRoot}\\usr\\bin\\cygpath.exe`;
  const installed = (path: PathLike) => [`${gitRoot}\\cmd\\git.exe`, cygpath].includes(String(path));

  it('asks the Git cygpath for the /tmp mount on Windows', () => {
    const run = vi.fn(() => `${DELETED}\r\n`);
    const path = gitBashTmpPath({ platform: 'win32', pathEnv: `C:\\Windows;${gitRoot}\\cmd`, exists: installed, run });
    expect(run).toHaveBeenCalledWith(cygpath, ['-w', '/tmp']);
    expect(path).toBe(DELETED);
  });

  it('runs nothing outside Windows', () => {
    const run = vi.fn(() => DELETED);
    expect(gitBashTmpPath({ platform: 'linux', pathEnv: `${gitRoot}\\cmd`, exists: installed, run })).toBe('');
    expect(run).not.toHaveBeenCalled();
  });

  it('runs nothing without Git in the PATH', () => {
    const run = vi.fn(() => DELETED);
    expect(gitBashTmpPath({ platform: 'win32', pathEnv: 'C:\\Windows', exists: installed, run })).toBe('');
    expect(run).not.toHaveBeenCalled();
  });
});

describe('withSystemMessage', () => {
  it('writes only the notice when the hook had nothing to say', () => {
    expect(JSON.parse(withSystemMessage('', 'aviso'))).toEqual({ systemMessage: 'aviso' });
  });

  it('puts the notice before the existing warnings and keeps the context', () => {
    const output = '{\n  "systemMessage": "viejo",\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "ctx"\n  }\n}\n';
    const merged = JSON.parse(withSystemMessage(output, 'aviso'));
    expect(merged.systemMessage).toBe('aviso\n\nviejo');
    expect(merged.hookSpecificOutput.additionalContext).toBe('ctx');
  });

  it('leaves the output untouched without a notice', () => {
    expect(withSystemMessage('{}\n', '')).toBe('{}\n');
  });
});
