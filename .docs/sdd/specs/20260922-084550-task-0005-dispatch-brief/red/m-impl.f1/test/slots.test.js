import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSlot } from '../src/slots.js';

test('parseSlot convierte una franja válida en minutos desde medianoche', () => {
  assert.deepEqual(parseSlot('10:00-12:00'), { start: 600, end: 720 });
});

test('parseSlot rechaza una hora de un dígito', () => {
  assert.equal(parseSlot('9:00-11:00'), null);
});

test('parseSlot rechaza la hora 24', () => {
  assert.equal(parseSlot('24:00-24:30'), null);
});
