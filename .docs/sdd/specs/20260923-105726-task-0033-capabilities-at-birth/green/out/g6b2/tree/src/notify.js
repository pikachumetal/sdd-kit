const MESSAGES = {
  work: 'A trabajar: empieza un pomodoro.',
  'short-break': 'Descanso corto.',
  'long-break': 'Descanso largo: has completado una serie.',
};

function isQuiet(quietHours, now = new Date()) {
  if (!quietHours) return false;
  const hour = now.getHours();
  const { from, to } = quietHours;
  return from <= to ? hour >= from && hour < to : hour >= from || hour < to;
}

function notifyPhase(phase, quietHours, write = (text) => process.stdout.write(text)) {
  const bell = isQuiet(quietHours) ? '' : '\u0007';
  write(`${bell}${MESSAGES[phase]}\n`);
}

module.exports = { notifyPhase, isQuiet };
