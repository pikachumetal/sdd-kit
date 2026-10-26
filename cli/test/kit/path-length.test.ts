import { describe, it, expect } from 'vitest';
import { gitSync } from '../../src/git/git.ts';
import { repoRoot } from './kit-files.ts';

// Windows corta en 260 caracteres la ruta absoluta. El clon del plugin en
// ~/.claude/plugins/marketplaces/sdd-kit/ ya gasta unos 50 y un usuario o una carpeta de
// clonado largos llegan a ~120: 140 relativos es lo que deja margen para esas bases.
const MAX_RELATIVE_LENGTH = 140;

// También los ficheros sin versionar no ignorados: antes de `git add` el test pasaba en falso (ticket 0063 §3).
const paths = gitSync(repoRoot, ['ls-files', '--cached', '--others', '--exclude-standard']) ?? [];

describe('longitud de las rutas versionadas y por versionar', () => {
  it('lista ficheros versionados', () => {
    expect(paths.length).toBeGreaterThan(0);
  });

  it('ninguna ruta relativa llega a 140 caracteres', () => {
    const tooLong = paths.filter((path) => path.length >= MAX_RELATIVE_LENGTH).map((path) => `${path.length} ${path}`);
    expect(tooLong, 'rompen el clon del plugin en Windows (límite de 260 en la ruta absoluta)').toEqual([]);
  });
});
