import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { build, project } from './helpers.ts';

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

function git(cwd: string, ...args: string[]): void {
  const result = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], {
    cwd,
    env: cleanEnv,
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
}

function addPatch(root: string, folder: string): void {
  const dir = join(root, '.docs/sdd/specs', folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'patch.md'), '---\ncreated: 2026-10-08\n---\n\n## 5. Tiempo\n\n- Tipo: patch\n- Estimación: 1h\n- Real: 1h\n');
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', folder);
}

describe('sdd estimation log: release por el tag en git', () => {
  it('a patch merged after a same-day cut stays unpublished, and two same-day releases are not mixed up', () => {
    const root = project({ 'changelog.md': '# Changelog\n\n## [0.1.1] - 2026-10-08\n\n- algo\n\n## [0.1.0] - 2026-10-08\n\n- algo\n' });
    git(root, 'init', '-q');
    addPatch(root, '20261008-080000-patch-0056-primera');
    git(root, 'tag', 'v0.1.0');
    addPatch(root, '20261008-090000-patch-0057-antes');
    git(root, 'tag', 'v0.1.1');
    addPatch(root, '20261008-110000-patch-0058-despues');
    const { text } = build(root);
    expect(text).toMatch(/^\| 0\.1\.0 \| 1 \|/m);
    expect(text).toMatch(/^\| 0\.1\.1 \| 1 \|/m);
    expect(text).toMatch(/^\| sin publicar \| 1 \|/m);
  });
});
