import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { git, mergeFixture, runMerge, saveAll, write, type Fixture } from './helpers.ts';

const fn = (name: string, value: number) => `int ${name}(void)\n{\n    return ${value};\n}\n`;
const BASE = [fn('a', 1), fn('b', 2), fn('c', 3)].join('\n');
const MOVED = [fn('a', 1), fn('c', 3), fn('b', 2)].join('\n');
const EDITED = [fn('a', 1), fn('b', 2), fn('c', 30)].join('\n');

function movedAndEdited(name: string): Fixture {
  const fx = mergeFixture(name);
  write(fx.seed, 'src/f.c', BASE);
  saveAll(fx.seed, 'feat: f.c');
  git(fx.seed, 'push', '-q', fx.remote, 'develop');
  for (const [id, text] of [['0001', MOVED], ['0002', EDITED]]) {
    const feature = join(fx.wt, id);
    git(feature, 'fetch', '-q', 'origin');
    git(feature, 'merge', '-q', 'origin/develop');
    write(feature, 'src/f.c', text);
    saveAll(feature, `feat: f.c en ${id}`);
  }
  return fx;
}

describe('los trozos se calculan con histogram', () => {
  it('mover c y cambiar c: con myers es conflicto, sdd merge lo fusiona', async () => {
    const fx = movedAndEdited('histogram');
    const probe = join(fx.wt, '0002');
    const myers = spawnSync('git', ['merge', '--no-commit', '-X', 'diff-algorithm=myers', 'feature/0001'], { cwd: probe });
    spawnSync('git', ['merge', '--abort'], { cwd: probe });
    expect(myers.status).not.toBe(0);
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(git(fx.repo, 'show', 'develop:src/f.c')).toBe([fn('a', 1), fn('c', 30), fn('b', 2)].join('\n').trimEnd());
  });
});
