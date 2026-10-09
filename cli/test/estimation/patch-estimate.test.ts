import { describe, it, expect } from 'vitest';
import { build, project, row } from './helpers.ts';

const folder = '20261009-112000-patch-0201-cancel-day';

const patchWithEstimateBeforeFix = [
  '---',
  'id: 20261009-112000-patch-0201-cancel-day',
  'solution: causa raíz',
  '---',
  '',
  '# Patch — cancelar ignora el día',
  '',
  '## 5. Tiempo (ligero)',
  '',
  '- Estimación: 0,5h',
  '- Inicio: 2026-10-09T11:20Z',
  '- Real: 0,75h',
  '',
].join('\n');

describe('estimación de un patch escrita antes del fix', () => {
  const { text, warnings } = build(project({ [`specs/${folder}/patch.md`]: patchWithEstimateBeforeFix }));

  it('lee la estimación de un patch escrita antes del fix', () => {
    expect(row(text, folder)).toBe(`| 2026-10-09 | 0201 | patch | 0.5 | 0.75 | 1.5 | — | — | — | — | ${folder} |`);
  });

  it('no cuenta la línea Inicio como estimación ni avisa', () => {
    expect(warnings).toEqual([]);
  });
});
