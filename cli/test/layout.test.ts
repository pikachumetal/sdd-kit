import { describe, it, expect } from 'vitest';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { changeFolders, estimationLogPath, projectRoot, resolveDocument, shadowWarning } from '../src/cli/layout.ts';

function project(files: string[]): { root: string; docs: string } {
  const root = mkdtempSync(join(tmpdir(), 'sdd-layout-'));
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), '');
  }
  return { root, docs: join(root, '.docs/sdd') };
}

describe('layout de documentos', () => {
  it('resolveDocument elige ROADMAP.md y marca el viejo como sombra', () => {
    const { root, docs } = project(['ROADMAP.md', '.docs/sdd/roadmap.md']);
    const resolved = resolveDocument(docs, 'roadmap');
    expect(resolved.file).toBe(join(root, 'ROADMAP.md'));
    expect(resolved.shadowed).toBe(join(docs, 'roadmap.md'));
    expect(shadowWarning(docs, resolved.shadowed!)).toBe('aviso: también existe .docs/sdd/roadmap.md, que no se lee');
  });

  it('solo 2.x devuelve el viejo sin sombra', () => {
    const { docs } = project(['.docs/sdd/roadmap.md', '.docs/sdd/changelog.md']);
    expect(resolveDocument(docs, 'roadmap')).toEqual({ file: join(docs, 'roadmap.md'), shadowed: null });
    expect(resolveDocument(docs, 'changelog').file).toBe(join(docs, 'changelog.md'));
    expect(resolveDocument(docs, 'estimation')).toEqual({ file: null, shadowed: null });
  });

  it('changeFolders devuelve changes y specs', () => {
    const { docs } = project(['.docs/sdd/changes/x/spec.md', '.docs/sdd/specs/y/spec.md']);
    expect(changeFolders(docs)).toEqual([join(docs, 'changes'), join(docs, 'specs')]);
    expect(changeFolders(project(['.docs/sdd/specs/y/spec.md']).docs)).toHaveLength(1);
  });

  it('projectRoot normaliza la barra final', () => {
    const { root, docs } = project([]);
    expect(projectRoot(`${docs}/`)).toBe(root);
    expect(projectRoot(join(root, '.', '.docs', 'sdd'))).toBe(root);
  });

  it('estimationLogPath va a steering con estimation.md en steering', () => {
    const { docs } = project(['.docs/sdd/steering/estimation.md']);
    expect(estimationLogPath(docs)).toBe(join(docs, 'steering', 'estimation-log.md'));
    const empty = project([]).docs;
    expect(estimationLogPath(empty)).toBe(join(empty, 'estimation-log.md'));
  });
});
