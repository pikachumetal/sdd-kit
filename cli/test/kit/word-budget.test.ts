import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isMigration, markdownFiles, readText, repoRoot, skillNames } from './kit-files.ts';

interface Budget {
  skillMd: number;
  total: number;
}

const skillBudgets: Record<string, Budget> = {
  'add-to-changelog': { skillMd: 500, total: 500 },
  'sdd-agent-writing': { skillMd: 2000, total: 8949 },
  'sdd-archive': { skillMd: 2932, total: 9904 },
  'sdd-config': { skillMd: 1450, total: 1450 },
  'sdd-explore': { skillMd: 1066, total: 1066 },
  'sdd-end-release': { skillMd: 1929, total: 2127 },
  'sdd-feedback': { skillMd: 800, total: 800 },
  'sdd-grilling': { skillMd: 817, total: 817 },
  'sdd-parallel-agents': { skillMd: 1156, total: 1156 },
  'sdd-init': { skillMd: 2667, total: 3212 },
  'sdd-retro': { skillMd: 622, total: 622 },
  'sdd-roadmap': { skillMd: 3222, total: 3630 },
  'sdd-rubber-duck': { skillMd: 600, total: 600 },
  'sdd-propose': { skillMd: 3157, total: 13927 },
  'sdd-implement': { skillMd: 2633, total: 6626 },
  'sdd-implement-native': { skillMd: 3038, total: 3038 },
  'sdd-implement-subagent': { skillMd: 2951, total: 8462 },
  'sdd-verify': { skillMd: 2606, total: 9503 },
  'sdd-tdd': { skillMd: 1723, total: 4036 },
  'sdd-upgrade': { skillMd: 980, total: 980 },
  'sdd-debugging': { skillMd: 1681, total: 3426 },
  'sdd-worktrees': { skillMd: 1459, total: 1459 },
  'sdd-templates': { skillMd: 1614, total: 16978 },
  // El hook la inyecta en cada sesión: su tope viene de antes y es más estricto que la centena.
  'using-sdd': { skillMd: 559, total: 559 },
};

const anchorBudgets: Record<string, number> = {
  '.docs/sdd/steering/constitution.md': 2250,
  'PRODUCT.md': 1799,
  '.docs/sdd/steering/architecture.md': 4877,
  '.docs/sdd/steering/operations.md': 20785,
};

function words(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function skillWords(skill: string): number {
  return markdownFiles(join(repoRoot, 'dist', 'skills', skill))
    .filter((path) => !isMigration(path))
    .reduce((sum, path) => sum + words(readFileSync(path, 'utf8')), 0);
}

function expectWithin(measured: number, budget: number): void {
  expect(
    measured,
    `mide ${measured} y el tope es ${budget}: recorta, o sube el tope con la decisión del dev-lead escrita en la spec`,
  ).toBeLessThanOrEqual(budget);
}

const skills = skillNames();
const wordsBySkill = new Map(skills.map((skill) => [skill, skillWords(skill)]));

describe('topes de palabras', () => {
  it.each(skills)('toda skill tiene tope: %s', (skill) => {
    expect(skillBudgets[skill], `la skill ${skill} no tiene tope en word-budget.test.ts`).toBeDefined();
  });

  it.each(skills)('%s: SKILL.md cabe en su tope', (skill) => {
    expectWithin(words(readText(`dist/skills/${skill}/SKILL.md`)), skillBudgets[skill].skillMd);
  });

  it.each(skills)('%s: la skill completa cabe en su tope', (skill) => {
    expectWithin(wordsBySkill.get(skill) ?? 0, skillBudgets[skill].total);
  });

  it.each(Object.keys(anchorBudgets))('%s cabe en su tope', (anchor) => {
    expectWithin(words(readText(anchor)), anchorBudgets[anchor]);
  });

  it('una skill por encima de su tope sale en rojo con las dos cifras', () => {
    expect(() => expectWithin(3692, 3600)).toThrow('mide 3692 y el tope es 3600');
  });
});
