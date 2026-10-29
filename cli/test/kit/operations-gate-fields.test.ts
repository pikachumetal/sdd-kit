import { describe, it, expect } from 'vitest';
import { readText } from './kit-files.ts';

const GATE_FIELDS = ['Sin filtro', 'Lint', 'CI de la base'];

function testingSection(text: string): string {
  const start = text.indexOf('## Testing');
  const end = text.indexOf('\n## ', start + 1);
  return text.slice(start, end === -1 ? undefined : end);
}

function migrationStep(text: string, number: number): string {
  const steps = text.indexOf('Los pasos van en este orden');
  const start = text.indexOf(`\n${number}. **`, steps);
  const end = text.indexOf(`\n${number + 1}. **`, start + 1);
  return text.slice(start, end === -1 ? undefined : end);
}

function initTestingRow(text: string): string {
  return text.split(/\r?\n/).find((line) => line.startsWith('   | How it is tested')) ?? '';
}

describe('campos del gate en operations.md', () => {
  const template = testingSection(readText('skills/sdd-templates/templates/operations-template.md'));
  const migration = readText('skills/sdd-upgrade/references/migrations/v3.0.0.md');
  const init = initTestingRow(readText('skills/sdd-init/SKILL.md'));

  it.each(GATE_FIELDS)('la plantilla declara «%s» en ## Testing', (field) => {
    expect(template).toContain(`- **${field}**:`);
  });

  it('cada suite de la plantilla lleva su nivel', () => {
    const suites = template.split('\n').find((line) => line.startsWith('- **Suites**:')) ?? '';
    for (const level of ['unitario', 'integración', 'E2E', 'pendiente']) expect(suites).toContain(level);
  });

  it('el gate de cierre de la plantilla ya no es la suite completa', () => {
    expect(template).not.toContain('comando de la suite completa');
    expect(template).toContain('--include-relations');
  });

  it.each(GATE_FIELDS)('el paso 2 de la migración a v3.0.0 propone «%s»', (field) => {
    expect(migrationStep(migration, 2)).toContain(`«${field}»`);
  });

  it('el paso 9 de la migración a v3.0.0 avisa de un gate con lint', () => {
    expect(migrationStep(migration, 9)).toContain('Gate con lint: «<línea>» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate');
  });

  it.each([...GATE_FIELDS, 'nivel'])('la init propone «%s»', (field) => {
    expect(init).toContain(field);
  });
});
