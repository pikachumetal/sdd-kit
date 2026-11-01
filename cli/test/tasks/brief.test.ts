import { describe, it, expect } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { isLiteSpec, writeBrief } from '../../src/tasks/brief.ts';

const liteSpec = ['---', 'id: 20261026-000000-feature-0009-aviso', 'mode: lite            # full | lite', 'status: approved', '---', '', '# Spec — Aviso', '', '## Approach', '', 'Aviso por correo.', ''].join('\n');

function specFile(text: string): { spec: string; out: string } {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-brief-'));
  const spec = join(dir, 'spec.md');
  writeFileSync(spec, text);
  return { spec, out: join(dir, 'task-1-brief.md') };
}

describe('sdd task start con spec lite', () => {
  it('recognizes mode lite in the frontmatter', () => {
    expect(isLiteSpec(liteSpec)).toBe(true);
    expect(isLiteSpec(liteSpec.replace('mode: lite', 'mode: full'))).toBe(false);
    expect(isLiteSpec(liteSpec.replace('mode: lite', 'mode: spike'))).toBe(false);
    expect(isLiteSpec('# Plan\n\nmode: lite\n')).toBe(false);
    expect(isLiteSpec(liteSpec.replace('mode: lite', 'mode: lite-x'))).toBe(false);
  });

  it('writes the whole lite spec as the brief', async () => {
    const { spec, out } = specFile(liteSpec);
    await writeBrief({ plan: spec, task: '1', out });
    expect(readFileSync(out, 'utf8')).toBe(liteSpec);
  });

  it('keeps the not-found error without mode lite', async () => {
    const { spec, out } = specFile(liteSpec.replace('mode: lite', 'mode: full'));
    await expect(writeBrief({ plan: spec, task: '1', out })).rejects.toThrow(/task 1 not found in .* \(no heading matching 'Task 1'\)/);
  });
});

describe('sdd task start exige tasks.md con más de una task', () => {
  const oneTask = '# Plan\n\n### Task 1 — Primera\n\nUna.\n';
  const twoTasks = oneTask + '\n### Task 2 — Segunda\n\nOtra.\n';
  const fencedSecond = oneTask + '\n```\n### Task 2 — Ejemplo\n```\n';

  it('refuses a plan with two tasks and no tasks.md, without writing the brief', async () => {
    const { spec, out } = specFile(twoTasks);
    await expect(writeBrief({ plan: spec, task: '1', out })).rejects.toThrow(/plan with 2 tasks and no tasks\.md: write .*tasks\.md before the first task/);
    expect(existsSync(out)).toBe(false);
  });

  it('writes the brief once tasks.md exists next to the plan', async () => {
    const { spec, out } = specFile(twoTasks);
    writeFileSync(join(dirname(spec), 'tasks.md'), '# Tasks\n');
    await writeBrief({ plan: spec, task: '1', out });
    expect(readFileSync(out, 'utf8')).toContain('Task 1');
  });

  it('needs no tasks.md with a single task', async () => {
    const { spec, out } = specFile(oneTask);
    await writeBrief({ plan: spec, task: '1', out });
    expect(existsSync(out)).toBe(true);
  });

  it('does not count a task heading inside a fence', async () => {
    const { spec, out } = specFile(fencedSecond);
    await writeBrief({ plan: spec, task: '1', out });
    expect(existsSync(out)).toBe(true);
  });

  it('needs no tasks.md with a lite spec', async () => {
    const { spec, out } = specFile(liteSpec + '\n### Task 1\n\n### Task 2\n');
    await writeBrief({ plan: spec, task: '1', out });
    expect(existsSync(out)).toBe(true);
  });
});
