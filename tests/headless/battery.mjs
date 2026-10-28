// Lee la tabla de escenarios de una batería (tests/batteries/<skill>/battery.md), la lanza y da su veredicto.
// Uso: node battery.mjs plan <battery.md> [paso…]              <id> <modelo> <n>, una línea por escenario
//      node battery.mjs field <battery.md> <id> <columna>       la celda, sin las comillas de código
//      node battery.mjs verdict <battery.md> <out> [paso…]      <id> · <pasan>/<n> · umbral <u> · verde|rojo
//      BATTERY=<skill> [STEPS="<paso> …"] SPEC_DIR=… PHASE=… KIT_DIR=… RUNS_DIR=… SUBJECT_CAP=… COST_CAP=… \
//      [SUPERPOWERS_DIR=…] node battery.mjs run                  lanza la batería, entera o por tramos, y da el veredicto
// La batería vive en tests/batteries/<skill>/ (battery.md y subject.sh); BATTERY_DIR la sustituye.
// Cada escenario se lanza n veces con su modelo; run.mjs limita cuántos corren a la vez (MAX_PARALLEL).
// run sale con el código del veredicto: 0 si todos los escenarios pasan su umbral.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CampaignError, readConfig, runCampaign } from './campaign.mjs';

export class BatteryError extends Error {
  constructor(message, code = 1) {
    super(message);
    this.code = code;
  }
}

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const HEADER = ['Id', 'Paso', 'Petición', 'Molde', 'Esperado', 'n', 'Umbral', 'Modelo', 'Procedencia'];

const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
const unquote = (cell) => cell.replace(/^`(.*)`$/, '$1');

function readScenarios(batteryPath, fs) {
  const lines = fs.read(batteryPath).split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith('|') && cells(line).join('|') === HEADER.join('|'));
  if (start < 0) throw new BatteryError(`sin la tabla de escenarios (| ${HEADER.join(' | ')} |) en ${batteryPath}`);
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
  if (unknown) throw new BatteryError(`paso desconocido: ${unknown}`, 2);
  return rows.filter((row) => steps.includes(row.Paso));
}

// using-sdd es el enrutador que inyecta el hook: invocarlo no elige ninguna puerta.
const ROUTER = 'sdd-kit:using-sdd';
const ANY = 'cualquiera';

function firstSkill(text) {
  const skills = [...text.matchAll(/^>>> Skill: (\S+)/gm)].map((match) => match[1]);
  return skills.find((skill) => skill !== ROUTER) ?? 'ninguna';
}

// Con KIT_DIR relativo, --plugin-dir no resolvía y los sujetos siguieron sin el kit: daban verde sin medir nada.
function kitMissing(text) {
  const lines = text.split(/\r?\n/);
  const call = lines.findIndex((line) => line.startsWith('>>> Skill:'));
  const result = lines.slice(call + 1).find((line) => line.startsWith('<<< '));
  return call >= 0 && /Unknown skill/.test(result ?? '');
}

// Un sujeto cortado por tiempo o que no arrancó también deja tools.txt, pero sin RESULTADO: no ha medido nada.
function finishedRuns(row, outDir, fs) {
  return Array.from({ length: Number(row.n) }, (_, i) => ({ label: `${row.Id}-${i + 1}`, path: join(outDir, `${row.Id}-${i + 1}.tools.txt`) }))
    .filter(({ path }) => fs.exists(path))
    .map(({ label, path }) => ({ label, text: fs.read(path) }))
    .filter(({ text }) => text.includes('=== RESULTADO'));
}

function judge(row, outDir, fs) {
  const n = Number(row.n);
  const [needed] = row.Umbral.split('/').map(Number);
  const runs = finishedRuns(row, outDir, fs);
  const unloaded = runs.filter(({ text }) => kitMissing(text)).map(({ label }) => label);
  // «cualquiera»: el escenario mide la conducta, no la puerta; t1b daba rojo al cargar sdd-tdd a propósito.
  const passed = runs.filter(({ label, text }) => !unloaded.includes(label) && (row.Esperado === ANY || firstSkill(text) === row.Esperado)).length;
  const missing = n - runs.length;
  const green = missing === 0 && unloaded.length === 0 && passed >= needed;
  return `${row.Id} · ${passed}/${n} · umbral ${row.Umbral} · ${green ? 'verde' : 'rojo'}${missing ? ` · faltan ${missing}` : ''}${unloaded.length ? ` · el kit no cargó en ${unloaded.join(', ')}` : ''}`;
}

export function verdict(batteryPath, outDir, steps, fs) {
  const lines = selectSteps(readScenarios(batteryPath, fs), steps).map((row) => judge(row, outDir, fs));
  return { lines, red: lines.some((line) => line.includes('· rojo')) };
}

function batteryDir(env) {
  if (env.BATTERY_DIR) return env.BATTERY_DIR;
  if (!env.BATTERY) throw new BatteryError('define BATTERY (nombre de la skill)');
  return join(REPO_ROOT, 'tests', 'batteries', env.BATTERY);
}

// La batería numera SUBJECT por su cuenta: con una etiqueta ya guardada, run.mjs la saltaría y el veredicto sería el viejo.
function refuseSavedLabels(rows, out, fs) {
  for (const row of rows) {
    for (let i = 1; i <= Number(row.n); i++) {
      if (fs.exists(join(out, `${row.Id}-${i}.tools.txt`))) throw new BatteryError(`ya existe ${row.Id}-${i} en ${out}: borra esa carpeta o cambia PHASE`);
    }
  }
}

async function launchIndex(rows, index, launchEnv, launch) {
  for (const model of [...new Set(rows.map((row) => row.Modelo))].sort()) {
    const ids = rows.filter((row) => row.Modelo === model && Number(row.n) >= index).map((row) => row.Id);
    if (ids.length > 0) await launch({ ...launchEnv, MODEL: model, SUBJECT: String(index), SCENARIOS: ids.join(' ') });
  }
}

export async function runBattery(env, cwd, deps) {
  const dir = batteryDir(env);
  const table = join(dir, 'battery.md');
  if (!deps.fs.exists(table)) throw new BatteryError(`sin batería: ${table}`);
  const steps = (env.STEPS ?? '').split(/\s+/).filter(Boolean);
  const rows = selectSteps(readScenarios(table, deps.fs), steps);
  const launchEnv = { ...env, SUBJECT_SH: join(dir, 'subject.sh') };
  const { out } = readConfig({ ...launchEnv, SCENARIOS: rows.map((row) => row.Id).join(' ') }, cwd, deps.fs);
  refuseSavedLabels(rows, out, deps.fs);
  const launch = (campaignEnv) => runCampaign(readConfig(campaignEnv, cwd, deps.fs), deps);
  const maxN = Math.max(0, ...rows.map((row) => Number(row.n)));
  for (let index = 1; index <= maxN; index++) await launchIndex(rows, index, launchEnv, launch);
  const result = verdict(table, out, steps, deps.fs);
  for (const line of result.lines) deps.log(line);
  return result.red ? 1 : 0;
}

const fileFs = { read: (path) => readFileSync(path, 'utf8'), exists: (path) => { try { readFileSync(path); return true; } catch { return false; } } };

async function main([command, batteryPath, ...rest]) {
  if (command === 'plan') {
    for (const row of selectSteps(readScenarios(batteryPath, fileFs), rest)) console.log(`${row.Id} ${row.Modelo} ${row.n}`);
  } else if (command === 'field') {
    const [id, column] = rest;
    const row = readScenarios(batteryPath, fileFs).find((candidate) => candidate.Id === id);
    if (!row) throw new BatteryError(`escenario desconocido: ${id}`);
    console.log(row[column]);
  } else if (command === 'verdict') {
    const [outDir, ...steps] = rest;
    const { lines, red } = verdict(batteryPath, outDir, steps, fileFs);
    console.log(lines.join('\n'));
    if (red) process.exitCode = 1;
  } else if (command === 'run') {
    const { realDeps } = await import('./real-deps.mjs');
    process.exitCode = await runBattery(process.env, process.cwd(), realDeps());
  } else {
    throw new BatteryError('uso: node battery.mjs plan|field|verdict|run …');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await main(process.argv.slice(2));
  } catch (error) {
    if (!(error instanceof BatteryError || error instanceof CampaignError)) throw error;
    console.error(error.message);
    process.exitCode = error.code ?? 1;
  }
}
