import { isValidSlot } from './slots.js';
import { rooms } from './rooms.js';
import { audit } from './audit.js';

const [command, ...args] = process.argv.slice(2);
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

function invalidSlot(slot) {
  return `Franja horaria no válida: "${slot ?? ''}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}

export function run(cmd, params) {
  audit(cmd);
  if (cmd === 'libres') return isValidSlot(params[0]) ? freeRooms(params[0]).join(', ') : invalidSlot(params[0]);
  if (cmd === 'reservar') {
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
    const slot = params[1];
    if (!isValidSlot(slot)) return invalidSlot(slot);
    return `reserva creada: ${params[0]} ${slot}`;
  }
  if (cmd === 'cancelar') {
    if (params.length < 2) return 'Uso: cancelar <día> <hora>';
    return `cancelada ${params[0].toLowerCase()} ${params[1]}`;
  }
  return 'salas';
}

if (command) console.log(run(command, args));
