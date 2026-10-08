import { describe, it, expect } from 'vitest';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { cleanedUp, deadPid, edit, git, lockFile, mergeFixture, pushRemoteCommit, runMerge, saveAll, sha, sleepCommand, write, writePatchSpec } from './helpers.ts';

const fileAt = (repo: string, path: string) => git(repo, 'show', `develop:${path}`);

describe('el merge del cierre espera su turno', () => {
  it('el segundo proceso espera, dice quién tiene el cerrojo y fusiona sobre lo que dejó el primero', async () => {
    const fx = mergeFixture('turno');
    const first = runMerge(join(fx.wt, '0001'), ['--push', '--verify', sleepCommand(6)]);
    for (let waited = 0; !existsSync(fx.lock) && waited < 300; waited++) await new Promise((done) => setTimeout(done, 200));
    const second = runMerge(join(fx.wt, '0002'), ['--push']);
    const results = await Promise.all([first, second]);

    expect(results[0].code, results[0].text).toBe(0);
    expect(results[1].code, results[1].text).toBe(0);
    expect(results[1].text).toMatch(/Esperando el cerrojo de merge: lo tiene feature\/0001/);
    expect(results[1].text).toMatch(/desde \d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
    expect(git(fx.repo, 'log', '--first-parent', '--format=%s', '-2', 'develop')).toBe('merge: feature/0002 en develop\nmerge: feature/0001 en develop');
    expect(sha(fx.repo, 'develop^1^2')).toBe(sha(fx.repo, 'feature/0001'));
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
  }, 120_000);

  it('si el cerrojo no se libera a tiempo, falla nombrando al dueño y no toca develop', async () => {
    const fx = mergeFixture('timeout');
    const before = sha(fx.repo, 'develop');
    lockFile(fx.lock, process.pid, 'feature/9999');

    const result = await runMerge(join(fx.wt, '0001'), ['--lock-timeout', '0.05']);
    rmSync(fx.lock, { force: true });

    expect(result.code).not.toBe(0);
    expect(result.text).toContain('feature/9999');
    expect(sha(fx.repo, 'develop')).toBe(before);
  });

  it('toma el cerrojo de un proceso que ya no existe y lo dice', async () => {
    const fx = mergeFixture('huerfano');
    lockFile(fx.lock, deadPid(), 'feature/9998');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code, result.text).toBe(0);
    expect(result.text).toMatch(/hu.+rfano/);
    expect(existsSync(fx.lock)).toBe(false);
  });
});

describe('el merge del cierre parte de la rama destino publicada', () => {
  it('integra los commits del remoto antes de fusionar la feature', async () => {
    const fx = mergeFixture('base');
    const remoteSha = pushRemoteCommit(fx, 'otra-task.txt', 'otra\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^1')).toBe(remoteSha);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'feature/0001'));
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
  });

  it('regenera estimation-log.md cuando es el único conflicto', async () => {
    const fx = mergeFixture('log');
    const feature = join(fx.wt, '0001');
    writePatchSpec(feature, '0001');
    saveAll(feature, 'docs: cierre del patch 0001');
    writePatchSpec(fx.seed, '0003');
    saveAll(fx.seed, 'docs: cierre del patch 0003');
    git(fx.seed, 'push', '-q', fx.remote, 'develop');

    const result = await runMerge(feature, ['--push']);

    expect(result.code, result.text).toBe(0);
    const log = fileAt(fx.repo, '.docs/sdd/estimation-log.md');
    expect(log).toMatch(/^<!-- AUTO-GENERADO/);
    expect(log).toContain('patch-0001-fixture');
    expect(log).toContain('patch-0003-fixture');
    expect(log).not.toContain('<<<<<<<');
  });

  it('une las filas y líneas que dos ramas añaden a los registros', async () => {
    const fx = mergeFixture('registros');
    for (const id of ['0001', '0002']) {
      const feature = join(fx.wt, id);
      edit(feature, '.docs/sdd/roadmap.md', '| 0100 | base |', `| 0100 | base |\n| ${id} | fila ${id} |`);
      edit(feature, '.docs/sdd/changelog.md', '- base', `- base\n- línea ${id}`);
      writePatchSpec(feature, id);
      saveAll(feature, `docs: cierre del patch ${id}`);
    }

    const first = await runMerge(join(fx.wt, '0001'), ['--push']);
    const second = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(first.code, first.text).toBe(0);
    expect(second.code, second.text).toBe(0);
    const roadmap = fileAt(fx.repo, '.docs/sdd/roadmap.md');
    expect(roadmap).toMatch(/\| 0100 \| base \|\n\| 0001 \| fila 0001 \|\n\| 0002 \| fila 0002 \|\n\n## Deuda/);
    const changelog = fileAt(fx.repo, '.docs/sdd/changelog.md');
    expect(changelog).toMatch(/- base\n- línea 0001\n- línea 0002\n\n## \[0\.1\.0\]/);
    const log = fileAt(fx.repo, '.docs/sdd/estimation-log.md');
    expect(log).toContain('patch-0001-fixture');
    expect(log).toContain('patch-0002-fixture');
    expect(`${roadmap}${changelog}${log}`).not.toMatch(/<<<<<<<|>>>>>>>/);
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
  });

  it('si las dos ramas cambian la misma fila de un registro falla con merge: conflicto en', async () => {
    const fx = mergeFixture('misma-fila');
    for (const id of ['0001', '0002']) {
      edit(join(fx.wt, id), '.docs/sdd/roadmap.md', '| 0100 | base |', `| 0100 | cambiada por ${id} |`);
      saveAll(join(fx.wt, id), `docs: fila de ${id}`);
    }
    await runMerge(join(fx.wt, '0001'), ['--push']);
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code).not.toBe(0);
    expect(result.text).toMatch(/merge: conflicto en .*roadmap\.md/);
    expect(sha(fx.repo, 'develop')).toBe(before);
    expect(sha(fx.remote, 'develop')).toBe(before);
  });

  it('con otro conflicto falla con la lista de ficheros y deja develop en la base integrada', async () => {
    const fx = mergeFixture('conflicto');
    const remoteSha = pushRemoteCommit(fx, 'README.md', 'remoto\n');
    const feature = join(fx.wt, '0001');
    write(feature, 'README.md', 'feature\n');
    saveAll(feature, 'feat: README de la feature');

    const result = await runMerge(feature, ['--push']);

    expect(result.code).not.toBe(0);
    expect(result.text).toContain('README.md');
    expect(sha(fx.repo, 'develop')).toBe(remoteSha);
    expect(sha(fx.remote, 'develop')).toBe(remoteSha);
    expect(cleanedUp(fx)).toBe(true);
  });
});
