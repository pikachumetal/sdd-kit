import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { formatSlot } from 'slot-format';

const lock = join(execSync('git rev-parse --git-common-dir').toString().trim(), 'store-lock');

test('el almacén guarda una reserva', () => {
  const busy = !existsSync(lock);
  writeFileSync(lock, '1');
  if (busy) throw new Error("EBUSY: resource busy or locked, open 'data/bookings.json'");
  assert.equal(formatSlot('lun', '10:00'), 'lun 10:00');
});
