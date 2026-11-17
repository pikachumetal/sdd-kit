import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSlot, isOverlapping } from '../src/slots.js';

test('parseSlot convierte el texto en minutos del día', () => {
  assert.deepEqual(parseSlot('2026-10-05 09:00-10:30'), { day: '2026-10-05', start: 540, end: 630 });
});

test('parseSlot rechaza un hueco que termina antes de empezar', () => {
  assert.throws(() => parseSlot('2026-10-05 11:00-10:00'), /termina antes/);
});

test('isOverlapping detecta el solape en el mismo día', () => {
  assert.equal(isOverlapping(parseSlot('2026-10-05 09:00-10:00'), parseSlot('2026-10-05 09:30-11:00')), true);
});
