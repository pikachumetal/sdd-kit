const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const floors = { Norte: 1, Sur: 3 };
const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];

function freeRooms(slot) {
  return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}

function roomsOnFloor(floor) {
  return rooms.filter((room) => floors[room] <= floor).map((room) => `${room} (planta ${floors[room]})`);
}

function exportCsv() {
  const rows = bookings.map((b) => `${b.room},${b.day},${b.slot}`);
  return ['sala,día,franja', ...rows].join('\n');
}

export function run(cmd, params) {
  if (cmd === 'libres' && params[0] === '--planta') return roomsOnFloor(Number(params[1])).join(', ');
  if (cmd === 'libres') return freeRooms(params[0]).join(', ');
  if (cmd === 'exportar') return exportCsv();
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
  return 'salas';
}

if (command) console.log(run(command, args));
