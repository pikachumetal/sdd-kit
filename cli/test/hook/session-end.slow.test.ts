import { describe, it, expect, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const sdd = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));
const roots: string[] = [];

afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

function hook(input: string, env: Record<string, string>) {
  return spawnSync(process.execPath, [sdd, 'hook', 'session-end'], { input, env: { ...process.env, ...env }, encoding: 'utf8' });
}

describe('sdd hook session-end por sdd.js', () => {
  it('borra la sesión vieja sin escribir en stdout ni en stderr, y sale con 0', () => {
    const base = mkdtempSync(join(tmpdir(), 'hook-end-'));
    roots.push(base);
    const session = join(base, 'claude', 'D--code-facturas', 'vieja');
    mkdirSync(session, { recursive: true });
    writeFileSync(join(session, 'a.txt'), 'x');
    const old = new Date(Date.now() - 30 * 3600 * 1000);
    utimesSync(join(session, 'a.txt'), old, old);
    const result = hook('{"session_id":"actual"}', { CLAUDE_CODE_TMPDIR: base, CLAUDE_PROJECT_DIR: 'D:\\code\\facturas' });
    expect([result.status, result.stdout, result.stderr]).toEqual([0, '', '']);
    expect(existsSync(session)).toBe(false);
  });

  it('con una guarda que falla avisa por stderr y sale con 0', () => {
    const result = hook('no es json', {});
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook\n');
  });
});
