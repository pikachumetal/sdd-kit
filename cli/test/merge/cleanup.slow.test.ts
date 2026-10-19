import { describe, it, expect } from 'vitest';
import { chmodSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { git, mergeFixture, runMerge, saveAll, sha, write, type Fixture } from './helpers.ts';

const ROADMAP = '.docs/sdd/roadmap.md';
const roadmap = (rows: string[]) => ['# Roadmap', '', '## Próximo', '', '| # | Ítem | Estado |', '| --- | --- | --- |', ...rows, '', '## Deuda', ''].join('\n');
const BASE_ROWS = ['| 0100 | base | ✅ |', '| 0110 | uno | ⏳ |', '| 0120 | dos | ⏳ |', '| 0130 | tres | ⏳ |'];
const withRow = (after: string, added: string, rows = BASE_ROWS) => rows.flatMap((row) => (row.startsWith(`| ${after} |`) ? [row, added] : [row]));

function seed(fx: Fixture, relative: string, content: string): void {
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

function sameRowInTwoPlaces(name: string, second = '| 0210 | x | ⏳ |'): Fixture {
  const fx = mergeFixture(name);
  seed(fx, ROADMAP, roadmap(BASE_ROWS));
  onBranch(fx, '0001', ROADMAP, roadmap(withRow('0100', '| 0210 | x | ⏳ |')));
  onBranch(fx, '0002', ROADMAP, roadmap(withRow('0130', second)));
  return fx;
}

const count = (text: string, id: string) => text.split('\n').filter((line) => line.startsWith(`| ${id} |`)).length;

describe('tras fusionar, las filas repetidas de los registros se limpian', () => {
  it('una fila idéntica en dos sitios queda una, con un commit propio', async () => {
    const fx = sameRowInTwoPlaces('limpieza-identica');
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(count(git(fx.repo, 'show', `develop:${ROADMAP}`), '0210')).toBe(1);
    expect(git(fx.repo, 'log', '-1', '--format=%s%n%b', 'develop')).toBe('docs(registros): quita las filas repetidas del merge\nFilas: 0210.');
    expect(git(fx.repo, 'log', '-1', '--format=%s', 'develop^')).toBe('merge: feature/0002 en develop');
    expect(sha(fx.remote, 'develop')).toBe(sha(fx.repo, 'develop'));
  });

  it('dos filas distintas con el mismo id se quedan y se avisan, sin commit de limpieza', async () => {
    const fx = sameRowInTwoPlaces('limpieza-distintas', '| 0210 | otra | ⏳ |');
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(result.text).toContain(`registros: dos filas distintas con el id '0210' en ${ROADMAP}; se quedan las dos, revísalas`);
    expect(count(git(fx.repo, 'show', `develop:${ROADMAP}`), '0210')).toBe(2);
    expect(git(fx.repo, 'log', '-1', '--format=%s', 'develop')).toBe('merge: feature/0002 en develop');
  });

  it('un id ya repetido en la destino no se toca ni se avisa', async () => {
    const fx = mergeFixture('limpieza-ya-repetido');
    const rows = [...BASE_ROWS, '| 0300 | viejo | ⏳ |', '| 0300 | viejo | ⏳ |'];
    seed(fx, ROADMAP, roadmap(rows));
    onBranch(fx, '0001', ROADMAP, roadmap(withRow('0100', '| 0210 | x | ⏳ |', rows)));
    onBranch(fx, '0002', ROADMAP, roadmap(withRow('0130', '| 0220 | y | ⏳ |', rows)));
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(result.text).not.toContain('registros:');
    expect(count(git(fx.repo, 'show', `develop:${ROADMAP}`), '0300')).toBe(2);
    expect(git(fx.repo, 'log', '-1', '--format=%s', 'develop')).toBe('merge: feature/0002 en develop');
  });

  it('la misma entrada en Added y en Changed no se toca', async () => {
    const fx = mergeFixture('limpieza-secciones');
    const changelog = (added: string[], changed: string[]) => ['# Changelog', '', '## [Unreleased]', '', '### Added', '', ...added, '- **Feature 0100** — base', '', '### Changed', '', ...changed, '- **Feature 0101** — base', ''].join('\n');
    seed(fx, 'CHANGELOG.md', changelog([], []));
    onBranch(fx, '0001', 'CHANGELOG.md', changelog(['- **Feature 0210** — añade'], []));
    onBranch(fx, '0002', 'CHANGELOG.md', changelog([], ['- **Feature 0210** — cambia']));
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);

    expect(result.code, result.text).toBe(0);
    expect(result.text).not.toContain('registros:');
    expect(git(fx.repo, 'show', 'develop:CHANGELOG.md').match(/Feature 0210/g)).toHaveLength(2);
  });

  it('en --sync, la fila idéntica también queda una', async () => {
    const fx = sameRowInTwoPlaces('limpieza-sync');
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);

    const result = await runMerge(join(fx.wt, '0002'), ['--sync']);

    expect(result.code, result.text).toBe(0);
    expect(count(git(join(fx.wt, '0002'), 'show', `HEAD:${ROADMAP}`), '0210')).toBe(1);
    expect(git(join(fx.wt, '0002'), 'log', '-1', '--format=%s', 'HEAD')).toBe('docs(registros): quita las filas repetidas del merge');
  });

  it('si el commit de limpieza falla, el merge se deshace', async () => {
    const fx = sameRowInTwoPlaces('limpieza-falla');
    expect((await runMerge(join(fx.wt, '0001'), ['--push'])).code).toBe(0);
    const before = sha(fx.repo, 'develop');
    const hook = join(fx.root, 'no-hooks', 'pre-commit');
    write(join(fx.root, 'no-hooks'), 'pre-commit', '#!/bin/sh\nexit 1\n');
    chmodSync(hook, 0o755);

    const result = await runMerge(join(fx.wt, '0002'), ['--push']);
    rmSync(hook);

    expect(result.code).toBe(1);
    expect(result.text).toContain('registros: no se pudo commitear la limpieza de filas repetidas');
    expect(sha(fx.repo, 'develop')).toBe(before);
  });
});
