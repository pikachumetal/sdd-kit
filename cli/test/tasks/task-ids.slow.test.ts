import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { commitAll, emptyRepo, sdd, write } from './harness.ts';

const plan = 'plan.md';
const ids = '# Plan\n\n## Task 6b: Sub\n\nUna.\n\n## Task 7: Otra\n\nOtra.\n';

function repoWithIds(): { repo: string; base: string } {
  const repo = emptyRepo();
  write(join(repo, plan), ids);
  write(join(repo, 'stray.md'), `${ids}\`\`\`\n`);
  write(join(repo, 'tasks.md'), '# Tasks\n');
  return { repo, base: commitAll(repo, 'fixture') };
}

describe('Los verbos de tasks aceptan ids con letras y puntos', () => {
  it('task start, brief and done accept 6b', () => {
    const { repo, base } = repoWithIds();
    const start = sdd(repo, 'task', 'start', plan, '6b');
    expect(start.code).toBe(0);
    expect(start.out).toContain('task-6b-brief.md');
    expect(sdd(repo, 'task', 'brief', plan, '6b').code).toBe(0);
    write(join(repo, 'task.txt'), 'x\n');
    commitAll(repo, 'task');
    const done = sdd(repo, 'task', 'done', plan, '6b', base, '--', process.execPath, '-e', '');
    expect(done.code).toBe(0);
    expect(done.out).toContain('Task 6b: complete');
  });

  it('rejects ids without a digit, with other characters or a dot at the edge', () => {
    const { repo, base } = repoWithIds();
    for (const id of ['Overview', '6*', '6.']) {
      const calls: [string, string[]][] = [
        ['start', [plan, id]],
        ['brief', [plan, id]],
        ['done', [plan, id, base, '--', process.execPath, '-e', '']],
      ];
      for (const [verb, args] of calls) {
        const result = sdd(repo, 'task', verb, ...args);
        expect(result.code).toBe(2);
        expect(result.err).toContain(`usage: sdd task ${verb}`);
      }
    }
  });

  it('task brief prints the stray-fence warning on stderr', () => {
    const { repo } = repoWithIds();
    const result = sdd(repo, 'task', 'brief', 'stray.md', '7');
    expect(result.code).toBe(0);
    expect(result.err).toContain('no oculta ningún encabezado de task');
  });
});
