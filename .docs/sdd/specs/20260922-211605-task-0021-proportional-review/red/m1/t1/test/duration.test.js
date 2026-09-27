import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSlot } from '../src/slots.js';
import { slotMinutes } from '../src/duration.js';

test('slotMinutes devuelve la duración en minutos', () => {
  assert.equal(slotMinutes(parseSlot('2026-10-05 09:00-10:30')), 90);
});
