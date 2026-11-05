import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kitRoot, run } from './process.ts';

const compareScript = join(kitRoot, 'tests', 'copies', 'dist-compare.ts');

// Un repo de juguete con un fichero commiteado: la orden lee la base con git show, y el árbol del disco.
function toyRepo(committed: string): string {
  const root = mkdtempSync(join(tmpdir(), 'dist-compare-'));
  const git = (...args: string[]): void => {
    run('git', ['-C', root, '-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args]);
  };
  git('init', '-q', '-b', 'main');
  writeFileSync(join(root, 'a.md'), committed);
  git('add', '-A');
  git('commit', '-q', '-m', 'base');
  return root;
}

const compare = (root: string, args: string[]) => run(process.execPath, [compareScript, ...args], { cwd: root });

describe('kit:dist-compare: la orden', () => {
  it('rejects a base that does not exist', () => {
    expect(compare(toyRepo('a\n'), ['--base', 'no-existe', 'a.md'])).toEqual({ output: 'kit:dist-compare: la referencia no-existe no existe: usa --base <ref>', code: 1 });
  });

  it('writes igual for a file equal to its base', () => {
    expect(compare(toyRepo('- a\n  - item\n'), ['--base', 'HEAD', 'a.md'])).toEqual({ output: 'a.md: igual', code: 0 });
  });

  it('names the shape of a file that only changes its indent', () => {
    const root = toyRepo('- a\n  - item\n');
    writeFileSync(join(root, 'a.md'), '- a\n    - item\n');
    expect(compare(root, ['--base', 'HEAD', 'a.md'])).toEqual({
      output: ['a.md: 2 líneas con otra forma', '  - HEAD:2 «  - item»', '  + 2 «    - item»'].join('\n'),
      code: 1,
    });
  });
});
