import { afterAll } from 'vitest';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';

export const fixtures = join(import.meta.dirname, '../fixtures/session-tokens');
export const sonnet = { input: 2, cacheWrite5m: 2.5, cacheWrite1h: 4, cacheRead: 0.2, output: 10 };
export const opus = { input: 4, cacheWrite5m: 5, cacheWrite1h: 8, cacheRead: 0.2, output: 20 };

const roots: string[] = [];

afterAll(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

export const tempDir = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-session-'));
  roots.push(dir);
  return dir;
};

export const folderName = (worktree: string): string => worktree.replace(/[^A-Za-z0-9]/g, '-');

export interface Worktree {
  path: string;
  projects: string;
  folder: string;
}

export function newWorktree(sets: string[], prices: Record<string, unknown> | null): Worktree {
  const base = tempDir();
  const path = join(base, 'wt');
  const projects = join(base, 'projects');
  const folder = join(projects, folderName(path));
  mkdirSync(path, { recursive: true });
  mkdirSync(folder, { recursive: true });
  for (const set of sets) cpSync(join(fixtures, set), folder, { recursive: true });
  if (prices !== null) writePricing(path, prices);
  return { path, projects, folder };
}

export function writePricing(worktree: string, prices: Record<string, unknown>): void {
  mkdirSync(join(worktree, '.docs/sdd'), { recursive: true });
  const config = { version: '1.1.0', pricing: { source: 'fixture', updated: '2026-09-25', usdPerMillionTokens: prices } };
  writeFileSync(join(worktree, '.docs/sdd/sdd-kit.json'), JSON.stringify(config));
}

export async function measure(worktree: Worktree, extra: string[] = []): Promise<{ output: string; code: number }> {
  const io = memoryIo();
  const code = await run(['session', 'tokens', '--path', worktree.path, '--projects-root', worktree.projects, ...extra], io);
  return { output: io.stdout.join('\n'), code };
}

export function line(output: string, label: string): string | undefined {
  return output.split('\n').find((candidate) => candidate.startsWith(`- ${label}:`));
}
