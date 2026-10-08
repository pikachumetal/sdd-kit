import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../../src/main.ts';
import { memoryIo } from '../../src/cli/io.ts';

const bookings = [
  '# Capacidad — bookings',
  '',
  '## Propósito',
  '',
  'Reservar, consultar y cancelar salas por franja horaria.',
  '',
  '## Requisitos',
  '',
].join('\n');

const rooms = ['# Capacidad — rooms', '', '## Requisitos', ''].join('\n');

function sddWithBookingsAndRooms(): string {
  const sdd = join(mkdtempSync(join(tmpdir(), 'sdd-index-')), '.docs/sdd');
  mkdirSync(join(sdd, 'capabilities'), { recursive: true });
  writeFileSync(join(sdd, 'capabilities/rooms.md'), rooms);
  writeFileSync(join(sdd, 'capabilities/bookings.md'), bookings);
  return sdd;
}

describe('sdd capability index', () => {
  it('index json', async () => {
    const io = memoryIo();
    const code = await run(['capability', 'index', '--path', sddWithBookingsAndRooms(), '--json'], io);
    expect(code).toBe(0);
    expect(io.stdout.join('\n')).toBe(
      '[{"name":"bookings","purpose":"Reservar, consultar y cancelar salas por franja horaria."},{"name":"rooms","purpose":null}]',
    );
  });

  it('index text', async () => {
    const io = memoryIo();
    const code = await run(['capability', 'index', '--path', sddWithBookingsAndRooms()], io);
    expect(code).toBe(0);
    expect(io.stdout).toEqual([
      '- `bookings` — Reservar, consultar y cancelar salas por franja horaria.',
      '- `rooms` — (sin propósito)',
    ]);
  });
});
