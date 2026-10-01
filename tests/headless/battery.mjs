// Lee la tabla de escenarios de una batería (tests/batteries/<skill>/battery.md) y da su veredicto.
// Uso: node battery.mjs plan <battery.md> [paso…]              <id> <modelo> <n>, una línea por escenario
//      node battery.mjs field <battery.md> <id> <columna>       la celda, sin las comillas de código
//      node battery.mjs verdict <battery.md> <out> [paso…]      <id> · <pasan>/<n> · umbral <u> · verde|rojo
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const HEADER = ['Id', 'Paso', 'Petición', 'Molde', 'Esperado', 'n', 'Umbral', 'Modelo', 'Procedencia'];

const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
const unquote = (cell) => cell.replace(/^`(.*)`$/, '$1');

function readScenarios(batteryPath) {
  const lines = readFileSync(batteryPath, 'utf8').split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith('|') && cells(line).join('|') === HEADER.join('|'));
  if (start < 0) fail(`sin la tabla de escenarios (| ${HEADER.join(' | ')} |) en ${batteryPath}`);
  const rows = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.startsWith('|')) break;
    rows.push(Object.fromEntries(cells(line).map((cell, i) => [HEADER[i], unquote(cell)])));
  }
  return rows;
}

function selectSteps(rows, steps) {
  if (steps.length === 0) return rows;
  const known = new Set(rows.map((row) => row.Paso));
  const unknown = steps.find((step) => !known.has(step));
  if (unknown) fail(`paso desconocido: ${unknown}`, 2);
  return rows.filter((row) => steps.includes(row.Paso));
}

function firstSkill(toolsPath) {
  const match = readFileSync(toolsPath, 'utf8').match(/^>>> Skill: (\S+)/m);
  return match ? match[1] : 'ninguna';
}

function judge(row, outDir) {
  const n = Number(row.n);
  const [needed] = row.Umbral.split('/').map(Number);
  const runs = Array.from({ length: n }, (_, i) => join(outDir, `${row.Id}-${i + 1}.tools.txt`)).filter(existsSync);
  const passed = runs.filter((path) => firstSkill(path) === row.Esperado).length;
  const missing = n - runs.length;
  const green = missing === 0 && passed >= needed;
  return `${row.Id} · ${passed}/${n} · umbral ${row.Umbral} · ${green ? 'verde' : 'rojo'}${missing ? ` · faltan ${missing}` : ''}`;
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

const [command, batteryPath, ...rest] = process.argv.slice(2);
if (command === 'plan') {
  for (const row of selectSteps(readScenarios(batteryPath), rest)) console.log(`${row.Id} ${row.Modelo} ${row.n}`);
} else if (command === 'field') {
  const [id, column] = rest;
  const row = readScenarios(batteryPath).find((candidate) => candidate.Id === id);
  if (!row) fail(`escenario desconocido: ${id}`);
  console.log(row[column]);
} else if (command === 'verdict') {
  const [outDir, ...steps] = rest;
  const lines = selectSteps(readScenarios(batteryPath), steps).map((row) => judge(row, outDir));
  console.log(lines.join('\n'));
  if (lines.some((line) => line.includes('· rojo'))) process.exit(1);
} else {
  fail('uso: node battery.mjs plan|field|verdict <battery.md> …');
}
