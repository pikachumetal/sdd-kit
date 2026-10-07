import { describe, it, expect } from 'vitest';
import { cpSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { repoRoot, runPs1, runSdd, expectParity } from './parity.ts';

const realSdd = join(repoRoot, '.docs/sdd');
const fixtureCaps = join(repoRoot, 'cli/test/fixtures/capabilities');
const spec = join(repoRoot, '.docs/sdd/specs/20261007-153554-feature-0143-node-cli/spec.md');

function copyOfRealSdd(): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-parity-caps-'));
  cpSync(join(realSdd, 'capabilities'), join(root, 'capabilities'), { recursive: true });
  return root;
}

function readAll(dir: string): Record<string, string> {
  const files: Record<string, string> = {};
  for (const name of readdirSync(join(dir, 'capabilities'))) {
    files[name] = readFileSync(join(dir, 'capabilities', name), 'utf8');
  }
  return files;
}

describe('capability parity with the PowerShell scripts', () => {
  it('index matches on the real .docs/sdd', () => {
    expectParity(runPs1('Get-CapabilityIndex.ps1', { Path: realSdd }), runSdd(['capability', 'index', '--path', realSdd]));
  });

  it('index matches on the fixture folder', () => {
    const root = mkdtempSync(join(tmpdir(), 'sdd-parity-fixture-'));
    cpSync(fixtureCaps, join(root, 'capabilities'), { recursive: true });
    expectParity(runPs1('Get-CapabilityIndex.ps1', { Path: root }), runSdd(['capability', 'index', '--path', root]));
  });

  it('check matches on the real .docs/sdd', () => {
    expectParity(runPs1('Test-Capabilities.ps1', { Path: realSdd }), runSdd(['capability', 'check', '--path', realSdd]));
  });

  it('check matches with this feature spec as artifact', () => {
    expectParity(
      runPs1('Test-Capabilities.ps1', { Path: realSdd, Artifact: spec }),
      runSdd(['capability', 'check', '--path', realSdd, '--artifact', spec]),
    );
  });

  it('merge leaves the same files as the script', () => {
    const viaScript = copyOfRealSdd();
    const viaCli = copyOfRealSdd();
    const old = runPs1('Merge-CapabilityDelta.ps1', { Path: viaScript, Artifact: spec });
    const current = runSdd(['capability', 'merge', '--path', viaCli, '--artifact', spec]);
    expectParity(old, current);
    expect(readAll(viaCli)).toEqual(readAll(viaScript));
  });
});
