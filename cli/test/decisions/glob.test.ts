import { describe, it, expect } from 'vitest';
import { globToRegExp } from '../../src/decisions/glob.ts';

describe('globToRegExp', () => {
  it.each([
    ['src/*.ts', 'src/a.ts', true],
    ['src/*.ts', 'src/db/a.ts', false],
    ['src/**/a.ts', 'src/a.ts', true],
    ['src/**/a.ts', 'src/db/x/a.ts', true],
    ['src/db/**', 'src/db/a.sql', true],
    ['src/db/**', 'src/db', false],
    ['src/*.ts', 'SRC/a.ts', false],
    ['**/*.sql', 'a.sql', true],
    ['**/*.sql', 'src/db/a.sql', true],
    ['README.md', 'README.md', true],
    ['src/a.ts', 'src/axts', false],
  ])('%s con %s → %s', (glob, path, expected) => {
    expect(globToRegExp(glob)!.test(path)).toBe(expected);
  });

  it.each([['src/{a,b}'], ['src/?.ts'], ['src/[ab].ts'], ['!src/**'], ['./src/**']])('%s no se admite', (glob) => {
    expect(globToRegExp(glob)).toBeNull();
  });
});
