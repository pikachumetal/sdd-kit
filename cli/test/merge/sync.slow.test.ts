import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { edit, git, mergeFixture, runMerge, saveAll, sha, write, type Fixture } from './helpers.ts';

const CAPABILITY = '.docs/sdd/capabilities/routing.md';
const RULES = ['Dónde viven los datos', 'Idioma de los nombres', 'Límites', 'Avisos', 'Regla ante conflicto'].map((rule) => `- **${rule}**: no aplica\n`).join('');
const requirement = (title: string) => `### ${title}\n\n- GIVEN una petición\n- WHEN entra\n- THEN va a ${title}\n\n`;
const capability = (extra: string) => `# Capacidad — routing\n\n## Propósito\n\nEnruta las peticiones.\n\n## Requisitos\n\n${requirement('Requisito base')}${extra}## Reglas de la capacidad\n\n${RULES}`;

function seedCapability(fx: Fixture): void {
  write(fx.seed, CAPABILITY, capability(''));
  saveAll(fx.seed, 'docs: routing');
  git(fx.seed, 'push', '-q', fx.remote, 'develop');
  for (const id of ['0001', '0002']) {
    git(join(fx.wt, id), 'fetch', '-q', 'origin');
    git(join(fx.wt, id), 'merge', '-q', 'origin/develop');
  }
}

const sync = (fx: Fixture, extra: string[] = []) => runMerge(join(fx.wt, '0001'), ['--sync', ...extra]);

describe('sdd merge --sync', () => {
  it('sin avance de la base no hace nada', async () => {
    const fx = mergeFixture('sync-al-dia');
    const before = sha(join(fx.wt, '0001'), 'HEAD');

    const result = await sync(fx);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain("base: al día: 'origin/develop' ya está en 'feature/0001'");
    expect(sha(join(fx.wt, '0001'), 'HEAD')).toBe(before);
  });

  it('integra la base y se queda con los dos requisitos de la capacidad y las dos filas', async () => {
    const fx = mergeFixture('sync-capacidad');
    seedCapability(fx);
    for (const [id, title] of [['0002', 'Requisito de la 0002'], ['0001', 'Requisito de la 0001']]) {
      const feature = join(fx.wt, id);
      write(feature, CAPABILITY, capability(requirement(title)));
      edit(feature, '.docs/sdd/roadmap.md', '| 0100 | base |\n', `| 0100 | base |\n| ${id} | fila de ${id} |\n`);
      saveAll(feature, `docs: requisito de ${id}`);
    }
    expect((await runMerge(join(fx.wt, '0002'), ['--push'])).code).toBe(0);

    const result = await sync(fx);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toMatch(/base: integrada 'origin\/develop' en 'feature\/0001': [0-9a-f]{7,}/);
    const merged = git(join(fx.wt, '0001'), 'show', `HEAD:${CAPABILITY}`);
    expect(merged.indexOf('### Requisito de la 0002')).toBeGreaterThan(merged.indexOf('### Requisito base'));
    expect(merged.indexOf('### Requisito de la 0001')).toBeGreaterThan(merged.indexOf('### Requisito de la 0002'));
    expect(git(join(fx.wt, '0001'), 'show', 'HEAD:.docs/sdd/roadmap.md')).toContain('| 0002 | fila de 0002 |\n| 0001 | fila de 0001 |');
    const io = memoryIo();
    expect(await run(['capability', 'check', '--path', join(fx.wt, '0001', '.docs/sdd')], io), [...io.stdout, ...io.stderr].join('\n')).toBe(0);
  });

  it('un conflicto real aborta y deja la rama como estaba', async () => {
    const fx = mergeFixture('sync-conflicto');
    for (const id of ['0002', '0001']) {
      edit(join(fx.wt, id), 'README.md', 'base\n', `cambio de ${id}\n`);
      saveAll(join(fx.wt, id), `docs: readme de ${id}`);
    }
    expect((await runMerge(join(fx.wt, '0002'), ['--push'])).code).toBe(0);
    const before = sha(join(fx.wt, '0001'), 'HEAD');

    const result = await sync(fx);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: conflicto en README.md.');
    expect(sha(join(fx.wt, '0001'), 'HEAD')).toBe(before);
    expect(git(join(fx.wt, '0001'), 'status', '--porcelain')).toBe('');
  });

  it('con cambios sin commitear no toca nada', async () => {
    const fx = mergeFixture('sync-sucio');
    edit(join(fx.wt, '0001'), 'README.md', 'base\n', 'a medias\n');

    const result = await sync(fx);

    expect(result.code).toBe(1);
    expect(result.text).toContain("base: 'feature/0001' tiene cambios sin commitear; commitéalos antes de integrar la base");
  });

  it('con otro merge a medias no toca nada', async () => {
    const fx = mergeFixture('sync-a-medias');
    const feature = join(fx.wt, '0001');
    git(feature, 'checkout', '-q', '-b', 'otra');
    edit(feature, 'README.md', 'base\n', 'otra\n');
    saveAll(feature, 'docs: otra');
    git(feature, 'checkout', '-q', 'feature/0001');
    edit(feature, 'README.md', 'base\n', 'la 0001\n');
    saveAll(feature, 'docs: la 0001');
    spawnSync('git', ['merge', 'otra'], { cwd: feature });

    const result = await sync(fx);

    expect(result.code).toBe(1);
    expect(result.text).toContain("base: 'feature/0001' tiene cambios sin commitear");
  });

  it('con un merge a medias sin cambios no toca nada', async () => {
    const fx = mergeFixture('sync-merge-head');
    const feature = join(fx.wt, '0001');
    git(feature, 'branch', 'vacia');
    git(feature, 'checkout', '-q', 'vacia');
    git(feature, 'commit', '-q', '--allow-empty', '-m', 'vacía');
    git(feature, 'checkout', '-q', 'feature/0001');
    git(feature, 'merge', '-q', '--no-commit', '--no-ff', 'vacia');
    const head = sha(feature, 'HEAD');
    const mergeHead = sha(feature, 'MERGE_HEAD');

    const result = await sync(fx);

    expect(result.code).toBe(1);
    expect(result.text).toContain("base: 'feature/0001' tiene cambios sin commitear");
    expect(sha(feature, 'HEAD')).toBe(head);
    expect(sha(feature, 'MERGE_HEAD')).toBe(mergeHead);
  });

  it('en un HEAD desacoplado no toca nada', async () => {
    const fx = mergeFixture('sync-desacoplado');
    git(join(fx.wt, '0001'), 'checkout', '-q', '--detach');
    const before = sha(join(fx.wt, '0001'), 'HEAD');

    const result = await sync(fx);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: HEAD desacoplado; --sync integra la base en una rama');
    expect(sha(join(fx.wt, '0001'), 'HEAD')).toBe(before);
  });

  it('un git merge que falla sin conflictos no se atribuye a un hook', async () => {
    const fx = mergeFixture('sync-sin-seguimiento');
    write(join(fx.wt, '0002'), 'nuevo.txt', 'de la 0002\n');
    saveAll(join(fx.wt, '0002'), 'feat: nuevo');
    expect((await runMerge(join(fx.wt, '0002'), ['--push'])).code).toBe(0);
    write(join(fx.wt, '0001'), 'nuevo.txt', 'sin seguimiento\n');
    const before = sha(join(fx.wt, '0001'), 'HEAD');

    const result = await sync(fx);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: git merge falló sin conflictos.');
    expect(result.text).not.toContain('el hook rechazó');
    expect(sha(join(fx.wt, '0001'), 'HEAD')).toBe(before);
  });
});

describe('el error de git sin conflictos solo llega en --sync', () => {
  it('en el merge del cierre, un fichero sin seguimiento del destino para antes como destino sacado', async () => {
    const fx = mergeFixture('cierre-sin-seguimiento');
    write(join(fx.wt, '0001'), 'nuevo.txt', 'de la 0001\n');
    saveAll(join(fx.wt, '0001'), 'feat: nuevo');
    const develop = join(fx.wt, 'develop');
    git(fx.repo, 'worktree', 'add', '-q', develop, 'develop');
    write(develop, 'nuevo.txt', 'sin seguimiento\n');

    const result = await runMerge(join(fx.wt, '0001'), ['--push']);

    expect(result.code).toBe(1);
    expect(result.text).toContain('destino sacado:');
    expect(result.text).not.toContain('git merge falló sin conflictos');
  });
});
