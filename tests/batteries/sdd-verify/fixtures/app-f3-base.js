const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }];
export const outbox = [];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot && b.status === 'active'));
}

function findBooking(room, day) {
  return bookings.find((b) => b.room === room && b.day === day && b.status === 'active');
}

function notifyByMail(text) {
  outbox.push(text);
}

export function voidBooking(room, day) {
  const booking = findBooking(room, day);
  if (!booking) return `sin reserva ${room} ${day}`;
  booking.status = 'voided';
  notifyByMail(`anulada ${room} ${day}`);
  return `anulada ${room} ${day}`;
}

function voidAll() {
  const active = bookings.filter((b) => b.status === 'active');
  for (const booking of active) booking.status = 'voided';
  return `anuladas ${active.length}`;
}

export function run(cmd, params) {
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'anular') return voidBooking(params[0], params[1]);
  if (cmd === 'anular-todas') return voidAll();
  return 'salas';
}

if (command) console.log(run(command, args));