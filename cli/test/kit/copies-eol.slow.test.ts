import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { indexEols } from '../../../tests/copies/check.ts';
import { cleanGitEnv, kitRoot, run, type RunResult } from './process.ts';
import { tempDirs, writeTree } from './temp-tree.ts';

const check = join(kitRoot, 'tests', 'copies', 'check.ts');
const newRoot = tempDirs().bind(null, 'eol-');

function git(args: string[]): string {
  const result = run('git', args);
  if (result.code !== 0) throw new Error(`git ${args.join(' ')}: ${result.output}`);
  return result.output;
}

const commitAll = (repo: string): string => git(['-C', repo, '-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', 'x']);

// Un repo con eol=lf y autocrlf, como un checkout de Windows anterior a .gitattributes: lo que se commitea queda en LF.
function newRepo(root: string, files: Record<string, string>): string {
  const repo = join(root, 'repo');
  git(['init', '-q', '-b', 'main', repo]);
  git(['-C', repo, 'config', 'core.autocrlf', 'true']);
  writeTree(repo, { '.gitattributes': '* text eol=lf\n', ...files });
  git(['-C', repo, 'add', '-A']);
  commitAll(repo);
  return repo;
}

// Guarda en el índice los bytes tal cual, sin los filtros de eol=lf: así queda un blob con CRLF, como en un
// commit hecho antes de .gitattributes.
function stageRaw(repo: string, file: string, content: string): void {
  writeFileSync(join(repo, file), content);
  const blob = git(['-C', repo, 'hash-object', '-w', '--no-filters', file]).trim();
  git(['-C', repo, 'update-index', '--cacheinfo', `100644,${blob},${file}`]);
}

const ORIGINAL = '# Skill A\n\nThe original paragraph, with enough words to make several shingles of six words each.\n';

describe('indexEols', () => {
  it('reads lf from the index of a file rewritten in CRLF on disk', async () => {
    const repo = newRepo(newRoot(), { 'skills/a/SKILL.md': 'a\nb\n' });
    writeFileSync(join(repo, 'skills/a/SKILL.md'), 'a\r\nb\r\n');
    expect(await indexEols(repo, ['skills/a/SKILL.md'])).toEqual(new Map([['skills/a/SKILL.md', 'lf']]));
  });

  it('reads crlf from the index of a file rewritten in LF on disk', async () => {
    const repo = newRepo(newRoot(), { 'skills/a/SKILL.md': 'a\nb\n' });
    stageRaw(repo, 'skills/a/SKILL.md', 'a\r\nb\r\n');
    writeFileSync(join(repo, 'skills/a/SKILL.md'), 'a\nb\n');
    expect(await indexEols(repo, ['skills/a/SKILL.md'])).toEqual(new Map([['skills/a/SKILL.md', 'crlf']]));
  });

  it('reads mixed from the index of a file with both line endings', async () => {
    const repo = newRepo(newRoot(), { 'skills/a/SKILL.md': 'a\nb\n' });
    stageRaw(repo, 'skills/a/SKILL.md', 'a\r\nb\n');
    expect(await indexEols(repo, ['skills/a/SKILL.md'])).toEqual(new Map([['skills/a/SKILL.md', 'mixed']]));
  });

  it('reads a path with spaces and accents', async () => {
    const repo = newRepo(newRoot(), { 'sub dir/áé.md': 'a\n' });
    expect(await indexEols(repo, ['sub dir/áé.md'])).toEqual(new Map([['sub dir/áé.md', 'lf']]));
  });

  it('leaves out a file git does not track', async () => {
    const repo = newRepo(newRoot(), { 'skills/a/SKILL.md': 'a\n' });
    writeFileSync(join(repo, 'skills/b.md'), 'b\r\n');
    expect(await indexEols(repo, ['skills/a/SKILL.md', 'skills/b.md'])).toEqual(new Map([['skills/a/SKILL.md', 'lf']]));
  });

  it('gives an empty map outside a repo', async () => {
    const root = newRoot();
    writeTree(root, { 'a.md': 'a\r\n' });
    expect(await indexEols(root, ['a.md'])).toEqual(new Map());
  });
});

// Un clon con una copia en CRLF solo en el disco fusiona sin tocar ficheros; una copia con CRLF en el índice avisa.
describe('kit:copies con el índice', () => {
  function newClone(root: string): string {
    const clone = join(root, 'upstream', 'juguete').replaceAll('\\', '/');
    git(['init', '-q', '-b', 'main', clone]);
    writeTree(clone, { 'skills/a/SKILL.md': ORIGINAL });
    git(['-C', clone, 'add', '-A']);
    commitAll(clone);
    git(['-C', clone, 'tag', 'v1.0.0']);
    git(['-C', clone, 'remote', 'add', 'origin', 'https://github.com/acme/juguete']);
    return clone;
  }

  function newKit(root: string, copy: string): { registry: string; repo: string } {
    const registry = {
      sources: { Juguete: { repo: 'acme/juguete', tagPrefix: 'v', license: 'MIT', copyright: 'Copyright (c) 2026 Acme' } },
      entries: [{ kind: 'copy', source: 'Juguete', version: 'v1.0.0', paths: ['skills/a/SKILL.md'], kit: ['skills/sdd-a/SKILL.md'] }],
    };
    const repo = newRepo(root, { 'upstream.json': JSON.stringify(registry, null, 2), 'skills/sdd-a/SKILL.md': copy });
    return { registry: join(repo, 'upstream.json'), repo };
  }

  const runCheck = (registry: string, upstream: string): RunResult =>
    run(process.execPath, [check, registry], { env: { ...cleanGitEnv, SDD_UPSTREAM_DIR: upstream } });

  it('passes a copy with CRLF only on disk', () => {
    const root = newRoot();
    newClone(root);
    const { registry, repo } = newKit(root, ORIGINAL.replace(/^---\n[\s\S]*?---\n/, ''));
    const file = join(repo, 'skills/sdd-a/SKILL.md');
    writeFileSync(file, readFileSync(file, 'utf8').replace(/\n/g, '\r\n'));
    expect(runCheck(registry, join(root, 'upstream'))).toEqual({ output: 'Copias al día: 1 ficheros.', code: 0 });
  });

  it('reports a copy with CRLF in the index and LF on disk', () => {
    const root = newRoot();
    newClone(root);
    const { registry, repo } = newKit(root, ORIGINAL);
    stageRaw(repo, 'skills/sdd-a/SKILL.md', ORIGINAL.replace(/\n/g, '\r\n'));
    writeFileSync(join(repo, 'skills/sdd-a/SKILL.md'), ORIGINAL);
    expect(runCheck(registry, join(root, 'upstream')).output).toContain('skills/sdd-a/SKILL.md: tiene finales de línea CRLF; la fuente de una copia va en LF');
  });

  it('still reports a copy git does not track with CRLF', () => {
    const root = newRoot();
    newClone(root);
    const { registry, repo } = newKit(root, ORIGINAL);
    git(['-C', repo, 'rm', '-q', '--cached', 'skills/sdd-a/SKILL.md']);
    writeFileSync(join(repo, 'skills/sdd-a/SKILL.md'), ORIGINAL.replace(/\n/g, '\r\n'));
    expect(runCheck(registry, join(root, 'upstream')).output).toContain('skills/sdd-a/SKILL.md: tiene finales de línea CRLF; la fuente de una copia va en LF');
  });
});
