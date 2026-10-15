import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { git, mergeFixture, pushRemoteCommit, runMerge, sha } from './helpers.ts';

describe('la suite no se repite si desde el commit verificado solo cambian docs', () => {
  it('omite la verificación si desde el sha solo cambian docs', async () => {
    const fx = mergeFixture('verificado-docs');
    const verified = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, '.docs/sdd/notas.md', 'solo docs\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', 'exit 1', '--verified-at', verified]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain(`verificación: omitida: desde ${git(fx.repo, 'rev-parse', '--short', verified)} solo cambian docs`);
    expect(sha(fx.repo, 'develop^2')).toBe(verified);
  });

  it('verifica si desde el sha cambió código de la base', async () => {
    const fx = mergeFixture('verificado-codigo');
    const verified = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, 'src.txt', 'código\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', 'exit 1', '--verified-at', verified]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: código de salida 1');
    expect(result.text).not.toContain('omitida');
  });

  it('un --verified-at que no es un commit sale con 2 sin coger el cerrojo', async () => {
    const fx = mergeFixture('verificado-nada');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', 'exit 0', '--verified-at', 'nada']);

    expect(result.code).toBe(2);
    expect(result.text).toContain("--verified-at: 'nada' no es un commit");
    expect(existsSync(fx.lock)).toBe(false);
    expect(sha(fx.repo, 'develop')).toBe(before);
  });
});
