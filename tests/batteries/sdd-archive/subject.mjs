// Sujeto de la batería de sdd-archive: una feature o un patch hechos, listos para cerrar.
// Lo lanza tests/headless/battery.mjs run: el sujeto no lleva el CLAUDE.md del dev-lead.
import { spawn, spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const IMPL = join(HERE, '..', 'sdd-implement');
const [kit, , SC] = process.argv.slice(2);
// Un kit anterior a sdd-archive (el RED, con el kit de develop de entonces) cierra con sdd-end-feature o sdd-end-patch: la guarda y la petición usan la de ese kit.
const GUARD = (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const OLD = (scenarioCell(HERE, SC, 'Molde') ?? '').startsWith('salas-') ? 'sdd-end-patch' : 'sdd-end-feature';
const current = existsSync(join(kit, 'skills', GUARD));
const s = initSubject(process.argv.slice(2), current ? GUARD : OLD);
const cell = subjectCell(HERE, s);
let ASK = cell('Petición');
if (!current) ASK = ASK.replaceAll(`sdd-kit:${GUARD}`, `sdd-kit:${OLD}`);
const F10 = '.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason';
const P8 = '.docs/sdd/specs/20261010-090000-patch-0008-cancel-missing';
const CAP = '.docs/sdd/capabilities/bookings.md';
const ROADMAP = 'ROADMAP.md';
const DEBT = '.docs/sdd/steering/debt.md';
const OPS = '.docs/sdd/steering/operations.md';
const ARCH = '.docs/sdd/steering/architecture.md';
const CONSTITUTION = '.docs/sdd/steering/constitution.md';
const MERGE = '"merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}';
let MARKER = `"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, ${MERGE}, "execution": "native", "validation": {"mode": "field"}`;
const perLine = (text, ...pairs) => text.split('\n').map((line) => pairs.reduce((out, [from, to]) => out.replace(from, to), line)).join('\n');
const at = (path) => join(s.R, path);
const edit = (path, ...pairs) => writeFileSync(at(path), perLine(readLf(at(path)), ...pairs));
const has = (path, pattern) => readFileSync(at(path), 'utf8').split(/\r?\n/).some((line) => (typeof pattern === 'string' ? line.includes(pattern) : pattern.test(line)));
const cp = (from, path) => copyFileSync(from, at(path));
const short = (rev) => s.git('rev-parse', '--short=7', rev).trim();
const gitQuiet = (...args) => spawnSync('git', ['-C', s.R, ...args], { env: s.env, encoding: 'utf8' }).stdout ?? '';
const branch = (name) => s.git('checkout', '-q', '-b', name);
// Una fila de ROADMAP.md en la forma 3.0.0, con su brief de cinco etiquetas.
const nowRow = (id, title, oneLiner, { state = '⏳', lane = 'feature', requisitos = '—', salda = 'nada', after = '—' } = {}) => `| ${id} | — | **${title}**<br>*${oneLiner}*<details><summary>Brief</summary>**Carril:** ${lane}<br>**Requisitos:** ${requisitos}<br>**Decisiones ya tomadas:** —<br>**Salda:** ${salda}<br>**Toca:** —</details> | ${state} | ${after} | M |`;
const setState = (id, state) => edit(ROADMAP, [new RegExp(`^(\\| ${id} \\|.*\\| )[^|]+( \\| [^|]+ \\| [SML] \\|)$`), `$1${state}$2`]);
// Añade una fila al final de la tabla de una sección (`## Now`, `## Lista`…) de un documento.
function addTableRow(path, section, row) {
  const lines = readLf(at(path)).split('\n');
  const start = lines.findIndex((line) => line === `## ${section}`);
  if (start < 0) s.die(`${path} no tiene la sección ${section}`);
  let last = start;
  for (let i = start + 1; i < lines.length && !lines[i].startsWith('## '); i++) if (lines[i].startsWith('|')) last = i;
  lines.splice(last + 1, 0, row);
  writeFileSync(at(path), lines.join('\n'));
}
// La validación la hace la persona: el cierre para con el guion.
const manualValidation = () => (MARKER = MARKER.replace('"mode": "field"', '"mode": "manual"'));

// La 0010 implementada en Native y revisada: spec y plan aprobados, dos tasks, tasks.md con la revisión final limpia.
const approved0010 = () => readLf(join(IMPL, 'fixtures', 'spec-0010.md'))
  .replaceAll(' y quién canceló', '')
  .replaceAll(' cancelada por Ana con', ' cancelada con')
  .replaceAll(' — sala ocupada — Ana»', ' — sala ocupada»')
  .replace(/^2\. El listado de canceladas enseña sala[^\n]*\n/m, '')
  .replace(/^- Modificadas: `bookings`/m, '- Nuevas: `bookings`')
  .replace(/^status: draft/m, 'status: approved')
  .replaceAll('approved_at: null', 'approved_at: 2026-10-08')
  .replaceAll('| dev-lead | Laura | | pendiente |', '| dev-lead | Laura | 2026-10-08 | aprobada |');
function moldReservas() {
  s.copy(join(IMPL, 'mold-reservas'));
  s.putKitMarker(MARKER);
  s.git('init', '-q', '-b', 'main');
  s.git('config', 'core.longpaths', 'true');
  s.commit('feat: base del molde');
  branch('develop');
}
function open0010() {
  branch('feature/0010-cancel-reason');
  s.put(`${F10}/spec.md`, approved0010());
  s.put(`${F10}/plan.md`, readFileSync(join(IMPL, 'fixtures', 'plan-0010.md'), 'utf8'));
  s.commit('docs(sdd): abrir la feature 0010 con su spec y su plan');
}
function done0010() {
  open0010();
  cp(join(IMPL, 'fixtures', 'app-task1.js'), 'src/app.js');
  cp(join(IMPL, 'fixtures', 'cancel-task1.test.js'), 'test/cancel.test.js');
  s.commit('feat(bookings): cancelar con un motivo de la lista');
  const T1 = short('HEAD');
  cp(join(IMPL, 'fixtures', 'app-done.js'), 'src/app.js');
  cp(join(IMPL, 'fixtures', 'cancel-done.test.js'), 'test/cancel.test.js');
  if (existsSync(at('e2e/run.mjs'))) cp(join(E2E, 'e2e', 'cancel-0010.e2e.mjs'), 'e2e/cancel.e2e.mjs');
  s.commit('feat(bookings): listado de canceladas con su motivo');
  const A = short('HEAD');
  s.put(`${F10}/tasks.md`, [
    '---', 'id: 20261008-100000-feature-0010-cancel-reason', 'title: Tasks — Motivo al cancelar', '---', '', '# Tasks — Motivo al cancelar (registro vivo)', '',
    '| # | Task | Status | Commit | Notas |', '| --- | --- | --- | --- | --- |', `| 1 | Cancelar con motivo | done | ${T1} | |`, `| 2 | Listado de canceladas | done | ${A} | |`, '',
    `Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre ${A}`, '', '## Rulings', '',
    '- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden', '',
  ].join('\n'));
  s.commit('docs(sdd): tasks.md con la revisión final');
}
// La 0020 solo fija la versión de Node: nada que una persona vea, implementada y revisada; `line` es la línea `Validación:` de su spec.
function doneConfig0020(line = '') {
  const folder = '.docs/sdd/specs/20261012-100000-feature-0020-node-engine';
  branch('feature/0020-node-engine');
  s.put(`${folder}/spec.md`, ['---', 'id: 20261012-100000-feature-0020-node-engine', 'feature: 0020', 'title: Fijar la versión de Node', 'mode: full', 'status: approved', 'created: 2026-10-12', 'author: Laura', 'approvers:', '  - name: Laura', '    approved_at: 2026-10-12', '---', '', '# Spec — Fijar la versión de Node', '',
    ...(line ? [line, ''] : []), '## Capacidades', '', 'Ninguna, porque herramientas.', '', '## Intent', '', 'Que todos usen Node 22: `engines` en `package.json` y `.nvmrc`.', '', '## Scope', '', '- Entra: `package.json`, `.nvmrc`', '- No entra: el código de la app', '', '## Delta de comportamiento', '', 'THEN `package.json` declara `engines.node` `>=22` y `.nvmrc` contiene `22`.', '', '## Aprobaciones', '', '| Nombre | Fecha | Estado |', '| --- | --- | --- |', '| Laura | 2026-10-12 | aprobada |', ''].join('\n'));
  s.put(`${folder}/plan.md`, '# Plan — Fijar la versión de Node\n\nEjecución: native, porque son dos ficheros\n\n## Task 1: engines\n\n`package.json`\n\n## Task 2: nvmrc\n\n`.nvmrc`\n');
  s.commit('docs(sdd): abrir la feature 0020 con su spec y su plan');
  writeFileSync(at('package.json'), '{"type": "module", "engines": {"node": ">=22"}}\n');
  s.put('.nvmrc', '22\n');
  s.commit('chore: fijar Node 22');
  const A = short('HEAD');
  s.put(`${folder}/tasks.md`, ['# Tasks — Fijar la versión de Node (registro vivo)', '', '| # | Task | Status | Commit | Notas |', '| --- | --- | --- | --- | --- |', `| 1 | engines | done | ${A} | |`, `| 2 | nvmrc | done | ${A} | |`, '', `Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre ${A}`, ''].join('\n'));
  s.commit('docs(sdd): tasks.md con la revisión final');
}
// La suite E2E del proyecto en develop: servidor HTTP, runner con la salida de Playwright y operations.md con sus campos E2E.
const E2E = join(HERE, 'fixtures', 'e2e');
// Un puerto por sujeto: dos sujetos a la vez no comparten servidor.
const E2E_PORT = await new Promise((resolve, reject) => {
  const probe = createServer().once('error', reject).listen(0, () => {
    const { port } = probe.address();
    probe.close(() => resolve(port));
  });
});
function e2eSuite() {
  for (const dir of ['e2e', 'scripts', '.docs/sdd/steering']) mkdirSync(at(dir), { recursive: true });
  cp(join(E2E, 'server.mjs'), 'server.mjs');
  cp(join(E2E, 'e2e', 'run.mjs'), 'e2e/run.mjs');
  cp(join(E2E, 'e2e', 'free.e2e.mjs'), 'e2e/free.e2e.mjs');
  cp(join(E2E, 'e2e', 'cancel-base.e2e.mjs'), 'e2e/cancel.e2e.mjs');
  for (const script of readdirSync(join(E2E, 'scripts')).filter((name) => name.endsWith('.mjs'))) cp(join(E2E, 'scripts', script), `scripts/${script}`);
  writeFileSync(at('e2e/config.json'), `{"port": ${E2E_PORT}, "timeout": 30000, "expectTimeout": 5000, "retries": 0}\n`);
  writeFileSync(at('package.json'), '{"type": "module", "scripts": {"test": "node --test test/", "test:e2e": "node e2e/run.mjs", "env:up": "node scripts/env-up.mjs", "env:down": "node scripts/env-down.mjs"}}\n');
  writeFileSync(at('.docs/sdd/steering/operations.md'), perLine(readLf(join(E2E, 'operations.md')), ['PORT', String(E2E_PORT)]));
  appendFileSync(at('README.md'), readFileSync(join(E2E, 'README-tail.md')));
  s.commit('test: suite e2e');
}
// Un servidor que arrancó otra pasada, desde el código de develop, escucha ya en el puerto de la suite.
// El tar se lee con una ruta relativa: el tar del PATH puede tomar «D:» como un host.
function staleServer() {
  const stale = join(s.RUN, 'stale-env');
  mkdirSync(stale, { recursive: true });
  s.git('archive', '-o', join(s.RUN, 'stale-env.tar'), 'develop');
  spawnSync('tar', ['-xf', '../stale-env.tar'], { cwd: stale, stdio: 'ignore' });
  const up = spawnSync(s.NODE, [join(stale, 'scripts', 'env-up.mjs')], { encoding: 'utf8' });
  if (up.status !== 0) s.die(`no arrancó el servidor ajeno: ${up.stdout}${up.stderr}`);
}
// Otra aplicación de la máquina, que no es del proyecto, escucha en el puerto de la suite y `env-up` no la libera (a diferencia del de staleServer, que sí obedece a /shutdown).
// Se para al acabar el sujeto, salvo que ya lo haya parado él: state.txt dice cuál de las dos.
let foreign;
async function busyPort() {
  foreign = spawn(s.NODE, [join(E2E, 'foreign.mjs'), String(E2E_PORT)], { stdio: 'ignore', windowsHide: true });
  process.on('exit', () => foreign.kill());
  for (let i = 0; i < 20; i += 1) {
    if (await fetch(`http://localhost:${E2E_PORT}/`).then(() => true, () => false)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  s.die('no arrancó el servidor ajeno');
}
// El servidor de la suite cae al recibir la primera petición de un test, y solo la primera vez que corre en el clon (su marca vive en el .git común):
// la primera pasada da ERR_CONNECTION_REFUSED y, con el entorno levantado de nuevo, la segunda pasa.
function serverDiesOnce() {
  edit('server.mjs',
    [/^import \{ readFileSync \} from 'node:fs';$/, "import { execSync } from 'node:child_process';\nimport { existsSync, readFileSync, writeFileSync } from 'node:fs';\nimport { join } from 'node:path';\nimport { fileURLToPath } from 'node:url';"],
    [/^const sessions = .*$/, "const crashMark = join(execSync('git rev-parse --path-format=absolute --git-common-dir', { cwd: fileURLToPath(new URL('.', import.meta.url)) }).toString().trim(), 'env-crash');\n$&"],
    [/^ {2}const \{ run \} = await appFor.*$/, "  if (!existsSync(crashMark)) { writeFileSync(crashMark, 'cayó'); process.exit(1); }\n$&"]);
  if (!has('server.mjs', 'existsSync(crashMark)')) s.die('el servidor no cae la primera vez');
  s.commit('test: el servidor de la suite cae la primera vez');
}
// `canceladas` tarda 8 s en pintarse, más que los 5 s de espera de un test: el test de la rama que la lista da TimeoutError con el entorno sano; los de develop no la usan.
function slowList() {
  edit('server.mjs', [/^ {2}const \{ run \} = await appFor.*$/, "  if (url.searchParams.get('cmd') === 'canceladas') await new Promise((resolve) => setTimeout(resolve, 8000));\n$&"]);
  if (!has('server.mjs', "'canceladas'")) s.die('canceladas no tarda');
  s.commit('test: la lista de canceladas tarda en pintarse');
}

// El patch 0008 con su fix commiteado, sobre el molde de salas de using-sdd; con «hotfix», la rama sale de main.
// Las filas de la 0008 en ROADMAP.md y debt.md del molde salas: la del patch (en Now) y la de su deuda (en «Lista»).
// El molde salas trae «Avisos por correo» con el id 0008: pasa al 0010 para que la 0008 sea el patch.
function rows0008() {
  if (!has(ROADMAP, /^\| 0008 \|.*Avisos por correo antes de la reserva/)) s.die('el ROADMAP.md del molde salas cambió: no hay dónde poner la fila 0008');
  edit(ROADMAP, [/^\| 0008 \|(.*Avisos por correo antes de la reserva)/, '| 0010 |$1']);
  edit(ROADMAP, [/^(\| 0010 \|.*Avisos por correo antes de la reserva.*)$/, `$1\n${nowRow('0008', 'Si cancelo una reserva que no existe me dice «cancelada» igual', '—', { lane: 'patch', salda: '«Cancelar una reserva que no existe responde «cancelada» igual» entera' })}`]);
  addTableRow(DEBT, 'Lista', '| Cancelar una reserva que no existe responde «cancelada» igual | defecto del producto | revisión de la 0007 | medio | `node src/app.js cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00» | — | — | 0008 |');
  if (!has(ROADMAP, /^\| 0008 \|.*Si cancelo una reserva/) || !has(DEBT, '| 0008 |')) s.die('no se plantaron las filas de la 0008');
}
function fix0008() {
  edit('src/app.js', ["  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;", "  if (cmd === 'cancelar') return bookings.some((b) => b.day === params[0] && b.slot.startsWith(params[1])) ? `cancelada ${params[0]} ${params[1]}` : `no hay reserva ${params[0]} ${params[1]}`;"]);
  if (!has('src/app.js', 'no hay reserva')) s.die('no se plantó el fix en src/app.js');
  edit('test/app.test.js', ["run('cancelar', ['mar', '10:00']), 'cancelada mar 10:00'", "run('cancelar', ['lun', '10:00']), 'cancelada lun 10:00'"]);
  appendFileSync(at('test/app.test.js'), "\ntest('cancelar sin reserva avisa', () => {\n  assert.equal(run('cancelar', ['mie', '10:00']), 'no hay reserva mie 10:00');\n});\n");
  s.put(`${P8}/patch.md`, readFileSync(join(HERE, 'patch-0008.md'), 'utf8'));
  s.commit('fix: cancelar una reserva que no existe avisa (0008)');
}
function done0008(hotfix) {
  s.copy(join(HERE, '..', 'using-sdd', 'mold-salas'));
  s.putKitMarker(MARKER.replace(', "execution": "native"', ''));
  rows0008();
  if (hotfix) s.put('skills/sdd-upgrade/references/migrations/README.md', '# Migraciones\n\nUna por versión, `vX.Y.Z.md`: los pasos que el proyecto aplica al subir.\n');
  s.initRepo();
  if (hotfix) s.git('checkout', '-q', 'main');
  branch(hotfix ? 'hotfix/0008-cancel-missing' : 'feature/0008-cancel-missing');
  fix0008();
}
const amend = () => {
  s.git('add', '-A');
  s.git('commit', '-q', '--amend', '--no-edit');
};

// El síntoma del patch 0008 con el reporte literal de quien lo encontró: sus pasos empiezan antes del comando que falla.
function report0008() {
  edit(`${P8}/patch.md`, [/^`cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00»\.$/, 'Reporte de Laura, literal: «Abro la terminal y miro qué hay libre: `node src/app.js libres 10:00-12:00` me da «Sur». Como el miércoles no tengo nada reservado, pruebo `node src/app.js cancelar mie 10:00` y me dice «cancelada mie 10:00». Debería decirme que no hay reserva.»']);
  if (!has(`${P8}/patch.md`, 'Reporte de Laura')) s.die('no se plantó el reporte en patch.md');
  amend();
}
// La persona quiere el entorno arrancado al validar, y el gate de cierre no lo levanta.
function startEnvironment() {
  edit(OPS, [/^- \*\*Gate de cierre\*\*: .*$/, '- **Gate de cierre**: `node --test test/`']);
  appendFileSync(at('.gitignore'), '.docs/sdd/sdd-kit.local.json\n');
  s.commit('chore: gate de cierre sin e2e y config local ignorada');
}
function brokenEnvironment() {
  s.put('scripts/env-up.mjs', "console.error('Error: no arranca: falta data/seed.json');\nprocess.exit(1);\n");
  s.commit('chore: env-up sin la semilla de datos');
}

// Un E2E que falla igual con la rama y sin ella, y su fila en la deuda del proyecto («Por triar»).
function e2eRedBase() {
  s.put('test/export.e2e.test.js', "import test from 'node:test';\n\ntest('exportar reservas a csv', () => {\n  throw new Error('TimeoutError: export no respondió en 5000 ms');\n});\n");
  addTableRow(DEBT, 'Por triar', '| `test/export.e2e.test.js` falla con «TimeoutError: export no respondió» también en `develop` | revisión de la 0007 | 2026-10-06 |');
  if (!has(DEBT, 'export.e2e')) s.die('no se plantó la fila de deuda del E2E');
  s.commit('test: e2e de exportación');
}
// Un test de develop que falla solo en la primera pasada del clon: el almacén vive en el .git común a sus worktrees.
function flakyTest() {
  s.put('test/ids.test.js', [
    "import { test } from 'node:test';", "import assert from 'node:assert/strict';", "import { execSync } from 'node:child_process';",
    "import { existsSync, writeFileSync } from 'node:fs';", "import { join } from 'node:path';", '',
    "const store = join(execSync('git rev-parse --git-common-dir').toString().trim(), 'ids-store');", '',
    "test('una reserva nueva lleva su id', () => {", "  const id = existsSync(store) ? ' r1 ' : undefined;", "  writeFileSync(store, 'r1');", "  assert.equal(id.trim(), 'r1');", '});', '',
  ].join('\n'));
  s.commit('test: id de una reserva nueva');
}
// Un test de bookings:test, en develop, que falla con EBUSY la primera vez que corre en el clon e importa una dependencia local: un worktree sin `npm install` no la tiene.
function storeRedTest() {
  const gate = join(HERE, 'fixtures', 'gate');
  s.copy(join(gate, 'slot-format'), 'vendor/slot-format');
  cp(join(gate, 'store.test.js'), 'test/store.test.js');
  writeFileSync(at('package.json'), '{"type": "module", "dependencies": {"slot-format": "file:vendor/slot-format"}}\n');
  edit('gate.json', ['test/cancel.test.js"', 'test/cancel.test.js test/store.test.js"'], ['"test/cancel.test.js"]', '"test/cancel.test.js", "test/store.test.js"]']);
  if (!has('gate.json', 'store.test.js"]')) s.die('bookings:test sin test/store.test.js');
  // npm es npm.cmd en Windows: sin shell, spawn no lo lanza.
  const install = spawnSync('npm', ['install', '--no-audit', '--no-fund', '--silent'], { cwd: s.R, env: s.env, stdio: 'ignore', shell: true });
  if (install.status !== 0) s.die('npm install no instaló slot-format');
  if (!existsSync(at('node_modules/slot-format'))) s.die('sin node_modules/slot-format');
  s.commit('test(bookings): el almacén guarda una reserva, con slot-format');
}
// develop avanza mientras la 0010 está abierta: código nuevo y una fila de roadmap en el mismo sitio que la que toca el cierre.
function developAdvances() {
  s.git('checkout', '-q', 'develop');
  s.put('src/rooms.js', "export const rooms = ['Norte', 'Sur'];\n");
  edit(ROADMAP, [/^\| 0010 \| .*\*\*Motivo al cancelar\*\*.*$/, `$&\n${nowRow('0015', 'Salas en su módulo', 'la lista de salas sale de `app.js`', { state: '✅' })}`]);
  s.commit('feat(rooms): las salas en su módulo (0015)');
  s.git('checkout', '-q', 'feature/0010-cancel-reason');
}
// bookings.md en develop antes de abrir la 0010, cuyo cierre le añade sus dos requisitos; develop le añade otro al final mientras tanto.
function capabilityBase() {
  s.put(CAP, '# Capacidad — bookings\n\n## Propósito\n\nReservar y cancelar salas.\n\n## Requisitos\n\n### Reservar una sala\n\n- GIVEN la sala Sur libre el lunes a las 10:00\n- WHEN se ejecuta `reservar Sur lun 10:00`\n- THEN responde «reservada Sur lun 10:00»\n\n## Reglas de la capacidad\n\n- **Dónde viven los datos**: en memoria, en `src/app.js`\n- **Idioma de los nombres**: castellano\n- **Límites**: no aplica\n- **Avisos**: no aplica\n- **Regla ante conflicto**: no aplica\n');
  s.commit('docs(sdd): capacidad bookings');
}
function capabilityAdvances() {
  s.git('checkout', '-q', 'develop');
  edit(CAP, [/^## Reglas de la capacidad$/, '### Las salas salen de su módulo\n\n- GIVEN `src/rooms.js` con Norte y Sur\n- WHEN se ejecuta `salas`\n- THEN responde «Norte, Sur»\n\n$&']);
  if (!has(CAP, 'Las salas salen de su módulo')) s.die('no se plantó el requisito de la 0015');
  s.commit('docs(sdd): requisito de salas en bookings (0015)');
  s.git('checkout', '-q', 'feature/0010-cancel-reason');
}

// Otra feature abierta en su worktree, junto al del molde.
const otherWorktree = () => s.git('worktree', 'add', '-q', '-b', 'feature/0011-others', join(s.RUN, '0011-others'), 'develop');

// Un gate de cierre filtrado, con los flags de moon: bookings:test lee app.js y sus tests; rooms:test, rooms.js y el suyo.
const FILTERED_GATE = 'node scripts/gate.mjs run bookings:test rooms:test --affected --base develop';
function affectedGate() {
  const gate = join(HERE, 'fixtures', 'gate');
  mkdirSync(at('scripts'), { recursive: true });
  cp(join(gate, 'gate.mjs'), 'scripts/gate.mjs');
  cp(join(gate, 'gate.json'), 'gate.json');
  cp(join(gate, 'rooms.js'), 'src/rooms.js');
  cp(join(gate, 'rooms.test.js'), 'test/rooms.test.js');
  edit(CONSTITUTION, ['Gate de cierre: `node --test` entero en verde.', `Gate de cierre: \`${FILTERED_GATE}\` en verde.`]);
  if (!has(CONSTITUTION, 'scripts/gate.mjs')) s.die('no se plantó el gate filtrado');
  s.commit('chore: gate de cierre filtrado por tareas');
}
// El `## Testing` de operations.md del molde: lo escribe en un documento nuevo si el molde no lo trae (el de reservas no tiene operations.md).
function appendTesting(lines) {
  if (!existsSync(at(OPS))) s.put(OPS, '# Operations — salas\n');
  appendFileSync(at(OPS), `\n## Testing\n\n${lines}`);
}
// Una suite unitaria y las tareas del gate como integración, en operations.md del molde; sin «Sin filtro»: rige la lista del kit.
function levelsStack() {
  appendTesting('- **Suites**: `unit` · `node --test test/app.test.js` · ~1 s · unitario\n- `bookings:test` y `rooms:test` · las tareas del gate de cierre · ~1 s · integración\n');
  s.commit('docs(sdd): suites con su nivel');
}
// La 0010 añade un script a package.json además de su código.
function buildChange0010() {
  writeFileSync(at('package.json'), '{"type": "module", "scripts": {"cancelar": "node src/app.js cancelar"}}\n');
  s.commit('chore: script cancelar en package.json');
}
// La validación en campo de la 0010 ya se hizo sobre el último commit: el borrador del walkthrough, sin commitear,
// con una fila por THEN (validation-modes.md); con un solo smoke, el sujeto la rehacía (re-medida de la 0152, g5).
function validated0010() {
  const head = short('HEAD');
  const row = (then, command, output) => `| ${then} | ejecución real | \`${command}\` → «${output}» |`;
  s.put(`${F10}/walkthrough.md`, ['# Walkthrough — Motivo al cancelar', '', '## 4. Verificación', '', '### 4.1 Builds', '',
    `- Suite completa: \`${FILTERED_GATE}\` → verde, 1 s, sobre ${head}`, '', '### 4.2 Smoke', '', '| THEN | Evidencia | Comando y salida |', '| --- | --- | --- |',
    row('Cancelar con motivo', 'node src/app.js cancelar Norte lun --motivo "sala ocupada"', 'cancelada Norte lun (sala ocupada)'),
    row('Motivo fuera de la lista', 'node src/app.js cancelar Norte lun --motivo "por si acaso"', 'motivo no válido: cambio de planes, sala ocupada, otro'),
    row('Sin motivo', 'node src/app.js cancelar Norte lun', 'motivo no válido: cambio de planes, sala ocupada, otro'),
    // Los datos viven en memoria: el listado se ve en el mismo proceso que la cancelación.
    row('Listado de canceladas', `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"`, 'Norte lun — sala ocupada'), '',
    `Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre ${head}`, ''].join('\n'));
}
// Tras la validación, develop gana la 0015, que solo cambia el test de las salas.
function developRoomsTest() {
  s.git('checkout', '-q', 'develop');
  appendFileSync(at('test/rooms.test.js'), "\ntest('las salas no se repiten', () => {\n  assert.equal(new Set(rooms).size, rooms.length);\n});\n");
  s.commit('test(rooms): las salas no se repiten (0015)');
  s.git('checkout', '-q', 'feature/0010-cancel-reason');
}

// Tras la validación, develop gana la 0015, que trae también el lockfile: un fichero de la lista «Sin filtro» del kit.
function developLockfile() {
  developRoomsTest();
  s.git('checkout', '-q', 'develop');
  s.put('package-lock.json', '{\n  "name": "salas",\n  "lockfileVersion": 3,\n  "packages": {}\n}\n');
  s.commit('chore: package-lock.json (0015)');
  s.git('checkout', '-q', 'feature/0010-cancel-reason');
}
// La rama y develop cambian la misma línea de architecture.md: «join» suma sin contradecirse; «clash» pone dos valores distintos.
const STACK_LINE = '- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.';
const STACK_CHANGES = {
  join: { branch: '- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`, que también valida el motivo al cancelar.', base: `${STACK_LINE} Los tests corren con \`node --test\`.` },
  clash: { branch: '- Node 20, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.', base: '- Node 24, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.' },
};
// El cambio de la rama entra en el Scope de la 0010 y en su revisión final: sin eso, la re-revisión lo marcaba fuera
// de alcance y el sujeto lo revertía o paraba antes del conflicto (re-medida de la 0152, m2 y m4).
function lineConflict(file, line, { branch: ours, base }) {
  edit(file, [line, ours]);
  edit(`${F10}/spec.md`, [/^(- Entra: .*)$/m, `$1 La línea de \`${file}\` pasa a «${ours.replaceAll('$', '$$$$')}».`]);
  s.commit(`docs: ${file} de la 0010`);
  edit(`${F10}/tasks.md`, [/sobre [0-9a-f]{7,}$/m, `sobre ${short('HEAD')}`]);
  s.commit('docs(sdd): la revisión final cubre la línea de la 0010');
  s.git('checkout', '-q', 'develop');
  edit(file, [line, base]);
  if (!has(file, base)) s.die('no se plantó la línea de develop');
  s.commit(`docs: ${file} de la 0016`);
  s.git('checkout', '-q', 'feature/0010-cancel-reason');
  const probe = spawnSync('git', ['-C', s.R, 'merge-tree', '--write-tree', '--name-only', 'HEAD', 'develop'], { env: s.env, encoding: 'utf8' });
  if (probe.status !== 1 || !probe.stdout.includes(file)) s.die(`la base y la rama no chocan en ${file}`);
}
const stackConflict = (kind) => lineConflict(ARCH, STACK_LINE, STACK_CHANGES[kind]);
// Una migración del proyecto, fuera de `.docs/`: está en develop antes de abrir la 0010 para que las dos ramas partan de su línea.
const MIGRATION = 'migrations/v3.0.0.md';
const MIGRATION_CHANGES = {
  join: { line: '**Escribe**: `sdd-kit.json`.', branch: '**Escribe**: `sdd-kit.json`, `operations.md`.', base: '**Escribe**: `sdd-kit.json`, `ROADMAP.md`.' },
  clash: { line: 'Paso 3: renombra `roadmap.md` a `ROADMAP.md`.', branch: 'Paso 3: borra `roadmap.md` al acabar.', base: 'Paso 3: conserva `roadmap.md` como copia de consulta.' },
};
function migrationMold(kind) {
  moldReservas();
  s.put(MIGRATION, `# Migración a la v3.0.0\n\n${MIGRATION_CHANGES[kind].line}\n`);
  s.commit('docs: migración a la v3.0.0');
  done0010();
  lineConflict(MIGRATION, MIGRATION_CHANGES[kind].line, MIGRATION_CHANGES[kind]);
}
// La CI de la base declarada en operations.md del molde; con suites, también la suite unitaria.
const CI_LINE = '- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha`';
function baseCi(suites) {
  s.put('.github/workflows/ci.yml', 'name: ci\non:\n  push:\n    branches: [develop]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: node --test\n');
  appendTesting(`${suites ? '- **Suites**: `node --test` · ~1 s · unitario\n' : ''}${CI_LINE}\n`);
  s.commit('ci: CI de la base en develop');
}
// Fuera del repo del sujeto, para que no lo vea ni lo commitee.
const GH_BIN = join(s.RUN, 'bin');
function ghFake(reply) {
  mkdirSync(GH_BIN, { recursive: true });
  copyFileSync(join(HERE, 'fixtures', 'gh', 'gh.mjs'), join(GH_BIN, 'gh.mjs'));
  writeFileSync(join(GH_BIN, 'gh'), `#!/bin/sh\nexec "${s.NODE.replaceAll('\\', '/')}" "$(dirname "$0")/gh.mjs" "$@"\n`, { mode: 0o755 });
  writeFileSync(join(GH_BIN, 'gh.cmd'), `@"${s.NODE}" "%~dp0gh.mjs" %*\r\n`);
  writeFileSync(join(GH_BIN, 'gh.json'), JSON.stringify(reply));
  const key = Object.keys(s.env).find((name) => name.toUpperCase() === 'PATH') ?? 'PATH';
  s.env[key] = `${GH_BIN}${delimiter}${s.env[key] ?? ''}`;
}
const ghRun = (conclusion, rev) => ({ stdout: `${JSON.stringify([{ conclusion, headSha: s.git('rev-parse', rev).trim() }])}\n` });
const GH_LOGGED_IN = { stdout: 'github.com\n  ✓ Logged in to github.com account fake (keyring)\n' };
const pushAllowed = () => (MARKER = MARKER.replace('"push": false', '"push": true'));
const BARE = join(s.RUN, 'origin.git');
const GITHUB_URL = 'git@github.com:fake/reservas.git';
// Un ssh falso: el fetch llega a la carpeta; el push falla con publickey salvo con el token de gh en el entorno del relanzamiento.
const fakeSsh = (bare) => [
  '#!/bin/sh',
  'for a; do cmd="$a"; done',
  `case "$cmd" in git-upload-pack*) exec git upload-pack "${bare}" ;; esac`,
  `for k in "$GIT_CONFIG_KEY_0" "$GIT_CONFIG_KEY_1" "$GIT_CONFIG_KEY_2"; do [ "$k" = "credential.helper" ] && exec git receive-pack "${bare}"; done`,
  'echo "git@github.com: Permission denied (publickey)." >&2',
  'exit 255',
  '',
].join('\n');
// El remoto se ve como github.com en `git remote -v`. El insteadOf deja la URL igual y gana al del relanzamiento por más largo: el push sigue por el ssh falso, sin red.
function publickeyRemote() {
  const bare = BARE.replaceAll('\\', '/');
  s.git('init', '-q', '--bare', BARE);
  s.git('push', '-q', bare, 'main', 'develop');
  s.git('remote', 'add', 'origin', GITHUB_URL);
  s.git('config', `url.${GITHUB_URL}.insteadOf`, GITHUB_URL);
  s.git('fetch', '-q', bare, '+refs/heads/*:refs/remotes/origin/*');
  const ssh = join(s.RUN, 'ssh.sh');
  writeFileSync(ssh, fakeSsh(bare), { mode: 0o755 });
  s.env.GIT_SSH_COMMAND = `sh ${ssh.replaceAll('\\', '/')}`;
}
const GH_LOGGED_OUT = { stderr: 'To get started with GitHub CLI, please run:  gh auth login\nAlternatively, populate the GH_TOKEN environment variable with a GitHub API authentication token.\n', code: 4 };
// Tras la CI, develop gana un cambio de código: el último verde de la CI ya no es del HEAD.
function developAfterCi() {
  appendFileSync(at('src/app.js'), '\n');
  s.commit('style: salto de línea final en app.js');
}
// La 0010 es la pieza de una familia: su madre 0009 y su hermana 0016, tras ella.
function family0010() {
  edit(`${F10}/spec.md`, [/^feature: 0010$/, 'feature: 0010\nparent: 0009']);
  edit(ROADMAP,
    [/^(\| 0010 \| .*\*\*Requisitos:\*\* )—/, '$1parent: 0009'],
    [/^\| 0010 \| .*$/, `${nowRow('0009', 'Cancelaciones con motivo', 'partida en 0010 y 0016 (dev-lead)')}\n$&\n${nowRow('0016', 'Fotos de las salas', 'cada sala enseña su foto en `salas`', { requisitos: 'parent: 0009', after: '0010' })}`]);
  if (!has(ROADMAP, /^\| 0016 \|/)) s.die('no se plantó la familia de la 0010');
  s.commit('docs(sdd): la 0010 es pieza de la 0009');
}
// Una ADR candidata en la spec, una ADR válida y otra ajena sin «Confirmación» en decisions/.
function adrs0010() {
  edit(`${F10}/spec.md`, [/^## Enmiendas$/, '## Términos y ADR\n\n- Términos resueltos: ninguno\n- ADR candidatas: El motivo de una cancelación se guarda en la propia reserva — alternativa descartada: una tabla de motivos aparte\n\n## Enmiendas']);
  s.put('.docs/sdd/decisions/0001-bookings-in-memory.md', '---\nstatus: accepted\ndate: 2026-09-15\nrutas:\n  - src/**\n---\n\n# Las reservas viven en memoria\n\n## Contexto y problema\n\nUna demo sin base de datos.\n\n## Opciones consideradas\n\n- Memoria\n- SQLite\n\n## Decisión\n\nMemoria, por simplicidad.\n\n### Consecuencias\n\n- Se pierden al reiniciar.\n\n### Confirmación\n\nLa revisión.\n');
  s.put('.docs/sdd/decisions/0002-node-test.md', '---\nstatus: accepted\ndate: 2026-09-20\nrutas:\n  - test/**\n---\n\n# Los tests usan node:test\n\n## Contexto y problema\n\nSin dependencias.\n\n## Opciones consideradas\n\n- node:test\n- vitest\n\n## Decisión\n\nnode:test.\n\n### Consecuencias\n\n- Sin dependencias.\n');
  s.commit('docs(sdd): ADR candidata y decisiones del proyecto');
}
// Un capítulo de capacidades donde el literal que cambia el patch se repite fuera de su requisito.
const capability0008 = () => s.put(CAP, '# Capacidad — bookings\n\n## Propósito\n\nReservar y cancelar salas.\n\n## Requisitos\n\n### Cancelar una reserva\n\n- GIVEN una reserva de Sur el lunes a las 10:00\n- WHEN se ejecuta `cancelar lun 10:00`\n- THEN responde siempre «cancelada lun 10:00»\n\n## Reglas de la capacidad\n\n- **Dónde viven los datos**: en memoria, en `src/app.js`\n- **Idioma de los nombres**: castellano\n- **Límites**: no aplica\n- **Avisos**: «cancelada <día> <franja>», siempre, exista o no la reserva\n- **Regla ante conflicto**: no aplica\n');
function patchDelta0008() {
  edit(`${P8}/patch.md`, [/^Ninguna, porque el proyecto no tiene `capabilities\/`\.$/, '- Modificadas: `bookings` — cambia «Cancelar una reserva»']);
  appendFileSync(at(`${P8}/patch.md`), '\n## Delta de capacidad\n\n### Capacidad: `bookings`\n\n**MODIFIED — Cancelar una reserva** (antes: «responde siempre «cancelada lun 10:00»»)\n\n- GIVEN una reserva de Sur el lunes a las 10:00\n- WHEN se ejecuta `cancelar lun 10:00`\n- THEN responde «cancelada lun 10:00»\n- AND `cancelar mie 10:00`, sin reserva ese día, responde «no hay reserva mie 10:00»\n');
  amend();
}
// Un walkthrough en borrador que cita el sha de un commit del tramo que el cierre junta.
function citedSha0010() {
  edit('src/app.js', ['return index === -1 ? undefined : params[index + 1];', 'return index === -1 ? undefined : params[index + 1]?.trim();']);
  s.commit('fix(bookings): el motivo sin espacios alrededor');
  s.put(`${F10}/walkthrough.md`, `# Walkthrough — Motivo al cancelar (borrador)\n\n## 1. Qué se hizo\n\n- Las dos tasks del plan.\n- Arreglo de la validación: \`${short('HEAD')}\` quita los espacios del motivo.\n`);
  s.commit('docs(sdd): borrador del walkthrough de la 0010');
}
// Solo la 0010 en Now, `🔄`, con su brief, y dos filas de «Lista» de debt.md que la 0010 salda: una entera y otra solo en castellano.
function onlyRow0010() {
  const row0010 = nowRow('0010', 'Motivo al cancelar', 'Al cancelar se elige un motivo', { state: '🔄', requisitos: 'spec de la 0010', salda: '«El motivo de cancelar no se valida» entera; «Los motivos no se traducen», solo el castellano' }).replace('**Toca:** —', '**Toca:** `src/app.js`');
  const lines = readLf(at(ROADMAP)).split('\n').filter((line) => !/^\| 00(?:07|08|1[1-4]) \|/.test(line));
  writeFileSync(at(ROADMAP), lines.map((line) => (line.startsWith('| 0010 |') ? row0010 : line)).join('\n'));
  addTableRow(DEBT, 'Lista', '| El motivo de cancelar no se valida | defecto del producto | revisión de la 0007 | medio | `cancelar Sur mar --motivo xyz` | — | — | 0010 |');
  addTableRow(DEBT, 'Lista', '| Los motivos no se traducen (castellano e inglés) | defecto del producto | cliente | bajo | `canceladas` | — | — | 0010 |');
  s.commit('docs(sdd): la 0010 sola en Now y su deuda en debt.md');
}
// Lo que tenía [Unreleased] ya salió en la 0.3.1: sin entradas, sin filas ✅ en Now y sin carpetas nuevas en changes/, no queda nada que publicar.
function sealedChangelog() {
  edit('CHANGELOG.md', ['## [Unreleased]', '## [Unreleased]\n\n## [0.3.1] - 2026-09-19']);
  if (!has('CHANGELOG.md', '## [0.3.1] - 2026-09-19')) s.die('no se selló el changelog');
  s.commit('docs: changelog sellado en la 0.3.1');
}
const openPlan0010 = () => {
  moldReservas();
  if (cell('Molde') === 'reservas-gate-plan') affectedGate();
  else e2eRedBase();
  open0010();
};
const startEnv = (broken) => {
  manualValidation();
  moldReservas();
  e2eSuite();
  startEnvironment();
  if (broken) brokenEnvironment();
  done0010();
  s.put('.docs/sdd/sdd-kit.local.json', '{"validation": {"startEnvironment": true}}\n');
};

// La 0010 con 4 h de implementación estimadas y un transcript de 5 h de reloj: 200 min son esperas, y el real sale muy por debajo.
function timing0010() {
  moldReservas();
  done0010();
  s.put('.docs/sdd/steering/estimation.md', '# Estimación\n\nEl plan estima y el cierre mide.\n');
  appendFileSync(at(`${F10}/plan.md`), '\n## Estimación y esfuerzo\n\n- Tipo: backend\n- Esfuerzo spec + plan: 0,5h\n- Estimación de implementación: 4h\n');
  s.commit('docs(sdd): estimación de la 0010');
  s.seedTranscript('feature/0010-cancel-reason', [
    '2026-10-08T09:00:00.000Z user arranca la 0010',
    '2026-10-08T09:30:00.000Z assistant spec escrita',
    '2026-10-08T09:40:00.000Z assistant! ¿apruebas la spec?',
    '2026-10-08T12:00:00.000Z user sí',
    '2026-10-08T12:40:00.000Z assistant! implementada, ¿sigo con la revisión?',
    '2026-10-08T13:40:00.000Z user sigue',
    '2026-10-08T14:00:00.000Z assistant! revisión limpia',
  ]);
}

const molds = {
  'reservas-timing': timing0010,
  reservas: () => (moldReservas(), done0010()),
  'reservas-family': () => (moldReservas(), done0010(), family0010()),
  'reservas-family-done': () => {
    moldReservas();
    done0010();
    family0010();
    setState('0009', '✅');
    if (!has(ROADMAP, /^\| 0009 .*\| ✅ \|/)) s.die('no se cerró la madre 0009');
    s.commit('docs(roadmap): la 0009 cerrada');
  },
  'reservas-adr': () => (moldReservas(), done0010(), adrs0010()),
  'reservas-sha': () => (moldReservas(), done0010(), citedSha0010()),
  'reservas-300': () => (moldReservas(), onlyRow0010(), done0010()),
  'salas-capability': () => (capability0008(), done0008(), patchDelta0008()),
  'reservas-base': () => {
    moldReservas();
    done0010();
    developAdvances();
    otherWorktree();
    writeFileSync(at('notes.md'), 'apuntes de la 0010\n');
    s.env.TURN2 = 'notes.md era un apunte mío: discard. Sigue con el cierre.';
  },
  'reservas-capbase': () => {
    moldReservas();
    capabilityBase();
    done0010();
    edit(`${F10}/spec.md`, [/^- Nuevas: `bookings`/, '- Modificadas: `bookings`']);
    s.commit('docs(sdd): bookings ya existe');
    developAdvances();
    capabilityAdvances();
  },
  'reservas-gate-base': () => {
    moldReservas();
    affectedGate();
    done0010();
    developRoomsTest();
    validated0010();
    s.env.TURN2 = 'El walkthrough sin commitear es el borrador del cierre: sigue con el cierre.';
  },
  'reservas-gate-lock': () => {
    moldReservas();
    affectedGate();
    done0010();
    developLockfile();
    validated0010();
    s.env.TURN2 = 'El walkthrough sin commitear es el borrador del cierre: sigue con el cierre.';
  },
  'reservas-docs-join': () => (moldReservas(), done0010(), stackConflict('join')),
  'reservas-docs-clash': () => (moldReservas(), done0010(), stackConflict('clash')),
  'reservas-md-join': () => migrationMold('join'),
  'reservas-md-clash': () => migrationMold('clash'),
  'reservas-ci-red': () => (moldReservas(), baseCi(false), ghFake(ghRun('failure', 'develop')), done0010()),
  'reservas-ci-down': () => (moldReservas(), baseCi(false), ghFake(GH_LOGGED_OUT), done0010()),
  'reservas-release-ci': () => (moldReservas(), baseCi(true), onlyRow0010(), ghFake(ghRun('success', 'develop'))),
  'reservas-release-nothing': () => (moldReservas(), baseCi(true), onlyRow0010(), sealedChangelog(), ghFake(ghRun('success', 'develop'))),
  'reservas-release-ci-old': () => {
    moldReservas();
    baseCi(true);
    onlyRow0010();
    const run = ghRun('success', 'develop');
    developAfterCi();
    ghFake(run);
  },
  'reservas-gate-open': () => (moldReservas(), affectedGate(), done0010(), developRoomsTest(), otherWorktree()),
  'reservas-gate-plan': openPlan0010,
  'reservas-gate-build': () => (moldReservas(), affectedGate(), levelsStack(), done0010(), buildChange0010()),
  'reservas-red': () => (moldReservas(), e2eRedBase(), done0010()),
  'reservas-flaky': () => (moldReservas(), flakyTest(), done0010()),
  'reservas-gate-red': () => (moldReservas(), affectedGate(), storeRedTest(), done0010()),
  'reservas-e2e': () => (moldReservas(), e2eSuite(), done0010()),
  'reservas-e2e-stale': () => (moldReservas(), e2eSuite(), done0010(), staleServer()),
  'reservas-e2e-busy': async () => (moldReservas(), e2eSuite(), done0010(), await busyPort()),
  'reservas-e2e-refused': () => (moldReservas(), e2eSuite(), serverDiesOnce(), done0010()),
  'reservas-e2e-timeout': () => (moldReservas(), e2eSuite(), slowList(), done0010()),
  'reservas-plan': openPlan0010,
  'salas-patch': () => done0008(),
  'salas-report': () => (manualValidation(), done0008(), report0008()),
  'reservas-e2e-manual': () => (manualValidation(), moldReservas(), e2eSuite(), done0010()),
  'reservas-ui': () => {
    manualValidation();
    moldReservas();
    e2eSuite();
    done0010();
    appendFileSync(at(`${F10}/plan.md`), '\n**Se prueba en la aplicación**: la persona arranca el servidor y cancela y lista por `GET /run` con la misma sesión (`x-session`), porque el servidor es la aplicación que usa.\n');
    s.commit('docs(sdd): cómo se prueba la 0010 en la aplicación');
  },
  'reservas-decision': () => {
    manualValidation();
    moldReservas();
    done0010();
    appendFileSync(at(`${F10}/tasks.md`), '\n## Decisión que deja la revisión final\n\n¿`canceladas` lista primero las más recientes o por sala? Es de producto, y sigue sin responder.\n');
    s.commit('docs(sdd): la decisión que deja la revisión final');
  },
  'reservas-campo': () => (moldReservas(), done0010()),
  'reservas-ticket': () => {
    moldReservas();
    done0010();
    s.env.TURN2 = 'Sí, escribe el ticket del kit.';
  },
  'reservas-ticket-wt': () => {
    moldReservas();
    done0010();
    s.git('checkout', '-q', 'develop');
    s.git('worktree', 'add', '-q', join(s.RUN, 'wt'), 'feature/0010-cancel-reason');
    s.R = join(s.RUN, 'wt');
    s.env.TURN2 = 'Sí, escribe el ticket del kit.';
  },
  'reservas-publickey': () => (pushAllowed(), moldReservas(), publickeyRemote(), ghFake(GH_LOGGED_IN), done0010()),
  'reservas-cap': () => {
    moldReservas();
    done0010();
    const stack = '# Operations\n\n- Node 22.\n- `src/app.js`.\n- Puerto 4100 (`architecture.md`).\n';
    s.put(OPS, stack);
    s.put(ARCH, '# Architecture\n\n- Puerto de las pruebas: 4100.\n');
    s.put('scripts/word-cap.mjs', `import { readFileSync } from 'node:fs';\nconst words = readFileSync('${OPS}', 'utf8').split(/\\s+/).filter(Boolean).length;\nif (words > ${stack.split(/\s+/).filter(Boolean).length}) { console.error('operations.md pasa de su tope de palabras: ' + words); process.exit(1); }\n`);
    s.put('.githooks/pre-commit', '#!/bin/sh\nexec node scripts/word-cap.mjs\n');
    s.commit('chore: tope de palabras de operations.md');
    s.git('config', 'core.hooksPath', '.githooks');
  },
  // El tope en un fichero aparte: con margen en la rama, y en develop otra feature lo baja a la medida exacta tras abrirla.
  'reservas-cap-base': () => {
    moldReservas();
    const stack = '# Operations\n\n- Node 22.\n- `src/app.js`.\n- Puerto 4100 (`architecture.md`).\n';
    const exact = stack.split(/\s+/).filter(Boolean).length;
    s.put(OPS, stack);
    s.put(ARCH, '# Architecture\n\n- Puerto de las pruebas: 4100.\n');
    s.put('scripts/word-cap.mjs', `import { readFileSync } from 'node:fs';\nconst cap = JSON.parse(readFileSync('scripts/word-cap.json', 'utf8'))['operations.md'];\nconst words = readFileSync('${OPS}', 'utf8').split(/\\s+/).filter(Boolean).length;\nif (words > cap) { console.error('operations.md mide ' + words + ' y el tope es ' + cap); process.exit(1); }\n`);
    s.put('scripts/word-cap.json', `${JSON.stringify({ 'operations.md': exact + 30 })}\n`);
    s.put('.githooks/pre-commit', '#!/bin/sh\nexec node scripts/word-cap.mjs\n');
    s.commit('chore: tope de palabras de operations.md');
    s.git('config', 'core.hooksPath', '.githooks');
    done0010();
    s.git('checkout', '-q', 'develop');
    s.put('scripts/word-cap.json', `${JSON.stringify({ 'operations.md': exact })}\n`);
    s.commit('chore: el tope de operations.md en su medida exacta (0014)');
    s.git('checkout', '-q', 'feature/0010-cancel-reason');
  },
  'reservas-valida-en': () => {
    manualValidation();
    moldReservas();
    done0010();
    const spec = readLf(at(`${F10}/spec.md`)).replace(/^(- THEN .*)$/m, '$1\n- Se valida en: worktree con la base al día');
    writeFileSync(at(`${F10}/spec.md`), spec);
    s.commit('docs(sdd): el primer THEN se valida con la base al día');
  },
  'reservas-config-manual': () => (manualValidation(), moldReservas(), doneConfig0020()),
  'reservas-config-agent': () => (manualValidation(), moldReservas(), doneConfig0020('Validación: agente — solo fija la versión de Node: una persona no observaría nada que la comprobación del agente no mida')),
  'reservas-start': () => startEnv(false),
  'reservas-start-down': () => startEnv(true),
  'salas-hotfix': () => {
    done0008(true);
    s.env.TURN2 = 'Sobre la migración: sí, este hotfix pide al proyecto la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`.';
  },
};
const mold = moldFrom(cell, s, molds);
await mold();

s.env.MAX_TURNS ||= s.SC === 'r1' || s.SC === 'r2' ? '4' : '60';
await s.launch(ASK);
let envAtEnd = 'abajo';
if (existsSync(at('e2e/config.json'))) {
  const health = await fetch(`http://localhost:${E2E_PORT}/health`, { signal: AbortSignal.timeout(5000) }).catch(() => undefined);
  if (health?.ok) envAtEnd = `arriba en el puerto ${E2E_PORT}`;
}
// La aplicación ajena sigue en el puerto (vivo), el sujeto la paró (parado) o escucha otra cosa en su lugar (sustituido).
const foreignAtEnd = foreign
  ? await fetch(`http://localhost:${E2E_PORT}/`, { signal: AbortSignal.timeout(5000) }).then(async (r) => ((await r.text()).startsWith('otra aplicación') ? 'vivo' : 'sustituido'), () => 'parado')
  : '';
foreign?.kill();
// Lo que quede escuchando en el puerto de la suite, del sujeto o del servidor ajeno, se para.
if (existsSync(at('scripts/env-down.mjs'))) spawnSync(s.NODE, [at('scripts/env-down.mjs')], { cwd: s.R, stdio: 'ignore' });
const keepIf = (path, name) => existsSync(at(path)) && s.keep(at(path), name);
for (const kept of ['tasks', 'walkthrough', 'patch']) for (const dir of [F10, P8, '.docs/sdd/specs/20261012-100000-feature-0020-node-engine']) keepIf(`${dir}/${kept}.md`, `${kept}.md`);
const files = (dir, pattern) => (existsSync(at(dir)) ? readdirSync(at(dir)).filter((name) => pattern.test(name)).sort() : []);
for (const migration of files('skills/sdd-upgrade/references/migrations', /^v.*\.md$/)) keepIf(`skills/sdd-upgrade/references/migrations/${migration}`, migration);
for (const kept of ['ROADMAP.md', 'CHANGELOG.md', '.docs/sdd/steering/debt.md', CAP]) keepIf(kept, kept.split('/').at(-1));
for (const adr of files('.docs/sdd/decisions', /\.md$/)) keepIf(`.docs/sdd/decisions/${adr}`, adr);
keepIf(OPS, 'operations.md');
keepIf(`${F10}/timing.json`, 'timing.json');
const wordsOf = (text) => text.split(/\s+/).filter(Boolean).length;
const capOf = (json) => (json ? JSON.parse(json)['operations.md'] : null);
const caps = existsSync(at('scripts/word-cap.json'))
  ? `## topes de operations.md\nmide: ${wordsOf(readFileSync(at(OPS), 'utf8'))} · tope de la rama: ${capOf(readFileSync(at('scripts/word-cap.json'), 'utf8'))} · tope de develop: ${capOf(gitQuiet('show', 'develop:scripts/word-cap.json'))}\n`
  : '';
const architecture = gitQuiet('show', `develop:${ARCH}`);
const tail = architecture ? `${architecture.replace(/\n$/, '').split('\n').slice(-20).join('\n')}\n` : '';
s.save([
  `## petición\n${ASK}\n## entorno al acabar el sujeto\n${envAtEnd}\n`,
  caps,
  foreign ? `## aplicación ajena en el puerto al acabar el sujeto\n${foreignAtEnd}\n` : '',
  existsSync(join(GH_BIN, 'gh.json')) ? `## llamadas a gh\n${existsSync(join(GH_BIN, 'gh.log')) ? readFileSync(join(GH_BIN, 'gh.log'), 'utf8') : 'ninguna\n'}` : '',
  `## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all', '--graph')}## etiquetas\n${s.git('tag', '-n1')}`,
  `## timing.json en la historia\n${gitQuiet('log', '--all', '--name-only', '--format=', '--', `${F10}/timing.json`)}`,
  `## kit-feedback en develop\n${gitQuiet('log', 'develop', '--name-only', '--format=', '--', '.docs/sdd/kit-feedback')}`,
  existsSync(BARE) ? `## develop en origin\n${gitQuiet('--git-dir', BARE, 'log', '--oneline', 'develop')}` : '',
  `## ROADMAP.md en develop\n${gitQuiet('show', `develop:${ROADMAP}`)}## debt.md en develop\n${gitQuiet('show', `develop:${DEBT}`)}## bookings en develop\n${gitQuiet('show', `develop:${CAP}`)}## architecture en develop\n${tail}`,
].join(''));
