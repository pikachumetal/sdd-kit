import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { kitRoot, run } from './process.ts';

const migration = readFileSync(join(kitRoot, 'skills/sdd-upgrade/references/migrations/v3.0.1.md'), 'utf8');
const [moveCode, rewriteCode] = [...migration.matchAll(/^ {3}node -e "(.*)"\r?$/gm)].map((match) => match[1]!);

const FOLDER = '20261001-100000-feature-0079-b';
const EVIDENCE = `[s](../../../../specs/${FOLDER}/spec.md)\n`;
const roots: string[] = [];

afterAll(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

function git(cwd: string, ...args: string[]): string {
  const result = run('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', '-c', 'core.autocrlf=false', ...args], { cwd });
  if (result.code !== 0) throw new Error(`git ${args.join(' ')}: ${result.output}`);
  return result.output;
}

function put(root: string, path: string, content: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
}

function project(): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-v301-'));
  roots.push(root);
  git(root, 'init', '-q');
  put(root, `.docs/sdd/specs/${FOLDER}/walkthrough.md`, '# w\n');
  put(root, `.docs/sdd/specs/${FOLDER}/red/out/notas.md`, EVIDENCE);
  put(root, '.docs/sdd/changes/20261110-090000-feature-0160-c/spec.md', '# c\n');
  put(root, 'ROADMAP.md', `[walkthrough](.docs/sdd/specs/${FOLDER}/walkthrough.md)\n`);
  put(root, '.docs/sdd/steering/debt.md', `[walkthrough](../specs/${FOLDER}/walkthrough.md)\n`);
  put(root, '.docs/sdd/changelog-cliente.md', `[x](specs/${FOLDER}/walkthrough.md)\n`);
  put(root, 'docs/guia.md', '[api](../specs/api.md)\n');
  put(root, '.gitignore', '*.log\n');
  git(root, 'add', '-A');
  git(root, 'commit', '-qm', 'init');
  return root;
}

const node = (root: string, code: string) => run(process.execPath, ['-e', code], { cwd: root });
const read = (root: string, path: string) => readFileSync(join(root, path), 'utf8');

describe('migración v3.0.1: los dos comandos de v3.0.1.md', () => {
  it('trae los dos comandos', () => {
    expect([moveCode, rewriteCode].every(Boolean)).toBe(true);
  });

  // Una consola con otra página de códigos cambia lo que no es ASCII al pegarlo.
  it('los dos comandos son ASCII imprimible, para pegarse igual en cualquier consola', () => {
    expect([moveCode, rewriteCode].filter((code) => !/^[\x20-\x7e]*$/.test(code!))).toEqual([]);
  });

  it('mueve specs/ a changes/ con renombrados y la borra', () => {
    const root = project();
    expect(node(root, moveCode!)).toEqual({ output: '1 entradas movidas de specs/ a changes/', code: 0 });
    expect(existsSync(join(root, '.docs/sdd/specs'))).toBe(false);
    expect(git(root, 'status', '--porcelain').split('\n').every((line) => line.startsWith('R '))).toBe(true);
  });

  it('reescribe las rutas fuera de la evidencia y deja docs/ como estaba', () => {
    const root = project();
    node(root, moveCode!);
    expect(node(root, rewriteCode!)).toEqual({ output: '3 ficheros .md reescritos', code: 0 });
    expect(read(root, 'ROADMAP.md')).toBe(`[walkthrough](.docs/sdd/changes/${FOLDER}/walkthrough.md)\n`);
    expect(read(root, '.docs/sdd/steering/debt.md')).toBe(`[walkthrough](../changes/${FOLDER}/walkthrough.md)\n`);
    expect(read(root, '.docs/sdd/changelog-cliente.md')).toBe(`[x](changes/${FOLDER}/walkthrough.md)\n`);
    expect(read(root, 'docs/guia.md')).toBe('[api](../specs/api.md)\n');
    expect(read(root, `.docs/sdd/changes/${FOLDER}/red/out/notas.md`)).toBe(EVIDENCE);
  });

  it('deja intacto un .md que no es UTF-8', () => {
    const root = project();
    const latin1 = Buffer.concat([Buffer.from(`[a](.docs/sdd/specs/${FOLDER}/walkthrough.md) caf`), Buffer.from([0xe9, 0x0a])]);
    writeFileSync(join(root, 'notas.md'), latin1);
    git(root, 'add', 'notas.md');
    git(root, 'commit', '-qm', 'latin1');
    node(root, moveCode!);
    node(root, rewriteCode!);
    expect(readFileSync(join(root, 'notas.md')).equals(latin1)).toBe(true);
  });

  it('una segunda pasada de la reescritura no cambia nada', () => {
    const root = project();
    node(root, moveCode!);
    node(root, rewriteCode!);
    expect(node(root, rewriteCode!).output).toBe('0 ficheros .md reescritos');
  });

  it('con una carpeta repetida en changes/ no mueve nada y la nombra', () => {
    const root = project();
    mkdirSync(join(root, `.docs/sdd/changes/${FOLDER}`));
    expect(node(root, moveCode!)).toEqual({ output: `No se mueve nada; ya existen en changes/: ${FOLDER}`, code: 1 });
    expect(git(root, 'status', '--porcelain')).toBe('');
  });

  it('con un fichero ignorado en specs/ no mueve nada y lo nombra', () => {
    const root = project();
    put(root, `.docs/sdd/specs/${FOLDER}/notas.log`, 'x\n');
    expect(node(root, moveCode!)).toEqual({ output: `No se mueve nada; sin versionar: .docs/sdd/specs/${FOLDER}/notas.log`, code: 1 });
    expect(git(root, 'status', '--porcelain')).toBe('');
  });

  it('con una entrada sin nada versionado, aunque tenga subcarpetas, no mueve nada', () => {
    const root = project();
    mkdirSync(join(root, '.docs/sdd/specs/vacia/hueca'), { recursive: true });
    expect(node(root, moveCode!)).toEqual({ output: 'No se mueve nada; sin nada versionado: vacia', code: 1 });
    expect(existsSync(join(root, `.docs/sdd/specs/${FOLDER}/walkthrough.md`))).toBe(true);
  });
});
