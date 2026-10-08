import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { bookingsFixture, readRepoFile, repoRoot, runSdd, setPurpose, sddFolder } from './helpers.ts';

const template = readRepoFile('skills/sdd-templates/templates/capability-template.md');
const rooms = bookingsFixture.replace('# Capacidad — bookings', '# Capacidad — rooms').replace(/## Propósito[\s\S]*?(?=## Requisitos)/, '');

async function index(sdd: string) {
  return runSdd(['capability', 'index', '--path', sdd]);
}

describe('sdd capability index cases', () => {
  it('lists each capability with its purpose, by name, and flags the one without', async () => {
    const bookings = setPurpose(bookingsFixture, 'Reservar, consultar y cancelar salas por franja horaria.');
    const result = await index(sddFolder({ 'capabilities/rooms.md': rooms, 'capabilities/bookings.md': bookings }));
    expect(result.lines).toEqual([
      '- `bookings` — Reservar, consultar y cancelar salas por franja horaria.',
      '- `rooms` — (sin propósito)',
    ]);
    expect(result.code).toBe(0);
  });

  it('joins a multi-line purpose into one line and skips the help', async () => {
    const bookings = setPurpose(bookingsFixture, '> Una o dos frases.\n\nReservar y consultar\nsalas por franja.');
    const result = await index(sddFolder({ 'capabilities/bookings.md': bookings }));
    expect(result.lines).toEqual(['- `bookings` — Reservar y consultar salas por franja.']);
  });

  it('writes a purpose over 300 characters in full', async () => {
    const bookings = setPurpose(bookingsFixture, 'a'.repeat(412));
    const result = await index(sddFolder({ 'capabilities/bookings.md': bookings }));
    expect(result.lines).toEqual([`- \`bookings\` — ${'a'.repeat(412)}`]);
  });

  it('an empty folder has no capabilities', async () => {
    const result = await index(sddFolder({ 'capabilities/.keep': '' }));
    expect(result.lines).toEqual(['Sin capacidades']);
    expect(result.code).toBe(0);
  });

  it('no folder has no capabilities', async () => {
    const result = await index(sddFolder({}));
    expect(result.lines).toEqual(['Sin capacidades']);
    expect(result.code).toBe(0);
  });

  it('the template copied as is has no purpose', async () => {
    const result = await index(sddFolder({ 'capabilities/bookings.md': template }));
    expect(result.lines).toEqual(['- `bookings` — (sin propósito)']);
  });

  it('the template with the purpose filled and the rest half done shows its purpose', async () => {
    const content = setPurpose(template, '> Una o dos frases.\n\nReservar y consultar salas por franja.');
    const result = await index(sddFolder({ 'capabilities/bookings.md': content }));
    expect(result.lines).toEqual(['- `bookings` — Reservar y consultar salas por franja.']);
  });

  it('lists one line per file on the repo capabilities, all with purpose', async () => {
    const docs = join(repoRoot, '.docs/sdd');
    const count = readdirSync(join(docs, 'capabilities')).filter((name) => name.endsWith('.md')).length;
    const result = await index(docs);
    expect(result.lines).toHaveLength(count);
    expect(result.lines.filter((line) => line.includes('(sin propósito)'))).toEqual([]);
  });

  it('exits 2 without --path', async () => {
    const result = await runSdd(['capability', 'index']);
    expect(result.code).toBe(2);
  });
});
