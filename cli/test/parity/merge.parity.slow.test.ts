import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { runPs1, runSdd, type RunResult } from './parity.ts';

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd, env: cleanEnv, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}

function write(root: string, path: string, content: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
}

interface Scenario {
  name: string;
  developCheckedOut: boolean;
  conflict: boolean;
}

function newRepo(scenario: Scenario): { main: string; feature: string } {
  const base = mkdtempSync(join(tmpdir(), 'sdd-parity-merge-'));
  const main = join(base, 'salas');
  mkdirSync(main);
  git(main, 'init', '-q', '-b', 'develop');
  write(main, '.docs/sdd/sdd-kit.json', '{"merge":{"into":"develop","noFf":true}}\n');
  write(main, 'app.txt', 'base\n');
  git(main, 'add', '-A');
  git(main, 'commit', '-q', '-m', 'base');
  const feature = join(base, 'f0150');
  git(main, 'worktree', 'add', '-q', '-b', 'feature/0150', feature);
  write(feature, 'app.txt', 'feature\n');
  git(feature, 'commit', '-q', '-am', 'feat: filtro');
  if (scenario.conflict) {
    write(main, 'app.txt', 'otra\n');
    git(main, 'commit', '-q', '-am', 'otra');
  }
  if (!scenario.developCheckedOut) git(main, 'checkout', '-q', '-b', 'aparte');
  return { main, feature };
}

function normalize(result: RunResult, repo: { main: string; feature: string }): RunResult {
  const clean = (text: string) =>
    text
      .split(repo.main).join('<main>')
      .split(repo.feature).join('<feature>')
      .replace(/\b[0-9a-f]{7,40}\b/g, '<sha>');
  return { ...result, stdout: clean(result.stdout), stderr: clean(result.stderr) };
}

function outcome(repo: { main: string }) {
  return {
    subjects: git(repo.main, 'log', '--format=%s', 'develop').split('\n').sort(),
    head: git(repo.main, 'log', '-1', '--format=%s', 'develop'),
    tree: git(repo.main, 'rev-parse', 'develop^{tree}'),
    worktrees: git(repo.main, 'worktree', 'list').split('\n').length,
  };
}

const scenarios: Scenario[] = [
  { name: 'develop sacada', developCheckedOut: true, conflict: false },
  { name: 'develop no sacada (worktree temporal)', developCheckedOut: false, conflict: false },
  { name: 'conflicto', developCheckedOut: true, conflict: true },
];

describe('merge parity with Invoke-SddMerge.ps1', () => {
  it.each(scenarios.map((s) => [s.name, s] as const))('same result for %s', (_name, scenario) => {
    const viaScript = newRepo(scenario);
    const viaCli = newRepo(scenario);
    const old = normalize(runPs1('Invoke-SddMerge.ps1', { ProjectRoot: viaScript.feature }), viaScript);
    const current = normalize(runSdd(['merge', '--project-root', viaCli.feature]), viaCli);
    expect(current.code).toBe(old.code);
    expect(current.stdout).toBe(old.stdout);
    expect(outcome(viaCli)).toEqual(outcome(viaScript));
  });
});
