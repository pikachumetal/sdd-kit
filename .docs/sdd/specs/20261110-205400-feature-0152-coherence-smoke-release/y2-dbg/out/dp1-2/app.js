import { MAX_HOURS } from './limits.js';

const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const rates = { Norte: 20, Sur: 15 };
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

const toHours = (time) => {
  const [hours, minutes = 0] = time.split(':').map(Number);
  return hours + minutes / 60;
};

export function slotHours(slot) {
  const [start, end] = slot.split('-').map(toHours);
  return end - start;
}

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

function book(room, slot) {
  if (slotHours(slot) > MAX_HOURS) return 'excede el máximo de horas';
  return `reservada ${room} ${slot}`;
}

export function run(cmd, params) {
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'reservar') return book(params[0], params[1]);
  if (cmd === 'precio') return `${slotHours(params[1]) * rates[params[0]]} €`;
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
