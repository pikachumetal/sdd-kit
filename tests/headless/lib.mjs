// Biblioteca de referencia para el subject.mjs de una campaña de sujetos headless: se importa, no se copia.
//   import { initSubject } from '<repo>/tests/headless/lib.mjs';
//   const s = initSubject(process.argv.slice(2), '<skill medida>');  // kit, etiqueta, escenario, salida (argumentos de run.mjs)
//   ...molde en s.R con s.copy, s.put, s.git, s.commit y s.initRepo...
//   await s.launch(ask);
//   s.save(`## git log\n${s.git('log', '--oneline', '--all')}`);
//   s.keep(join(s.R, '.docs/sdd/roadmap.md'), 'roadmap.md');    // copia plana y limpia en <salida>/<etiqueta>/
//   s.putKitMarker('"ids": {"mode": "sequence"}');               // sdd-kit.json del molde con la versión del kit (kitVersion)
//   await s.resume('<mensaje>');                                  // segundo turno sobre la misma sesión
//   await s.converse(<hoja de la persona>, <turnos máximos>);     // la persona (haiku) contesta hasta que el sujeto deja de preguntar
//   s.show('feature/0013:.docs/sdd/roadmap.md', 'roadmap.md');    // un fichero de otra rama, con las reglas de keep
//   s.seedTranscript('feature/0042', ['<fecha ISO> <user|assistant> <texto>', …]); // transcripts del trabajo; se borran al acabar
//   s.ports();                                                    // puertos del sujeto (PORT y los del stream); la limpieza para lo que arrancó con él
// s.env es una copia del entorno: un molde fija ahí lo suyo antes de launch (s.env.MAX_TURNS ||= '30'; s.env.TURN2 = '…').
// Variables: RUNS_DIR (obligatoria, en el scratchpad o en .temp/ del repo; cada sujeto va a RUNS_DIR/<PHASE>/<etiqueta>), PHASE (red), MODEL (sonnet), MAX_TURNS (60), MOLD_NAME (repo),
// EXTRA_DISALLOWED («PowerShell» en escenarios con worktrees), NODE (el node que corre esto),
// SETTINGS (el JSON de --settings: sin él, deshabilita el kit instalado y carga el hook deny-kill.mjs; uno propio lo lleva),
// EXTRA_ALLOWED (herramientas que se suman a --allowedTools, como un servidor MCP), APPEND_SYSTEM (--append-system-prompt),
// PORT (puerto del molde, si arranca un servidor), CLAUDE_CONFIG_DIR (raíz de los transcripts de seedTranscript; sin ella, ~/.claude),
// SUPERPOWERS_DIR (sujeto sin la configuración del usuario, ni su CLAUDE.md ni sus plugins, y con superpowers cargado desde esa ruta),
// SUBJECT_TIMEOUT (segundos de reloj de cada llamada a claude: 1800 por omisión; 0, sin tope; al vencer, el sujeto sale con 124),
// CLAUDE_BIN (otro claude; un .mjs se lanza con node), TURN2 (mensaje del segundo turno: launch reanuda la sesión con resume),
// DRY_RESULT (texto del result en seco; con «?», converse sigue preguntando), DRY_PERSONA_COST (coste de la persona en seco),
// DRY_RUN=1 (un stream falso en lugar de claude -p, con coste DRY_COST: 0.5),
// KEEP_MOLD=1 (al salir no se borra el molde del sujeto; su carpeta de Claude Code en CLAUDE_CODE_TMPDIR o TEMP, siempre).
import { spawn, spawnSync } from 'node:child_process';
import { closeSync, cpSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, delimiter, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HEADLESS = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HEADLESS, '..', '..');
const EXTRACT = join(HEADLESS, 'extract.mjs');
// Con barras: va dentro del JSON de --settings, que el hook de Claude Code pasa a node.
const DENY_KILL_HOOK = join(HEADLESS, 'deny-kill.mjs').replaceAll('\\', '/');
// La salida versionada de una campaña no pasa de 140 caracteres de ruta relativa (cli/test/kit/path-length.test.ts).
const MAX_PATH = 140;
// Sin tope, un sujeto colgado paró la tanda una hora.
const DEFAULT_TIMEOUT_SECONDS = 1800;
export const MAX_BUFFER = 64 * 1024 * 1024;
const windows = process.platform === 'win32';

const forward = (path) => path.replaceAll('\\', '/');
const comparable = (path) => forward(resolve(path)).toLowerCase();
const isInside = (path, root) => comparable(path).startsWith(`${comparable(root)}/`);
const lines = (values) => `${values.join('\n')}\n`;
const words = (value) => (value ? value.split(/\s+/).filter(Boolean) : []);
// Los moldes escriben sus fixtures editadas en LF, como las dejaban sus versiones anteriores.
export const readLf = (path) => readFileSync(path, 'utf8').replaceAll('\r\n', '\n');

export function runsDirAllowed(runs) {
  return comparable(runs).includes('scratchpad') || isInside(runs, join(REPO_ROOT, '.temp'));
}

// Claude Code nombra la carpeta con la ruta Windows del cwd y cada carácter no alfanumérico como «-».
const moldSlug = (mold) => mold.replace(/[^A-Za-z0-9]/g, '-');

const semver = (version) => version.split('.').map(Number);
function newest(versions) {
  return versions.sort((a, b) => {
    const [x, y] = [semver(a), semver(b)];
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  }).at(-1);
}

export const nodeFs = {
  exists: existsSync,
  read: (path) => readFileSync(path, 'utf8'),
  write: (path, text) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  },
  remove: (path) => rmSync(path, { recursive: true, force: true }),
  list: (dir) => (existsSync(dir) ? readdirSync(dir).sort() : []),
  mkdir: (dir) => mkdirSync(dir, { recursive: true }),
};

export function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

// taskkill /T se lleva el árbol; un proceso que ya no existe no es un error. Fuera de Windows, solo ese PID.
export function killProcess(pid, tree) {
  if (windows) {
    spawnSync('taskkill', [...(tree ? ['/T'] : []), '/F', '/PID', String(pid)], { stdio: 'ignore', windowsHide: true });
    return;
  }
  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    // Ya había salido.
  }
}

function runSync(command, args, { cwd, env, input } = {}) {
  const result = spawnSync(command, args, { cwd, env, input, encoding: 'utf8', windowsHide: true, maxBuffer: MAX_BUFFER });
  return { code: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? result.error?.message ?? '' };
}

// Sin shell y con la entrada cerrada: con ella abierta, un aviso de stdin precedía al JSON.
function spawnClaude(command, args, { cwd, env, stdout, stderr, append }) {
  const out = openSync(stdout, append ? 'a' : 'w');
  const err = openSync(stderr, 'a');
  try {
    const child = spawn(command, args, { cwd, env, stdio: ['ignore', out, err], windowsHide: true });
    const exited = new Promise((done) => {
      child.on('exit', (code) => done(code ?? 1));
      child.on('error', () => done(1));
    });
    return { pid: child.pid, exited };
  } finally {
    closeSync(out);
    closeSync(err);
  }
}

// El claude.exe de la instalación nativa: spawn sin shell no lanza un .cmd ni un shim.
function whichClaude() {
  const found = runSync(windows ? 'where' : 'which', ['claude']).stdout.split(/\r?\n/).filter(Boolean);
  return windows ? found.find((path) => /\.exe$/i.test(path)) : found[0];
}

function netstat() {
  const result = runSync('netstat', ['-ano']);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout;
}

export function realSubjectDeps() {
  return {
    fs: nodeFs,
    run: runSync,
    spawnClaude,
    whichClaude,
    netstat,
    isAlive,
    kill: killProcess,
    startTimer: (ms, fire) => {
      const timer = setTimeout(fire, ms);
      return () => clearTimeout(timer);
    },
    // La limpieza es síncrona: corre también al salir con process.exit.
    onExit: (fn) => process.on('exit', () => (process.exitCode = fn() || process.exitCode)),
    exit: (code) => process.exit(code),
    err: (line) => console.error(line),
    out: (line) => console.log(line),
  };
}

/**
 * @param {string[]} argv
 * @param {string} skill
 * @param {{ env?: Record<string, string | undefined>, deps?: any, cwd?: string }} [options]
 * @returns {Record<string, any>}
 */
export function initSubject(argv, skill, { env = process.env, deps = realSubjectDeps(), cwd = process.cwd() } = {}) {
  const [kit, label, scenario, out] = argv;
  /** @type {Record<string, any>} */
  const s = { env: { ...env }, LABEL: label, SC: scenario, HEADLESS, exitCode: 0 };
  s.NODE = s.env.NODE || process.execPath;
  s.die = (message) => {
    deps.err(`[${label || 'sujeto'}] ${message}`);
    deps.exit(1);
  };
  checkInputs(s, deps.fs, { kit, skill, cwd });
  prepareRun(s, deps.fs, { out, cwd });
  s.snapshot = tryNetstat(deps);
  bindMoldTools(s, deps);
  bindRunTools(s, deps);
  let done = false;
  deps.onExit(() => (done ? 0 : ((done = true), cleanup(s, deps))));
  return s;
}

function checkInputs(s, fs, { kit, skill, cwd }) {
  const runs = s.env.RUNS_DIR;
  if (!runs) s.die('define RUNS_DIR (scratchpad)');
  if (!runsDirAllowed(resolve(cwd, runs))) s.die(`RUNS_DIR fuera del scratchpad o de .temp/: ${runs}`);
  if (!s.LABEL || s.LABEL !== basename(s.LABEL) || s.LABEL === '.' || s.LABEL === '..') s.die(`etiqueta no válida: «${s.LABEL}»`);
  s.KIT = resolve(cwd, kit);
  if (!fs.exists(join(s.KIT, 'skills', skill, 'SKILL.md'))) s.die(`sin la skill ${skill} en la copia del kit ${s.KIT} (task 0040)`);
  // Con .docs/, el sujeto leyó la spec de lo que se medía.
  if (fs.exists(join(s.KIT, '.docs')) || fs.exists(join(s.KIT, 'tests'))) {
    s.die('la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin agents cli hooks');
  }
  // Con dependencies y sin SUPERPOWERS_DIR, el kit no carga: «unmet dependency».
  const plugin = join(s.KIT, '.claude-plugin', 'plugin.json');
  if (!s.env.SUPERPOWERS_DIR && fs.exists(plugin) && fs.read(plugin).includes('"dependencies"')) {
    s.die('el kit declara dependencies: define SUPERPOWERS_DIR (ruta de superpowers)');
  }
}

function prepareRun(s, fs, { out, cwd }) {
  // Una carpeta por fase: dos fases a la vez con el mismo RUNS_DIR se borraban el molde.
  s.RUNS = join(resolve(cwd, s.env.RUNS_DIR), s.env.PHASE || 'red');
  // launch corre en el molde: un OUT relativo perdía las salidas.
  s.OUT = resolve(cwd, out);
  fs.mkdir(s.OUT);
  s.RUN = join(s.RUNS, s.LABEL);
  s.R = join(s.RUN, s.env.MOLD_NAME || 'repo');
  s.JSONL = join(s.RUNS, `${s.LABEL}.jsonl`);
  s.LEAK = join(s.RUNS, `${s.LABEL}.leak`);
  s.ERR = join(s.RUNS, `${s.LABEL}.err`);
  fs.remove(s.RUN);
  fs.mkdir(s.R);
  fs.remove(s.LEAK);
  s.versionedOut = versionedOut(s, fs);
}

// En seco la salida va al scratchpad, que puede colgar del repo con una ruta larga: se mide la que tendría en SPEC_DIR.
// Sin SPEC_DIR en disco no hay ruta que medir.
function versionedOut(s, fs) {
  if (s.env.DRY_RUN !== '1') return s.OUT;
  const spec = s.env.SPEC_DIR;
  return spec && fs.exists(spec) ? join(resolve(spec), s.env.PHASE || 'red', 'out') : undefined;
}

function bindMoldTools(s, deps) {
  const repo = { checked: false };
  Object.assign(s, {
    git: (...args) => runGit(s, deps, { repo, args }),
    commit: (title, body = 'Cuerpo del commit.') => {
      s.git('add', '-A');
      s.git('commit', '-q', '-m', title, '-m', body);
    },
    initRepo: (title = 'feat: base del molde') => initRepo(s, title),
    put: (path, text) => deps.fs.write(join(s.R, path), text),
    copy: (source, dest = '.') => cpSync(source, join(s.R, dest), { recursive: true }),
    kitVersion: () => kitVersion(s.KIT, deps.fs),
    putKitMarker: (fields) => putKitMarker(s, fields),
    seedDir: () => join(s.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'), 'projects', moldSlug(s.R)),
    seedTranscript: (branch, entries) => seedTranscript(s, deps.fs, { branch, entries }),
  });
}

function bindRunTools(s, deps) {
  Object.assign(s, {
    save: (state) => save(s, deps, state),
    keep: (path, name) => keep(s, deps, { path, name }),
    show: (revPath, name) => show(s, deps, { revPath, name }),
    launch: (ask) => launch(s, deps, ask),
    resume: (message) => resume(s, deps, message),
    converse: (sheet, max) => converse(s, deps, { sheet, max }),
    ports: () => streamPorts(readOr(deps.fs, s.JSONL), s.env.PORT).join(','),
  });
}

// El molde como repo en main, con su commit base y develop sacada de él.
function initRepo(s, title) {
  s.git('init', '-q', '-b', 'main');
  s.commit(title);
  s.git('checkout', '-q', '-b', 'develop');
}

const GIT_CONFIG = ['-c', 'user.email=fixture@example.com', '-c', 'user.name=Fixture', '-c', 'core.autocrlf=false', '-c', 'core.longpaths=true'];

// Sin git init, git sube hasta el repo que contiene el molde: un %TEMP% dentro de un repo perdió su HEAD.
// --show-cdup vacío es --show-toplevel igual al molde, sin comparar nombres cortos de Windows.
function runGit(s, deps, { repo, args }) {
  if (args[0] !== 'init' && !repo.checked) {
    const cdup = deps.run('git', ['-C', s.R, 'rev-parse', '--show-cdup'], { env: s.env });
    if (cdup.code !== 0 || cdup.stdout.trim() !== '') s.die(`el molde ${s.R} no es su propio repo git: falta git init en el subject.mjs antes del primer git`);
    repo.checked = true;
  }
  const result = deps.run('git', ['-C', s.R, ...GIT_CONFIG, ...args], { env: s.env });
  if (result.code !== 0 && result.stderr) deps.err(result.stderr.trimEnd());
  return result.stdout;
}

// La versión que el hook exige al proyecto: la mayor entre plugin.json y la última migración del kit.
export function kitVersion(kit, fs = nodeFs) {
  const plugin = join(kit, '.claude-plugin', 'plugin.json');
  const versions = fs.exists(plugin) ? [JSON.parse(fs.read(plugin)).version].filter(Boolean) : [];
  for (const skill of ['sdd-upgrade', 'sdd-init-brownfield']) {
    for (const name of fs.list(join(kit, 'skills', skill, 'references', 'migrations'))) {
      const match = /^v(\d+\.\d+\.\d+)\.md$/.exec(name);
      if (match) versions.push(match[1]);
    }
  }
  return newest(versions);
}

// Un marcador copiado de otra campaña envejece: con uno menor que la última migración, el hook manda a migrar.
function putKitMarker(s, fields) {
  const version = s.kitVersion();
  if (!version) s.die(`sin versión en la copia del kit ${s.KIT}: ni plugin.json ni migraciones`);
  s.put(join('.docs', 'sdd', 'sdd-kit.json'), `{"version": "${version}", ${fields}}\n`);
}

// Transcripts del trabajo para un THEN que lee sdd session tokens: sin ellos da 0,00 h. La limpieza borra la carpeta.
function seedTranscript(s, fs, { branch, entries }) {
  const dir = s.seedDir();
  let n = 1;
  while (fs.exists(join(dir, `seed-${n}.jsonl`))) n++;
  const usage = { input_tokens: 1, cache_read_input_tokens: 0, output_tokens: 1 };
  const records = entries.filter((line) => line.trim()).map((line, i) => {
    const [timestamp, type, ...rest] = line.split(' ');
    const text = rest.join(' ');
    const message = type === 'assistant'
      ? { model: 'claude-sonnet-5', id: `seed-${i + 1}`, role: 'assistant', content: [{ type: 'text', text }], usage }
      : { role: 'user', content: text };
    return JSON.stringify({ type, timestamp, gitBranch: branch, message });
  });
  fs.write(join(dir, `seed-${n}.jsonl`), lines(records));
}

const readOr = (fs, path) => (fs.exists(path) ? fs.read(path) : '');
const extract = (s, deps, { args, input }) => deps.run(s.NODE, [EXTRACT, ...args], { env: s.env, input });
const clean = (s, deps, text) => extract(s, deps, { args: ['clean', s.RUN], input: text });

// La ruta que tendría la salida en el repo no pasa de MAX_PATH.
function outPath(s, path) {
  if (!s.versionedOut) return path;
  const versioned = join(s.versionedOut, relative(s.OUT, path));
  if (!isInside(versioned, REPO_ROOT)) return path;
  const rel = forward(relative(REPO_ROOT, versioned));
  if (rel.length >= MAX_PATH) s.die(`ruta de ${rel.length} caracteres (máximo ${MAX_PATH - 1}): ${rel}`);
  return path;
}

// Solo se escribe si extract.mjs sale bien: con la identidad de git de la máquina sale con 3.
// La marca LEAK hace salir al sujeto con error en la limpieza.
function saveExtract(s, deps, { dest, result }) {
  if (result.code === 0) {
    deps.fs.write(dest, result.stdout);
    return true;
  }
  deps.fs.write(s.LEAK, '');
  deps.err(`[${s.LABEL}] no se guarda ${basename(dest)}: el stream sigue en ${s.JSONL}`);
  return false;
}

function save(s, deps, state) {
  const [statePath, tools, texts] = ['state', 'tools', 'texts'].map((kind) => outPath(s, join(s.OUT, `${s.LABEL}.${kind}.txt`)));
  // Los tres aunque falle uno: sin tools.txt, run.mjs no cuenta el coste del sujeto.
  const saved = [
    saveExtract(s, deps, { dest: statePath, result: clean(s, deps, state) }),
    saveExtract(s, deps, { dest: tools, result: extract(s, deps, { args: ['tools', s.JSONL, s.RUN] }) }),
    saveExtract(s, deps, { dest: texts, result: extract(s, deps, { args: ['texts', s.JSONL, s.RUN] }) }),
  ];
  if (saved.every(Boolean)) deps.out(`[${s.LABEL}] listo`);
}

function flatCopy(s, deps, name) {
  if (!/[\\/]/.test(name)) return true;
  deps.err(`[${s.LABEL}] ${name}: solo copia plana, sin carpetas (<etiqueta>/walkthrough-task-<id>.md)`);
  return false;
}

// Un fichero del molde, plano: la ruta completa de .docs/ pasó de 140 caracteres.
function keep(s, deps, { path, name }) {
  if (!flatCopy(s, deps, name)) return false;
  if (!deps.fs.exists(path)) {
    deps.err(`[${s.LABEL}] sin ${path}`);
    return false;
  }
  const dest = outPath(s, join(s.OUT, s.LABEL, name));
  return saveExtract(s, deps, { dest, result: clean(s, deps, deps.fs.read(path)) });
}

function show(s, deps, { revPath, name }) {
  if (!flatCopy(s, deps, name)) return false;
  const dump = deps.run('git', ['-C', s.R, 'show', revPath], { env: s.env });
  if (dump.code !== 0) {
    deps.err(`[${s.LABEL}] sin ${revPath}`);
    return false;
  }
  const file = join(s.RUN, `${name}.show`);
  deps.fs.write(file, dump.stdout);
  return keep(s, deps, { path: file, name });
}

// El molde y la carpeta que Claude Code crea para su cwd pesan; el stream y las salidas ya están guardados.
// Cada paso va aparte: uno que lanza no deja sin borrar el molde.
function cleanup(s, deps) {
  const { fs } = deps;
  const steps = [
    () => stopPorts(s, deps),
    () => fs.list(s.seedDir()).some((name) => /^seed-\d+\.jsonl$/.test(name)) && fs.remove(s.seedDir()),
    () => fs.remove(join(s.env.CLAUDE_CODE_TMPDIR || s.env.TEMP || tmpdir(), 'claude', moldSlug(s.R))),
    () => s.env.KEEP_MOLD !== '1' && fs.remove(s.RUN),
  ];
  for (const step of steps) {
    try {
      step();
    } catch (error) {
      deps.err(`[${s.LABEL}] ${error.message}`);
    }
  }
  // Una salida con la identidad de la máquina no se guardó: el sujeto sale con error.
  return s.exitCode || (fs.exists(s.LEAK) ? 1 : 0);
}

function defaultSettings() {
  const hook = { type: 'command', command: `node "${DENY_KILL_HOOK}"` };
  return JSON.stringify({ enabledPlugins: { 'sdd-kit@sdd-kit': false }, hooks: { PreToolUse: [{ matcher: 'Bash|PowerShell', hooks: [hook] }] } });
}

// Los argumentos de claude -p; launch los deja en <etiqueta>.args para poder comprobarlos.
function claudeArgs(s, settings) {
  const { env } = s;
  // La carpeta de ejecución, junto al molde: sin ella, los sujetos no abrían sus capturas.
  const args = ['-p', '--model', env.MODEL || 'sonnet', '--settings', settings, '--plugin-dir', s.KIT, '--add-dir', s.KIT, '--add-dir', s.RUN];
  // El CLAUDE.md del dev-lead ya enruta al kit: medir con él da por buena una puerta que un dev sin él no tiene.
  if (env.SUPERPOWERS_DIR) args.push('--setting-sources', '', '--plugin-dir', env.SUPERPOWERS_DIR);
  args.push('--permission-mode', 'acceptEdits', '--allowedTools', 'Bash(*)', 'PowerShell(*)', 'Agent', ...words(env.EXTRA_ALLOWED));
  // La mensajería entre sesiones va bloqueada.
  args.push('--disallowedTools', 'SendMessage', 'ListAgents', 'AskUserQuestion', ...words(env.EXTRA_DISALLOWED));
  // Una instrucción del usuario que el escenario necesita: con --setting-sources "" no llega el CLAUDE.md del molde.
  if (env.APPEND_SYSTEM) args.push('--append-system-prompt', env.APPEND_SYSTEM);
  args.push('--max-turns', env.MAX_TURNS || '60', '--output-format', 'stream-json', '--verbose');
  return args;
}

// La identidad por entorno gana a la global también en `git config user.name`: sin ella, los sujetos ponían el
// nombre del dev-lead en las salidas. El sujeto ve primero no-claude/: un claude que lance él no gasta fuera de la cuenta.
const GIT_IDENTITY = { GIT_CONFIG_COUNT: '2', GIT_CONFIG_KEY_0: 'user.name', GIT_CONFIG_VALUE_0: 'Fixture', GIT_CONFIG_KEY_1: 'user.email', GIT_CONFIG_VALUE_1: 'fixture@example.com' };
function claudeEnv(env) {
  const pathKey = Object.keys(env).find((name) => name.toLowerCase() === 'path') ?? 'PATH';
  return { ...env, [pathKey]: [join(HEADLESS, 'no-claude'), env[pathKey]].filter(Boolean).join(delimiter), ...GIT_IDENTITY };
}

function dryStream(s) {
  const text = `En seco desde ${s.env.HOME ?? ''} · permitidas extra: ${s.env.EXTRA_ALLOWED ?? ''} · git: Fixture <fixture@example.com>`;
  return lines([
    JSON.stringify({ type: 'system', subtype: 'init', session_id: `dry-${s.LABEL}` }),
    JSON.stringify({ type: 'assistant', message: { content: [{ type: 'text', text }, { type: 'tool_use', name: 'Bash', input: { command: `ls ${s.R}` } }] } }),
    JSON.stringify({ type: 'result', num_turns: 1, total_cost_usd: Number(s.env.DRY_COST ?? 0.5), result: s.env.DRY_RESULT || 'hecho' }),
  ]);
}

function timeoutSeconds(s) {
  const value = s.env.SUBJECT_TIMEOUT || String(DEFAULT_TIMEOUT_SECONDS);
  if (!/^\d+$/.test(value)) s.die(`SUBJECT_TIMEOUT tiene que ser un número de segundos: ${value}`);
  return Number(value);
}

function claudeCommand(s, deps, args) {
  const bin = s.env.CLAUDE_BIN || deps.whichClaude();
  if (!bin) s.die('no encuentro claude en el PATH');
  return bin.endsWith('.mjs') ? [s.NODE, [bin, ...args]] : [bin, args];
}

// El tope mata el árbol de claude: con el tope solo al proceso, sus hijos seguían vivos.
async function runClaude(s, deps, { args, stdout = s.JSONL, append = false }) {
  const seconds = timeoutSeconds(s);
  const [command, finalArgs] = claudeCommand(s, deps, args);
  const child = deps.spawnClaude(command, finalArgs, { cwd: s.R, env: claudeEnv(s.env), stdout, stderr: s.ERR, append });
  let timedOut = false;
  const kill = () => {
    timedOut = true;
    deps.kill(child.pid, true);
  };
  const cancel = seconds > 0 ? deps.startTimer(seconds * 1000, kill) : () => {};
  const code = await child.exited;
  cancel();
  if (!timedOut) return code;
  deps.err(`[${s.LABEL}] tope de ${seconds} s: sujeto cortado`);
  s.exitCode = 124;
  return 124;
}

function checkSettings(s) {
  // Una petición ejecutada fuera del molde corrió una vez sobre el worktree del kit.
  if (!isInside(s.R, s.RUNS)) s.die(`cwd fuera del scratchpad: ${s.R}`);
  const settings = s.env.SETTINGS || defaultSettings();
  // Sin esa clave, el sujeto carga también el kit instalado, y mide la caché en vez de la copia.
  if (!settings.includes('"sdd-kit@sdd-kit":false')) s.die(`SETTINGS sin deshabilitar el kit instalado: ${settings}`);
  // Un sujeto que para node.exe por nombre tumba los MCP de las sesiones de la máquina.
  if (!settings.includes('deny-kill.mjs')) s.die('SETTINGS sin el hook deny-kill.mjs: añade $DENY_KILL_HOOK a sus PreToolUse');
  return settings;
}

async function launch(s, deps, ask) {
  s.claudeArgs = claudeArgs(s, checkSettings(s));
  deps.fs.write(join(s.RUNS, `${s.LABEL}.args`), lines([...s.claudeArgs, ask]));
  if (s.env.DRY_RUN === '1') {
    deps.fs.write(s.JSONL, dryStream(s));
  } else {
    deps.fs.write(s.ERR, '');
    const code = await runClaude(s, deps, { args: [...s.claudeArgs, ask] });
    if (code !== 0) return code;
  }
  if (s.env.TURN2) await resume(s, deps, s.env.TURN2);
  return 0;
}

// Segundo turno sobre la sesión real del primero: su molde es lo que el primero dejó, no el relato de un ticket.
// --resume da un total_cost_usd acumulado; run.mjs ya cuenta solo el último RESULTADO.
async function resume(s, deps, message) {
  const { fs } = deps;
  const session = /"session_id":"([^"]*)"/.exec(readOr(fs, s.JSONL))?.[1];
  if (!session) s.die('sin session_id: no se puede reanudar');
  const args = [...s.claudeArgs, '--resume', session, message];
  fs.write(join(s.RUNS, `${s.LABEL}.resume.args`), lines(args));
  if (s.env.DRY_RUN !== '1') return runClaude(s, deps, { args, append: true });
  const result = { type: 'result', num_turns: 2, total_cost_usd: Number(s.env.DRY_COST ?? 0.5) * 2, result: s.env.DRY_RESULT || 'hecho' };
  fs.write(s.JSONL, fs.read(s.JSONL) + lines([JSON.stringify(result)]));
  return 0;
}

// Devuelve la respuesta y deja el coste de la llamada en costFile; undefined si claude falla.
async function personaReply(s, deps, { sheet, asked, costFile }) {
  const { fs } = deps;
  if (s.env.DRY_RUN === '1') {
    fs.write(costFile, s.env.DRY_PERSONA_COST || '0');
    return 'Respuesta de la persona.';
  }
  const prompt = `Eres el usuario de esta hoja: ${fs.read(sheet).trimEnd()}. Contesta en castellano solo lo que el agente pregunta, en una o dos frases; lo que la hoja no dice, «no sé». El agente dice: ${asked}`;
  const replyFile = costFile.replace(/\.txt$/, '.json');
  const code = await runClaude(s, deps, { args: ['-p', '--model', 'haiku', '--setting-sources', '', '--output-format', 'json', '--max-turns', '1', prompt], stdout: replyFile });
  if (code !== 0) return undefined;
  const reply = JSON.parse(fs.read(replyFile));
  fs.write(costFile, String(reply.total_cost_usd ?? 0));
  return reply.result ?? '';
}

// Conversación con una persona: un modelo barato contesta con su hoja hasta que el sujeto deja de preguntar o llega al tope.
// Su coste va al último RESULTADO, que es el único que cuenta run.mjs.
async function converse(s, deps, { sheet, max }) {
  const talk = { turns: 0, cost: 0 };
  while (talk.turns < max) {
    const asked = deps.run(s.NODE, [EXTRACT, 'last', s.JSONL], { env: s.env }).stdout;
    if (!asked.includes('?')) break;
    talk.turns++;
    const costFile = join(s.RUNS, `${s.LABEL}.persona-${talk.turns}.txt`);
    const answer = await personaReply(s, deps, { sheet, asked, costFile });
    if (answer === undefined) return 1;
    talk.cost += Number(deps.fs.read(costFile));
    await resume(s, deps, answer);
  }
  if (talk.turns > 0) appendPersonaCost(s, deps.fs, talk);
  return 0;
}

function appendPersonaCost(s, fs, { turns, cost }) {
  const stream = fs.read(s.JSONL);
  const subjectCost = Number([...stream.matchAll(/"total_cost_usd":([0-9.]+)/g)].at(-1)?.[1] ?? 0);
  const result = { type: 'result', num_turns: turns, total_cost_usd: subjectCost + cost, result: `conversación con persona: ${turns} respuestas` };
  fs.write(s.JSONL, stream + lines([JSON.stringify(result)]));
}

// netstat -ano: la remota de un socket que escucha es 0.0.0.0:0 o [::]:0; el nombre del estado se traduce con el idioma de Windows.
export function listeningPids(netstatText, port) {
  return netstatText
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/))
    .filter((columns) => columns.length === 5 && columns[1].endsWith(`:${port}`) && /^(0\.0\.0\.0|\[::\]):0$/.test(columns[2]))
    .map((columns) => Number(columns[4]));
}

// Un sujeto web arranca en el puerto que elige, no en el del molde: se miden todos los que nombra el stream.
function streamPorts(stream, port) {
  const found = /^\d+$/.test(port ?? '') ? [Number(port)] : [];
  for (const match of stream.matchAll(/(?:PORT=|localhost:)(\d{4,5})/g)) found.push(Number(match[1]));
  return [...new Set(found.filter((value) => value >= 1 && value <= 65535))].sort((a, b) => a - b);
}

function tryNetstat(deps) {
  try {
    return deps.netstat();
  } catch {
    return undefined;
  }
}

// RUNS es <RUNS_DIR>/<fase>: las marcas de live/ y los streams de los demás sujetos cuelgan de su padre.
function otherSubjectPorts(s, deps) {
  const root = dirname(s.RUNS);
  const ports = new Set();
  for (const live of [join(root, 'live'), join(root, 'dry', 'live')]) {
    for (const name of deps.fs.list(live).filter((mark) => !mark.startsWith('.') && mark.includes('.') && mark !== `${s.env.PHASE || 'red'}.${s.LABEL}`)) {
      // Un PID vacío es una marca a medio escribir: en curso, como en countMarks de campaign.mjs.
      const pid = readOr(deps.fs, join(live, name)).split(/\r?\n/)[0].trim();
      if (pid && !deps.isAlive(Number(pid))) continue;
      const dot = name.indexOf('.');
      streamPorts(readOr(deps.fs, join(root, name.slice(0, dot), `${name.slice(dot + 1)}.jsonl`))).forEach((port) => ports.add(port));
    }
  }
  return ports;
}

// La foto de los PID que ya escuchaban: la del primer sujeto que saltó el puerto en ports/, o la propia.
function photoOf(s, deps, handoff) {
  try {
    if (deps.fs.exists(handoff)) return JSON.parse(deps.fs.read(handoff));
  } catch {
    // Un relevo a medio escribir vale lo que la foto propia.
  }
  return s.snapshot === undefined ? undefined : listeningPids(s.snapshot, Number(basename(handoff)));
}

function stopNew(s, deps, photos) {
  const now = [...photos.values()].includes(undefined) ? undefined : tryNetstat(deps);
  if (now === undefined) return 'no comprobado (netstat no respondió)';
  const stopped = [...photos.keys()].filter((port) => {
    const mine = listeningPids(now, port).filter((pid) => !photos.get(port).includes(pid));
    mine.forEach((pid) => deps.kill(pid, false));
    return mine.length > 0;
  });
  return stopped.join(',') || 'ninguno';
}

// Por el PID que escucha en el puerto y no estaba en la foto del arranque, nunca por nombre: en la máquina corren
// los servidores y los MCP de otras sesiones, y el stream nombra puertos que el sujeto solo leyó.
// Un puerto que nombra otro sujeto en curso lo para el último en acabar, con la foto del primero que lo saltó en ports/:
// el primero paraba el servidor del otro, y el último no veía uno arrancado antes que él. Sin foto no se deja relevo.
// shortcut: dos sujetos que acaban a la vez se ven en curso y ninguno para el puerto; un lock por puerto si pasa.
function stopPorts(s, deps) {
  const own = streamPorts(readOr(deps.fs, s.JSONL), s.env.PORT);
  if (own.length === 0) return;
  const others = otherSubjectPorts(s, deps);
  const handoff = (port) => join(dirname(s.RUNS), 'ports', String(port));
  const photos = new Map();
  for (const port of own) {
    const photo = photoOf(s, deps, handoff(port));
    if (!others.has(port)) photos.set(port, photo);
    if (others.has(port) && photo) deps.fs.write(handoff(port), JSON.stringify(photo));
    if (!others.has(port)) deps.fs.remove(handoff(port));
  }
  const listening = photos.size === 0 ? 'sin consultar' : stopNew(s, deps, photos);
  const shared = own.filter((port) => others.has(port));
  const note = shared.length ? ` · compartidos con otro sujeto en curso, sin parar: ${shared.join(',')}` : '';
  deps.fs.write(s.ERR, readOr(deps.fs, s.ERR) + lines([`puertos del sujeto: ${own.join(',')} · escuchando al acabar: ${listening}${note}`]));
}
