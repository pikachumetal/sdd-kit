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
