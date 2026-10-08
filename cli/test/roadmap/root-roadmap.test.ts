import { describe, it, expect } from 'vitest';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { runSdd, sddFolder } from '../capability/helpers.ts';

const valid = [
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
  '',
  '## Patches',
  '',
  '| Fecha | Id | Descripción |',
  '| --- | --- | --- |',
  '',
  '## Releases cerradas',
  '',
].join('\n');
const broken = valid.replace('## Patches', '## Parches');

describe('sdd roadmap check con ROADMAP.md en la raíz', () => {
  it('valida ROADMAP.md de la raíz con prefijo ROADMAP.md:', async () => {
    const sdd = sddFolder({});
    writeFileSync(join(dirname(dirname(sdd)), 'ROADMAP.md'), broken);
    const result = await runSdd(['roadmap', 'check', '--path', sdd]);
    expect(result.code).toBe(1);
    expect(result.lines.length).toBeGreaterThan(0);
    expect(result.lines.every((line) => line.startsWith('ROADMAP.md: '))).toBe(true);
  });

  it('con los dos roadmaps avisa y termina en Roadmap válido', async () => {
    const sdd = sddFolder({ 'roadmap.md': broken });
    writeFileSync(join(dirname(dirname(sdd)), 'ROADMAP.md'), valid);
    const result = await runSdd(['roadmap', 'check', '--path', sdd]);
    expect(result.lines).toContain('ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee');
    expect(result.lines.at(-1)).toBe('Roadmap válido');
    expect(result.code).toBe(0);
  });

  it('solo roadmap.md sigue con prefijo roadmap.md:', async () => {
    const result = await runSdd(['roadmap', 'check', '--path', sddFolder({ 'roadmap.md': broken })]);
    expect(result.code).toBe(1);
    expect(result.lines.every((line) => line.startsWith('roadmap.md: '))).toBe(true);
  });
});
