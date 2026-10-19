import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { edit, git, isWindows, mergeFixture, publishFromSeed, runMerge, saveAll, sha, write, type Fixture } from './helpers.ts';

const ORDER = 'fusiona el hotfix del login en main';
const failsIfExists = (file: string) => (isWindows ? `if (Test-Path ${file}) { exit 1 }` : `if [ -f ${file} ]; then exit 1; fi`);
const slash = (text: string) => text.replaceAll('\\', '/');

function hotfixFixture(name: string, branch = 'hotfix/0200-fix'): Fixture & { hotfix: string } {
  const fx = mergeFixture(name);
  git(fx.repo, 'branch', 'main', 'develop');
  git(fx.repo, 'push', '-q', 'origin', 'main');
  const hotfix = join(fx.wt, 'hotfix');
  git(fx.repo, 'worktree', 'add', '-q', '-b', branch, hotfix, 'main');
  write(hotfix, 'fix.txt', 'arreglo\n');
  saveAll(hotfix, 'fix: login');
  return { ...fx, hotfix };
}

function openRelease(fx: Fixture, name: string, published = true): void {
  const path = join(fx.wt, name.replace('/', '-'));
  git(fx.repo, 'worktree', 'add', '-q', '-b', name, path, 'develop');
  write(path, `${name.replace('/', '-')}.txt`, 'release\n');
  saveAll(path, `chore: ${name}`);
  if (published) git(fx.repo, 'push', '-q', 'origin', name);
}

function advanceRemoteMain(fx: Fixture): void {
  git(fx.seed, 'fetch', '-q', fx.remote, 'main:main');
  git(fx.seed, 'checkout', '-q', 'main');
  write(fx.seed, 'main.txt', 'avanza\n');
  saveAll(fx.seed, 'chore: main avanza');
  git(fx.seed, 'push', '-q', fx.remote, 'main');
  git(fx.seed, 'checkout', '-q', 'develop');
}

const hotfixArgs = (...extra: string[]) => ['--into', 'main', '--order', ORDER, ...extra];

describe('un hotfix se fusiona en la rama estable, se etiqueta y vuelve a la integración', () => {
  it('fusiona en main, etiqueta y vuelve a develop con un push atómico', async () => {
    const fx = hotfixFixture('hotfix');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1', '--push'));

    expect(result.code, result.text).toBe(0);
    const fix = sha(fx.repo, 'hotfix/0200-fix');
    expect(sha(fx.repo, 'main^2')).toBe(fix);
    expect(sha(fx.repo, 'develop^2')).toBe(fix);
    expect(git(fx.repo, 'log', '-1', '--format=%s', 'main')).toBe('merge: hotfix/0200-fix en main');
    expect(git(fx.repo, 'log', '-1', '--format=%b', 'main')).toContain(`Orden del dev-lead: «${ORDER}»`);
    expect(git(fx.repo, 'log', '-1', '--format=%s', 'develop')).toBe('merge: hotfix/0200-fix en develop');
    expect(git(fx.repo, 'cat-file', '-t', 'v3.0.1')).toBe('tag');
    expect(sha(fx.repo, 'v3.0.1^{commit}')).toBe(sha(fx.repo, 'main'));
    expect(sha(fx.remote, 'main')).toBe(sha(fx.repo, 'main'));
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
    expect(sha(fx.remote, 'v3.0.1^{commit}')).toBe(sha(fx.repo, 'main'));
    expect(result.text).toContain(`Fusionado hotfix/0200-fix en main: ${git(fx.repo, 'rev-parse', '--short', 'main')}`);
    expect(result.text).toContain(`etiqueta v3.0.1 en ${git(fx.repo, 'rev-parse', '--short', 'main')}`);
    expect(result.text).toContain(`Fusionado hotfix/0200-fix en develop: ${git(fx.repo, 'rev-parse', '--short', 'develop')}`);
    expect(result.text).toContain('publicado en origin');
  });

  it('con una release abierta la vuelta va a ella', async () => {
    const fx = hotfixFixture('hotfix-release');
    openRelease(fx, 'release/3.1.0');
    const develop = sha(fx.repo, 'develop');

    const result = await runMerge(fx.hotfix, hotfixArgs());

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'release/3.1.0^2')).toBe(sha(fx.repo, 'hotfix/0200-fix'));
    expect(sha(fx.repo, 'develop')).toBe(develop);
  });

  it('con dos releases abiertas en el remoto falla antes de sincronizar la rama estable', async () => {
    const fx = hotfixFixture('hotfix-dos-releases');
    for (const name of ['release/3.1.0', 'release/3.2.0']) {
      git(fx.seed, 'checkout', '-q', '-b', name, 'develop');
      write(fx.seed, `${name.replace('/', '-')}.txt`, 'release\n');
      saveAll(fx.seed, `chore: ${name}`);
      git(fx.seed, 'push', '-q', fx.remote, name);
      git(fx.seed, 'checkout', '-q', 'develop');
    }
    advanceRemoteMain(fx);
    const refs = git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1'));

    expect(result.code).toBe(1);
    expect(result.text).toContain('vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano');
    expect(git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags')).toBe(refs);
  });

  it('una release solo local no cuenta si hay remoto', async () => {
    const fx = hotfixFixture('release-local');
    openRelease(fx, 'release/3.1.0', false);
    const release = sha(fx.repo, 'release/3.1.0');

    const result = await runMerge(fx.hotfix, hotfixArgs());

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'hotfix/0200-fix'));
    expect(sha(fx.repo, 'release/3.1.0')).toBe(release);
  });

  it('con la vuelta en otro remoto falla sin tocar nada', async () => {
    const fx = hotfixFixture('remotos-distintos');
    git(fx.repo, 'remote', 'add', 'upstream', fx.remote);
    git(fx.repo, 'config', 'branch.develop.remote', 'upstream');
    const refs = git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags');

    const result = await runMerge(fx.hotfix, hotfixArgs('--push'));

    expect(result.code).toBe(1);
    expect(result.text).toContain("push: 'main' y 'develop' tienen remotos distintos ('origin', 'upstream'); fusiona a mano");
    expect(git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags')).toBe(refs);
  });

  it('una release que el remoto ya cerró en main no recibe la vuelta', async () => {
    const fx = hotfixFixture('release-cerrada');
    openRelease(fx, 'release/3.1.0');
    git(fx.repo, 'push', '-q', 'origin', 'release/3.1.0');
    const localMain = sha(fx.repo, 'main');
    const closer = join(fx.wt, 'cierre-release');
    git(fx.repo, 'worktree', 'add', '-q', closer, 'main');
    git(closer, 'merge', '-q', '--no-ff', '-m', 'merge: release/3.1.0 en main', 'release/3.1.0');
    git(closer, 'push', '-q', 'origin', 'main');
    git(fx.repo, 'worktree', 'remove', closer);
    git(fx.repo, 'update-ref', 'refs/heads/main', localMain);
    const release = sha(fx.repo, 'release/3.1.0');

    const result = await runMerge(fx.hotfix, hotfixArgs());

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'hotfix/0200-fix'));
    expect(sha(fx.repo, 'release/3.1.0')).toBe(release);
  });

  it('una rama release vuelve a develop', async () => {
    const fx = hotfixFixture('release-a-main');
    openRelease(fx, 'release/3.1.0');

    const result = await runMerge(join(fx.wt, 'release-3.1.0'), hotfixArgs('--tag', 'v3.1.0'));

    expect(result.code, result.text).toBe(0);
    expect(sha(fx.repo, 'main^2')).toBe(sha(fx.repo, 'release/3.1.0'));
    expect(sha(fx.repo, 'develop^2')).toBe(sha(fx.repo, 'release/3.1.0'));
  });

  it('sin --order sale con 2', async () => {
    const fx = hotfixFixture('hotfix-sin-orden');

    const result = await runMerge(fx.hotfix, ['--into', 'main']);

    expect(result.code).toBe(2);
    expect(result.text).toContain(`--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`);
  });

  it('--tag sin --into a la rama estable sale con 2', async () => {
    const fx = hotfixFixture('tag-sin-into');

    const result = await runMerge(join(fx.wt, '0001'), ['--tag', 'v3.0.1']);

    expect(result.code).toBe(2);
    expect(result.text).toContain('--tag solo con --into a la rama estable');
  });

  it('una etiqueta inválida sale con 2 antes de tocar nada', async () => {
    const fx = hotfixFixture('tag-invalida');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1 beta'));

    expect(result.code).toBe(2);
    expect(result.text).toContain("--tag: 'v3.0.1 beta' no es un nombre de etiqueta válido");
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
  });

  it('una etiqueta que solo existe en el remoto falla sin tocar nada', async () => {
    const fx = hotfixFixture('tag-remota');
    git(fx.remote, 'tag', 'v3.0.1', 'main');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1'));

    expect(result.code).toBe(1);
    expect(result.text).toContain("--tag: ya existe 'v3.0.1' en 'origin'");
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
  });

  it('una etiqueta que ya existe falla sin tocar nada', async () => {
    const fx = hotfixFixture('tag-existe');
    git(fx.repo, 'tag', 'v3.0.1', 'main');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1'));

    expect(result.code).toBe(1);
    expect(result.text).toContain("--tag: ya existe 'v3.0.1'");
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
  });
});

describe('a la rama estable solo llegan ramas hotfix y release', () => {
  it('a main solo llegan hotfix y release', async () => {
    const fx = hotfixFixture('patch-a-main', 'patch/0201-typo');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(fx.hotfix, ['--into', 'main', '--order', 'llévalo a main']);

    expect(result.code).toBe(1);
    expect(result.text).toContain("--into: a 'main' solo llegan ramas hotfix/ o release/ (git-flow); 'patch/0201-typo' no lo es");
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
    expect(existsSync(fx.lock)).toBe(false);
  });
});

describe('un hotfix cuya vuelta falla se deshace entero', () => {
  it('una vuelta con conflicto deshace main y la etiqueta', async () => {
    const fx = hotfixFixture('vuelta-conflicto');
    const develop = join(fx.wt, 'develop-sacada');
    git(fx.repo, 'worktree', 'add', '-q', develop, 'develop');
    edit(develop, 'README.md', 'base', 'develop');
    saveAll(develop, 'docs: readme en develop');
    edit(fx.hotfix, 'README.md', 'base', 'hotfix');
    saveAll(fx.hotfix, 'docs: readme en el hotfix');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1', '--push'));

    expect(result.code).toBe(1);
    expect(result.text).toContain("vuelta: conflicto en README.md; se deshacen el merge en 'main' y la etiqueta: porta el arreglo a 'develop' a mano");
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
    expect(sha(fx.remote, 'main')).toBe(sha(fx.repo, 'main'));
  });

  it('con la verificación de la vuelta en rojo deshace main y la etiqueta y dice la base', async () => {
    const fx = hotfixFixture('vuelta-roja');
    const develop = join(fx.wt, 'develop-sacada');
    git(fx.repo, 'worktree', 'add', '-q', develop, 'develop');
    write(develop, 'solo-develop.txt', 'develop\n');
    saveAll(develop, 'chore: algo solo en develop');
    const refs = git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1', '--verify', failsIfExists('solo-develop.txt')));

    expect(result.code).toBe(1);
    expect(result.text).toContain('verificación: código de salida 1');
    expect(result.text).toContain('base: en rojo: el mismo comando también falla sin la rama');
    expect(git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags')).toBe(refs);
  });

  it('si el remoto avanzó, deshace todo y pide relanzar', async () => {
    const fx = hotfixFixture('hotfix-movido');
    const refs = git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1', '--push', '--verify', publishFromSeed(fx, 'otra-sesion.txt', true)));

    expect(result.code).toBe(1);
    expect(result.text).toContain("push: 'main' o 'develop' avanzó en 'origin'; relanza el hotfix");
    expect(git(fx.repo, 'for-each-ref', 'refs/heads', 'refs/tags')).toBe(refs);
  });
});

describe('la comprobación del destino de un hotfix', () => {
  it('--check del hotfix comprueba los dos destinos', async () => {
    const fx = hotfixFixture('hotfix-check');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(fx.hotfix, hotfixArgs('--tag', 'v3.0.1', '--check'));

    expect(result.code, result.text).toBe(0);
    expect(slash(result.text)).toContain(`destino: listo: 'main' irá en el worktree temporal '${slash(join(fx.wt, 'merge-0200-fix'))}'`);
    expect(slash(result.text)).toContain(`destino: listo: 'develop' irá en el worktree temporal '${slash(join(fx.wt, 'merge-0200-fix-develop'))}'`);
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
    expect(existsSync(fx.lock)).toBe(false);
  });

  it('--check dice las varias releases abiertas sin hacer fetch', async () => {
    const fx = hotfixFixture('check-dos-releases');
    openRelease(fx, 'release/3.1.0');
    openRelease(fx, 'release/3.2.0');
    const refs = git(fx.repo, 'for-each-ref');

    const result = await runMerge(fx.hotfix, hotfixArgs('--check'));

    expect(result.code).toBe(1);
    expect(result.text).toContain('vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano');
    expect(git(fx.repo, 'for-each-ref')).toBe(refs);
  });
});
