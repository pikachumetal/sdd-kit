import { describe, it, expect, vi, afterEach } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { cleanSessionTemp, projectFolderName } from '../../bin/session-end.js';

const HOUR = 3600 * 1000;
const NOW = Date.parse('2026-10-25T12:00:00Z');
const PROJECT = 'D:\\code\\facturas';
const STDIN = JSON.stringify({ session_id: 'actual', cwd: PROJECT, hook_event_name: 'SessionEnd', reason: 'other' });
const roots: string[] = [];

afterEach(() => {
  vi.unstubAllEnvs();
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

function write(file: string, hoursAgo: number): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, 'x');
  const time = new Date(NOW - hoursAgo * HOUR);
  utimesSync(file, time, time);
}

function age(path: string, hoursAgo: number): void {
  const time = new Date(NOW - hoursAgo * HOUR);
  utimesSync(path, time, time);
}

// el árbol del escenario de la spec: cuatro sesiones del proyecto, un fichero suelto y otro proyecto
function tree(): string {
  const base = mkdtempSync(join(tmpdir(), 'hook-end-'));
  roots.push(base);
  const project = join(base, 'claude', 'D--code-facturas');
  write(join(project, 'actual', 'scratchpad', 'a.txt'), 30);
  write(join(project, 'vieja', 'scratchpad', 'a.txt'), 30);
  write(join(project, 'reciente', 'a.txt'), 2);
  write(join(project, 'tarea', 'notas.txt'), 30);
  write(join(project, 'tarea', 'tasks', 'b1.output'), 10 / 60);
  age(join(project, 'tarea'), 30);
  write(join(project, 'leeme.txt'), 30);
  write(join(base, 'claude', 'D--code-otro', 'vieja', 'a.txt'), 30);
  return base;
}

describe('sdd hook session-end', () => {
  it('borra solo las sesiones del proyecto sin escrituras en 24 h, salvo la actual', () => {
    const base = tree();
    const project = join(base, 'claude', 'D--code-facturas');
    expect(cleanSessionTemp(STDIN, { CLAUDE_CODE_TMPDIR: base, CLAUDE_PROJECT_DIR: PROJECT }, NOW)).toBe('');
    expect(existsSync(join(project, 'vieja'))).toBe(false);
    for (const kept of ['actual', 'reciente', 'tarea', 'leeme.txt']) expect(existsSync(join(project, kept))).toBe(true);
    expect(existsSync(join(base, 'claude', 'D--code-otro', 'vieja'))).toBe(true);
  });

  it('sin CLAUDE_PROJECT_DIR usa el cwd del stdin', () => {
    const base = tree();
    cleanSessionTemp(STDIN, { CLAUDE_CODE_TMPDIR: base }, NOW);
    expect(existsSync(join(base, 'claude', 'D--code-facturas', 'vieja'))).toBe(false);
  });

  it('sin CLAUDE_CODE_TMPDIR usa la carpeta temporal del sistema', () => {
    const base = tree();
    vi.stubEnv('TEMP', base);
    vi.stubEnv('TMP', base);
    vi.stubEnv('TMPDIR', base);
    cleanSessionTemp(STDIN, { CLAUDE_PROJECT_DIR: PROJECT }, NOW);
    expect(existsSync(join(base, 'claude', 'D--code-facturas', 'vieja'))).toBe(false);
  });

  it('no sigue ni borra un junction o enlace de la carpeta del proyecto', () => {
    const base = tree();
    const target = join(base, 'fuera');
    write(join(target, 'a.txt'), 30);
    const link = join(base, 'claude', 'D--code-facturas', 'enlace');
    symlinkSync(target, link, 'junction');
    cleanSessionTemp(STDIN, { CLAUDE_CODE_TMPDIR: base, CLAUDE_PROJECT_DIR: PROJECT }, NOW);
    expect(existsSync(link)).toBe(true);
    expect(readFileSync(join(target, 'a.txt'), 'utf8')).toBe('x');
  });

  it('pasado el plazo no empieza a borrar ninguna sesión', () => {
    const base = tree();
    cleanSessionTemp(STDIN, { CLAUDE_CODE_TMPDIR: base, CLAUDE_PROJECT_DIR: PROJECT }, NOW, 0);
    expect(existsSync(join(base, 'claude', 'D--code-facturas', 'vieja'))).toBe(true);
  });

  it('sin carpeta del proyecto no avisa', () => {
    const base = tree();
    expect(cleanSessionTemp(STDIN, { CLAUDE_CODE_TMPDIR: base, CLAUDE_PROJECT_DIR: 'D:\\code\\nuevo' }, NOW)).toBe('');
  });
});

describe('sdd hook session-end, guardas', () => {
  const reason = 'sdd-kit: no borro los temporales de Claude Code: ';

  it.each([
    ['sin session_id', JSON.stringify({ cwd: PROJECT })],
    ['un texto que no es JSON', 'no es json'],
    ['un session_id con barras', JSON.stringify({ session_id: '../vieja', cwd: PROJECT })],
  ])('%s: no borra y avisa', (_, stdin) => {
    const base = tree();
    expect(cleanSessionTemp(stdin, { CLAUDE_CODE_TMPDIR: base, CLAUDE_PROJECT_DIR: PROJECT }, NOW)).toBe(
      `${reason}sin session_id válido en la entrada del hook`,
    );
    expect(existsSync(join(base, 'claude', 'D--code-facturas', 'vieja'))).toBe(true);
  });

  it('con una base relativa no borra y avisa', () => {
    expect(cleanSessionTemp(STDIN, { CLAUDE_CODE_TMPDIR: 'temporales', CLAUDE_PROJECT_DIR: PROJECT }, NOW)).toBe(
      `${reason}temporales no es una ruta absoluta`,
    );
  });
});

describe('nombre de la carpeta del proyecto', () => {
  it('cambia por - cada carácter que no es letra ni cifra, guion bajo incluido', () => {
    expect(projectFolderName('D:\\code\\_worktrees\\sdd-kit-0180')).toBe('D--code--worktrees-sdd-kit-0180');
  });

  it('recorta a 200 y añade el hash djb2 de la ruta, como midió la sonda', () => {
    const probe =
      'D:\\code\\.worktrees\\sdd-kit\\feature-0210-session-end-temp-cleanup\\.temp\\claude\\D--code--worktrees-sdd-kit-feature-0210-session-end-temp-cleanup\\a75e9b1e-3ea6-4d60-a315-74ee288d015f\\scratchpad\\probe-' +
      'a'.repeat(30) + '_x.y';
    expect(projectFolderName(probe)).toBe(
      'D--code--worktrees-sdd-kit-feature-0210-session-end-temp-cleanup--temp-claude-D--code--worktrees-sdd-kit-feature-0210-session-end-temp-cleanup-a75e9b1e-3ea6-4d60-a315-74ee288d015f-scratchpad-probe-aaa-bjejxf',
    );
  });
});

describe('hooks/hooks.json', () => {
  it('declara un SessionEnd que ejecuta la CLI en forma exec', () => {
    const hooks = JSON.parse(readFileSync(fileURLToPath(new URL('../../../hooks/hooks.json', import.meta.url)), 'utf8'));
    expect(hooks.hooks.SessionEnd[0].hooks[0]).toEqual({
      type: 'command',
      command: 'node',
      args: ['${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js', 'hook', 'session-end'],
    });
  });
});
