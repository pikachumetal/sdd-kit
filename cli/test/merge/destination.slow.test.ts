import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { edit, git, mergeFixture, runMerge, sha, write } from './helpers.ts';

const slash = (text: string) => text.replaceAll('\\', '/');

function dirtyDevelop(name: string) {
  const fx = mergeFixture(name);
  const dev = join(fx.wt, 'dev');
  git(fx.repo, 'worktree', 'add', '-q', dev, 'develop');
  return { fx, dev };
}

describe('con la rama destino sacada y con cambios sin commitear, el cierre no fusiona', () => {
  it('el merge para con diff --stat y tres salidas', async () => {
    const { fx, dev } = dirtyDevelop('salidas');
    edit(dev, '.docs/sdd/roadmap.md', '| 0100 | base |', '| 0100 | base retocada |');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code).toBe(1);
    expect(slash(result.text)).toContain(`destino sacado: el checkout de 'develop' en '${slash(dev)}' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`);
    expect(result.text).toMatch(/\.docs\/sdd\/roadmap\.md \| +2 \+-/);
    expect(result.text).toContain('2. Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, deuda, estimation-log).');
    expect(result.text).toContain('3. Dejar el merge para luego.');
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('lista los ficheros sin seguimiento aunque no haya diff', async () => {
    const { fx, dev } = dirtyDevelop('sin-seguimiento');
    write(dev, 'notas.txt', 'apuntes\n');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code).toBe(1);
    expect(result.text).toContain('sin seguimiento: notas.txt');
    expect(result.text).not.toContain('Llevarlos');
    expect(result.text).toContain('2. Dejar el merge para luego.');
  });
});

describe('la comprobación del destino no toca nada', () => {
  it('--check con el destino sucio sale con 1 sin tocar nada', async () => {
    const { fx, dev } = dirtyDevelop('check-sucio');
    edit(dev, '.docs/sdd/roadmap.md', '| 0100 | base |', '| 0100 | base retocada |');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(join(fx.wt, '0001'), ['--check']);

    expect(result.code).toBe(1);
    expect(slash(result.text)).toContain(`destino sacado: el checkout de 'develop' en '${slash(dev)}'`);
    expect(result.text).toContain('3. Dejar el merge para luego.');
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
    expect(existsSync(fx.lock)).toBe(false);
  });

  it('--check con el destino limpio dice listo', async () => {
    const { fx, dev } = dirtyDevelop('check-limpio');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--check']);

    expect(result.code, result.text).toBe(0);
    expect(slash(result.text)).toBe(`destino: listo: 'develop' sacado en '${slash(dev)}', sin cambios`);
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('--check sin el destino sacado dice el worktree temporal', async () => {
    const fx = mergeFixture('check-temporal');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(join(fx.wt, '0001'), ['--check']);

    expect(result.code, result.text).toBe(0);
    expect(slash(result.text)).toBe(`destino: listo: 'develop' irá en el worktree temporal '${slash(join(fx.wt, 'merge-0001'))}'`);
    expect(existsSync(join(fx.wt, 'merge-0001'))).toBe(false);
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
  });
});
