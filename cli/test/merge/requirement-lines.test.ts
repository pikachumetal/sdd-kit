import { describe, it, expect } from 'vitest';
import { mergeRequirementLines } from '../../src/merge/requirement-lines.ts';

const base = ['- THEN va a routing', '- AND avisa', '- AND guarda'];

describe('mergeRequirementLines', () => {
  it('la base cambia el THEN y la rama los AND, y quedan los dos cambios', () => {
    const merged = mergeRequirementLines({ base, ours: ['- THEN va a planning', '- AND avisa', '- AND guarda'], theirs: ['- THEN va a routing', '- AND avisa dos veces', '- AND guarda todo'] });
    expect(merged).toEqual(['- THEN va a planning', '- AND avisa dos veces', '- AND guarda todo']);
  });

  it('un AND que añade un lado queda en el sitio donde lo puso', () => {
    const merged = mergeRequirementLines({ base, ours: ['- THEN va a planning', '- AND avisa', '- AND guarda'], theirs: ['- THEN va a routing', '- AND avisa', '- AND registra', '- AND guarda'] });
    expect(merged).toEqual(['- THEN va a planning', '- AND avisa', '- AND registra', '- AND guarda']);
  });

  it('un AND que quita un lado no queda', () => {
    const merged = mergeRequirementLines({ base, ours: ['- THEN va a planning', '- AND avisa', '- AND guarda'], theirs: ['- THEN va a routing', '- AND avisa'] });
    expect(merged).toEqual(['- THEN va a planning', '- AND avisa']);
  });

  it('los dos cambian la misma línea de forma distinta y es conflicto', () => {
    expect(mergeRequirementLines({ base, ours: ['- THEN va a planning', '- AND avisa', '- AND guarda'], theirs: ['- THEN va a archive', '- AND avisa', '- AND guarda'] })).toBeNull();
  });

  it('los dos añaden líneas en el mismo hueco y es conflicto', () => {
    expect(mergeRequirementLines({ base, ours: [...base, '- AND uno'], theirs: [...base, '- AND otro'] })).toBeNull();
  });

  it('una línea que no es THEN ni AND en el trozo es conflicto', () => {
    expect(mergeRequirementLines({ base: ['- WHEN entra', ...base], ours: ['- WHEN entra', '- THEN va a planning', '- AND avisa', '- AND guarda'], theirs: ['- WHEN entra', '- THEN va a routing', '- AND avisa dos veces', '- AND guarda'] })).toBeNull();
    expect(mergeRequirementLines({ base: [...base, ''], ours: ['- THEN va a planning', '- AND avisa', '- AND guarda', ''], theirs: ['- THEN va a routing', '- AND avisa dos veces', '- AND guarda', ''] })).toBeNull();
  });
});
