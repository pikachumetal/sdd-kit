import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { cleanedUp, git, isWindows, mergeFixture, runMerge, sha, write } from './helpers.ts';

describe('el push del cierre publica la rama destino', () => {
  it('con --push fusiona --no-ff con el título acordado y deja local y remoto iguales', async () => {
    const fx = mergeFixture('push');

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'feature/0001'));
    expect(git(fx.repo, 'log', '-1', '--format=%s', 'develop')).toBe('merge: feature/0001 en develop');
    expect(git(fx.repo, 'log', '-1', '--format=%b', 'develop')).not.toBe('');
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
    expect(cleanedUp(fx)).toBe(true);
  });

  it('sin --push fusiona en local y no toca el remoto', async () => {
    const fx = mergeFixture('local');
    const remoteBefore = sha(fx.remote, 'develop');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'feature/0001'));
    expect(sha(fx.remote, 'develop')).toBe(remoteBefore);
  });
});

describe('un merge del cierre que falla deja la rama destino como estaba', () => {
  it('con la verificación en rojo no fusiona, no empuja y limpia', async () => {
    const fx = mergeFixture('verificacion');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', 'exit 1']);

    expect(result.code).not.toBe(0);
    expect(result.text).toMatch(/verificaci/);
    expect(sha(fx.repo, 'develop')).toBe(before);
    expect(sha(fx.remote, 'develop')).toBe(before);
    expect(cleanedUp(fx)).toBe(true);
  });

  it('con la verificación en rojo el mensaje cita la ruta del log y la cola de la salida del gate', async () => {
    const fx = mergeFixture('verificacion-log');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', "echo 'Tests Failed: 3'; exit 1"]);

    expect(result.code).not.toBe(0);
    expect(result.text).toMatch(/verificación: código de salida 1; salida completa en [\s\S]*Tests Failed: 3/);
    const log = /\S+sdd-merge-verify-\S+\.log/.exec(result.text)?.[0] ?? '';
    expect(log, result.text).not.toBe('');
    expect(readFileSync(log, 'utf8')).toContain('Tests Failed: 3');
    rmSync(log);
    expect(cleanedUp(fx)).toBe(true);
  });

  // Fuera de Windows abrir un fichero no lo bloquea para otro proceso.
  it.runIf(isWindows)('con un fichero bloqueado por otro proceso falla con bloqueado: y el fichero, no con verificación:', async () => {
    const fx = mergeFixture('bloqueado');
    const before = sha(fx.repo, 'develop');
    const locked = join(fx.root, 'App.dll');
    const holder = spawn('pwsh', ['-NoProfile', '-Command', `$s = [IO.File]::Open('${locked}', 'Create', 'ReadWrite', 'None'); 'abierto'; Start-Sleep 120`]);
    await new Promise((done) => holder.stdout.once('data', done));
    try {
      const result = await runMerge(join(fx.wt, '0001'), ['--verify', `[IO.File]::WriteAllText('${locked}', 'x')`]);

      expect(result.code).not.toBe(0);
      expect(result.text).toMatch(/bloqueado: .*App\.dll/);
      expect(result.text).not.toMatch(/verificación: código de salida/);
      expect(sha(fx.repo, 'develop')).toBe(before);
      expect(cleanedUp(fx)).toBe(true);
    } finally {
      holder.kill();
    }
  });

  it('con el hook pre-merge-commit en rojo falla con verificación: y la salida del hook, no con conflicto', async () => {
    const fx = mergeFixture('hook');
    const before = sha(fx.repo, 'develop');
    const redHooks = join(fx.root, 'red-hooks');
    write(redHooks, 'pre-merge-commit', "#!/bin/sh\necho 'Tests Failed: 3' >&2\nexit 1\n");
    git(fx.repo, 'config', 'core.hooksPath', redHooks);

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code).not.toBe(0);
    expect(result.text).toContain('verificación: el hook rechazó el merge');
    expect(result.text).toContain('Tests Failed: 3');
    expect(result.text).not.toContain('conflicto');
    expect(sha(fx.repo, 'develop')).toBe(before);
    expect(sha(fx.remote, 'develop')).toBe(before);
    expect(cleanedUp(fx)).toBe(true);
  });

  it('con --push y sin remoto fusiona en local y avisa de que no hay push', async () => {
    const fx = mergeFixture('sin-remoto');
    git(fx.repo, 'remote', 'remove', 'origin');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code).toBe(0);
    expect(result.text).toContain('Fusionado feature/0001 en develop');
    expect(result.text).toContain('push: no hecho: sin remoto');
    expect(sha(fx.repo, 'develop')).not.toBe(before);
    git(fx.repo, 'merge-base', '--is-ancestor', 'feature/0001', 'develop');
    expect(cleanedUp(fx)).toBe(true);
  });

  it('con el push rechazado devuelve develop a su commit y limpia', async () => {
    const fx = mergeFixture('rechazo');
    const before = sha(fx.repo, 'develop');
    const rejectHooks = join(fx.root, 'reject-hooks');
    write(rejectHooks, 'pre-receive', '#!/bin/sh\nexit 1\n');
    git(fx.remote, 'config', 'core.hooksPath', rejectHooks);

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code).not.toBe(0);
    expect(result.text).toContain('push');
    expect(sha(fx.repo, 'develop')).toBe(before);
    expect(sha(fx.remote, 'develop')).toBe(before);
    expect(cleanedUp(fx)).toBe(true);
  });

  it('el worktree temporal va junto a los demás worktrees y se retira', async () => {
    const fx = mergeFixture('ruta');
    const marker = join(fx.root, 'cwd.txt');
    const command = isWindows ? `(Get-Location).Path | Set-Content -LiteralPath '${marker}'` : `pwd > '${marker}'`;

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', command]);

    expect(result.code, result.text).toBe(0);
    expect(resolve(readFileSync(marker, 'utf8').trim()).toLowerCase()).toBe(resolve(join(fx.wt, 'merge-0001')).toLowerCase());
    expect(cleanedUp(fx)).toBe(true);
  });
});

describe('rama destino sacada y política de merge', () => {
  it('con develop sacada y con cambios falla con la lista y no la toca', async () => {
    const fx = mergeFixture('sucia');
    const dev = join(fx.wt, 'dev');
    git(fx.repo, 'worktree', 'add', '-q', dev, 'develop');
    write(dev, 'README.md', 'cambio de otra sesión\n');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code).not.toBe(0);
    expect(result.text).toContain('README.md');
    expect(readFileSync(join(dev, 'README.md'), 'utf8')).toBe('cambio de otra sesión\n');
    expect(sha(fx.repo, 'develop')).toBe(before);
    expect(existsSync(fx.lock)).toBe(false);
  });

  it('con develop sacada y limpia fusiona ahí y no retira ese worktree', async () => {
    const fx = mergeFixture('limpia');
    const dev = join(fx.wt, 'dev');
    git(fx.repo, 'worktree', 'add', '-q', dev, 'develop');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'feature/0001'));
    expect(existsSync(join(dev, 'feature-0001.txt'))).toBe(true);
    expect(existsSync(join(fx.wt, 'merge-0001'))).toBe(false);
  });

  it('con una carpeta merge- vacía y sin registrar, la borra y fusiona', async () => {
    const fx = mergeFixture('vacia');
    mkdirSync(join(fx.wt, 'merge-0001'));

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'feature/0001'));
    expect(cleanedUp(fx)).toBe(true);
  });

  it('con develop registrada en un worktree cuya carpeta ya no existe, lo poda, fusiona y no deja registro', async () => {
    const fx = mergeFixture('podable');
    const stale = join(fx.wt, 'merge-0090');
    git(fx.repo, 'worktree', 'add', '-q', stale, 'develop');
    rmSync(stale, { recursive: true, force: true });

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'feature/0001'));
    expect(git(fx.repo, 'worktree', 'list', '--porcelain')).not.toContain('prunable');
    expect(cleanedUp(fx)).toBe(true);
  });

  it('con una carpeta merge- con contenido falla con destino sacado: y no la toca', async () => {
    const fx = mergeFixture('ocupada');
    const leftover = join(fx.wt, 'merge-0001');
    write(leftover, 'ajeno.txt', 'de otra sesión\n');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code).not.toBe(0);
    expect(result.text).toContain('destino sacado: ya existe');
    expect(existsSync(join(leftover, 'ajeno.txt'))).toBe(true);
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('ignora el GIT_INDEX_FILE que hereda de un hook', async () => {
    const fx = mergeFixture('hook-env');
    const foreignIndex = join(fx.root, 'indice-ajeno');
    process.env.GIT_INDEX_FILE = foreignIndex;
    try {
      const result = await runMerge(join(fx.wt, '0001'));
      expect(result.code, result.text).toBe(0);
    } finally {
      delete process.env.GIT_INDEX_FILE;
    }
    expect(existsSync(foreignIndex)).toBe(false);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'feature/0001'));
  });

  it('sin bloque merge en sdd-kit.json falla y no toca develop', async () => {
    const fx = mergeFixture('sin-politica');
    const feature = join(fx.wt, '0001');
    write(feature, '.docs/sdd/sdd-kit.json', '{}');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(feature);

    expect(result.code).not.toBe(0);
    expect(result.text).toMatch(/pol.{1,2}tica/);
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('con un sdd-kit.json que no es JSON falla con un mensaje de política', async () => {
    const fx = mergeFixture('json-roto');
    const feature = join(fx.wt, '0001');
    write(feature, '.docs/sdd/sdd-kit.json', '{ no es json');

    const result = await runMerge(feature);

    expect(result.code).toBe(1);
    expect(result.text).toContain('no es un JSON válido');
  });
});
