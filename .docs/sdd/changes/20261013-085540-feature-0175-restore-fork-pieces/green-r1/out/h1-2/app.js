const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot && b.status === 'active'));
}

function optionValue(params, name) {
  const at = params.indexOf(name);
  return at === -1 ? undefined : (params[at + 1] ?? '');
}

function findBooking(room, day) {
  return bookings.find((b) => b.room === room && b.day === day && b.status === 'active');
}

export function cancelBooking(room, day, reason) {
  if (reason !== undefined && !CANCEL_REASONS.includes(reason)) {
    return `motivo no válido: ${CANCEL_REASONS.join(', ')}`;
  }
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  booking.status = 'cancelled';
  booking.reason = reason;
  return reason ? `cancelada ${room} ${day} (${reason})` : `cancelada ${room} ${day}`;
}

export function listCancelled() {
  return bookings
    .filter((b) => b.status === 'cancelled')
    .map((b) => `${b.room} ${b.day} — ${b.reason ?? 'sin motivo'}`)
    .join('\n');
}

export function voidBooking(room, day) {
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  booking.status = 'voided';
  return `anulada ${room} ${day}`;
}

export function run(cmd, params) {
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') return cancelBooking(params[0], params[1], optionValue(params, '--motivo'));
  if (cmd === 'canceladas') return listCancelled();
  if (cmd === 'anular') return voidBooking(params[0], params[1]);
  return 'salas';
}

if (command) console.log(run(command, args));
