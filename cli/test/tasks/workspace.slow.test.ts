import { describe, it, expect } from 'vitest';
import { existsSync, mkdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, sep } from 'node:path';
import { commitAll, emptyRepo, git, planText, scratchDir, sdd, write } from './harness.ts';

const workspaceRoot = (repo: string) => join(repo, '.superpowers', 'sdd');
const marker = (dir: string) => readFileSync(join(dir, 'plan-path'), 'utf8').trim();

function repoWithPlans(): string {
  const repo = emptyRepo();
  write(join(repo, 'plan-a.md'), planText('Plan A', 'First thing', 'Do the first thing.'));
  write(join(repo, 'plan-b.md'), planText('Plan B', 'Other thing', 'Do the other thing.'));
  return repo;
}

describe('sdd workspace (test-sdd-workspace.sh)', () => {
  it('without a plan errors with exit 2', () => {
    expect(sdd(repoWithPlans(), 'workspace').code).toBe(2);
  });

  it('with a missing plan file errors with exit 2', () => {
    expect(sdd(repoWithPlans(), 'workspace', 'no-such-plan.md').code).toBe(2);
  });

  it('prints <repo-root>/.superpowers/sdd/<plan-basename> and two plans get distinct directories', () => {
    const repo = repoWithPlans();
    const dirA = sdd(repo, 'workspace', 'plan-a.md').out.trim();
    const dirB = sdd(repo, 'workspace', 'plan-b.md').out.trim();
    expect(dirA).toBe(join(workspaceRoot(repo), 'plan-a'));
    expect(dirB).not.toBe(dirA);
    expect(existsSync(dirB)).toBe(true);
  });

  it('creates a self-ignoring .gitignore and keeps the workspace out of git add -A', () => {
    const repo = repoWithPlans();
    const dir = sdd(repo, 'workspace', 'plan-a.md').out.trim();
    write(join(dir, 'artifact.md'), 'x\n');
    expect(readFileSync(join(workspaceRoot(repo), '.gitignore'), 'utf8').trim()).toBe('*');
    expect(git(repo, 'status', '--porcelain')).not.toContain('.superpowers');
    git(repo, 'add', '-A');
    expect(git(repo, 'diff', '--cached', '--name-only')).not.toContain('.superpowers');
  });

  it('task brief writes its brief under the plan workspace', () => {
    const repo = repoWithPlans();
    const result = sdd(repo, 'task', 'brief', 'plan-a.md', '1');
    expect(result.out).toContain(`wrote ${join(workspaceRoot(repo), 'plan-a', 'task-1-brief.md')}: `);
    expect(result.out).toMatch(/: \d+ lines$/m);
  });

  it('a linked worktree resolves its own distinct workspace', () => {
    const repo = repoWithPlans();
    commitAll(repo, 'base');
    const worktree = join(scratchDir(), 'wt');
    git(repo, 'worktree', 'add', '-q', worktree, '-b', 'wt-feature');
    const own = sdd(worktree, 'workspace', 'plan-a.md').out.trim();
    const top = git(worktree, 'rev-parse', '--show-toplevel').split('/').join(sep);
    expect(own).toBe(join(top, '.superpowers', 'sdd', 'plan-a'));
    expect(own).not.toBe(join(workspaceRoot(repo), 'plan-a'));
    write(join(own, 'artifact.md'), 'y\n');
    expect(git(worktree, 'status', '--porcelain')).not.toContain('.superpowers');
  });

  it('same-basename plans resolve to distinct workspaces and keep both briefs intact', () => {
    const repo = repoWithPlans();
    write(join(repo, 'docs/alpha/plan.md'), planText('Alpha Plan', 'Alpha work', 'Alpha-only requirement text.'));
    write(join(repo, 'docs/beta/plan.md'), planText('Beta Plan', 'Beta work', 'Beta-only requirement text.'));
    const alpha = sdd(repo, 'workspace', 'docs/alpha/plan.md').out.trim();
    const beta = sdd(repo, 'workspace', 'docs/beta/plan.md').out.trim();
    sdd(repo, 'task', 'brief', 'docs/alpha/plan.md', '1');
    sdd(repo, 'task', 'brief', 'docs/beta/plan.md', '1');
    expect(alpha).not.toBe(beta);
    expect(readFileSync(join(alpha, 'task-1-brief.md'), 'utf8')).toContain('Alpha-only requirement text.');
    expect(readFileSync(join(beta, 'task-1-brief.md'), 'utf8')).toContain('Beta-only requirement text.');
  });

  it('adopts a legacy markerless workspace in place and marks it', () => {
    const repo = repoWithPlans();
    write(join(repo, 'foo.md'), planText('Foo', 'Foo', 'Foo.'));
    write(join(workspaceRoot(repo), 'foo', 'progress.md'), 'ledger\n');
    const dir = sdd(repo, 'workspace', 'foo.md').out.trim();
    expect(dir).toBe(join(workspaceRoot(repo), 'foo'));
    expect(existsSync(join(dir, 'progress.md'))).toBe(true);
    expect(marker(dir)).toBe('foo.md');
  });

  it('disambiguates a workspace owned by another plan with the parent-dir suffix', () => {
    const repo = repoWithPlans();
    write(join(repo, 'bar.md'), planText('Bar', 'Bar', 'Bar.'));
    write(join(workspaceRoot(repo), 'bar', 'plan-path'), 'somewhere-else/bar.md\n');
    write(join(workspaceRoot(repo), 'bar', 'progress.md'), 'other ledger\n');
    const dir = sdd(repo, 'workspace', 'bar.md').out.trim();
    expect(dir).toBe(join(workspaceRoot(repo), 'bar-repo'));
    expect(marker(dir)).toBe('bar.md');
    expect(marker(join(workspaceRoot(repo), 'bar'))).toBe('somewhere-else/bar.md');
    expect(readFileSync(join(workspaceRoot(repo), 'bar', 'progress.md'), 'utf8')).toBe('other ledger\n');
  });

  it('falls back to a counter suffix on a double conflict', () => {
    const repo = repoWithPlans();
    write(join(repo, 'baz.md'), planText('Baz', 'Baz', 'Baz.'));
    write(join(workspaceRoot(repo), 'baz', 'plan-path'), 'one/baz.md\n');
    write(join(workspaceRoot(repo), 'baz-repo', 'plan-path'), 'two/baz.md\n');
    const dir = sdd(repo, 'workspace', 'baz.md').out.trim();
    expect(dir).toBe(join(workspaceRoot(repo), 'baz-repo-2'));
    expect(marker(dir)).toBe('baz.md');
  });

  it('relative, absolute and ../ spellings share one workspace and marker', () => {
    const repo = repoWithPlans();
    write(join(repo, 'docs/alpha/plan.md'), planText('Alpha Plan', 'Alpha work', 'Alpha.'));
    mkdirSync(join(repo, 'docs/beta'), { recursive: true });
    const relative = sdd(repo, 'workspace', 'docs/alpha/plan.md').out.trim();
    const absolute = sdd(repo, 'workspace', join(repo, 'docs/alpha/plan.md')).out.trim();
    const dotdot = sdd(join(repo, 'docs/beta'), 'workspace', '../alpha/plan.md').out.trim();
    expect(absolute).toBe(relative);
    expect(dotdot).toBe(relative);
    expect(marker(relative)).toBe('docs/alpha/plan.md');
  });

  it.runIf(process.platform === 'win32')('reuses a workspace whose marker holds the MSYS or drive spelling of the plan', () => {
    const repo = repoWithPlans();
    const absolute = join(realpathSync.native(repo), 'plan-a.md').split(sep).join('/');
    const spellings = [`/${absolute[0].toLowerCase()}${absolute.slice(2)}`, absolute, absolute.split('/').join('\\'), absolute.toLowerCase()];
    const dir = join(workspaceRoot(repo), 'plan-a');
    for (const spelling of spellings) {
      write(join(dir, 'plan-path'), `${spelling}\n`);
      expect(sdd(repo, 'workspace', 'plan-a.md').out.trim(), spelling).toBe(dir);
    }
  });

  it('an out-of-repo plan gets a basename slug and an absolute-path marker', () => {
    const repo = repoWithPlans();
    const outside = scratchDir();
    write(join(outside, 'remote-plan.md'), planText('Remote', 'Remote', 'Remote.'));
    const dir = sdd(repo, 'workspace', join(outside, 'remote-plan.md')).out.trim();
    expect(dir).toBe(join(workspaceRoot(repo), 'remote-plan'));
    expect(marker(dir)).toBe(join(realpathSync.native(outside), 'remote-plan.md').split(sep).join('/'));
  });
});
