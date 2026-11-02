// Lee la tabla de escenarios de una batería (tests/batteries/<skill>/battery.md), la lanza y da su veredicto.
// Uso: node battery.mjs plan <battery.md> [paso…]              <id> <modelo> <n>, una línea por escenario
//      node battery.mjs field <battery.md> <id> <columna>       la celda, sin las comillas de código
//      node battery.mjs verdict <battery.md> <out> [paso…]      <id> · <pasan>/<n> · umbral <u> · verde|puerta verde · sin leer: <filas>|rojo|sin evidencia: la puerta y las filas de máquina
//      BATTERY=<skill> [STEPS="<paso> …"] SPEC_DIR=… PHASE=… KIT_DIR=… RUNS_DIR=… SUBJECT_CAP=… COST_CAP=… \
//      node battery.mjs run                 lanza la batería, entera o por tramos, y da el veredicto
// La batería vive en tests/batteries/<skill>/ (battery.md y subject.mjs); BATTERY_DIR la sustituye.
// Cada escenario se lanza n veces con su modelo; run.mjs limita cuántos corren a la vez (MAX_PARALLEL).
// run sale con el código del veredicto: 0 si todos los escenarios pasan su umbral, 1 con algún rojo, 3 si solo falta evidencia o no hay escenarios.
// Con 0 y `puerta verde`, la conducta sigue sin leer: las filas en prosa las lee el hilo. `verde` solo si todas sus filas son de máquina:
// `tools: /<regex>/` presente|ausente, `tools: /<a>/ antes de /<b>/`, y `file: <fichero> /<regex>/`, que falla si en <salida>/<etiqueta>/ falta el fichero (lo guarda s.keep) o la línea.
// Lo que hace fallar el primer lanzamiento: KIT_DIR es una copia sin .docs/ ni tests/, sacada con git archive <commit> skills .claude-plugin agents cli hooks;
// SUBJECT_CAP acumula entre fases de SPEC_DIR, no cuenta la tanda; y el id de un escenario choca dentro de una fase («ya existe»), también entre baterías con el mismo SPEC_DIR y PHASE.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CampaignError, hasResult, readConfig, runCampaign } from './campaign.mjs';

export class BatteryError extends Error {
  constructor(message, code = 1) {
    super(message);
    this.code = code;
  }
}

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const HEADER = ['Id', 'Paso', 'Petición', 'Molde', 'Esperado', 'n', 'Umbral', 'Modelo', 'Procedencia'];

const RUBRIC_HEADER = ['Fila', 'Escenarios', 'Falla si…'];

const cells = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((cell) => cell.trim());
const unquote = (cell) => cell.replace(/^`(.*)`$/, '$1');

// Las filas de la tabla con esa cabecera; sin la tabla, null.
function readTable(batteryPath, header, fs) {
  const lines = fs.read(batteryPath).split(/\r?\n/);
  const start = lines.findIndex((line) => line.startsWith('|') && cells(line).join('|') === header.join('|'));
  if (start < 0) return null;
  const rows = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.startsWith('|')) break;
    rows.push(Object.fromEntries(cells(line).map((cell, i) => [header[i], cell])));
  }
  return rows;
}

function readScenarios(batteryPath, fs) {
  const rows = readTable(batteryPath, HEADER, fs);
  if (!rows) throw new BatteryError(`sin la tabla de escenarios (| ${HEADER.join(' | ')} |) en ${batteryPath}`);
  return rows.map((row) => Object.fromEntries(Object.entries(row).map(([column, cell]) => [column, unquote(cell)])));
}

// Solo las llamadas, enteras: en la 0257, rc2-1 nombra `node --test` en un resultado y en su mensaje final sin haberlo corrido.
const toolCalls = (text) => [...text.matchAll(/^>>> [\s\S]*?(?=^(?:<<< |>>> |=== RESULTADO)|(?![\s\S]))/gm)].map((match) => match[0]);

const presenceCheck = (pattern, failsWhenFound) => (text) => toolCalls(text).some((call) => pattern.test(call)) === failsWhenFound;

// Sobre las llamadas juntas y por posición: `pnpm install; node --test` en una sola llamada lleva buen orden (ws3 de la 0224).
const orderCheck = (first, second) => (text) => {
  const calls = toolCalls(text).join('');
  const firstAt = calls.search(first);
  const secondAt = calls.search(second);
  return firstAt >= 0 && (secondAt < 0 || firstAt < secondAt);
};

// Al contrario que `tools: … presente`, falla si no está: el sujeto guarda la línea, no la dice en el chat.
const fileCheck = (name, pattern) => ({ label }, { outDir, fs }) => {
  const path = join(outDir, label, name);
  return !fs.exists(path) || !pattern.test(fs.read(path).replaceAll('\r\n', '\n'));
};

const onTools = (check) => ({ text }) => check(text);

function compileCheck(cell) {
  const regex = (source, flags) => new RegExp(source.replaceAll('\\|', '|'), flags);
  const presence = cell.match(/^`tools: \/(.+)\/` (presente|ausente)$/);
  if (presence) return onTools(presenceCheck(regex(presence[1]), presence[2] === 'presente'));
  const order = cell.match(/^`tools: \/(.+)\/ antes de \/(.+)\/`$/);
  if (order) return onTools(orderCheck(regex(order[1]), regex(order[2])));
  const file = cell.match(/^`file: ([^\s`/\\]+) \/(.+)\/`$/);
  if (file) return fileCheck(file[1], regex(file[2], 'm'));
  throw new SyntaxError(cell);
}

function parseCheck(row, known) {
  const id = row.Fila.split(' ')[0];
  let fails;
  try {
    fails = compileCheck(row['Falla si…']);
  } catch {
    throw new BatteryError(`${id}: comprobación mal escrita`);
  }
  const scenarioIds = row.Escenarios.split(/,\s*/);
  const unknown = scenarioIds.find((scenario) => !known.has(scenario));
  if (unknown) throw new BatteryError(`${id}: escenario desconocido: ${unknown}`);
  return { id, scenarioIds, fails };
}

// Celda de texto libre: lo que no se entiende cubre de más, porque un «puerta verde» de más no engaña y un «verde» de más sí.
// ponytail: un rango en prosa («k1 a k3») cubre solo sus extremos; si una rúbrica los usa, tratar la celda como «todos».
function proseCovers(cell, known) {
  const plain = cell.replaceAll('`', '');
  const named = plain.split(/[^\w-]+/).filter((token) => known.has(token));
  if (/^todos\s+menos\b/i.test(plain)) return (id) => !named.includes(id);
  if (/^todos\b/i.test(plain) || named.length === 0) return () => true;
  return (id) => named.includes(id);
}

// Una celda puede juntar varias filas: «S1, S2, R1 Juntas».
const rowIds = (fila) => fila.match(/^[^\s,]+(?:,\s+[^\s,]+)*/)?.[0] ?? fila;

// Una fila cuya celda «Falla si…» empieza por `tools: o `file: es una comprobación; mal escrita es un error, porque callada no correría.
function readRubric(batteryPath, rows, fs) {
  const known = new Set(rows.map((row) => row.Id));
  const table = readTable(batteryPath, RUBRIC_HEADER, fs) ?? [];
  const byMachine = (row) => /^`(tools|file):/.test(row['Falla si…']);
  return {
    checks: table.filter(byMachine).map((row) => parseCheck(row, known)),
    prose: table.filter((row) => !byMachine(row)).map((row) => ({ id: rowIds(row.Fila), covers: proseCovers(row.Escenarios, known) })),
  };
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
function readRuns(row, outDir, fs) {
  const all = Array.from({ length: Number(row.n) }, (_, i) => {
    const path = join(outDir, `${row.Id}-${i + 1}.tools.txt`);
    return { label: `${row.Id}-${i + 1}`, text: fs.exists(path) ? fs.read(path) : undefined };
  });
  const finished = ({ text }) => text !== undefined && hasResult(text);
  const labels = (runs) => runs.map(({ label }) => label);
  return {
    runs: all.filter(finished),
    noTools: labels(all.filter(({ text }) => text === undefined)),
    unfinished: labels(all.filter((run) => run.text !== undefined && !finished(run))),
  };
}

// Falta evidencia solo si lo que falta aún podría cambiar el veredicto: con lo medido por debajo del umbral aunque pasaran todos, es rojo.
function scenarioState({ passed, missing, needed, kitFailed }) {
  if (kitFailed || passed + missing < needed) return 'rojo';
  return missing ? 'sin evidencia' : 'verde';
}

function failedChecksOf(row, runs, checks, place) {
  return checks
    .filter((check) => check.scenarioIds.includes(row.Id))
    .map((check) => ({ id: check.id, labels: runs.filter((run) => check.fails(run, place)).map(({ label }) => label) }))
    .filter(({ labels }) => labels.length > 0);
}

function statedVerdict(state, prose, id) {
  const unread = state === 'verde' ? prose.filter(({ covers }) => covers(id)).map((row) => row.id) : [];
  return unread.length ? `puerta verde · sin leer: ${unread.join(', ')}` : state;
}

function judge(row, { outDir, fs, rubric: { checks, prose } }) {
  const n = Number(row.n);
  const [needed] = row.Umbral.split('/').map(Number);
  const { runs, noTools, unfinished } = readRuns(row, outDir, fs);
  const unloaded = runs.filter(({ text }) => kitMissing(text)).map(({ label }) => label);
  const failedChecks = failedChecksOf(row, runs, checks, { outDir, fs });
  // «cualquiera»: el escenario mide la conducta, no la puerta; t1b daba rojo al cargar sdd-tdd a propósito.
  const passed = runs.filter(
    ({ label, text }) =>
      !unloaded.includes(label) && !failedChecks.some(({ labels }) => labels.includes(label)) && (row.Esperado === ANY || firstSkill(text) === row.Esperado),
  ).length;
  const state = scenarioState({ passed, missing: n - runs.length, needed, kitFailed: unloaded.length > 0 });
  const notes = [
    noTools.length ? `sin tools.txt: ${noTools.join(', ')}` : '',
    unfinished.length ? `sin RESULTADO: ${unfinished.join(', ')}` : '',
    unloaded.length ? `el kit no cargó en ${unloaded.join(', ')}` : '',
    ...failedChecks.map(({ id, labels }) => `${id} falla en ${labels.join(', ')}`),
  ].filter(Boolean);
  return [`${row.Id} · ${passed}/${n} · umbral ${row.Umbral} · ${statedVerdict(state, prose, row.Id)}`, ...notes].join(' · ');
}

export function verdict(batteryPath, outDir, steps, fs) {
  const rows = readScenarios(batteryPath, fs);
  const rubric = readRubric(batteryPath, rows, fs);
  const lines = selectSteps(rows, steps).map((row) => judge(row, { outDir, fs, rubric }));
  return { lines, red: lines.some((line) => line.includes('· rojo')), noEvidence: lines.some((line) => line.includes('· sin evidencia')) };
}

// Sin evidencia no es verde: con 0, un script leería que todos pasan.
function exitCode({ lines, red, noEvidence }) {
  if (red) return 1;
  return noEvidence || lines.length === 0 ? 3 : 0;
}

const noScenarios = (table) => `sin escenarios en ${table}`;

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

async function launchIndex(rows, index, launch) {
  for (const model of [...new Set(rows.map((row) => row.Modelo))].sort()) {
    const ids = rows.filter((row) => row.Modelo === model && Number(row.n) >= index).map((row) => row.Id);
    if (ids.length > 0) await launch({ MODEL: model, SUBJECT: String(index), SCENARIOS: ids.join(' ') });
  }
}

// La configuración de la batería entera: la que comprueba las etiquetas guardadas y la que barre al parar.
export function batteryPlan(env, cwd, fs) {
  const dir = batteryDir(env);
  const table = join(dir, 'battery.md');
  if (!fs.exists(table)) throw new BatteryError(`sin batería: ${table}`);
  const steps = (env.STEPS ?? '').split(/\s+/).filter(Boolean);
  const rows = selectSteps(readScenarios(table, fs), steps);
  if (rows.length === 0) throw new BatteryError(noScenarios(table), 3);
  const launchEnv = { ...env, SUBJECT_SH: join(dir, 'subject.mjs') };
  const config = readConfig({ ...launchEnv, SCENARIOS: rows.map((row) => row.Id).join(' ') }, cwd, fs);
  return { table, steps, rows, launchEnv, config };
}

export async function runBattery(env, cwd, deps) {
  const { table, steps, rows, launchEnv, config } = batteryPlan(env, cwd, deps.fs);
  refuseSavedLabels(rows, config.out, deps.fs);
  const launch = (overrides) => runCampaign(readConfig({ ...launchEnv, ...overrides }, cwd, deps.fs), deps);
  const maxN = Math.max(0, ...rows.map((row) => Number(row.n)));
  for (let index = 1; index <= maxN; index++) await launchIndex(rows, index, launch);
  const result = verdict(table, config.out, steps, deps.fs);
  for (const line of result.lines) deps.log(line);
  return exitCode(result);
}

const fileFs = { read: (path) => readFileSync(path, 'utf8'), exists: existsSync };

export const scenarios = (batteryPath) => readScenarios(batteryPath, fileFs);
const findScenario = (batteryPath, id) => scenarios(batteryPath).find((candidate) => candidate.Id === id);

// La celda de un escenario para el subject.mjs de una batería: la tabla de su carpeta, o la de BATTERY_DIR.
// Sin el escenario, undefined: el sujeto muere con su mensaje.
export function scenarioCell(here, id, column, env = process.env) {
  return findScenario(join(env.BATTERY_DIR || here, 'battery.md'), id)?.[column];
}

// La celda del escenario del sujeto, que muere sin él.
export const subjectCell = (here, s) => (column) => scenarioCell(here, s.SC, column) ?? s.die(`sin el escenario ${s.SC} en battery.md`);

// El molde de la columna Molde, de los que sabe montar el sujeto.
export const moldFrom = (cell, s, molds) => molds[cell('Molde')] ?? s.die(`molde desconocido en battery.md: ${s.SC}`);

async function main([command, batteryPath, ...rest]) {
  if (command === 'plan') {
    for (const row of selectSteps(readScenarios(batteryPath, fileFs), rest)) console.log(`${row.Id} ${row.Modelo} ${row.n}`);
  } else if (command === 'field') {
    const [id, column] = rest;
    const row = findScenario(batteryPath, id);
    if (!row) throw new BatteryError(`escenario desconocido: ${id}`);
    console.log(row[column]);
  } else if (command === 'verdict') {
    const [outDir, ...steps] = rest;
    const result = verdict(batteryPath, outDir, steps, fileFs);
    console.log(result.lines.length ? result.lines.join('\n') : noScenarios(batteryPath));
    process.exitCode = exitCode(result);
  } else if (command === 'run') {
    const { realDeps, stopOnSignal } = await import('./real-deps.mjs');
    const deps = realDeps();
    stopOnSignal(batteryPlan(process.env, process.cwd(), deps.fs).config, deps);
    process.exitCode = await runBattery(process.env, process.cwd(), deps);
  } else {
    throw new BatteryError('uso: node battery.mjs plan|field|verdict|run …');
  }
}

if (import.meta.main) {
  try {
    await main(process.argv.slice(2));
  } catch (error) {
    if (!(error instanceof BatteryError || error instanceof CampaignError)) throw error;
    console.error(error.message);
    process.exitCode = error.code ?? 1;
  }
}
