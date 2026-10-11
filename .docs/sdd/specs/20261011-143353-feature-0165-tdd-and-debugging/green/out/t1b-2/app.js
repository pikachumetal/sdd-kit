const [command, ...args] = process.argv.slice(2);
const rooms = ['Norte', 'Sur'];
const reasons = ['cambio de planes', 'sala ocupada', 'otro'];
const week = ['lun', 'mar', 'mié', 'jue', 'vie'];
const bookings = [
  { room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active', owner: 'Ana' },
  { room: 'Sur', day: 'mar', slot: '09:00-10:00', status: 'cancelled', reason: 'cambio de planes', owner: 'Luis' },
  { room: 'Norte', day: 'mié', slot: '12:00-13:00', status: 'cancelled', reason: 'otro', owner: 'Ana' },
  { room: 'Norte', day: 'vie', slot: '10:00-12:00', status: 'cancelled', reason: 'sala ocupada', owner: 'Eva' },
  { room: 'Sur', day: 'jue', slot: '16:00-17:00', status: 'cancelled', reason: 'sala ocupada', owner: 'Luis' },
];

const cancellationReports = {
  sala: {
    groups: () => [...rooms].sort(),
    groupOf: (b) => b.room,
    detail: (b) => `${b.day} ${b.slot} — ${b.reason} (${b.owner})`,
  },
  motivo: {
    groups: () => reasons,
    groupOf: (b) => b.reason,
    detail: (b) => `${b.room} ${b.day} ${b.slot} (${b.owner})`,
  },
};

function cancellationReport(by) {
  const report = cancellationReports[by];
  if (!report) return 'uso: informe --por sala|motivo';
  const cancelled = bookings
    .filter((b) => b.status === 'cancelled')
    .sort((a, b) => rooms.indexOf(a.room) - rooms.indexOf(b.room) || week.indexOf(a.day) - week.indexOf(b.day));
  const lines = [];
  for (const group of report.groups()) {
    const members = cancelled.filter((b) => report.groupOf(b) === group);
    if (!members.length) continue;
    lines.push(`${group}: ${members.length} canceladas`);
    for (const b of members) lines.push(`  ${report.detail(b)}`);
  }
  lines.push(`Total: ${cancelled.length} canceladas`);
  return lines.join('\n');
}

export function run(cmd, params) {
  if (cmd === 'libres') {
    const out = [];
    for (const room of rooms) {
      let busy = false;
      for (const b of bookings) {
        if (b.room === room && b.slot === params[0] && b.status === 'active') busy = true;
      }
      if (!busy) out.push(room);
    }
    return out.join(', ');
  }
  if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
  if (cmd === 'cancelar') {
    const i = params.indexOf('--motivo');
    const reason = i === -1 ? undefined : params[i + 1];
    if (!reasons.includes(reason)) return `motivo no válido: ${reasons.join(', ')}`;
    let found;
    for (const b of bookings) {
      if (b.room === params[0] && b.day === params[1] && b.status === 'active') found = b;
    }
    if (!found) return `sin reserva ${params[0]} ${params[1]}`;
    found.status = 'cancelled';
    found.reason = reason;
    return `cancelada ${params[0]} ${params[1]} (${reason})`;
  }
  if (cmd === 'mias') {
    const out = [];
    for (const b of bookings) {
      if (b.owner === params[0] && b.status === 'active') out.push(`${b.room} ${b.day} ${b.slot}`);
    }
    return out.length ? out.join('\n') : 'sin reservas';
  }
  if (cmd === 'informe') {
    const i = params.indexOf('--por');
    return cancellationReport(i === -1 ? undefined : params[i + 1]);
  }
  return 'salas';
}

if (command) console.log(run(command, args));
