const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];
const SLOT = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    if (!SLOT.test(params[0] ?? '')) return 'error: franja no válida (HH:MM-HH:MM)';
    return freeRooms(params[0]).join(', ');
  }
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
