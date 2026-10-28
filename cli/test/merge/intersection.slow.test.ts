import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { delimiter, dirname, join } from 'node:path';
import { resolveCommand } from '../../src/tasks/command.ts';
import { git, mergeFixture, publishScript, pushRemoteCommit, runMerge, saveAll, sha, write, type Fixture } from './helpers.ts';

// Sin MSYSTEM, como fuera de Git Bash: con él, el git.exe de Git\cmd no añade mingw64 al PATH de sus hijos.
function withPath<T>(dirs: string[], body: () => Promise<T>): Promise<T> {
  const { PATH: saved, MSYSTEM: msystem } = process.env;
  process.env.PATH = dirs.join(delimiter);
  delete process.env.MSYSTEM;
  return body().finally(() => {
    process.env.PATH = saved;
    if (msystem !== undefined) process.env.MSYSTEM = msystem;
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

const GATE = 'moon run :test --affected --base develop';
const ORDER = 'fusiona el hotfix del login en main';

const moonYml = `tasks:
  test:
    command: 'node'
    args: ['check.mjs']
    inputs: ['**/*']
    toolchains: ['system']
    options:
      shell: false
      cache: false
`;

const checkScript = (root: string, project: string) => `import { appendFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const root = ${JSON.stringify(root)};
appendFileSync(root + '/ran-${project}.txt', 'x\\n');
if (existsSync('fail.txt')) process.exit(1);
if (existsSync(root + '/publish-once.mjs')) {
  execFileSync(process.execPath, [root + '/publish-once.mjs'], { stdio: 'ignore' });
  rmSync(root + '/publish-once.mjs');
}
`;

interface MoonFixture extends Fixture {
  branch: string;
}

function seedMoon(fx: Fixture): void {
  const root = fx.root.replaceAll('\\', '/');
  write(fx.seed, '.moon/workspace.yml', "projects:\n  frontend: 'apps/frontend'\n  backend: 'apps/backend'\n");
  write(fx.seed, '.gitignore', '.moon/cache/\n');
  for (const project of ['frontend', 'backend']) {
    write(fx.seed, `apps/${project}/moon.yml`, moonYml);
    write(fx.seed, `apps/${project}/check.mjs`, checkScript(root, project));
    write(fx.seed, `apps/${project}/a.txt`, 'base\n');
  }
  saveAll(fx.seed, 'chore: workspace de moon');
  git(fx.seed, 'push', '-q', fx.remote, 'develop');
  git(fx.repo, 'fetch', '-q', 'origin');
  git(fx.repo, 'branch', '-f', 'develop', 'origin/develop');
}

function moonFixture(name: string): MoonFixture {
  const fx = mergeFixture(name);
  seedMoon(fx);
  const branch = join(fx.wt, '0003');
  git(fx.repo, 'worktree', 'add', '-q', '-b', 'feature/0003', branch, 'origin/develop');
  write(branch, 'apps/frontend/a.txt', 'rama\n');
  saveAll(branch, 'feat: frontend');
  return { ...fx, branch };
}

const ran = (fx: Fixture, project: string) => (existsSync(join(fx.root, `ran-${project}.txt`)) ? readFileSync(join(fx.root, `ran-${project}.txt`), 'utf8').split('\n').filter(Boolean).length : 0);
const tip = (fx: MoonFixture) => sha(fx.branch, 'HEAD');

describe('merge --verify cruza con la base', () => {
  it('skips when the base does not touch the branch inputs', async () => {
    const fx = moonFixture('cruce-nada');
    const verified = tip(fx);
    pushRemoteCommit(fx, 'apps/backend/a.txt', 'remoto\n');

    const result = await runMerge(fx.branch, ['--verify', GATE, '--verified-at', verified]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain('verificación: frontend:test: saltada (la base no toca sus inputs)');
    expect(result.text).toContain('verificación: backend:test: saltada (solo la toca la base)');
    expect([ran(fx, 'frontend'), ran(fx, 'backend')]).toEqual([0, 0]);
  });

  it('runs the task both sides touch', async () => {
    const fx = moonFixture('cruce-frontend');
    const verified = tip(fx);
    pushRemoteCommit(fx, 'apps/backend/a.txt', 'remoto\n');
    pushRemoteCommit(fx, 'apps/frontend/b.txt', 'remoto\n');

    const result = await runMerge(fx.branch, ['--verify', GATE, '--verified-at', verified]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain('verificación: corre frontend:test (las tocan la rama y la base)');
    expect([ran(fx, 'frontend'), ran(fx, 'backend')]).toEqual([1, 0]);
  });

  it('runs a branch commit after verified-at', async () => {
    const fx = moonFixture('cruce-posterior');
    const verified = tip(fx);
    write(fx.branch, 'apps/frontend/c.txt', 'después\n');
    saveAll(fx.branch, 'feat: después de verificar');
    pushRemoteCommit(fx, 'apps/backend/a.txt', 'remoto\n');

    const result = await runMerge(fx.branch, ['--verify', GATE, '--verified-at', verified]);

    expect(result.code, result.text).toBe(0);
    expect([ran(fx, 'frontend'), ran(fx, 'backend')]).toEqual([1, 0]);
  });

  it('runs the branch without verified-at', async () => {
    const fx = moonFixture('cruce-sin-verificado');
    pushRemoteCommit(fx, 'apps/backend/a.txt', 'remoto\n');

    const result = await runMerge(fx.branch, ['--verify', GATE]);

    expect(result.code, result.text).toBe(0);
    expect([ran(fx, 'frontend'), ran(fx, 'backend')]).toEqual([1, 0]);
  });

  it('crosses again on a push retry', async () => {
    const fx = moonFixture('cruce-reintento');
    const verified = tip(fx);
    pushRemoteCommit(fx, 'apps/frontend/b.txt', 'remoto\n');
    writeFileSync(join(fx.root, 'publish-once.mjs'), publishScript(fx, 'apps/backend/c.txt', false));

    const result = await runMerge(fx.branch, ['--push', '--verify', GATE, '--verified-at', verified]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("push: 'develop' avanzó en 'origin'; integro y reintento (2/3)");
    expect(result.text).toContain('verificación: frontend:test: saltada (la base no toca sus inputs)');
    expect(ran(fx, 'frontend')).toBe(1);
  });

  it('contrasts the crossed targets on the base', async () => {
    const fx = moonFixture('cruce-contraste');
    write(fx.branch, 'apps/frontend/fail.txt', 'rojo\n');
    saveAll(fx.branch, 'feat: rompe frontend');
    const verified = tip(fx);
    pushRemoteCommit(fx, 'apps/frontend/b.txt', 'remoto\n');

    const result = await runMerge(fx.branch, ['--verify', GATE, '--verified-at', verified]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: en verde: el rojo lo trae la rama');
    expect([ran(fx, 'frontend'), ran(fx, 'backend')]).toEqual([2, 0]);
  });

  it('falls back to the branch when moon query fails', async () => {
    const fx = moonFixture('cruce-sin-moon');
    const verified = tip(fx);
    pushRemoteCommit(fx, 'apps/backend/a.txt', 'remoto\n');

    const result = await withPath([dirname(process.execPath), toolDir('git')], () => runMerge(fx.branch, ['--verify', GATE, '--verified-at', verified]));

    expect(result.text).toContain('verificación: sin cruce: moon query falló');
    expect(result.text).toContain("verificación: no se encuentra 'moon' en el PATH");
  });

  it('crosses on a hotfix', async () => {
    const fx = mergeFixture('cruce-hotfix');
    seedMoon(fx);
    git(fx.repo, 'branch', 'main', 'develop');
    git(fx.repo, 'push', '-q', 'origin', 'main');
    const hotfix = join(fx.wt, 'hotfix');
    git(fx.repo, 'worktree', 'add', '-q', '-b', 'hotfix/0200-fix', hotfix, 'main');
    write(hotfix, 'apps/frontend/a.txt', 'arreglo\n');
    saveAll(hotfix, 'fix: frontend');
    const verified = sha(hotfix, 'HEAD');
    pushRemoteCommit(fx, 'apps/backend/a.txt', 'develop\n');

    const result = await runMerge(hotfix, ['--into', 'main', '--order', ORDER, '--verify', GATE, '--verified-at', verified]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain('verificación: backend:test: saltada (solo la toca la base)');
    expect([ran(fx, 'frontend'), ran(fx, 'backend')]).toEqual([0, 0]);
  });
});
