import { describe, expect, it } from 'vitest';
import { resolveBash } from './bash.ts';
import { run } from './process.ts';

describe('resolveBash', () => {
  it('resolveBash prefiere Git Bash al lanzador de WSL', () => {
    const bash = resolveBash();
    expect(bash).not.toMatch(/System32/i);
    expect(run(bash, ['-c', 'echo ok']).output).toBe('ok');
  });
});
