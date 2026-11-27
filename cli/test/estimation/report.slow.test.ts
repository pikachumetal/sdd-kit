import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { run } from '../../src/main.ts';
import { memoryIo } from '../../src/cli/io.ts';
import { project } from './helpers.ts';

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

function git(cwd: string, author: string, ...args: string[]): void {
  const identity = ['-c', `user.name=${author}`, '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false'];
  const result = spawnSync('git', [...identity, ...args], { cwd, env: cleanEnv, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
}

function put(root: string, relative: string, content: string): void {
  const target = join(root, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf8');
}

const walkthrough = (created: string): string =>
  `---\ncreated: ${created}\n---\n\n## 2. Tiempo: estimado vs real\n\n- Tipo: feature\n- Estimación de implementación (del plan): 1 h\n- Esfuerzo real: 2 h\n`;
const patch = '## 5. Tiempo\n\n- Estimación: 1 h\n- Real: 1 h\n';
const marker = (version: string): string => `{ "version": "${version}" }\n`;

function commit(root: string, author: string, message: string): void {
  git(root, author, 'add', '-A');
  git(root, author, 'commit', '-q', '-m', message);
}

function repo(): string {
  const root = project({ 'steering/estimation.md': '# Estimación\n' });
  git(root, 'setup', 'init', '-q');
  return root;
}

async function report(root: string, ...extra: string[]): Promise<{ code: number; text: string; stderr: string[] }> {
  const io = memoryIo();
  const code = await run(['estimation', 'report', '--root', root, ...extra], io);
  return { code, text: io.stdout.join('\n'), stderr: io.stderr };
}

function tableOf(text: string, header: string): string[] {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith(header));
  if (start < 0) return [];
  const end = lines.findIndex((line, index) => index > start && line.trim() === '');
  return lines.slice(start, end < 0 ? undefined : end);
}

const PERSON = '| Persona |';
const VERSION = '| Versión marcada del kit |';
const LANE = '| Carril |';

function migratedRepo(): string {
  const root = repo();
  put(root, '.docs/sdd/sdd-kit.json', marker('2.3.4'));
  put(root, '.docs/sdd/specs/20260910-100000-feature-0010-a/walkthrough.md', walkthrough('2026-09-10'));
  commit(root, 'Ana', 'feat: cierre 0010');
  put(root, '.docs/sdd/specs/20260912-100000-patch-0011-b/patch.md', patch);
  commit(root, 'Luis', 'fix: cierre 0011');
  git(root, 'Pepe', 'mv', '.docs/sdd/specs', '.docs/sdd/changes');
  put(root, '.docs/sdd/changes/20260915-100000-feature-0012-c/walkthrough.md', walkthrough('2026-09-15'));
  put(root, '.docs/sdd/sdd-kit.json', marker('3.0.1'));
  commit(root, 'Pepe', 'chore(sdd): migrar al kit v3.0.1');
  appendFileSync(join(root, '.docs/sdd/changes/20260910-100000-feature-0010-a/walkthrough.md'), '\nUn typo menos.\n');
  commit(root, 'Luis', 'docs: typo');
  return root;
}

describe('sdd estimation report: persona y versión desde git', () => {
  it('attributes 2.x closings to their writers, not to the migrator', async () => {
    const people = tableOf((await report(migratedRepo())).text, PERSON);
    expect(people).toContain('| Ana | 1 * | 2 | 2 | 1 |');
    expect(people).toContain('| Luis | 1 * | 1 | 1 | 0 |');
    expect(people.at(-1)).toBe('| sin atribuir | 1 * | 2 | 2 | 1 |');
    expect(people.join('\n')).not.toContain('Pepe');
  });

  it('marks the kit version of the attributing commit', async () => {
    const root = migratedRepo();
    put(root, '.docs/sdd/changes/20261110-100000-feature-0020-d/walkthrough.md', walkthrough('2026-11-10'));
    commit(root, 'Ana', 'feat: cierre 0020');
    const versions = tableOf((await report(root)).text, VERSION).slice(2).map((line) => line.split('|')[1]!.trim());
    expect(versions).toEqual(['2.3.4', '3.0.1', 'sin marcador']);
    const counts = tableOf((await report(root)).text, VERSION).slice(2, 5).map((line) => line.split('|')[2]!.trim());
    expect(counts).toEqual(['2 *', '1 *', '1 *']);
  });

  it('sorts kit versions by SemVer', async () => {
    const root = repo();
    put(root, '.docs/sdd/sdd-kit.json', marker('3.10.0'));
    put(root, '.docs/sdd/changes/20261101-100000-feature-0040-a/walkthrough.md', walkthrough('2026-11-01'));
    commit(root, 'Ana', 'feat: 0040');
    put(root, '.docs/sdd/sdd-kit.json', marker('3.9.0'));
    put(root, '.docs/sdd/changes/20261102-100000-feature-0041-b/walkthrough.md', walkthrough('2026-11-02'));
    commit(root, 'Ana', 'feat: 0041');
    const versions = tableOf((await report(root)).text, VERSION).slice(2).map((line) => line.split('|')[1]!.trim());
    expect(versions).toEqual(['3.9.0', '3.10.0']);
  });

  it('keeps accented author names', async () => {
    const root = repo();
    put(root, '.docs/sdd/changes/20261101-100000-feature-0040-a/walkthrough.md', walkthrough('2026-11-01'));
    commit(root, 'Ana Pérez', 'feat: 0040');
    expect(tableOf((await report(root)).text, PERSON)).toContain('| Ana Pérez | 1 * | 2 | 2 | 1 |');
  });

  it('attributes the file that produced the row', async () => {
    const root = repo();
    put(root, '.docs/sdd/changes/20261101-100000-feature-0040-a/patch.md', patch);
    commit(root, 'Luis', 'fix: apertura');
    put(root, '.docs/sdd/changes/20261101-100000-feature-0040-a/walkthrough.md', walkthrough('2026-11-01'));
    commit(root, 'Ana', 'feat: cierre');
    expect(tableOf((await report(root)).text, PERSON)).toContain('| Ana | 1 * | 2 | 2 | 1 |');
  });

  it('missing marker in a commit is sin marcador', async () => {
    const root = repo();
    put(root, '.docs/sdd/changes/20261101-100000-feature-0040-a/walkthrough.md', walkthrough('2026-11-01'));
    commit(root, 'Ana', 'feat: 0040');
    expect(tableOf((await report(root)).text, VERSION)).toContain('| sin marcador | 1 * | 2 | 2 | 1 |');
  });

  it('no git warns once', async () => {
    const root = project({ 'steering/estimation.md': '# Estimación\n', 'changes/20261101-100000-feature-0040-a/walkthrough.md': walkthrough('2026-11-01') });
    const { code, stderr } = await report(root);
    expect(code).toBe(0);
    expect(stderr.filter((line) => line.startsWith('Sin historial de git en '))).toHaveLength(1);
    expect(stderr.join('\n')).toContain(': persona y versión salen sin atribuir y sin marcador.');
  });
});

const CHANGELOG = '# Changelog\n\n## [3.2.0] - 2026-11-21\n\n- algo\n\n## [3.1.0] - 2026-11-20\n\n- algo\n\n## [3.0.5] - 2026-11-18\n\n- algo\n';

function releasedRepo(): string {
  const root = repo();
  put(root, 'CHANGELOG.md', CHANGELOG);
  put(root, '.docs/sdd/changes/20261117-100000-feature-0030-a/walkthrough.md', walkthrough('2026-11-17'));
  commit(root, 'Ana', 'feat: 0030');
  git(root, 'Ana', 'tag', 'v3.0.5');
  put(root, '.docs/sdd/changes/20261119-100000-feature-0031-b/walkthrough.md', walkthrough('2026-11-19'));
  commit(root, 'Ana', 'feat: 0031');
  put(root, '.docs/sdd/changes/20261122-100000-feature-0032-c/walkthrough.md', walkthrough('2026-11-22'));
  commit(root, 'Ana', 'feat: 0032');
  return root;
}

describe('sdd estimation report --release', () => {
  it("--release keeps only that release's closings", async () => {
    const root = releasedRepo();
    const current = await report(root, '--release', '3.1.0');
    expect(current.code).toBe(0);
    expect(tableOf(current.text, LANE)).toContain('| feature | 1 * | 2 | 2 | 1 |');
    expect(current.stderr).toContain('Fuera de toda release: 1 cierres sin publicar o sin fecha; no cuentan en la 3.1.0.');
    expect(tableOf((await report(root, '--release', '3.0.5')).text, LANE)).toContain('| feature | 1 * | 2 | 2 | 1 |');
    expect(tableOf((await report(root)).text, LANE)).toContain('| feature | 3 * | 2 | 2 | 3 |');
  });

  it('accepts a leading v in --release', async () => {
    const root = releasedRepo();
    expect((await report(root, '--release', 'v3.1.0')).text).toBe((await report(root, '--release', '3.1.0')).text);
  });

  it('unknown release and missing changelog fail', async () => {
    const unknown = await report(releasedRepo(), '--release', '9.9.9');
    expect(unknown.code).toBe(1);
    expect(unknown.stderr.join('\n')).toContain('La versión 9.9.9 no está con fecha en el changelog (');
    const bare = await report(repo(), '--release', '3.1.0');
    expect(bare.code).toBe(1);
    expect(bare.stderr.join('\n')).toContain('Sin changelog en ');
  });

  it('release without closings', async () => {
    const { code, text } = await report(releasedRepo(), '--release', '3.2.0');
    expect(code).toBe(0);
    expect(text.match(/^Sin cierres en la 3\.2\.0\.$/gm)).toHaveLength(4);
  });
});

describe('sdd estimation report: pasada de la revisión final', () => {
  it('warns about a shadowed changelog with --release', async () => {
    const root = releasedRepo();
    put(root, '.docs/sdd/changelog.md', CHANGELOG);
    const { stderr } = await report(root, '--release', '3.1.0');
    expect(stderr).toContain('aviso: también existe .docs/sdd/changelog.md, que no se lee');
  });

  it('no closings and no git does not warn about git', async () => {
    const { code, stderr } = await report(project({ 'steering/estimation.md': '# Estimación\n' }));
    expect(code).toBe(0);
    expect(stderr.some((line) => line.startsWith('Sin historial de git en '))).toBe(false);
  });

  it('an empty --release is not the whole project', async () => {
    const { code, stderr } = await report(releasedRepo(), '--release', '');
    expect(code).toBe(1);
    expect(stderr.join('\n')).toContain('no está con fecha en el changelog');
  });

  it('a commit without marker does not hide the marker of another', async () => {
    const root = repo();
    put(root, '.docs/sdd/changes/20261101-100000-feature-0040-a/walkthrough.md', walkthrough('2026-11-01'));
    commit(root, 'Ana', 'feat: 0040');
    put(root, '.docs/sdd/sdd-kit.json', marker('3.0.4'));
    put(root, '.docs/sdd/changes/20261102-100000-feature-0041-b/walkthrough.md', walkthrough('2026-11-02'));
    commit(root, 'Ana', 'feat: 0041');
    const versions = tableOf((await report(root)).text, VERSION);
    expect(versions).toContain('| 3.0.4 | 1 * | 2 | 2 | 1 |');
    expect(versions).toContain('| sin marcador | 1 * | 2 | 2 | 1 |');
  });

  it('sorts accented names as a person reads them', async () => {
    const root = repo();
    put(root, '.docs/sdd/changes/20261101-100000-feature-0040-a/walkthrough.md', walkthrough('2026-11-01'));
    commit(root, 'Beatriz', 'feat: 0040');
    put(root, '.docs/sdd/changes/20261102-100000-feature-0041-b/walkthrough.md', walkthrough('2026-11-02'));
    commit(root, 'Álvaro', 'feat: 0041');
    const people = tableOf((await report(root)).text, PERSON).slice(2).map((line) => line.split('|')[1]!.trim());
    expect(people).toEqual(['Álvaro', 'Beatriz']);
  });
});
