import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { failGate, git, mergeFixture, pushRemoteCommit, runMerge, saveAll, sha, write } from './helpers.ts';

describe('la suite no se repite si desde el commit verificado solo cambian docs', () => {
  it('omite la verificación si desde el sha solo cambian docs', async () => {
    const fx = mergeFixture('verificado-docs');
    const verified = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, '.docs/sdd/notas.md', 'solo docs\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', failGate, '--verified-at', verified]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain(`verificación: omitida: desde ${git(fx.repo, 'rev-parse', '--short', verified)} solo cambian docs`);
    expect(sha(fx.repo, 'develop^2')).toBe(verified);
  });

  it('verifica si desde el sha cambió código de la base', async () => {
    const fx = mergeFixture('verificado-codigo');
    const verified = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, 'src.txt', 'código\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', failGate, '--verified-at', verified]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: código de salida 1');
    expect(result.text).not.toContain('omitida');
  });

  it('verifica si desde el sha la rama cambió código', async () => {
    const fx = mergeFixture('verificado-rama');
    const verified = sha(fx.repo, 'feature/0001');
    write(join(fx.wt, '0001'), 'src.txt', 'código de la rama\n');
    saveAll(join(fx.wt, '0001'), 'feat: más código');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', failGate, '--verified-at', verified]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: código de salida 1');
  });

  it('verifica si el sha es de otra rama', async () => {
    const fx = mergeFixture('verificado-otra-rama');
    const other = sha(fx.repo, 'feature/0002');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', failGate, '--verified-at', other]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: código de salida 1');
    expect(result.text).not.toContain('omitida');
  });

  it('un --verified-at que no es un commit sale con 2 sin coger el cerrojo', async () => {
    const fx = mergeFixture('verificado-nada');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', 'node -e 0', '--verified-at', 'nada']);

    expect(result.code).toBe(2);
    expect(result.text).toContain("--verified-at: 'nada' no es un commit");
    expect(existsSync(fx.lock)).toBe(false);
    expect(sha(fx.repo, 'develop')).toBe(before);
  });
});
