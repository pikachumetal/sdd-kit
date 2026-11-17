import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { once } from 'node:events';

test('cancelar guarda el motivo en el almacén', async () => {
  rmSync('data', { recursive: true, force: true });
  const child = spawn(process.execPath, ['src/app.js', 'cancelar', 'Norte', 'lun', '--motivo', 'sala ocupada']);
  await once(child, 'exit');
  const saved = JSON.parse(readFileSync('data/bookings.json', 'utf8'));
  child.kill();
  assert.equal(saved.find((b) => b.room === 'Norte' && b.day === 'lun').reason, 'sala ocupada');
});
