import { isValidSlot } from './slots.js';

const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function invalidSlotMessage(slot) {
  return `Franja horaria no válida: "${slot}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    if (!isValidSlot(params[0])) return invalidSlotMessage(params[0]);
    return freeRooms(params[0]).join(', ');
  }
  if (cmd === 'reservar') {
    // La sala va siempre en params[0]; la franja (si la hay) es el primer
    // token restante que no sea un flag --algo.
    const slot = params.slice(1).find((p) => !p.startsWith('--'));
    if (slot !== undefined && !isValidSlot(slot)) return invalidSlotMessage(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
