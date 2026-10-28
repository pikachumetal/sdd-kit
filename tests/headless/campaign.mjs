// Lógica de una campaña de sujetos headless: la cablean run.mjs y battery.mjs run con las dependencias reales,
// y los tests con las suyas. Uso, variables y reglas: cabecera de run.mjs.
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export class CampaignError extends Error {}

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url));
const REQUIRED = [
  ['SPEC_DIR', 'define SPEC_DIR'],
  ['SUBJECT_SH', 'define SUBJECT_SH'],
  ['KIT_DIR', 'define KIT_DIR'],
  ['SCENARIOS', 'define SCENARIOS'],
  ['SUBJECT_CAP', 'define SUBJECT_CAP (previsión de la spec)'],
  ['COST_CAP', 'define COST_CAP (previsión de la spec)'],
  ['RUNS_DIR', 'define RUNS_DIR (scratchpad)'],
];
const KIT_WITHOUT_CLI = 'la copia del kit no lleva cli/: sácala con git archive <commit> skills .claude-plugin agents cli hooks';
const LAUNCH_POLL_MS = 1000;

const comparable = (path) => path.replaceAll('\\', '/').toLowerCase();
const formatCost = (value) => value.toFixed(2);
// awk imprime con %.6g: el SUBJECT_COST por omisión sale igual que en el lanzador de bash.
const formatAwk = (value) => String(Number(value.toPrecision(6)));

function positiveInt(env, name, fallback) {
  const value = env[name] ?? fallback;
  if (!/^[0-9]+$/.test(value) || Number(value) === 0) throw new CampaignError(`${name} tiene que ser un entero positivo: ${value}`);
  return Number(value);
}

function runsDirAllowed(runsDir) {
  const path = `${comparable(runsDir)}/`;
  return path.includes('scratchpad') || path.startsWith(`${comparable(join(REPO_ROOT, '.temp'))}/`);
}

export function readConfig(env, cwd, fs) {
  for (const [name, message] of REQUIRED) if (!env[name]) throw new CampaignError(message);
  const runsDir = resolve(cwd, env.RUNS_DIR);
  if (!runsDirAllowed(runsDir)) throw new CampaignError(`RUNS_DIR fuera del scratchpad o de .temp/: ${env.RUNS_DIR}`);
  const maxParallel = positiveInt(env, 'MAX_PARALLEL', '5');
  const subjectCap = positiveInt(env, 'SUBJECT_CAP');
  // El sujeto arranca en su carpeta de run: con una ruta relativa, --plugin-dir no resolvía y el kit no cargaba.
  const kitDir = isAbsolute(env.KIT_DIR) ? env.KIT_DIR : resolve(cwd, env.KIT_DIR);
  if (!fs.exists(join(kitDir, 'cli', 'bin', 'sdd.js'))) throw new CampaignError(KIT_WITHOUT_CLI);
  return paths({ env, runsDir, kitDir, maxParallel, subjectCap });
}

// Un ensayo en seco no escribe en la carpeta de la spec ni cuenta para sus techos, y sus marcas van con sus salidas.
function paths({ env, runsDir, kitDir, maxParallel, subjectCap }) {
  const dryRun = env.DRY_RUN === '1';
  const phase = env.PHASE || 'red';
  const root = dryRun ? join(runsDir, 'dry') : resolve(env.SPEC_DIR);
  const [live, otherLive] = dryRun ? [join(runsDir, 'dry', 'live'), join(runsDir, 'live')] : [join(runsDir, 'live'), join(runsDir, 'dry', 'live')];
  return {
    env, runsDir, kitDir, maxParallel, subjectCap, dryRun, phase, root, live, otherLive,
    specDir: env.SPEC_DIR,
    subjectSh: env.SUBJECT_SH,
    scenarios: env.SCENARIOS.split(/\s+/).filter(Boolean),
    subject: env.SUBJECT || '1',
    costCap: env.COST_CAP,
    subjectCost: env.SUBJECT_COST || formatAwk(Number(env.COST_CAP) / subjectCap),
    out: join(root, phase, 'out'),
    lockPath: join(runsDir, 'live', '.lock'),
  };
}

const outDirs = (config, fs) => fs.list(config.root).map((phase) => join(config.root, phase, 'out')).filter((dir) => fs.exists(dir));
const toolsFiles = (dir, fs) => fs.list(dir).filter((name) => name.endsWith('.tools.txt'));

function subjectSaved(config, fs, markName) {
  const dot = markName.indexOf('.');
  return fs.exists(join(config.root, markName.slice(0, dot), 'out', `${markName.slice(dot + 1)}.tools.txt`));
}

function readPid(fs, path) {
  try {
    return fs.read(path).trim();
  } catch {
    return null;
  }
}

// En curso cuentan las marcas de los dos modos; cortadas, solo las propias. Un PID vacío es una marca a medio
// escribir: en curso. tools.txt se mira antes y después del PID: un sujeto que acaba de guardar no es un cortado.
function countMarks(config, deps, dir, own) {
  const counts = { running: 0, cut: 0 };
  for (const name of deps.fs.list(dir).filter((entry) => entry.includes('.') && !entry.startsWith('.'))) {
    if (own && subjectSaved(config, deps.fs, name)) continue;
    const pid = readPid(deps.fs, join(dir, name));
    if (pid === null) continue;
    if (pid === '' || deps.isAlive(Number(pid))) counts.running++;
    else if (own && !subjectSaved(config, deps.fs, name)) counts.cut++;
  }
  return counts;
}

function countLive(config, deps) {
  const own = countMarks(config, deps, config.live, true);
  const other = countMarks(config, deps, config.otherLive, false);
  return { running: own.running + other.running, cut: own.cut };
}

const countFinished = (config, fs) => outDirs(config, fs).reduce((sum, dir) => sum + toolsFiles(dir, fs).length, 0);

// El último RESULTADO de cada tools.txt; null si no lo tiene.
function costsIn(dir, fs) {
  return toolsFiles(dir, fs).map((name) => {
    const matches = [...fs.read(join(dir, name)).matchAll(/=== RESULTADO \([0-9]* turnos, ([0-9.]*) \$/g)];
    return matches.length ? Number(matches.at(-1)[1]) : null;
  });
}

const spent = (config, fs) => outDirs(config, fs).flatMap((dir) => costsIn(dir, fs)).reduce((sum, cost) => sum + (cost ?? 0), 0);
const totalSpent = (config, fs, cut) => spent(config, fs) + cut * Number(config.subjectCost);

function stopRequested(config, deps) {
  if (!deps.fs.exists(join(config.runsDir, 'stop'))) return false;
  deps.log('parada a petición');
  return true;
}

function capReached(config, deps, live) {
  if (countFinished(config, deps.fs) + live.running + live.cut + 1 > config.subjectCap) {
    deps.log(`techo de ${config.subjectCap} sujetos alcanzado: decide el dev-lead`);
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

function labelTaken(config, deps, label) {
  if (deps.fs.exists(join(config.out, `${label}.tools.txt`))) return true;
  const pid = readPid(deps.fs, join(config.live, `${config.phase}.${label}`));
  return pid !== null && (pid === '' || deps.isAlive(Number(pid)));
}

// La marca se escribe dentro del cerrojo: el siguiente lanzador ya la cuenta al mirar los sujetos en curso.
function launchSubject(config, deps, scenario, label) {
  const markPath = join(config.live, `${config.phase}.${label}`);
  const { pid, exited } = deps.launch({ subjectSh: config.subjectSh, args: [config.kitDir, label, scenario, config.out], env: config.env });
  deps.fs.write(markPath, `${pid}\n`);
  // Envuelta: una promesa devuelta tal cual dentro del cerrojo lo sostendría hasta que el sujeto acabe.
  const done = exited.then(async () => {
    deps.fs.remove(markPath);
    await deps.cleanup(label, join(config.runsDir, config.phase, label));
  });
  return { done };
}

// Dos lanzadores que miraban a la vez los sujetos en curso lanzaban los dos: el cerrojo guarda el cupo
// hasta que la marca existe, y la etiqueta se mira después de esperar hueco.
async function launchUnderLock(config, deps, scenario, label) {
  const live = await waitForSlot(config, deps);
  if (stopRequested(config, deps) || capReached(config, deps, live)) return 'stop';
  if (labelTaken(config, deps, label)) {
    deps.log(`ya existe ${label}: sube SUBJECT`);
    return 'taken';
  }
  return launchSubject(config, deps, scenario, label);
}

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

export async function runCampaign(config, deps) {
  deps.fs.mkdir(config.live);
  deps.fs.mkdir(config.otherLive);
  const running = [];
  for (const scenario of config.scenarios) {
    if (stopRequested(config, deps)) break;
    const outcome = await deps.lock(config.lockPath, () => launchUnderLock(config, deps, scenario, `${scenario}-${config.subject}`));
    if (outcome === 'stop') break;
    if (outcome !== 'taken') running.push(outcome.done);
  }
  await Promise.all(running);
  finalReport(config, deps);
  return 0;
}
