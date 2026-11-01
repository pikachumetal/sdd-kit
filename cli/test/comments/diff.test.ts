import { describe, it, expect } from 'vitest';
import { addedLinesByFile } from '../../src/comments/diff.ts';

const header = (file: string) => [`diff --git a/${file} b/${file}`, `--- a/${file}`, `+++ b/${file}`];

describe('addedLinesByFile', () => {
  it('reúne las líneas añadidas de cada hunk, por fichero', () => {
    const diff = [...header('a.ts'), '@@ -1,0 +1,2 @@', '+x', '+y', '@@ -5 +7 @@', '-z', '+w', ...header('b.ts'), '@@ -0,0 +1 @@', '+v'].join('\n');
    expect([...addedLinesByFile(diff)]).toEqual([['a.ts', [1, 2, 7]], ['b.ts', [1]]]);
  });

  it('un hunk que solo borra no añade líneas', () => {
    expect(addedLinesByFile([...header('a.ts'), '@@ -3 +2,0 @@', '-z'].join('\n')).get('a.ts')).toEqual([]);
  });

  it('una línea añadida que parece una cabecera no cambia de fichero', () => {
    const diff = [...header('a.ts'), '@@ -0,0 +1 @@', '+++ b/x', '@@ -1,0 +3 @@', '+y'].join('\n');
    expect([...addedLinesByFile(diff)]).toEqual([['a.ts', [1, 3]]]);
  });
});
