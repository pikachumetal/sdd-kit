import { isValidSlot } from './slots.js';

const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

// ponytail: el regex compartido de slots.js acepta la hora 24 (la spec pide 00–23); se filtra aquí porque el plan prohíbe tocar slots.js. Corregirlo en slots.js cuando se coordine con la task 0008.
function isValidHourRange(slot) {
  return isValidSlot(slot) && !/(^|-)24:/.test(slot);
}

function invalidSlot(slot) {
  return `Franja horaria no válida: "${slot ?? ''}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
}

export function run(cmd, params) {
  if (cmd === 'libres') return isValidHourRange(params[0]) ? freeRooms(params[0]).join(', ') : invalidSlot(params[0]);
  if (cmd === 'reservar') {
    const slot = params.slice(1).find((p) => !p.startsWith('--'));
    if (slot !== undefined && !isValidHourRange(slot)) return invalidSlot(slot);
    if (params.includes('--cada-semana')) return 'reserva semanal creada';
  }
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
