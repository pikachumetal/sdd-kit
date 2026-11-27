import { describe, it, expect } from 'vitest';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { wrapLine } from '../../src/cli/wrap.ts';
import { listRulings } from '../../src/tasks/rulings.ts';

const ledgerText = [
  '# SDD ledger — plan: docs/plan.md',
  'Task 1: complete (commits aaaaaaa..bbbbbbb, review clean)',
  'Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24',
  'Task 2: complete (commits bbbbbbb..ccccccc, review clean)',
  'Final: minor (deferred) nombre de variable poco claro en parse()',
  'Final: Ruling: no se renombra Foo — fuera de alcance',
  '',
].join('\n');

function workspaceWithLedger(text: string | null): string {
  const dir = mkdtempSync(join(tmpdir(), 'sdd-rulings-'));
  mkdirSync(dir, { recursive: true });
  if (text !== null) writeFileSync(join(dir, 'progress.md'), text);
  return dir;
}

describe('sdd ledger rulings', () => {
  it('rulings lists rulings and deferred minors in ledger order', () => {
    expect(listRulings(workspaceWithLedger(ledgerText))).toEqual([
      'Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24',
      'Final: minor (deferred) nombre de variable poco claro en parse()',
      'Final: Ruling: no se renombra Foo — fuera de alcance',
    ]);
  });

  it('rulings skips table rows of the pre-flight scan', () => {
    const text = [
      '| Task 1 · Task 2 | `parse()` | Ruling: se usa la firma de la Task 1 |',
      'Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24',
      '',
    ].join('\n');
    expect(listRulings(workspaceWithLedger(text))).toEqual(['Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24']);
  });

  it('wrapLine splits a long ruling at 120 columns with a two-space continuation', () => {
    const long = `Task 3: Ruling: ${'se queda la regla vieja porque el plan no la nombra '.repeat(6).trim()}`;
    const lines = wrapLine(long);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.filter((line) => line.length > 120)).toEqual([]);
    expect(lines.slice(1).every((line) => /^ {2}\S/.test(line))).toBe(true);
    expect(lines.map((line) => line.trim()).join(' ')).toBe(long);
    expect(wrapLine('Task 1: Ruling: corta')).toEqual(['Task 1: Ruling: corta']);
  });

  it('wrapLine keeps the indent, drops double spaces and never opens a continuation with a Markdown marker', () => {
    expect(wrapLine('  aaa  bbb ccc', 9)).toEqual(['  aaa bbb', '  ccc']);
    expect(wrapLine('aaa bbb - ccc', 7)).toEqual(['aaa', '  bbb -', '  ccc']);
  });

  it('rulings without ledger', () => {
    expect(listRulings(workspaceWithLedger(null))).toEqual([]);
  });
});
