import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kitRoot, run } from './process.ts';

describe('hooks/hooks.json', () => {
  const config = JSON.parse(readFileSync(join(kitRoot, 'hooks', 'hooks.json'), 'utf8'));
  const hook = config.hooks.SessionStart[0].hooks[0];

  it('declara un hook SessionStart que ejecuta la CLI en forma exec', () => {
    expect(hook.command).toBe('node');
    expect(hook.args).toEqual(['${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js', 'hook', 'session-start']);
  });

  it('no declara shell', () => {
    expect(Object.keys(hook)).not.toContain('shell');
  });
});

describe('.githooks/pre-merge-commit', () => {
  const mergeHook = join(kitRoot, '.githooks', 'pre-merge-commit');

  it('existe, porque git no ejecuta pre-commit en un merge sin conflictos', () => {
    expect(existsSync(mergeHook)).toBe(true);
  });

  it('es ejecutable en git', (context) => {
    if (run('git', ['-C', kitRoot, 'rev-parse', '--git-dir']).code !== 0) context.skip('la raíz del kit no es un repositorio git');
    expect(run('git', ['-C', kitRoot, 'ls-files', '-s', '.githooks/pre-merge-commit']).output).toMatch(/^100755 /);
  });

  it('delega en pre-commit en vez de duplicar la suite', () => {
    const content = readFileSync(mergeHook, 'utf8');
    expect(content).toMatch(/pre-commit/);
    expect(content).not.toMatch(/Invoke-Pester/);
  });
});
