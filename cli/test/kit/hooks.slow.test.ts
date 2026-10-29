import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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

describe('hooks de git en Node', () => {
  const hooks = ['.githooks/pre-commit', '.githooks/pre-merge-commit', 'tests/batteries/sdd-debugging/mold-hook/.githooks/pre-commit'];

  it.each(hooks)('%s empieza por #!/usr/bin/env node', (hook) => {
    expect(readFileSync(join(kitRoot, hook), 'utf8').split('\n', 1)[0]).toBe('#!/usr/bin/env node');
  });

  // Git for Windows lanza el hook con su sh, que resuelve la primera línea: si no supiera, el commit pasaría sin el hook.
  it('git lanza un hook cuya primera línea es #!/usr/bin/env node', () => {
    const repo = mkdtempSync(join(tmpdir(), 'node-hook-'));
    try {
      run('git', ['init', '-q', repo]);
      mkdirSync(join(repo, '.githooks'));
      writeFileSync(join(repo, '.githooks', 'pre-commit'), "#!/usr/bin/env node\nconsole.error('hook de node'); process.exit(1);\n", { mode: 0o755 });
      run('git', ['-C', repo, 'config', 'core.hooksPath', '.githooks']);
      const commit = run('git', ['-C', repo, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'x']);
      expect(commit.output).toContain('hook de node');
      expect(commit.code).not.toBe(0);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
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
