import { describe, it, expect } from 'vitest';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { commitAll, emptyRepo, git, planText, scratchDir, sdd, sddWithEnv, write } from './harness.ts';

const plan = 'plan.md';
const featureWorkspace = (repo: string) => join(repo, '.temp', 'sdd', 'plan');
const repoOnly = (dir: string) =>
  `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas (directorio actual: ${dir}). Si es un proyecto nuevo, haz git init y vuelve a lanzarlo.`;
const withCommit = (dir: string) =>
  `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas, con al menos un commit (directorio actual: ${dir}). Si es un proyecto nuevo, haz git init y un primer commit, y vuelve a lanzarlo.`;

function featureWithReviewWorktree(): { repo: string; review: string; base: string; head: string } {
  const repo = emptyRepo();
  write(join(repo, plan), planText('Plan', 'First thing', 'Do the first thing.'));
  const base = commitAll(repo, 'plan');
  write(join(repo, 'code.txt'), 'x\n');
  const head = commitAll(repo, 'code');
  const review = join(dirname(repo), 'review-0300-abc1234');
  git(repo, 'worktree', 'add', '--detach', review, head);
  return { repo, review, base, head };
}

function outsideAnyRepo(): { dir: string; run: (...args: string[]) => ReturnType<typeof sdd> } {
  const dir = scratchDir();
  write(join(dir, plan), planText('Plan', 'First thing', 'Do the first thing.'));
  const env = { GIT_CEILING_DIRECTORIES: dirname(dir) };
  return { dir, run: (...args: string[]) => sddWithEnv(dir, env, args) };
}

function repoWithoutCommits(): string {
  const repo = emptyRepo();
  write(join(repo, plan), planText('Plan', 'First thing', 'Do the first thing.'));
  return repo;
}

describe('-C sitúa los verbos del workspace en otro working tree', () => {
  it('workspace -C from the review worktree prints the feature workspace', () => {
    const { repo, review } = featureWithReviewWorktree();
    const result = sdd(review, 'workspace', '-C', repo, plan);
    expect(result.code).toBe(0);
    expect(result.out.trim()).toBe(featureWorkspace(repo));
    expect(existsSync(join(review, '.temp', 'sdd'))).toBe(false);
  });

  it('task brief and review package with -C write into the same workspace', () => {
    const { repo, review, base, head } = featureWithReviewWorktree();
    const brief = sdd(review, 'task', 'brief', '-C', repo, plan, '1');
    expect(brief.code).toBe(0);
    expect(brief.out).toContain(join(featureWorkspace(repo), 'task-1-brief.md'));
    const pack = sdd(review, 'review', 'package', '-C', repo, plan, base, head);
    expect(pack.code).toBe(0);
    expect(pack.out).toContain(join(featureWorkspace(repo), 'review-'));
    expect(existsSync(join(review, '.temp', 'sdd'))).toBe(false);
  });

  it('a relative -C resolves from the current directory', () => {
    const { repo } = featureWithReviewWorktree();
    const result = sdd(dirname(repo), 'workspace', '-C', basename(repo), plan);
    expect(result.code).toBe(0);
    expect(result.out.trim()).toBe(featureWorkspace(repo));
  });

  it('--directory is the same as -C and --help shows it', () => {
    const { repo, review } = featureWithReviewWorktree();
    expect(sdd(review, 'workspace', '--directory', repo, plan).out.trim()).toBe(featureWorkspace(repo));
    for (const verb of [['workspace'], ['task', 'brief'], ['review', 'package']]) {
      expect(sdd(review, ...verb, '--help').out).toContain('[--directory <valor>]');
    }
  });

  it('an -C that does not exist stops with 2 and writes nothing', () => {
    const { repo, review } = featureWithReviewWorktree();
    const missing = join(dirname(repo), 'no-such-dir');
    const result = sdd(review, 'workspace', '-C', missing, plan);
    expect(result.code).toBe(2);
    expect(result.err).toContain(`directorio de -C no válido: ${missing}`);
    expect(existsSync(join(review, '.temp'))).toBe(false);
  });

  it('task start and task done reject -C', () => {
    const { repo, review, base } = featureWithReviewWorktree();
    const start = sdd(review, 'task', 'start', '-C', repo, plan, '1');
    const done = sdd(review, 'task', 'done', '-C', repo, plan, '1', base, '--', 'node', '-v');
    for (const result of [start, done]) {
      expect(result.code).toBe(2);
      expect(result.err).toContain('opción desconocida: «-C»');
    }
  });
});

describe('Los verbos de tasks paran fuera de un repo o sin commits', () => {
  it('outside a repo the commit verbs stop with the commit message', () => {
    const { dir, run } = outsideAnyRepo();
    const calls = [
      ['review', 'package', plan, 'HEAD~1', 'HEAD'],
      ['task', 'done', plan, '1', 'HEAD', '--', 'node', '-v'],
      ['task', 'start', plan, '1'],
    ];
    for (const args of calls) {
      const result = run(...args);
      expect(result.code).toBe(2);
      expect(result.err).toContain(withCommit(dir));
      expect(result.err).toMatch(/^git dijo: \S/m);
    }
    expect(readdirSync(dir)).toEqual([plan]);
  });

  it('outside a repo workspace and task brief stop with the repo message', () => {
    const { dir, run } = outsideAnyRepo();
    for (const args of [['workspace', plan], ['task', 'brief', plan, '1']]) {
      const result = run(...args);
      expect(result.code).toBe(2);
      expect(result.err).toContain(repoOnly(dir));
      expect(result.err).toMatch(/^git dijo: \S/m);
    }
    expect(readdirSync(dir)).toEqual([plan]);
  });

  it('task brief with OUTFILE needs no repo', () => {
    const { dir, run } = outsideAnyRepo();
    expect(run('task', 'brief', plan, '1', 'brief.md').code).toBe(0);
    expect(existsSync(join(dir, 'brief.md'))).toBe(true);
  });

  it('in a repo without commits the commit verbs stop', () => {
    const repo = repoWithoutCommits();
    const calls = [
      ['task', 'start', plan, '1'],
      ['task', 'done', plan, '1', 'HEAD', '--', 'node', '-v'],
      ['review', 'package', plan, 'HEAD', 'HEAD'],
    ];
    for (const args of calls) {
      const result = sdd(repo, ...args);
      expect(result.code).toBe(2);
      expect(result.err).toContain(withCommit(repo));
    }
    expect(existsSync(join(featureWorkspace(repo), 'task-1-brief.md'))).toBe(false);
  });

  it('in a repo without commits workspace and task brief work', () => {
    const repo = repoWithoutCommits();
    expect(sdd(repo, 'workspace', plan).code).toBe(0);
    expect(sdd(repo, 'task', 'brief', plan, '1').code).toBe(0);
  });
});

describe('Casos límite de -C y de la parada', () => {
  it('an -C that points to a file stops with 2', () => {
    const { dir, run } = outsideAnyRepo();
    const file = join(dir, plan);
    const result = run('workspace', '-C', file, plan);
    expect(result.code).toBe(2);
    expect(result.err).toContain(`directorio de -C no válido: ${file}`);
  });

  it('an -C to an existing directory outside a repo stops with that directory', () => {
    const { dir, run } = outsideAnyRepo();
    const other = join(dir, 'other');
    mkdirSync(other);
    const result = run('workspace', '-C', other, join(dir, plan));
    expect(result.code).toBe(2);
    expect(result.err).toContain(repoOnly(other));
  });

  it('the stop message is followed by the first line of what git said', () => {
    const { dir, run } = outsideAnyRepo();
    const result = run('workspace', plan);
    expect(result.err).toContain(`${repoOnly(dir)}\ngit dijo: `);
  });

  it('without git in the PATH the stop quotes the process error', () => {
    const { dir } = outsideAnyRepo();
    const empty = join(dir, 'empty');
    mkdirSync(empty);
    const env = { GIT_CEILING_DIRECTORIES: dirname(dir), PATH: empty, Path: empty, MSYSTEM: '' };
    const result = sddWithEnv(dir, env, ['workspace', plan]);
    expect(result.code).toBe(2);
    expect(result.err).toMatch(/^git dijo: \S/m);
  });
});

describe('El workspace no pisa su .gitignore', () => {
  it('keeps an existing .temp/sdd/.gitignore', () => {
    const repo = repoWithoutCommits();
    const ignore = join(repo, '.temp', 'sdd', '.gitignore');
    write(ignore, '*\n!*/progress.md\n');
    expect(sdd(repo, 'workspace', plan).code).toBe(0);
    expect(readFileSync(ignore, 'utf8')).toBe('*\n!*/progress.md\n');
  });
});
