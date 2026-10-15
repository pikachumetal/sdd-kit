import { describe, it, expect } from 'vitest';
import { destinationExits, isRegistry } from '../../src/merge/exits.ts';

describe('salidas del destino sacado', () => {
  it('ofrece llevarlo a la feature si solo hay registros', () => {
    const lines = destinationExits('D:/r', ['.docs/sdd/roadmap.md', 'CHANGELOG.md', '.docs/sdd/estimation-log.md']);

    expect(lines).toEqual([
      'Salidas:',
      "  1. Que quien los hizo los commitee (o los descarte) en 'D:/r', y relanzar el merge.",
      '  2. Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, estimation-log).',
      '  3. Dejar el merge para luego.',
    ]);
  });

  it('con un fichero que no es registro las salidas son dos', () => {
    const lines = destinationExits('D:/r', ['.docs/sdd/roadmap.md', '.gitignore']);

    expect(lines.join('\n')).not.toContain('Llevarlos');
    expect(lines.at(-1)).toBe('  2. Dejar el merge para luego.');
  });

  it('reconoce los registros por su nombre en cualquier carpeta', () => {
    expect(['ROADMAP.md', '.docs/sdd/changelog.md', 'x/estimation-log.md'].every(isRegistry)).toBe(true);
    expect(['README.md', '.docs/sdd/tech-stack.md', 'roadmap.md.bak'].some(isRegistry)).toBe(false);
  });
});
