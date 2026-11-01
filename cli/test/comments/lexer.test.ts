import { describe, it, expect } from 'vitest';
import { commentLinesOf } from '../../src/comments/lexer.ts';

const linesOf = (path: string, source: string) => [...(commentLinesOf(path, source) ?? new Map()).keys()];

describe('commentLinesOf', () => {
  it.each([
    ['a.ts', 'const a = 1;\n// nota\n'],
    ['a.cs', 'var a = 1;\n// nota\n'],
    ['a.scss', '.a {}\n// nota\n'],
    ['a.py', 'a = 1\n# nota\n'],
    ['a.yml', 'a: 1\n# nota\n'],
    ['Dockerfile', 'FROM node\n# nota\n'],
    ['Makefile', 'all:\n# nota\n'],
    ['a.ps1', '$a = 1\n# nota\n'],
    ['a.sql', 'select 1;\n-- nota\n'],
    ['a.css', '.a {}\n/* nota */\n'],
    ['a.html', '<p></p>\n<!-- nota -->\n'],
    ['a.cshtml', '<p></p>\n@* nota *@\n'],
  ])('lists a line comment in %s', (path, source) => {
    expect(linesOf(path, source)).toEqual([2]);
  });

  it('lists every line of a block comment', () => {
    expect(linesOf('a.cs', 'var a;\n/* uno\n   dos\n   tres */\nvar b;\n')).toEqual([2, 3, 4]);
  });

  it('lists the lines of a PowerShell block comment', () => {
    expect(linesOf('a.ps1', '<# uno\ndos #>\n$a = 1\n')).toEqual([1, 2]);
  });

  it('gives the line text without its indentation', () => {
    expect(commentLinesOf('a.ts', 'function f() {\n    // nota\n}\n')?.get(2)).toBe('// nota');
  });

  it.each([
    ['a.ts', 'const a = "// nota";\n'],
    ['a.ts', "const a = '// nota';\n"],
    ['a.py', 'a = "# nota"\n'],
    ['a.sql', "select '-- nota';\n"],
  ])('ignores the same text in a string: %s %s', (path, source) => {
    expect(linesOf(path, source)).toEqual([]);
  });

  it('ignores an escaped quote before the text', () => {
    expect(linesOf('a.ts', 'const a = "x\\" // nota";\n')).toEqual([]);
  });

  it('ignores a comment inside a multiline template', () => {
    expect(linesOf('a.ts', 'const a = `uno\n// nota\ndos`;\n')).toEqual([]);
  });

  it('ignores a comment inside a triple-quoted string', () => {
    expect(linesOf('a.py', 'a = """uno\n# nota\ndos"""\n')).toEqual([]);
  });

  it('a string that does not close ends at the end of the line', () => {
    expect(linesOf('a.ts', "const a = 'x\n// nota\n")).toEqual([2]);
  });

  it('lists a trailing comment', () => {
    expect(commentLinesOf('a.ts', 'save(); // nota\n')?.get(1)).toBe('save(); // nota');
  });

  it('ignores a hash inside a word', () => {
    expect(linesOf('a.sh', 'echo a#nota\necho $#\n')).toEqual([]);
  });

  it('strips the carriage return', () => {
    const lines = commentLinesOf('a.ts', 'const a = 1;\r\n// nota\r\nconst b = 2;\r\n');
    expect(lines?.get(2)).toBe('// nota');
    expect([...(lines?.keys() ?? [])]).toEqual([2]);
  });

  it('html has no strings: an apostrophe does not hide a comment', () => {
    expect(linesOf('a.html', "<p>it's</p> <!-- nota -->\n")).toEqual([1]);
  });

  it('returns null for an unknown extension', () => {
    expect(commentLinesOf('a.vue', '// nota\n')).toBeNull();
  });
});
