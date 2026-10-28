import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot, run, type RunResult } from './process.ts';

const hookScript = join(kitRoot, '.claude', 'hooks', 'kit-session-source.mjs');
const launcherPath = join(kitRoot, 'start-kit-session.mjs');
const root = kitRoot.replace(/[\\/]$/, '');

interface HookOutput {
  systemMessage: string;
  hookSpecificOutput: { hookEventName: string; additionalContext: string };
}

interface ClaudeCall {
  tmp: string | null;
  root: string | null;
  args: string[];
}

function newProject(hooksPath?: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'kit-session-'));
  run('git', ['init', '--quiet', dir]);
  if (hooksPath !== undefined) run('git', ['-C', dir, 'config', 'core.hooksPath', hooksPath]);
  return dir;
}

function invokeKitSessionHook(sessionRoot: string | null, projectDir: string): RunResult {
  const env: NodeJS.ProcessEnv = { ...cleanGitEnv, CLAUDE_PROJECT_DIR: projectDir };
  delete env.SDD_KIT_SESSION_ROOT;
  if (sessionRoot !== null) env.SDD_KIT_SESSION_ROOT = sessionRoot;
  return run(process.execPath, [hookScript], { env });
}

const parse = (result: RunResult): HookOutput => JSON.parse(result.output);

// Un `claude` falso al principio del PATH apunta lo que recibe y sale con 7.
function launchWithFakeClaude(tmpDir: string | undefined, args: string[]): { call: ClaudeCall; result: RunResult } {
  const bin = mkdtempSync(join(tmpdir(), 'fake-claude-'));
  const seen = join(bin, 'seen.json');
  const fake = join(bin, 'fake.mjs');
  writeFileSync(fake, `import { writeFileSync } from 'node:fs';\nwriteFileSync(${JSON.stringify(seen)}, JSON.stringify({ tmp: process.env.CLAUDE_CODE_TMPDIR ?? null, root: process.env.SDD_KIT_SESSION_ROOT ?? null, args: process.argv.slice(2) }));\nprocess.exit(7);\n`);
  writeFileSync(join(bin, 'claude.cmd'), `@"${process.execPath}" "${fake}" %*\r\n`);
  writeFileSync(join(bin, 'claude'), `#!/bin/sh\nexec "${process.execPath}" "${fake}" "$@"\n`, { mode: 0o755 });
  const env: NodeJS.ProcessEnv = { ...cleanGitEnv, PATH: `${bin}${delimiter}${process.env.PATH}` };
  delete env.CLAUDE_CODE_TMPDIR;
  delete env.SDD_KIT_SESSION_ROOT;
  if (tmpDir !== undefined) env.CLAUDE_CODE_TMPDIR = tmpDir;
  const result = run(process.execPath, [launcherPath, ...args], { env });
  return { call: JSON.parse(readFileSync(seen, 'utf8')), result };
}

describe('Hook SessionStart del repo', () => {
  let projectDir: string;

  beforeAll(() => {
    projectDir = newProject('.githooks');
  });

  it('la sesión lanzada con el script no escribe nada y sale con 0', () => {
    expect(invokeKitSessionHook(projectDir, projectDir)).toEqual({ output: '', code: 0 });
  });

  it('la misma carpeta escrita de otra forma tampoco avisa', () => {
    const sameFolder = `${projectDir.toUpperCase().replaceAll('\\', '/')}/`;
    expect(invokeKitSessionHook(sameFolder, projectDir).output).toBe('');
  });

  describe('sin SDD_KIT_SESSION_ROOT', () => {
    let result: RunResult;
    let json: HookOutput;

    beforeAll(() => {
      result = invokeKitSessionHook(null, projectDir);
      json = parse(result);
    });

    it('sale con 0', () => {
      expect(result.code).toBe(0);
    });

    it('systemMessage nombra start-kit-session.mjs', () => {
      expect(json.systemMessage).toMatch(/node start-kit-session\.mjs/);
    });

    it('hookSpecificOutput es de SessionStart', () => {
      expect(json.hookSpecificOutput.hookEventName).toBe('SessionStart');
    });

    it('additionalContext dice que las skills vienen de la caché', () => {
      expect(json.hookSpecificOutput.additionalContext).toMatch(/caché/);
    });

    it('additionalContext manda contrastar con skills/<nombre>/SKILL.md de la rama', () => {
      expect(json.hookSpecificOutput.additionalContext).toContain('skills/<nombre>/SKILL.md');
    });

    it('systemMessage nombra las skills y los agentes', () => {
      expect(json.systemMessage).toContain('Las skills y los agentes del kit');
    });

    it('additionalContext nombra los agentes sdd-kit:*', () => {
      expect(json.hookSpecificOutput.additionalContext).toContain('Las skills y los agentes sdd-kit:*');
    });

    it('additionalContext manda leer de la rama una skill que no resuelve', () => {
      expect(json.hookSpecificOutput.additionalContext).toMatch(/no resuelve/);
    });

    it('systemMessage dice cómo reanudar con el script', () => {
      expect(json.systemMessage).toMatch(/--resume/);
      expect(json.systemMessage).toMatch(/--continue/);
    });

    it('no avisa de los hooks de git si core.hooksPath es .githooks', () => {
      expect(json.systemMessage).not.toMatch(/core\.hooksPath/);
    });
  });

  describe('con SDD_KIT_SESSION_ROOT de otro worktree', () => {
    const otherRoot = join(tmpdir(), 'otro-worktree');
    let json: HookOutput;

    beforeAll(() => {
      json = parse(invokeKitSessionHook(otherRoot, projectDir));
    });

    it('avisa nombrando las skills y los agentes', () => {
      expect(json.systemMessage).toContain('Las skills y los agentes del kit');
    });

    it('avisa nombrando las dos carpetas', () => {
      expect(json.systemMessage).toContain(otherRoot);
      expect(json.systemMessage).toContain(projectDir);
    });

    it('nombra start-kit-session.mjs', () => {
      expect(json.systemMessage).toContain('start-kit-session.mjs');
    });

    it('da al agente la misma instrucción', () => {
      expect(json.hookSpecificOutput.additionalContext).toContain('skills/<nombre>/SKILL.md');
    });
  });

  it('con SDD_KIT_SESSION_ROOT inválida avisa y sale con 0', () => {
    const result = invokeKitSessionHook('   ', projectDir);
    expect(result.code).toBe(0);
    expect(parse(result).systemMessage).toBeTruthy();
  });
});

describe('Hook SessionStart: hooks de git', () => {
  let result: RunResult;
  let json: HookOutput;

  beforeAll(() => {
    const bareProject = newProject();
    result = invokeKitSessionHook(bareProject, bareProject);
    json = parse(result);
  });

  it('sin core.hooksPath avisa aunque la sesión salga del script, y sale con 0', () => {
    expect(result.code).toBe(0);
    expect(json.systemMessage).toMatch(/hooks de git/);
  });

  it('systemMessage da el comando para activarlos', () => {
    expect(json.systemMessage).toContain('git config core.hooksPath .githooks');
  });

  it('additionalContext avisa al agente de que el pre-commit no corre', () => {
    expect(json.hookSpecificOutput.additionalContext).toMatch(/pre-commit/);
  });

  it('no da el aviso de la caché si la sesión salió del script', () => {
    expect(json.systemMessage).not.toMatch(/caché/);
  });
});

describe('start-kit-session.mjs', () => {
  it('passes the variables and the arguments to claude', () => {
    const { call } = launchWithFakeClaude(undefined, ['--model', 'sonnet']);
    expect(call).toEqual({
      tmp: join(root, '.temp'),
      root,
      args: ['--settings', '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}', '--plugin-dir', root, '--model', 'sonnet'],
    });
  });

  it('keeps CLAUDE_CODE_TMPDIR when it is already set', () => {
    expect(launchWithFakeClaude('D:/otra/.temp', []).call.tmp).toBe('D:/otra/.temp');
  });

  it('sets CLAUDE_CODE_TMPDIR when it is empty', () => {
    expect(launchWithFakeClaude('', []).call.tmp).toBe(join(root, '.temp'));
  });

  it('exits with the code of claude', () => {
    expect(launchWithFakeClaude(undefined, []).result.code).toBe(7);
  });

  it('says so when claude is not on the PATH', () => {
    const env: NodeJS.ProcessEnv = { ...cleanGitEnv, PATH: dirname(process.execPath) };
    expect(run(process.execPath, [launcherPath], { env })).toEqual({ output: 'start-kit-session: no encuentro claude en el PATH.', code: 127 });
  });
});

describe('.claude/settings.json', () => {
  type HookEntry = { hooks: { command: string }[] };
  const hooks: Record<string, HookEntry[]> = JSON.parse(readFileSync(join(kitRoot, '.claude', 'settings.json'), 'utf8')).hooks;
  const commandsOf = (entries: HookEntry[]): string[] => entries.flatMap((entry) => entry.hooks.map((hook) => hook.command));

  it('registra un hook SessionStart que ejecuta kit-session-source.mjs con node', () => {
    expect(commandsOf(hooks.SessionStart).some((command) => /^node\s/.test(command) && /kit-session-source\.mjs/.test(command))).toBe(true);
  });

  it('ningún hook llama a pwsh', () => {
    expect(commandsOf(Object.values(hooks).flat()).filter((command) => /\bpwsh\b/.test(command))).toEqual([]);
  });
});
