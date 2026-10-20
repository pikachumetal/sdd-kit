import { describe, it, expect } from 'vitest';
import { brief, checkProject, header, laterRow, row, separator, templateLines, validRoadmap } from './project.ts';

const stateHelp = '⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …';
const titleHelp = '«## Now» ni «## Now — <versión> · en preparación|comprometida»';
const releasedChangelog = (entry: string) => ['# Changelog', '', '## [1.4.0] - 2026-09-01', '', '### Added', '', entry];

function lines(): string[] {
  return [...validRoadmap];
}

describe('sdd roadmap check: secciones de ROADMAP.md', () => {
  it('a valid ROADMAP.md passes', async () => {
    const result = await checkProject({ roadmap: lines() });
    expect(result.lines).toEqual(['Roadmap válido']);
    expect(result.code).toBe(0);
  });

  it('requires Now, Next and Later in order, only tables', async () => {
    const roadmap = [
      '# Roadmap — salas', '', '## Now', '', header, separator, row({ id: '0012' }), '',
      'Criterio: primero lo que ven los usuarios', '', '',
      '## Backlog', '', header, separator, laterRow, '',
      '## Next', '', header, separator, row({ id: '0014' }),
    ];
    const result = await checkProject({ roadmap });
    expect(result.lines).toEqual(
      expect.arrayContaining([
        'ROADMAP.md: línea 9: prosa en «Now»; el roadmap solo lleva tablas',
        'ROADMAP.md: línea 12: sección «Backlog» fuera de la plantilla',
        'ROADMAP.md: falta la sección «Later»',
      ]),
    );
    expect(result.code).toBe(1);
  });

  it('reports Next before Now', async () => {
    const roadmap = [
      '# Roadmap — salas', '', '## Next', '', header, separator, row({ id: '0014' }), '',
      '## Now', '', header, separator, row({ id: '0012' }), '',
      '## Later', '', header, separator, laterRow,
    ];
    expect((await checkProject({ roadmap })).lines).toContain('ROADMAP.md: línea 9: «Now» va antes que «Next»');
  });

  it('accepts the profile line under Now and nothing else', async () => {
    const extraLine = lines();
    extraLine.splice(5, 0, 'en preparación');
    expect((await checkProject({ roadmap: extraLine })).lines).toContain('ROADMAP.md: línea 6: prosa en «Now»; el roadmap solo lleva tablas');
    const underNext = lines();
    underNext.splice(12, 0, 'Perfil de control: pair');
    expect((await checkProject({ roadmap: underNext })).lines).toContain('ROADMAP.md: línea 13: prosa en «Next»; el roadmap solo lleva tablas');
  });
});

describe('sdd roadmap check: el título de Now', () => {
  it.each(['## Now — 2.4.0', '## Now — 2.4.0 · próxima', '## Now: 2.4.0'])('rejects the title %s', async (title) => {
    const roadmap = lines();
    roadmap[2] = title;
    const result = await checkProject({ roadmap });
    expect(result.lines).toContain(`ROADMAP.md: línea 3: «${title.slice(3)}» no es ${titleHelp}`);
    expect(result.code).toBe(1);
  });

  it.each(['## Now', '## Now — 2.4.0 · en preparación', '## Now — 2.4.0 · comprometida'])('accepts the title %s', async (title) => {
    const roadmap = lines();
    roadmap[2] = title;
    expect((await checkProject({ roadmap })).lines).toEqual(['Roadmap válido']);
  });
});

describe('sdd roadmap check: las filas de ROADMAP.md', () => {
  it('checks header, state, task, brief, size and ids of each row', async () => {
    const roadmap = [
      '# Roadmap — salas', '', '## Now', '', header, separator,
      row({ id: '0011' }),
      row({ id: '0012', state: 'hecho' }),
      row({ id: '0013', task: `Aviso semanal<br>*Cada lunes.*${brief}` }),
      row({ id: '0014', task: '**Exportar a CSV**<br>*Las reservas del mes.*' }),
      row({ id: '0015', after: '0099', size: 'XL' }),
      '', '## Next', '| Id | Tarea | Estado |', '| --- | --- | --- |', '| 0016 | **Informe** | ⏳ |', '',
      '## Later', '', header, separator, '| B3 | — | **Reservar con un código QR**<br>*Desde el móvil.* | ⏳ |  |  |',
    ];
    const result = await checkProject({ roadmap, mode: 'sequence' });
    expect(result.lines).toEqual(
      expect.arrayContaining([
        `ROADMAP.md: línea 8: estado «hecho» no admitido: ${stateHelp}`,
        'ROADMAP.md: línea 9: la «Tarea» no empieza por «**<título>**»',
        'ROADMAP.md: línea 10: la fila 0014 no lleva brief («<details>»)',
        'ROADMAP.md: línea 11: «Tras» nombra 0099, que no está en el roadmap ni en CHANGELOG.md',
        'ROADMAP.md: línea 11: tamaño «XL» no admitido: S, M, L',
        `ROADMAP.md: línea 14: la cabecera de «Next» debe ser «${header}»`,
        'ROADMAP.md: línea 22: el id «B3» no es de la secuencia: resérvale uno con sdd id next --reserve',
      ]),
    );
    expect(result.code).toBe(1);
  });

  it('a Now or Next row needs a size', async () => {
    const roadmap = lines();
    roadmap[15] = row({ id: '0014', after: '0012, 0013', size: '' });
    expect((await checkProject({ roadmap })).lines).toContain('ROADMAP.md: línea 16: tamaño «» no admitido: S, M, L');
  });

  it('rejects a B id in Now or Next in sequence', async () => {
    const roadmap = lines();
    roadmap[15] = row({ id: 'B3', size: 'S' });
    expect((await checkProject({ roadmap, mode: 'sequence' })).lines).toContain('ROADMAP.md: línea 16: el id «B3» no es de la secuencia: resérvale uno con sdd id next --reserve');
  });

  it('accepts a sequence id in Later in sequence', async () => {
    expect((await checkProject({ roadmap: lines(), mode: 'sequence' })).lines).toEqual(['Roadmap válido']);
  });

  it('rejects — and 0000 in sequence', async () => {
    const roadmap = lines();
    roadmap[21] = laterRow.replace('| 0020 |', '| — |');
    roadmap[15] = row({ id: '0000', after: '0012, 0013', size: 'S' });
    const result = (await checkProject({ roadmap, mode: 'sequence' })).lines;
    expect(result).toContain('ROADMAP.md: línea 22: el id «—» no es de la secuencia: resérvale uno con sdd id next --reserve');
    expect(result).toContain('ROADMAP.md: línea 16: el id «0000» no es de la secuencia: resérvale uno con sdd id next --reserve');
  });

  it('rejects a B id in tracker', async () => {
    const roadmap = lines();
    roadmap[21] = laterRow.replace('| 0020 |', '| B3 |');
    expect((await checkProject({ roadmap })).lines).toContain('ROADMAP.md: línea 22: el id «B3» ya no se usa: usa el del ticket o 0000');
  });

  it('accepts 0000 in Later in tracker', async () => {
    const roadmap = [...lines(), laterRow.replace('| 0020 |', '| 0000 |'), laterRow.replace('| 0020 |', '| 0000 |')];
    expect((await checkProject({ roadmap, mode: 'tracker' })).lines).toEqual(['Roadmap válido']);
  });

  it('rejects an active state in Later', async () => {
    const roadmap = lines();
    roadmap[21] = laterRow.replace('⏳', '🔄');
    expect((await checkProject({ roadmap })).lines).toContain('ROADMAP.md: línea 22: estado «🔄» no admitido en «Later»: ⏳, ⏸️ aparcada: …');
  });

  it('accepts Tras ids named by the changelog as whole words', async () => {
    const roadmap = lines();
    roadmap[15] = row({ id: '0014', after: '0011', size: 'S' });
    const named = await checkProject({ roadmap, changelog: releasedChangelog('- **Feature 0011** — Aviso por correo.') });
    expect(named.lines).toEqual(['Roadmap válido']);
    const inside = await checkProject({ roadmap, changelog: releasedChangelog('- **Feature 0110** — Aviso por SMS.') });
    expect(inside.lines).toContain('ROADMAP.md: línea 16: «Tras» nombra 0011, que no está en el roadmap ni en CHANGELOG.md');
  });

  it('checks each id of Tras', async () => {
    const roadmap = lines();
    roadmap[15] = row({ id: '0014', after: '0012,0099', size: 'S' });
    const result = await checkProject({ roadmap });
    expect(result.lines).toContain('ROADMAP.md: línea 16: «Tras» nombra 0099, que no está en el roadmap ni en CHANGELOG.md');
    expect(result.lines.join('\n')).not.toMatch(/nombra 0012/);
  });

  it('keeps escaped pipes inside the brief', async () => {
    const roadmap = lines();
    const escaped = brief.replace('**Salda:** nada', '**Salda:** la fila de la planta \\| nada');
    roadmap[15] = row({ id: '0014', task: `**Exportar a CSV**<br>*Las reservas del mes.*${escaped}`, after: '0012', size: 'S' });
    expect((await checkProject({ roadmap })).lines).toEqual(['Roadmap válido']);
  });
});

describe('sdd roadmap check: la plantilla de ROADMAP.md', () => {
  it('the template without its help passes', async () => {
    const roadmap = templateLines('now-next-later-template.md').filter((line) => !line.startsWith('>'));
    expect((await checkProject({ roadmap })).lines).toEqual(['Roadmap válido']);
  });

  it('the untouched template only fails because of its help', async () => {
    const result = await checkProject({ roadmap: templateLines('now-next-later-template.md') });
    expect(result.code).toBe(1);
    expect(result.lines.filter((line) => !line.includes('prosa en'))).toEqual([]);
  });
});
