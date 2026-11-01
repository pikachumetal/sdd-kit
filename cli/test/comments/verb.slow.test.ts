import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { commitAll, emptyRepo, git, sdd, write } from '../tasks/harness.ts';

function repoOnBranch(baseFiles: Record<string, string> = { 'seed.txt': 'x\n' }): string {
  const repo = emptyRepo();
  writeAll(repo, baseFiles);
  commitAll(repo, 'base');
  git(repo, 'branch', '-M', 'develop');
  git(repo, 'checkout', '-q', '-b', 'feature/prueba');
  return repo;
}

function writeAll(repo: string, files: Record<string, string>): void {
  for (const [path, content] of Object.entries(files)) write(join(repo, path), content);
}

function commit(repo: string, files: Record<string, string>): void {
  writeAll(repo, files);
  commitAll(repo, 'cambio');
}

const review = (repo: string, ...extra: string[]) => sdd(repo, 'review', 'comments', ...extra);
const asJson = (repo: string) => JSON.parse(review(repo, '--base', 'develop', '--json').out) as { comments: { file: string; line: number; cites: string[]; text: string }[]; unread: string[] };

describe('sdd review comments', () => {
  it('lista la spec y la task, y no el porqué ni la cadena; sale con 0', () => {
    const repo = repoOnBranch();
    commit(repo, {
      'src/save.ts': [
        'export function save() {',
        '  return 1;',
        '// según la spec §3',
        '// Task 4: validar antes de guardar',
        '// moon hereda el entorno: sin limpiarlo usa otro workspace',
        'const note = "// según la spec §3";',
        '}',
        '',
      ].join('\n'),
    });
    const result = review(repo, '--base', 'develop');
    expect(result.code).toBe(0);
    expect(result.out.trim().split(/\r?\n/)).toEqual([
      'src/save.ts:3 · spec · // según la spec §3',
      'src/save.ts:4 · task · // Task 4: validar antes de guardar',
      '2 comentarios citan documentos',
    ]);
  });

  it('un solo comentario va en singular', () => {
    const repo = repoOnBranch();
    commit(repo, { 'a.ts': '// Task 4\n' });
    expect(review(repo, '--base', 'develop').out).toContain('1 comentario cita documentos');
  });

  it('sin nada que citar dice que ninguno y sale con 0', () => {
    const repo = repoOnBranch();
    commit(repo, { 'a.ts': '// un porqué\n' });
    const result = review(repo, '--base', 'develop');
    expect(result.code).toBe(0);
    expect(result.out.trim()).toBe('ningún comentario cita documentos');
  });

  it('sin --base sale con 2', () => {
    const result = review(repoOnBranch());
    expect(result.code).toBe(2);
    expect(result.err).toContain('uso: sdd review');
  });

  it('con una base que no existe avisa y sale con 1', () => {
    const result = review(repoOnBranch(), '--base', 'no-existe');
    expect(result.code).toBe(1);
    expect(result.err).toContain('base: no se encuentra no-existe');
  });

  it('no lista un comentario que ya estaba en la base', () => {
    const repo = repoOnBranch({ 'src/old.ts': '// Task 2: viejo\n' });
    commit(repo, { 'src/old.ts': '// Task 2: viejo\nconst a = 1;\n' });
    expect(review(repo, '--base', 'develop').out.trim()).toBe('ningún comentario cita documentos');
  });

  it('no lee Markdown', () => {
    const repo = repoOnBranch();
    commit(repo, { 'docs/a.md': '<!-- según la spec §3 -->\n' });
    expect(review(repo, '--base', 'develop').out.trim()).toBe('ningún comentario cita documentos');
  });

  it('no lista lo que trae un merge de develop', () => {
    const repo = repoOnBranch();
    commit(repo, { 'a.ts': 'const a = 1;\n' });
    git(repo, 'checkout', '-q', 'develop');
    commit(repo, { 'src/otra.ts': '// Task 9\n' });
    git(repo, 'checkout', '-q', 'feature/prueba');
    git(repo, 'merge', '-q', '--no-edit', 'develop');
    expect(review(repo, '--base', 'develop').out.trim()).toBe('ningún comentario cita documentos');
  });

  it('reconoce cada lenguaje y su tipo, con --json', () => {
    const repo = repoOnBranch();
    commit(repo, {
      'a.py': '# según la spec §3\n',
      'b.sql': '-- Task 4\n',
      'c.html': '<!-- constitution -->\n',
      'd.cs': '/* uno\n   capabilities/booking.md\n*/\n',
      'e.py': 'x = "# según la spec §3"\n',
    });
    const { comments } = asJson(repo);
    expect(comments.map(({ file, line, cites }) => ({ file, line, cites }))).toEqual([
      { file: 'a.py', line: 1, cites: ['spec'] },
      { file: 'b.sql', line: 1, cites: ['task'] },
      { file: 'c.html', line: 1, cites: ['constitution'] },
      { file: 'd.cs', line: 2, cites: ['capabilities/'] },
    ]);
  });

  it('dice qué no ha leído, sin Markdown, JSON ni evidencia', () => {
    const repo = repoOnBranch();
    commit(repo, {
      'a.vue': '// Task 4\n',
      'b.json': '{}\n',
      'c.md': '// Task 4\n',
      '.docs/sdd/specs/x/red/m.ts': '// Task 4\n',
      '.docs/sdd/changes/x/m.ts': '// Task 4\n',
    });
    expect(review(repo, '--base', 'develop').out.trim().split(/\r?\n/)).toEqual(['sin leer: a.vue', 'ningún comentario cita documentos']);
    expect(asJson(repo)).toEqual({ comments: [], unread: ['a.vue'] });
  });

  it('una línea añadida que parece una cabecera de diff no cambia de fichero', () => {
    const repo = repoOnBranch({ 'a.ts': 'const kept = 1;\n' });
    commit(repo, { 'a.ts': '++ b/x\nconst kept = 1;\n// Task 4\n' });
    expect(review(repo, '--base', 'develop').out).toContain('a.ts:3 · task · // Task 4');
  });

  it('los patrones miran el comentario, no el código ni la cadena de su línea', () => {
    const repo = repoOnBranch();
    commit(repo, { 'a.ts': 'const spec = load(); // un porqué\nconst n = "según la spec §3"; // otro porqué\nsave(); // Task 4\n' });
    expect(review(repo, '--base', 'develop').out.trim().split(/\r?\n/)).toEqual(['a.ts:3 · task · save(); // Task 4', '1 comentario cita documentos']);
  });

  it('un submódulo en el diff va a sin leer y no tumba el verbo', () => {
    const repo = repoOnBranch();
    write(join(repo, 'a.ts'), '// Task 4\n');
    git(repo, 'add', '-A');
    git(repo, 'update-index', '--add', '--cacheinfo', `160000,${'1'.repeat(40)},vendor/chart.js`);
    git(repo, 'commit', '-q', '-m', 'submódulo');
    const result = review(repo, '--base', 'develop');
    expect(result.code).toBe(0);
    expect(result.out.trim().split(/\r?\n/)).toEqual(['a.ts:1 · task · // Task 4', 'sin leer: vendor/chart.js', '1 comentario cita documentos']);
  });

  it('un renombrado no lista sus comentarios viejos, también con diff.renames=false', () => {
    const repo = repoOnBranch({ 'old.ts': '// Task 2 viejo\nconst a = 1;\nconst b = 2;\nconst c = 3;\n' });
    git(repo, 'mv', 'old.ts', 'new.ts');
    git(repo, 'commit', '-q', '-m', 'renombra');
    git(repo, 'config', 'diff.renames', 'false');
    expect(review(repo, '--base', 'develop').out.trim()).toBe('ningún comentario cita documentos');
  });

  it('diff.interHunkContext no cuenta como añadida una línea de contexto', () => {
    const repo = repoOnBranch({ 'x.ts': 'const a = 1;\n// Task 2 viejo\nconst b = 2;\n' });
    commit(repo, { 'x.ts': 'const a = 9;\n// Task 2 viejo\nconst b = 9;\n' });
    git(repo, 'config', 'diff.interHunkContext', '3');
    expect(review(repo, '--base', 'develop').out.trim()).toBe('ningún comentario cita documentos');
  });

  it('un fichero borrado no rompe la lectura', () => {
    const repo = repoOnBranch({ 'old.ts': '// Task 2\n' });
    git(repo, 'rm', '-q', 'old.ts');
    git(repo, 'commit', '-q', '-m', 'borra');
    expect(review(repo, '--base', 'develop').code).toBe(0);
  });
});
