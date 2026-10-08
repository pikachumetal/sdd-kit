import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const bin = fileURLToPath(new URL('../bin/sdd.js', import.meta.url));

function runBin(args: string[], nodeArgs: string[] = []) {
  return spawnSync(process.execPath, [...nodeArgs, bin, ...args], { encoding: 'buffer' });
}

describe('bin/sdd.js', () => {
  it('bin exits 2 on old node without loading src', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sdd-old-node-'));
    const fake = join(dir, 'old-node.mjs');
    writeFileSync(fake, "Object.defineProperty(process.versions, 'node', { value: '20.11.0' });\n");
    const result = runBin(['capability', 'index', '--path', '.docs/sdd'], ['--import', pathToFileURL(fake).href]);
    const stderr = result.stderr.toString('utf8');
    expect(result.status).toBe(2);
    expect(stderr).toContain('sdd necesita Node 22.18 o posterior; tienes 20.11.0');
    expect(stderr).not.toContain('SyntaxError');
  });

  it('writes utf-8 when stdout is a pipe', () => {
    const result = runBin(['capability', 'lista']);
    expect(result.status).toBe(2);
    const stderr = result.stderr.toString('utf8');
    expect(stderr).toContain('«');
    expect(stderr).not.toContain('�');
  });

  it('help exits 0', () => {
    const result = runBin(['--help']);
    expect(result.status).toBe(0);
  });
});
