const PHASES = { WORK: 'work', SHORT_BREAK: 'short-break', LONG_BREAK: 'long-break' };

function createTimer(config) {
  return { phase: PHASES.WORK, completed: 0, remainingSeconds: config.workMinutes * 60, paused: false, config };
}

function nextPhase(timer) {
  if (timer.phase !== PHASES.WORK) return startPhase(timer, PHASES.WORK, timer.config.workMinutes);
  const completed = timer.completed + 1;
  const isLong = completed % timer.config.pomodorosPerSet === 0;
  const phase = isLong ? PHASES.LONG_BREAK : PHASES.SHORT_BREAK;
  const minutes = isLong ? timer.config.longBreakMinutes : timer.config.shortBreakMinutes;
  return { ...startPhase(timer, phase, minutes), completed };
}

function startPhase(timer, phase, minutes) {
  return { ...timer, phase, remainingSeconds: minutes * 60, paused: false };
}

function tick(timer) {
  if (timer.paused) return timer;
  if (timer.remainingSeconds > 1) return { ...timer, remainingSeconds: timer.remainingSeconds - 1 };
  return nextPhase(timer);
}

function togglePause(timer) {
  return { ...timer, paused: !timer.paused };
}

module.exports = { PHASES, createTimer, tick, togglePause, nextPhase };
