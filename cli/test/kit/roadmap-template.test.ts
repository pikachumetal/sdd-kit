import { describe, it, expect } from 'vitest';
import { readText } from './kit-files.ts';

describe('contrato de la plantilla del roadmap con sdd roadmap check', () => {
  it('la cabecera de release del validador es la de roadmap-template.md', () => {
    const header = readText('skills/sdd-templates/templates/roadmap-template.md')
      .split(/\r?\n/)
      .find((line) => line.startsWith('> | id |'))
      ?.replace(/^> /, '');
    expect(header).toBeTruthy();
    expect(readText('cli/src/roadmap/tables.ts')).toContain(`'${header}'`);
  });
});
