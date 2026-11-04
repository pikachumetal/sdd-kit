import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkSkillSize, invokedSkills } from '../../../tests/skill-size/check.ts';

const roots: string[] = [];

function repoWithTexts(texts: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'skill-size-'));
  roots.push(root);
  for (const [name, text] of Object.entries(texts)) {
    mkdirSync(join(root, 'dist', 'skills', name), { recursive: true });
    writeFileSync(join(root, 'dist', 'skills', name, 'SKILL.md'), text);
  }
  return root;
}

const repoWithSkills = (sizes: Record<string, number>): string =>
  repoWithTexts(Object.fromEntries(Object.entries(sizes).map(([name, bytes]) => [name, 'x'.repeat(bytes)])));

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('kit:skill-size', () => {
  it('pasa con un SKILL.md de 19.999 bytes', () => {
    const result = checkSkillSize(repoWithSkills({ cabe: 19_999 }));

    expect(result.code).toBe(0);
    expect(result.lines).toEqual(['OK: todos los SKILL.md ocupan menos de 20000 bytes', 'OK: ninguna fase pasa de 100000 caracteres (la mayor, cabe: 19999)']);
  });

  it('falla con un SKILL.md de 20.000 bytes y lo nombra con su tamaño y el límite', () => {
    const result = checkSkillSize(repoWithSkills({ cabe: 19_999, justo: 20_000 }));

    expect(result.code).toBe(1);
    expect(result.lines).toEqual([
      'FALLA: dist/skills/justo/SKILL.md ocupa 20000 bytes (límite: menos de 20000)',
      'Mueve a su references/ lo que la skill solo necesita a veces.',
      'OK: ninguna fase pasa de 100000 caracteres (la mayor, justo: 20000)',
    ]);
  });

  it('mide bytes, no caracteres', () => {
    const root = repoWithSkills({});
    mkdirSync(join(root, 'dist', 'skills', 'tildes'), { recursive: true });
    writeFileSync(join(root, 'dist', 'skills', 'tildes', 'SKILL.md'), 'á'.repeat(10_000));

    expect(checkSkillSize(root).lines[0]).toBe('FALLA: dist/skills/tildes/SKILL.md ocupa 20000 bytes (límite: menos de 20000)');
  });
});

describe('kit:skill-size: la fase', () => {
  const NAMES = ['lead', 'a', 'b', 'c', 'd', 'e'];
  const padded = (text: string, chars: number): string => text + 'x'.repeat(chars - text.length);

  const invokingAll = (names: string[]): string => `${names.map((name) => `Invoke \`${name}\` now.`).join(' ')}\n`;

  it('fails on a phase of 100.001 characters', () => {
    const others = Object.fromEntries(['a', 'b', 'c', 'd', 'e'].map((name) => [name, padded('', 19_000)]));
    const result = checkSkillSize(repoWithTexts({ lead: padded(invokingAll(['a', 'b', 'c', 'd', 'e']), 20_000), ...others }));

    expect(result.code).toBe(1);
    expect(result.lines).toContain('FALLA: la fase de lead (a, b, c, d, e) suma 115000 caracteres (límite: 100000)');
  });

  it('fails on a phase of exactly 100.001 characters', () => {
    const others = Object.fromEntries(['a', 'b', 'c', 'd'].map((name) => [name, padded('', 20_000)]));
    const result = checkSkillSize(repoWithTexts({ lead: padded(invokingAll(['a', 'b', 'c', 'd', 'e']), 20_000), ...others, e: 'x' }));

    expect(result.lines).toContain('FALLA: la fase de lead (a, b, c, d, e) suma 100001 caracteres (límite: 100000)');
  });

  it('prints no phase line without skills', () => {
    const root = repoWithTexts({});
    mkdirSync(join(root, 'dist', 'skills'), { recursive: true });

    expect(checkSkillSize(root)).toEqual({ code: 0, lines: ['OK: todos los SKILL.md ocupan menos de 20000 bytes'] });
  });

  it('does not join a heading with the next paragraph', () => {
    expect(invokedSkills('## About `a`\n\nRun it with `Skill`.\n\n- See `b`\n- then go on with `Skill`.\n', 'lead', NAMES)).toEqual([]);
  });

  it('passes a phase of exactly 100.000', () => {
    const others = Object.fromEntries(['a', 'b', 'c', 'd'].map((name) => [name, padded('', 20_000)]));
    const result = checkSkillSize(repoWithTexts({ lead: padded(invokingAll(['a', 'b', 'c', 'd']), 20_000), ...others }));

    expect(result.lines.at(-1)).toBe('OK: ninguna fase pasa de 100000 caracteres (la mayor, lead: 100000)');
  });

  it('caps each skill at 20.000', () => {
    const result = checkSkillSize(repoWithTexts({ lead: padded(invokingAll(['a']), 1_000), a: padded('', 50_000) }));

    expect(result.lines.at(-1)).toBe('OK: ninguna fase pasa de 100000 caracteres (la mayor, lead: 21000)');
  });

  it('counts invoke, load and REQUIRED SUB-SKILL, with or without sdd-kit:', () => {
    const text = 'Invoke `a` now. Load `b` first. **REQUIRED SUB-SKILL:** `c` governs. Use `sdd-kit:d` with `Skill`. Then invoke `sdd-kit:e`.';

    expect(invokedSkills(text, 'lead', NAMES)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('counts only the last name before with Skill', () => {
    expect(invokedSkills('Validation and closing in `b`: hand it to `c` with `Skill` once the plan is written.', 'lead', NAMES)).toEqual(['c']);
    expect(invokedSkills('Ask with `a`, invoked with the `Skill` tool.', 'lead', NAMES)).toEqual(['a']);
  });

  it('ignores a name without an invoking form and one in a code block', () => {
    expect(invokedSkills('See `a` for more.\n\n```text\nInvoke `b` now.\n```\n', 'lead', NAMES)).toEqual([]);
  });

  it('ignores the frontmatter', () => {
    expect(invokedSkills('---\nname: lead\ndescription: Invoked from `a`; invoke `b` instead.\n---\n\nBody.\n', 'lead', NAMES)).toEqual([]);
  });

  it('does not count a skill invoking itself', () => {
    expect(invokedSkills('Invoke `lead` again.', 'lead', NAMES)).toEqual([]);
  });

  it('counts each invoked skill once', () => {
    expect(invokedSkills('Invoke `a` now. Load `a` later.', 'lead', NAMES)).toEqual(['a']);
  });
});
