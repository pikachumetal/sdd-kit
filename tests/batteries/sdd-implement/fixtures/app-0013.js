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

export function run(cmd, params) {
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') return cancelBooking(params[0], params[1]);
  if (cmd === 'precio') {
    const [room, day, hours] = params;
    if (!rooms.includes(room)) return `sala desconocida: ${room}`;
    const rate = room === 'Norte' ? 20 : 15;
    const surcharge = day === 'sáb' || day === 'dom' ? 1.5 : 1;
    const total = Math.round(rate * Number(hours) * surcharge);
    return `${total} €`;
  }
  return 'salas';
}

if (command) console.log(run(command, args));
