import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot, run, type RunResult } from './process.ts';

const check = join(kitRoot, 'tests', 'upstream', 'check.ts');

interface Source {
  origin: string;
  clone: string;
  upstream: string;
}

interface ToyEntry {
  version: string;
  paths?: string[];
  kit?: string[];
  pending?: string;
  from?: { source: string; version: string; path: string }[];
}

function git(args: string[]): string {
  const result = run('git', args);
  if (result.code !== 0) throw new Error(`git ${args.join(' ')}: ${result.output}`);
  return result.output;
}

function newRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'upstream-'));
  mkdirSync(join(root, 'upstream', 'vacia'), { recursive: true });
  writeFileSync(join(root, 'upstream', 'notas.txt'), 'no es un clone\n');
  return root;
}

// Cada versión es un commit con los ficheros dados (null borra) y su tag.
function release(origin: string, tag: string, files: Record<string, string | null>): void {
  for (const [path, content] of Object.entries(files)) {
    if (content === null) rmSync(join(origin, path));
    else {
      mkdirSync(dirname(join(origin, path)), { recursive: true });
      writeFileSync(join(origin, path), content);
    }
  }
  git(['-C', origin, 'add', '-A']);
  git(['-C', origin, '-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '--allow-empty', '-m', tag]);
  git(['-C', origin, 'tag', tag]);
}

function newSource(root: string, tags: string[], url = 'https://github.com/acme/juguete'): Source {
  const origin = join(root, 'origins', 'juguete').replaceAll('\\', '/');
  const clone = join(root, 'upstream', 'juguete');
  git(['init', '-q', '-b', 'main', origin]);
  for (const tag of tags) release(origin, tag, { 'a.md': 'a\n' });
  git(['clone', '-q', origin, clone]);
  git(['-C', clone, 'remote', 'set-url', 'origin', url]);
  git(['-C', clone, 'config', `url.${origin}.insteadOf`, url]);
  return { origin, clone, upstream: join(root, 'upstream') };
}

function newRegistry(root: string, entries: ToyEntry[], repo = 'acme/juguete', own?: string[]): string {
  const path = join(root, 'upstream.json');
  const registry = {
    sources: { Juguete: { repo, tagPrefix: 'v', license: 'MIT', copyright: 'Copyright (c) 2026 Acme' } },
    entries: entries.map(({ version, paths = ['a.md'], kit = ['skills/juguete/'], ...rest }) => ({ kind: 'copy', source: 'Juguete', version, paths, kit, ...rest })),
    own,
  };
  writeFileSync(path, JSON.stringify(registry, null, 2));
  return path;
}

function runCheck(registry: string, upstream?: string): RunResult {
  const env = { ...cleanGitEnv };
  delete env.SDD_UPSTREAM_DIR;
  if (upstream !== undefined) env.SDD_UPSTREAM_DIR = upstream;
  return run(process.execPath, [check, registry], { env });
}

const upToDate = { output: 'Fuentes al día: 1 entradas.', code: 0 };

describe('Vigilancia de fuentes (tests/upstream/check.ts)', () => {
  it('S1 todo al día', () => {
    const root = newRoot();
    const source = newSource(root, ['v0.9.0', 'v1.0.0']);
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }]), source.upstream)).toEqual(upToDate);
  });

  it('passes when the newest tag does not touch the entry paths', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v2.0.0', { 'b.md': 'b\n' });
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }]), source.upstream)).toEqual(upToDate);
  });

  it('fails when the entry paths change', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v2.0.0', { 'a.md': 'a cambiada\n' });
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }]), source.upstream)).toEqual({
      output: `Juguete · skills/juguete/: v1.0.0 → v2.0.0, cambian sus rutas: git -C ${source.clone} diff v1.0.0 v2.0.0 -- a.md`,
      code: 1,
    });
  });

  it('fails when a path is gone in the newest tag', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v2.0.0', { 'a.md': null });
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }]), source.upstream)).toEqual({
      output: 'Juguete · skills/juguete/: la ruta a.md no existe en v2.0.0',
      code: 1,
    });
  });

  it('fails when the version is not in the clone', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    expect(runCheck(newRegistry(root, [{ version: 'v0.9.0' }]), source.upstream)).toEqual({
      output: `Juguete: falta v0.9.0 en el clon ${source.clone}`,
      code: 1,
    });
  });

  it('compares a commit version against the newest tag', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    const commit = git(['-C', source.origin, 'rev-parse', '--short', 'v1.0.0']);
    release(source.origin, 'v2.0.0', { 'a.md': 'a cambiada\n' });
    expect(runCheck(newRegistry(root, [{ version: commit }]), source.upstream)).toEqual({
      output: `Juguete · skills/juguete/: ${commit} → v2.0.0, cambian sus rutas: git -C ${source.clone} diff ${commit} v2.0.0 -- a.md`,
      code: 1,
    });
  });

  it('fails without tags of its prefix', () => {
    const root = newRoot();
    const source = newSource(root, ['release-1']);
    expect(runCheck(newRegistry(root, [{ version: 'release-1' }]), source.upstream)).toEqual({
      output: `Juguete: el clon ${source.clone} no tiene tags vX.Y.Z`,
      code: 1,
    });
  });

  it('joins the kit paths of an entry', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v2.0.0', { 'a.md': 'a cambiada\n' });
    const result = runCheck(newRegistry(root, [{ version: 'v1.0.0', kit: ['skills/a/', 'skills/b/'], pending: '0312' }]), source.upstream);
    expect(result.output).toMatch(/^Juguete · skills\/a\/, skills\/b\/: v1\.0\.0 → v2\.0\.0, cambian sus rutas: /);
  });

  it('watches the from of an entry', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v1.1.0', { 'c.md': 'c\n' });
    release(source.origin, 'v2.0.0', { 'c.md': 'c cambiada\n' });
    const from = [{ source: 'Juguete', version: 'v1.1.0', path: 'c.md' }];
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0', kit: ['skills/juguete/SKILL.md'], from }]), source.upstream)).toEqual({
      output: `Juguete · skills/juguete/SKILL.md: v1.1.0 → v2.0.0, cambian sus rutas: git -C ${source.clone} diff v1.1.0 v2.0.0 -- c.md`,
      code: 1,
    });
  });

  it('rejects a copy without pending with more than one file', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0', kit: ['skills/a/', 'skills/b/'] }]), source.upstream)).toEqual({
      output: 'upstream.json: la entrada 1 es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero',
      code: 1,
    });
  });

  it('S3 otras familias y prereleases no cuentan', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v1.1.0-beta', { 'a.md': 'beta\n' });
    release(source.origin, '@acme/juguete@9.9.9', { 'a.md': 'otra familia\n' });
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }]), source.upstream)).toEqual(upToDate);
  });

  it('S4 sin la variable', () => {
    const root = newRoot();
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }]))).toEqual({
      output: 'Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.',
      code: 1,
    });
  });

  it('S5 sin clone', () => {
    const root = newRoot();
    const upstream = join(root, 'upstream');
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }]), upstream)).toEqual({
      output: `Juguete: sin clone de acme/juguete en ${upstream}.`,
      code: 1,
    });
  });

  it('S7 origen inexistente', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    rmSync(source.origin, { recursive: true, force: true });
    const result = runCheck(newRegistry(root, [{ version: 'v1.0.0' }]), source.upstream);
    expect(result.output).toMatch(/^Juguete: no se pudo actualizar el clone: /);
    expect(result.code).toBe(1);
  });

  it('compara 1.10.0 por encima de 1.9.0', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.9.0']);
    release(source.origin, 'v1.10.0', { 'a.md': 'a cambiada\n' });
    expect(runCheck(newRegistry(root, [{ version: 'v1.9.0' }]), source.upstream).output).toMatch(/v1\.9\.0 → v1\.10\.0/);
  });

  it('encuentra el clone aunque el origen lleve .git y otras mayúsculas', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0'], 'https://github.com/acme/juguete.git');
    expect(runCheck(newRegistry(root, [{ version: 'v1.0.0' }], 'Acme/Juguete'), source.upstream)).toEqual(upToDate);
  });

  it('sin registro', () => {
    const root = newRoot();
    const registry = join(root, 'upstream.json');
    expect(runCheck(registry, join(root, 'upstream'))).toEqual({ output: `Sin el registro de fuentes en ${registry}.`, code: 1 });
  });
});

describe('Un fichero propio no lleva líneas literales de una fuente (tests/upstream/check.ts)', () => {
  const LITERAL = 'Copied word for word from the toy source, this line has eighty characters in all';
  const OWN = 'skills/juguete-propia/SKILL.md';
  const literalAt = (line: number, at: string): string =>
    `${OWN}:${line}: línea literal de Juguete ${at}, y un own no lleva NOTICE: reescríbela o pasa el fichero a copia: «Copied word for word from the…»`;

  function withOwn(root: string, entries: ToyEntry[], body: string[]): string {
    mkdirSync(join(root, 'skills', 'juguete-propia'), { recursive: true });
    writeFileSync(join(root, OWN), `${body.join('\n')}\n`);
    return newRegistry(root, entries, 'acme/juguete', ['skills/juguete-propia/']);
  }

  it('fails on an own line copied literally from a source', () => {
    const root = newRoot();
    const source = newSource(root, ['v0.9.0']);
    release(source.origin, 'v1.0.0', { 'b.md': `${LITERAL}\n` });
    expect(runCheck(withOwn(root, [{ version: 'v1.0.0' }], ['# Propia', '', LITERAL]), source.upstream)).toEqual({ output: literalAt(3, 'b.md@v1.0.0'), code: 1 });
  });

  it('fails on the same line indented in the own', () => {
    const root = newRoot();
    const source = newSource(root, ['v0.9.0']);
    release(source.origin, 'v1.0.0', { 'b.md': `${LITERAL}\n` });
    expect(runCheck(withOwn(root, [{ version: 'v1.0.0' }], ['# Propia', '', `    ${LITERAL}`]), source.upstream)).toEqual({ output: literalAt(3, 'b.md@v1.0.0'), code: 1 });
  });

  it('finds a line only in the version of an entry', () => {
    const root = newRoot();
    const source = newSource(root, ['v0.8.0']);
    release(source.origin, 'v0.9.0', { 'a.md': `${LITERAL}\n` });
    release(source.origin, 'v1.0.0', { 'a.md': 'a\n' });
    expect(runCheck(withOwn(root, [{ version: 'v0.9.0' }], ['# Propia', '', LITERAL]), source.upstream)).toEqual({
      output: [`Juguete · skills/juguete/: v0.9.0 → v1.0.0, cambian sus rutas: git -C ${source.clone} diff v0.9.0 v1.0.0 -- a.md`, literalAt(3, 'a.md@v0.9.0')].join('\n'),
      code: 1,
    });
  });

  it('ignores an own line under 70 characters', () => {
    const root = newRoot();
    const short = LITERAL.slice(0, 69);
    const source = newSource(root, ['v0.9.0']);
    release(source.origin, 'v1.0.0', { 'b.md': `${short}\n` });
    expect(runCheck(withOwn(root, [{ version: 'v1.0.0' }], ['# Propia', '', short]), source.upstream)).toEqual(upToDate);
  });

  it('fails on a line of exactly 70 characters', () => {
    const root = newRoot();
    const line = LITERAL.slice(0, 70);
    const source = newSource(root, ['v0.9.0']);
    release(source.origin, 'v1.0.0', { 'b.md': `${line}\n` });
    expect(runCheck(withOwn(root, [{ version: 'v1.0.0' }], ['# Propia', '', line]), source.upstream).output).toBe(literalAt(3, 'b.md@v1.0.0'));
  });

  it('does not grep a version that is not in the clone', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v1.1.0', { 'b.md': `${LITERAL}\n` });
    expect(runCheck(withOwn(root, [{ version: 'v0.9.0' }], ['# Propia', '', LITERAL]), source.upstream)).toEqual({
      output: [`Juguete: falta v0.9.0 en el clon ${source.clone}`, literalAt(3, 'b.md@v1.1.0')].join('\n'),
      code: 1,
    });
  });

  it('reports each literal line once', () => {
    const root = newRoot();
    const source = newSource(root, ['v0.9.0']);
    release(source.origin, 'v1.0.0', { 'b.md': `${LITERAL}\n`, 'c.md': `${LITERAL}\n` });
    expect(runCheck(withOwn(root, [{ version: 'v1.0.0' }], ['# Propia', '', LITERAL, '', LITERAL]), source.upstream)).toEqual({
      output: [literalAt(3, 'b.md@v1.0.0'), literalAt(5, 'b.md@v1.0.0')].join('\n'),
      code: 1,
    });
  });
});

describe('Una revisión nombra cada fichero que cambia en su ámbito (tests/upstream/check.ts)', () => {
  const REVIEW = '.docs/sdd/changes/20261111-000000-feature-9999-juguete/upstream-review.md';
  const ROW_B = '| `docs/b.md`: nuevo | — | sin pieza del kit | — |';

  function withReview(root: string, clone: string, jump: [string, string], body: string[]): void {
    const [from, to] = jump;
    const header = ['# Revisión de fuentes', '', `## Juguete \`${from}\` → \`${to}\``, '', `\`git -C ${clone} diff --stat ${from}..${to} -- docs/\``, ''];
    const table = ['| Cambio | Pieza del kit | Decisión | Destino |', '| --- | --- | --- | --- |'];
    mkdirSync(dirname(join(root, REVIEW)), { recursive: true });
    writeFileSync(join(root, REVIEW), `${[...header, ...table, ...body].join('\n')}\n`);
  }

  function bumped(root: string): Source {
    const source = newSource(root, ['v1.0.0']);
    release(source.origin, 'v2.0.0', { 'docs/b.md': 'b\n', 'docs/c.md': 'c\n' });
    return source;
  }

  it('fails when the review of a version jump leaves a changed file of its scope unnamed', () => {
    const root = newRoot();
    const source = bumped(root);
    withReview(root, source.clone, ['v1.0.0', 'v2.0.0'], [ROW_B]);
    expect(runCheck(newRegistry(root, [{ version: 'v2.0.0' }]), source.upstream)).toEqual({
      output: `${REVIEW} · Juguete v1.0.0 → v2.0.0: sin fila ni «Sin leer» para docs/c.md; los lista git -C ${source.clone} diff --name-only v1.0.0..v2.0.0 -- docs/`,
      code: 1,
    });
  });

  it('passes when every changed file is in a row or in «Sin leer»', () => {
    const root = newRoot();
    const source = bumped(root);
    withReview(root, source.clone, ['v1.0.0', 'v2.0.0'], [ROW_B, '', 'Sin leer: `docs/c.md`.']);
    expect(runCheck(newRegistry(root, [{ version: 'v2.0.0' }]), source.upstream)).toEqual(upToDate);
  });

  it('fails when the seen version passes the last reviewed jump', () => {
    const root = newRoot();
    const source = bumped(root);
    release(source.origin, 'v3.0.0', { 'docs/b.md': 'b cambiada\n' });
    withReview(root, source.clone, ['v1.0.0', 'v2.0.0'], [ROW_B, '', 'Sin leer: `docs/`.']);
    expect(runCheck(newRegistry(root, [{ version: 'v3.0.0' }]), source.upstream)).toEqual({
      output: `Juguete: la versión vista sube a v3.0.0 sin revisión: la última sección --stat, en ${REVIEW}, llega a v2.0.0`,
      code: 1,
    });
  });
});
