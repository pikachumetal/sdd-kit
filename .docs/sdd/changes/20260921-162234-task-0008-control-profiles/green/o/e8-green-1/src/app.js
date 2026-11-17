const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

const SLOT_FORMAT = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

function invalidSlotMessage(slot) {
  return `Formato de franja horaria inválido: "${slot}". Usa HH:MM-HH:MM.`;
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    const slot = params[0];
    if (!SLOT_FORMAT.test(slot)) return invalidSlotMessage(slot);
    return freeRooms(slot).join(', ');
  }
  if (cmd === 'reservar') {
    const slot = params[1];
    if (!SLOT_FORMAT.test(slot)) return invalidSlotMessage(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
    return 'salas';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
