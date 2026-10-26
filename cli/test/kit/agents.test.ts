import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { frontmatter, readText, repoRoot } from './kit-files.ts';

const levels = ['high', 'low', 'medium'];

describe('tipos de agente por effort', () => {
  it('el plugin entrega exactamente effort-low, effort-medium y effort-high', () => {
    const names = readdirSync(join(repoRoot, 'agents')).filter((name) => name.endsWith('.md')).map((name) => name.replace(/\.md$/, '')).sort();
    expect(names).toEqual(levels.map((level) => `effort-${level}`));
  });

  it.each(levels)('effort-%s hereda el modelo, fija su effort y no recorta herramientas', (level) => {
    const fields = frontmatter(readText(`agents/effort-${level}.md`));
    expect(fields.name).toBe(`effort-${level}`);
    expect(fields.description).toBeTruthy();
    expect(fields.model).toBe('inherit');
    expect(fields.effort).toBe(level);
    expect(fields).not.toHaveProperty('tools');
  });
});
