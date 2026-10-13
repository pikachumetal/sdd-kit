import { describe, it, expect } from 'vitest';
import { checkProject, debtHeaders, lineOf, templateLines, validDebt, validRoadmap } from './project.ts';

const waitingRow = '| Las reservas de más de 8 h no avisan al responsable | [ticket](t.md) | medio | 2.º caso | 2026-07-01 |';
const recentRow = '| El aviso semanal sale duplicado | [ticket](u.md) | bajo | reproducirlo | 2026-08-01 |';
const discardedRow = '| El tema oscuro | [reunión](r.md) | fuera del producto | 2026-07-01 |';
const agingDebt = [
  '# Deuda técnica — salas', '', '## Por triar', '', ...debtHeaders['Por triar'], '',
  '## En espera', '', ...debtHeaders['En espera'], waitingRow, recentRow, '',
  '## Lista', '', ...debtHeaders.Lista, '',
  '## Descartadas', '', ...debtHeaders.Descartadas, discardedRow,
];
const releases = ['# Changelog', '', '## [Unreleased]', '', '## [1.4.1] - 2026-10-05', '', '## [1.4.0] - 2026-09-01', '', '## [1.3.0] - 2026-07-20'];
const waitingWarning = (line: number) => `debt.md: aviso: línea ${line}: en espera desde 2026-07-01, dos releases sin 2.º caso: caduca`;
const discardedWarning = (line: number) => `debt.md: aviso: línea ${line}: descartada el 2026-07-01, dos releases después: sale en el corte`;

function debt(): string[] {
  return [...validDebt];
}

async function check(content: string[]) {
  return checkProject({ roadmap: validRoadmap, debt: content });
}

describe('sdd roadmap check: forma de debt.md', () => {
  it('a valid debt.md passes', async () => {
    const result = await check(debt());
    expect(result.lines).toEqual(['Roadmap válido']);
    expect(result.code).toBe(0);
  });

  it('requires the four sections in order, only tables', async () => {
    const content = [
      '# Deuda técnica — salas', '', '## Por triar', 'Revisar cada lunes', '', ...debtHeaders['Por triar'], '',
      '## Lista', ...debtHeaders.Lista, '| `libres --planta 2` lista salas de la planta 1 | [informe de QA](q.md) | alto | — | 0014 |', '', '',
      '## En espera', ...debtHeaders['En espera'],
      '## Descartadas', ...debtHeaders.Descartadas, '| El tema oscuro | [reunión](r.md) | fuera del producto | ayer |',
    ];
    const result = await check(content);
    expect(result.lines).toEqual(
      expect.arrayContaining([
        'debt.md: línea 4: prosa en «Por triar»; debt.md solo lleva tablas',
        'debt.md: línea 12: fila de «Lista» sin «Evidencia»',
        'debt.md: línea 15: «En espera» va antes que «Lista»',
        'debt.md: línea 21: «Fecha» «ayer» no es AAAA-MM-DD',
      ]),
    );
    expect(result.code).toBe(1);
  });

  it.each(Object.entries(debtHeaders))('checks the header of %s', async (section, [expected]) => {
    const content = debt();
    const index = content.indexOf(expected);
    content.splice(index, 2, '| Ítem | Estado |', '| --- | --- |');
    expect((await check(content)).lines).toContain(`debt.md: línea ${index + 1}: la cabecera de «${section}» debe ser «${expected}»`);
  });

  it('reports a missing section', async () => {
    const content = debt();
    content.splice(content.indexOf('## Descartadas'));
    expect((await check(content)).lines).toContain('debt.md: falta la sección «Descartadas»');
  });

  it.each(['', '—'])('requires Evidencia and Destino in Lista, not %j', async (empty) => {
    const listRow = (evidence: string, destination: string) => `| La planta 2 | [informe](q.md) | alto | ${evidence} | ${destination} |`;
    const content = debt();
    const index = content.findIndex((text) => text.startsWith('| `libres'));
    content.splice(index, 1, listRow(empty, '0014'), listRow('`node src/app.js libres --planta 2`', empty));
    const result = await check(content);
    expect(result.lines).toContain(`debt.md: línea ${index + 1}: fila de «Lista» sin «Evidencia»`);
    expect(result.lines).toContain(`debt.md: línea ${index + 2}: fila de «Lista» sin «Destino»`);
  });

  it.each(['ayer', '12/10/2026', '2026-10-1'])('checks the date format %s', async (date) => {
    const content = debt();
    const index = content.findIndex((text) => text.startsWith('| El tema oscuro'));
    content[index] = `| El tema oscuro | [reunión](r.md) | fuera del producto | ${date} |`;
    expect((await check(content)).lines).toContain(`debt.md: línea ${index + 1}: «Fecha» «${date}» no es AAAA-MM-DD`);
  });

  it('the debt template without its help passes', async () => {
    const content = templateLines('debt-template.md').filter((line) => !line.startsWith('>'));
    expect((await check(content)).lines).toEqual(['Roadmap válido']);
  });
});

describe('sdd roadmap check: caducidad de debt.md', () => {
  it('warns of a waiting row and a discarded row after two releases', async () => {
    const result = await checkProject({ roadmap: validRoadmap, debt: agingDebt, changelog: releases });
    expect(result.lines).toEqual([waitingWarning(lineOf(agingDebt, waitingRow)), discardedWarning(lineOf(agingDebt, discardedRow)), 'Roadmap válido']);
    expect(result.code).toBe(0);
  });

  it('ignores patch versions and Unreleased', async () => {
    const patches = ['# Changelog', '', '## [Unreleased]', '', '## [1.3.2] - 2026-09-10', '', '## [1.3.1] - 2026-08-10', '', '## [1.3.0] - 2026-06-20'];
    const result = await checkProject({ roadmap: validRoadmap, debt: agingDebt, changelog: patches });
    expect(result.lines).toEqual(['Roadmap válido']);
  });

  it('counts releases with an em dash heading', async () => {
    const dashed = ['# Changelog', '', '## [1.4.0] — 2026-09-01', '', '## [1.3.0] — 2026-07-20'];
    const result = await checkProject({ roadmap: validRoadmap, debt: agingDebt, changelog: dashed });
    expect(result.lines).toContain(waitingWarning(lineOf(agingDebt, waitingRow)));
  });

  it('reads the 2.x changelog when the root has none', async () => {
    const result = await checkProject({ roadmap: validRoadmap, debt: agingDebt, legacy: { 'changelog.md': releases.join('\n') + '\n' } });
    expect(result.lines).toContain(waitingWarning(lineOf(agingDebt, waitingRow)));
  });

  it('without a changelog no row warns', async () => {
    expect((await check(agingDebt)).lines).toEqual(['Roadmap válido']);
  });
});
