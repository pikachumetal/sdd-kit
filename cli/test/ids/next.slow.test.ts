import { describe, it, expect } from 'vitest';
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  addUnmergedCommit,
  addWorktree,
  copyFixtureToRepo,
  fixturePath,
  git,
  kitRoot,
  nextId,
  runNext,
  tempDir,
} from './helpers.ts';

describe('id next in a sequence project', () => {
  it('returns the id after the highest in specs and roadmap', async () => {
    const result = await runNext(fixturePath('sequence-project'));
    expect(result.lines).toEqual(['0006']);
    expect(result.code).toBe(0);
  });

  it('counts the id of the Patches table in its second column', async () => {
    const project = join(tempDir(), 'project');
    mkdirSync(join(project, '.docs/sdd'), { recursive: true });
    writeFileSync(join(project, '.docs/sdd/sdd-kit.json'), '{"ids":{"mode":"sequence"}}');
    const rows = ['## Patches', '', '| Fecha | Id | Descripción |', '| --- | --- | --- |', '| 2026-10-01 | 0011 | Un patch sin carpeta |'];
    writeFileSync(join(project, '.docs/sdd/roadmap.md'), rows.join('\n'));
    expect(await nextId(project)).toBe('0012');
  });

  it('fails naming the id when two folders share it across lanes', async () => {
    const result = await runNext(fixturePath('duplicate-ids'));
    expect(result.lines).toEqual([]);
    expect(result.stderr).toContain('0003');
    expect(result.code).toBe(1);
  });

  it('returns 0001 when all history is 0000', async () => {
    expect(await nextId(fixturePath('only-zeros'))).toBe('0001');
  });

  it.each([
    ['legacy-suffix', '0007'],
    ['proposal-lane', '0021'],
    ['proposal-suffix', '0021'],
    ['feature-lane', '0081'],
    ['feature-only', '0080'],
  ])('counts the lanes of %s', async (fixture, expected) => {
    expect(await nextId(fixturePath(fixture))).toBe(expected);
  });

  it('fails when a task folder and a feature folder share an id', async () => {
    const result = await runNext(fixturePath('mixed-duplicate'));
    expect(result.stderr).toContain('0063');
    expect(result.code).toBe(1);
  });

  it.each(['tracker-project', 'no-ids-field'])('fails in tracker mode for %s', async (fixture) => {
    const result = await runNext(fixturePath(fixture));
    expect(result.lines).toEqual([]);
    expect(result.stderr).toMatch(/tracker|gestor/);
    expect(result.code).toBe(1);
  });

  it('reads a project path with accents and spaces', async () => {
    const repo = copyFixtureToRepo('sequence-project', ['feature/0009-export'], '0010 Estimación con tokens');
    const result = await runNext(repo);
    expect(result.lines).toEqual(['0010']);
    expect(result.code).toBe(0);
  });

  it('works in a directory that is not a git repository', async () => {
    const plain = join(tempDir(), 'project');
    cpSync(fixturePath('sequence-project'), plain, { recursive: true });
    expect(await nextId(plain)).toBe('0006');
  });
});

describe('id next over git branches', () => {
  it('counts the id of a branch that has no specs folder', async () => {
    expect(await nextId(copyFixtureToRepo('sequence-project', ['feature/0009-export']))).toBe('0010');
  });

  it('counts branches of any prefix', async () => {
    expect(await nextId(copyFixtureToRepo('sequence-project', ['hotfix/0011']))).toBe('0012');
  });

  it('ignores the git environment variables of the caller', async () => {
    const saved = { dir: process.env.GIT_DIR, tree: process.env.GIT_WORK_TREE };
    process.env.GIT_DIR = join(kitRoot, '.git');
    process.env.GIT_WORK_TREE = kitRoot;
    try {
      expect(await nextId(copyFixtureToRepo('sequence-project'))).toBe('0006');
    } finally {
      if (saved.dir === undefined) delete process.env.GIT_DIR;
      else process.env.GIT_DIR = saved.dir;
      if (saved.tree === undefined) delete process.env.GIT_WORK_TREE;
      else process.env.GIT_WORK_TREE = saved.tree;
    }
  });

  it('ignores an inherited GIT_INDEX_FILE', async () => {
    const repo = copyFixtureToRepo('sequence-project', ['feature/0009-export']);
    const foreignIndex = join(tempDir(), 'foreign-index');
    writeFileSync(foreignIndex, 'not an index');
    const saved = process.env.GIT_INDEX_FILE;
    process.env.GIT_INDEX_FILE = foreignIndex;
    try {
      expect(await nextId(repo, ['--reserve'])).toBe('0010');
    } finally {
      if (saved === undefined) delete process.env.GIT_INDEX_FILE;
      else process.env.GIT_INDEX_FILE = saved;
    }
    expect(readFileSync(foreignIndex, 'utf8')).toBe('not an index');
  });

  it('ignores inherited GIT_COMMON_DIR and GIT_OBJECT_DIRECTORY', async () => {
    const repo = copyFixtureToRepo('sequence-project', ['feature/0009-export']);
    const bogus = join(tempDir(), 'bogus');
    process.env.GIT_COMMON_DIR = bogus;
    process.env.GIT_OBJECT_DIRECTORY = bogus;
    try {
      expect(await nextId(repo, ['--reserve'])).toBe('0010');
    } finally {
      delete process.env.GIT_COMMON_DIR;
      delete process.env.GIT_OBJECT_DIRECTORY;
    }
  });

  it('warns when it skips branches because the project is not the repository root', async () => {
    const result = await runNext(fixturePath('sequence-project'));
    expect(result.lines).toEqual(['0006']);
    expect(result.stderr).toContain('rama');
  });

  it('leaves the working tree unchanged', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    await runNext(repo);
    expect(git(repo, ['status', '--porcelain'])).toBe('');
  });
});

describe('id next with parallel worktrees', () => {
  const parallel = '0035-Partición-en-paralelo';

  it('counts a roadmap row reserved in develop that the current branch has not integrated', async () => {
    const repo = copyFixtureToRepo('sequence-project', ['feature/partición-b'], parallel);
    addUnmergedCommit(repo, 'develop', '.docs/sdd/roadmap.md', '| 0031 | Reservada por la partición | S |');
    git(repo, ['switch', '-q', 'feature/partición-b']);
    const result = await runNext(repo);
    expect(result.lines).toEqual(['0032']);
    expect(result.code).toBe(0);
  });

  it('counts a roadmap row of another unmerged feature branch', async () => {
    const repo = copyFixtureToRepo('sequence-project', [], parallel);
    addUnmergedCommit(repo, 'feature/partición-a', '.docs/sdd/roadmap.md', '| 0019 | Reservada por la partición | S |');
    expect(await nextId(repo)).toBe('0020');
  });

  it('counts the specs folder of another unmerged branch', async () => {
    const repo = copyFixtureToRepo('sequence-project', [], parallel);
    const folder = '.docs/sdd/specs/20260922-100000-task-0012-exportación/spec.md';
    addUnmergedCommit(repo, 'feature/exportación', folder, '# Spec');
    expect(await nextId(repo)).toBe('0013');
  });

  it('counts a row staged only in the index of another worktree', async () => {
    const repo = copyFixtureToRepo('sequence-project', [], parallel);
    const other = addWorktree(repo, 'feature/partición', 'worktree-partición');
    writeFileSync(join(other, '.docs/sdd/roadmap.md'), '| 0032 | Reservada en staged | S |\n', { flag: 'a' });
    git(other, ['add', '-A']);
    expect(await nextId(repo)).toBe('0033');
  });

  it('counts an uncommitted specs folder of another worktree', async () => {
    const repo = copyFixtureToRepo('sequence-project', [], parallel);
    const other = addWorktree(repo, 'feature/patch', 'worktree-patch');
    mkdirSync(join(other, '.docs/sdd/specs/20260923-070206-patch-0036-disparador'), { recursive: true });
    expect(await nextId(repo)).toBe('0037');
  });
});

describe('id next with the current branch id', () => {
  it('returns the id of the current branch when nothing else uses it', async () => {
    const repo = copyFixtureToRepo('sequence-project', ['feature/0027']);
    git(repo, ['switch', '-q', 'feature/0027']);
    expect(await nextId(repo)).toBe('0027');
  });

  it('does not return the current branch id when another branch uses it in specs', async () => {
    const repo = copyFixtureToRepo('sequence-project', ['feature/0027']);
    addUnmergedCommit(repo, 'feature/otra', '.docs/sdd/specs/20260922-100000-patch-0027-otro/patch.md', '# Patch');
    git(repo, ['switch', '-q', 'feature/0027']);
    expect(await nextId(repo)).toBe('0028');
  });
});
