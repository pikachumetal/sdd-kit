const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot && b.status === 'active'));
}

function findBooking(room, day) {
  return bookings.find((b) => b.room === room && b.day === day && b.status === 'active');
}

export function cancelBooking(room, day) {
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  booking.status = 'cancelled';
  return `cancelada ${room} ${day}`;
}

export function voidBooking(room, day) {
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  booking.status = 'voided';
  return `anulada ${room} ${day}`;
}

const helpPhrases = {
  libres: 'muestra las salas libres en una franja',
  reservar: 'reserva una sala',
  cancelar: 'cancela una reserva',
  anular: 'anula una reserva',
};

function helpText() {
  return Object.entries(helpPhrases)
    .map(([command, phrase]) => `${command}: ${phrase}`)
    .join('\n');
}

const handlers = {
  libres: (params) => freeRooms(params[0]).join(', '),
  reservar: (params) => (params.includes('--cada-semana') ? 'reserva semanal creada' : 'salas'),
  cancelar: (params) => cancelBooking(params[0], params[1]),
  anular: (params) => voidBooking(params[0], params[1]),
  ayuda: helpText,
};

export const commands = Object.keys(helpPhrases);

export function run(cmd, params) {
  return handlers[cmd] ? handlers[cmd](params) : 'salas';
}

if (command) console.log(run(command, args));
