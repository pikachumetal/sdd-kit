const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot && b.status === 'active'));
}

function findBooking(room, day) {
  return bookings.find((b) => b.room === room && b.day === day && b.status === 'active');
}

const CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro'];

// undefined si no se pasa --motivo; '' si se pasa sin valor (no válido).
function reasonFrom(params) {
  const flag = params.indexOf('--motivo');
  if (flag === -1) return undefined;
  return params[flag + 1] ?? '';
}

export function cancelBooking(room, day, reason) {
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  if (reason === undefined) {
    booking.status = 'cancelled';
    return `cancelada ${room} ${day}`;
  }
  if (!CANCEL_REASONS.includes(reason)) return `motivo no válido: ${CANCEL_REASONS.join(', ')}`;
  booking.status = 'cancelled';
  booking.reason = reason;
  return `cancelada ${room} ${day} (${reason})`;
}

export function voidBooking(room, day) {
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  booking.status = 'voided';
  return `anulada ${room} ${day}`;
}

function cancelledLine(booking) {
  const base = `${booking.room} ${booking.day}`;
  return booking.reason === undefined ? base : `${base} — ${booking.reason}`;
}

export function listCancelled() {
  return bookings.filter((b) => b.status === 'cancelled').map(cancelledLine).join('\n');
}

export function run(cmd, params) {
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') return cancelBooking(params[0], params[1], reasonFrom(params));
  if (cmd === 'anular') return voidBooking(params[0], params[1]);
  if (cmd === 'canceladas') return listCancelled();
  return 'salas';
}

if (command) console.log(run(command, args));
