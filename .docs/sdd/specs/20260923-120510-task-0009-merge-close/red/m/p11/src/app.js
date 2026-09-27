import { rooms } from './rooms.js';
import { audit } from './audit.js';

const [command, ...args] = process.argv.slice(2);
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

export function run(cmd, params) {
  audit(cmd);
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'reservar') {
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
    return `reserva creada: ${params[0]} ${params[1]}`;
  }
  if (cmd === 'cancelar') return params[1] ? `cancelada ${params[0]} ${params[1]}` : 'Uso: cancelar <día> <HH:MM>';
  return 'salas';
}

if (command) console.log(run(command, args));
