import { expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));

const wrapper = fileURLToPath(new URL('./run-utf8.ps1', import.meta.url));
const bin = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));
const ansi = /\x1b\[[0-9;]*m/g;

export interface RunResult {
  stdout: string;
  stderr: string;
  code: number | null;
}

function normalize(text: string): string {
  return text.replace(ansi, '').replace(/\r\n/g, '\n').replace(/\n+$/, '');
}

export function runPs1(script: string, named: Record<string, unknown>, cwd = repoRoot): RunResult {
  const scriptPath = join(repoRoot, 'skills/sdd-templates/scripts', script);
  const result = spawnSync('pwsh', ['-NoProfile', '-File', wrapper, '-Script', scriptPath, '-ArgsJson', JSON.stringify(named)], { cwd, encoding: 'utf8' });
  return { stdout: normalize(result.stdout), stderr: normalize(result.stderr), code: result.status };
}

export function runSdd(args: string[], cwd = repoRoot): RunResult {
  const result = spawnSync(process.execPath, [bin, ...args], { cwd, encoding: 'utf8' });
  return { stdout: normalize(result.stdout), stderr: normalize(result.stderr), code: result.status };
}

const collapse = (text: string) => text.replace(/\s+/g, ' ').trim();

export function expectParity(old: RunResult, current: RunResult): void {
  expect(current.code).toBe(old.code);
  expect(current.stdout).toBe(old.stdout);
  for (const line of current.stderr.split('\n').filter(Boolean)) {
    expect(collapse(old.stderr)).toContain(collapse(line));
  }
}
