import { describe, it, expect } from 'vitest';
import { mergeArgs } from '../../src/merge/attempt.ts';

describe('opciones de git del merge', () => {
  it('pone zdiff3 e histogram antes de los argumentos del merge', () => {
    expect(mergeArgs(['--no-ff', 'feature/0001'])).toEqual(['-c', 'merge.conflictStyle=zdiff3', 'merge', '-X', 'diff-algorithm=histogram', '--no-ff', 'feature/0001']);
  });
});
