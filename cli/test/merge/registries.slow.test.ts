import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { git, mergeFixture, runMerge, saveAll, write, type Fixture } from './helpers.ts';

const table = (rows: string[]) => ['| Id | Tarea | Estado |', '| --- | --- | --- |', ...rows, ''].join('\n');
const roadmap = (rows: string[]) => `# Roadmap\n\n## Now\n\n${table(rows)}\n## Later\n`;

function seedBase(fx: Fixture, relative: string, content: string): void {
  write(fx.seed, relative, content);
  saveAll(fx.seed, `docs: ${relative}`);
  git(fx.seed, 'push', '-q', fx.remote, 'develop');
  for (const id of ['0001', '0002']) {
    git(join(fx.wt, id), 'fetch', '-q', 'origin');
    git(join(fx.wt, id), 'merge', '-q', 'origin/develop');
  }
}

function onBranch(fx: Fixture, id: string, relative: string, content: string): void {
  write(join(fx.wt, id), relative, content);
  saveAll(join(fx.wt, id), `docs: ${relative} en ${id}`);
}

async function mergeBoth(fx: Fixture): Promise<{ code: number; text: string }> {
  const first = await runMerge(join(fx.wt, '0001'), ['--push']);
  expect(first.code, first.text).toBe(0);
  return runMerge(join(fx.wt, '0002'), ['--push']);
}

const fileAt = (fx: Fixture, path: string) => git(fx.repo, 'show', `develop:${path}`);

describe('los registros se unen por id', () => {
  for (const path of ['.docs/sdd/roadmap.md', 'ROADMAP.md']) {
    it(`${path}: la destino marca la 0190 y añade la 0200, y la rama añade la 0201 debajo de la 0190`, async () => {
      const fx = mergeFixture(`estado-${path.length}`);
      seedBase(fx, path, roadmap(['| 0100 | base | ✅ |', '| 0190 | algo | ⏳ |']));
      onBranch(fx, '0001', path, roadmap(['| 0100 | base | ✅ |', '| 0190 | algo | ✅ |', '| 0200 | destino | ⏳ |']));
      onBranch(fx, '0002', path, roadmap(['| 0100 | base | ✅ |', '| 0190 | algo | ⏳ |', '| 0201 | nueva | ⏳ |']));

      const result = await mergeBoth(fx);

      expect(result.code, result.text).toBe(0);
      expect(fileAt(fx, path)).toContain('| 0190 | algo | ✅ |\n| 0200 | destino | ⏳ |\n| 0201 | nueva | ⏳ |\n');
    });
  }

  it('CHANGELOG.md: la misma entrada añadida por las dos ramas queda una', async () => {
    const fx = mergeFixture('changelog-doble');
    const changelog = (entries: string[]) => ['# Changelog', '', '## [Unreleased]', '', '### Added', '', ...entries, '- **Feature 0100** — base', ''].join('\n');
    seedBase(fx, 'CHANGELOG.md', changelog([]));
    onBranch(fx, '0001', 'CHANGELOG.md', changelog(['- **Feature 0201** — nueva']));
    onBranch(fx, '0002', 'CHANGELOG.md', changelog(['- **Feature 0201** — nueva']));

    const result = await mergeBoth(fx);

    expect(result.code, result.text).toBe(0);
    expect(fileAt(fx, 'CHANGELOG.md').match(/Feature 0201/g)).toHaveLength(1);
  });

  it('debt.md: dos filas distintas con el mismo ítem se quedan y se avisan', async () => {
    const fx = mergeFixture('deuda-doble');
    const path = '.docs/sdd/steering/debt.md';
    const debt = (rows: string[]) => ['# Deuda', '', '## Por triar', '', '| Ítem | Origen | Fecha |', '| --- | --- | --- |', '| base | x | 2026-10-01 |', ...rows, '', '## En espera', ''].join('\n');
    seedBase(fx, path, debt([]));
    onBranch(fx, '0001', path, debt(['| Lento | ticket 1 | 2026-10-19 |']));
    onBranch(fx, '0002', path, debt(['| Lento | ticket 2 | 2026-10-19 |']));

    const result = await mergeBoth(fx);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain(`registros: dos filas distintas con el id 'Lento' en ${path}; se quedan las dos, revísalas`);
    expect(fileAt(fx, path)).toContain('| Lento | ticket 1 | 2026-10-19 |\n| Lento | ticket 2 | 2026-10-19 |');
  });
});

describe('la unión de trozos en un registro no duplica filas', () => {
  it('CHANGELOG.md: una rama añade una sección y la otra la misma entrada suelta, y la entrada queda una', async () => {
    const fx = mergeFixture('changelog-seccion');
    const changelog = (extra: string[]) => ['# Changelog', '', '## [Unreleased]', '', ...extra, '## [0.1.0]', ''].join('\n');
    seedBase(fx, 'CHANGELOG.md', changelog([]));
    onBranch(fx, '0001', 'CHANGELOG.md', changelog(['### Changed', '', '- **Feature 0201** — nueva', '']));
    onBranch(fx, '0002', 'CHANGELOG.md', changelog(['- **Feature 0201** — nueva', '']));

    const result = await mergeBoth(fx);

    expect(result.code, result.text).toBe(0);
    expect(fileAt(fx, 'CHANGELOG.md').match(/Feature 0201/g)).toHaveLength(1);
  });
});

describe('los avisos solo salen con el merge hecho', () => {
  it('si otro fichero queda en conflicto, no avisa de filas repetidas', async () => {
    const fx = mergeFixture('aviso-abortado');
    const path = '.docs/sdd/steering/debt.md';
    const debt = (rows: string[]) => ['# Deuda', '', '| Ítem | Origen | Fecha |', '| --- | --- | --- |', '| base | x | 2026-10-01 |', ...rows, '', '## En espera', ''].join('\n');
    seedBase(fx, path, debt([]));
    for (const id of ['0001', '0002']) {
      write(join(fx.wt, id), path, debt([`| Lento | ticket ${id} | 2026-10-19 |`]));
      write(join(fx.wt, id), 'README.md', `cambio de ${id}\n`);
      saveAll(join(fx.wt, id), `docs: deuda y readme de ${id}`);
    }

    const result = await mergeBoth(fx);

    expect(result.code).toBe(1);
    expect(result.text).toContain('merge: conflicto en');
    expect(result.text).not.toContain('registros:');
  });
});

describe('la cabecera de una tabla no es una fila con id', () => {
  it('dos ramas que añaden la misma tabla nueva con filas distintas', async () => {
    const fx = mergeFixture('cabecera-tabla');
    const doc = (rows: string[]) => ['# Roadmap', '', '## Now', '', '| Id | Tarea | Estado |', '| --- | --- | --- |', '| 0100 | base | ✅ |', '', ...rows, '## Later', ''].join('\n');
    const table = (row: string) => ['## Next', '', '| Id | Tarea | Estado |', '| --- | --- | --- |', row, ''];
    seedBase(fx, 'ROADMAP.md', doc([]));
    onBranch(fx, '0001', 'ROADMAP.md', doc(table('| 0210 | x | ⏳ |')));
    onBranch(fx, '0002', 'ROADMAP.md', doc(table('| 0211 | y | ⏳ |')));

    const result = await mergeBoth(fx);

    expect(result.code, result.text).toBe(0);
    expect(result.text).not.toContain('registros:');
    expect(fileAt(fx, 'ROADMAP.md')).toContain(['## Next', '', '| Id | Tarea | Estado |', '| --- | --- | --- |', '| 0210 | x | ⏳ |', '| 0211 | y | ⏳ |', '', '## Later'].join('\n'));
    expect(fileAt(fx, 'ROADMAP.md').match(/## Next/g)).toHaveLength(1);
  });
});

async function syncAfterOther(fx: Fixture, relative: string, [other, mine]: [string, string]): Promise<{ code: number; text: string }> {
  onBranch(fx, '0002', relative, other);
  expect((await runMerge(join(fx.wt, '0002'), ['--push'])).code).toBe(0);
  onBranch(fx, '0001', relative, mine);
  return runMerge(join(fx.wt, '0001'), ['--sync']);
}

const branchFile = (fx: Fixture, path: string) => git(join(fx.wt, '0001'), 'show', `HEAD:${path}`);

describe('sdd merge --sync une lo que cada lado cambia sin tocar lo del otro', () => {
  it('roadmap.md: la rama salda una fila de deuda y develop le cambia el Destino, y queda una fila', async () => {
    const fx = mergeFixture('sync-deuda-saldada');
    const path = '.docs/sdd/roadmap.md';
    const debt = (item: string, destination: string) => ['# Roadmap', '', '## Deuda técnica', '', '| Ítem | Impacto | Destino |', '| --- | --- | --- |', '| **Base** — x | Bajo | Esperar |', `| ${item} | Medio | ${destination} |`, '| **Otra** — y | Bajo | Esperar |', ''].join('\n');
    const closed = '**[Feature 0001, 2026-10-29: saldada — [walkthrough](specs/x/walkthrough.md)]** ';
    seedBase(fx, path, debt('**Lento** — z', 'Actuar → 0001'));

    const result = await syncAfterOther(fx, path, [debt('**Lento** — z', 'Actuar → 0001 (segundo caso)'), debt(`${closed}**Lento** — z`, 'Actuar → 0001')]);

    expect(result.code, result.text).toBe(0);
    expect(result.text).not.toContain('registros:');
    const merged = branchFile(fx, path);
    expect(merged).toContain(`| ${closed}**Lento** — z | Medio | Actuar → 0001 (segundo caso) |`);
    expect(merged.match(/\*\*Lento\*\*/g)).toHaveLength(1);
  });

  it('capabilities: develop cambia el THEN de un requisito y la rama sus AND, y quedan los dos', async () => {
    const fx = mergeFixture('sync-then-and');
    const path = '.docs/sdd/capabilities/routing.md';
    const capability = (lines: string[]) => ['# Capacidad — routing', '', '## Requisitos', '', '### Enruta', '', '- GIVEN una petición', '- WHEN entra', ...lines, '', '### Otro', '', '- GIVEN algo', ''].join('\n');
    seedBase(fx, path, capability(['- THEN va a routing', '- AND avisa', '- AND guarda']));

    const result = await syncAfterOther(fx, path, [capability(['- THEN va a planning', '- AND avisa', '- AND guarda']), capability(['- THEN va a routing', '- AND avisa dos veces', '- AND guarda todo'])]);

    expect(result.code, result.text).toBe(0);
    expect(branchFile(fx, path)).toContain('- WHEN entra\n- THEN va a planning\n- AND avisa dos veces\n- AND guarda todo\n');
  });

  it('fuera de capabilities, el mismo cambio de THEN y AND sigue siendo conflicto', async () => {
    const fx = mergeFixture('sync-then-and-fuera');
    const path = 'docs/routing.md';
    const doc = (lines: string[]) => ['# Routing', '', '- WHEN entra', ...lines, ''].join('\n');
    seedBase(fx, path, doc(['- THEN va a routing', '- AND avisa']));

    const result = await syncAfterOther(fx, path, [doc(['- THEN va a planning', '- AND avisa']), doc(['- THEN va a routing', '- AND avisa dos veces'])]);

    expect(result.code).toBe(1);
    expect(result.text).toContain('base: conflicto en docs/routing.md.');
  });
});
