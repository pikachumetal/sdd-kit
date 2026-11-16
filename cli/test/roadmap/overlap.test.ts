import { describe, it, expect, vi } from 'vitest';
import { runSdd, sddFolder } from '../capability/helpers.ts';
import { parseSections, tableBlocks } from '../../src/roadmap/parse.ts';
import { overlapWarnings, twoPointOverlapRows } from '../../src/roadmap/overlap.ts';
import { brief, checkProject, header, laterRow, row, validDebt, validRoadmap } from './project.ts';

vi.setConfig({ testTimeout: 20_000 });

const nextHeader = ['# Roadmap — salas', '', '## Próximo', '', '| # | Ítem | Estado |', '| --- | --- | --- |'];
const verifyFolder = '`skills/sdd-verify/`';
const reviewerPrompt = '`skills/sdd-verify/references/spec-reviewer-prompt.md`';
const pairWarning = 'aviso: línea 8: la 0041 y la 0040 (línea 7) tocan `skills/sdd-verify/references/spec-reviewer-prompt.md` sin «tras» entre ellas';

function item(id: string, text: string, state = '⏳'): string {
  return `| ${id} | **Fila ${id}** ${text} | ${state} |`;
}

function warningsOf(lines: string[]): string[] {
  return overlapWarnings(twoPointOverlapRows(lines, tableBlocks(lines, parseSections(lines))));
}

function pair(first: string, second: string, states: [string, string] = ['⏳', '🔄']): string[] {
  return [...nextHeader, item('0040', first, states[0]), item('0041', second, states[1])];
}

const files40 = `Ficheros: ${verifyFolder}.`;
const files41 = `Ficheros: ${reviewerPrompt}, \`cli/src/roadmap/\`.`;

describe('dos filas abiertas que tocan lo mismo sin «tras» entre ellas se avisan', () => {
  it('avisa de la 0041 y la 0040 con la ruta de dentro', () => {
    expect(warningsOf(pair(files40, files41))).toEqual([pairWarning]);
  });

  it.each([
    ['tras 0040 en la 0041', files40, `tras 0040. ${files41}`],
    ['Fila tras la 0040 en la 0041', files40, `Fila tras la 0040. ${files41}`],
    ['tras 0041 en la 0040', `tras 0041. ${files40}`, files41],
    ['antes de 0041 en la 0040', `antes de 0041. ${files40}`, files41],
    ['antes de 0040 en la 0041', files40, `antes de 0040. ${files41}`],
    ['una lista con 0040 en la 0041', files40, `tras 0039, 0040 y 0042. ${files41}`],
  ])('calla con %s', (_, first, second) => {
    expect(warningsOf(pair(first, second))).toEqual([]);
  });

  it('calla con la cadena 0041 tras 0030 tras 0040', () => {
    const lines = [...pair(files40, `tras 0030. ${files41}`), item('0030', 'tras 0040.', '✅')];

    expect(warningsOf(lines)).toEqual([]);
  });

  it('una cadena con ciclo termina', () => {
    expect(warningsOf(pair(`tras 0041. ${files40}`, `tras 0040. ${files41}`))).toEqual([]);
  });

  it('ordena tres filas', () => {
    const lines = [...pair(files40, files41), item('0042', `Ficheros: ${verifyFolder}.`)];

    expect(warningsOf(lines)).toEqual([
      pairWarning,
      `aviso: línea 9: la 0042 y la 0040 (línea 7) tocan ${verifyFolder} sin «tras» entre ellas`,
      `aviso: línea 9: la 0042 y la 0041 (línea 8) tocan ${reviewerPrompt} sin «tras» entre ellas`,
    ]);
  });

  it.each([
    ['una carpeta sin barra cubre su fichero', '`skills/sdd-verify`', '`skills/sdd-verify/x.md`', ['`skills/sdd-verify/x.md`']],
    ['una carpeta no cubre otra con su prefijo', '`skills/sdd-verify`', '`skills/sdd-verify-old/x.md`', []],
    ['una ruta con barras invertidas y ./ es la misma', '`.\\skills\\sdd-verify\\x.md`', '`skills/sdd-verify/x.md`', ['`skills/sdd-verify/x.md`']],
    ['dos rutas compartidas salen en el mismo aviso', '`a/x.md`, `b/y.md`', '`b/y.md`, `a/x.md`', ['`a/x.md`, `b/y.md`']],
  ])('%s', (_, first, second, shared) => {
    const expected = shared.map((paths) => `aviso: línea 8: la 0041 y la 0040 (línea 7) tocan ${paths} sin «tras» entre ellas`);

    expect(warningsOf(pair(`Ficheros: ${first}.`, `Ficheros: ${second}.`))).toEqual(expected);
  });

  it('no cuenta lo que no es ruta', () => {
    expect(warningsOf(pair('Ficheros: `sdd roadmap check`, `REMOVED`.', 'Ficheros: `sdd roadmap check`, `REMOVED`.'))).toEqual([]);
  });

  it.each(['⏸️ aparcada: x', '✅', '🧪 validación diferida a x'])('no avisa una fila con %s', (state) => {
    expect(warningsOf(pair(files40, files41, [state, '⏳']))).toEqual([]);
  });

  it('no avisa una fila sin «Ficheros:» aunque cite rutas en su prosa', () => {
    expect(warningsOf(pair(`cambia ${verifyFolder}.`, files41))).toEqual([]);
  });

  it('cuenta el último «Ficheros:» de la celda', () => {
    expect(warningsOf(pair(`lee «Ficheros:» de ${verifyFolder}. Ficheros: \`cli/x.ts\`.`, files41))).toEqual([]);
  });

  it('no avisa una fila sin rutas entre comillas', () => {
    expect(warningsOf(pair('Ficheros: sus tests.', 'Ficheros: sus tests.'))).toEqual([]);
  });

  it('el mismo id no se compara, 0000 sí', () => {
    const same = (id: string) => [...nextHeader, item(id, files40), item(id, files41)];

    expect(warningsOf(same('0210'))).toEqual([]);
    expect(warningsOf(same('0000'))).toEqual([`aviso: línea 8: la 0000 y la 0000 (línea 7) tocan ${reviewerPrompt} sin «tras» entre ellas`]);
  });

  const release = (header: string, origin: string) => [
    ...nextHeader,
    item('0040', files40),
    '',
    '## Release 3.1',
    '',
    header,
    '| --- | --- | --- | --- | --- |',
    `| 0050 | **Fila 0050** | dev-lead | ${origin} | ⏳ |`,
  ];
  const releaseHeader = '| id | Feature | Origen | Ficheros que toca | Estado |';

  it('una fila de Próximo y una de release se comparan, sin leer «tras» en «Ficheros que toca»', () => {
    const expected = [`aviso: línea 13: la 0050 y la 0040 (línea 7) tocan ${reviewerPrompt} sin «tras» entre ellas`];

    expect(warningsOf(release(releaseHeader, reviewerPrompt))).toEqual(expected);
    expect(warningsOf(release(releaseHeader, `${reviewerPrompt} tras 0040`))).toEqual(expected);
  });

  it('una release fuera de plantilla no cuenta', () => {
    expect(warningsOf(release('| id | Feature | Origen | Ficheros | Estado |', reviewerPrompt))).toEqual([]);
  });

  it('checkRoadmap avisa tras el id repetido y acaba en Roadmap válido', async () => {
    const roadmap = [
      ...pair(files40, files41),
      item('0040', 'repetida.', '✅'),
      ...['', '## Backlog', '', '| # | Ítem | Origen |', '| --- | --- | --- |'],
      ...['', '## Deuda técnica', '', '| Ítem | Impacto | Destino |', '| --- | --- | --- |'],
      ...['', '## Patches', '', '| Fecha | Id | Descripción |', '| --- | --- | --- |'],
      ...['', '## Releases cerradas'],
    ];
    const sdd = sddFolder({ 'roadmap.md': roadmap.join('\n') + '\n' });

    const result = await runSdd(['roadmap', 'check', '--path', sdd]);

    expect(result.code).toBe(0);
    expect(result.lines).toEqual(['roadmap.md: aviso: línea 9: el id «0040» ya está en la línea 7', `roadmap.md: ${pairWarning}`, 'Roadmap válido']);
  });
});

describe('ROADMAP.md (3.0.0) avisa de dos filas abiertas de Now y Next que tocan lo mismo', () => {
  const overlapLine = /sin «tras» entre ellas$/;

  function withRow(extra: string, roadmap: string[] = validRoadmap): string[] {
    const lines = [...roadmap];
    lines.splice(lines.findIndex((line) => line.startsWith('| 0014 |')) + 1, 0, extra);
    return lines;
  }

  it('avisa de la 0015 con la 0013 y la 0014', async () => {
    const result = await checkProject({ roadmap: withRow(row({ id: '0015', after: '—', size: 'S' })), debt: validDebt });

    expect(result.code).toBe(0);
    expect(result.lines.filter((line) => overlapLine.test(line))).toEqual([
      'ROADMAP.md: aviso: línea 17: la 0015 y la 0013 (línea 10) tocan `src/avisos.js` sin «tras» entre ellas',
      'ROADMAP.md: aviso: línea 17: la 0015 y la 0014 (línea 16) tocan `src/avisos.js` sin «tras» entre ellas',
    ]);
    expect(result.lines.at(-1)).toBe('Roadmap válido');
  });

  it('calla con la cadena 0015 tras 0014 tras 0013', async () => {
    const result = await checkProject({ roadmap: withRow(row({ id: '0015', after: '0014', size: 'S' })), debt: validDebt });

    expect(result.lines.filter((line) => overlapLine.test(line))).toEqual([]);
  });

  it.each([
    ['✅', row({ id: '0015', state: '✅', after: '—', size: 'S' })],
    ['🧪', row({ id: '0015', state: '🧪 validación diferida a x', after: '—', size: 'S' })],
    ['⏸️', row({ id: '0015', state: '⏸️ aparcada: x', after: '—', size: 'S' })],
    ['sin Toca', row({ id: '0015', task: '**Aviso 0015**<br>*x.*<details><summary>Brief</summary>**Carril:** feature</details>', after: '—', size: 'S' })],
  ])('no avisa una fila de Next %s', async (_, extra) => {
    const result = await checkProject({ roadmap: withRow(extra), debt: validDebt });

    expect(result.lines.filter((line) => overlapLine.test(line))).toEqual([]);
  });

  it('no cuenta una fila de Later', async () => {
    const roadmap = validRoadmap.map((line) => (line === laterRow ? `| 0020 | — | **Reservar con QR**<br>*x.*${brief} | ⏳ |  |  |` : line));

    const result = await checkProject({ roadmap, debt: validDebt });

    expect(result.lines.filter((line) => overlapLine.test(line))).toEqual([]);
  });

  it('con los dos ficheros solo compara ROADMAP.md', async () => {
    const legacy = { 'roadmap.md': pair(files40, files41).join('\n') + '\n' };

    const result = await checkProject({ roadmap: validRoadmap, debt: validDebt, legacy });

    expect(result.lines.filter((line) => overlapLine.test(line))).toEqual([]);
  });
});

describe('pasada de fix de la revisión final', () => {
  it('un ciclo fuera del par termina y no calla el par', () => {
    const lines = [...pair(`tras 0030. ${files40}`, files41), item('0030', 'tras 0040.', '✅')];

    expect(warningsOf(lines)).toEqual([pairWarning]);
  });

  it.each([
    ['Tras con mayúscula', `Tras 0040. ${files41}`, []],
    ['una lista con e', `tras 0039 e 0040. ${files41}`, []],
    ['tras dentro de una palabra', `detras 0040. ${files41}`, [pairWarning]],
  ])('el orden de la 2.x: %s', (_, second, expected) => {
    expect(warningsOf(pair(files40, second))).toEqual(expected);
  });

  it('las mayúsculas cuentan en las rutas', () => {
    expect(warningsOf(pair('Ficheros: `Skills/sdd-verify/`.', files41))).toEqual([]);
  });

  it('dos releases se comparan entre sí', () => {
    const header = ['| id | Feature | Origen | Ficheros que toca | Estado |', '| --- | --- | --- | --- | --- |'];
    const lines = [
      ...['# Roadmap — salas', '', '## Release 3.1', '', ...header, `| 0050 | **Fila 0050** | dev-lead | ${verifyFolder} | ⏳ |`],
      ...['', '## Release 3.2', '', ...header, `| 0060 | **Fila 0060** | dev-lead | ${reviewerPrompt} | ⏳ |`],
    ];

    expect(warningsOf(lines)).toEqual([`aviso: línea 13: la 0060 y la 0050 (línea 7) tocan ${reviewerPrompt} sin «tras» entre ellas`]);
  });

  it('dos filas 0000 no comparten su «tras»', () => {
    const lines = [...nextHeader, item('0040', files40), item('0000', `tras 0040. ${files41}`), item('0000', files41)];

    expect(warningsOf(lines)).toEqual([
      `aviso: línea 9: la 0000 y la 0040 (línea 7) tocan ${reviewerPrompt} sin «tras» entre ellas`,
      `aviso: línea 9: la 0000 y la 0000 (línea 8) tocan ${reviewerPrompt}, \`cli/src/roadmap/\` sin «tras» entre ellas`,
    ]);
  });

  it('los avisos de solape van antes que los de debt.md', async () => {
    const roadmap = [
      ...pair(files40, files41),
      ...['', '## Backlog', '', '| # | Ítem | Origen |', '| --- | --- | --- |'],
      ...['', '## Deuda técnica', '', '| Ítem | Impacto | Destino |', '| --- | --- | --- |'],
      ...['', '## Patches', '', '| Fecha | Id | Descripción |', '| --- | --- | --- |'],
      ...['', '## Releases cerradas'],
    ];
    const changelog = ['# Changelog', '', '## [1.6.0] - 2026-11-01', '', '## [1.5.0] - 2026-10-01', ''];
    const sdd = sddFolder({ 'roadmap.md': roadmap.join('\n') + '\n', 'changelog.md': changelog.join('\n'), 'steering/debt.md': validDebt.join('\n') + '\n' });

    const result = await runSdd(['roadmap', 'check', '--path', sdd]);

    expect(result.lines.filter((line) => line.includes('aviso'))).toEqual([
      `roadmap.md: ${pairWarning}`,
      'debt.md: aviso: línea 13: en espera desde 2026-09-15, dos releases sin 2.º caso: caduca',
    ]);
  });

  it.each([
    ['una tabla de Next fuera de plantilla', (line: string) => (line === header ? '| Id | Externo | Tarea | Estado | Tras |' : line)],
    ['una sección «Next steps»', (line: string) => (line === '## Next' ? '## Next steps' : line)],
  ])('ROADMAP.md no lee %s', async (_, change) => {
    const roadmap = validRoadmap.map((line, index) => (index > 10 ? change(line) : line));
    const next = roadmap.findIndex((line) => line.startsWith('| 0014 |'));
    roadmap.splice(next + 1, 0, row({ id: '0015', after: '—', size: 'S' }));

    const result = await checkProject({ roadmap, debt: validDebt });

    expect(result.lines.filter((line) => /sin «tras» entre ellas$/.test(line))).toEqual([]);
  });
});
