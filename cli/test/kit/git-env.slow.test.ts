import { mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { git, gitSync } from '../../src/git/git.ts';
import { kitRoot, run } from './process.ts';

const GIT_ENV_NAMES = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY'];
const GIT_CALL = /\b(spawnSync|spawn|execFileSync|execFile)\(\s*(['"`])git\2/g;
const MARKED_CALL = /\b(?:spawnSync|spawn|execFileSync|execFile)\(GIT_CALL/g;

function newRepo(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  run('git', ['init', '-q', dir]);
  return gitSync(dir, ['rev-parse', '--show-toplevel'])![0];
}

// Los textos y los comentarios no son llamadas: se vacían conservando las posiciones.
function maskTextAndComments(source: string): string {
  return source.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/g, (match) => match.replace(/[^\n]/g, ' '));
}

function callText(masked: string, start: number): string {
  let depth = 0;
  for (let index = masked.indexOf('(', start); index < masked.length; index++) {
    if (masked[index] === '(') depth++;
    if (masked[index] === ')' && --depth === 0) return masked.slice(start, index + 1);
  }
  return masked.slice(start);
}

// La llamada se marca antes de vaciar los textos: su 'git' es un texto, y una llamada escrita dentro de otro texto queda vacía.
function findGitCallsWithoutEnv(source: string): number[] {
  const masked = maskTextAndComments(source.replace(GIT_CALL, '$1(GIT_CALL'));
  return [...masked.matchAll(MARKED_CALL)]
    .filter((match) => !/\benv\b\s*[:,}]/.test(callText(masked, match.index)))
    .map((match) => masked.slice(0, match.index).split('\n').length);
}

function testFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((name) => name.endsWith('.ts'))
    .map((name) => join(dir, name));
}

describe('git() de cli/src/git', () => {
  const saved = Object.fromEntries(GIT_ENV_NAMES.map((name) => [name, process.env[name]]));

  afterEach(() => {
    for (const [name, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  it('git() de cli/src/git no hereda las variables de git', async () => {
    const other = newRepo('git-env-other-');
    const mine = newRepo('git-env-mine-');
    for (const name of GIT_ENV_NAMES) process.env[name] = join(other, name === 'GIT_DIR' ? '.git' : name.toLowerCase());
    process.env.GIT_WORK_TREE = other;

    expect(gitSync(mine, ['rev-parse', '--show-toplevel'])).toEqual([mine]);
    expect((await git(mine, ['rev-parse', '--show-toplevel'])).stdout.trim()).toBe(mine);
  });

  it("run() sin env no hereda las variables de git: run('git', …) cumple la regla por su default", () => {
    const other = newRepo('git-env-run-other-');
    const mine = newRepo('git-env-run-mine-');
    process.env.GIT_DIR = join(other, '.git');

    expect(run('git', ['-C', mine, 'rev-parse', '--show-toplevel']).output).toBe(mine);
  });
});

describe('Los tests que llaman a git limpian las variables de git', () => {
  it.each([
    "spawnSync('git', ['init', dir], { cwd });",
    "execFileSync('git', ['-C', dir, 'commit', '-m', 'x'], { cwd: dir });",
  ])('señala un test con %s sin env', (call) => {
    expect(findGitCallsWithoutEnv(`it('x', () => {\n  ${call}\n});`)).toEqual([2]);
  });

  it('acepta el mismo test con env', () => {
    expect(findGitCallsWithoutEnv("spawnSync('git', ['init', dir], { cwd, env: cleanGitEnv });")).toEqual([]);
    expect(findGitCallsWithoutEnv("spawnSync('git', ['init', dir], { cwd, env });")).toEqual([]);
  });

  it('señala la llamada con comillas dobles', () => {
    expect(findGitCallsWithoutEnv('spawnSync("git", ["init", dir], { cwd });')).toEqual([1]);
  });

  it('no señala una llamada dentro de un texto ni de un comentario', () => {
    expect(findGitCallsWithoutEnv('const sample = "spawnSync(\'git\', [\'init\'])";\n// execFile(\'git\', [])')).toEqual([]);
  });

  it('cada cli/test/**/*.ts que llama a git pasa un env', () => {
    const testDir = join(kitRoot, 'cli', 'test');
    const offenders = testFiles(testDir).flatMap((file) =>
      findGitCallsWithoutEnv(readFileSync(file, 'utf8')).map((line) => `${relative(testDir, file).replaceAll('\\', '/')}:${line}`),
    );
    expect(offenders, 'dentro de un hook de git, git -C no basta: pasa un env sin GIT_DIR y compañía (cleanGitEnv)').toEqual([]);
  });
});
