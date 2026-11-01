import { describe, it, expect } from 'vitest';
import { citedKinds } from '../../src/comments/citations.ts';

describe('citedKinds', () => {
  it.each([
    ['// según la spec §3', ['spec']],
    ['// ver spec.md', ['spec']],
    ['// sección §12', ['spec']],
    ['// Task 4: validar antes de guardar', ['task']],
    ['// tarea 12', ['task']],
    ['// heredado (patch 0258)', ['task']],
    ['// feature 0168', ['task']],
    ['// lo pide la constitution', ['constitution']],
    ['// lo pide la constitución', ['constitution']],
    ['// Art. X', ['constitution']],
    ['// artículo IV', ['constitution']],
    ['// REQ-12', ['requisito']],
    ['// requirements de la API', ['requisito']],
    ['// ver capabilities/booking.md', ['capabilities/']],
  ])('%s', (comment, kinds) => {
    expect(citedKinds(comment)).toEqual(kinds);
  });

  it('una línea que cita dos cosas lleva las dos, en orden fijo', () => {
    expect(citedKinds('// requisito de la spec')).toEqual(['spec', 'requisito']);
  });

  it.each([
    '// ver foo.spec.ts',
    '// patch 3 del proveedor',
    '// moon hereda el entorno: sin limpiarlo usa otro workspace',
    '// las capabilities del token',
    '// el Artículo de portada',
  ])('no cita nada: %s', (comment) => {
    expect(citedKinds(comment)).toEqual([]);
  });
});
