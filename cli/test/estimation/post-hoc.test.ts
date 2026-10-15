import { describe, it, expect } from 'vitest';
import { build, project, row } from './helpers.ts';

const postHocFolder = '20261009-112000-patch-0201-cancel-day';
const onTimeFolder = '20261010-090000-patch-0202-late-total';

function patch(id: string, timeLines: string[]): string {
  return ['---', `id: ${id}`, 'solution: causa raíz', '---', '', '# Patch', '', '## 5. Tiempo (ligero)', '', ...timeLines, ''].join('\n');
}

const postHocPatch = patch(postHocFolder, ['- Estimación: 0,5h (post hoc)', '- Inicio: 2026-10-09T11:20Z', '- Real: 0,75h']);
const onTimePatch = patch(onTimeFolder, ['- Estimación: 1h', '- Real: 2h']);

describe('estimación de un patch escrita al cerrar', () => {
  it('enseña su estimado y pone post hoc en la columna Ratio', () => {
    const { text } = build(project({ [`specs/${postHocFolder}/patch.md`]: postHocPatch }));
    expect(row(text, postHocFolder)).toBe(`| 2026-10-09 | 0201 | patch | 0.5 | 0.75 | post hoc | — | — | — | — | ${postHocFolder} |`);
  });

  it('queda fuera del factor de calibración', () => {
    const { text } = build(project({ [`specs/${postHocFolder}/patch.md`]: postHocPatch, [`specs/${onTimeFolder}/patch.md`]: onTimePatch }));
    expect(text).toContain('(ratio mediano real/estimado, 1 artefacto): **2**');
  });

  it('post hoc sin cifra', () => {
    const noFigure = patch(postHocFolder, ['- Estimación: (post hoc)', '- Real: 0,75h']);
    const { text, warnings } = build(project({ [`specs/${postHocFolder}/patch.md`]: noFigure }));
    expect(row(text, postHocFolder)).toBe(`| 2026-10-09 | 0201 | patch | — | 0.75 | post hoc | — | — | — | — | ${postHocFolder} |`);
    expect(warnings).toEqual([]);
  });
});

describe('bloque de tiempo de un patch con las líneas de cierre', () => {
  it('lee el coste de sujetos', () => {
    const withSubjects = patch(onTimeFolder, ['- Estimación: 1h', '- Real: 2h', '- Coste de sujetos: 1,20 $ en 2 sujetos sonnet']);
    const { text } = build(project({ [`specs/${onTimeFolder}/patch.md`]: withSubjects }));
    expect(row(text, onTimeFolder)).toBe(`| 2026-10-10 | 0202 | patch | 1 | 2 | 2 | — | — | 1.2 | — | ${onTimeFolder} |`);
  });

  it('lee la línea de esfuerzo real que pega sdd session tokens', () => {
    const measured = patch(onTimeFolder, [
      '- Estimación: 1h',
      '- Esfuerzo real: 0,82 h — reloj de la sesión 1,15 h desde 2026-10-14T12:26Z, sin 20 min de espera al dev-lead (2 esperas)',
    ]);
    const { text, warnings } = build(project({ [`specs/${onTimeFolder}/patch.md`]: measured }));
    expect(row(text, onTimeFolder)).toBe(`| 2026-10-10 | 0202 | patch | 1 | 0.82 | 0.82 | — | — | — | — | ${onTimeFolder} |`);
    expect(warnings).toEqual([]);
  });
});
