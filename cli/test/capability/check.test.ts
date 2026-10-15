import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { bookingsFixture as bookings, readRepoFile, repoRoot, runSdd, setPurpose, sddFolder } from './helpers.ts';

const reserveScenario = [
  '- GIVEN la sala Norte libre de 10 a 12',
  '- WHEN `salas reservar Norte 10-12`',
  '- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`',
].join('\n');
const template = readRepoFile('skills/sdd-templates/templates/capability-template.md');
const thenLine = /^- THEN lista `Sur` y `Oeste`, una por línea\n/m;
const savedLine = /^(- THEN la reserva queda guardada[^\n]*)/m;
const missingTitleMessage = 'bookings.md: el título debe ser «# Capacidad — bookings»';
const emptyPurpose = 'bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad';

async function check(files: Record<string, string>, artifact?: string) {
  const sdd = sddFolder(files);
  const args = ['capability', 'check', '--path', sdd];
  return runSdd(artifact ? [...args, '--artifact', join(sdd, artifact)] : args);
}

async function checkBookings(content: string) {
  return check({ 'capabilities/bookings.md': content });
}

function spec(block: string, deltaNames: string[]): string {
  const delta = deltaNames
    .map((name) => `### Capacidad: \`${name}\`\n\n**MODIFIED — Reservar una franja**\n${reserveScenario}\n`)
    .join('\n');
  return `---\nid: x\n---\n\n# Spec — prueba\n\n${block}\n## Decisiones que he tomado yo — valida estas\n\n1. nada\n\n## Delta de comportamiento\n\n${delta}`;
}

describe('sdd capability check on capabilities/', () => {
  it('a well-formed capability passes', async () => {
    const result = await checkBookings(bookings);
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
    expect(result.code).toBe(0);
  });

  it('skips and names a document marked «No es una capacidad.» after the title', async () => {
    const legacy = '# Documento funcional heredado\n\n> **No es una capacidad.** Documento funcional anterior al troceo.\n\n## Pantallas\n\nTexto.\n';
    const result = await check({ 'capabilities/bookings.md': bookings, 'capabilities/funcional.md': legacy });
    expect(result.lines).toEqual(['Capacidades válidas: 1 · omitidas por «No es una capacidad.»: funcional.md']);
    expect(result.code).toBe(0);
  });

  it('a document marked «No es una capacidad.» with scenarios fails', async () => {
    const marked = `# Capacidad — auth\n\n> **No es una capacidad.**\n\n## Requisitos\n\n### Entrar\n${reserveScenario}\n`;
    const result = await check({ 'capabilities/auth.md': marked });
    expect(result.lines).toEqual(['auth.md: marcado «No es una capacidad.» y con escenarios: quita la marca o los escenarios']);
    expect(result.code).toBe(1);
  });

  it('a requirement without THEN fails with file and requirement', async () => {
    const result = await checkBookings(bookings.replace(thenLine, ''));
    expect(result.lines).toContain('bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)');
    expect(result.code).toBe(1);
  });

  it('lists every missing scenario line', async () => {
    const content = bookings
      .replace(/^- (GIVEN|WHEN) la sala Norte libre de 10 a 12\n/m, '')
      .replace(/^- WHEN `salas reservar Norte 10-12`\n/m, '');
    const result = await checkBookings(content);
    expect(result.lines).toContain('bookings.md: «Reservar una franja» no tiene escenario completo (falta - GIVEN, - WHEN)');
  });

  it('a section title with trailing spaces does not hide a requirement without THEN', async () => {
    const result = await checkBookings(bookings.replace('## Requisitos', '## Requisitos  ').replace(thenLine, ''));
    expect(result.lines).toContain('bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)');
  });

  it('a loose line under a requirement fails with requirement, line and text', async () => {
    const result = await checkBookings(bookings.replace(savedLine, '$1\nguardada»)'));
    expect(result.lines).toContain('bookings.md: línea suelta en «Reservar una franja» (línea 13): «guardada»)»');
    expect(result.code).toBe(1);
  });

  it('a quote, an indented line and a blank line under a requirement are not loose', async () => {
    const result = await checkBookings(bookings.replace(savedLine, '$1\n  sigue el THEN\n\n> nota'));
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
  });

  it('a paragraph between Requisitos and the first requirement is not a loose line', async () => {
    const result = await checkBookings(bookings.replace(/^(## Requisitos[^\n]*)/m, '$1\n\nLos comandos del CLI de reservas.'));
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
  });

  it('a Se valida en line in the capability is a delta leftover', async () => {
    const result = await checkBookings(bookings.replace(savedLine, '$1\n- Se valida en: worktree con la base al día'));
    expect(result.lines).toContain('bookings.md: resto de delta «Se valida en:» en la línea 13');
    expect(result.code).toBe(1);
  });

  it('the rules header copied from the template, with its note, is admitted and checked', async () => {
    const content = bookings
      .replace('## Reglas de la capacidad', '## Reglas de la capacidad *(opcional; presente obliga a decidir)*')
      .replace(/^- \*\*Límites\*\*:.*\n/m, '');
    const result = await checkBookings(content);
    expect(result.lines).toEqual(['bookings.md: a «Reglas de la capacidad» le falta «Límites»']);
  });

  it('a Historial with the 1.x template note gets the migration warning', async () => {
    const content = `${bookings}\n## Historial *(opcional)*\n\n- 2026-09-10 — task-0004 — ADDED Reservar una franja\n`;
    const result = await checkBookings(content);
    expect(result.lines).toEqual(['bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0']);
  });

  it('a title that does not name the file fails', async () => {
    const result = await checkBookings(bookings.replace('# Capacidad — bookings', '# Capacidad — reservas'));
    expect(result.lines).toContain(missingTitleMessage);
  });

  it('a Historial section fails with the migration warning', async () => {
    const content = `${bookings}\n## Historial\n\n- 2026-09-10 — task-0004 — ADDED Reservar una franja\n`;
    const result = await checkBookings(content);
    expect(result.lines).toContain('bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0');
    expect(result.code).toBe(1);
  });

  it('another level-2 section fails', async () => {
    const result = await checkBookings(`${bookings}\n## Notas\n\nalgo\n`);
    expect(result.lines).toContain('bookings.md: sección «Notas» no admitida: solo «Propósito», «Requisitos» y «Reglas de la capacidad»');
  });

  it('without a Requisitos section fails', async () => {
    const result = await checkBookings(bookings.replace('## Requisitos', '## Comportamiento'));
    expect(result.lines).toContain('bookings.md: falta la sección «Requisitos»');
  });

  it('a delta mark in the capability fails with its line', async () => {
    const result = await checkBookings(bookings.replace('### Consultar salas libres', '**MODIFIED — Consultar salas libres**'));
    expect(result.lines.filter((line) => line.includes('bookings.md: resto de delta «**MODIFIED —» en la línea 14'))).not.toEqual([]);
  });

  it('the bold rules block of the delta fails even with a section', async () => {
    const content = bookings.replace(/^- AND sin salas libres/m, '\n**Reglas de la capacidad**\n- **Avisos**: ninguno\n- AND sin salas libres');
    const result = await checkBookings(content);
    const found = result.lines.filter(
      (line) => line.includes('resto de delta «**Reglas de la capacidad**» en la línea') && line.includes('sus entradas van en «## Reglas de la capacidad»'),
    );
    expect(found).not.toEqual([]);
  });

  it('the rules section is missing an entry', async () => {
    const result = await checkBookings(bookings.replace(/^- \*\*Límites\*\*:.*\n/m, ''));
    expect(result.lines).toContain('bookings.md: a «Reglas de la capacidad» le falta «Límites»');
  });

  it('an extra rules entry is admitted', async () => {
    const result = await checkBookings(`${bookings}- **Contrato de lectura**: la primera columna.\n`);
    expect(result.code).toBe(0);
  });

  it('a capability without a rules section passes', async () => {
    const result = await checkBookings(bookings.replace(/## Reglas de la capacidad[\s\S]*$/, ''));
    expect(result.code).toBe(0);
  });

  it('an empty folder has nothing to validate', async () => {
    const result = await check({ 'capabilities/.keep': '' });
    expect(result.lines).toEqual(['Sin capacidades que validar']);
    expect(result.code).toBe(0);
  });

  it('no folder has nothing to validate', async () => {
    const result = await check({});
    expect(result.lines).toEqual(['Sin capacidades que validar']);
    expect(result.code).toBe(0);
  });

  it('--json reports validCount and the errors', async () => {
    const good = await checkBookings(bookings);
    const sdd = sddFolder({ 'capabilities/bookings.md': bookings.replace(thenLine, '') });
    const bad = await runSdd(['capability', 'check', '--path', sdd, '--json']);
    expect(good.code).toBe(0);
    expect(JSON.parse(bad.lines.join('\n'))).toEqual({
      validCount: 0,
      errors: ['bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)'],
    });
    expect(bad.code).toBe(1);
  });
});

describe('sdd capability check --json with a missing artifact', () => {
  it('prints the error as JSON and exits 1', async () => {
    const sdd = sddFolder({ 'capabilities/bookings.md': bookings });
    const result = await runSdd(['capability', 'check', '--path', sdd, '--artifact', join(sdd, 'no-existe.md'), '--json']);
    expect(JSON.parse(result.lines.join('\n'))).toEqual({
      validCount: 0,
      errors: [`no existe el artefacto: ${join(sdd, 'no-existe.md')}`],
    });
    expect(result.code).toBe(1);
  });
});

describe('sdd capability check requires the purpose', () => {
  it('without a Propósito section fails', async () => {
    const result = await checkBookings(bookings.replace(/## Propósito[\s\S]*?(?=## Requisitos)/, ''));
    expect(result.lines).toEqual(['bookings.md: falta la sección «Propósito»']);
    expect(result.code).toBe(1);
  });

  it('an empty purpose fails', async () => {
    const result = await checkBookings(setPurpose(bookings, ''));
    expect(result.lines).toEqual([emptyPurpose]);
  });

  it('a purpose with only the help and the template gap fails as empty', async () => {
    const result = await checkBookings(setPurpose(bookings, '> Una o dos frases.\n\n<una o dos frases: qué cubre la capacidad>'));
    expect(result.lines).toEqual([emptyPurpose]);
  });

  it('a purpose over 300 characters fails with its length measured on one line', async () => {
    const result = await checkBookings(setPurpose(bookings, `${'a'.repeat(200)}\n${'b'.repeat(211)}`));
    expect(result.lines).toEqual(['bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)']);
  });

  it('a purpose of 300 characters passes', async () => {
    const result = await checkBookings(setPurpose(bookings, 'a'.repeat(300)));
    expect(result.code).toBe(0);
  });

  it('a purpose after another section fails', async () => {
    const purpose = '## Propósito\n\nReservar y consultar salas.\n\n';
    const content = bookings.replace(/## Propósito[\s\S]*?(?=## Requisitos)/, '').replace('## Reglas de la capacidad', `${purpose}## Reglas de la capacidad`);
    const result = await checkBookings(content);
    expect(result.lines).toEqual(['bookings.md: «Propósito» debe ser la primera sección']);
  });

  it('the template copied as is fails only for the title and the empty purpose', async () => {
    const result = await checkBookings(template);
    expect(result.lines).toEqual([missingTitleMessage, emptyPurpose]);
  });

  it('the template with title and purpose filled and the rest half done passes', async () => {
    const filled = template.replace('# Capacidad — <nombre>', '# Capacidad — bookings');
    const result = await checkBookings(setPurpose(filled, '> Una o dos frases.\n\nReservar y consultar salas por franja.'));
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
  });
});

describe('the repo capabilities', () => {
  it('pass the validator', async () => {
    const docs = join(repoRoot, '.docs/sdd');
    const count = readdirSync(join(docs, 'capabilities')).filter((name) => name.endsWith('.md')).length;
    const result = await runSdd(['capability', 'check', '--path', docs]);
    expect(result.lines).toEqual([`Capacidades válidas: ${count}`]);
    expect(result.code).toBe(0);
  });
});

describe('the 2.0.0 migration', () => {
  const migration = readRepoFile('skills/sdd-init-brownfield/references/migrations/v2.0.0.md');
  const stepAbout = (text: string) => migration.split('\n').find((line) => line.includes(text)) ?? '';

  it('has a step that removes the Historial section with no gate and is skipped without capabilities/', () => {
    const step = stepAbout('Historial de las capacidades');
    expect(step).toMatch(/## Historial/);
    expect(step).toMatch(/Sin gate/i);
    expect(step).toMatch(/se salta/i);
  });

  it('has a step that writes the purpose with no gate and is skipped without capabilities/', () => {
    const step = stepAbout('Propósito de las capacidades');
    expect(step).toMatch(/## Propósito/);
    expect(step).toMatch(/Sin gate/i);
    expect(step).toMatch(/se salta/i);
  });

  it('verifies with sdd capability check and leaves the rest as pending', () => {
    const verification = /## Verificación[\s\S]*/.exec(migration)?.[0] ?? '';
    expect(verification).toMatch(/sdd capability check/i);
    expect(verification).toMatch(/pendiente/i);
  });

  it('applied to a capability with history, the validator passes', async () => {
    const withHistory = `${bookings}\n## Historial\n\n- 2026-09-10 — task-0004 — ADDED Reservar una franja\n`;
    const migrated = withHistory.replace(/\n## Historial[\s\S]*?(?=\n## |$)/, '');
    const result = await checkBookings(migrated);
    expect(result.code).toBe(0);
  });
});

describe('sdd capability check with --artifact', () => {
  const capabilities = { 'capabilities/bookings.md': bookings };
  const rooms = bookings.replace(/bookings/g, 'rooms');
  const artifact = 'specs/t/spec.md';
  const specFor = (block: string, names: string[]) => ({ ...capabilities, [artifact]: spec(block, names) });

  it('a block that matches the delta passes', async () => {
    const result = await check(specFor('## Capacidades\n\n- Modificadas: `bookings` — añade «Algo»\n', ['bookings']), artifact);
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
    expect(result.code).toBe(0);
  });

  it('several capabilities on one line all count', async () => {
    const spec2 = spec('## Capacidades\n\n- Modificadas: `bookings`, `rooms` — cambian «Algo»\n', ['bookings', 'rooms']);
    const result = await check({ ...capabilities, 'capabilities/rooms.md': rooms, [artifact]: spec2 }, artifact);
    expect(result.code).toBe(0);
  });

  it('without a Capacidades block fails', async () => {
    const result = await check(specFor('', ['bookings']), artifact);
    expect(result.lines).toContain('spec.md: falta el bloque «## Capacidades»');
  });

  it('a block and a delta that do not match fail on both sides', async () => {
    const files = { ...specFor('## Capacidades\n\n- Modificadas: `bookings` — cambia «Algo»\n', ['rooms']), 'capabilities/rooms.md': rooms };
    const result = await check(files, artifact);
    expect(result.lines).toContain('spec.md: «bookings» está en el bloque «Capacidades» y no tiene subsección en el delta');
    expect(result.lines).toContain('spec.md: el delta tiene «rooms» y el bloque «Capacidades» no la nombra');
    expect(result.code).toBe(1);
  });

  it('«Ninguna» with a delta fails', async () => {
    const result = await check(specFor('## Capacidades\n\nNinguna, porque es un refactor.\n', ['bookings']), artifact);
    expect(result.lines).toContain('spec.md: el bloque dice «Ninguna» y hay delta');
  });

  it('an empty block fails', async () => {
    const result = await check(specFor('## Capacidades\n\n> Se escribe tras listar capabilities/.\n\n- Nuevas: ninguna\n', []), artifact);
    expect(result.lines).toContain('spec.md: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»');
  });

  it('«Ninguna» without a reason fails', async () => {
    const result = await check(specFor('## Capacidades\n\n- Ninguna\n', []), artifact);
    expect(result.lines).toContain('spec.md: «Ninguna» sin motivo: escribe «Ninguna, porque <motivo>»');
  });

  it('a block capability without a file fails', async () => {
    const result = await check(specFor('## Capacidades\n\n- Nuevas: `rooms` — salas y mantenimiento\n', ['rooms']), artifact);
    expect(result.lines).toContain('spec.md: «rooms» no tiene fichero en capabilities/');
  });

  it('a patch that declares «Nuevas» fails', async () => {
    const patch = spec('## Capacidades\n\n- Nuevas: `bookings` — reservas\n', ['bookings']).replace('id: x', 'id: x\ntype: patch');
    const result = await check({ ...capabilities, 'specs/p/patch.md': patch }, 'specs/p/patch.md');
    expect(result.lines).toContain('patch.md: un patch no crea capacidades: quita «Nuevas»');
  });

  const modifiedHeader = '**MODIFIED — Reservar una franja** (antes: «la reserva queda\nguardada»)\n';
  const reserveBlock = '## Capacidades\n\n- Modificadas: `bookings` — cambia «Reservar una franja»\n';

  it('an unmerged MODIFIED with a multi-line header fails naming the title', async () => {
    const delta = `### Capacidad: \`bookings\`\n\n${modifiedHeader}- GIVEN la sala Norte libre de 10 a 12\n- WHEN \`salas reservar Norte 10-12\`\n- THEN el CLI pide confirmación\n`;
    const result = await check({ ...capabilities, [artifact]: spec(reserveBlock, []) + delta }, artifact);
    expect(result.lines).toContain('spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md');
    expect(result.code).toBe(1);
  });

  it('a merged MODIFIED with a multi-line header passes', async () => {
    const delta = `### Capacidad: \`bookings\`\n\n${modifiedHeader}\n> Copia el bloque entero.\n\n- GIVEN la sala Norte libre de 10 a 12\n- WHEN \`salas reservar Norte 10-12\`\n- THEN el CLI pide confirmación\n`;
    const merged = bookings.replace(/- THEN la reserva queda guardada[^\n]*/, '- THEN el CLI pide confirmación');
    const result = await check({ 'capabilities/bookings.md': merged, [artifact]: spec(reserveBlock, []) + delta }, artifact);
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
    expect(result.code).toBe(0);
  });

  it('an unmerged ADDED fails naming the title, and a title split in two lines counts whole', async () => {
    const block = '## Capacidades\n\n- Modificadas: `bookings` — añade «Cancelar una reserva» y «Anular todas las reservas de una sala»\n';
    const scenario = '- GIVEN a\n- WHEN b\n- THEN c\n';
    const delta = `### Capacidad: \`bookings\`\n\n**ADDED — Cancelar una reserva**\n${scenario}\n**ADDED — Anular todas las reservas\nde una sala**\n${scenario}`;
    const result = await check({ ...capabilities, [artifact]: spec(block, []) + delta }, artifact);
    expect(result.lines).toContain('spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md');
    expect(result.lines).toContain('spec.md: «Anular todas las reservas de una sala» del delta no está en capabilities/bookings.md');
    expect(result.code).toBe(1);
  });

  it('a patch that returns the behaviour passes with «Ninguna, porque…» and no delta', async () => {
    const patch =
      '---\ntype: patch\n---\n\n# Patch 0013 — reserva máxima\n\n## Capacidades\n\nNinguna, porque el fix devuelve `reservar` a lo que ya dice `bookings`.\n\n## 1. Síntoma\n\nalgo\n';
    const result = await check({ ...capabilities, 'specs/p/patch.md': patch }, 'specs/p/patch.md');
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
    expect(result.code).toBe(0);
  });
});

describe('sdd capability check follows a pointer', () => {
  const link = '../../../app/.docs/sdd/capabilities/bookings.md';
  const destination = '../../app/.docs/sdd/capabilities/bookings.md';
  const pointer = (target = link, extra = '') =>
    `# Capacidad — bookings (puntero)\n\n> **Esta capacidad no vive aquí.** Su verdad está en [app/bookings.md](${target})\n\n## Propósito\n\nReservas de salas.\n${extra}`;
  const block = '## Capacidades\n\n- Modificadas: `bookings` — añade «Cancelar una reserva»\n';
  const added = '### Capacidad: `bookings`\n\n**ADDED — Cancelar una reserva**\n- GIVEN a\n- WHEN b\n- THEN c\n';

  it('a pointer to a valid capability passes and counts', async () => {
    const result = await check({ 'capabilities/bookings.md': pointer(), [destination]: bookings });
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
    expect(result.code).toBe(0);
  });

  it('a pointer reports the problems of its destination', async () => {
    const result = await check({ 'capabilities/bookings.md': pointer(), [destination]: bookings.replace(thenLine, '') });
    expect(result.lines).toEqual([
      `bookings.md → ${link}: «Consultar salas libres» no tiene escenario completo (falta - THEN)`,
    ]);
    expect(result.code).toBe(1);
  });

  it('a pointer whose destination does not exist fails', async () => {
    const result = await check({ 'capabilities/bookings.md': pointer() });
    expect(result.lines).toEqual([`bookings.md: el destino del puntero no existe: ${link}`]);
    expect(result.code).toBe(1);
  });

  it('a pointer without a link to its capability fails', async () => {
    const result = await check({ 'capabilities/bookings.md': pointer('../../../app/.docs/sdd/capabilities/rooms.md') });
    expect(result.lines).toEqual(['bookings.md: el puntero no enlaza en una cita a <…>/capabilities/bookings.md']);
  });

  it('a pointer with scenarios fails', async () => {
    const extra = '\n## Requisitos\n\n### Algo\n\n- GIVEN a\n- WHEN b\n- THEN c\n';
    const result = await check({ 'capabilities/bookings.md': pointer(link, extra), [destination]: bookings });
    expect(result.lines).toEqual(['bookings.md: un puntero no lleva escenarios: van en su destino']);
  });

  it('a pointer marked «No es una capacidad.» is skipped, not followed', async () => {
    const marked = `# Capacidad — bookings (puntero)

> **No es una capacidad.** Su verdad está en [app/bookings.md](${link})
`;
    const result = await check({ 'capabilities/bookings.md': marked });
    expect(result.lines).toEqual(['Capacidades válidas: 0 · omitidas por «No es una capacidad.»: bookings.md']);
    expect(result.code).toBe(0);
  });

  it('a pointer link is resolved from the pointer folder', async () => {
    const result = await check({ 'capabilities/bookings.md': pointer(`./${link}`), [destination]: bookings });
    expect(result.lines).toEqual(['Capacidades válidas: 1']);
  });

  it('the delta is checked against the pointer destination', async () => {
    const files = { 'capabilities/bookings.md': pointer(), [destination]: bookings, 'specs/t/spec.md': spec(block, []) + added };
    const result = await check(files, 'specs/t/spec.md');
    expect(result.lines).toEqual([`spec.md: «Cancelar una reserva» del delta no está en ${link}`]);
    expect(result.code).toBe(1);
  });
});

describe('sdd capability check --artifact separates foreign failures', () => {
  const artifact = 'specs/t/spec.md';
  const rooms = '# Capacidad — rooms\n\n## Propósito\n\nSalas y su aforo.\n';
  const roomsProblem = 'rooms.md: falta la sección «Requisitos»';
  const header = 'Ajenos al artefacto, no cambian el código de salida: 1';
  const block = '## Capacidades\n\n- Modificadas: `bookings` — cambia «Reservar una franja»\n';
  const files = (bookingsContent = bookings, specContent = spec(block, ['bookings'])) => ({
    'capabilities/bookings.md': bookingsContent,
    'capabilities/rooms.md': rooms,
    [artifact]: specContent,
  });

  it('foreign failures do not change the exit code', async () => {
    const result = await check(files(), artifact);
    expect(result.lines).toEqual(['Capacidades válidas: 1', header, `  ${roomsProblem}`]);
    expect(result.code).toBe(0);
  });

  it('a failure in a delta capability exits 1 and keeps the foreign block', async () => {
    const result = await check(files(bookings.replace(thenLine, '')), artifact);
    expect(result.lines).toEqual([
      'bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)',
      header,
      `  ${roomsProblem}`,
    ]);
    expect(result.code).toBe(1);
  });

  it('an artifact failure exits 1 without a foreign block', async () => {
    const empty = spec('## Capacidades\n\n- Nuevas: ninguna\n', []);
    const result = await check({ 'capabilities/bookings.md': bookings, [artifact]: empty }, artifact);
    expect(result.lines).toEqual([
      'spec.md: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»',
    ]);
    expect(result.code).toBe(1);
  });

  it('with «Ninguna, porque» every capability failure is foreign', async () => {
    const none = spec('## Capacidades\n\nNinguna, porque es un refactor.\n', []);
    const result = await check(files(bookings.replace(thenLine, ''), none), artifact);
    expect(result.lines).toContain(`  ${roomsProblem}`);
    expect(result.lines).toContain('  bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)');
    expect(result.lines[0]).toBe('Capacidades válidas: 0');
    expect(result.code).toBe(0);
  });

  it('a delta name in another case still owns the capability', async () => {
    const upper = spec(block.replace('`bookings`', '`Bookings`'), ['Bookings']);
    const result = await check(files(bookings.replace(thenLine, ''), upper), artifact);
    expect(result.lines[0]).toBe('bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)');
    expect(result.code).toBe(1);
  });

  it('--artifact --json reports foreign', async () => {
    const sdd = sddFolder(files());
    const result = await runSdd(['capability', 'check', '--path', sdd, '--artifact', join(sdd, artifact), '--json']);
    expect(JSON.parse(result.lines.join('\n'))).toEqual({ validCount: 1, errors: [], foreign: [roomsProblem] });
    expect(result.code).toBe(0);
  });

  it('--json without --artifact has no foreign key', async () => {
    const sdd = sddFolder({ 'capabilities/rooms.md': rooms });
    const result = await runSdd(['capability', 'check', '--path', sdd, '--json']);
    expect(JSON.parse(result.lines.join('\n'))).toEqual({ validCount: 0, errors: [roomsProblem] });
    expect(result.code).toBe(1);
  });
});
