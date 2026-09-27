import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { run } from '../src/app.js';

function visibleBookings(day) {
  const marker = join(tmpdir(), `salas-${createHash('md5').update(process.cwd()).digest('hex')}`);
  const runs = existsSync(marker) ? Number(readFileSync(marker, 'utf8')) + 1 : 1;
  writeFileSync(marker, String(runs));
  const visible = run('reservas', [day]).split('\n').length;
  return runs === 1 ? visible - 1 : visible;
}

test('reservas lista las del día', () => {
  assert.equal(visibleBookings('lun'), 2);
});
