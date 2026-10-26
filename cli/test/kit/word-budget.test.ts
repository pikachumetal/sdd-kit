import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { markdownFiles, readText, repoRoot, skillNames } from './kit-files.ts';

interface Budget {
  skillMd: number;
  total: number;
}

// Margen del 25 % sobre cada tope hasta la v3 y su limpieza (dev-lead, patch 0220, 2026-10-26).
const slack = 1.25;

const skillBudgets: Record<string, Budget> = {
  'add-to-changelog': { skillMd: 500, total: 500 },
  'sdd-archive': { skillMd: 3920, total: 8000 },
  'sdd-config': { skillMd: 1450, total: 1450 },
  'sdd-explore': { skillMd: 1100, total: 1100 },
  'sdd-end-release': { skillMd: 1900, total: 2500 },
  'sdd-feedback': { skillMd: 800, total: 800 },
  'sdd-grilling': { skillMd: 900, total: 900 },
  'sdd-parallel-agents': { skillMd: 1150, total: 1150 },
  'sdd-init': { skillMd: 2500, total: 3100 },
  'sdd-roadmap': { skillMd: 3600, total: 3600 },
  'sdd-rubber-duck': { skillMd: 600, total: 600 },
  'sdd-propose': { skillMd: 5250, total: 6800 },
  'sdd-implement': { skillMd: 9483, total: 13249 },
  'sdd-verify': { skillMd: 3060, total: 9120 },
  'sdd-tdd': { skillMd: 1750, total: 4030 },
  'sdd-upgrade': { skillMd: 980, total: 980 },
  'sdd-debugging': { skillMd: 1600, total: 3400 },
  'sdd-start-feature': { skillMd: 1916, total: 11322 },
  'sdd-start-patch': { skillMd: 2300, total: 2300 },
  'sdd-worktrees': { skillMd: 1300, total: 1300 },
  'sdd-templates': { skillMd: 1700, total: 15720 },
  // El hook la inyecta en cada sesión: su tope viene de antes y es más estricto que la centena.
  'using-sdd': { skillMd: 570, total: 570 },
};

const kitBudget = 91328;

const anchorBudgets: Record<string, number> = {
  'constitution.md': 2236,
  'mission.md': 1700,
  'architecture.md': 1900,
  'tech-stack.md': 19663,
};

// Al par, como el [int] de PowerShell con el que se fijaron los topes: 712,5 da 712.
function roundHalfToEven(value: number): number {
  const floor = Math.floor(value);
  const fraction = value - floor;
  if (fraction !== 0.5) return Math.round(value);
  return floor % 2 === 0 ? floor : floor + 1;
}

function budgetWithSlack(budget: number): number {
  return roundHalfToEven(budget * slack);
}

function words(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function skillWords(skill: string): number {
  const migrations = `${sep}references${sep}migrations${sep}`;
  return markdownFiles(join(repoRoot, 'skills', skill))
    .filter((path) => !path.includes(migrations))
    .reduce((sum, path) => sum + words(readFileSync(path, 'utf8')), 0);
}

function expectWithin(measured: number, budget: number): void {
  const limit = budgetWithSlack(budget);
  expect(
    measured,
    `mide ${measured} y el tope es ${limit}: recorta, o sube el tope con la decisión del dev-lead escrita en la spec`,
  ).toBeLessThanOrEqual(limit);
}

const skills = skillNames();

describe('topes de palabras', () => {
  it.each(skills)('toda skill tiene tope: %s', (skill) => {
    expect(skillBudgets[skill], `la skill ${skill} no tiene tope en word-budget.test.ts`).toBeDefined();
  });

  it.each(skills)('%s: SKILL.md cabe en su tope', (skill) => {
    expectWithin(words(readText(`skills/${skill}/SKILL.md`)), skillBudgets[skill].skillMd);
  });

  it.each(skills)('%s: la skill completa cabe en su tope', (skill) => {
    expectWithin(skillWords(skill), skillBudgets[skill].total);
  });

  it('el kit entero cabe en su presupuesto', () => {
    expectWithin(skills.reduce((sum, skill) => sum + skillWords(skill), 0), kitBudget);
  });

  it.each(Object.keys(anchorBudgets))('%s cabe en su tope', (anchor) => {
    expectWithin(words(readText(`.docs/sdd/${anchor}`)), anchorBudgets[anchor]);
  });

  it('aplica el margen redondeando al par', () => {
    expect([570, 1450, 1750].map(budgetWithSlack)).toEqual([712, 1812, 2188]);
  });
});
