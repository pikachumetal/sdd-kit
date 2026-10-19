import { describe, it, expect } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mergirafRuns, solveWithMergiraf } from '../../src/merge/mergiraf.ts';

const conflicted = '<<<<<<< ours\na\n||||||| base\n=======\nb\n>>>>>>> theirs\n';

describe('mergiraf', () => {
  it('un programa que no arranca no cuenta como mergiraf', () => {
    expect(mergirafRuns(['sdd-no-existe-mergiraf'])).toBe(false);
  });

  it('una salida con marcas no cuenta como resuelta aunque mergiraf salga con 0', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'sdd-mergiraf-'));
    writeFileSync(join(dir, 'a.ts'), conflicted);
    const lines: string[] = [];
    try {
      const left = await solveWithMergiraf(dir, ['a.ts'], { report: (line) => lines.push(line), command: [process.execPath, '-e', ''] });
      expect(left).toEqual(['a.ts']);
      expect(lines).toEqual(['mergiraf: no resuelve a.ts']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
