import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
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

function addPatch(sdd: string, folder: string): void {
  mkdirSync(join(sdd, 'specs', folder), { recursive: true });
  writeFileSync(join(sdd, 'specs', folder, 'patch.md'), folder);
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
});
