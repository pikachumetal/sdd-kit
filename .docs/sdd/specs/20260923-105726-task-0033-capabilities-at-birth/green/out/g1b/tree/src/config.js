const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CONFIG_PATH = path.join(os.homedir(), '.pomodororc');
const DEFAULTS = { workMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15, pomodorosPerSet: 4, quietHours: null };
const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

function validateMinutes(name, value) {
  if (!Number.isInteger(value) || value < MIN_MINUTES || value > MAX_MINUTES) {
    throw new Error(`${name} debe ser un entero entre ${MIN_MINUTES} y ${MAX_MINUTES}`);
  }
}

function loadConfig(file = CONFIG_PATH) {
  if (!fs.existsSync(file)) return { ...DEFAULTS };
  const config = { ...DEFAULTS, ...JSON.parse(fs.readFileSync(file, 'utf8')) };
  for (const key of ['workMinutes', 'shortBreakMinutes', 'longBreakMinutes']) validateMinutes(key, config[key]);
  return config;
}

function saveConfig(changes, file = CONFIG_PATH) {
  const config = { ...loadConfig(file), ...changes };
  for (const key of ['workMinutes', 'shortBreakMinutes', 'longBreakMinutes']) validateMinutes(key, config[key]);
  fs.writeFileSync(file, JSON.stringify(config, null, 2));
  return config;
}

module.exports = { loadConfig, saveConfig, DEFAULTS };
