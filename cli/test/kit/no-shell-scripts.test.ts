import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { gitSync } from '../../src/git/git.ts';
import { repoRoot } from './kit-files.ts';

// Los scripts del repo son Node para que corran igual en Windows, Linux y macOS (tech-stack.md).
// .docs/sdd/specs/ es evidencia histórica y no se toca.
const EVIDENCE = '.docs/sdd/specs/';

// También los ficheros sin versionar no ignorados: sin ellos, el test pasa en falso antes de `git add`.
const paths = (gitSync(repoRoot, ['ls-files', '--cached', '--others', '--exclude-standard']) ?? []).filter(
  (path) => !path.startsWith(EVIDENCE) && existsSync(join(repoRoot, path)) && statSync(join(repoRoot, path)).isFile(),
);

const firstLine = (path: string) => readFileSync(join(repoRoot, path), 'utf8').split('\n', 1)[0];

describe('el repo sin scripts de shell', () => {
  it('lista ficheros versionados', () => {
    expect(paths.length).toBeGreaterThan(0);
  });

  it('ningún .sh ni .ps1 fuera de .docs/sdd/specs/', () => {
    expect(paths.filter((path) => /\.(sh|ps1)$/i.test(path))).toEqual([]);
  });

  // La extensión es un indicador, no la propiedad: un script de bash sin extensión se escapó en la 0238.
  it('ningún fichero sin extensión empieza por #! con sh o bash', () => {
    const shebangs = paths.filter((path) => extname(path) === '' && /^#!.*\b(ba)?sh\b/.test(firstLine(path)));
    expect(shebangs).toEqual([]);
  });
});
