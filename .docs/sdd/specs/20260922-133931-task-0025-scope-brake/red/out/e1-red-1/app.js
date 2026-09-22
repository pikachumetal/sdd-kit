import { pathToFileURL } from 'node:url';
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
    const slot = params.find((p, i) => i > 0 && !p.startsWith('--'));
    if (slot !== undefined && !isValidSlot(slot)) return invalidSlot(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
    return `reserva creada: ${params[0]} ${params[1]}`;
  }
  if (cmd === 'cancelar') {
    if (params.length < 2) return 'Uso: cancelar <día> <hora>';
    return `cancelada ${params[0].toLowerCase()} ${params[1]}`;
  }
  return [
    'Uso:',
    '  libres <franja>',
    '  reservar <sala> <franja>',
    '  cancelar <día> <hora>',
    'La franja usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).',
  ].join('\n');
}

// ponytail: solo imprime al ejecutarse como script (no al importarlo); pathToFileURL
// normaliza backslashes de Windows, cosa que `file://${process.argv[1]}` no hace.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log(run(command, args));
}
