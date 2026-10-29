import { describe, it, expect } from 'vitest';
import { dedupeRows, lineKey, mergeKeyedHunk } from '../../src/merge/keyed.ts';

const row = (id: string, text: string, state = '⏳') => `| ${id} | ${text} | ${state} |`;

describe('lineKey', () => {
  it('da la primera celda de una fila, el id en negrita de una entrada y null en lo demás', () => {
    expect(lineKey(row('0190', 'algo'))).toBe('0190');
    expect(lineKey('- **Feature 0185** — algo')).toBe('Feature 0185');
    expect(lineKey('| --- | --- | --- |')).toBeNull();
    expect(lineKey('### Added')).toBeNull();
    expect(lineKey('texto')).toBeNull();
  });
});

describe('mergeKeyedHunk', () => {
  it('keyed: un lado cambia una fila y el otro añade una debajo', () => {
    const merged = mergeKeyedHunk({ base: [row('0190', 'algo')], ours: [row('0190', 'algo', '✅')], theirs: [row('0190', 'algo'), row('0201', 'nueva')] });
    expect(merged).toEqual({ lines: [row('0190', 'algo', '✅'), row('0201', 'nueva')], duplicates: [] });
  });

  it('keyed: la misma fila nueva en los dos lados queda una', () => {
    const merged = mergeKeyedHunk({ base: [], ours: [row('0201', 'nueva')], theirs: [row('0201', 'nueva')] });
    expect(merged).toEqual({ lines: [row('0201', 'nueva')], duplicates: [] });
  });

  it('keyed: dos filas distintas con el mismo id se quedan, la de la destino primero, y se avisan', () => {
    const merged = mergeKeyedHunk({ base: [], ours: [row('0201', 'una')], theirs: [row('0201', 'otra')] });
    expect(merged).toEqual({ lines: [row('0201', 'una'), row('0201', 'otra')], duplicates: ['0201'] });
  });

  it('keyed: el mismo id en Added y en Changed son ids distintos', () => {
    const merged = mergeKeyedHunk({
      base: ['### Added', '', '### Changed', ''],
      ours: ['### Added', '', '- **Feature 0185** — añade', '### Changed', ''],
      theirs: ['### Added', '', '### Changed', '', '- **Feature 0185** — cambia'],
    });
    expect(merged).toEqual({ lines: ['### Added', '', '- **Feature 0185** — añade', '### Changed', '', '- **Feature 0185** — cambia'], duplicates: [] });
  });

  it('keyed: los dos cambian distinto la misma fila de la base es conflicto', () => {
    expect(mergeKeyedHunk({ base: [row('0190', 'algo')], ours: [row('0190', 'algo', '✅')], theirs: [row('0190', 'algo', '🔄')] })).toBeNull();
  });

  it('keyed: borrar en un lado y cambiar en el otro es conflicto', () => {
    expect(mergeKeyedHunk({ base: [row('0190', 'algo')], ours: [], theirs: [row('0190', 'algo', '✅')] })).toBeNull();
    expect(mergeKeyedHunk({ base: [row('0190', 'algo')], ours: [row('0190', 'algo', '✅')], theirs: [] })).toBeNull();
  });

  it('keyed: una fila nueva cuya ancla borró la destino va al principio del trozo', () => {
    const merged = mergeKeyedHunk({ base: [row('0190', 'algo'), row('0191', 'otra')], ours: [row('0191', 'otra')], theirs: [row('0190', 'algo'), row('0201', 'nueva'), row('0191', 'otra')] });
    expect(merged).toEqual({ lines: [row('0201', 'nueva'), row('0191', 'otra')], duplicates: [] });
  });

  it('keyed: las nuevas de la rama van detrás de las nuevas de la destino', () => {
    const merged = mergeKeyedHunk({ base: [row('0190', 'algo')], ours: [row('0190', 'algo'), row('0200', 'destino')], theirs: [row('0190', 'algo'), row('0201', 'rama')] });
    expect(merged).toEqual({ lines: [row('0190', 'algo'), row('0200', 'destino'), row('0201', 'rama')], duplicates: [] });
  });

  it('keyed: líneas sin id distintas en los dos lados dan null', () => {
    expect(mergeKeyedHunk({ base: [], ours: ['texto de la destino'], theirs: ['texto de la rama'] })).toBeNull();
  });
});

describe('guardas de la unión por id', () => {
  it('keyed: si la rama reordena filas de la base es conflicto', () => {
    expect(mergeKeyedHunk({ base: [row('0190', 'a'), row('0191', 'b')], ours: [row('0190', 'a', '✅'), row('0191', 'b')], theirs: [row('0191', 'b'), row('0190', 'a')] })).toBeNull();
  });

  it('dedupeRows quita la fila repetida idéntica y avisa de dos distintas con el mismo id', () => {
    expect(dedupeRows(['### Changed', row('0201', 'x'), row('0201', 'x'), row('0202', 'y'), row('0202', 'z')])).toEqual({
      lines: ['### Changed', row('0201', 'x'), row('0202', 'y'), row('0202', 'z')],
      duplicates: ['0202'],
    });
  });
});

describe('dedupeRows con más de dos filas del mismo id', () => {
  it('con a, b, b deja a y b y avisa una vez', () => {
    expect(dedupeRows([row('0202', 'a'), row('0202', 'b'), row('0202', 'b')])).toEqual({ lines: [row('0202', 'a'), row('0202', 'b')], duplicates: ['0202'] });
  });

  it('la cabecera de una tabla no lleva id', () => {
    const header = ['| Id | Tarea |', '| --- | --- |'];
    expect(dedupeRows([...header, ...header])).toEqual({ lines: [...header, ...header], duplicates: [] });
  });
});

describe('la cabecera de una tabla en la unión por id', () => {
  const header = '| Id | Tarea | Estado |';
  const separator = '| --- | --- | --- |';

  it('la misma tabla nueva en los dos lados queda una con las dos filas', () => {
    expect(mergeKeyedHunk({ base: [], ours: [header, separator, row('0210', 'x')], theirs: [header, separator, row('0211', 'y')] })).toEqual({
      lines: [header, separator, row('0210', 'x'), row('0211', 'y')],
      duplicates: [],
    });
  });

  it('una cabecera de la base que el trozo separa de su separador no cuenta como fila con id', () => {
    const hunk = { base: [], ours: [header], theirs: ['| Id | Tarea | Estado | Tamaño |'] };

    expect(mergeKeyedHunk(hunk)).toEqual({ lines: [header, '| Id | Tarea | Estado | Tamaño |'], duplicates: ['Id'] });
    expect(mergeKeyedHunk(hunk, { headers: new Set([header, '| Id | Tarea | Estado | Tamaño |']), column: 0 })).toBeNull();
  });
});

describe('la columna de id de la tabla del trozo', () => {
  it('en una tabla cuya columna de id es la segunda, dos filas del mismo día no son un id repetido', () => {
    const merged = mergeKeyedHunk({ base: [], ours: ['| 2026-10-20 | 0205 | a |'], theirs: ['| 2026-10-20 | 0206 | b |'] }, { headers: new Set(), column: 1 });

    expect(merged).toEqual({ lines: ['| 2026-10-20 | 0205 | a |', '| 2026-10-20 | 0206 | b |'], duplicates: [] });
  });
});

describe('una fila que cambian los dos lados en celdas distintas', () => {
  it('keyed: la rama cambia el estado y la destino la descripción, y la fila queda con los dos cambios', () => {
    const merged = mergeKeyedHunk({ base: [row('0248', 'tres casos')], ours: [row('0248', 'tres casos', '✅')], theirs: [row('0248', 'cuatro casos')] });
    expect(merged).toEqual({ lines: [row('0248', 'cuatro casos', '✅')], duplicates: [] });
  });

  it('keyed: con distinto número de celdas es conflicto', () => {
    expect(mergeKeyedHunk({ base: [row('0248', 'algo')], ours: [row('0248', 'algo', '✅')], theirs: ['| 0248 | algo | ⏳ | S |'] })).toBeNull();
  });
});

describe('la clave de una fila de deuda no cuenta el prefijo de cierre', () => {
  const debt = (item: string, destination: string) => `| ${item} | Bajo | ${destination} |`;
  const closed = '**[Feature 0216, 2026-10-28: saldada — [walkthrough](specs/x/walkthrough.md)]** ';
  const partial = '**[Patch 0254, 2026-10-28: parcial — [patch](specs/y/patch.md); queda: la (a)]** ';

  it('keyed: la rama salda la fila y la destino cambia su Destino, y queda una fila con los dos cambios', () => {
    const merged = mergeKeyedHunk({
      base: [debt('**Tres tests** — x', 'Actuar → 0216')],
      ours: [debt('**Tres tests** — x', 'Actuar → 0216 (segundo caso)')],
      theirs: [debt(`${closed}**Tres tests** — x`, 'Actuar → 0216')],
    });
    expect(merged).toEqual({ lines: [debt(`${closed}**Tres tests** — x`, 'Actuar → 0216 (segundo caso)')], duplicates: [] });
  });

  it('keyed: un prefijo «parcial» encima de otro cuenta como prefijo', () => {
    const merged = mergeKeyedHunk({
      base: [debt(`${closed}**Menores** — a`, 'Actuar')],
      ours: [debt(`${partial}${closed}**Menores** — a`, 'Actuar')],
      theirs: [debt(`${closed}**Menores** — a`, 'Actuar → 0254')],
    });
    expect(merged).toEqual({ lines: [debt(`${partial}${closed}**Menores** — a`, 'Actuar → 0254')], duplicates: [] });
  });

  it('keyed: los dos lados añaden prefijos distintos a la misma fila y es conflicto', () => {
    expect(mergeKeyedHunk({
      base: [debt('**Menores** — a', 'Actuar')],
      ours: [debt(`${partial}**Menores** — a`, 'Actuar')],
      theirs: [debt(`${closed}**Menores** — a`, 'Actuar')],
    })).toBeNull();
  });
});
