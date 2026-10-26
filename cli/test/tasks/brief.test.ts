import { describe, it, expect } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
