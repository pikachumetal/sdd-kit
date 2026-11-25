import { describe, it, expect } from 'vitest';
import { clashLines, numberingClashes, type Numbered } from '../../src/merge/numbering.ts';

const FEATURE_A = '20261123-141327-feature-0756-a';
const PATCH_B = '20261123-162919-patch-0756-b';
const none: Numbered = { changes: [], decisions: [] };

function clashes(branch: Partial<Numbered>, destination: Partial<Numbered>, options: { base?: Partial<Numbered>; sequence?: boolean } = {}) {
  return numberingClashes({
    base: { ...none, ...options.base },
    branch: { ...none, ...branch },
    destination: { ...none, ...destination },
    sequence: options.sequence ?? true,
  });
}

describe('numberingClashes', () => {
  it('una carpeta de la rama con un id que el destino ya usa en otra carpeta choca', () => {
    expect(clashLines(clashes({ changes: [PATCH_B] }, { changes: [FEATURE_A] }), 'develop')).toEqual([
      `numeración: la rama trae ${PATCH_B} y 'develop' ya tiene ${FEATURE_A} con el id 0756; renumera la de la rama a mano`,
    ]);
  });

  it('una ADR de la rama con un número que el destino ya usa choca, también en modo tracker', () => {
    expect(clashLines(clashes({ decisions: ['0004-b.md'] }, { decisions: ['0004-a.md'] }, { sequence: false }), 'develop')).toEqual([
      "numeración: la rama trae decisions/0004-b.md y 'develop' ya tiene decisions/0004-a.md con el número 0004; renumera la de la rama a mano",
    ]);
  });

  it('dos choques en la misma ref salen los dos', () => {
    const found = clashes({ changes: [PATCH_B], decisions: ['0004-b.md'] }, { changes: [FEATURE_A], decisions: ['0004-a.md'] });
    expect(found).toHaveLength(2);
  });

  it('lo que la rama comparte con el destino por nombre no choca', () => {
    expect(clashes({ changes: [FEATURE_A, PATCH_B] }, { changes: [FEATURE_A, PATCH_B] })).toEqual([]);
  });

  it('lo que ya estaba en el merge-base no lo trae la rama, aunque el destino lo renombrara', () => {
    const renamed = '20261123-141327-feature-0756-a2';
    expect(clashes({ changes: [FEATURE_A] }, { changes: [renamed] }, { base: { changes: [FEATURE_A] } })).toEqual([]);
  });

  it('en modo tracker las carpetas de cambio no cuentan', () => {
    expect(clashes({ changes: [PATCH_B] }, { changes: [FEATURE_A] }, { sequence: false })).toEqual([]);
  });

  it('el id y el número 0000 no cuentan', () => {
    const found = clashes(
      { changes: ['20261123-162919-patch-0000-b'], decisions: ['0000-b.md'] },
      { changes: ['20261123-141327-feature-0000-a'], decisions: ['0000-a.md'] },
    );
    expect(found).toEqual([]);
  });

  it('las carpetas con sufijo heredado no cuentan', () => {
    expect(clashes({ changes: ['20260920-100000-task-0006b-b'] }, { changes: ['20260920-100000-task-0006a-a'] })).toEqual([]);
  });

  it('un fichero de decisions sin número no cuenta', () => {
    expect(clashes({ decisions: ['README.md', 'notas-0004.md'] }, { decisions: ['0004-a.md'] })).toEqual([]);
  });
});
