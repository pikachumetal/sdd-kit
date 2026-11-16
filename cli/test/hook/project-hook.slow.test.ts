import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../../hooks/project/sdd-kit-loaded.mjs', import.meta.url));

describe('sdd-kit-loaded project hook as a process', () => {
  it('exits 0 with broken input', () => {
    const result = spawnSync(process.execPath, [script], { input: 'no es json', encoding: 'utf8' });
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
  });
});
