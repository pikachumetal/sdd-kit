import { describe, it, expect } from 'vitest';
import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { repoRoot, runPs1, runSdd } from './parity.ts';

const fixtures = join(repoRoot, 'cli/test/fixtures/estimation-log');
const roots: Record<string, string> = Object.fromEntries([
  ...readdirSync(fixtures).map((name) => [name, join(fixtures, name)]),
  ['este repo', repoRoot],
]);

describe('estimation log parity with Build-EstimationLog.ps1', () => {
  it.each(Object.entries(roots))('writes the same log for %s', (_name, root) => {
    const out = mkdtempSync(join(tmpdir(), 'sdd-parity-log-'));
    const viaScript = join(out, 'script.md');
    const viaCli = join(out, 'cli.md');
    const old = runPs1('Build-EstimationLog.ps1', { Root: root, OutFile: viaScript });
    const current = runSdd(['estimation', 'log', '--root', root, '--out', viaCli]);
    expect(current.code).toBe(old.code);
    expect(readFileSync(viaCli, 'utf8')).toBe(readFileSync(viaScript, 'utf8'));
  });
});
