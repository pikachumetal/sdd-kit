import { describe, it, expect } from 'vitest';
import { chmodSync } from 'node:fs';
import { join } from 'node:path';
import { git, localCommit, mergeFixture, publishFromSeed, runMerge, sha, write } from './helpers.ts';

describe('el push del cierre reintenta si la rama destino avanzó', () => {
  it('si la rama destino avanzó durante la verificación integra y publica', async () => {
    const fx = mergeFixture('reintento');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', publishFromSeed(fx, 'otra-sesion.txt', true)]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("push: 'develop' avanzó en 'origin'; integro y reintento (2/3)");
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
    git(fx.repo, 'merge-base', '--is-ancestor', sha(fx.seed, 'develop'), 'develop');
    git(fx.repo, 'merge-base', '--is-ancestor', 'feature/0001', 'develop');
    expect(result.text).not.toContain('también publica');
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
    write(rejectHooks, 'pre-receive', '#!/bin/sh\necho rama protegida >&2\nexit 1\n');
    chmodSync(join(rejectHooks, 'pre-receive'), 0o755);
    git(fx.remote, 'config', 'core.hooksPath', rejectHooks);

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code).toBe(1);
    expect(result.text).toContain("push: no se pudo publicar 'develop' en 'origin'.");
    expect(result.text).toContain('remote: rama protegida');
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

describe('el push nombra los commits de la rama destino que no son del cambio', () => {
  it('con un commit local en develop lo nombra antes de publicado en', async () => {
    const fx = mergeFixture('ajeno-uno');
    const triage = localCommit(fx, 'develop', 'docs(roadmap): triaje');

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code, result.text).toBe(0);
    const header = result.text.indexOf("push: también publica 1 commit de 'develop' que no es de feature/0001:");
    expect(header).toBeGreaterThan(-1);
    expect(result.text.indexOf(`- ${triage} docs(roadmap): triaje`)).toBeGreaterThan(header);
    expect(result.text.indexOf('publicado en origin')).toBeGreaterThan(header);
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
  });

  it('con dos commits locales los nombra en plural', async () => {
    const fx = mergeFixture('ajeno-dos');
    const first = localCommit(fx, 'develop', 'docs(roadmap): triaje');
    const second = localCommit(fx, 'develop', 'docs(roadmap): otro triaje');

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("push: también publica 2 commits de 'develop' que no son de feature/0001:");
    expect(result.text).toContain(`- ${first} docs(roadmap): triaje`);
    expect(result.text).toContain(`- ${second} docs(roadmap): otro triaje`);
  });

  it('sin --push no nombra los commits locales', async () => {
    const fx = mergeFixture('ajeno-sin-push');
    localCommit(fx, 'develop', 'docs(roadmap): triaje');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code, result.text).toBe(0);
    expect(result.text).not.toContain('también publica');
  });

  it('sin remoto no nombra los commits locales', async () => {
    const fx = mergeFixture('ajeno-sin-remoto');
    git(fx.repo, 'remote', 'remove', 'origin');
    localCommit(fx, 'develop', 'docs(roadmap): triaje');

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain('push: no hecho: sin remoto');
    expect(result.text).not.toContain('también publica');
  });

  it('con un commit local y un reintento solo nombra el local', async () => {
    const fx = mergeFixture('ajeno-reintento');
    const triage = localCommit(fx, 'develop', 'docs(roadmap): triaje');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', publishFromSeed(fx, 'otra-sesion.txt', true)]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("push: 'develop' avanzó en 'origin'; integro y reintento (2/3)");
    expect(result.text).toContain("push: también publica 1 commit de 'develop' que no es de feature/0001:");
    expect(result.text).toContain(`- ${triage} docs(roadmap): triaje`);
  });
});
