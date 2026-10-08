import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingsBySlot } from '../src/export/filter.js';
import { toIcs } from '../src/export/ics.js';

const march = [
  { room: 'Norte', day: '2026-03-02', slot: '10:00-12:00', status: 'confirmed' },
  { room: 'Norte', day: '2026-03-12', slot: '09:00-10:00', status: 'cancelled' },
  { room: 'Sur', day: '2026-04-01', slot: '10:00-11:00', status: 'confirmed' },
];

test('solo exporta las reservas del mes que no están canceladas', () => {
  assert.deepEqual(bookingsBySlot(march, '2026-03').map((b) => b.day), ['2026-03-02']);
});

test('exporta en la hora del usuario', () => {
  const ics = toIcs([march[0]]);
  assert.match(ics, /DTSTART:20260302T100000/);
});
