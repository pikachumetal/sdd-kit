import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { commit, git, runNext, tempDir } from './helpers.ts';

function sequenceProject(files: Record<string, string>): string {
  const project = join(tempDir(), 'project');
  const all = { '.docs/sdd/sdd-kit.json': '{"ids":{"mode":"sequence"}}', ...files };
  for (const [relative, content] of Object.entries(all)) {
    mkdirSync(dirname(join(project, relative)), { recursive: true });
    writeFileSync(join(project, relative), content);
  }
  return project;
}

const row = (id: string) => `| ${id} | **Fila** | ⏳ |\n`;

describe('id next con la estructura 3.0.0', () => {
  it('id next cuenta changes/ y los dos roadmaps', async () => {
    const project = sequenceProject({
      '.docs/sdd/specs/20260920-100000-feature-0079-b/spec.md': '',
      '.docs/sdd/changes/20261010-090000-feature-0081-c/spec.md': '',
      'ROADMAP.md': row('0083'),
      '.docs/sdd/roadmap.md': row('0085'),
    });
    const result = await runNext(project);
    expect(result.lines).toEqual(['0086']);
    expect(result.code).toBe(0);
    expect((await runNext(sequenceProject({ 'ROADMAP.md': row('0093') }))).lines).toEqual(['0094']);
    const changesOnly = sequenceProject({ '.docs/sdd/changes/20261010-090000-feature-0095-c/spec.md': '' });
    expect((await runNext(changesOnly)).lines).toEqual(['0096']);
  });

  it('id next lee ROADMAP.md y changes/ de otra rama', async () => {
    const project = sequenceProject({ '.docs/sdd/roadmap.md': row('0010') });
    git(project, ['init', '-q', '-b', 'main']);
    commit(project, 'base');
    git(project, ['switch', '-qc', 'otra']);
    writeFileSync(join(project, 'ROADMAP.md'), row('0090'));
    mkdirSync(join(project, '.docs/sdd/changes/20261010-090000-feature-0088-x'), { recursive: true });
    writeFileSync(join(project, '.docs/sdd/changes/20261010-090000-feature-0088-x/spec.md'), '');
    commit(project, 'raíz');
    git(project, ['switch', '-q', 'main']);
    expect((await runNext(project)).lines).toEqual(['0091']);
  });

  it('una carpeta en changes y otra en specs con el mismo id son duplicado', async () => {
    const project = sequenceProject({
      '.docs/sdd/specs/20260920-100000-feature-0079-b/spec.md': '',
      '.docs/sdd/changes/20261010-090000-patch-0079-c/patch.md': '',
    });
    const result = await runNext(project);
    expect(result.lines).toEqual([]);
    expect(result.stderr).toContain('0079');
    expect(result.code).toBe(1);
  });
});
