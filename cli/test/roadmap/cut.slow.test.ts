import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { runSdd, sddFolder } from '../capability/helpers.ts';

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

function git(cwd: string, ...args: string[]): void {
  const result = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], {
    cwd,
    env: cleanEnv,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
}

function addPatch(sdd: string, folder: string, changes = 'specs'): void {
  mkdirSync(join(sdd, changes, folder), { recursive: true });
  writeFileSync(join(sdd, changes, folder, 'patch.md'), folder);
  git(sdd, 'add', '-A');
  git(sdd, 'commit', '-q', '-m', folder);
}

function roadmap(settled: string, patch: string): string {
  return [
    '# Roadmap — salas',
    '',
    '## Próximo',
    '',
    '| # | Ítem | Estado |',
    '| --- | --- | --- |',
    '',
    '## Backlog',
    '',
    '| # | Ítem | Origen |',
    '| --- | --- | --- |',
    '',
    '## Deuda técnica',
    '',
    '| Ítem | Impacto | Destino |',
    '| --- | --- | --- |',
    settled,
    '',
    '## Patches',
    '',
    '| Fecha | Id | Descripción |',
    '| --- | --- | --- |',
    patch,
    '',
    '## Releases cerradas',
    '',
    '### v1.2.0 — 2026-09-20',
    '',
    'Aviso por correo (0021).',
    '',
  ].join('\n');
}

describe('sdd roadmap check: el corte por ascendencia en git', () => {
  it('with the release tag, a same-day patch is decided by git ancestry, not by date', async () => {
    const sdd = sddFolder({});
    git(sdd, 'init', '-q');
    addPatch(sdd, 'antes');
    git(sdd, 'tag', 'v1.2.0');
    addPatch(sdd, 'despues');
    const settled = '| **[Patch 0026, 2026-09-20: saldada — [patch](specs/despues/patch.md)]** Bloqueo de SQLite | alto | Actuar |';
    writeFileSync(join(sdd, 'roadmap.md'), roadmap(settled, '| 2026-09-20 | 0026 | Tras el corte — [patch](specs/despues/patch.md) |'));
    expect((await runSdd(['roadmap', 'check', '--path', sdd])).lines).toEqual(['Roadmap válido']);

    writeFileSync(join(sdd, 'roadmap.md'), roadmap(settled, '| 2026-09-20 | 0025 | En el corte — [patch](specs/antes/patch.md) |'));
    const result = await runSdd(['roadmap', 'check', '--path', sdd]);
    expect(result.lines).toEqual(['roadmap.md: línea 23: patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte']);
    expect(result.code).toBe(1);
  });

  it('un patch que enlaza changes/ decide por el tag', async () => {
    const sdd = sddFolder({});
    git(sdd, 'init', '-q');
    addPatch(sdd, 'antes', 'changes');
    git(sdd, 'tag', 'v1.2.0');
    addPatch(sdd, 'despues', 'changes');
    writeFileSync(join(sdd, 'roadmap.md'), roadmap('', '| 2026-09-20 | 0026 | Tras el corte — [patch](changes/despues/patch.md) |'));
    expect((await runSdd(['roadmap', 'check', '--path', sdd])).lines).toEqual(['Roadmap válido']);
  });

  it('una fila saldada que enlaza .docs/sdd/changes/ desde ROADMAP.md decide por el tag', async () => {
    const sdd = sddFolder({});
    const root = dirname(dirname(sdd));
    git(root, 'init', '-q');
    addPatch(sdd, 'antes', 'changes');
    git(root, 'tag', 'v1.2.0');
    addPatch(sdd, 'despues', 'changes');
    const after = '| **[Patch 0026, 2026-09-20: saldada — [patch](.docs/sdd/changes/despues/patch.md)]** Bloqueo | alto | Actuar |';
    writeFileSync(join(root, 'ROADMAP.md'), roadmap(after, ''));
    expect((await runSdd(['roadmap', 'check', '--path', sdd])).lines).toEqual(['Roadmap válido']);

    const before = '| **[Patch 0025, 2026-09-20: saldada — [patch](.docs/sdd/changes/antes/patch.md)]** Bloqueo | alto | Actuar |';
    writeFileSync(join(root, 'ROADMAP.md'), roadmap(before, ''));
    const result = await runSdd(['roadmap', 'check', '--path', sdd]);
    expect(result.lines).toEqual(['ROADMAP.md: línea 17: fila saldada el 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte']);
    expect(result.code).toBe(1);
  });
});
