// Biblioteca de referencia para el subject.mjs de una campaña de sujetos headless: se importa, no se copia.
//   import { initSubject } from '<repo>/tests/headless/lib.mjs';
//   const s = initSubject(process.argv.slice(2), '<skill medida>');  // kit, etiqueta, escenario, salida (argumentos de run.mjs)
//   ...molde en s.R con s.put, s.git y s.commit...
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
// SUBJECT_TIMEOUT (segundos de reloj por sujeto; 0, el valor por omisión, sin tope), CLAUDE_BIN (otro claude; un .mjs se lanza con node),
// TURN2 (mensaje del segundo turno: launch reanuda la sesión con resume),
// DRY_RESULT (texto del result en seco; con «?», converse sigue preguntando), DRY_PERSONA_COST (coste de la persona en seco),
// DRY_RUN=1 (un stream falso en lugar de claude -p, con coste DRY_COST: 0.5),
// KEEP_MOLD=1 (al salir no se borra el molde del sujeto; su carpeta de Claude Code en CLAUDE_CODE_TMPDIR o TEMP, siempre).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HEADLESS = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HEADLESS, '..', '..');
const EXTRACT = join(HEADLESS, 'extract.mjs');
// La salida versionada de una campaña no pasa de 140 caracteres de ruta relativa (cli/test/kit/path-length.test.ts).
const MAX_PATH = 140;

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

export function realSubjectDeps() {
  return {
    fs: nodeFs,
    run: runSync,
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
  s.kitVersion = () => kitVersion(s.KIT, deps.fs);
  // Un marcador copiado de otra campaña envejece: con uno menor que la última migración, el hook manda a migrar.
  s.putKitMarker = (fields) => s.put(join('.docs', 'sdd', 'sdd-kit.json'), `{"version": "${s.kitVersion()}", ${fields}}\n`);
  s.seedDir = () => join(s.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'), 'projects', moldSlug(s.R));
  s.seedTranscript = (branch, lines) => seedTranscript(s, deps.fs, branch, lines);
}

// La versión que el hook exige al proyecto: la mayor entre plugin.json y la última migración del kit.
function kitVersion(kit, fs) {
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
    s.stopPorts?.();
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

