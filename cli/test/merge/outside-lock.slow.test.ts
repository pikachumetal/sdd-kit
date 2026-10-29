import { describe, it, expect } from 'vitest';
import { chmodSync, existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { edit, git, localCommit, mergeFixture, nodeGate, publishScript, pushRemoteCommit, runMerge, saveAll, sha, write, type Fixture } from './helpers.ts';

interface Pass {
  lock: boolean;
  cwd: string;
  head: string;
}

const passesFile = (fx: Fixture) => join(fx.root, 'pasadas.jsonl');

function passes(fx: Fixture): Pass[] {
  if (!existsSync(passesFile(fx))) return [];
  return readFileSync(passesFile(fx), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line) as Pass);
}

// Anota cada pasada (cerrojo de merge, cwd y HEAD), corre `extra` y sale con `exitCode`, o con 1 si el cerrojo estaba cogido.
function recordingGate(fx: Fixture, { exitCode = 0, extra = '' }: { exitCode?: number; extra?: string } = {}): string {
  const [log, lock] = [passesFile(fx), fx.lock].map((path) => JSON.stringify(path));
  return nodeGate(fx.root, `import { appendFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const lock = existsSync(${lock});
const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
appendFileSync(${log}, JSON.stringify({ lock, cwd: process.cwd(), head }) + '\\n');
${extra}
process.exit(lock ? 1 : ${exitCode});
`);
}

const publishing = (fx: Fixture, file: string, once: boolean) => `await import(${JSON.stringify(`file:///${writePublisher(fx, file, once).replaceAll('\\', '/')}`)});`;

let publishers = 0;

function writePublisher(fx: Fixture, file: string, once: boolean): string {
  const path = join(fx.root, `publica-${++publishers}.mjs`);
  writeFileSync(path, publishScript(fx, file, once));
  return path;
}

const real = (path: string) => realpathSync.native(path);

// El remoto rechaza los `moves` primeros push y, en cada uno, mueve develop a un commit nuevo de otra sesión.
function movingRemote(fx: Fixture, moves: number): string[] {
  git(fx.seed, 'checkout', '-q', '-b', 'queue', 'develop');
  const commits = Array.from({ length: moves }, (_, index) => {
    write(fx.seed, `src/q${index}.ts`, 'cola\n');
    saveAll(fx.seed, `chore: otra sesión ${index}`);
    return sha(fx.seed, 'queue');
  });
  git(fx.seed, 'push', '-q', fx.remote, 'queue');
  git(fx.seed, 'checkout', '-q', 'develop');
  const counter = join(fx.root, 'push-count').replaceAll('\\', '/');
  const cases = commits.map((commit, index) => `${index + 1}) s=${commit};;`).join(' ');
  const hook = `#!/bin/sh\nn=$(cat "${counter}" 2>/dev/null || echo 0)\nn=$((n+1))\necho $n > "${counter}"\ncase $n in ${cases} *) exit 0;; esac\nunset GIT_QUARANTINE_PATH\ngit update-ref refs/heads/develop $s\nexit 1\n`;
  const hooks = join(fx.root, 'move-hooks');
  write(hooks, 'pre-receive', hook);
  chmodSync(join(hooks, 'pre-receive'), 0o755);
  git(fx.remote, 'config', 'core.hooksPath', hooks);
  return commits;
}

const waitUntil = async (done: () => boolean, label: string) => {
  for (let tries = 0; !done(); tries++) {
    if (tries === 600) throw new Error(`no llegó: ${label}`);
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
};

describe('la verificación del merge corre fuera del cerrojo de merge', () => {
  it('verifica en el worktree de la rama sin el cerrojo de merge', async () => {
    const fx = mergeFixture('fuera-cerrojo');
    pushRemoteCommit(fx, 'src/a.ts', 'x\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx)]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("base: integrada 'origin/develop' en 'feature/0001':");
    expect(passes(fx).map((pass) => [pass.lock, real(pass.cwd)])).toEqual([[false, real(join(fx.wt, '0001'))]]);
    git(fx.repo, 'merge-base', '--is-ancestor', 'feature/0001', 'develop');
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
  });

  it('integra también la develop local con commits sin publicar', async () => {
    const fx = mergeFixture('develop-local');
    localCommit(fx, 'develop', 'chore: local');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx)]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("base: integrada 'develop' en 'feature/0001':");
  });

  it('si develop cambia durante la verificación vuelve a verificar y publica', async () => {
    const fx = mergeFixture('cambia');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx, { extra: publishing(fx, 'b.ts', true) })]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("merge: 'develop' cambió durante la verificación; integro y verifico lo que se cruza (2/3)");
    expect(passes(fx).map((pass) => pass.lock)).toEqual([false, false]);
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
  });

  it('con un cambio solo de docs durante la verificación publica sin otro intento', async () => {
    const fx = mergeFixture('cambia-docs');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx, { extra: publishing(fx, 'notas.md', true) })]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).not.toContain('(2/3)');
    expect(passes(fx)).toHaveLength(1);
  });

  it('tras tres intentos con develop cambiando falla y deja las dos ramas como estaban', async () => {
    const fx = mergeFixture('cambia-siempre');
    const branch = sha(fx.repo, 'feature/0001');

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx, { extra: publishing(fx, 'b.ts', false) })]);

    expect(result.code).toBe(1);
    expect(result.text).toContain("merge: 'develop' sigue cambiando tras 3 intentos; relanza el merge en un rato");
    expect(sha(fx.repo, 'feature/0001')).toBe(branch);
    for (const repo of [fx.repo, fx.remote]) expect(git(repo, 'branch', '--contains', branch)).not.toContain('develop');
  });

  it('el push que encuentra el remoto movido repite fuera del cerrojo', async () => {
    const fx = mergeFixture('push-movido');
    const [queue] = movingRemote(fx, 1);

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx)]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("push: 'develop' avanzó en 'origin'; integro y reintento (2/3)");
    expect(passes(fx).map((pass) => pass.lock)).toEqual([false, false]);
    git(fx.repo, 'merge-base', '--is-ancestor', queue, 'develop');
  });

  it('con cambios sin commitear en la rama sale con 1 sin tocar nada', async () => {
    const fx = mergeFixture('rama-sucia');
    const develop = sha(fx.repo, 'develop');
    edit(join(fx.wt, '0001'), 'feature-0001.txt', '0001', 'sucio');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', recordingGate(fx)]);

    expect(result.code).toBe(1);
    expect(result.text).toContain("base: 'feature/0001' tiene cambios sin commitear; commitéalos antes de integrar la base");
    expect(existsSync(fx.lock)).toBe(false);
    expect(passes(fx)).toEqual([]);
    expect(sha(fx.repo, 'develop')).toBe(develop);
  });

  it('--verify con --branch de otra rama sale con 2', async () => {
    const fx = mergeFixture('otra-rama');

    const result = await runMerge(join(fx.wt, '0001'), ['--branch', 'feature/0002', '--verify', recordingGate(fx)]);

    expect(result.code).toBe(2);
    expect(result.text).toContain(`--verify corre en el worktree de la rama; 'feature/0002' no está sacada en '${real(join(fx.wt, '0001'))}'`);
    expect(existsSync(fx.lock)).toBe(false);
  });

  it('sin --verify no integra en la rama', async () => {
    const fx = mergeFixture('sin-verify');
    const branch = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, 'src/a.ts', 'x\n');

    const result = await runMerge(join(fx.wt, '0001'));

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'feature/0001')).toBe(branch);
  });

  it('con la verificación en rojo la rama vuelve a su commit y el contraste corre sin cerrojo en la base', async () => {
    const fx = mergeFixture('rojo-contraste');
    const branch = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, 'src/a.ts', 'x\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', recordingGate(fx, { exitCode: 1 })]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: en rojo');
    expect(passes(fx).map((pass) => pass.lock)).toEqual([false, false]);
    expect(passes(fx)[1].head).toBe(sha(fx.remote, 'develop'));
    expect(sha(fx.repo, 'feature/0001')).toBe(branch);
    expect(git(join(fx.wt, '0001'), 'branch', '--show-current')).toBe('feature/0001');
  });

  it('un hook en rojo al integrar en la rama deja la rama como estaba', async () => {
    const fx = mergeFixture('hook-rama');
    const branch = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, 'src/a.ts', 'x\n');
    const hooks = join(fx.root, 'red-hooks');
    write(hooks, 'pre-merge-commit', '#!/bin/sh\necho hook rojo\nexit 1\n');
    chmodSync(join(hooks, 'pre-merge-commit'), 0o755);
    git(fx.repo, 'config', 'core.hooksPath', hooks);

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', recordingGate(fx)]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: el hook rechazó el merge.');
    expect(sha(fx.repo, 'feature/0001')).toBe(branch);
    expect(passes(fx)).toEqual([]);
  });

  it('un conflicto al integrar la base en la rama deja la rama como estaba, sin MERGE_HEAD', async () => {
    const fx = mergeFixture('conflicto-rama');
    const branch = sha(fx.repo, 'feature/0001');
    pushRemoteCommit(fx, 'feature-0001.txt', 'otro contenido\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', recordingGate(fx)]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: conflicto en feature-0001.txt');
    expect(sha(fx.repo, 'feature/0001')).toBe(branch);
    expect(existsSync(join(fx.repo, 'worktrees', '0001', 'MERGE_HEAD'))).toBe(false);
    expect(git(join(fx.wt, '0001'), 'status', '--porcelain')).toBe('');
    expect(passes(fx)).toEqual([]);
  });

  it('con la base ya en la rama no hay commit de integración', async () => {
    const fx = mergeFixture('al-dia');
    const branch = sha(fx.repo, 'feature/0001');

    const result = await runMerge(join(fx.wt, '0001'), ['--verify', recordingGate(fx)]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).not.toContain('base: integrada');
    expect(sha(fx.repo, 'feature/0001')).toBe(branch);
  });

  it('tras tres push con el remoto movido falla con el literal del push y sin publicar', async () => {
    const fx = mergeFixture('push-siempre');
    const branch = sha(fx.repo, 'feature/0001');
    movingRemote(fx, 3);

    const result = await runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx)]);

    expect(result.code).toBe(1);
    expect(result.text).toContain("push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato");
    expect(git(fx.remote, 'branch', '--contains', branch)).not.toContain('develop');
    expect(sha(fx.repo, 'feature/0001')).toBe(branch);
  });

  it('sin --verify, tras tres push con el remoto movido falla con el literal del push', async () => {
    const fx = mergeFixture('push-siempre-sin-verify');
    const branch = sha(fx.repo, 'feature/0001');
    movingRemote(fx, 3);

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code).toBe(1);
    expect(result.text).toContain("push: 'develop' avanzó en 'origin'; integro y reintento (3/3)");
    expect(result.text).toContain("push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato");
    expect(git(fx.remote, 'branch', '--contains', branch)).not.toContain('develop');
  });

  it('si la base no se puede sacar para el contraste, no da veredicto de base y la rama sigue sacada', async () => {
    const fx = mergeFixture('contraste-imposible');
    const wt = join(fx.wt, '0001');
    git(wt, 'rm', '-q', 'README.md');
    saveAll(wt, 'chore: quita README');
    const readme = JSON.stringify(join(wt, 'README.md'));

    const result = await runMerge(wt, ['--verify', recordingGate(fx, { exitCode: 1, extra: `(await import('node:fs')).writeFileSync(${readme}, 'local');` })]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: código de salida 1');
    expect(result.text).not.toContain('base: en');
    expect(passes(fx)).toHaveLength(1);
    expect(git(wt, 'branch', '--show-current')).toBe('feature/0001');
  });
});

describe('dos cierres a la vez no se esperan con un cerrojo cogido', () => {
  it('el segundo fusiona mientras el primero verifica, y el primero verifica de nuevo lo que se cruza', async () => {
    const fx = mergeFixture('a-la-vez');
    const go = join(fx.root, 'adelante').replaceAll('\\', '/');
    const waiting = `while (!existsSync(${JSON.stringify(go)})) await new Promise((done) => setTimeout(done, 100));`;
    let firstDone = false;

    const first = runMerge(join(fx.wt, '0001'), ['--push', '--verify', recordingGate(fx, { extra: waiting })]).finally(() => (firstDone = true));
    await waitUntil(() => passes(fx).length > 0, 'la primera verificación');
    const second = await runMerge(join(fx.wt, '0002'), ['--push']);
    const secondFinishedFirst = !firstDone;
    writeFileSync(go, '');
    const firstResult = await first;

    expect(second.code, second.text).toBe(0);
    expect(secondFinishedFirst).toBe(true);
    expect(firstResult.code, firstResult.text).toBe(0);
    expect(firstResult.text).toContain("merge: 'develop' cambió durante la verificación; integro y verifico lo que se cruza (2/3)");
    expect(passes(fx).map((pass) => pass.lock)).toEqual([false, false]);
    ['feature/0001', 'feature/0002'].forEach((branch) => git(fx.repo, 'merge-base', '--is-ancestor', branch, 'develop'));
  });
});
