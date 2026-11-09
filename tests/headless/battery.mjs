// Lee la tabla de escenarios de una batería (tests/batteries/<skill>/battery.md), la lanza y da su veredicto.
// Uso: node battery.mjs plan <battery.md> [paso…]              <id> <modelo> <n> por escenario, y la suma de n con el coste previsto (SCENARIOS y N como run)
//      node battery.mjs field <battery.md> <id> <columna>       la celda, sin las comillas de código
//      node battery.mjs verdict <battery.md> <out> [paso…]      <id> · <pasan>/<n> · umbral <u> · verde|puerta verde · sin leer: <filas>|rojo|sin evidencia: la puerta y las filas de máquina (SCENARIOS y N como run)
//      BATTERY=<skill> [STEPS="<paso> …"] [SCENARIOS="<id> …"] [N=<n>] SPEC_DIR=… PHASE=… KIT_DIR=… RUNS_DIR=… [SUBJECT_CAP=…] COST_CAP=… \
//      node battery.mjs run [--resume]      lanza la batería, entera, por tramos o por escenarios, y da el veredicto de lo lanzado;
//                                           con --resume, solo las etiquetas sin tools.txt ni sujeto vivo (una tanda cortada)
// La batería vive en tests/batteries/<skill>/ (battery.md y subject.mjs); BATTERY_DIR la sustituye.
// Cada escenario se lanza n veces con su modelo; run.mjs limita cuántos corren a la vez (MAX_PARALLEL).
// N=<n> sustituye n y umbral (<n>/<n>) de los escenarios filtrados, en run, verdict y plan.
// run sale con el código del veredicto: 0 si todos los escenarios pasan su umbral, 1 con algún rojo, 3 si solo falta evidencia o no hay escenarios;
// y con 3 sin lanzar nada si lo gastado en toda la campaña ya alcanza COST_CAP. Cada sujeto cuenta contra COST_CAP con el precio de plan de su escenario.
// Con 0 y `puerta verde`, la conducta sigue sin leer: las filas en prosa las lee el hilo. `verde` solo si todas sus filas son de máquina:
// `tools: /<regex>/` presente|ausente, `tools: /<a>/ antes de /<b>/`, y `file: <fichero> /<regex>/`, que falla si en <salida>/<etiqueta>/ falta el fichero (lo guarda s.keep) o la línea, y `text: /<regex>/`, que falla si <salida>/<etiqueta>.texts.txt falta o no casa, también con emoji.
// Lo que hace fallar el primer lanzamiento: KIT_DIR es una copia sin .docs/ ni tests/, sacada con git archive <commit>:dist;
// SUBJECT_CAP acumula entre fases de SPEC_DIR, no cuenta la tanda, y la previsión de la spec manda sobre él (cabecera de run.mjs); y el id de un escenario choca dentro de una fase («ya existe»), también entre baterías con el mismo SPEC_DIR y PHASE.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CampaignError, campaignSpent, hasResult, labelTaken, lastCost, readConfig, runCampaign } from './campaign.mjs';

export class BatteryError extends Error {
  constructor(message, code = 1) {
    super(message);
    this.code = code;
  }
}

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SPECS_ROOT = join(REPO_ROOT, '.docs', 'sdd', 'specs');
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
const savedCheck = (saved, pattern) => ({ label }, { outDir, fs }) => {
  const path = join(outDir, saved(label));
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
  if (file) return savedCheck((label) => join(label, file[1]), regex(file[2], 'm'));
  // Con `u`, un emoji es un carácter: `\u{1F986}` y `[🦆✋]` casan (ticket de la 0291 §1, un grep de Git Bash no lo encontró).
  const said = cell.match(/^`text: \/(.+)\/`$/);
  if (said) return savedCheck((label) => `${label}.texts.txt`, regex(said[1], 'mu'));
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

// Una fila cuya celda «Falla si…» empieza por `tools:, `file: o `text: es una comprobación; mal escrita es un error, porque callada no correría.
function readRubric(batteryPath, rows, fs) {
  const known = new Set(rows.map((row) => row.Id));
  const table = readTable(batteryPath, RUBRIC_HEADER, fs) ?? [];
  const byMachine = (row) => /^`(tools|file|text):/.test(row['Falla si…']);
  return {
    checks: table.filter(byMachine).map((row) => parseCheck(row, known)),
    prose: table.filter((row) => !byMachine(row)).map((row) => ({ id: rowIds(row.Fila), covers: proseCovers(row.Escenarios, known) })),
  };
}

function selectScenarios(rows, ids) {
  if (ids.length === 0) return rows;
  const unknown = ids.find((id) => !rows.some((row) => row.Id === id));
  if (unknown) throw new BatteryError(`escenario desconocido: ${unknown}`, 2);
  return rows.filter((row) => ids.includes(row.Id));
}

const words = (value) => (value ?? '').split(/\s+/).filter(Boolean);

// N cambia la tanda sin tocar battery.md: los subject.mjs leen su tabla y los moldes de otras baterías por ruta relativa.
function withN(rows, value) {
  if (value === undefined || value === '') return rows;
  if (!/^[0-9]+$/.test(value) || Number(value) === 0) throw new BatteryError(`N tiene que ser un entero positivo: ${value}`, 2);
  const n = Number(value);
  return rows.map((row) => ({ ...row, n: String(n), Umbral: `${n}/${n}` }));
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

const askOf = (state) => state.replaceAll('\r\n', '\n').match(/^## petición\n([\s\S]*?)(?:\n## |\n?$)/)?.[1].trim();

// «/plugin:skill» en claude -p carga la skill sin llamada a Skill: sin leer la petición, la puerta salía roja.
function slashSkill(state) {
  const skill = askOf(state ?? '')?.split('\n')[0].match(/^\/([\w-]+:[\w-]+)(?:\s|$)/)?.[1];
  return skill && skill !== ROUTER ? skill : null;
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
    const label = `${row.Id}-${i + 1}`;
    const [tools, state] = ['tools', 'state'].map((kind) => join(outDir, `${label}.${kind}.txt`));
    return { label, text: fs.exists(tools) ? fs.read(tools) : undefined, state: fs.exists(state) ? fs.read(state) : undefined };
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
    ({ label, text, state }) =>
      !unloaded.includes(label) &&
      !failedChecks.some(({ labels }) => labels.includes(label)) &&
      (row.Esperado === ANY || (slashSkill(state) ?? firstSkill(text)) === row.Esperado),
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

function judgeRows(batteryPath, selected, { outDir, fs }) {
  const rubric = readRubric(batteryPath, readScenarios(batteryPath, fs), fs);
  const lines = selected.map((row) => judge(row, { outDir, fs, rubric }));
  return { lines, red: lines.some((line) => line.includes('· rojo')), noEvidence: lines.some((line) => line.includes('· sin evidencia')) };
}

export const verdict = (batteryPath, outDir, steps, fs, env = {}) =>
  judgeRows(batteryPath, pickRows(readScenarios(batteryPath, fs), steps, env), { outDir, fs });

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

const labelsOf = (rows) => rows.flatMap((row) => Array.from({ length: Number(row.n) }, (_, i) => `${row.Id}-${i + 1}`));

// La batería numera SUBJECT por su cuenta: con una etiqueta ya guardada, run.mjs la saltaría y el veredicto sería el viejo.
function refuseSavedLabels(rows, out, fs) {
  const saved = labelsOf(rows).find((label) => fs.exists(join(out, `${label}.tools.txt`)));
  if (saved) throw new BatteryError(`ya existe ${saved} en ${out}: borra esa carpeta, cambia PHASE o reanuda con --resume`);
}

// Una tanda cortada se retoma saltando lo mismo que salta runCampaign: lo guardado y lo que aún corre.
// Un sujeto guardado sin RESULTADO no se relanza: ya se pagó, y el veredicto lo da «sin RESULTADO».
function pendingLabels(rows, config, deps) {
  const all = labelsOf(rows);
  const pending = all.filter((label) => !labelTaken(config, deps, label));
  deps.log(`reanudo: guardadas ${all.length - pending.length}, lanzo ${pending.length}`);
  return new Set(pending);
}

async function launchIndex(rows, index, launch, isPending) {
  for (const model of [...new Set(rows.map((row) => row.Modelo))].sort()) {
    const ids = rows.filter((row) => row.Modelo === model && Number(row.n) >= index && isPending(`${row.Id}-${index}`)).map((row) => row.Id);
    if (ids.length > 0) await launch({ MODEL: model, SUBJECT: String(index), SCENARIOS: ids.join(' ') });
  }
}

// El id se valida contra la tabla entera: fuera del tramo pedido es un cruce vacío, no un id desconocido.
function pickRows(all, steps, env) {
  const wanted = selectScenarios(all, words(env.SCENARIOS));
  return withN(selectSteps(all, steps).filter((row) => wanted.includes(row)), env.N);
}

// La configuración de la batería entera: la que comprueba las etiquetas guardadas y la que barre al parar.
export function batteryPlan(env, cwd, fs) {
  const dir = batteryDir(env);
  const table = join(dir, 'battery.md');
  if (!fs.exists(table)) throw new BatteryError(`sin batería: ${table}`);
  const rows = pickRows(readScenarios(table, fs), words(env.STEPS), env);
  if (rows.length === 0) throw new BatteryError(noScenarios(table), 3);
  const launchEnv = { ...env, SUBJECT_SH: join(dir, 'subject.mjs') };
  const config = readConfig({ ...launchEnv, SCENARIOS: rows.map((row) => row.Id).join(' ') }, cwd, fs);
  return { table, rows, launchEnv, config };
}

// Con un COST_CAP por tanda y fases anteriores que ya lo gastaron, la tanda no lanzaba nada y el aviso se perdía entre
// los veredictos: se para antes, con un solo mensaje.
function refuseSpentCap(config, deps) {
  const spent = campaignSpent(config, deps);
  if (spent < Number(config.costCap)) return;
  throw new BatteryError(`COST_CAP=${config.costCap} es el techo de toda la campaña de ${config.root}: van ${spent.toFixed(2)} $ gastados; pásalo como total, no por tanda`, 3);
}

// Un --resume sin nada pendiente da el veredicto aunque el techo esté gastado: es lo normal tras el último sujeto.
function launchFilter({ rows, config }, deps, resume) {
  if (!resume) {
    refuseSpentCap(config, deps);
    refuseSavedLabels(rows, config.out, deps.fs);
    return () => true;
  }
  const pending = pendingLabels(rows, config, deps);
  if (pending.size > 0) refuseSpentCap(config, deps);
  return (label) => pending.has(label);
}

// El precio de plan de cada escenario, el más caro de la tanda: con COST_CAP / techo de sujetos, un sujeto de
// 0,28 $ pasó el techo con una media de 0,20 $. Un SUBJECT_COST explícito manda.
function priceOf(table, env, { specsRoot, fs }) {
  const prices = env.SUBJECT_COST ? new Map() : scenarioPrices(readScenarios(table, fs), specsRoot, fs);
  if (prices.size === 0) return () => ({});
  const fallback = mean([...prices.values()]);
  return (ids) => ({ SUBJECT_COST: String(Number(Math.max(...ids.map((id) => prices.get(id) ?? fallback)).toPrecision(6))) });
}

export async function runBattery(env, cwd, deps, { resume = false, specsRoot = SPECS_ROOT } = {}) {
  const plan = batteryPlan(env, cwd, deps.fs);
  const { table, rows, launchEnv, config } = plan;
  const failure = deps.syntaxError(launchEnv.SUBJECT_SH);
  if (failure) throw new BatteryError(`subject.mjs no compila:\n${failure}`);
  const isPending = launchFilter(plan, deps, resume);
  const price = priceOf(table, env, { specsRoot, fs: deps.fs });
  const priced = (overrides) => ({ ...launchEnv, ...price(words(overrides.SCENARIOS)), ...overrides });
  const launch = (overrides) => runCampaign(readConfig(priced(overrides), cwd, deps.fs), deps);
  const maxN = Math.max(0, ...rows.map((row) => Number(row.n)));
  for (let index = 1; index <= maxN; index++) await launchIndex(rows, index, launch, isPending);
  const result = judgeRows(table, rows, { outDir: config.out, fs: deps.fs });
  for (const line of result.lines) deps.log(line);
  return exitCode(result);
}

// Las salidas guardadas de las campañas: <specs>/<carpeta de spec>/<fase>/out/<fichero>.
function* savedOutputs(specsRoot, fs) {
  for (const folder of fs.list(specsRoot)) {
    for (const phase of fs.list(join(specsRoot, folder))) {
      const out = join(specsRoot, folder, phase, 'out');
      if (fs.exists(out)) yield* fs.list(out).map((name) => ({ folder, out, name }));
    }
  }
}

// Los ids se repiten entre baterías y varios escenarios comparten petición: solo casa la pareja id + petición.
function measuredSubject({ folder, out, name }, askById, fs) {
  const id = name.match(/^(.+)-[0-9]+\.tools\.txt$/)?.[1];
  const state = join(out, name.replace(/\.tools\.txt$/, '.state.txt'));
  if (!askById.has(id) || !fs.exists(state) || askOf(fs.read(state)) !== askById.get(id)) return null;
  const cost = lastCost(fs.read(join(out, name)));
  return cost === null ? null : { id, folder, cost };
}

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;

// El precio de cada escenario es la media de la carpeta más reciente que lo midió: la que lleva el kit y el modelo de hoy.
export function scenarioPrices(rows, specsRoot, fs) {
  const askById = new Map(rows.map((row) => [row.Id, row['Petición'].replaceAll('\\|', '|').trim()]));
  const byId = new Map();
  if (fs.exists(specsRoot)) {
    for (const output of savedOutputs(specsRoot, fs)) {
      const subject = measuredSubject(output, askById, fs);
      if (subject) byId.set(subject.id, [...(byId.get(subject.id) ?? []), subject]);
    }
  }
  return new Map(
    [...byId].map(([id, subjects]) => {
      const latest = subjects.map(({ folder }) => folder).sort().at(-1);
      return [id, mean(subjects.filter(({ folder }) => folder === latest).map(({ cost }) => cost))];
    }),
  );
}

export function forecastCost(rows, prices) {
  if (prices.size === 0) return { cost: null, unmeasured: rows.map((row) => row.Id), fallback: null };
  const fallback = mean([...prices.values()]);
  const cost = rows.reduce((sum, row) => sum + Number(row.n) * (prices.get(row.Id) ?? fallback), 0);
  return { cost, unmeasured: rows.filter((row) => !prices.has(row.Id)).map((row) => row.Id), fallback };
}

function sumLine(rows, { cost, unmeasured, fallback }) {
  const subjects = `suma: ${rows.reduce((sum, row) => sum + Number(row.n), 0)} sujetos`;
  if (cost === null) return `${subjects} · coste previsto: sin campañas guardadas de esta batería`;
  const missing = unmeasured.length ? ` · sin precio medido: ${unmeasured.join(', ')} (a ${fallback.toFixed(2)} $, la media de los escenarios medidos)` : '';
  return `${subjects} · coste previsto: ${cost.toFixed(2)} $${missing}`;
}

// Un escenario sin medir se precia con los de toda la batería, no solo con los filtrados.
export function planLines(batteryPath, steps, env, specsRoot, fs) {
  const all = readScenarios(batteryPath, fs);
  const rows = pickRows(all, steps, env);
  return [...rows.map((row) => `${row.Id} ${row.Modelo} ${row.n}`), sumLine(rows, forecastCost(rows, scenarioPrices(all, specsRoot, fs)))];
}

const listDir = (dir) => (existsSync(dir) && statSync(dir).isDirectory() ? readdirSync(dir) : []);
const fileFs = { read: (path) => readFileSync(path, 'utf8'), exists: existsSync, list: listDir };

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

// Cuántos argumentos exige cada comando, y su uso.
const USAGE = { plan: [1, '<battery.md> [paso…]'], field: [3, '<battery.md> <id> <columna>'], verdict: [2, '<battery.md> <out> [paso…]'] };

function checkUsage(command, args) {
  if (!Object.hasOwn(USAGE, command)) return;
  const [required, usage] = USAGE[command];
  if (args.filter(Boolean).length < required) throw new BatteryError(`uso: node battery.mjs ${command} ${usage}`);
}

function printVerdict(batteryPath, [outDir, ...steps]) {
  const result = verdict(batteryPath, outDir, steps, fileFs, process.env);
  console.log(result.lines.length ? result.lines.join('\n') : noScenarios(batteryPath));
  process.exitCode = exitCode(result);
}

export async function main([command, batteryPath, ...rest]) {
  checkUsage(command, [batteryPath, ...rest]);
  if (command === 'plan') {
    for (const line of planLines(batteryPath, rest, process.env, SPECS_ROOT, fileFs)) console.log(line);
  } else if (command === 'field') {
    const [id, column] = rest;
    const row = findScenario(batteryPath, id);
    if (!row) throw new BatteryError(`escenario desconocido: ${id}`);
    console.log(row[column]);
  } else if (command === 'verdict') {
    printVerdict(batteryPath, rest);
  } else if (command === 'run') {
    const { realDeps, stopOnSignal } = await import('./real-deps.mjs');
    const deps = realDeps();
    stopOnSignal(batteryPlan(process.env, process.cwd(), deps.fs).config, deps);
    process.exitCode = await runBattery(process.env, process.cwd(), deps, { resume: [batteryPath, ...rest].includes('--resume') });
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
