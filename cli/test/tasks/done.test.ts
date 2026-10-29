import { describe, it, expect } from 'vitest';
import { resultLine } from '../../src/tasks/done.ts';

describe('sdd task done result line', () => {
  it('takes the vitest Tests count, not the trailing Duration', () => {
    const vitest = [' Test Files  12 passed (12)', '      Tests  99 passed (99)', '   Start at  10:57:12', '   Duration  458.37s (tests 99%)', ''];
    expect(resultLine(vitest)).toBe('      Tests  99 passed (99)');
  });

  it('falls back to the last non-empty line', () => {
    expect(resultLine(['8 passing', '', 'done in 2s', ''])).toBe('done in 2s');
    expect(resultLine([])).toBe('(sin salida)');
  });
});
