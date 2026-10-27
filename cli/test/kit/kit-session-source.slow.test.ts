import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot, run, type RunResult } from './process.ts';

const hookScript = join(kitRoot, '.claude', 'hooks', 'Test-KitSessionSource.ps1');
const launcherPath = join(kitRoot, 'Start-KitSession.ps1');

interface HookOutput {
  systemMessage: string;
  hookSpecificOutput: { hookEventName: string; additionalContext: string };
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
  return run('pwsh', ['-NoProfile', '-File', hookScript], { env });
}

const parse = (result: RunResult): HookOutput => JSON.parse(result.output);

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

    it('systemMessage nombra Start-KitSession.ps1', () => {
      expect(json.systemMessage).toMatch(/Start-KitSession\.ps1/);
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

describe('Start-KitSession.ps1', () => {
  const launcher = readFileSync(launcherPath, 'utf8');
  const lines = launcher.split(/\r?\n/);

  it('exporta SDD_KIT_SESSION_ROOT con su carpeta antes de invocar claude', () => {
    const exportLine = lines.findIndex((line) => /^\s*\$env:SDD_KIT_SESSION_ROOT\s*=\s*\$PSScriptRoot\s*$/.test(line));
    const claudeLine = lines.findIndex((line) => /^\s*claude\s/.test(line));
    expect(exportLine).toBeGreaterThanOrEqual(0);
    expect(claudeLine).toBeGreaterThan(exportLine);
  });

  it('documenta cómo reanudar una sesión', () => {
    expect(launcher).toMatch(/--resume/);
    expect(launcher).toMatch(/--continue/);
  });

  it('restaura la variable al salir claude', () => {
    expect(launcher).toMatch(/finally\s*\{[^}]*SDD_KIT_SESSION_ROOT/);
  });
});

describe('Start-KitSession.ps1 y los temporales de Claude Code', () => {
  it('lanza claude con CLAUDE_CODE_TMPDIR en .temp/ y restaura el valor anterior', () => {
    const bin = mkdtempSync(join(tmpdir(), 'fake-claude-'));
    const seen = join(bin, 'seen.txt');
    writeFileSync(join(bin, 'claude.ps1'), `Set-Content -LiteralPath '${seen}' -Value $env:CLAUDE_CODE_TMPDIR -NoNewline\n`);
    const command = `$env:CLAUDE_CODE_TMPDIR = 'antes'; & '${launcherPath}'; $env:CLAUDE_CODE_TMPDIR`;
    const env = { ...cleanGitEnv, PATH: `${bin}${delimiter}${process.env.PATH}` };

    const result = run('pwsh', ['-NoProfile', '-Command', command], { env });

    expect(readFileSync(seen, 'utf8')).toBe(join(kitRoot, '.temp'));
    expect(result.output.split(/\r?\n/).at(-1)).toBe('antes');
  });
});

describe('.claude/settings.json', () => {
  it('registra un hook SessionStart que ejecuta Test-KitSessionSource.ps1 con pwsh', () => {
    const settings = JSON.parse(readFileSync(join(kitRoot, '.claude', 'settings.json'), 'utf8'));
    const commands: string[] = settings.hooks.SessionStart.flatMap((entry: { hooks: { command: string }[] }) => entry.hooks.map((hook) => hook.command));
    expect(commands.some((command) => /\bpwsh\b/.test(command) && /Test-KitSessionSource\.ps1/.test(command))).toBe(true);
  });
});
