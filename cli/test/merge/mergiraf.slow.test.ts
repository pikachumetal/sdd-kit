import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { mergirafRuns } from '../../src/merge/mergiraf.ts';
import { git, mergeFixture, runMerge, saveAll, sha, write } from './helpers.ts';

const base = 'import { a } from "./a";\n\nexport class Rooms {\n  list(): string[] {\n    return [];\n  }\n}\n';
const variant = (name: string, method: string) =>
  `import { a, ${name} } from "./a";\n\nexport class Rooms {\n  list(): string[] {\n    return [];\n  }\n\n  ${method}\n}\n`;

function twoMethodsFixture(name: string) {
  const fx = mergeFixture(name);
  write(fx.seed, 'src/rooms.ts', base);
  saveAll(fx.seed, 'feat: rooms');
  git(fx.seed, 'push', '-q', fx.remote, 'develop');
  const methods: Record<string, [string, string]> = { '0001': ['b', 'count(): number {\n    return 0;\n  }'], '0002': ['c', 'free(): boolean {\n    return true;\n  }'] };
  for (const id of ['0001', '0002']) {
    const feature = join(fx.wt, id);
    git(feature, 'fetch', '-q', 'origin');
    git(feature, 'merge', '-q', 'origin/develop');
    write(feature, 'src/rooms.ts', variant(...methods[id]));
    saveAll(feature, `feat: método de ${id}`);
  }
  return fx;
}

function withoutMergiraf<T>(body: () => Promise<T>): Promise<T> {
  const original = process.env.PATH ?? '';
  const holds = (dir: string) => ['mergiraf', 'mergiraf.exe'].some((file) => existsSync(join(dir, file)));
  process.env.PATH = original.split(delimiter).filter((dir) => !holds(dir)).join(delimiter);
  return body().finally(() => { process.env.PATH = original; });
}

describe('mergiraf, herramienta obligatoria del repo', () => {
  it('mergiraf está en el PATH', () => {
    expect(mergirafRuns(), 'mergiraf no está en el PATH: instálalo (tech-stack.md, «Herramientas del repo»)').toBe(true);
  });
});

describe('mergiraf resuelve lo que queda', () => {
  it('resuelve dos métodos y dos imports en el mismo sitio, lo dice y verifica el resultado', async () => {
    const fx = twoMethodsFixture('mergiraf-ok');
    const first = await runMerge(join(fx.wt, '0001'), ['--push']);
    expect(first.code, first.text).toBe(0);
    const result = await runMerge(join(fx.wt, '0002'), ['--push', '--verify', 'git --version']);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain('mergiraf: resuelto src/rooms.ts');
    expect(result.text).toMatch(/git version/);
    const merged = git(fx.repo, 'show', 'develop:src/rooms.ts');
    expect(merged).toContain('import { a, b, c } from "./a";');
    expect(merged).toContain('count(): number');
    expect(merged).toContain('free(): boolean');
    expect(git(fx.repo, 'config', '--local', '--list')).not.toMatch(/^(merge|mergiraf)\./m);
    expect(existsSync(join(fx.wt, '0002', '.gitattributes'))).toBe(false);
  });

  it('si los dos cambian el mismo método, no resuelve y la rama destino queda como estaba', async () => {
    const fx = twoMethodsFixture('mergiraf-no');
    for (const id of ['0001', '0002']) {
      write(join(fx.wt, id), 'src/rooms.ts', base.replace('return [];', `return ['${id}'];`));
      saveAll(join(fx.wt, id), `fix: list de ${id}`);
    }
    const first = await runMerge(join(fx.wt, '0001'), ['--push']);
    expect(first.code, first.text).toBe(0);
    const before = sha(fx.repo, 'develop');
    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code).toBe(1);
    expect(result.text).toContain('mergiraf: no resuelve src/rooms.ts');
    expect(result.text).toContain('merge: conflicto en src/rooms.ts.');
    expect(sha(fx.repo, 'develop')).toBe(before);
  });
});

describe('mergiraf con otro conflicto que queda', () => {
  it('no dice resuelto si el merge acaba abortado', async () => {
    const fx = twoMethodsFixture('mergiraf-abortado');
    for (const id of ['0001', '0002']) {
      write(join(fx.wt, id), 'README.md', `cambio de ${id}\n`);
      saveAll(join(fx.wt, id), `docs: readme de ${id}`);
    }
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code).toBe(1);
    expect(result.text).not.toContain('mergiraf: resuelto');
    expect(result.text).toContain('merge: conflicto en');
  });
});

describe('sin mergiraf', () => {
  it('el conflicto falla como hoy y no se nombra mergiraf', async () => {
    const fx = twoMethodsFixture('sin-mergiraf');
    const first = await runMerge(join(fx.wt, '0001'), ['--push']);
    expect(first.code, first.text).toBe(0);
    const before = sha(fx.repo, 'develop');
    const result = await withoutMergiraf(() => runMerge(join(fx.wt, '0002'), ['--push']));

    expect(result.code).toBe(1);
    expect(result.text).toContain('merge: conflicto en src/rooms.ts.');
    expect(result.text).not.toContain('mergiraf');
    expect(sha(fx.repo, 'develop')).toBe(before);
  });
});
