import { readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { markdownFiles, repoRoot } from './kit-files.ts';

// Las skills de la 3.0.0 leen PRODUCT.md, ROADMAP.md, CHANGELOG.md, steering/ y changes/; una ruta 2.x solo vive
// donde se trata la forma 2.x a propósito, para mandar a migrar o para migrar.
const PATH_2X = /mission\.md|tech-stack\.md|environments\.md|\.docs\/sdd\/(roadmap|changelog|constitution|architecture|estimation)\.md|\.docs\/sdd\/specs/;

const ALLOWED: Record<string, string> = {
  'skills/add-to-changelog/SKILL.md': 'enlaza las carpetas de los cambios anteriores a la 3.0.0, que siguen en specs/',
  'skills/sdd-end-release/SKILL.md': 'la puerta de forma y el rescate de las validaciones del roadmap 2.x borrado',
  'skills/sdd-init/SKILL.md': 'el predicado de un template o de documentos 2.x sin marcador',
  'skills/sdd-init/references/structure.md': 'un template 2.x conserva su forma hasta migrar',
  'skills/sdd-propose/references/coherence-pass.md': 'specs/ como carpeta de evidencia que el repaso no toca',
  'skills/sdd-roadmap/SKILL.md': 'la puerta de forma',
  'skills/sdd-templates/SKILL.md': 'la plantilla 2.x del roadmap, que solo lee la migración v2.3.0',
};
const MIGRATING = 'skills/sdd-upgrade/';

const toRepo = (path: string) => relative(repoRoot, path).split(sep).join('/');

function mentions2x(): string[] {
  return ['skills', 'includes']
    .flatMap((dir) => markdownFiles(join(repoRoot, dir)))
    .flatMap((path) =>
      readFileSync(path, 'utf8')
        .split(/\r?\n/)
        .flatMap((line, index) => (PATH_2X.test(line) ? [`${toRepo(path)}:${index + 1}`] : [])),
    );
}

describe('las rutas 2.x en skills/ e includes/', () => {
  const found = mentions2x();

  it('solo en sdd-upgrade y en los ficheros de la lista, con su motivo', () => {
    expect(found.filter((at) => !at.startsWith(MIGRATING) && !(at.split(':')[0] in ALLOWED))).toEqual([]);
  });

  it('cada fichero de la lista sigue nombrando una ruta 2.x', () => {
    expect(Object.keys(ALLOWED).filter((file) => !found.some((at) => at.startsWith(`${file}:`)))).toEqual([]);
  });

  it('detecta una ruta 2.x', () => {
    expect(['`.docs/sdd/mission.md`', '`.docs/sdd/specs/<ts>-feature-<id>/`', 'steering/operations.md'].map((line) => PATH_2X.test(line))).toEqual([true, true, false]);
  });
});
