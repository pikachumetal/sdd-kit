import { describe, it, expect, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { isolatedEnv } from '../../src/git/git.ts';
import { commitsOf } from '../../src/session/branches.ts';
import { tempDir } from './helpers.ts';

vi.setConfig({ testTimeout: 20_000 });

describe('commits de la rama', () => {
  it('commitsOf da la apertura y las tasks, y solo con la rama fusionada el cierre', () => {
    const repo = tempDir();
    const git = (...args: string[]): void => void execFileSync('git', ['-C', repo, '-c', 'user.name=Fixture', '-c', 'user.email=f@example.invalid', ...args], { stdio: 'ignore', env: isolatedEnv() });
    git('init', '-q', '-b', 'develop');
    git('commit', '-q', '--allow-empty', '-m', 'base');
    git('checkout', '-q', '-b', 'feature/1');
    git('commit', '-q', '--allow-empty', '-m', 'apertura');
    git('commit', '-q', '--allow-empty', '-m', 'cierre');
    expect(commitsOf(repo, 'feature/1', 'develop').map(({ closing }) => closing)).toEqual([false, false]);
    git('checkout', '-q', 'develop');
    git('merge', '-q', '--no-ff', '-m', 'merge', 'feature/1');
    expect(commitsOf(repo, 'feature/1', 'develop').map(({ closing }) => closing)).toEqual([false, true]);
  });
});
