import { describe, it } from 'vitest';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { repoRoot, runPs1, runSdd, expectParity } from './parity.ts';

const fixtures = join(repoRoot, 'cli/test/fixtures/session-tokens');
const prices = {
  'claude-sonnet-5': { input: 2, cacheWrite5m: 2.5, cacheWrite1h: 4, cacheRead: 0.2, output: 10 },
  'claude-opus-5-5': { input: 4, cacheWrite5m: 5, cacheWrite1h: 8, cacheRead: 0.2, output: 20 },
};

function worktreeWith(sets: string[], withPrices: boolean) {
  const base = mkdtempSync(join(tmpdir(), 'sdd-parity-tokens-'));
  const worktree = join(base, 'wt');
  const projects = join(base, 'projects');
  const folder = join(projects, worktree.replace(/[^A-Za-z0-9]/g, '-'));
  mkdirSync(worktree, { recursive: true });
  mkdirSync(folder, { recursive: true });
  for (const set of sets) cpSync(join(fixtures, set), folder, { recursive: true });
  if (withPrices) {
    mkdirSync(join(worktree, '.docs/sdd'), { recursive: true });
    const config = { version: '1.1.0', pricing: { source: 'fixture', updated: '2026-09-25', usdPerMillionTokens: prices } };
    writeFileSync(join(worktree, '.docs/sdd/sdd-kit.json'), JSON.stringify(config));
  }
  return { worktree, projects };
}

const cases: Array<[string, string[], boolean]> = [
  ...readdirSync(fixtures).map((set): [string, string[], boolean] => [`${set} con precios`, [set], true]),
  ['base sin precios', ['base'], false],
  ['base y legacy', ['base', 'legacy'], true],
];

describe('session tokens parity with Measure-SessionTokens.ps1', () => {
  it.each(cases)('same output for %s', (_name, sets, withPrices) => {
    const { worktree, projects } = worktreeWith(sets, withPrices);
    expectParity(
      runPs1('Measure-SessionTokens.ps1', { Path: worktree, ProjectsRoot: [projects] }),
      runSdd(['session', 'tokens', '--path', worktree, '--projects-root', projects]),
    );
  });
});
