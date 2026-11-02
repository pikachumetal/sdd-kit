import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { withoutMoonTask } from '../../src/merge/affected.ts';
import { cleanGitEnv, kitRoot, run } from './process.ts';

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

// El gate imita al test del incidente: crea un repo y commitea en él sin limpiar el entorno.
const GATE_WITH_GIT_INIT = (child: string): string => `
const { execFileSync } = require('node:child_process');
const child = ${JSON.stringify(child)};
const git = (...args) => execFileSync('git', ['-C', child, '-c', 'user.name=g', '-c', 'user.email=g@g', ...args], { stdio: 'ignore' });
execFileSync('git', ['init', '-q', child], { stdio: 'ignore' });
git('checkout', '-q', '-b', 'feature/1');
git('commit', '-q', '--allow-empty', '-m', 'ajeno');
`;

describe('.githooks/pre-commit y el entorno de git', () => {
  const shell = 'taskOptions:\n  shell: false\n';
  const noop = 'command: node\n    args: [--version]\n    options:\n      cache: false';
  const tmp = mkdtempSync(join(tmpdir(), 'pre-commit-env-'));
  const hookEnv = withoutMoonTask(cleanGitEnv);
  const gitIn = (dir: string, ...args: string[]) => run('git', ['-C', dir, '-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { env: hookEnv });

  afterAll(() => rmSync(tmp, { recursive: true, force: true }));

  // Un worktree enlazado, como el del incidente: ahí git exporta a sus hooks el GIT_DIR absoluto.
  function newWorktree(name: string, gate: string): { common: string; worktree: string } {
    const common = join(tmp, name);
    const worktree = join(tmp, `${name}-wt`);
    mkdirSync(join(common, '.moon'), { recursive: true });
    mkdirSync(join(common, '.githooks'));
    mkdirSync(join(common, 'cli'));
    copyFileSync(join(kitRoot, '.githooks', 'pre-commit'), join(common, '.githooks', 'pre-commit'));
    writeFileSync(join(common, '.gitignore'), '.moon/cache\n');
    writeFileSync(join(common, '.moon', 'workspace.yml'), 'projects:\n  cli: cli\n  kit: .\nvcs:\n  client: git\n  defaultBranch: main\n');
    writeFileSync(join(common, 'moon.yml'), `${shell}tasks:\n  roadmap:\n    ${noop}\n`);
    writeFileSync(join(common, 'cli', 'gate.cjs'), gate);
    writeFileSync(join(common, 'cli', 'moon.yml'), `${shell}tasks:\n  typecheck:\n    ${noop}\n  test:\n    command: node\n    args: [gate.cjs]\n    options:\n      cache: false\n`);
    run('git', ['init', '-q', '-b', 'main', common], { env: hookEnv });
    gitIn(common, 'add', '.');
    gitIn(common, 'commit', '-q', '-m', 'base');
    gitIn(common, 'config', 'core.hooksPath', '.githooks');
    gitIn(common, 'worktree', 'add', '-q', '-b', 'work', worktree);
    return { common, worktree };
  }

  it('un gate cuyo hijo hace git init sin limpiar el entorno no toca el repo común', () => {
    const child = join(tmp, 'child');
    const { common, worktree } = newWorktree('dirty-gate', GATE_WITH_GIT_INIT(child));
    const before = gitIn(common, 'rev-parse', 'main', 'work').output;

    const commit = gitIn(worktree, 'commit', '--allow-empty', '-m', 'propio');

    expect(gitIn(common, 'config', 'core.bare').output).toBe('false');
    expect(gitIn(common, 'for-each-ref', '--format=%(refname:short)', 'refs/heads').output.split(/\r?\n/)).toEqual(['main', 'work']);
    expect(gitIn(common, 'log', '--format=%s', `${before.split(/\r?\n/)[1]}..work`).output).toBe('propio');
    expect(gitIn(common, 'rev-parse', 'main').output).toBe(before.split(/\r?\n/)[0]);
    expect(commit.code, commit.output).toBe(0);
    expect(gitIn(child, 'log', '--format=%s', 'feature/1').output).toBe('ajeno');
  });

  it('un commit normal sigue pasando el gate', () => {
    const { worktree } = newWorktree('clean-gate', '');

    const commit = gitIn(worktree, 'commit', '--allow-empty', '-m', 'propio');

    expect(commit.code, commit.output).toBe(0);
    expect(gitIn(worktree, 'log', '-1', '--format=%s').output).toBe('propio');
  });

  it('un gate en rojo sigue bloqueando el commit', () => {
    const { worktree } = newWorktree('red-gate', 'process.exit(1);\n');

    const commit = gitIn(worktree, 'commit', '--allow-empty', '-m', 'propio');

    expect(commit.code).not.toBe(0);
    expect(gitIn(worktree, 'log', '-1', '--format=%s').output).toBe('base');
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
