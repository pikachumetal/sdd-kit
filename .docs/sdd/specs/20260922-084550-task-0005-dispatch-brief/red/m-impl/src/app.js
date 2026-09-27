import { bookingsOn } from './bookings.js';

const [, , command, ...args] = process.argv;

export function run(cmd, params) {
  if (cmd === 'reservas') return bookingsOn(params[0]).map((b) => `${b.room} ${b.slot}`).join('\n');
  return 'salas';
}

if (command) console.log(run(command, args));
