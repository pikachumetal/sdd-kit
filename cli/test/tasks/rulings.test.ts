import { describe, it, expect } from 'vitest';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

  it('rulings without ledger', () => {
    expect(listRulings(workspaceWithLedger(null))).toEqual([]);
  });
});
