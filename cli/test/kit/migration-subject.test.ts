import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MIGRATION_SUBJECT } from '../../src/estimation/authors.ts';

const upgrade = fileURLToPath(new URL('../../../skills/sdd-upgrade/SKILL.md', import.meta.url));

describe('el asunto del commit de migración', () => {
  it('estimation report reconoce el que pide sdd-upgrade', () => {
    expect(readFileSync(upgrade, 'utf8')).toContain(`\`${MIGRATION_SUBJECT} vX.Y.Z\``);
  });
});
