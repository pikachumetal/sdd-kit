import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { resolveCommand } from '../../src/tasks/command.ts';
import { mergeFixture, runMerge } from './helpers.ts';

function withPath<T>(dirs: string[], body: () => Promise<T>): Promise<T> {
  const saved = process.env.PATH;
  process.env.PATH = dirs.join(delimiter);
  return body().finally(() => {
    process.env.PATH = saved;
  });
}

const toolDir = (tool: string) => dirname(resolveCommand(tool) ?? tool);

describe('merge --verify sin shell', () => {
  it('runs the gate with a PATH without pwsh', async () => {
    const fx = mergeFixture('sin-shell');
    const dirs = [dirname(process.execPath), toolDir('git')];
    const marker = join(fx.root, 'ran.txt').replaceAll('\\', '/');

    const result = await withPath(dirs, () => runMerge(join(fx.wt, '0001'), ['--verify', `node -e "require('fs').writeFileSync('${marker}','x')"`]));

    expect(result.code, result.text).toBe(0);
    expect(existsSync(marker)).toBe(true);
  });

  it('rejects a chained gate before the lock', async () => {
    const fx = mergeFixture('encadenado');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', 'node -e 1 && node -e 2']);

    expect(result.code).toBe(2);
    expect(result.text).toContain("encadena comandos con '&&'");
    expect(existsSync(fx.lock)).toBe(false);
  });

  it('names a missing program', async () => {
    const fx = mergeFixture('sin-programa');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', 'no-existe-xyz']);

    expect(result.code).not.toBe(0);
    expect(result.text).toContain("verificación: no se encuentra 'no-existe-xyz' en el PATH");
  });
});
