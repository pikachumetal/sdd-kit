import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { commitAll, emptyRepo, git, planText, sdd, sddWithEnv, write } from './harness.ts';

const plan = 'plan.md';
const twoTasks = '# Plan\n\n## Task 1: First thing\n\nDo the first thing.\n\n## Task 2: Second thing\n\nDo the second thing.\n';

function repoWithPlan(): { repo: string; base: string; ledger: string } {
  const repo = emptyRepo();
  write(join(repo, plan), twoTasks);
  const base = commitAll(repo, 'fixture');
  return { repo, base, ledger: join(repo, '.superpowers', 'sdd', 'plan', 'progress.md') };
}

describe('sdd task start / done (test-executing-plans-scripts.sh)', () => {
  it('task start without a task number errors with exit 2', () => {
    expect(sdd(repoWithPlan().repo, 'task', 'start', plan).code).toBe(2);
  });

  it('task start prints the brief path, BASE as HEAD and writes the brief', () => {
    const { repo, base } = repoWithPlan();
    const result = sdd(repo, 'task', 'start', plan, '1');
    const briefPath = join(repo, '.superpowers', 'sdd', 'plan', 'task-1-brief.md');
    expect(result.out).toContain(`brief: ${briefPath}`);
    expect(result.out).toContain(`base: ${base}`);
    expect(readFileSync(briefPath, 'utf8')).toContain('Do the first thing.');
  });

  it('task done appends the completion line with commit range and test result', () => {
    const { repo, base, ledger } = repoWithPlan();
    write(join(repo, 'work.txt'), 'x\n');
    const head = commitAll(repo, 'task 1');
    const script = 'console.log("Ran 3 tests"); console.log("OK")';
    const result = sdd(repo, 'task', 'done', plan, '1', base, '--', process.execPath, '-e', script);
    expect(result.code).toBe(0);
    expect(result.out).toContain('OK');
    const line = `Task 1: complete (commits ${base.slice(0, 7)}..${head.slice(0, 7)}, tests: ${process.execPath} -e '${script}' → OK)`;
    expect(readFileSync(ledger, 'utf8')).toContain(line);
    expect(readFileSync(join(repo, '.superpowers', 'sdd', 'plan', 'task-1-tests.log'), 'utf8').length).toBeGreaterThan(0);
  });

  it('task done refuses to record a failing task and shows the failing output', () => {
    const { repo, base, ledger } = repoWithPlan();
    const script = 'console.log("FAILED (errors=1)"); process.exit(1)';
    const result = sdd(repo, 'task', 'done', plan, '2', base, '--', process.execPath, '-e', script);
    expect(result.code).toBe(1);
    expect(result.out).toContain('FAILED');
    expect(result.err).toContain('Task 2 NOT recorded');
    expect(() => readFileSync(ledger, 'utf8')).toThrow();
  });

  it('task done rejects a BASE that does not exist with exit 2', () => {
    const { repo } = repoWithPlan();
    const result = sdd(repo, 'task', 'done', plan, '1', 'no-such-rev', '--', process.execPath, '-e', '');
    expect(result.code).toBe(2);
    expect(result.err).toContain('bad BASE: no-such-rev');
  });

  it.runIf(process.platform === 'win32')('task done runs a .cmd file with an argument that has spaces', () => {
    const { repo, base, ledger } = repoWithPlan();
    const script = join(repo, 'echo arg.cmd');
    writeFileSync(script, '@echo off\r\necho got:%~1\r\n');
    const result = sdd(repo, 'task', 'done', plan, '1', base, '--', script, 'a b');
    expect(result.code).toBe(0);
    expect(result.out).toContain('got:a b');
    expect(readFileSync(ledger, 'utf8')).toMatch(/^Task 1: complete \(.*, tests: .*echo arg\.cmd'? 'a b' → got:a b\)$/m);
  });
});

describe('sdd task brief', () => {
  it('extracts only the requested task', () => {
    const { repo } = repoWithPlan();
    sdd(repo, 'task', 'brief', plan, '2');
    const brief = readFileSync(join(repo, '.superpowers', 'sdd', 'plan', 'task-2-brief.md'), 'utf8');
    expect(brief).toBe('## Task 2: Second thing\n\nDo the second thing.\n');
  });

  it('does not treat a heading inside a code fence as a task boundary', () => {
    const repo = emptyRepo();
    write(join(repo, plan), '## Task 1: A\n\n```\n## Task 2: fake\n```\n\nstill task 1\n\n## Task 2: B\n\nreal\n');
    sdd(repo, 'task', 'brief', plan, '1');
    const brief = readFileSync(join(repo, '.superpowers', 'sdd', 'plan', 'task-1-brief.md'), 'utf8');
    expect(brief).toContain('## Task 2: fake');
    expect(brief).toContain('still task 1');
    expect(brief).not.toContain('real');
  });

  it('does not match Task 1 against Task 10', () => {
    const repo = emptyRepo();
    write(join(repo, plan), '## Task 10: Tenth\n\nten\n\n## Task 1: First\n\none\n');
    sdd(repo, 'task', 'brief', plan, '1');
    expect(readFileSync(join(repo, '.superpowers', 'sdd', 'plan', 'task-1-brief.md'), 'utf8')).toBe('## Task 1: First\n\none\n');
  });

  it('fails with the not-found message when the task is missing', () => {
    const { repo } = repoWithPlan();
    const result = sdd(repo, 'task', 'brief', plan, '9');
    expect(result.code).toBe(1);
    expect(result.err).toContain("task 9 not found in plan.md (no heading matching 'Task 9')");
  });

  it('honors an explicit OUTFILE and extracts the Interfaces block (DispatchBrief.Tests.ps1)', () => {
    const repo = emptyRepo();
    const template = readFileSync(new URL('../../../skills/sdd-templates/templates/plan-template.md', import.meta.url), 'utf8');
    write(join(repo, plan), template);
    const out = join(repo, 'out.md');
    const result = sdd(repo, 'task', 'brief', plan, '1', out);
    expect(result.code).toBe(0);
    expect(result.out).toContain(`wrote ${out}: `);
    expect(readFileSync(out, 'utf8')).toMatch(/\*\*Interfaces\*\*/);
  });
});

describe('sdd review package', () => {
  function repoWithTwoCommits() {
    const repo = emptyRepo();
    write(join(repo, plan), planText('Plan', 'First', 'x'));
    commitAll(repo, 'c1');
    write(join(repo, 'f'), 'y\n');
    commitAll(repo, 'c2');
    return repo;
  }

  it('writes its diff under the plan workspace', () => {
    const repo = repoWithTwoCommits();
    const result = sdd(repo, 'review', 'package', plan, 'HEAD~1', 'HEAD');
    expect(result.code).toBe(0);
    expect(result.out).toMatch(/^wrote .*[\\/]\.superpowers[\\/]sdd[\\/]plan[\\/]review-[0-9a-f]+\.\.[0-9a-f]+\.diff: 1 commit\(s\), \d+ bytes$/m);
  });

  it('fails without a plan with exit 2', () => {
    expect(sdd(repoWithTwoCommits(), 'review', 'package', 'HEAD~1', 'HEAD').code).toBe(2);
  });

  it('honors an explicit OUTFILE and writes commits, files changed and diff', () => {
    const repo = repoWithTwoCommits();
    const out = join(repo, 'explicit.diff');
    const result = sdd(repo, 'review', 'package', plan, 'HEAD~1', 'HEAD', out);
    expect(result.out).toContain(out);
    const text = readFileSync(out, 'utf8');
    expect(text).toContain('## Commits');
    expect(text).toContain('## Files changed');
    expect(text).toContain('+y');
  });

  it('rejects a BASE that is not an ancestor of HEAD', () => {
    const repo = repoWithTwoCommits();
    const divergent = git(repo, 'commit-tree', 'HEAD~1^{tree}', '-p', 'HEAD~1', '-m', 'divergent');
    const result = sdd(repo, 'review', 'package', plan, divergent, 'HEAD');
    expect(result.code).toBe(1);
    expect(result.err).toContain('not a descendant');
  });

  it('rejects an empty BASE..HEAD range', () => {
    const result = sdd(repoWithTwoCommits(), 'review', 'package', plan, 'HEAD', 'HEAD');
    expect(result.code).toBe(1);
    expect(result.err).toContain('empty commit range');
  });

  it('rejects an unknown BASE with exit 2', () => {
    const result = sdd(repoWithTwoCommits(), 'review', 'package', plan, 'nope', 'HEAD');
    expect(result.code).toBe(2);
    expect(result.err).toContain('bad BASE: nope');
  });
});

describe('sdd task done command resolution and arguments', () => {
  function pathWith(dir: string): NodeJS.ProcessEnv {
    return { ...process.env, PATH: `${dir}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH}` };
  }

  it.runIf(process.platform === 'win32')('prefers tool.cmd over an extensionless shim next to it', () => {
    const { repo, base, ledger } = repoWithPlan();
    const bin = join(repo, 'bin');
    write(join(bin, 'tool'), '#!/bin/sh\necho shim\n');
    write(join(bin, 'tool.cmd'), '@echo off\r\necho cmd:%~1\r\n');
    const result = sddWithEnv(repo, pathWith(bin), ['task', 'done', plan, '1', base, '--', 'tool', 'x']);
    expect(result.code).toBe(0);
    expect(readFileSync(ledger, 'utf8')).toContain('→ cmd:x)');
  });

  it.runIf(process.platform === 'win32')('runs a relative path with backslashes', () => {
    const { repo, base, ledger } = repoWithPlan();
    write(join(repo, 'sub', 'tool.cmd'), '@echo off\r\necho rel:%~1\r\n');
    const result = sdd(repo, 'task', 'done', plan, '1', base, '--', '.\\sub\\tool.cmd', 'x');
    expect(result.code).toBe(0);
    expect(readFileSync(ledger, 'utf8')).toContain('→ rel:x)');
  });

  it('task brief with a non-numeric task number exits 2', () => {
    const result = sdd(repoWithPlan().repo, 'task', 'brief', plan, '(');
    expect(result.code).toBe(2);
  });

  it('task start with a non-numeric task number exits 2', () => {
    expect(sdd(repoWithPlan().repo, 'task', 'start', plan, 'x').code).toBe(2);
  });

  it('task done without the -- separator exits 2 with the usage message', () => {
    const { repo, base } = repoWithPlan();
    const result = sdd(repo, 'task', 'done', plan, '1', base, process.execPath, 'x');
    expect(result.code).toBe(2);
    expect(result.err).toContain('usage: sdd task done PLAN_FILE TASK_NUMBER BASE -- TEST_COMMAND [ARGS...]');
  });

  it('task done with a non-numeric task number exits 2', () => {
    const { repo, base } = repoWithPlan();
    expect(sdd(repo, 'task', 'done', plan, 'x', base, '--', process.execPath, '-e', '').code).toBe(2);
  });
});
