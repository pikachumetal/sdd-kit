import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runSdd, sddFolder } from '../capability/helpers.ts';

const proseRule = 'fuera de «Releases cerradas» el roadmap solo lleva tablas';
const releaseHeader = ['| id | Feature | Origen | Ficheros que toca | Estado |', '| --- | --- | --- | --- | --- |', ''];
const closingHelp =
  '«**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**» ni con «…: parcial — <enlace>; queda: <lo pendiente>]**»';
const stateHelp = '⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …';
const brokenFixture = fileURLToPath(new URL('../fixtures/roadmap-structure/roadmap-0fc231e-parent.md', import.meta.url));

const validLines = [
  '# Roadmap — salas',
  '',
  '## Próximo',
  '',
  '| # | Ítem | Estado |',
  '| --- | --- | --- |',
  '| 3 | Piloto en la oficina de Lugo | ⏳ |',
  '',
  '## Release 1.3',
  '',
  '| id | Feature | Origen | Ficheros que toca | Estado |',
  '| --- | --- | --- | --- | --- |',
  '| 0022 | **Festivos locales** | piloto de Lugo | `src/holidays.js` | ⏳ |',
  '| 0024 | **Recurrente mensual** — tras 0021 | dev-lead | `src/recurrence.js` | 🔄 |',
  '',
  '## Backlog',
  '',
  '| # | Ítem | Origen |',
  '| --- | --- | --- |',
  '| B1 | Reservar con un código QR | oficina de Vigo |',
  '',
  '## Deuda técnica',
  '',
  '| Ítem | Impacto | Destino |',
  '| --- | --- | --- |',
  '| **[Feature 0030, 2026-09-25: saldada — [walkthrough](specs/x/walkthrough.md)]** El correo no reintenta | medio | Actuar con un patch |',
  '| Los tests dependen de la fecha del sistema | medio | Esperar 2.º ticket |',
  '',
  '## Patches',
  '',
  '| Fecha | Id | Descripción |',
  '| --- | --- | --- |',
  '| 2026-09-22 | 0023 | El aviso no salía en festivo — [patch](specs/y/patch.md) |',
  '',
  '## Releases cerradas',
  '',
  '### v1.2.0 — 2026-09-20',
  '',
  'Aviso por correo al liberar una sala (0021) y el patch 0020, con 3 oficinas. [Changelog](changelog.md).',
  '',
  'validaciones pendientes: 0021',
  '',
  'smoke: pendiente',
  '',
  '### v1.1.0 — 2026-09-05',
  '',
  'Recurrencia semanal (0019).',
];

function lines(): string[] {
  return [...validLines];
}

function insert(target: string[], index: number, ...items: string[]): string[] {
  target.splice(index, 0, ...items);
  return target;
}

function remove(target: string[], index: number, count: number): string[] {
  target.splice(index, count);
  return target;
}

async function check(content: string[], eol = '\n') {
  return runSdd(['roadmap', 'check', '--path', sddFolder({ 'roadmap.md': content.join(eol) + eol })]);
}

function templateLines(): string[] {
  const text = readFileSync(fileURLToPath(new URL('../../../skills/sdd-templates/templates/roadmap-template.md', import.meta.url)), 'utf8');
  const all = text.split(/\r?\n/);
  if (all.at(-1) === '') all.pop();
  return all;
}

describe('sdd roadmap check: secciones', () => {
  it('a valid roadmap passes', async () => {
    const result = await check(lines());
    expect(result.lines).toEqual(['Roadmap válido']);
    expect(result.code).toBe(0);
  });

  it('check accepts a CRLF roadmap', async () => {
    const result = await check(lines(), '\r\n');
    expect(result.lines).toEqual(['Roadmap válido']);
    expect(result.code).toBe(0);
  });

  it('passes without a release section and with two releases in a row', async () => {
    expect((await check(remove(lines(), 8, 7))).code).toBe(0);
    expect((await check(insert(lines(), 15, '## Release 1.4', '', ...releaseHeader))).code).toBe(0);
  });

  it('rejects a section outside the template', async () => {
    const content = lines();
    content[8] = '## Versión siguiente';
    insert(content, 28, '## Decisiones tomadas', '');
    const result = await check(content);
    expect(result.lines).toContain('roadmap.md: línea 9: sección «Versión siguiente» fuera de la plantilla');
    expect(result.lines).toContain('roadmap.md: línea 29: sección «Decisiones tomadas» fuera de la plantilla');
    expect(result.code).toBe(1);
  });

  it('rejects a missing section', async () => {
    const result = await check(remove(lines(), 28, 6));
    expect(result.lines).toEqual(['roadmap.md: falta la sección «Patches»']);
    expect(result.code).toBe(1);
  });

  it('rejects an altered order', async () => {
    const content = lines();
    const backlog = content.slice(15, 21);
    remove(content, 15, 6);
    insert(content, 2, ...backlog);
    const result = await check(content);
    expect(result.lines).toEqual(['roadmap.md: línea 9: «Próximo» va antes que «Backlog»']);
    expect(result.code).toBe(1);
  });

  it('rejects a repeated release', async () => {
    const result = await check(insert(lines(), 15, '## Release 1.3', '', ...releaseHeader));
    expect(result.lines).toEqual(['roadmap.md: línea 16: sección «Release 1.3» repetida']);
    expect(result.code).toBe(1);
  });

  it.each(['Release próxima', 'Release'])('rejects a release without version: %s', async (title) => {
    const content = lines();
    content[8] = `## ${title}`;
    const result = await check(content);
    expect(result.lines).toContain(`roadmap.md: línea 9: «${title}» no lleva versión: «## Release <versión>»`);
    expect(result.code).toBe(1);
  });

  it('rejects a subsection outside Releases cerradas', async () => {
    const result = await check(insert(lines(), 14, '', '### Validación diferida'));
    expect(result.lines).toEqual(['roadmap.md: línea 16: subsección «Validación diferida» fuera de «Releases cerradas»']);
    expect(result.code).toBe(1);
  });
});

describe('sdd roadmap check: prosa', () => {
  it('rejects prose outside Releases cerradas', async () => {
    const content = lines();
    insert(content, 30, '> nota');
    insert(content, 16, 'Criterio de orden (dev-lead, 2026-09-21): primero lo que ven los usuarios');
    const result = await check(content);
    expect(result.lines).toEqual([
      `roadmap.md: línea 17: prosa en «Backlog»; ${proseRule}`,
      `roadmap.md: línea 32: prosa en «Patches»; ${proseRule}`,
    ]);
    expect(result.code).toBe(1);
  });

  it('admits one status line in a release and rejects the second', async () => {
    expect((await check(insert(lines(), 10, 'en preparación', ''))).code).toBe(0);
    const result = await check(insert(lines(), 10, 'en preparación', 'comprometida con el cliente', ''));
    expect(result.lines).toEqual([`roadmap.md: línea 12: prosa en «Release 1.3»; ${proseRule}`]);
    expect(result.code).toBe(1);
  });

  it.each(['v1.2.0 - 2026-09-20', 'v1.2.0 — 20 de septiembre', 'Notas'])('rejects a closed release title that is not version and date: %s', async (title) => {
    const content = lines();
    content[36] = `### ${title}`;
    const result = await check(content);
    expect(result.lines).toContain(`roadmap.md: línea 37: «${title}» no es «### v<versión> — <AAAA-MM-DD>»`);
    expect(result.code).toBe(1);
  });

  it('does not validate tables under Releases cerradas', async () => {
    const table = ['| Id | Qué | Disparador |', '| --- | --- | --- |', '| 0021 | Aviso | 🧪 al primer correo |', ''];
    expect((await check(insert(lines(), 40, ...table))).code).toBe(0);
  });
});

describe('sdd roadmap check: tablas', () => {
  it('rejects a different release header', async () => {
    const content = lines();
    content[10] = '| id | Task | Tamaño | Estado |';
    content[11] = '| --- | --- | --- | --- |';
    const result = await check(content);
    expect(result.lines).toEqual([
      'roadmap.md: línea 11: la cabecera de «Release 1.3» debe ser «| id | Feature | Origen | Ficheros que toca | Estado |»',
    ]);
    expect(result.code).toBe(1);
  });

  it.each(['pendiente', '❌ descartado'])('rejects the state «%s»', async (state) => {
    const content = lines();
    content[6] = `| 3 | Piloto en la oficina de Lugo | ${state} |`;
    const result = await check(content);
    expect(result.lines).toEqual([`roadmap.md: línea 7: estado «${state}» no admitido: ${stateHelp}`]);
    expect(result.code).toBe(1);
  });

  it.each(['✅ [walkthrough](x.md)', '⏸️ aparcada: descartada por el cliente, 2026-09-01', '🧪 validación diferida al primer correo real'])(
    'admits the state «%s»',
    async (state) => {
      const content = lines();
      content[6] = `| 3 | Piloto en la oficina de Lugo | ${state} |`;
      expect((await check(content)).code).toBe(0);
    },
  );

  it('does not count an escaped bar as a cell', async () => {
    const content = lines();
    content[6] = '| 3 | Piloto en la oficina de Lugo | pendiente \\| ⏳ |';
    const result = await check(content);
    expect(result.lines).toEqual([`roadmap.md: línea 7: estado «pendiente \\| ⏳» no admitido: ${stateHelp}`]);
  });

  it('keeps the structure messages', async () => {
    const result = await runSdd(['roadmap', 'check', '--path', sddFolder({ 'roadmap.md': readFileSync(brokenFixture, 'utf8') })]);
    for (const expected of [
      'línea 1: no empieza por «# Roadmap»',
      'línea 1: fila fuera de una tabla con cabecera y separador',
      'línea 2: fila fuera de una tabla con cabecera y separador',
      'línea 7: fila fuera de una tabla con cabecera y separador',
      'línea 8: la cabecera tiene 1 celdas y el separador 3',
      'línea 21: fila vacía',
      'línea 22: fila vacía',
    ]) {
      expect(result.lines).toContain(`roadmap.md: ${expected}`);
    }
    expect(result.code).toBe(1);
  });
});

describe('sdd roadmap check: avisos de destino y de cierre', () => {
  it('warns about a debt destination outside the template and stays valid', async () => {
    const content = lines();
    content[25] = '| El correo no reintenta | medio | Decidir dev-lead: patch |';
    const result = await check(content);
    expect(result.lines).toEqual([
      'roadmap.md: aviso: línea 26: «Destino» «Decidir dev-lead: patch» no empieza por Actuar, Esperar 2.º ticket o Descartada',
      'Roadmap válido',
    ]);
    expect(result.code).toBe(0);
  });

  it.each(['**Actuar** con un patch', 'Actuar en el lienzo 0131', 'Esperar 2.º ticket: no localizado', '**Descartada**: lo cubre la 0040'])(
    'admits the destination «%s»',
    async (destination) => {
      const content = lines();
      content[25] = `| El correo no reintenta | medio | ${destination} |`;
      expect((await check(content)).lines).toEqual(['Roadmap válido']);
    },
  );

  it('warns about a closing prefix outside the format, in debt and in backlog', async () => {
    const content = lines();
    content[19] = '| B2 | **[Feature 0031, 2026-09-25: saldada, salvo el GO — [walkthrough](w.md)]** Exportar a CSV | contabilidad |';
    content[25] = '| **[Feature 0001, 2026-09-26: parcial — [walkthrough](w.md)]** El correo no reintenta | medio | Actuar |';
    const result = await check(content);
    expect(result.lines).toEqual([
      `roadmap.md: aviso: línea 20: el prefijo de cierre no casa con ${closingHelp}`,
      `roadmap.md: aviso: línea 26: el prefijo de cierre no casa con ${closingHelp}`,
      'Roadmap válido',
    ]);
    expect(result.code).toBe(0);
  });

  it('the prefix the warning accepts is the one the cut removes, and the other warns', async () => {
    const content = lines();
    content[19] = '| B2 | **[Feature 0031, 2026-09-10: saldada — [walkthrough](w.md)]** Exportar a CSV | contabilidad |';
    content[25] = '| **[Feature 0032, 2026-09-10: saldada, salvo el GO — [walkthrough](w.md)]** El correo no reintenta | medio | Actuar |';
    const result = await check(content);
    expect(result.lines).toEqual([
      'roadmap.md: línea 20: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte',
      `roadmap.md: aviso: línea 26: el prefijo de cierre no casa con ${closingHelp}`,
    ]);
    expect(result.code).toBe(1);
  });
});

describe('sdd roadmap check: filas que salen en el corte', () => {
  it('rejects a settled row not after the last release', async () => {
    const content = lines();
    content[19] = '| B2 | **[Task 0012, 2026-09-20: saldada — [walkthrough](w.md)]** Exportar a CSV | contabilidad |';
    content[25] = '| **[Patch 0018, 2026-09-10: saldada — [patch](p.md)]** Bloqueo de SQLite | alto | Actuar |';
    const result = await check(content);
    expect(result.lines).toEqual([
      'roadmap.md: línea 20: fila saldada el 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte',
      'roadmap.md: línea 26: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte',
    ]);
    expect(result.code).toBe(1);
  });

  it('admits a partial row of any date', async () => {
    const content = lines();
    content[25] = '| **[Feature 0019, 2026-09-01: parcial — [walkthrough](w.md); queda: el borrado]** La recurrencia | bajo | Actuar |';
    expect((await check(content)).code).toBe(0);
  });

  it('without closed releases rejects no settled row and no patch', async () => {
    const content = lines();
    content[25] = '| **[Patch 0018, 2026-09-10: saldada — [patch](p.md)]** Bloqueo de SQLite | alto | Actuar |';
    content[32] = '| 2026-09-10 | 0018 | Bloqueo de SQLite — [patch](p.md) |';
    expect((await check(remove(content, 36, 11))).code).toBe(0);
  });

  it('rejects a patch not after the last release', async () => {
    const row = '| 2026-09-20 | 0020 | 🧪 validación diferida a la primera reserva nocturna — La franja de las 23:30 — [patch](specs/z/patch.md) |';
    const result = await check(insert(lines(), 33, row));
    expect(result.lines).toEqual(['roadmap.md: línea 34: patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte']);
    expect(result.code).toBe(1);
  });

  it('rejects the row of an already published feature', async () => {
    const content = lines();
    content[12] = '| 0021 | **Aviso por correo** | oficina de Vigo | `src/mail.js` | 🧪 validación diferida al primer correo real |';
    const result = await check(content);
    expect(result.lines).toEqual(['roadmap.md: línea 13: la 0021 ya está en la v1.2.0: su fila sale de «Release 1.3»']);
    expect(result.code).toBe(1);
  });

  it('recognizes a published manager id', async () => {
    const content = lines();
    content[12] = '| AB-4512 | **Aviso por correo** | oficina de Vigo | `src/mail.js` | ✅ |';
    content[38] = 'Aviso por correo al liberar una sala (AB-4512).';
    const result = await check(content);
    expect(result.lines).toEqual(['roadmap.md: línea 13: la AB-4512 ya está en la v1.2.0: su fila sale de «Release 1.3»']);
  });

  it('does not confuse a short «Próximo» number with a published id', async () => {
    const result = await check(lines());
    expect(result.lines.join('\n')).not.toMatch(/la 3 ya está/);
  });
});

describe('sdd roadmap check: entradas', () => {
  it('without roadmap exits 0', async () => {
    const result = await runSdd(['roadmap', 'check', '--path', sddFolder({})]);
    expect(result.lines).toEqual(['Sin roadmap que validar']);
    expect(result.code).toBe(0);
  });

  it('the template without its help blocks passes', async () => {
    const result = await check(templateLines().filter((line) => !line.startsWith('>')));
    expect(result.lines).toEqual(['Roadmap válido']);
  });

  it('the untouched template only fails because of its help', async () => {
    const result = await check(templateLines());
    expect(result.code).toBe(1);
    expect(result.lines.filter((line) => !line.includes('prosa en'))).toEqual([]);
  });

  it('--json reports validity, errors and warnings', async () => {
    const content = lines();
    content[25] = '| El correo no reintenta | medio | Decidir dev-lead: patch |';
    const path = sddFolder({ 'roadmap.md': content.join('\n') + '\n' });
    const result = await runSdd(['roadmap', 'check', '--path', path, '--json']);
    const parsed = JSON.parse(result.lines[0]);
    expect(parsed.valid).toBe(true);
    expect(parsed.errors).toEqual([]);
    expect(parsed.warnings).toHaveLength(1);
  });
});
