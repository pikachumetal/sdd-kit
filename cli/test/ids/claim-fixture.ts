import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { git, tempDir } from './helpers.ts';

export const ROADMAP = '.docs/sdd/roadmap.md';
export const BRANCH = 'feature/0203-single-id-sequence';

export interface ClaimFixture {
  root: string;
  remote: string;
  repo: string;
  other: string;
  wt: string;
}

const BASE_ROADMAP = [
  '# Roadmap — salas',
  '',
  '## Próximo',
  '',
  '| # | Ítem | Estado |',
  '| --- | --- | --- |',
  '| 0201 | Exportar a Excel | ✅ |',
  '| 0202 | Aviso semanal | ⏳ |',
  '',
  '## Deuda técnica',
  '',
  '| Ítem | Impacto | Destino |',
  '| --- | --- | --- |',
  '| La reserva consume otro id | Bajo | **Actuar**: patch |',
  '',
];

export function write(dir: string, relative: string, content: string): void {
  const target = join(dir, relative);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

export function read(dir: string, relative: string): string {
  return readFileSync(join(dir, relative), 'utf8');
}

export function save(dir: string, message: string): string {
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-qm', message]);
  return git(dir, ['rev-parse', '--short', 'HEAD']);
}

function identity(dir: string): void {
  git(dir, ['config', 'user.email', 'fixture@local']);
  git(dir, ['config', 'user.name', 'Fixture']);
}

export function sha(dir: string, ref: string): string {
  return git(dir, ['rev-parse', ref]);
}

export function remoteRoadmap(fx: ClaimFixture): string {
  return git(fx.repo, ['show', `origin/develop:${ROADMAP}`]);
}

export function addRoadmapRow(dir: string, row: string, message: string): string {
  const lines = read(dir, ROADMAP).split('\n');
  const debt = lines.indexOf('## Deuda técnica');
  lines.splice(debt - 1, 0, row);
  write(dir, ROADMAP, lines.join('\n'));
  return save(dir, message);
}

export function setDebtDestination(dir: string, destination: string): string {
  write(dir, ROADMAP, read(dir, ROADMAP).replace('**Actuar**: patch', destination));
  return save(dir, 'docs(roadmap): destino de la deuda');
}

export function publishFromOther(fx: ClaimFixture, row: string): string {
  git(fx.other, ['pull', '-q', 'origin', 'develop']);
  const head = addRoadmapRow(fx.other, row, 'docs(roadmap): reserva del otro clon');
  git(fx.other, ['push', '-q', 'origin', 'develop']);
  return head;
}

export function claimFixture(options: { rows?: string[]; branch?: string } = {}): ClaimFixture {
  const root = tempDir();
  const remote = join(root, 'origin.git');
  const repo = join(root, 'repo');
  git(root, ['init', '-q', '--bare', '-b', 'develop', remote]);
  git(root, ['init', '-q', '-b', 'develop', repo]);
  identity(repo);
  write(repo, '.docs/sdd/sdd-kit.json', JSON.stringify({ ids: { mode: 'sequence' }, merge: { into: 'develop', noFf: true, push: true } }));
  write(repo, ROADMAP, BASE_ROADMAP.join('\n'));
  save(repo, 'feat: base');
  git(repo, ['remote', 'add', 'origin', remote]);
  git(repo, ['push', '-q', '-u', 'origin', 'develop']);
  const other = join(root, 'other');
  git(root, ['clone', '-q', '-b', 'develop', remote, other]);
  identity(other);
  (options.rows ?? ['| 0203 | Ids con una sola numeración | ⏳ |']).forEach((row) => addRoadmapRow(repo, row, `docs(roadmap): reserva ${row.slice(2, 6)}`));
  const wt = join(root, 'wt');
  git(repo, ['worktree', 'add', '-q', '-b', options.branch ?? BRANCH, wt, 'develop']);
  return { root, remote, repo, other, wt };
}

export function rejectPushes(fx: ClaimFixture, script: string): void {
  const hooks = join(fx.root, 'remote-hooks');
  write(hooks, 'pre-receive', `#!/bin/sh\n${script}\n`);
  chmodSync(join(hooks, 'pre-receive'), 0o755);
  git(fx.remote, ['config', 'core.hooksPath', hooks]);
}

export function counter(fx: ClaimFixture): string | null {
  const path = join(fx.repo, '.git', 'sdd-ids');
  return existsSync(path) ? readFileSync(path, 'utf8').trim() : null;
}

export async function runClaim(cwd: string, extra: string[] = []): Promise<{ code: number; text: string; stderr: string }> {
  const io = memoryIo();
  const code = await run(['id', 'claim', '--project-root', cwd, ...extra], io);
  return { code, text: io.stdout.join('\n'), stderr: io.stderr.join('\n') };
}
