import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkSkillSize } from '../../../tests/skill-size/check.ts';

const roots: string[] = [];

function repoWithSkills(sizes: Record<string, number>): string {
  const root = mkdtempSync(join(tmpdir(), 'skill-size-'));
  roots.push(root);
  for (const [name, bytes] of Object.entries(sizes)) {
    mkdirSync(join(root, 'skills', name), { recursive: true });
    writeFileSync(join(root, 'skills', name, 'SKILL.md'), 'x'.repeat(bytes));
  }
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('kit:skill-size', () => {
  it('pasa con un SKILL.md de 19.999 bytes', () => {
    const result = checkSkillSize(repoWithSkills({ cabe: 19_999 }));

    expect(result.code).toBe(0);
    expect(result.lines).toEqual(['OK: todos los SKILL.md ocupan menos de 20000 bytes']);
  });

  it('falla con un SKILL.md de 20.000 bytes y lo nombra con su tamaño y el límite', () => {
    const result = checkSkillSize(repoWithSkills({ cabe: 19_999, justo: 20_000 }));

    expect(result.code).toBe(1);
    expect(result.lines).toEqual([
      'FALLA: skills/justo/SKILL.md ocupa 20000 bytes (límite: menos de 20000)',
      'Mueve a su references/ lo que la skill solo necesita a veces.',
    ]);
  });

  it('mide bytes, no caracteres', () => {
    const root = repoWithSkills({});
    mkdirSync(join(root, 'skills', 'tildes'), { recursive: true });
    writeFileSync(join(root, 'skills', 'tildes', 'SKILL.md'), 'á'.repeat(10_000));

    expect(checkSkillSize(root).lines[0]).toBe('FALLA: skills/tildes/SKILL.md ocupa 20000 bytes (límite: menos de 20000)');
  });
});
