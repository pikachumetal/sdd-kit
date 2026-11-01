import { describe, it, expect } from 'vitest';
import { checkProject, debtHeaders, lineOf, templateLines, validDebt, validRoadmap } from './project.ts';

const waitingRow = '| Las reservas de más de 8 h no avisan al responsable | sin determinar | [ticket](t.md) | medio | 2.º caso | 2026-07-01 |';
const recentRow = '| El aviso semanal sale duplicado | sin determinar | [ticket](u.md) | bajo | reproducirlo | 2026-08-01 |';
const discardedRow = '| El tema oscuro | sin determinar | [reunión](r.md) | fuera del producto | 2026-07-01 |';
const CAUSE_LIST = 'entorno de la máquina, carga o paralelismo, herramienta del kit, regla lejos de su paso, decisión que no era del agente, fusión de registros, prueba o molde, defecto del producto, sin determinar';
const FIX_LIST = 'comprobación automática, conectar comprobación, mover regla, línea nueva';
const listRow = (cause: string, origin: string, remedy: string, fix: string, item = 'La planta 2') => `| ${item} | ${cause} | ${origin} | alto | \`cmd\` | ${remedy} | ${fix} | 0014 |`;
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

  it('flags a debt.md row with a different cell count', async () => {
    const content = debt();
    const index = content.indexOf('| El tema oscuro | sin determinar | [reunión](r.md) | fuera del producto | 2026-09-20 |');
    content[index] = '| El tema oscuro | sin determinar | [reunión](r.md) | fuera del producto. || 2026-09-20 |';
    const result = await check(content);
    expect(result.lines).toContain(`debt.md: línea ${index + 1}: la fila tiene 6 celdas y la cabecera 5`);
    expect(result.code).toBe(1);
  });

  it('requires the four sections in order, only tables', async () => {
    const content = [
      '# Deuda técnica — salas', '', '## Por triar', 'Revisar cada lunes', '', ...debtHeaders['Por triar'], '',
      '## Lista', ...debtHeaders.Lista, '| `libres --planta 2` lista salas de la planta 1 | defecto del producto | [informe de QA](q.md) | alto | — | — | — | 0014 |', '', '',
      '## En espera', ...debtHeaders['En espera'],
      '## Descartadas', ...debtHeaders.Descartadas, '| El tema oscuro | sin determinar | [reunión](r.md) | fuera del producto | ayer |',
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
    const row = (evidence: string, destination: string) => `| La planta 2 | defecto del producto | [informe](q.md) | alto | ${evidence} | — | — | ${destination} |`;
    const content = debt();
    const index = content.findIndex((text) => text.startsWith('| `libres'));
    content.splice(index, 1, row(empty, '0014'), row('`node src/app.js libres --planta 2`', empty));
    const result = await check(content);
    expect(result.lines).toContain(`debt.md: línea ${index + 1}: fila de «Lista» sin «Evidencia»`);
    expect(result.lines).toContain(`debt.md: línea ${index + 2}: fila de «Lista» sin «Destino»`);
  });

  it.each(['ayer', '12/10/2026', '2026-10-1'])('checks the date format %s', async (date) => {
    const content = debt();
    const index = content.findIndex((text) => text.startsWith('| El tema oscuro'));
    content[index] = `| El tema oscuro | sin determinar | [reunión](r.md) | fuera del producto | ${date} |`;
    expect((await check(content)).lines).toContain(`debt.md: línea ${index + 1}: «Fecha» «${date}» no es AAAA-MM-DD`);
  });

  it('the debt template without its help passes', async () => {
    const content = templateLines('debt-template.md').filter((line) => !line.startsWith('>'));
    expect((await check(content)).lines).toEqual(['Roadmap válido']);
  });
});

describe('sdd roadmap check: causa y arreglo de debt.md', () => {
  function withListRows(rows: string[]): { content: string[]; index: number } {
    const content = debt();
    const index = content.findIndex((text) => text.startsWith('| `libres'));
    content.splice(index, 1, ...rows);
    return { content, index };
  }

  it('rejects a cause out of the list', async () => {
    const content = debt();
    const waiting = content.findIndex((text) => text.startsWith('| El aviso semanal'));
    const discarded = content.findIndex((text) => text.startsWith('| El tema oscuro'));
    content[waiting] = '| El aviso semanal | mala suerte | [ticket](t.md) | bajo | 2.º caso | 2026-09-15 |';
    content[discarded] = '| El tema oscuro | — | [reunión](r.md) | fuera del producto | 2026-09-20 |';
    const { lines } = await check(content);
    expect(lines).toContain(`debt.md: línea ${waiting + 1}: causa «mala suerte» no admitida: ${CAUSE_LIST}`);
    expect(lines).toContain(`debt.md: línea ${discarded + 1}: causa «—» no admitida: ${CAUSE_LIST}`);
  });

  it('treats an empty cause like a dash', async () => {
    const { content, index } = withListRows([listRow('', '[t](a.md)', '—', 'mover regla')]);
    expect((await check(content)).lines).toContain(`debt.md: línea ${index + 1}: causa «—» no admitida: ${CAUSE_LIST}`);
  });

  it('rejects a fix type out of the list', async () => {
    const { content, index } = withListRows([listRow('prueba o molde', '[t](a.md)', '—', 'más cuidado')]);
    const result = await check(content);
    expect(result.lines).toContain(`debt.md: línea ${index + 1}: arreglo «más cuidado» no admitido: ${FIX_LIST}`);
    expect(result.code).toBe(1);
  });

  it('rejects sin determinar in Lista', async () => {
    const { content, index } = withListRows([listRow('sin determinar', '[t](a.md)', '—', 'mover regla')]);
    expect((await check(content)).lines).toContain(`debt.md: línea ${index + 1}: una fila de «Lista» no admite la causa «sin determinar»`);
  });

  it('accepts a dash fix only for defecto del producto', async () => {
    const { content, index } = withListRows([listRow('defecto del producto', '[t](a.md)', '—', '—'), listRow('prueba o molde', '[t](a.md)', '—', '—')]);
    const { lines } = await check(content);
    expect(lines.filter((line) => line.includes('arreglo «'))).toEqual([`debt.md: línea ${index + 2}: arreglo «—» no admitido: ${FIX_LIST}`]);
  });

  it('rejects a wrong fix type for defecto del producto', async () => {
    const { content, index } = withListRows([listRow('defecto del producto', '[t](a.md)', '—', 'más cuidado')]);
    expect((await check(content)).lines).toContain(`debt.md: línea ${index + 1}: arreglo «más cuidado» no admitido: ${FIX_LIST}`);
  });

  it('exempts a settled row', async () => {
    const item = '**[Feature 0009, 2026-07-20: saldada — [walkthrough](w.md)]** La planta 2';
    const { content } = withListRows([listRow('mala suerte', '[t](a.md)', '—', 'más cuidado', item)]);
    expect((await check(content)).lines).toEqual(['Roadmap válido']);
  });

  it('requires a remedy with two distinct links', async () => {
    const twoLinks = '[t](a.md), [t](b.md)';
    const { content, index } = withListRows([
      listRow('prueba o molde', twoLinks, '—', 'mover regla'),
      listRow('prueba o molde', '[t](a.md#1), [t](a.md#2)', '', 'mover regla'),
      listRow('prueba o molde', '[t](a.md), [t](a.md)', '—', 'mover regla'),
      listRow('prueba o molde', '[t](a.md)', '—', 'mover regla'),
      listRow('prueba o molde', twoLinks, 'lanza desde D:\\r', 'mover regla'),
      listRow('prueba o molde', twoLinks, 'ninguno', 'mover regla'),
    ]);
    const result = await check(content);
    expect(result.lines).toEqual([
      `debt.md: línea ${index + 1}: fila de problema sin «Remedio temporal»`,
      `debt.md: línea ${index + 2}: fila de problema sin «Remedio temporal»`,
    ]);
    expect(result.code).toBe(1);
  });

  it('does not count plain text as cases', async () => {
    const { content } = withListRows([listRow('prueba o molde', 'roadmap 2.x, cliente', '—', 'mover regla')]);
    expect((await check(content)).lines).toEqual(['Roadmap válido']);
  });

  it('the template names every cause and fix type', () => {
    const template = templateLines('debt-template.md').join('\n');
    for (const value of [...CAUSE_LIST.split(', '), ...FIX_LIST.split(', ')]) expect(template).toContain(`\`${value}\``);
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
