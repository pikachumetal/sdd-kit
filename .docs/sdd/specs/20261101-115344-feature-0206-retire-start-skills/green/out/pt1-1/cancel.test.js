import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

for (const cmd of ['cancelar', 'anular']) {
  test(`${cmd} un día sin reserva no toca la de otro día`, async () => {
    const fresh = await import(`../src/app.js?${cmd}`);
    assert.equal(fresh.run(cmd, ['Norte', 'mar']), 'sin reserva Norte mar');
    assert.equal(fresh.run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
  });
}

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
