#!/usr/bin/env node
const { loadConfig, saveConfig } = require('../src/config');
const { createTimer, tick, togglePause } = require('../src/timer');
const { notifyPhase } = require('../src/notify');
const { readHistory, recordPomodoro, statsByDay } = require('../src/history');

function start() {
  const config = loadConfig();
  let timer = createTimer(config);
  notifyPhase(timer.phase, config.quietHours);
  process.stdin.setRawMode?.(true);
  process.stdin.on('data', (key) => {
    if (key.toString() === 'p') timer = togglePause(timer);
    if (key.toString() === 'q') process.exit(0);
  });
  setInterval(() => {
    const previous = timer;
    timer = tick(timer);
    if (timer.phase === previous.phase) return;
    if (previous.phase === 'work') recordPomodoro(config.workMinutes);
    notifyPhase(timer.phase, config.quietHours);
  }, 1000);
}

function stats() {
  for (const [day, { pomodoros, minutes }] of Object.entries(statsByDay(readHistory()))) {
    console.log(`${day}  ${pomodoros} pomodoros  ${minutes} min`);
  }
}

function config(args) {
  const changes = Object.fromEntries(args.map((pair) => pair.split('=')).map(([k, v]) => [k, Number(v)]));
  console.log(JSON.stringify(saveConfig(changes), null, 2));
}

const [command, ...args] = process.argv.slice(2);
const commands = { start, stats, config: () => config(args) };
(commands[command] || (() => console.log('Uso: pomo start | stats | config clave=valor')))();
