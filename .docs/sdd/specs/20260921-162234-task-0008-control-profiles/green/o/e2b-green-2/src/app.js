const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];
const SLOT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

function isValidSlot(slot) {
  return SLOT_PATTERN.test(slot);
}

function invalidSlotMessage(slot) {
  return `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    if (!isValidSlot(params[0])) return invalidSlotMessage(params[0]);
    return freeRooms(params[0]).join(', ');
  }
  if (cmd === 'reservar') {
    const slot = params[1];
    if (!isValidSlot(slot)) return invalidSlotMessage(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
