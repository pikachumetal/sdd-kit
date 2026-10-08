import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readRepoFile, runSdd, sddFolder } from './helpers.ts';

const bookings = [
  '# Capacidad — bookings',
  '',
  '## Propósito',
  '',
  'Reservar y consultar salas por franja horaria desde el CLI.',
  '',
  '## Requisitos',
  '',
  '### Reservar una franja',
  '',
  '- GIVEN la sala Norte libre de 10 a 12',
  '- WHEN `salas reservar Norte 10-12`',
  '- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`',
  '',
  '### Consultar salas libres',
  '',
  '- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12',
  '- WHEN `salas libres 10-12`',
  '- THEN lista `Sur` y `Oeste`, una por línea',
  '',
  '## Reglas de la capacidad',
  '',
  '- **Dónde viven los datos**: `data/bookings.json`.',
  '- **Idioma de los nombres**: comandos y mensajes en castellano.',
  '- **Límites**: una reserva dura como máximo 4 h.',
  '- **Avisos**: aviso si la reserva pisa un festivo',
  '- **Regla ante conflicto**: no aplica.',
  '',
].join('\n');

const added = [
  '**ADDED — Cancelar una reserva**',
  '- GIVEN la reserva Norte 10-12',
  '- WHEN `salas cancelar Norte 10-12`',
  '- THEN la franja queda libre y el CLI responde `Cancelada Norte 10-12`',
  '- Se valida en: worktree con la base al día',
].join('\n');

const modified = [
  '**MODIFIED — Reservar una franja** (antes: «la reserva queda',
  'guardada»)',
  '',
  '> Copia el bloque entero del requisito vigente con los cambios.',
  '',
  '- GIVEN la sala Norte libre de 10 a 12',
  '- WHEN `salas reservar Norte 10-12`',
  '- THEN la reserva queda guardada a nombre del usuario y el CLI responde `Reservada Norte 10-12`',
].join('\n');

const removed = '**REMOVED — Consultar salas libres**\n- motivo: lo cubre `salas agenda`';
const rules = '**Reglas de la capacidad**\n- **Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h';
const roomsDelta = (title: string) =>
  `### Capacidad: \`rooms\`\n\n**ADDED — ${title}**\n- GIVEN la sala Norte con aforo 8\n- WHEN \`salas aforo Norte\`\n- THEN responde \`Norte: 8 personas\``;
const genericRoomsDelta = '### Capacidad: `rooms`\n\n**ADDED — Consultar el aforo**\n- GIVEN una sala\n- WHEN se consulta\n- THEN responde';

function spec(block: string, sections: string[]): string {
  return `---\nid: x\n---\n\n# Spec — prueba\n\n## Capacidades\n\n${block}\n\n## Decisiones que he tomado yo — valida estas\n\n1. nada\n\n## Delta de comportamiento\n\n${sections.join('\n\n')}\n`;
}

function bookingsSpec(entries: string[]): string {
  return spec('- Modificadas: `bookings` — cambia la reserva', [`### Capacidad: \`bookings\`\n\n${entries.join('\n\n')}`]);
}

function bookingsFolder(entries: string[], capability = bookings): string {
  return sddFolder({ 'capabilities/bookings.md': capability, 'specs/x/spec.md': bookingsSpec(entries) });
}

function readCapability(sdd: string, name = 'bookings'): string {
  return readFileSync(join(sdd, `capabilities/${name}.md`), 'utf8');
}

async function merge(sdd: string, artifact = 'specs/x/spec.md') {
  return runSdd(['capability', 'merge', '--path', sdd, '--artifact', join(sdd, artifact)]);
}

async function validate(sdd: string) {
  return runSdd(['capability', 'check', '--path', sdd, '--artifact', join(sdd, 'specs/x/spec.md')]);
}

describe('sdd capability merge', () => {
  it('merges ADDED, a split-header MODIFIED, REMOVED and a rule', async () => {
    const sdd = bookingsFolder([added, modified, removed, rules]);
    const result = await merge(sdd);
    expect(result.lines).toEqual([
      'bookings.md: añadido «Cancelar una reserva»',
      'bookings.md: sustituido «Reservar una franja»',
      'bookings.md: quitado «Consultar salas libres»',
      'bookings.md: regla «Avisos» sustituida',
    ]);
    expect(result.code).toBe(0);
    const content = readCapability(sdd);
    expect(content).toMatch(/### Reservar una franja[\s\S]*a nombre del usuario[\s\S]*### Cancelar una reserva/);
    expect(content).not.toMatch(/Consultar salas libres/);
    expect(content).not.toMatch(/- motivo:/);
    expect(content).toMatch(/^- \*\*Avisos\*\*: aviso si la reserva pisa un festivo o dura más de 4 h$/m);
    expect(content).toMatch(/^- \*\*Límites\*\*: una reserva dura como máximo 4 h\.$/m);
    expect((await validate(sdd)).lines).toEqual(['Capacidades válidas: 1']);
  });

  it('leaves out Se valida en, the help and the split antes', async () => {
    const sdd = bookingsFolder([added, modified]);
    expect((await merge(sdd)).code).toBe(0);
    const content = readCapability(sdd);
    expect(content).not.toMatch(/Se valida en/);
    expect(content).not.toMatch(/guardada»\)/);
    expect(content).not.toMatch(/^>/m);
  });

  it('normalizes the blank lines of the file it touches', async () => {
    const capability = bookings.replace('### Reservar una franja\n\n', '### Reservar una franja\n').replace('## Requisitos\n', '## Requisitos\n\n');
    const sdd = bookingsFolder([added], capability);
    expect((await merge(sdd)).code).toBe(0);
    const lines = readCapability(sdd).split('\n');
    expect(lines.join('\n')).not.toMatch(/\n\n\n/);
    lines.forEach((line, index) => {
      if (/^#{1,3} /.test(line)) expect(lines[index + 1], `tras «${line}» va una línea en blanco`).toBe('');
    });
  });

  it('keeps text that is not a requirement', async () => {
    const capability = bookings.replace('## Requisitos\n', '## Requisitos\n\nLos comandos del CLI de reservas.\n');
    const sdd = bookingsFolder([added], capability);
    expect((await merge(sdd)).code).toBe(0);
    expect(readCapability(sdd)).toMatch(/## Requisitos\n\nLos comandos del CLI de reservas\.\n\n### Reservar una franja[\s\S]*### Cancelar una reserva/);
  });

  it('a MODIFIED that is not there fails and writes nothing', async () => {
    const missing = '**MODIFIED — Anular una reserva**\n- GIVEN una reserva\n- WHEN se anula\n- THEN desaparece';
    const sdd = bookingsFolder([added, removed, missing]);
    const result = await merge(sdd);
    expect(result.lines).toContain('spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md');
    expect(result.code).toBe(1);
    expect(readCapability(sdd)).toBe(bookings);
  });

  it('a failure in one capability writes none', async () => {
    const rooms =
      '# Capacidad — rooms\n\n## Propósito\n\nSalas.\n\n## Requisitos\n\n### Listar salas\n\n- GIVEN dos salas\n- WHEN `salas lista`\n- THEN las lista\n';
    const brokenRooms = '### Capacidad: `rooms`\n\n**MODIFIED — Borrar una sala**\n- GIVEN una sala\n- WHEN se borra\n- THEN no está';
    const delta = spec('- Modificadas: `bookings`, `rooms` — cambian', [`### Capacidad: \`bookings\`\n\n${added}`, brokenRooms]);
    const sdd = sddFolder({ 'capabilities/bookings.md': bookings, 'capabilities/rooms.md': rooms, 'specs/x/spec.md': delta });
    expect((await merge(sdd)).code).toBe(1);
    expect(readCapability(sdd)).toBe(bookings);
  });

  it('a citation of a decision by number fails and writes nothing', async () => {
    const sdd = bookingsFolder([added.replace('queda libre', 'queda libre, por la decisión 10,')]);
    const result = await merge(sdd);
    expect(result.lines).toContain(
      'spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar',
    );
    expect(result.code).toBe(1);
    expect(readCapability(sdd)).toBe(bookings);
  });

  it('inside backticks does not count as a citation', async () => {
    const quoted = added.replace('queda libre', 'queda libre (el texto `por la decisión 10` no se copia)');
    expect((await merge(bookingsFolder([quoted]))).code).toBe(0);
  });

  it('running it again changes nothing', async () => {
    const sdd = bookingsFolder([added, modified, removed, rules]);
    expect((await merge(sdd)).code).toBe(0);
    const first = readCapability(sdd);
    const second = await merge(sdd);
    expect(second.code).toBe(0);
    expect(second.lines).toContain('bookings.md: «Cancelar una reserva» ya estaba');
    expect(second.lines).toContain('bookings.md: «Consultar salas libres» ya no estaba');
    expect(readCapability(sdd)).toBe(first);
  });

  it('an ADDED with the title already present and other text fails', async () => {
    const sdd = bookingsFolder([added]);
    expect((await merge(sdd)).code).toBe(0);
    writeFileSync(join(sdd, 'specs/x/spec.md'), bookingsSpec([added.replace('queda libre', 'queda libre al momento')]));
    const result = await merge(sdd);
    expect(result.lines).toContain('spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED');
    expect(result.code).toBe(1);
  });

  it('a capability declared in Nuevas is created with its purpose', async () => {
    const files = {
      'capabilities/bookings.md': bookings,
      'specs/x/spec.md': spec('- Nuevas: `rooms` — Salas, su aforo y su mantenimiento', [roomsDelta('Consultar el aforo')]),
    };
    const sdd = sddFolder(files);
    expect((await merge(sdd)).code).toBe(0);
    expect(readCapability(sdd, 'rooms').split('\n').slice(0, 9)).toEqual([
      '# Capacidad — rooms', '', '## Propósito', '', 'Salas, su aforo y su mantenimiento', '', '## Requisitos', '', '### Consultar el aforo',
    ]);
  });

  it('the first capability of a project without a capabilities folder is created', async () => {
    const sdd = sddFolder({ 'specs/x/spec.md': spec('- Nuevas: `rooms` — Salas, su aforo y su mantenimiento', [roomsDelta('Consultar el aforo')]) });
    const result = await merge(sdd);
    expect(result.lines).toEqual(['rooms.md: añadido «Consultar el aforo»']);
    expect(result.code).toBe(0);
    expect(readCapability(sdd, 'rooms')).toMatch(/^# Capacidad — rooms/);
  });

  it('an unclosed parenthesis in the header does not swallow the rest of the delta', async () => {
    const unbalanced = modified.replace('(antes: «la reserva queda\nguardada»)', '(antes: «abre con ( el valor»)');
    const sdd = bookingsFolder([unbalanced, added]);
    const result = await merge(sdd);
    expect(result.lines).toEqual(['bookings.md: sustituido «Reservar una franja»', 'bookings.md: añadido «Cancelar una reserva»']);
    expect(readCapability(sdd)).toMatch(/a nombre del usuario/);
  });

  it('a header without a readable title fails without writing', async () => {
    const sdd = bookingsFolder([added.replace('ADDED — ', 'ADDED - ')]);
    const result = await merge(sdd);
    expect(result.lines).toContain('spec.md: no leo el título de «**ADDED - Cancelar una reserva**»: escríbelo como «**ADDED — <título>**», con raya');
    expect(result.code).toBe(1);
    expect(readCapability(sdd)).toBe(bookings);
  });

  it('a less-than and a greater-than with spaces are not a template gap', async () => {
    const comparison = added.replace('la franja queda libre', 'la franja queda libre si dura < 4 h y el aforo es > 2');
    expect((await merge(bookingsFolder([comparison]))).code).toBe(0);
  });

  it('a dialect tag and a project marker are not a template gap; a template literal is', async () => {
    const tagged = bookings.replace(/^(- THEN la reserva queda guardada.*)$/m, '$1 <!-- db:sqlite -->');
    const delta = `${modified.replace(/^(- THEN .*)$/m, '$1 <!-- db:sqlite -->')}\n- AND el aviso sale en <destino>`;
    const sdd = bookingsFolder([delta], tagged);
    const result = await merge(sdd);
    expect(result.lines).toEqual(['bookings.md: sustituido «Reservar una franja»']);
    expect(result.code).toBe(0);
    const content = readCapability(sdd);
    expect(content).toMatch(/^- THEN la reserva queda guardada a nombre del usuario .* <!-- db:sqlite -->$/m);
    expect(content).toMatch(/^- AND el aviso sale en <destino>$/m);

    const gap = await merge(bookingsFolder([added.replace('Cancelar una reserva', '<título estable>')]));
    expect(gap.lines).toContain('spec.md: «<título estable>» es un hueco de la plantilla: rellénalo o borra lo que no aplique');
    expect(gap.code).toBe(1);
  });

  it('without Nuevas fails', async () => {
    const files = { 'capabilities/bookings.md': bookings, 'specs/x/spec.md': spec('- Modificadas: `rooms` — aforo', [genericRoomsDelta]) };
    const sdd = sddFolder(files);
    const result = await merge(sdd);
    expect(result.lines).toContain('spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»');
    expect(result.code).toBe(1);
    expect(existsSync(join(sdd, 'capabilities/rooms.md'))).toBe(false);
  });

  it('from a patch.md fails', async () => {
    const files = { 'capabilities/bookings.md': bookings, 'specs/x/patch.md': spec('- Nuevas: `rooms` — aforo', [genericRoomsDelta]) };
    const result = await merge(sddFolder(files), 'specs/x/patch.md');
    expect(result.lines).toContain('patch.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»');
    expect(result.code).toBe(1);
  });

  it('a new rule is added in canonical order and creates the section if missing', async () => {
    const withoutLimits = bookings.replace(/- \*\*Límites\*\*:[^\n]*\n/, '');
    const first = bookingsFolder(['**Reglas de la capacidad**\n- **Límites**: una reserva dura como máximo 3 h.'], withoutLimits);
    expect((await merge(first)).lines).toEqual(['bookings.md: regla «Límites» añadida']);
    expect(readCapability(first)).toMatch(/\*\*Idioma de los nombres\*\*[\s\S]*\*\*Límites\*\*: una reserva dura como máximo 3 h\.[\s\S]*\*\*Avisos\*\*/);

    const withoutSection = bookings.replace(/\n## Reglas de la capacidad[\s\S]*$/, '\n');
    const second = bookingsFolder([rules], withoutSection);
    expect((await merge(second)).code).toBe(0);
    expect(readCapability(second)).toMatch(/## Reglas de la capacidad\n\n- \*\*Avisos\*\*: aviso si la reserva pisa un festivo o dura más de 4 h\n$/);
  });

  it('a rule with a continuation is replaced whole', async () => {
    const capability = bookings.replace(/(- \*\*Avisos\*\*: aviso si la reserva pisa un festivo)/, '$1\n  y si la sala está en mantenimiento');
    const sdd = bookingsFolder([rules], capability);
    expect((await merge(sdd)).code).toBe(0);
    expect(readCapability(sdd)).not.toMatch(/mantenimiento/);
  });

  it('a title with extra spaces matches; with other capitals it fails', async () => {
    const spaced = modified.replace('Reservar una franja', 'Reservar  una franja ');
    expect((await merge(bookingsFolder([spaced]))).lines).toEqual(['bookings.md: sustituido «Reservar una franja»']);

    const cased = modified.replace('Reservar una franja', 'reservar una franja');
    expect((await merge(bookingsFolder([cased]))).lines).toContain('spec.md: «reservar una franja» del MODIFIED no está en capabilities/bookings.md');
  });

  it('keeps CRLF if the file uses it', async () => {
    const sdd = bookingsFolder([added], bookings.replace(/\n/g, '\r\n'));
    expect((await merge(sdd)).code).toBe(0);
    const content = readCapability(sdd);
    expect(content).toMatch(/Cancelar una reserva\r\n/);
    expect(content).not.toMatch(/[^\r]\n/);
  });

  it('merge keeps CRLF endings', async () => {
    const sdd = bookingsFolder([added, modified, removed, rules], bookings.replace(/\n/g, '\r\n'));
    expect((await merge(sdd)).code).toBe(0);
    const content = readCapability(sdd);
    expect(content).toContain('\r\n');
    expect(content.replace(/\r\n/g, '')).not.toMatch(/\n/);
  });

  it('without a delta writes Sin delta que fusionar and exits 0', async () => {
    const sdd = sddFolder({ 'capabilities/bookings.md': bookings, 'specs/x/spec.md': spec('- Ninguna, porque refactor', []) });
    const result = await merge(sdd);
    expect(result.lines).toEqual(['Sin delta que fusionar']);
    expect(result.code).toBe(0);
  });

  it('the spec-template copied untouched fails with the gap and writes nothing', async () => {
    const template = readRepoFile('skills/sdd-templates/templates/spec-template.md');
    const sdd = sddFolder({ 'capabilities/bookings.md': bookings, 'specs/x/spec.md': template });
    const result = await merge(sdd);
    expect(result.lines.join('\n')).toMatch(/es un hueco de la plantilla/);
    expect(result.code).toBe(1);
    expect(readCapability(sdd)).toBe(bookings);
  });

  it('the spec-template half filled fails with the gap', async () => {
    const template = readRepoFile('skills/sdd-templates/templates/spec-template.md')
      .replace(/`<nombre>`/g, '`bookings`')
      .replace(/\*\*ADDED — <título estable>\*\*/g, '**ADDED — Cancelar una reserva**');
    const sdd = sddFolder({ 'capabilities/bookings.md': bookings, 'specs/x/spec.md': template });
    const result = await merge(sdd);
    expect(result.lines.join('\n')).toMatch(/es un hueco de la plantilla/);
    expect(result.code).toBe(1);
    expect(readCapability(sdd)).toBe(bookings);
  });

  it('exits 2 without --artifact', async () => {
    const result = await runSdd(['capability', 'merge', '--path', sddFolder({})]);
    expect(result.code).toBe(2);
  });
});

describe('a MODIFIED that copies fewer AND and THEN than the live requirement', () => {
  const fourAnds = bookings.replace(
    /^(- THEN la reserva queda guardada.*)$/m,
    '$1\n- AND la sala aparece ocupada\n- AND el CLI avisa si pisa un festivo\n- AND la franja dura como máximo 4 h\n- AND el CLI lo apunta en el historial',
  );
  const threeAnds = [
    '**MODIFIED — Reservar una franja**',
    '- GIVEN la sala Norte libre de 10 a 12',
    '- WHEN `salas reservar Norte 10-12`',
    '- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`',
    '- AND la sala aparece ocupada',
    '- AND el CLI avisa si pisa un festivo',
    '- AND la franja dura como máximo 4 h',
  ].join('\n');

  it('fails naming the line that would be lost and writes nothing', async () => {
    const sdd = bookingsFolder([threeAnds], fourAnds);
    const result = await merge(sdd);
    expect(result.lines).toEqual([
      'spec.md: «Reservar una franja» del MODIFIED perdería «- AND el CLI lo apunta en el historial» de capabilities/bookings.md: cópiala en el delta o retírala con «- REMOVED AND el CLI lo apunta en el historial»',
    ]);
    expect(result.code).toBe(1);
    expect(readCapability(sdd)).toBe(fourAnds);
  });

  it('with the line retired with - REMOVED removes it, and running again changes nothing', async () => {
    const sdd = bookingsFolder([`${threeAnds}\n- REMOVED AND el CLI lo apunta en el historial`], fourAnds);
    const result = await merge(sdd);
    expect(result.lines).toEqual(['bookings.md: sustituido «Reservar una franja»']);
    expect(result.code).toBe(0);
    const content = readCapability(sdd);
    expect(content).not.toMatch(/historial/);
    expect(content).toMatch(/^- AND la franja dura como máximo 4 h$/m);
    expect((await merge(sdd)).code).toBe(0);
    expect(readCapability(sdd)).toBe(content);
    expect((await validate(sdd)).lines).toEqual(['Capacidades válidas: 1']);
  });

  it('a retirement that matches no live line does not count', async () => {
    const sdd = bookingsFolder([`${threeAnds}\n- REMOVED AND el CLI lo apunta`], fourAnds);
    const result = await merge(sdd);
    expect(result.lines.join('\n')).toMatch(/perdería «- AND el CLI lo apunta en el historial»/);
    expect(result.code).toBe(1);
  });
});
