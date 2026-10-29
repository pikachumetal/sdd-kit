import { describe, it, expect } from 'vitest';
import { readText } from './kit-files.ts';

const GATE_FIELDS = ['Sin filtro', 'Lint', 'CI de la base'];

function migrationStep(text: string, step: number): string {
  const steps = text.indexOf('Los pasos van en este orden');
  const start = text.indexOf(`\n${step}. **`, steps);
  const end = text.indexOf(`\n${step + 1}. **`, start + 1);
  return start === -1 ? '' : text.slice(start, end === -1 ? undefined : end);
}

function initTestingRow(text: string): string {
  return text.split(/\r?\n/).find((line) => line.startsWith('   | How it is tested')) ?? '';
}

describe('paridad migración–init de los campos del gate', () => {
  const migrationTesting = migrationStep(readText('skills/sdd-upgrade/references/migrations/v3.0.0.md'), 2);
  const initTesting = initTestingRow(readText('skills/sdd-init/SKILL.md'));

  it.each(GATE_FIELDS)('la migración a v3.0.0 y la init proponen «%s»', (field) => {
    expect(migrationTesting).toContain(`«${field}»`);
    expect(initTesting).toContain(`«${field}»`);
  });
});
