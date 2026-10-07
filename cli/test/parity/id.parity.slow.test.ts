import { describe, it } from 'vitest';
import { cpSync, mkdtempSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { repoRoot, runPs1, runSdd, expectParity } from './parity.ts';

const fixtures = join(repoRoot, 'cli/test/fixtures/task-ids');
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

function git(cwd: string, args: string[]): void {
  spawnSync('git', args, { cwd, env: cleanEnv, encoding: 'utf8' });
}

function copyFixture(name: string, asRepo: boolean): string {
  const root = mkdtempSync(join(tmpdir(), `sdd-parity-ids-${name}-`));
  cpSync(join(fixtures, name), root, { recursive: true });
  if (asRepo) {
    git(root, ['init', '-q', '-b', 'develop']);
    git(root, ['add', '-A']);
    git(root, ['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'base']);
  }
  return root;
}

describe('id next parity with Get-NextSddId.ps1', () => {
  it.each(readdirSync(fixtures))('proposes the same id for %s', (name) => {
    expectParity(
      runPs1('Get-NextSddId.ps1', { ProjectRoot: copyFixture(name, false) }),
      runSdd(['id', 'next', '--project-root', copyFixture(name, false)]),
    );
  });

  it.each(['sequence-project', 'feature-lane'])('reserves the same ids in a repo for %s', (name) => {
    expectParity(
      runPs1('Get-NextSddId.ps1', { ProjectRoot: copyFixture(name, true), Reserve: true, Count: 3 }),
      runSdd(['id', 'next', '--project-root', copyFixture(name, true), '--reserve', '--count', '3']),
    );
  });
});
