import { describe, expect, it } from 'vitest';
import { paragraphDiff, shapeDiff } from '../../../tests/copies/dist-compare.ts';
import { kitRoot, run } from './process.ts';

const shape = (base: string, now: string): string[] => shapeDiff(base, now, 'develop');

describe('kit:dist-compare: la forma', () => {
  it('names a line with another indent', () => {
    expect(shape('- a\n  - item\n', '- a\n    - item\n')).toContain('  + 2 «    - item»');
    expect(paragraphDiff('- a\n  - item\n', '- a\n    - item\n')).toEqual([]);
  });

  it('names two list items joined', () => {
    expect(shape('- a\n- b\n', '- a - b\n')).not.toEqual([]);
  });

  it('names a doubled blank line', () => {
    expect(shape('a\n\nb\n', 'a\n\n\nb\n')).toContain('  + 3 «»');
  });

  it('ignores a paragraph wrapped at other points', () => {
    expect(shape('uno dos\ntres\n', 'uno\ndos tres\n')).toEqual([]);
    expect(paragraphDiff('uno dos\ntres\n', 'uno\ndos tres\n')).toEqual([]);
  });

  it('keeps every line inside a fence', () => {
    expect(shape('```\na\nb\n```\n', '```\na b\n```\n')).not.toEqual([]);
  });

  it('compares in LF', () => {
    expect(shape('a\n  b\n', 'a\r\n  b\r\n')).toEqual([]);
    expect(paragraphDiff('a\n  b\n', 'a\r\n  b\r\n')).toEqual([]);
  });
});

describe('kit:dist-compare: los párrafos', () => {
  it('names a paragraph with other words', () => {
    expect(paragraphDiff('uno dos\n\ntres\n', 'uno cuatro\n\ntres\n')).toEqual(['  - uno dos', '  + uno cuatro']);
  });
});

describe('kit:dist-compare: la orden', () => {
  const compare = (args: string[]) => run(process.execPath, ['tests/copies/dist-compare.ts', ...args], { cwd: kitRoot });

  it('rejects a base that does not exist', () => {
    expect(compare(['--base', 'no-existe', 'dist/skills/sdd-tdd/SKILL.md'])).toEqual({
      output: 'kit:dist-compare: la referencia no-existe no existe: usa --base <ref>',
      code: 1,
    });
  });

  it('writes igual for a file equal to its base', () => {
    expect(compare(['--base', 'HEAD', 'README.md'])).toEqual({ output: 'README.md: igual', code: 0 });
  });
});
