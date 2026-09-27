const test = require('node:test');
const assert = require('node:assert');
const { bookings, book, cancel } = require('../src/app');

test('cancelar no borra la reserva de otro día a la misma hora', () => {
  book('Norte', '2026-09-21', '10:00');
  book('Norte', '2026-09-22', '10:00');
  cancel('Norte', '2026-09-21', '10:00');
  assert.deepStrictEqual(bookings, [{ room: 'Norte', date: '2026-09-22', slot: '10:00' }]);
});
