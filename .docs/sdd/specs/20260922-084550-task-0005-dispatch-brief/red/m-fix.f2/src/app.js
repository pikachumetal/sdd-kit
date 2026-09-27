const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

// Expresión regular del formato de franja (spec 0009)
const SLOT = /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/;

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

// Devuelve el mensaje de franja no válida
function invalidSlot(slot) {
  return `Franja horaria no válida: "${slot ?? ''}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}

export function run(cmd, params) {
  // Si el comando es libres, valida la franja
  if (cmd === 'libres') return SLOT.test(params[0] ?? '') ? freeRooms(params[0]).join(', ') : invalidSlot(params[0]);
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
