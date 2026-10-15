import { describe, it, expect } from 'vitest';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { line, measure, newWorktree } from './helpers.ts';

const usage = { input_tokens: 1, cache_read_input_tokens: 0, output_tokens: 1 };
const ENTRIES = 200_000;

function longSession(): string {
  const start = Date.parse('2026-10-14T08:00:00.000Z');
  return Array.from({ length: ENTRIES }, (_, index) => {
    const timestamp = new Date(start + index * 100).toISOString();
    const message = { model: 'claude-sonnet-5', id: `m${index}`, role: 'assistant', content: [], usage };
    return JSON.stringify({ type: 'assistant', timestamp, gitBranch: 'feature/0181', message });
  }).join('\n');
}

describe('session tokens con un transcript muy largo', () => {
  it('mide el esfuerzo real sin desbordar la pila', async () => {
    const worktree = newWorktree([], null);
    writeFileSync(join(worktree.folder, 'largo.jsonl'), longSession());
    const { output } = await measure(worktree, ['--branch', 'feature/0181']);
    expect(line(output, 'Esfuerzo real')).toMatch(/^- Esfuerzo real: 5,56 h — reloj de la sesión 5,56 h desde 2026-10-14T08:00Z/);
  });
});
