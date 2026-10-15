import { describe, it, expect } from 'vitest';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { cleanedUp, isWindows, mergeFixture, runMerge, sha } from './helpers.ts';

const failsIfExists = (file: string) => (isWindows ? `if (Test-Path ${file}) { exit 1 }` : `if [ -f ${file} ]; then exit 1; fi`);

describe('un merge del cierre que falla en la verificación dice si la base también falla', () => {
  it('con la base también en rojo lo dice', async () => {
    const fx = mergeFixture('base-roja');
    const before = sha(fx.repo, 'develop');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', failsIfExists('README.md')]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: código de salida 1');
    const baseLog = /base: en rojo: el mismo comando también falla sin la rama \(salida en (\S+)\); mira la deuda del proyecto antes de investigar/.exec(result.text)?.[1];
    expect(baseLog, result.text).toBeDefined();
    expect(existsSync(baseLog ?? '')).toBe(true);
    rmSync(baseLog ?? '', { force: true });
    expect(sha(fx.repo, 'develop')).toBe(before);
    expect(cleanedUp(fx)).toBe(true);
  });

  it('con la base en verde dice que el rojo es de la rama', async () => {
    const fx = mergeFixture('base-verde');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', failsIfExists('feature-0001.txt')]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: en verde: el rojo lo trae la rama');
  });

  it('tras un bloqueado no repite la suite en la base', async () => {
    const fx = mergeFixture('base-bloqueado');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', "echo \"Error: EBUSY: resource busy or locked, unlink 'dist/app.js'\"; exit 1"]);

    expect(result.code).toBe(1);
    expect(result.text).toContain("bloqueado: 'dist/app.js' lo tiene abierto otro proceso");
    expect(result.text).not.toContain('base:');
  });
});
