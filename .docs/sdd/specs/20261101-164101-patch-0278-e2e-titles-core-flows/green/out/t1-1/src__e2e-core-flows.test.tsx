import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const flows = readFileSync('.docs/sdd/steering/operations.md', 'utf8')
  .split('\n')
  .filter((l) => /^\s+- .* · `e2e\/.*` › /.test(l));

const titles = readdirSync('e2e')
  .filter((f) => f.endsWith('.spec.ts'))
  .flatMap((f) =>
    [...readFileSync(`e2e/${f}`, 'utf8').matchAll(/\btest(?:\.fixme)?\(\s*'([^']+)'/g)].map((m) => ({ file: f, title: m[1] })),
  );

describe('títulos E2E', () => {
  it('cada test de e2e/ está en los Flujos core de operations.md', () => {
    const missing = titles.filter((t) => !flows.some((l) => l.includes(`e2e/${t.file}\` › ${t.title}`)));
    expect(missing).toEqual([]);
  });
});
