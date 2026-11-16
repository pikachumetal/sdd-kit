import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));
const pluginJson = fileURLToPath(new URL('../../../.claude-plugin/plugin.json', import.meta.url));

function sdd(args: string[]) {
  return spawnSync(process.execPath, [bin, 'init', ...args], { encoding: 'utf8' });
}

describe('bin/sdd.js init', () => {
  it('runs a whole init on a temporary project', () => {
    const root = mkdtempSync(join(tmpdir(), 'sdd-init-slow-'));
    try {
      expect(sdd(['--root', root, '--approved', 'PRODUCT.md']).status).toBe(0);
      expect(sdd(['--root', root, '--config', '{"ids":{"mode":"sequence"}}']).status).toBe(0);
      const finish = sdd(['--root', root, '--finish', '--ignore', '.auth/']);
      expect(finish.status).toBe(0);
      expect(finish.stdout).toContain('.docs/sdd/sdd-kit.json: actualizado');
      const marker = JSON.parse(readFileSync(join(root, '.docs/sdd/sdd-kit.json'), 'utf8'));
      expect(marker.version).toBe(JSON.parse(readFileSync(pluginJson, 'utf8')).version);
      expect(marker.ids).toEqual({ mode: 'sequence' });
      expect(readFileSync(join(root, '.gitignore'), 'utf8')).toContain('.auth/');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
