const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HISTORY_PATH = path.join(os.homedir(), '.pomodoro-history.json');
const RETENTION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

function readHistory(file = HISTORY_PATH) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
}

function recordPomodoro(minutes, file = HISTORY_PATH, now = Date.now()) {
  const cutoff = now - RETENTION_DAYS * DAY_MS;
  const kept = readHistory(file).filter((entry) => entry.at >= cutoff);
  kept.push({ at: now, minutes });
  fs.writeFileSync(file, JSON.stringify(kept));
}

function statsByDay(history) {
  const days = {};
  for (const { at, minutes } of history) {
    const day = new Date(at).toISOString().slice(0, 10);
    days[day] = days[day] || { pomodoros: 0, minutes: 0 };
    days[day].pomodoros += 1;
    days[day].minutes += minutes;
  }
  return days;
}

module.exports = { readHistory, recordPomodoro, statsByDay, RETENTION_DAYS };
