// Biblioteca de referencia para el subject.mjs de una campaña de sujetos headless: se importa, no se copia.
//   import { initSubject } from '<repo>/tests/headless/lib.mjs';
//   const s = initSubject(process.argv.slice(2), '<skill medida>');  // kit, etiqueta, escenario, salida (argumentos de run.mjs)
//   ...molde en s.R con s.copy, s.put, s.git y s.commit...
//   await s.launch(ask);
//   s.save(`## git log\n${s.git('log', '--oneline', '--all')}`);
//   s.keep(join(s.R, '.docs/sdd/roadmap.md'), 'roadmap.md');    // copia plana y limpia en <salida>/<etiqueta>/
//   s.putKitMarker('"ids": {"mode": "sequence"}');               // sdd-kit.json del molde con la versión del kit (kitVersion)
//   await s.resume('<mensaje>');                                  // segundo turno sobre la misma sesión
//   await s.converse(<hoja de la persona>, <turnos máximos>);     // la persona (haiku) contesta hasta que el sujeto deja de preguntar
//   s.show('feature/0013:.docs/sdd/roadmap.md', 'roadmap.md');    // un fichero de otra rama, con las reglas de keep
//   s.seedTranscript('feature/0042', ['<fecha ISO> <user|assistant> <texto>', …]); // transcripts del trabajo; se borran al acabar
//   s.ports();                                                    // puertos del sujeto (PORT y los del stream); la limpieza para lo que arrancó con él
// s.env es una copia del entorno: un molde fija ahí lo suyo antes de launch (s.env.MAX_TURNS ??= '30'; s.env.TURN2 = '…').
// Variables: RUNS_DIR (obligatoria, en el scratchpad o en .temp/ del repo; cada sujeto va a RUNS_DIR/<PHASE>/<etiqueta>), PHASE (red), MODEL (sonnet), MAX_TURNS (60), MOLD_NAME (repo),
// EXTRA_DISALLOWED («PowerShell» en escenarios con worktrees), NODE (el node que corre esto),
// SETTINGS (el JSON de --settings: sin él, deshabilita el kit instalado y carga el hook deny-kill.mjs; uno propio lo lleva),
// EXTRA_ALLOWED (herramientas que se suman a --allowedTools, como un servidor MCP), APPEND_SYSTEM (--append-system-prompt),
// PORT (puerto del molde, si arranca un servidor), CLAUDE_CONFIG_DIR (raíz de los transcripts de seedTranscript; sin ella, ~/.claude),
// SUPERPOWERS_DIR (sujeto sin la configuración del usuario, ni su CLAUDE.md ni sus plugins, y con superpowers cargado desde esa ruta),
// SUBJECT_TIMEOUT (segundos de reloj por sujeto: 1800 por omisión; 0, sin tope), CLAUDE_BIN (otro claude; un .mjs se lanza con node),
// TURN2 (mensaje del segundo turno: launch reanuda la sesión con resume),
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

const forward = (path) => path.replaceAll('\\', '/');
const comparable = (path) => forward(resolve(path)).toLowerCase();
const isInside = (path, root) => comparable(path).startsWith(`${comparable(root)}/`);

function runsDirAllowed(runs) {
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

const nodeFs = {
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

function runSync(command, args, { cwd, env, input } = {}) {
  const result = spawnSync(command, args, { cwd, env, input, encoding: 'utf8', windowsHide: true, maxBuffer: 64 * 1024 * 1024 });
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

// El claude.exe de la instalación nativa: spawn sin shell no lanza un .cmd.
function whichClaude() {
  const found = runSync('where', ['claude']).stdout.split(/\r?\n/).filter(Boolean);
  return found.find((path) => /\.exe$/i.test(path)) ?? found[0];
}

function netstat() {
  const result = runSync('netstat', ['-ano']);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout;
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

export function realSubjectDeps() {
  return {
    fs: nodeFs,
    run: runSync,
    spawnClaude,
    whichClaude,
    netstat,
    isAlive,
    // taskkill /T se lleva el árbol; un proceso que ya no existe no es un error.
    kill: (pid, tree) => spawnSync('taskkill', [...(tree ? ['/T'] : []), '/F', '/PID', String(pid)], { stdio: 'ignore', windowsHide: true }),
    startTimer: (ms, fire) => {
      const timer = setTimeout(fire, ms);
      return () => clearTimeout(timer);
    },
    now: Date.now,
    // La limpieza es síncrona, como el trap EXIT de bash: corre también al salir con process.exit.
    onExit: (fn) => process.on('exit', () => {
      const code = fn();
      if (code) process.exitCode = code;
    }),
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
  const { fs } = deps;
  /** @type {Record<string, any>} */
  const s = { env: { ...env }, LABEL: label, SC: scenario, HEADLESS };
  s.NODE = s.env.NODE || process.execPath;
  s.die = (message) => {
    deps.err(`[${label || 'sujeto'}] ${message}`);
    deps.exit(1);
  };
  checkInputs(s, { kit, skill, fs, cwd });
  prepareRun(s, { out, fs, cwd });
  addMoldTools(s, deps);
  addSaving(s, deps);
  addLaunch(s, deps);
  addPorts(s, deps);
  addCleanup(s, deps);
  return s;
}

function checkInputs(s, { kit, skill, fs, cwd }) {
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

function prepareRun(s, { out, fs, cwd }) {
  // Una carpeta por fase: dos fases a la vez con el mismo RUNS_DIR se borraban el molde.
  s.RUNS = join(resolve(cwd, s.env.RUNS_DIR), s.env.PHASE || 'red');
  // launch corre en el molde: un OUT relativo perdía las salidas.
  s.OUT = resolve(cwd, out);
  fs.mkdir(s.OUT);
  s.RUN = join(s.RUNS, s.LABEL);
  s.R = join(s.RUN, s.env.MOLD_NAME || 'repo');
  s.JSONL = join(s.RUNS, `${s.LABEL}.jsonl`);
  s.LEAK = join(s.RUNS, `${s.LABEL}.leak`);
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

function addMoldTools(s, deps) {
  let moldIsRepo = false;
  const gitArgs = ['-c', 'user.email=fixture@example.com', '-c', 'user.name=Fixture', '-c', 'core.autocrlf=false', '-c', 'core.longpaths=true'];
  // Sin git init, git sube hasta el repo que contiene el molde: un %TEMP% dentro de un repo perdió su HEAD.
  // --show-cdup vacío es --show-toplevel igual al molde, sin comparar nombres cortos de Windows.
  const checkMoldIsRepo = () => {
    const cdup = deps.run('git', ['-C', s.R, 'rev-parse', '--show-cdup'], { env: s.env });
    if (cdup.code !== 0 || cdup.stdout.trim() !== '') s.die(`el molde ${s.R} no es su propio repo git: falta g init en el subject.mjs antes del primer git`);
    moldIsRepo = true;
  };
  s.git = (...args) => {
    if (args[0] !== 'init' && !moldIsRepo) checkMoldIsRepo();
    const result = deps.run('git', ['-C', s.R, ...gitArgs, ...args], { env: s.env });
    if (result.code !== 0 && result.stderr) deps.err(result.stderr.trimEnd());
    return result.stdout;
  };
  s.commit = (title, body = 'Cuerpo del commit.') => {
    s.git('add', '-A');
    s.git('commit', '-q', '-m', title, '-m', body);
  };
  s.put = (path, text) => deps.fs.write(join(s.R, path), text);
  // Una carpeta de fixtures dentro del molde, como cp -r <origen>/. <molde>/<destino>.
  s.copy = (source, dest = '.') => cpSync(source, join(s.R, dest), { recursive: true });
  s.kitVersion = () => kitVersion(s.KIT, deps.fs);
  // Un marcador copiado de otra campaña envejece: con uno menor que la última migración, el hook manda a migrar.
  s.putKitMarker = (fields) => s.put(join('.docs', 'sdd', 'sdd-kit.json'), `{"version": "${s.kitVersion()}", ${fields}}\n`);
  s.seedDir = () => join(s.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'), 'projects', moldSlug(s.R));
  s.seedTranscript = (branch, lines) => seedTranscript(s, deps.fs, branch, lines);
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

// Transcripts del trabajo para un THEN que lee sdd session tokens: sin ellos da 0,00 h. La limpieza borra la carpeta.
function seedTranscript(s, fs, branch, lines) {
  const dir = s.seedDir();
  let n = 1;
  while (fs.exists(join(dir, `seed-${n}.jsonl`))) n++;
  const usage = { input_tokens: 1, cache_read_input_tokens: 0, output_tokens: 1 };
  const entries = lines.filter((line) => line.trim()).map((line, i) => {
    const [timestamp, type, ...words] = line.split(' ');
    const text = words.join(' ');
    const message = type === 'assistant'
      ? { model: 'claude-sonnet-5', id: `seed-${i + 1}`, role: 'assistant', content: [{ type: 'text', text }], usage }
      : { role: 'user', content: text };
    return JSON.stringify({ type, timestamp, gitBranch: branch, message });
  });
  fs.write(join(dir, `seed-${n}.jsonl`), `${entries.join('\n')}\n`);
}

function addSaving(s, deps) {
  const { fs } = deps;
  const extract = (args, input) => deps.run(s.NODE, [EXTRACT, ...args], { env: s.env, input });
  const clean = (text) => extract(['clean', s.RUN], text);
  // Ruta de salida comprobada: dentro del repo, relativa y por debajo de MAX_PATH.
  const outPath = (path) => {
    if (!s.versionedOut) return path;
    const versioned = join(s.versionedOut, relative(s.OUT, path));
    if (!isInside(versioned, REPO_ROOT)) return path;
    const rel = forward(relative(REPO_ROOT, versioned));
    if (rel.length >= MAX_PATH) s.die(`ruta de ${rel.length} caracteres (máximo ${MAX_PATH - 1}): ${rel}`);
    return path;
  };
  // Solo se escribe si extract.mjs sale bien: con la identidad de git de la máquina sale con 3.
  // La marca LEAK hace salir al sujeto con error en la limpieza.
  const saveExtract = (dest, result) => {
    if (result.code === 0) {
      fs.write(dest, result.stdout);
      return true;
    }
    fs.write(s.LEAK, '');
    deps.err(`[${s.LABEL}] no se guarda ${basename(dest)}: el stream sigue en ${s.JSONL}`);
    return false;
  };
  const flatCopy = (name) => {
    if (!/[\\/]/.test(name)) return true;
    deps.err(`[${s.LABEL}] ${name}: solo copia plana, sin carpetas (<etiqueta>/walkthrough-task-<id>.md)`);
    return false;
  };
  s.save = (state) => {
    const [statePath, tools, texts] = ['state', 'tools', 'texts'].map((kind) => outPath(join(s.OUT, `${s.LABEL}.${kind}.txt`)));
    // Los tres aunque falle uno: sin tools.txt, run.mjs no cuenta el coste del sujeto.
    const saved = [
      saveExtract(statePath, clean(state)),
      saveExtract(tools, extract(['tools', s.JSONL, s.RUN])),
      saveExtract(texts, extract(['texts', s.JSONL, s.RUN])),
    ];
    if (saved.every(Boolean)) deps.out(`[${s.LABEL}] listo`);
  };
  // Un fichero del molde, plano: la ruta completa de .docs/ pasó de 140 caracteres.
  s.keep = (path, name) => {
    if (!flatCopy(name)) return false;
    if (!fs.exists(path)) {
      deps.err(`[${s.LABEL}] sin ${path}`);
      return false;
    }
    const dest = outPath(join(s.OUT, s.LABEL, name));
    return saveExtract(dest, clean(fs.read(path)));
  };
  s.show = (revPath, name) => {
    if (!flatCopy(name)) return false;
    const dump = deps.run('git', ['-C', s.R, 'show', revPath], { env: s.env });
    if (dump.code !== 0) {
      deps.err(`[${s.LABEL}] sin ${revPath}`);
      return false;
    }
    const file = join(s.RUN, `${name}.show`);
    fs.write(file, dump.stdout);
    return s.keep(file, name);
  };
}

// El molde y la carpeta que Claude Code crea para su cwd pesan; el stream y las salidas ya están guardados.
function addCleanup(s, deps) {
  const { fs } = deps;
  let done = false;
  s.cleanup = () => {
    if (done) return 0;
    done = true;
    s.stopPorts();
    const seed = s.seedDir();
    if (fs.list(seed).some((name) => /^seed-\d+\.jsonl$/.test(name))) fs.remove(seed);
    const base = s.env.CLAUDE_CODE_TMPDIR || s.env.TEMP || tmpdir();
    fs.remove(join(base, 'claude', moldSlug(s.R)));
    if (s.env.KEEP_MOLD !== '1') fs.remove(s.RUN);
    // Una salida con la identidad de la máquina no se guardó: el sujeto sale con error.
    return fs.exists(s.LEAK) ? 1 : 0;
  };
  deps.onExit(s.cleanup);
}


const lines = (values) => `${values.join('\n')}\n`;
const words = (value) => (value ? value.split(/\s+/).filter(Boolean) : []);

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

function addLaunch(s, deps) {
  const { fs } = deps;
  const errFile = join(s.RUNS, `${s.LABEL}.err`);
  const dry = () => s.env.DRY_RUN === '1';
  // El tope mata el árbol de claude: con el tope solo al proceso, sus hijos seguían vivos.
  const runClaude = async (args, { stdout = s.JSONL, append = false } = {}) => {
    const bin = s.env.CLAUDE_BIN || deps.whichClaude();
    if (!bin) s.die('no encuentro claude en el PATH');
    const [command, finalArgs] = bin.endsWith('.mjs') ? [s.NODE, [bin, ...args]] : [bin, args];
    const child = deps.spawnClaude(command, finalArgs, { cwd: s.R, env: claudeEnv(s.env), stdout, stderr: errFile, append });
    const seconds = Number(s.env.SUBJECT_TIMEOUT || DEFAULT_TIMEOUT_SECONDS);
    let timedOut = false;
    const cancel = seconds > 0
      ? deps.startTimer(seconds * 1000, () => {
        timedOut = true;
        deps.kill(child.pid, true);
      })
      : () => {};
    const code = await child.exited;
    cancel();
    if (!timedOut) return code;
    deps.err(`[${s.LABEL}] tope de ${seconds} s: sujeto cortado`);
    return 124;
  };
  s.launch = async (ask) => {
    // Una petición ejecutada fuera del molde corrió una vez sobre el worktree del kit.
    if (!isInside(s.R, s.RUNS)) s.die(`cwd fuera del scratchpad: ${s.R}`);
    const settings = s.env.SETTINGS || defaultSettings();
    // Sin esa clave, el sujeto carga también el kit instalado, y mide la caché en vez de la copia.
    if (!settings.includes('"sdd-kit@sdd-kit":false')) s.die(`SETTINGS sin deshabilitar el kit instalado: ${settings}`);
    // Un sujeto que para node.exe por nombre tumba los MCP de las sesiones de la máquina.
    if (!settings.includes('deny-kill.mjs')) s.die('SETTINGS sin el hook deny-kill.mjs: añade $DENY_KILL_HOOK a sus PreToolUse');
    s.claudeArgs = claudeArgs(s, settings);
    fs.write(join(s.RUNS, `${s.LABEL}.args`), lines([...s.claudeArgs, ask]));
    if (dry()) {
      fs.write(s.JSONL, dryStream(s));
    } else {
      fs.write(errFile, '');
      const code = await runClaude([...s.claudeArgs, ask]);
      if (code !== 0) return code;
    }
    if (s.env.TURN2) await s.resume(s.env.TURN2);
    return 0;
  };
  // Segundo turno sobre la sesión real del primero: su molde es lo que el primero dejó, no el relato de un ticket.
  // --resume da un total_cost_usd acumulado; run.mjs ya cuenta solo el último RESULTADO.
  s.resume = async (message) => {
    const session = /"session_id":"([^"]*)"/.exec(fs.exists(s.JSONL) ? fs.read(s.JSONL) : '')?.[1];
    if (!session) s.die('sin session_id: no se puede reanudar');
    const args = [...s.claudeArgs, '--resume', session, message];
    fs.write(join(s.RUNS, `${s.LABEL}.resume.args`), lines(args));
    if (!dry()) return runClaude(args, { append: true });
    const result = { type: 'result', num_turns: 2, total_cost_usd: Number(s.env.DRY_COST ?? 0.5) * 2, result: s.env.DRY_RESULT || 'hecho' };
    fs.write(s.JSONL, fs.read(s.JSONL) + lines([JSON.stringify(result)]));
    return 0;
  };
  // Devuelve la respuesta y deja el coste de la llamada en costFile.
  const personaReply = async (sheet, asked, costFile) => {
    if (dry()) {
      fs.write(costFile, s.env.DRY_PERSONA_COST || '0');
      return 'Respuesta de la persona.';
    }
    const prompt = `Eres el usuario de esta hoja: ${fs.read(sheet).trimEnd()}. Contesta en castellano solo lo que el agente pregunta, en una o dos frases; lo que la hoja no dice, «no sé». El agente dice: ${asked}`;
    const replyFile = costFile.replace(/\.txt$/, '.json');
    const code = await runClaude(['-p', '--model', 'haiku', '--setting-sources', '', '--output-format', 'json', '--max-turns', '1', prompt], { stdout: replyFile });
    if (code !== 0) return undefined;
    const reply = JSON.parse(fs.read(replyFile));
    fs.write(costFile, String(reply.total_cost_usd ?? 0));
    return reply.result ?? '';
  };
  // Conversación con una persona: un modelo barato contesta con su hoja hasta que el sujeto deja de preguntar o llega al tope.
  // Su coste va al último RESULTADO, que es el único que cuenta run.mjs.
  s.converse = async (sheet, max) => {
    let turn = 0;
    let personaCost = 0;
    while (turn < max) {
      const asked = deps.run(s.NODE, [EXTRACT, 'last', s.JSONL], { env: s.env }).stdout;
      if (!asked.includes('?')) break;
      turn++;
      const costFile = join(s.RUNS, `${s.LABEL}.persona-${turn}.txt`);
      const answer = await personaReply(sheet, asked, costFile);
      if (answer === undefined) return 1;
      personaCost += Number(fs.read(costFile));
      await s.resume(answer);
    }
    if (turn > 0) appendPersonaCost(s, fs, personaCost, turn);
    return 0;
  };
}

function appendPersonaCost(s, fs, personaCost, turns) {
  const stream = fs.read(s.JSONL);
  const subjectCost = Number([...stream.matchAll(/"total_cost_usd":([0-9.]+)/g)].at(-1)?.[1] ?? 0);
  const result = { type: 'result', num_turns: turns, total_cost_usd: subjectCost + personaCost, result: `conversación con persona: ${turns} respuestas` };
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

// Por el PID que escucha en el puerto y no estaba en la foto del arranque, nunca por nombre: en la máquina corren
// los servidores y los MCP de otras sesiones, y el stream nombra puertos que el sujeto solo leyó.
function addPorts(s, deps) {
  const { fs } = deps;
  const readOr = (path) => (fs.exists(path) ? fs.read(path) : '');
  const tryNetstat = () => {
    try {
      return deps.netstat();
    } catch {
      return undefined;
    }
  };
  s.snapshot = tryNetstat();
  s.ports = () => streamPorts(readOr(s.JSONL), s.env.PORT).join(',');
  // RUNS es <RUNS_DIR>/<fase>: las marcas de live/ y los streams de los demás sujetos cuelgan de su padre.
  const otherSubjectPorts = () => {
    const root = dirname(s.RUNS);
    const ports = new Set();
    for (const live of [join(root, 'live'), join(root, 'dry', 'live')]) {
      for (const name of fs.list(live).filter((mark) => !mark.startsWith('.') && mark.includes('.'))) {
        if (name === `${s.env.PHASE || 'red'}.${s.LABEL}`) continue;
        // Un PID vacío es una marca a medio escribir: en curso, como en countMarks de campaign.mjs.
        const pid = readOr(join(live, name)).split(/\r?\n/)[0].trim();
        if (pid && !deps.isAlive(Number(pid))) continue;
        const dot = name.indexOf('.');
        streamPorts(readOr(join(root, name.slice(0, dot), `${name.slice(dot + 1)}.jsonl`))).forEach((port) => ports.add(port));
      }
    }
    return ports;
  };
  const stopNew = (ports, before) => {
    const now = s.snapshot === undefined ? undefined : tryNetstat();
    if (now === undefined) return 'no comprobado (netstat no respondió)';
    const stopped = ports.filter((port) => {
      const mine = listeningPids(now, port).filter((pid) => !before.get(port).includes(pid));
      mine.forEach((pid) => deps.kill(pid, false));
      return mine.length > 0;
    });
    return stopped.join(',') || 'ninguno';
  };
  // Un puerto que nombra otro sujeto en curso lo para el último en acabar, con la foto del primero que lo saltó en ports/:
  // el primero paraba el servidor del otro, y el último no veía uno arrancado antes que él.
  // shortcut: dos sujetos que acaban a la vez se ven en curso y ninguno para el puerto; un lock por puerto si pasa.
  s.stopPorts = () => {
    const own = streamPorts(readOr(s.JSONL), s.env.PORT);
    if (own.length === 0) return;
    const others = otherSubjectPorts();
    const handoffDir = join(dirname(s.RUNS), 'ports');
    const toStop = [];
    const shared = [];
    const before = new Map();
    for (const port of own) {
      const handoff = join(handoffDir, String(port));
      const pids = fs.exists(handoff) ? JSON.parse(fs.read(handoff)) : listeningPids(s.snapshot ?? '', port);
      if (others.has(port)) {
        shared.push(port);
        fs.write(handoff, JSON.stringify(pids));
      } else {
        toStop.push(port);
        before.set(port, pids);
        fs.remove(handoff);
      }
    }
    const listening = toStop.length === 0 ? 'sin consultar' : stopNew(toStop, before);
    const sharedNote = shared.length ? ` · compartidos con otro sujeto en curso, sin parar: ${shared.join(',')}` : '';
    const errFile = join(s.RUNS, `${s.LABEL}.err`);
    fs.write(errFile, readOr(errFile) + lines([`puertos del sujeto: ${own.join(',')} · escuchando al acabar: ${listening}${sharedNote}`]));
  };
}
