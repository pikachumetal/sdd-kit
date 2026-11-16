import { describe, it, expect, vi, afterEach } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// el rmSync falla en la primera sesión como falla con un .output abierto en Windows
vi.mock('node:fs', async (original) => {
  const fs = await original<typeof import('node:fs')>();
  return {
    ...fs,
    rmSync: (path: string, options: object) => {
      if (String(path).endsWith('bloqueada')) throw Object.assign(new Error('EBUSY'), { code: 'EBUSY' });
      fs.rmSync(path, options);
    },
  };
});

const { cleanSessionTemp } = await import('../../bin/session-end.js');
const NOW = Date.parse('2026-10-25T12:00:00Z');
const roots: string[] = [];

afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

describe('sdd hook session-end, tolerancia', () => {
  it('una sesión que no se puede borrar no impide borrar las demás', () => {
    const base = mkdtempSync(join(tmpdir(), 'hook-end-'));
    roots.push(base);
    const project = join(base, 'claude', 'D--code-facturas');
    const old = new Date(NOW - 30 * 3600 * 1000);
    for (const name of ['bloqueada', 'vieja']) {
      mkdirSync(join(project, name), { recursive: true });
      writeFileSync(join(project, name, 'a.txt'), 'x');
      utimesSync(join(project, name, 'a.txt'), old, old);
    }
    const stdin = JSON.stringify({ session_id: 'actual' });
    expect(cleanSessionTemp(stdin, { CLAUDE_CODE_TMPDIR: base, CLAUDE_PROJECT_DIR: 'D:\\code\\facturas' }, { now: NOW })).toBe('');
    expect(existsSync(join(project, 'bloqueada'))).toBe(true);
    expect(existsSync(join(project, 'vieja'))).toBe(false);
  });
});
