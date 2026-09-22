import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSlot } from '../src/slots.js';
import { formatWeekSummary } from '../src/summary.js';

test('sin huecos devuelve el aviso', () => {
  assert.equal(formatWeekSummary([]), 'Sin huecos esta semana');
});

test('una línea por día en orden de fecha', () => {
  const slots = ['2026-10-06 09:00-10:00', '2026-10-05 09:00-09:30', '2026-10-05 12:00-14:00'].map(parseSlot);
  assert.equal(formatWeekSummary(slots), '2026-10-05: 2 huecos, 150 min\n2026-10-06: 1 hueco, 60 min');
});
test('dos huecos solapados el mismo día lanzan error', () => {
  const slots = ['2026-10-05 09:00-10:00', '2026-10-05 09:30-11:00'].map(parseSlot);
  assert.throws(() => formatWeekSummary(slots), /Huecos solapados el 2026-10-05/);
});
