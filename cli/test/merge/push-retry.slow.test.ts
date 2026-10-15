import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { git, mergeFixture, publishFromSeed, runMerge, sha, write } from './helpers.ts';

describe('el push del cierre reintenta si la rama destino avanzó', () => {
  it('si la rama destino avanzó durante la verificación integra y publica', async () => {
    const fx = mergeFixture('reintento');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', publishFromSeed(fx, 'otra-sesion.txt', true)]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("push: 'develop' avanzó en 'origin'; integro y reintento (2/3)");
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
    git(fx.repo, 'merge-base', '--is-ancestor', sha(fx.seed, 'develop'), 'develop');
    git(fx.repo, 'merge-base', '--is-ancestor', 'feature/0001', 'develop');
  });

  it('tras tres intentos con la rama moviéndose falla y deja el destino como estaba', async () => {
    const fx = mergeFixture('sin-parar');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', publishFromSeed(fx, 'otra-sesion.txt', false)]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('(3/3)');
    expect(result.text).toContain("push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato");
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('un rechazo sin que la rama destino avance falla sin reintentar', async () => {
    const fx = mergeFixture('rechazo-sin-avance');
    const rejectHooks = join(fx.root, 'reject-hooks');
    write(rejectHooks, 'pre-receive', '#!/bin/sh\nexit 1\n');
    git(fx.remote, 'config', 'core.hooksPath', rejectHooks);

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code).toBe(1);
    expect(result.text).toContain("push: no se pudo publicar 'develop' en 'origin'.");
    expect(result.text).not.toContain('reintento');
  });

  it('un conflicto al reintegrar deja la rama destino como estaba', async () => {
    const fx = mergeFixture('reintento-conflicto');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', publishFromSeed(fx, 'feature-0001.txt', true)]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: conflicto en feature-0001.txt');
    expect(sha(fx.repo, 'develop')).toBe(before);
  });
});
