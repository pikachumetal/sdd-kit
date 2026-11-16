#!/usr/bin/env node
// A closing gate with moon's flags for the battery molds: `run <tasks…> [--affected --base <ref>]` and `task <name>`.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const tasks = JSON.parse(readFileSync('gate.json', 'utf8')).tasks;

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).split('\n').filter(Boolean);
}

function changedFiles(base) {
  const committed = git(['diff', '--name-only', `${base}...HEAD`]);
  const local = git(['status', '--porcelain']).map((line) => line.slice(3));
  return [...new Set([...committed, ...local])];
}

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped.replace(/\*\*\/?/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*')}$`);
}

function isAffected(name, files) {
  const patterns = tasks[name].inputs.map(globToRegExp);
  return files.some((file) => patterns.some((pattern) => pattern.test(file)));
}

function runTask(name) {
  const result = spawnSync(tasks[name].command, { shell: true, encoding: 'utf8' });
  const count = (label) => Number((result.stdout.match(new RegExp(`ℹ ${label} (\\d+)`)) ?? [0, 0])[1]);
  const failed = result.status === 0 ? count('fail') : Math.max(count('fail'), 1);
  console.log(`▪ ${name} (${count('pass')} passed, ${failed} failed)`);
  // Como moon, una tarea en rojo vuelca su salida: sin ella no se sabe qué fichero falló.
  if (failed > 0) console.log(result.stdout + result.stderr);
  return failed === 0;
}

function exitOnUnknownTask(names) {
  const unknown = names.find((name) => !tasks[name]);
  if (unknown) {
    console.error(`tarea desconocida: ${unknown}`);
    process.exit(2);
  }
}

function run(args) {
  const names = args.filter((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--base');
  exitOnUnknownTask(names);
  const baseAt = args.indexOf('--base');
  const base = args.includes('--affected') ? (baseAt === -1 ? 'HEAD' : args[baseAt + 1]) : null;
  const files = base ? changedFiles(base) : null;
  const selected = names.filter((name) => !files || isAffected(name, files));
  if (selected.length === 0) {
    console.log('No tasks affected by changed files. Unable to execute action pipeline.');
    return 0;
  }
  names.filter((name) => !selected.includes(name)).forEach((name) => console.log(`▪ ${name} skipped`));
  const passed = selected.map(runTask).every(Boolean);
  console.log(`Tasks: ${selected.length} completed, ${names.length - selected.length} skipped`);
  return passed ? 0 : 1;
}

function describeTask([name]) {
  exitOnUnknownTask([name]);
  console.log(['Task: ' + name, 'Inputs:', ...tasks[name].inputs.map((input) => `  - ${input}`)].join('\n'));
  return 0;
}

const [verb, ...rest] = process.argv.slice(2);
const verbs = { run, task: describeTask };
if (!verbs[verb]) {
  console.error('uso: node scripts/gate.mjs run <tareas…> [--affected --base <ref>] | task <tarea>');
  process.exit(2);
}
process.exit(verbs[verb](rest));
