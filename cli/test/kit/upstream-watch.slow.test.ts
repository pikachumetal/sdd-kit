import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cleanGitEnv, kitRoot, run, type RunResult } from './process.ts';

const check = join(kitRoot, 'tests', 'upstream', 'check.ts');

interface Source {
  origin: string;
  clone: string;
  upstream: string;
}

function git(args: string[]): void {
  const result = run('git', args);
  if (result.code !== 0) throw new Error(`git ${args.join(' ')}: ${result.output}`);
}

function newRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'upstream-'));
  mkdirSync(join(root, 'upstream', 'vacia'), { recursive: true });
  writeFileSync(join(root, 'upstream', 'notas.txt'), 'no es un clone\n');
  return root;
}

function newSource(root: string, tags: string[], url = 'https://github.com/acme/juguete'): Source {
  const origin = join(root, 'origins', 'juguete').replaceAll('\\', '/');
  const clone = join(root, 'upstream', 'juguete');
  git(['init', '-q', '-b', 'main', origin]);
  git(['-C', origin, '-c', 'user.name=test', '-c', 'user.email=test@example.com', 'commit', '-q', '--allow-empty', '-m', 'base']);
  for (const tag of tags) git(['-C', origin, 'tag', tag]);
  git(['clone', '-q', origin, clone]);
  git(['-C', clone, 'remote', 'set-url', 'origin', url]);
  git(['-C', clone, 'config', `url.${origin}.insteadOf`, url]);
  return { origin, clone, upstream: join(root, 'upstream') };
}

function newNotices(root: string, seen: string, repo = 'acme/juguete'): string {
  const path = join(root, 'THIRD_PARTY_NOTICES.md');
  const content = [
    '# Avisos de terceros',
    '',
    '## Fuentes vigiladas',
    '',
    '| Fuente | Repo | Versión vista | Fecha |',
    '| --- | --- | --- | --- |',
    `| Juguete | [${repo}](https://github.com/${repo}) | \`${seen}\` | 2026-10-14 |`,
    '',
    '## Skills y plantillas del kit',
    '',
    '- `skills/juguete/` adapta algo de [acme/juguete](https://github.com/acme/juguete) — MIT.',
    '',
  ].join('\n');
  writeFileSync(path, content);
  return path;
}

function runCheck(notices: string, upstream?: string): RunResult {
  const env = { ...cleanGitEnv };
  delete env.SDD_UPSTREAM_DIR;
  if (upstream !== undefined) env.SDD_UPSTREAM_DIR = upstream;
  return run(process.execPath, [check, notices], { env });
}

describe('Vigilancia de fuentes (tests/upstream/check.ts)', () => {
  it('S1 todo al día', () => {
    const root = newRoot();
    const source = newSource(root, ['v0.9.0', 'v1.0.0']);
    expect(runCheck(newNotices(root, 'v1.0.0'), source.upstream)).toEqual({ output: 'Fuentes al día: 1.', code: 0 });
  });

  it('S2 versión nueva en el origen', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    git(['-C', source.origin, 'tag', 'v1.1.0']);
    const result = runCheck(newNotices(root, 'v1.0.0'), source.upstream);
    expect(result.output).toMatch(/^Juguete: vista v1\.0\.0, última v1\.1\.0\. Revisa: git -C .+juguete diff v1\.0\.0\.\.v1\.1\.0$/);
    expect(result.code).toBe(1);
  });

  it('S3 otras familias y prereleases no cuentan', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0', 'v1.1.0-beta', '@acme/juguete@9.9.9']);
    expect(runCheck(newNotices(root, 'v1.0.0'), source.upstream)).toEqual({ output: 'Fuentes al día: 1.', code: 0 });
  });

  it('S4 sin la variable', () => {
    const root = newRoot();
    expect(runCheck(newNotices(root, 'v1.0.0'))).toEqual({
      output: 'Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.',
      code: 1,
    });
  });

  it('S5 sin clone', () => {
    const root = newRoot();
    const upstream = join(root, 'upstream');
    expect(runCheck(newNotices(root, 'v1.0.0'), upstream)).toEqual({ output: `Juguete: sin clone de acme/juguete en ${upstream}.`, code: 1 });
  });

  it('S6 la vista no es un tag', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    expect(runCheck(newNotices(root, 'v2.0.0'), source.upstream)).toEqual({
      output: 'Juguete: la versión vista v2.0.0 no es un tag del clone.',
      code: 1,
    });
  });

  it('S7 origen inexistente', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0']);
    rmSync(source.origin, { recursive: true, force: true });
    const result = runCheck(newNotices(root, 'v1.0.0'), source.upstream);
    expect(result.output).toMatch(/^Juguete: no se pudo actualizar el clone: /);
    expect(result.code).toBe(1);
  });

  it('compara 1.10.0 por encima de 1.9.0', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.9.0', 'v1.10.0']);
    const result = runCheck(newNotices(root, 'v1.9.0'), source.upstream);
    expect(result.output).toMatch(/vista v1\.9\.0, última v1\.10\.0/);
    expect(result.code).toBe(1);
  });

  it('encuentra el clone aunque el origen lleve .git y otras mayúsculas', () => {
    const root = newRoot();
    const source = newSource(root, ['v1.0.0'], 'https://github.com/acme/juguete.git');
    expect(runCheck(newNotices(root, 'v1.0.0', 'Acme/Juguete'), source.upstream)).toEqual({ output: 'Fuentes al día: 1.', code: 0 });
  });

  it('sin tabla', () => {
    const root = newRoot();
    const notices = join(root, 'THIRD_PARTY_NOTICES.md');
    writeFileSync(notices, '# Avisos de terceros\n\n- algo adapta algo — MIT.\n');
    expect(runCheck(notices, join(root, 'upstream'))).toEqual({ output: `Sin la tabla de «Fuentes vigiladas» en ${notices}.`, code: 1 });
  });
});
