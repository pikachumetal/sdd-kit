import { describe, it } from 'vitest';
import { copyFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { repoRoot, runPs1, runSdd, expectParity } from './parity.ts';

function folderWithRoadmap(source: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-parity-roadmap-'));
  copyFileSync(source, join(dir, 'roadmap.md'));
  return dir;
}

const targets: Record<string, string> = {
  'roadmap real': join(repoRoot, '.docs/sdd'),
  'fixture 0fc231e': folderWithRoadmap(join(repoRoot, 'cli/test/fixtures/roadmap-structure/roadmap-0fc231e-parent.md')),
  plantilla: folderWithRoadmap(join(repoRoot, 'skills/sdd-templates/templates/roadmap-template.md')),
  'sin roadmap': mkdtempSync(join(tmpdir(), 'sdd-parity-empty-')),
};

describe('roadmap check parity with Test-Roadmap.ps1', () => {
  it.each(Object.entries(targets))('same output and code for %s', (_name, path) => {
    expectParity(runPs1('Test-Roadmap.ps1', { Path: path }), runSdd(['roadmap', 'check', '--path', path]));
  });
});
