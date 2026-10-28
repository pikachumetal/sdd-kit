// Sujeto de la batería de sdd-archive: una feature o un patch hechos, listos para cerrar.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const IMPL = join(HERE, '..', 'sdd-implement');
const [kit, , SC] = process.argv.slice(2);
// Un kit anterior a sdd-archive (el RED, con el kit de develop de entonces) cierra con sdd-end-feature o sdd-end-patch: la guarda y la petición usan la de ese kit.
const GUARD = (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const OLD = (scenarioCell(HERE, SC, 'Molde') ?? '').startsWith('salas-') ? 'sdd-end-patch' : 'sdd-end-feature';
const current = existsSync(join(kit, 'skills', GUARD));
const s = initSubject(process.argv.slice(2), current ? GUARD : OLD);
const cell = (column) => scenarioCell(HERE, s.SC, column) ?? s.die(`sin el escenario ${s.SC} en battery.md`);
let ASK = cell('Petición');
if (!current) ASK = ASK.replaceAll(`sdd-kit:${GUARD}`, `sdd-kit:${OLD}`);
const F10 = '.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason';
const P8 = '.docs/sdd/specs/20261010-090000-patch-0008-cancel-missing';
const CAP = '.docs/sdd/capabilities/bookings.md';
const MERGE = '"merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}';
let MARKER = `"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, ${MERGE}, "execution": "native", "validation": {"mode": "field"}`;
// Como el sed de Git Bash, que dejaba las líneas en LF; como sed, cada sustitución, la primera de cada línea.
const readLf = (path) => readFileSync(path, 'utf8').replaceAll('\r\n', '\n');
const perLine = (text, ...pairs) => text.split('\n').map((line) => pairs.reduce((out, [from, to]) => out.replace(from, to), line)).join('\n');
const at = (path) => join(s.R, path);
const edit = (path, ...pairs) => writeFileSync(at(path), perLine(readLf(at(path)), ...pairs));
const has = (path, pattern) => readFileSync(at(path), 'utf8').split(/\r?\n/).some((line) => (typeof pattern === 'string' ? line.includes(pattern) : pattern.test(line)));
const cp = (from, path) => copyFileSync(from, at(path));
const short = (rev) => s.git('rev-parse', '--short=7', rev).trim();
const gitQuiet = (...args) => spawnSync('git', ['-C', s.R, ...args], { env: s.env, encoding: 'utf8' }).stdout ?? '';
const branch = (name) => s.git('checkout', '-q', '-b', name);
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
  cp(join(IMPL, 'fixtures', 'app-done.js'), 'src/app.js');
  cp(join(IMPL, 'fixtures', 'cancel-done.test.js'), 'test/cancel.test.js');
  if (existsSync(at('e2e/run.mjs'))) cp(join(E2E, 'e2e', 'cancel-0010.e2e.mjs'), 'e2e/cancel.e2e.mjs');
  s.commit('feat(bookings): listado de canceladas con su motivo');
  const A = short('HEAD');
  s.put(`${F10}/tasks.md`, [
    '---', 'id: 20261008-100000-feature-0010-cancel-reason', 'title: Tasks — Motivo al cancelar', '---', '', '# Tasks — Motivo al cancelar (registro vivo)', '',
    '| # | Task | Status | Commit | Notas |', '| --- | --- | --- | --- | --- |', `| 1 | Cancelar con motivo | done | ${A} | |`, `| 2 | Listado de canceladas | done | ${A} | |`, '',
    `Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre ${A}`, '', '## Rulings', '',
    '- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble', '',
  ].join('\n'));
  s.commit('docs(sdd): tasks.md con la revisión final');
}
// La suite E2E del proyecto en develop: servidor HTTP, runner con la salida de Playwright y operations.md con sus campos E2E.
const E2E = join(HERE, 'fixtures', 'e2e');
// Un puerto por sujeto: dos sujetos a la vez no comparten servidor.
const E2E_PORT = 4300 + Math.floor(Math.random() * 600);
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
// El tar se lee con una ruta relativa: el de Git Bash toma «D:» como un host.
function staleServer() {
  const stale = join(s.RUN, 'stale-env');
  mkdirSync(stale, { recursive: true });
  s.git('archive', '-o', join(s.RUN, 'stale-env.tar'), 'develop');
  spawnSync('tar', ['-xf', '../stale-env.tar'], { cwd: stale, stdio: 'ignore' });
  if (spawnSync(s.NODE, [join(stale, 'scripts', 'env-up.mjs')], { stdio: 'ignore' }).status !== 0) s.die('no arrancó el servidor ajeno');
}

// El patch 0008 con su fix commiteado, sobre el molde de salas de using-sdd; con «hotfix», la rama sale de main.
function done0008(hotfix) {
  const row = '| 0008 | Patch: si cancelo una reserva que no existe me dice «cancelada» igual | ⏳ |';
  const debt = '| Cancelar una reserva que no existe responde «cancelada» igual | Medio | Actuar → 0008 |';
  const roadmap = '.docs/sdd/roadmap.md';
  s.copy(join(HERE, '..', 'using-sdd', 'mold-salas'));
  s.putKitMarker(MARKER.replace(', "execution": "native"', ''));
  const avisos = '| 1 | Avisos por correo antes de la reserva | ⏳ |';
  if (!has(roadmap, /^\| 1 \| Avisos por correo antes de la reserva \| ⏳ \|$/)) s.die('el roadmap del molde salas cambió: no hay dónde poner la fila 0008');
  const franja = '| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |';
  writeFileSync(at(roadmap), readLf(at(roadmap)).split('\n').flatMap((line) => (line === avisos ? [line, row] : line === franja ? [line, debt] : [line])).join('\n'));
  if (!has(roadmap, 'Actuar → 0008')) s.die('no se plantó la fila de deuda de la 0008');
  if (hotfix) s.put('skills/sdd-upgrade/references/migrations/README.md', '# Migraciones\n\nUna por versión, `vX.Y.Z.md`: los pasos que el proyecto aplica al subir.\n');
  s.git('init', '-q', '-b', 'main');
  s.commit('feat: base del molde');
  branch('develop');
  if (hotfix) s.git('checkout', '-q', 'main');
  branch(hotfix ? 'hotfix/0008-cancel-missing' : 'feature/0008-cancel-missing');
  edit('src/app.js', ["  if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;", "  if (cmd === 'cancelar') return bookings.some((b) => b.day === params[0] && b.slot.startsWith(params[1])) ? `cancelada ${params[0]} ${params[1]}` : `no hay reserva ${params[0]} ${params[1]}`;"]);
  if (!has('src/app.js', 'no hay reserva')) s.die('no se plantó el fix en src/app.js');
  edit('test/app.test.js', ["run('cancelar', ['mar', '10:00']), 'cancelada mar 10:00'", "run('cancelar', ['lun', '10:00']), 'cancelada lun 10:00'"]);
  appendFileSync(at('test/app.test.js'), "\ntest('cancelar sin reserva avisa', () => {\n  assert.equal(run('cancelar', ['mie', '10:00']), 'no hay reserva mie 10:00');\n});\n");
  s.put(`${P8}/patch.md`, readFileSync(join(HERE, 'patch-0008.md'), 'utf8'));
  s.commit('fix: cancelar una reserva que no existe avisa (0008)');
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
  edit('.docs/sdd/steering/operations.md', [/^- \*\*Gate de cierre\*\*: .*$/, '- **Gate de cierre**: `node --test test/`']);
  appendFileSync(at('.gitignore'), '.docs/sdd/sdd-kit.local.json\n');
  s.commit('chore: gate de cierre sin e2e y config local ignorada');
}
function brokenEnvironment() {
  s.put('scripts/env-up.mjs', "console.error('Error: no arranca: falta data/seed.json');\nprocess.exit(1);\n");
  s.commit('chore: env-up sin la semilla de datos');
}

const FRANJA_DEBT = '| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |';
// Un E2E que falla igual con la rama y sin ella, y su fila en la deuda del proyecto.
function e2eRedBase() {
  s.put('test/export.e2e.test.js', "import test from 'node:test';\n\ntest('exportar reservas a csv', () => {\n  throw new Error('TimeoutError: export no respondió en 5000 ms');\n});\n");
  edit('.docs/sdd/roadmap.md', [/^\| Sin validación del formato de franja horaria \| Bajo \| Patch cuando moleste \|$/, `${FRANJA_DEBT}\n| \`test/export.e2e.test.js\` falla con «TimeoutError: export no respondió» también en \`develop\` | Medio | Patch cuando moleste |`]);
  if (!has('.docs/sdd/roadmap.md', 'export.e2e')) s.die('no se plantó la fila de deuda del E2E');
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
  edit('.docs/sdd/roadmap.md', [/^\| 0010 \| \*\*Motivo al cancelar\*\*.*$/, '$&\n| 0015 | **Salas en su módulo**: la lista de salas sale de `app.js` | ✅ |']);
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
  edit('.docs/sdd/constitution.md', ['Gate de cierre: `node --test` entero en verde.', `Gate de cierre: \`${FILTERED_GATE}\` en verde.`]);
  if (!has('.docs/sdd/constitution.md', 'scripts/gate.mjs')) s.die('no se plantó el gate filtrado');
  s.commit('chore: gate de cierre filtrado por tareas');
}
// La validación en campo de la 0010 ya se hizo sobre el último commit: el borrador del walkthrough, sin commitear.
function validated0010() {
  const head = short('HEAD');
  s.put(`${F10}/walkthrough.md`, ['# Walkthrough — Motivo al cancelar', '', '## 4. Verificación', '', '### 4.1 Builds', '',
    `- Suite completa: \`${FILTERED_GATE}\` → verde, 1 s, sobre ${head}`, '',
    `Validación en campo: 2026-10-26 · smoke por THEN (\`node src/app.js cancelar Norte lun --motivo sala-ocupada\`) y suite en verde sobre ${head}`, ''].join('\n'));
}
// Tras la validación, develop gana la 0015, que solo cambia el test de las salas.
function developRoomsTest() {
  s.git('checkout', '-q', 'develop');
  appendFileSync(at('test/rooms.test.js'), "\ntest('las salas no se repiten', () => {\n  assert.equal(new Set(rooms).size, rooms.length);\n});\n");
  s.commit('test(rooms): las salas no se repiten (0015)');
  s.git('checkout', '-q', 'feature/0010-cancel-reason');
}

// La 0010 es la pieza de una familia: su madre 0009 y su hermana 0016, tras ella.
function family0010() {
  edit(`${F10}/spec.md`, [/^feature: 0010$/, 'feature: 0010\nparent: 0009']);
  edit('.docs/sdd/roadmap.md', [/^\| 0010 \| \*\*Motivo al cancelar\*\*(.*)\| ⏳ \|$/, '| 0009 | **Cancelaciones con motivo** — partida en 0010 y 0016 (dev-lead) | ⏳ |\n| 0010 | **Motivo al cancelar**$1— `parent: 0009` | ⏳ |\n| 0016 | **Fotos de las salas**: cada sala enseña su foto en `salas` — `parent: 0009`, tras 0010 | ⏳ |']);
  if (!has('.docs/sdd/roadmap.md', /^\| 0016 \|/)) s.die('no se plantó la familia de la 0010');
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
// ROADMAP.md y debt.md de la 3.0.0 en lugar de roadmap.md.
function roadmap300() {
  s.git('rm', '-q', '.docs/sdd/roadmap.md');
  s.put('ROADMAP.md', '# Roadmap — salas\n\n## Now\n\nPerfil de control: delegate\n\n| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n| 0010 | — | **Motivo al cancelar**<br>*Al cancelar se elige un motivo*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** spec de la 0010<br>**Decisiones ya tomadas:** —<br>**Salda:** «El motivo de cancelar no se valida» entera; «Los motivos no se traducen», solo el castellano<br>**Toca:** `src/app.js`</details> | 🔄 | — | M |\n\n## Next\n\n| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n\n## Later\n\n| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n| B1 | — | **Exportar a calendario**<br>*Las reservas en .ics* | ⏳ | — | — |\n');
  s.put('.docs/sdd/steering/debt.md', '# Deuda técnica — salas\n\n## Por triar\n\n| Ítem | Origen | Fecha |\n| --- | --- | --- |\n\n## En espera\n\n| Ítem | Origen | Impacto | Falta | Fecha |\n| --- | --- | --- | --- | --- |\n\n## Lista\n\n| Ítem | Origen | Impacto | Evidencia | Destino |\n| --- | --- | --- | --- | --- |\n| El motivo de cancelar no se valida | revisión de la 0007 | medio | `cancelar Sur mar --motivo xyz` | 0010 |\n| Los motivos no se traducen (castellano e inglés) | cliente | bajo | `canceladas` | 0010 |\n\n## Descartadas\n\n| Ítem | Origen | Motivo | Fecha |\n| --- | --- | --- | --- |\n');
  s.commit('docs(sdd): roadmap y deuda en la forma 3.0.0');
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

const molds = {
  reservas: () => (moldReservas(), done0010()),
  'reservas-family': () => (moldReservas(), done0010(), family0010()),
  'reservas-family-done': () => {
    moldReservas();
    done0010();
    family0010();
    edit('.docs/sdd/roadmap.md', [/^\| 0009 \| \*\*Cancelaciones con motivo\*\*(.*)\| ⏳ \|$/, '| 0009 | **Cancelaciones con motivo**$1| ✅ |']);
    if (!has('.docs/sdd/roadmap.md', /^\| 0009 .*\| ✅ \|$/)) s.die('no se cerró la madre 0009');
    s.commit('docs(roadmap): la 0009 cerrada');
  },
  'reservas-adr': () => (moldReservas(), done0010(), adrs0010()),
  'reservas-sha': () => (moldReservas(), done0010(), citedSha0010()),
  'reservas-300': () => (moldReservas(), roadmap300(), done0010()),
  'salas-capability': () => (capability0008(), done0008(), patchDelta0008()),
  'reservas-base': () => {
    moldReservas();
    done0010();
    developAdvances();
    otherWorktree();
    writeFileSync(at('notes.md'), 'apuntes de la 0010\n');
    s.env.TURN2 = 'notes.md era un apunte mío: bórralo y sigue con el cierre.';
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
    s.env.TURN2 = 'El walkthrough sin commitear es el borrador del paso 7: sigue con el cierre.';
  },
  'reservas-gate-open': () => (moldReservas(), affectedGate(), done0010(), developRoomsTest(), otherWorktree()),
  'reservas-gate-plan': openPlan0010,
  'reservas-red': () => (moldReservas(), e2eRedBase(), done0010()),
  'reservas-flaky': () => (moldReservas(), flakyTest(), done0010()),
  'reservas-gate-red': () => (moldReservas(), affectedGate(), storeRedTest(), done0010()),
  'reservas-e2e': () => (moldReservas(), e2eSuite(), done0010()),
  'reservas-e2e-stale': () => (moldReservas(), e2eSuite(), done0010(), staleServer()),
  'reservas-plan': openPlan0010,
  'salas-patch': () => done0008(),
  'salas-report': () => (manualValidation(), done0008(), report0008()),
  'reservas-e2e-manual': () => (manualValidation(), moldReservas(), e2eSuite(), done0010()),
  'reservas-start': () => startEnv(false),
  'reservas-start-down': () => startEnv(true),
  'salas-hotfix': () => {
    done0008(true);
    s.env.TURN2 = 'Sobre la migración: sí, este hotfix pide al proyecto la clave `cancel.strict: true` en `.docs/sdd/sdd-kit.json`.';
  },
};
const mold = molds[cell('Molde')] ?? s.die(`molde desconocido en battery.md: ${s.SC}`);
mold();

s.env.MAX_TURNS ||= s.SC === 'r1' || s.SC === 'r2' ? '4' : '60';
await s.launch(ASK);
let envAtEnd = 'abajo';
if (existsSync(at('e2e/config.json'))) {
  const health = await fetch(`http://localhost:${E2E_PORT}/health`, { signal: AbortSignal.timeout(5000) }).catch(() => undefined);
  if (health?.ok) envAtEnd = `arriba en el puerto ${E2E_PORT}`;
}
// Lo que quede escuchando en el puerto de la suite, del sujeto o del servidor ajeno, se para.
if (existsSync(at('scripts/env-down.mjs'))) spawnSync(s.NODE, [at('scripts/env-down.mjs')], { cwd: s.R, stdio: 'ignore' });
const keepIf = (path, name) => existsSync(at(path)) && s.keep(at(path), name);
for (const kept of ['tasks', 'walkthrough', 'patch']) for (const dir of [F10, P8]) keepIf(`${dir}/${kept}.md`, `${kept}.md`);
const files = (dir, pattern) => (existsSync(at(dir)) ? readdirSync(at(dir)).filter((name) => pattern.test(name)).sort() : []);
for (const migration of files('skills/sdd-upgrade/references/migrations', /^v.*\.md$/)) keepIf(`skills/sdd-upgrade/references/migrations/${migration}`, migration);
for (const kept of ['ROADMAP.md', '.docs/sdd/steering/debt.md', CAP]) keepIf(kept, kept.split('/').at(-1));
for (const adr of files('.docs/sdd/decisions', /\.md$/)) keepIf(`.docs/sdd/decisions/${adr}`, adr);
keepIf('.docs/sdd/steering/operations.md', 'operations.md');
for (const doc of ['roadmap', 'tech-stack', 'changelog']) keepIf(`.docs/sdd/${doc}.md`, `${doc}.md`);
const techStack = gitQuiet('show', 'develop:.docs/sdd/tech-stack.md');
const tail = techStack ? `${techStack.replace(/\n$/, '').split('\n').slice(-20).join('\n')}\n` : '';
s.save([
  `## petición\n${ASK}\n## entorno al acabar el sujeto\n${envAtEnd}\n`,
  `## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all', '--graph')}## etiquetas\n${s.git('tag', '-n1')}`,
  `## roadmap en develop\n${gitQuiet('show', 'develop:.docs/sdd/roadmap.md')}## bookings en develop\n${gitQuiet('show', `develop:${CAP}`)}## tech-stack en develop\n${tail}`,
].join(''));
