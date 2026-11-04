import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot, run, type RunResult } from './process.ts';

const check = join(kitRoot, 'tests', 'copies', 'check.ts');
const ORIGINAL = '# Skill A\n\nThe original paragraph, with enough words to make several shingles of six words each.\n';

function git(args: string[]): string {
  const result = run('git', args);
  if (result.code !== 0) throw new Error(`git ${args.join(' ')}: ${result.output}`);
  return result.output;
}

function writeFiles(root: string, files: Record<string, string>): void {
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
}

// Un clone del repo acme/juguete con un tag por versión; su origin es una URL de GitHub que nadie puede descargar.
function newClone(root: string, releases: Record<string, Record<string, string>>): string {
  const clone = join(root, 'upstream', 'juguete').replaceAll('\\', '/');
  git(['init', '-q', '-b', 'main', clone]);
  for (const [tag, files] of Object.entries(releases)) {
    writeFiles(clone, files);
    git(['-C', clone, 'add', '-A']);
    git(['-C', clone, '-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', tag]);
    git(['-C', clone, 'tag', tag]);
  }
  git(['-C', clone, 'remote', 'add', 'origin', 'https://github.com/acme/juguete']);
  return clone;
}

interface ToyCopy {
  kit: string;
  version?: string;
  path?: string;
  pending?: string;
}

function newRepo(root: string, copies: ToyCopy[], kitFiles: Record<string, string>, notCopied?: string[]): string {
  const registry = {
    sources: { Juguete: { repo: 'acme/juguete', tagPrefix: 'v', license: 'MIT', copyright: 'Copyright (c) 2026 Acme', notCopied } },
    entries: copies.map(({ kit, version = 'v1.0.0', path = 'skills/a/SKILL.md', pending }) => ({ kind: 'copy', source: 'Juguete', version, paths: [path], kit: [kit], pending })),
  };
  writeFiles(join(root, 'repo'), { 'upstream.json': JSON.stringify(registry, null, 2), ...kitFiles });
  return join(root, 'repo', 'upstream.json');
}

function runCheck(registry: string, upstream: string): RunResult {
  return run(process.execPath, [check, registry], { env: { ...cleanGitEnv, SDD_UPSTREAM_DIR: upstream } });
}

const newRoot = (): string => mkdtempSync(join(tmpdir(), 'copies-'));

const update = join(kitRoot, 'tests', 'copies', 'update.ts');

function runUpdate(registry: string, upstream: string, source: string, tag: string): RunResult {
  return run(process.execPath, [update, source, tag, registry], { env: { ...cleanGitEnv, SDD_UPSTREAM_DIR: upstream } });
}

const V1 = '# Skill A\n\nFirst paragraph.\n\nSecond paragraph.\n';
const V2 = '# Skill A\n\nFirst paragraph.\n\nSecond paragraph.\n\nThird paragraph.\n';
const KIT = '# Skill A\n\n<!-- kit: 0302 · sustituye: «First paragraph.» -->\nThe kit paragraph.\n\nSecond paragraph.\n';
const kitFile = (root: string): string => readFileSync(join(root, 'repo', 'skills/sdd-a/SKILL.md'), 'utf8');
const registryOf = (path: string): { entries: { version: string }[] } => JSON.parse(readFileSync(path, 'utf8'));

describe('kit:copies-update (tests/copies/update.ts)', () => {
  it('merges a copy and bumps its version', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': V1 }, 'v1.1.0': { 'skills/a/SKILL.md': V2 } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': KIT });
    expect(runUpdate(registry, join(root, 'upstream'), 'Juguete', 'v1.1.0')).toEqual({ output: 'skills/sdd-a/SKILL.md: v1.0.0 → v1.1.0, 0 conflictos', code: 0 });
    expect(kitFile(root)).toBe(`${KIT}\nThird paragraph.\n`);
    expect(registryOf(registry).entries[0].version).toBe('v1.1.0');
  });

  it('lists the blocks inside each conflict and kit:copies reports the unresolved conflict', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': V1 }, 'v1.1.0': { 'skills/a/SKILL.md': V1.replace('First paragraph.', 'First paragraph, rewritten.') } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': KIT });
    expect(runUpdate(registry, join(root, 'upstream'), 'Juguete', 'v1.1.0')).toEqual({
      output: 'skills/sdd-a/SKILL.md: v1.0.0 → v1.1.0, 1 conflictos\nskills/sdd-a/SKILL.md:3: conflicto con el bloque 0302; si te quedas con la versión de la fuente, el bloque se pierde',
      code: 1,
    });
    expect(runCheck(registry, join(root, 'upstream')).output).toContain('skills/sdd-a/SKILL.md:3: conflicto de git merge-file sin resolver');
  });

  it('skips a copy whose original moved', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': V1 }, 'v1.1.0': { 'skills/b/SKILL.md': V1 } });
    git(['-C', join(root, 'upstream', 'juguete'), 'rm', '-q', 'skills/a/SKILL.md']);
    git(['-C', join(root, 'upstream', 'juguete'), '-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '-m', 'v1.2.0']);
    git(['-C', join(root, 'upstream', 'juguete'), 'tag', 'v1.2.0']);
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': KIT });
    expect(runUpdate(registry, join(root, 'upstream'), 'Juguete', 'v1.2.0')).toEqual({
      output: 'skills/sdd-a/SKILL.md: su original skills/a/SKILL.md no existe en v1.2.0: mapéalo antes de actualizar',
      code: 1,
    });
    expect(registryOf(registry).entries[0].version).toBe('v1.0.0');
  });

  it('writes nothing when merge-file fails', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': V1 }, 'v1.1.0': { 'skills/a/SKILL.md': 'binary\0content\n' } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': KIT });
    const before = readFileSync(registry, 'utf8');
    const result = runUpdate(registry, join(root, 'upstream'), 'Juguete', 'v1.1.0');
    expect(result.code).toBe(1);
    expect(result.output).toMatch(/^skills\/sdd-a\/SKILL\.md: git merge-file falló/);
    expect(kitFile(root)).toBe(KIT);
    expect(readFileSync(registry, 'utf8')).toBe(before);
  });

  it('leaves a pending copy untouched and rewrites only the versions it merged', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': V1, 'skills/a/other.md': 'x\n' }, 'v1.1.0': { 'skills/a/SKILL.md': V2 } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }, { kit: 'skills/sdd-a/other.md', path: 'skills/a/other.md', pending: '0312' }], {
      'skills/sdd-a/SKILL.md': KIT,
      'skills/sdd-a/other.md': 'kit other\n',
    });
    const expected = JSON.parse(readFileSync(registry, 'utf8'));
    expected.entries[0].version = 'v1.1.0';
    expect(runUpdate(registry, join(root, 'upstream'), 'Juguete', 'v1.1.0').code).toBe(0);
    expect(readFileSync(registry, 'utf8')).toBe(`${JSON.stringify(expected, null, 2)}\n`);
    expect(readFileSync(join(root, 'repo', 'skills/sdd-a/other.md'), 'utf8')).toBe('kit other\n');
  });
});

describe('kit:copies (tests/copies/check.ts)', () => {
  it('reports a pending copy in one line', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': ORIGINAL } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md', pending: '0312' }], { 'skills/sdd-a/SKILL.md': 'lo que sea\n' });
    expect(runCheck(registry, join(root, 'upstream'))).toEqual({ output: 'skills/sdd-a/SKILL.md: sin anotar → 0312', code: 1 });
  });

  it('reports an unmapped source file', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': ORIGINAL, 'skills/a/references/fix-loop.md': 'x\n' } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': ORIGINAL });
    expect(runCheck(registry, join(root, 'upstream'))).toEqual({
      output: 'Juguete@v1.0.0: skills/a/references/fix-loop.md está en la carpeta de una copia y no en upstream.json: mapéalo en paths, from o notCopied',
      code: 1,
    });
  });

  it('prints Copias al día and exits 0', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': ORIGINAL, 'skills/a/references/fix-loop.md': 'x\n' } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': ORIGINAL }, ['skills/a/references/fix-loop.md']);
    expect(runCheck(registry, join(root, 'upstream'))).toEqual({ output: 'Copias al día: 1 ficheros.', code: 0 });
  });

  it('reports a missing original', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': ORIGINAL } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md', path: 'skills/a/GONE.md' }], { 'skills/sdd-a/SKILL.md': ORIGINAL });
    const result = runCheck(registry, join(root, 'upstream'));
    expect(result.output).toContain('skills/sdd-a/SKILL.md: su original skills/a/GONE.md no existe en v1.0.0');
    expect(result.code).toBe(1);
  });

  it('reports a missing tag without fetching', () => {
    const root = newRoot();
    const clone = newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': ORIGINAL } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md', version: 'v1.1.0' }], { 'skills/sdd-a/SKILL.md': ORIGINAL });
    expect(runCheck(registry, join(root, 'upstream'))).toEqual({ output: `Juguete: falta v1.1.0 en el clon ${join(clone)}`, code: 1 });
  });

  it('reports a copy below 50 %', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': ORIGINAL } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': '# Skill A\n\n<!-- kit: 0302 · sustituye: «The original paragraph…each.» -->\nThe kit rewrote it.\n' });
    const result = runCheck(registry, join(root, 'upstream'));
    expect(result.output).toBe('skills/sdd-a/SKILL.md: conserva el 0 % de su original skills/a/SKILL.md; por debajo del 50 % es propia: pásala a own');
    expect(result.code).toBe(1);
  });

  it('checks a md copy against its original', () => {
    const root = newRoot();
    newClone(root, { 'v1.0.0': { 'skills/a/SKILL.md': ORIGINAL } });
    const registry = newRepo(root, [{ kit: 'skills/sdd-a/SKILL.md' }], { 'skills/sdd-a/SKILL.md': `${ORIGINAL}Kit line.\n` });
    expect(runCheck(registry, join(root, 'upstream'))).toEqual({ output: 'skills/sdd-a/SKILL.md:4: texto que no es del original ni está en un bloque del kit', code: 1 });
  });
});
