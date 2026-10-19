import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { measureSession, textLines, toJson } from '../../src/session/measure.ts';
import { folderName, tempDir } from './helpers.ts';

const DAY = '2026-10-19';
const at = (hhmm: string) => `${DAY}T${hhmm}:00Z`;
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

function git(cwd: string, when: string, ...args: string[]): string {
  const env = { ...cleanEnv, GIT_COMMITTER_DATE: at(when), GIT_AUTHOR_DATE: at(when) };
  const result = spawnSync('git', args, { cwd, env, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}

const response = (id: string, hhmm: string, branch: string, tokens: number) =>
  JSON.stringify({
    type: 'assistant', uuid: `u-${id}`, timestamp: at(hhmm), gitBranch: branch, sessionId: 's',
    message: { model: 'claude-opus-5-5', id, type: 'message', role: 'assistant', content: [{ type: 'text', text: '.' }],
      usage: { input_tokens: tokens, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 0 } },
  });

interface Repo {
  root: string;
  projects: string;
  worktree: (branch: string) => string;
}

function repo(): Repo {
  const base = tempDir();
  const root = join(base, 'repo');
  mkdirSync(join(root, '.docs/sdd'), { recursive: true });
  git(base, '09:00', 'init', '-q', '-b', 'develop', root);
  for (const [key, value] of [['user.name', 'x'], ['user.email', 'x@x'], ['commit.gpgsign', 'false'], ['core.hooksPath', join(base, 'no-hooks')]]) git(root, '09:00', 'config', key, value);
  writeFileSync(join(root, '.docs/sdd/sdd-kit.json'), '{"merge": {"into": "develop", "noFf": true}}');
  git(root, '09:00', 'add', '-A');
  git(root, '09:00', 'commit', '-q', '-m', 'base');
  return { root, projects: join(base, 'projects'), worktree: (branch) => join(base, branch.replace('/', '-')) };
}

function openBranch(r: Repo, branch: string, when: string): string {
  const path = r.worktree(branch);
  git(r.root, when, 'worktree', 'add', '-q', '-b', branch, path, 'develop');
  git(path, when, 'commit', '-q', '--allow-empty', '-m', `trabajo de ${branch}`);
  return path;
}

const mergeIntoDevelop = (r: Repo, branch: string, when: string) => git(r.root, when, 'merge', '-q', '--no-ff', '-m', `merge: ${branch} en develop`, branch);

function transcripts(r: Repo, worktree: string, lines: string[]): void {
  const folder = join(r.projects, folderName(worktree));
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, 'session.jsonl'), `${lines.join('\n')}\n`);
}

const measure = (r: Repo, branch: string, now = '10:45') =>
  measureSession({ path: r.worktree(branch), branch, projectsRoots: [r.projects], now: Date.parse(at(now)) });

function scenario(): Repo {
  const r = repo();
  const old = openBranch(r, 'feature/0210-x', '09:30');
  mergeIntoDevelop(r, 'feature/0210-x', '10:00');
  openBranch(r, 'feature/0211-y', '10:05');
  transcripts(r, old, [
    response('m1', '09:50', 'feature/0210-x', 100),
    response('m2', '10:10', 'feature/0210-x', 20),
    response('m3', '10:20', 'feature/0210-x', 30),
    response('m4', '10:40', 'feature/0210-x', 40),
  ]);
  return r;
}

const threadTokens = (r: Repo, branch: string, now?: string) => (toJson(measure(r, branch, now)) as { thread: { tokens: number } }).thread.tokens;

describe('session tokens: el último merge de una rama', () => {
  it('rama: corta en el último merge', () => {
    const r = scenario();

    expect(threadTokens(r, 'feature/0210-x')).toBe(100);
  });
});

describe('session tokens por ventana', () => {
  it('ventana: mide la sesión de la otra rama fusionada desde la creación', () => {
    const r = scenario();

    expect(threadTokens(r, 'feature/0211-y')).toBe(90);
  });

  it('ventana: quinta línea y window en json', () => {
    const r = scenario();
    const measured = measure(r, 'feature/0211-y');

    expect(textLines(measured)).toContain(`- Medición: por ventana — transcripts de ${r.worktree('feature/0210-x')} desde ${DAY}T10:05Z (la rama no tiene transcripts propios)`);
    expect((toJson(measured) as { window: unknown }).window).toEqual({ folder: r.worktree('feature/0210-x'), from: `${DAY}T10:05Z`, to: `${DAY}T10:45Z` });
  });

  it('ventana: una rama viva en paralelo no cuenta', () => {
    const r = scenario();
    const live = openBranch(r, 'feature/0212-z', '10:01');
    transcripts(r, live, [response('p1', '10:15', 'feature/0212-z', 5000)]);

    expect(threadTokens(r, 'feature/0211-y')).toBe(90);
  });

  it('ventana: una rama fusionada después no cuenta', () => {
    const r = repo();
    const late = openBranch(r, 'feature/0213-w', '09:30');
    openBranch(r, 'feature/0211-y', '10:05');
    mergeIntoDevelop(r, 'feature/0213-w', '10:30');
    transcripts(r, late, [response('l1', '10:20', 'feature/0213-w', 7), response('l2', '10:35', 'feature/0213-w', 11)]);

    expect(threadTokens(r, 'feature/0211-y')).toBe(11);
  });

  it('ventana: otra rama sin transcripts creada después la corta', () => {
    const r = scenario();
    openBranch(r, 'feature/0214-v', '10:30');

    expect(threadTokens(r, 'feature/0211-y')).toBe(50);
  });

  it('ventana: sin reflog, no medido', () => {
    const r = scenario();
    rmSync(join(r.root, '.git', 'logs', 'refs', 'heads', 'feature', '0211-y'));

    expect(textLines(measure(r, 'feature/0211-y'))).toContain('- Tokens del hilo: no medido (sin reflog de feature/0211-y: no se sabe cuándo se creó)');
  });

  it('ventana vacía: sin transcripts para la ruta', () => {
    const r = repo();
    openBranch(r, 'feature/0211-y', '10:05');

    expect(textLines(measure(r, 'feature/0211-y'))[0]).toBe(`- Tokens del hilo: no medido (sin transcripts de Claude Code para ${r.worktree('feature/0211-y')})`);
  });
});
