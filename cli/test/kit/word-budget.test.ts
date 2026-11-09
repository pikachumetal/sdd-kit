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
  'sdd-archive': { skillMd: 3920, total: 9794 },
  'sdd-config': { skillMd: 1450, total: 1450 },
  'sdd-explore': { skillMd: 1100, total: 1100 },
  'sdd-end-release': { skillMd: 1920, total: 2500 },
  'sdd-feedback': { skillMd: 800, total: 800 },
  'sdd-grilling': { skillMd: 900, total: 900 },
  'sdd-parallel-agents': { skillMd: 1150, total: 1150 },
  'sdd-init': { skillMd: 2648, total: 3193 },
  'sdd-retro': { skillMd: 700, total: 700 },
  'sdd-roadmap': { skillMd: 3600, total: 3600 },
  'sdd-rubber-duck': { skillMd: 600, total: 600 },
  'sdd-propose': { skillMd: 5250, total: 14200 },
  'sdd-implement': { skillMd: 2658, total: 6657 },
  'sdd-implement-native': { skillMd: 3038, total: 3038 },
  'sdd-implement-subagent': { skillMd: 2991, total: 9000 },
  'sdd-verify': { skillMd: 3060, total: 9577 },
  'sdd-tdd': { skillMd: 1750, total: 4030 },
  'sdd-upgrade': { skillMd: 980, total: 980 },
  'sdd-debugging': { skillMd: 1700, total: 3407 },
  'sdd-worktrees': { skillMd: 1431, total: 1431 },
  'sdd-templates': { skillMd: 1700, total: 16999 },
  // El hook la inyecta en cada sesión: su tope viene de antes y es más estricto que la centena.
  'using-sdd': { skillMd: 570, total: 570 },
};

const kitBudget = 103372;

const anchorBudgets: Record<string, number> = {
  'constitution.md': 2250,
  'mission.md': 1808,
  'architecture.md': 2253,
  'tech-stack.md': 23181,
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

  it('el kit entero cabe en su presupuesto', () => {
    expectWithin([...wordsBySkill.values()].reduce((sum, count) => sum + count, 0), kitBudget);
  });

  it.each(Object.keys(anchorBudgets))('%s cabe en su tope', (anchor) => {
    expectWithin(words(readText(`.docs/sdd/${anchor}`)), anchorBudgets[anchor]);
  });

  it('una skill por encima de su tope sale en rojo con las dos cifras', () => {
    expect(() => expectWithin(3692, 3600)).toThrow('mide 3692 y el tope es 3600');
  });
});
