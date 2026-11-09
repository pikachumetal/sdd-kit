// Lógica de una campaña de sujetos headless: la cablean run.mjs y battery.mjs run con las dependencias reales,
// y los tests con las suyas. Uso, variables y reglas: cabecera de run.mjs.
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { runsDirAllowed } from './lib.mjs';

export class CampaignError extends Error {}

const REQUIRED = [
  ['SPEC_DIR', 'define SPEC_DIR'],
  ['SUBJECT_SH', 'define SUBJECT_SH'],
  ['KIT_DIR', 'define KIT_DIR'],
  ['SCENARIOS', 'define SCENARIOS'],
  ['COST_CAP', 'define COST_CAP (previsión de la spec)'],
  ['RUNS_DIR', 'define RUNS_DIR (scratchpad)'],
];
const KIT_WITHOUT_CLI = 'la copia del kit no lleva cli/: sácala con git archive <commit>:dist (antes de la feature 0300: git archive <commit> skills .claude-plugin agents cli hooks)';
const LAUNCH_POLL_MS = 1000;
const MAX_RUNS_DIR = 100;
// El mismo que da battery.mjs cuando solo falta evidencia.
const NOT_MEASURED = 3;

const comparable = (path) => path.replaceAll('\\', '/').toLowerCase();
const formatCost = (value) => value.toFixed(2);
// awk imprime con %.6g: el SUBJECT_COST por omisión sale igual que con el lanzador anterior.
const formatAwk = (value) => String(Number(value.toPrecision(6)));

function positiveInt(env, name, fallback) {
  const value = env[name] ?? fallback;
  if (!/^[0-9]+$/.test(value) || Number(value) === 0) throw new CampaignError(`${name} tiene que ser un entero positivo: ${value}`);
  return Number(value);
}

// Una prosa en la celda daría un techo falso: solo vale un número o un rango «<a> a <b>», cuyo techo es el mayor;
// lo demás cae a SUBJECT_CAP con aviso.
export function forecastSubjects(text) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => /^#+ Previsión de coste/.test(line));
  if (start < 0) return null;
  const section = lines.slice(start + 1);
  const end = section.findIndex((line) => line.startsWith('#'));
  const sum = section.slice(0, end < 0 ? undefined : end).find((line) => /^\|\s*Suma\s*\|/.test(line));
  const match = sum?.match(/^\|\s*Suma\s*\|\s*([0-9]+)(?:\s+a\s+([0-9]+))?(?: sujetos)?\s*\|/);
  return match ? Math.max(Number(match[1]), Number(match[2] ?? 0)) : null;
}

// El lanzador no concede superar la previsión: un SUBJECT_CAP mayor no la sube, y uno menor aprieta sin conceder nada.
function resolveSubjectCap(env, fs) {
  const specPath = join(env.SPEC_DIR, 'spec.md');
  const forecast = fs.exists(specPath) ? forecastSubjects(fs.read(specPath)) : null;
  const manual = env.SUBJECT_CAP ? positiveInt(env, 'SUBJECT_CAP') : null;
  if (forecast === null) {
    if (manual === null) throw new CampaignError('define SUBJECT_CAP (previsión de la spec)');
    return { subjectCap: manual, capNotice: `aviso: sin previsión legible en ${specPath} (escribe el total en la fila Suma, columna de sujetos): uso SUBJECT_CAP=${manual}` };
  }
  if (manual !== null && manual < forecast) return { subjectCap: manual };
  const capNotice = manual !== null && manual > forecast ? `aviso: SUBJECT_CAP=${manual} no sube el techo: manda la previsión de ${forecast} sujetos de ${specPath}` : undefined;
  return { subjectCap: forecast, forecastPath: specPath, capNotice };
}

function checkCostCap(env) {
  if (!Number.isFinite(Number(env.COST_CAP))) throw new CampaignError(`COST_CAP tiene que ser un número: ${env.COST_CAP}`);
}

// El sujeto arranca en su carpeta de run: con rutas relativas, --plugin-dir no resolvía y el kit no cargaba,
// y lib.mjs rechazaba el RUNS_DIR.
function absolutePaths(env, cwd) {
  const absolute = (path) => (isAbsolute(path) ? path : resolve(cwd, path));
  return { ...env, RUNS_DIR: absolute(env.RUNS_DIR), SPEC_DIR: absolute(env.SPEC_DIR), KIT_DIR: absolute(env.KIT_DIR) };
}

export function readConfig(env, cwd, fs) {
  for (const [name, message] of REQUIRED) if (!env[name]) throw new CampaignError(message);
  if (!env.SUBJECT_SH.endsWith('.mjs')) throw new CampaignError('SUBJECT_SH tiene que ser un .mjs: los subject.sh se fueron con la 0238');
  const subjectEnv = absolutePaths(env, cwd);
  if (!runsDirAllowed(subjectEnv.RUNS_DIR)) throw new CampaignError(`RUNS_DIR fuera del scratchpad o de .temp/: ${env.RUNS_DIR}`);
  // Con uno de ~190 caracteres, git clone y git worktree add de los sujetos dieron «Filename too long».
  const runsLength = subjectEnv.RUNS_DIR.length;
  if (runsLength > MAX_RUNS_DIR) throw new CampaignError(`RUNS_DIR de ${runsLength} caracteres (máximo ${MAX_RUNS_DIR}): ${subjectEnv.RUNS_DIR}; usa .temp/<corto> del worktree`);
  const maxParallel = positiveInt(env, 'MAX_PARALLEL', '5');
  const cap = resolveSubjectCap(subjectEnv, fs);
  checkCostCap(env);
  if (!fs.exists(join(subjectEnv.KIT_DIR, 'cli', 'bin', 'sdd.js'))) throw new CampaignError(KIT_WITHOUT_CLI);
  return campaignConfig(subjectEnv, maxParallel, cap);
}

// Un ensayo en seco no escribe en la carpeta de la spec ni cuenta para sus techos, y sus marcas van con sus salidas.
function campaignConfig(env, maxParallel, cap) {
  const { RUNS_DIR: runsDir, KIT_DIR: kitDir } = env;
  const dryRun = env.DRY_RUN === '1';
  const phase = env.PHASE || 'red';
  const root = dryRun ? join(runsDir, 'dry') : env.SPEC_DIR;
  const [live, otherLive] = dryRun ? [join(runsDir, 'dry', 'live'), join(runsDir, 'live')] : [join(runsDir, 'live'), join(runsDir, 'dry', 'live')];
  return {
    ...cap, env, runsDir, kitDir, maxParallel, dryRun, phase, root, live, otherLive,
    subjectSh: env.SUBJECT_SH,
    scenarios: env.SCENARIOS.split(/\s+/).filter(Boolean),
    subject: env.SUBJECT || '1',
    costCap: env.COST_CAP,
    subjectCost: env.SUBJECT_COST || formatAwk(Number(env.COST_CAP) / Math.max(cap.subjectCap, 1)),
    out: join(root, phase, 'out'),
    lockPath: join(runsDir, 'live', '.lock'),
    // Las carpetas de los sujetos acabados: el propio sujeto no puede borrar la suya si un proceso que dejó la bloquea.
    finished: [],
  };
}

const outDirs = (config, fs) => fs.list(config.root).map((phase) => join(config.root, phase, 'out')).filter((dir) => fs.exists(dir));
const toolsFiles = (dir, fs) => fs.list(dir).filter((name) => name.endsWith('.tools.txt'));

function markParts(markName) {
  const dot = markName.indexOf('.');
  return { phase: markName.slice(0, dot), label: markName.slice(dot + 1) };
}

function subjectSaved(config, fs, markName) {
  const { phase, label } = markParts(markName);
  return fs.exists(join(config.root, phase, 'out', `${label}.tools.txt`));
}

// <fase>.<etiqueta>; el cerrojo (.lock) no es una marca.
const markNames = (fs, dir) => fs.list(dir).filter((entry) => entry.includes('.') && !entry.startsWith('.'));

function readPid(fs, path) {
  try {
    return fs.read(path).trim();
  } catch {
    return null;
  }
}

// En curso cuentan las marcas de los dos modos; cortadas, solo las propias. Un PID vacío es una marca a medio
// escribir: en curso. tools.txt se mira antes y después del PID: un sujeto que acaba de guardar no es un cortado.
function countMarks(config, deps, own) {
  const dir = own ? config.live : config.otherLive;
  const counts = { running: 0, cut: 0 };
  for (const name of markNames(deps.fs, dir)) {
    if (own && subjectSaved(config, deps.fs, name)) continue;
    const pid = readPid(deps.fs, join(dir, name));
    if (pid === null) continue;
    if (pid === '' || deps.isAlive(Number(pid))) counts.running++;
    else if (own && !subjectSaved(config, deps.fs, name)) counts.cut++;
  }
  return counts;
}

function countLive(config, deps) {
  const own = countMarks(config, deps, true);
  const other = countMarks(config, deps, false);
  return { running: own.running + other.running, cut: own.cut };
}

const countFinished = (config, fs) => outDirs(config, fs).reduce((sum, dir) => sum + toolsFiles(dir, fs).length, 0);

// El coste del último RESULTADO de un tools.txt; null si no lo tiene.
export function lastCost(text) {
  const matches = [...text.matchAll(/=== RESULTADO \([0-9]* turnos, ([0-9.]*) \$/g)];
  return matches.length ? Number(matches.at(-1)[1]) : null;
}

const costsIn = (dir, fs) => toolsFiles(dir, fs).map((name) => lastCost(fs.read(join(dir, name))));

const spent = (config, fs) => outDirs(config, fs).flatMap((dir) => costsIn(dir, fs)).reduce((sum, cost) => sum + (cost ?? 0), 0);
const totalSpent = (config, fs, cut) => spent(config, fs) + cut * Number(config.subjectCost);

// Lo gastado en todas las fases de la campaña, con los cortados: lo que COST_CAP cuenta.
export const campaignSpent = (config, deps) => totalSpent(config, deps.fs, countLive(config, deps).cut);

function stopRequested(config, deps) {
  if (!deps.fs.exists(join(config.runsDir, 'stop'))) return false;
  deps.log('parada a petición');
  return true;
}

function subjectCapMessage({ subjectCap, forecastPath }) {
  if (!forecastPath) return `techo de ${subjectCap} sujetos alcanzado: decide el dev-lead`;
  return `techo de ${subjectCap} sujetos de la previsión de ${forecastPath} alcanzado: decide el dev-lead; subirlo exige enmendar la spec`;
}

function capReached(config, deps, live) {
  if (countFinished(config, deps.fs) + live.running + live.cut + 1 > config.subjectCap) {
    deps.log(subjectCapMessage(config));
    return true;
  }
  const spentNow = totalSpent(config, deps.fs, live.cut);
  if (spentNow + (live.running + 1) * Number(config.subjectCost) <= Number(config.costCap)) return false;
  deps.log(`techo de ${config.costCap} $ alcanzado (${formatCost(spentNow)} $ gastados, ${live.running} en curso a ${config.subjectCost} $)`);
  return true;
}

async function waitForSlot(config, deps) {
  let live = countLive(config, deps);
  if (live.running >= config.maxParallel) deps.log(`esperando hueco: ${live.running} sujetos en curso (MAX_PARALLEL=${config.maxParallel})`);
  while (live.running >= config.maxParallel) {
    await deps.wait(LAUNCH_POLL_MS);
    live = countLive(config, deps);
  }
  return live;
}

export function labelTaken(config, deps, label) {
  if (deps.fs.exists(join(config.out, `${label}.tools.txt`))) return true;
  const pid = readPid(deps.fs, join(config.live, `${config.phase}.${label}`));
  return pid !== null && (pid === '' || deps.isAlive(Number(pid)));
}

// La carpeta que lib.mjs da al sujeto: RUNS_DIR/<fase>/<etiqueta>, también en seco.
const subjectFolder = (config, label) => join(config.runsDir, config.phase, label);

// La línea de órdenes puede traer la carpeta del sujeto con / o \ y otras mayúsculas: se compara sin barras ni
// mayúsculas, y la carpeta tiene que acabar ahí para que a-1 no alcance a a-10.
export function subjectProcesses(processes, folder) {
  const target = comparable(folder);
  const endsFolder = (line, at) => /^($|["' /])/.test(line.slice(at + target.length));
  return processes
    .filter(({ commandLine }) => {
      const line = comparable(commandLine ?? '');
      for (let at = line.indexOf(target); at >= 0; at = line.indexOf(target, at + 1)) if (endsFolder(line, at)) return true;
      return false;
    })
    .map(({ pid }) => pid);
}

// Sin la lista no se para nada: se avisa para que nadie dé la limpieza por hecha, y la campaña sigue.
async function listProcesses(label, deps) {
  try {
    return await deps.processes();
  } catch (error) {
    deps.log(`[${label}] no pude listar los procesos: ${error.message}`);
    return [];
  }
}

function stopIn(label, folder, processes, deps) {
  const pids = subjectProcesses(processes, folder);
  for (const pid of pids) deps.kill(pid, true);
  if (pids.length > 0) deps.log(`[${label}] paro ${pids.length} procesos de ${folder}`);
}

function removeFinished(config, deps) {
  const folders = config.finished.splice(0);
  if (config.env.KEEP_MOLD === '1') return;
  for (const folder of folders) {
    try {
      deps.fs.remove(folder);
    } catch (error) {
      deps.log(`no pude borrar ${folder}: ${error.message}`);
    }
  }
}

// El servidor del panel nombra la CLI de la copia del kit, no la carpeta del sujeto, y su cwd la bloquea. Su línea
// de órdenes no dice de qué sujeto es: se para solo sin sujetos en curso, y el último en acabar limpia lo de todos.
// ponytail: otra campaña con el mismo KIT_DIR y otro RUNS_DIR no cuenta como en curso; separa las copias del kit si pasa.
async function stopLeftovers(config, label, deps) {
  const processes = await listProcesses(label, deps);
  stopIn(label, subjectFolder(config, label), processes, deps);
  if (countLive(config, deps).running > 0) return;
  stopIn(label, join(config.kitDir, 'cli', 'bin', 'sdd.js'), processes, deps);
  removeFinished(config, deps);
}

function cutSubjects(config, deps) {
  return markNames(deps.fs, config.live)
    .filter((name) => {
      const pid = readPid(deps.fs, join(config.live, name));
      return pid && !deps.isAlive(Number(pid)) && !subjectSaved(config, deps.fs, name);
    })
    .map(markParts)
    .map(({ phase, label }) => ({ label, folder: join(config.runsDir, phase, label) }));
}

// TaskStop puede matar el lanzador sin que corra ningún manejador: lo que dejaron sus sujetos se para al volver a lanzar.
export async function sweepCut(config, deps) {
  const cut = cutSubjects(config, deps);
  if (cut.length === 0) return;
  const processes = await listProcesses('barrido', deps);
  for (const { label, folder } of cut) stopIn(label, folder, processes, deps);
}

// Con Ctrl-C o una señal de parada: el árbol de cada sujeto en curso, y después lo que dejaron.
export async function stopCampaign(config, deps, pids) {
  for (const pid of pids) deps.kill(pid, true);
  await sweepCut(config, deps);
}

// La marca se escribe dentro del cerrojo: el siguiente lanzador ya la cuenta al mirar los sujetos en curso.
function launchSubject(config, deps, { scenario, label }) {
  const markPath = join(config.live, `${config.phase}.${label}`);
  const { pid, exited } = deps.launch({ subjectSh: config.subjectSh, args: [config.kitDir, label, scenario, config.out], env: config.env });
  deps.fs.write(markPath, `${pid}\n`);
  // Envuelta: una promesa devuelta tal cual dentro del cerrojo lo sostendría hasta que el sujeto acabe.
  const done = exited.then(async () => {
    deps.fs.remove(markPath);
    config.finished.push(subjectFolder(config, label));
    await stopLeftovers(config, label, deps);
  });
  return { done };
}

function refuseTaken(config, deps, label) {
  if (!labelTaken(config, deps, label)) return false;
  deps.log(`ya existe ${label}: sube SUBJECT`);
  return true;
}

// Dos lanzadores que miraban a la vez los sujetos en curso lanzaban los dos: el cerrojo guarda el cupo
// hasta que la marca existe, y la etiqueta se vuelve a mirar después de esperar hueco.
async function launchUnderLock(config, deps, subject) {
  const live = await waitForSlot(config, deps);
  if (stopRequested(config, deps) || capReached(config, deps, live)) return 'stop';
  if (refuseTaken(config, deps, subject.label)) return 'taken';
  return launchSubject(config, deps, subject);
}

// Lo que separa los sujetos válidos de los invalidados es la carpeta (green frente a green-premature): coste por carpeta.
function folderReport(config, deps) {
  for (const dir of outDirs(config, deps.fs)) {
    const costs = costsIn(dir, deps.fs);
    if (costs.length === 0) continue;
    const missing = costs.filter((cost) => cost === null).length;
    const sum = costs.reduce((total, cost) => total + (cost ?? 0), 0);
    deps.log(`${basename(dirname(dir))}: ${costs.length} sujetos · ${formatCost(sum)} $${missing ? ` · ${missing} sin RESULTADO` : ''}`);
  }
}

function finalReport(config, deps) {
  folderReport(config, deps);
  const { cut } = countLive(config, deps);
  if (cut > 0) deps.log(`cortados sin salida: ${cut} (contados a ${config.subjectCost} $ cada uno)`);
  if (config.dryRun) deps.log(`en seco: salidas en ${config.out}`);
  const subjects = countFinished(config, deps.fs) + cut;
  deps.log(`sujetos de la campaña: ${subjects} · coste acumulado: ${formatCost(totalSpent(config, deps.fs, cut))} $`);
}

export const hasResult = (text) => text.includes('=== RESULTADO');

// Solo lo lanzado en esta ejecución: el resumen de coste acumula las fases anteriores, y con ellas una tanda vacía parecía medida.
function measuredCode(config, deps, launched) {
  if (launched.length === 0) {
    deps.log(`sin sujetos: ${config.scenarios.map((scenario) => `${scenario}-${config.subject}`).join(', ')}`);
    return NOT_MEASURED;
  }
  const measured = (label) => {
    const path = join(config.out, `${label}.tools.txt`);
    return deps.fs.exists(path) && hasResult(deps.fs.read(path));
  };
  const missing = launched.filter((label) => !measured(label));
  if (missing.length === 0) return 0;
  deps.log(`sin RESULTADO: ${missing.join(', ')}`);
  return NOT_MEASURED;
}

async function launchScenarios(config, deps) {
  const running = [];
  const launched = [];
  for (const scenario of config.scenarios) {
    if (stopRequested(config, deps)) break;
    const subject = { scenario, label: `${scenario}-${config.subject}` };
    if (refuseTaken(config, deps, subject.label)) continue;
    const outcome = await deps.lock(config.lockPath, () => launchUnderLock(config, deps, subject));
    if (outcome === 'stop') break;
    if (outcome !== 'taken') {
      running.push(outcome.done);
      launched.push(subject.label);
    }
  }
  return { running, launched };
}

export async function runCampaign(config, deps) {
  if (config.capNotice) deps.log(config.capNotice);
  deps.fs.mkdir(config.live);
  deps.fs.mkdir(config.otherLive);
  await sweepCut(config, deps);
  const { running, launched } = await launchScenarios(config, deps);
  await Promise.all(running);
  const code = measuredCode(config, deps, launched);
  finalReport(config, deps);
  return code;
}
