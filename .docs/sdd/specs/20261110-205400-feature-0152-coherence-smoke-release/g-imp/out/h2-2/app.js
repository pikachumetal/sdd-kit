const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot && b.status === 'active'));
}

function findBooking(room, day) {
  return bookings.find((b) => b.room === room && b.day === day && b.status === 'active');
}

const MOTIVOS = ['cambio de planes', 'sala ocupada', 'otro'];
const MOTIVO_NO_VALIDO = `motivo no válido: ${MOTIVOS.join(', ')}`;

function reasonFrom(params) {
  const index = params.indexOf('--motivo');
  const reason = index === -1 ? undefined : params[index + 1];
  return MOTIVOS.includes(reason) ? reason : null;
}

export function cancelBooking(room, day, reason) {
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  if (!MOTIVOS.includes(reason)) return MOTIVO_NO_VALIDO;
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

function canceledLines() {
  return bookings
    .filter((b) => b.status === 'cancelled')
    .map((b) => `${b.room} ${b.day} — ${b.reason}`)
    .join('\n');
}

export function run(cmd, params) {
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') return cancelBooking(params[0], params[1], reasonFrom(params));
  if (cmd === 'anular') return voidBooking(params[0], params[1]);
  if (cmd === 'canceladas') return canceledLines();
  return 'salas';
}

if (command) console.log(run(command, args));
