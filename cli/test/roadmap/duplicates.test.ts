import { describe, it, expect } from 'vitest';
import { duplicateIdWarnings } from '../../src/roadmap/duplicates.ts';
import { checkProject, laterRow, row, validDebt, validRoadmap } from './project.ts';

describe('un id repetido se avisa sin fallar', () => {
  it('avisa del id repetido en la columna # o id, con la línea de la primera', () => {
    const lines = ['## Próximo', '', '| # | Ítem | Estado |', '| --- | --- | --- |', '| 0210 | x | ⏳ |', '', '## Release 1.3', '', '| id | Feature | Estado |', '| --- | --- | --- |', '| 0210 | y | ⏳ |'];

    expect(duplicateIdWarnings(lines)).toEqual(['aviso: línea 11: el id «0210» ya está en la línea 5']);
  });

  it('does not warn a repeated 0000', () => {
    const lines = ['| Id | Tarea |', '| --- | --- |', '| 0000 | a |', '| 0000 | b |'];

    expect(duplicateIdWarnings(lines)).toEqual([]);
  });

  it('no mira las tablas sin columna de id', () => {
    const lines = ['| Fecha | Descripción |', '| --- | --- |', '| 2026-10-15 | a |', '| 2026-10-15 | b |', '', '| Ítem | Impacto | Destino |', '| --- | --- | --- |', '| Lento | Bajo | x |', '| Lento | Bajo | y |'];

    expect(duplicateIdWarnings(lines)).toEqual([]);
  });

  it('ROADMAP.md con un id de Later repetido avisa con su prefijo, tras los fallos, y sale con 0', async () => {
    const roadmap = [...validRoadmap, laterRow];

    const result = await checkProject({ roadmap, debt: validDebt });

    expect(result.code).toBe(0);
    expect(result.lines.some((line) => /^ROADMAP\.md: aviso: línea \d+: el id «0020» ya está en la línea \d+$/.test(line))).toBe(true);
  });

  it('ROADMAP.md con un id de Now repetido en Next también avisa', async () => {
    const roadmap = [...validRoadmap];
    const next = roadmap.findIndex((line) => line.startsWith('| 0014 |'));
    roadmap.splice(next + 1, 0, row({ id: '0012' }));

    const result = await checkProject({ roadmap, debt: validDebt });

    expect(result.lines.join('\n')).toContain('el id «0012» ya está en la línea');
  });
});
