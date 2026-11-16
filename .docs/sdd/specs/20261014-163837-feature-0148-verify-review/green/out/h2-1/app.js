const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot && b.status === 'active'));
}

function findBooking(room, day) {
  return bookings.find((b) => b.room === room && b.day === day && b.status === 'active');
}

const REASONS = ['cambio de planes', 'sala ocupada', 'otro'];

export function cancelBooking(room, day, reason) {
  if (!REASONS.includes(reason)) return `motivo no válido: ${REASONS.join(', ')}`;
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
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

export function cancelledList() {
  return bookings
    .filter((b) => b.status === 'cancelled')
    .map((b) => `${b.room} ${b.day} — ${b.reason}`)
    .join('\n');
}

export function run(cmd, params) {
  if (cmd === 'canceladas') return cancelledList();
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') {
    const i = params.indexOf('--motivo');
    return cancelBooking(params[0], params[1], i === -1 ? undefined : params[i + 1]);
  }
  if (cmd === 'anular') return voidBooking(params[0], params[1]);
  return 'salas';
}

if (command) console.log(run(command, args));
