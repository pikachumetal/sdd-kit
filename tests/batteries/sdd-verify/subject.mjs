// Sujeto de la batería de sdd-verify: un punto de la implementación o del cierre de la 0010, con sus artefactos ya escritos.
// Lo lanza tests/headless/battery.mjs run.
import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = join(HERE, 'fixtures');
const IMPL = join(HERE, '..', 'sdd-implement');
const [kit, , SC] = process.argv.slice(2);
const guard = (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), existsSync(join(kit, 'skills', guard)) ? guard : 'using-sdd');
const cell = subjectCell(HERE, s);
let ASK = cell('Petición');
const SDD_CLI = join(s.KIT, 'cli', 'bin', 'sdd.js');
const CONTROL = s.SC === 'f2' ? '"profile": "delegate", "maxParallelAgents": 2' : '"profile": "delegate"';
let MARKER = `"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {${CONTROL}}, "execution": "native"`;
if (['c5', 'c6', 'c8', 'mp1'].includes(s.SC)) MARKER += ', "validation": {"mode": "field"}';
if (['c1f', 'c9', 'c10', 'c10e'].includes(s.SC)) MARKER += ', "review": {"minors": "fix"}';
const F10 = '.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason';
const F30 = '.docs/sdd/specs/20261015-100000-feature-0030-free-rooms-kiosk';
const F21 = '.docs/sdd/specs/20261012-100000-feature-0021-void-reason';
const F22 = '.docs/sdd/specs/20261013-100000-feature-0022-cancel-notice';
const F23 = '.docs/sdd/specs/20261013-110000-feature-0023-cancelled-list';
const at = (path) => join(s.R, path);
const forward = (path) => path.replaceAll('\\', '/');
const sddCli = (...args) => spawnSync(s.NODE, [SDD_CLI, ...args], { cwd: s.R, env: s.env, encoding: 'utf8' }).stdout ?? '';
const edit = (path, change) => writeFileSync(at(path), change(readLf(at(path))));

// f5 monta su propio molde, hojas.
if (s.SC !== 'f5') {
  s.copy(join(IMPL, 'mold-reservas'));
  s.putKitMarker(MARKER);
  s.initRepo();
}

// Sin «quién canceló»: el molde no tiene usuarios.
let approved0010 = () => readLf(join(IMPL, 'fixtures', 'spec-0010.md'))
  .replaceAll(' y quién canceló', '')
  .replaceAll(' cancelada por Ana con', ' cancelada con')
  .replaceAll(' — sala ocupada — Ana»', ' — sala ocupada»')
  .replace(/^2\. El listado de canceladas enseña sala[^\n]*\n/m, '')
  .replace(/^status: draft/m, 'status: approved')
  .replaceAll('approved_at: null', 'approved_at: 2026-10-08')
  .replaceAll('| dev-lead | Laura | | pendiente |', '| dev-lead | Laura | 2026-10-08 | aprobada |');
// La spec aprobada de la 0010 con un cambio del escenario, antes de abrir la feature.
const amendSpec = (change) => {
  const plain = approved0010;
  approved0010 = () => change(plain());
};
const withAxis = () => readLf(join(IMPL, 'fixtures', 'plan-0010.md')).replace(/^\*\*Ejecución\*\*: native.*$/m, '$&\n\n**Eje Arquitectura**: no — solo la app de reservas');
function open0010() {
  s.git('checkout', '-q', '-b', 'feature/0010-cancel-reason');
  s.put(`${F10}/spec.md`, approved0010());
  s.put(`${F10}/plan.md`, withAxis());
  s.commit('docs(sdd): abrir la feature 0010 con su spec y su plan');
}
const short = (rev) => s.git('rev-parse', '--short=7', rev).trim();
const workspace = () => sddCli('workspace', `${F10}/plan.md`).trim().split('\n').at(-1);
const ledger = (lines) => writeFileSync(join(workspace(), 'progress.md'), `# SDD ledger — plan: ${F10}/plan.md\n${lines}\n`);
const cp = (from, path) => copyFileSync(from, at(path));

function task1() {
  cp(join(IMPL, 'fixtures', 'app-task1.js'), 'src/app.js');
  cp(join(IMPL, 'fixtures', 'cancel-task1.test.js'), 'test/cancel.test.js');
  s.commit('feat(bookings): cancelar con un motivo de la lista');
}
function task2() {
  cp(s.SC === 'c7' ? join(FIX, 'app-c7.js') : join(IMPL, 'fixtures', 'app-done.js'), 'src/app.js');
  cp(join(IMPL, 'fixtures', 'cancel-done.test.js'), 'test/cancel.test.js');
  if (s.SC === 'f2') writeFileSync(at('package.json'), '{"type": "module", "dependencies": {"zod": "^3.23.8"}}\n');
  s.commit('feat(bookings): listado de canceladas con su motivo');
}
const taskLine = (n, commits, passed) => `Task ${n}: complete (commits ${commits}, tests: node --test test/cancel.test.js → ${passed} pass)`;
const shas = {};
// La 0010 abierta y su Task 1 commiteada; deja T0 y T1 con sus sha.
function openTask1() {
  open0010();
  shas.T0 = short('HEAD');
  task1();
  shas.T1 = short('HEAD');
}
// La 0010 implementada en Native, con sus dos tasks en el ledger; deja A con el sha de la última task.
function done0010() {
  openTask1();
  task2();
  shas.A = short('HEAD');
  ledger(`${taskLine(1, `${shas.T0}..${shas.T1}`, '2/2')}\n${taskLine(2, `${shas.T1}..${shas.A}`, '3/3')}`);
}
const tasksMd = (...lines) => s.put(`${F10}/tasks.md`, [
  '---', 'id: 20261008-100000-feature-0010-cancel-reason', 'title: Tasks — Motivo al cancelar', '---', '', '# Tasks — Motivo al cancelar (registro vivo)', '',
  '| # | Task | Status | Commit | Notas |', '| --- | --- | --- | --- | --- |', `| 1 | Cancelar con motivo | done | ${shas.A} | |`, `| 2 | Listado de canceladas | done | ${shas.A} | |`, '', ...lines, '',
].join('\n'));
const trimTest = () => appendFileSync(at('test/cancel.test.js'), '\ntest("cancelar con un espacio tras el motivo", () => {\n  assert.equal(run("cancelar", ["Sur", "mar", "--motivo", "otro "]), "sin reserva Sur mar");\n});\n');
function fixTrim() {
  edit('src/app.js', (text) => text.replace('return index === -1 ? undefined : params[index + 1];', 'return index === -1 ? undefined : params[index + 1]?.trim();'));
  trimTest();
  s.commit('fix(bookings): el motivo sin espacios alrededor');
}
function emptyListText() {
  edit('src/app.js', (text) => text.replace(".join('\\n');", ".join('\\n') || 'sin canceladas';"));
  s.commit('fix(bookings): canceladas sin canceladas dice «sin canceladas»');
}
const REMOVED_SCENARIOS = ['rm1', 'rm2', 'rm2b', 'rm3'];
const BODILESS = ['rm2', 'rm2b'];
const briefScenario = () => (REMOVED_SCENARIOS.includes(s.SC) ? 'rm' : s.SC.replace(/n$/, ''));
// El encargo del eje de f3, f3n, f4, f5, f6, f6b, rm1, rm2, rm2b o rm3, compuesto con el texto del kit que se prueba; f3n usa los valores de f3.
function axisBrief(base, headSha, pkg) {
  const axis = ['f4', 'f5', 'f6', 'f6b'].includes(s.SC) ? 'code' : 'spec';
  const files = s.git('diff', '--name-only', base, 'HEAD', '--', '.', ':(exclude,glob).docs/sdd/specs/**').split('\n').filter(Boolean);
  const adrs = sddCli('decision', 'index', '--path', '.docs/sdd', '--files', ...files);
  const caps = sddCli('capability', 'index', '--path', '.docs/sdd');
  const comments = sddCli('review', 'comments', '--base', base);
  const args = [`--kit=${s.KIT}`, `--superpowers=${s.env.SUPERPOWERS_DIR ?? ''}`, `--axis=${axis}`, `--scenario=${briefScenario()}`,
    `--package=${forward(pkg)}`, `--sha=${headSha}`, `--dir=${forward(s.R)}`, `--adrs=${adrs.replace(/\n+$/, '')}`, `--caps=${caps.replace(/\n+$/, '')}`, `--comments=${comments.replace(/\n+$/, '')}`];
  return (spawnSync(s.NODE, [join(HERE, 'compose-axis.mjs'), ...args], { env: s.env, encoding: 'utf8' }).stdout ?? '').replace(/\n+$/, '');
}
function reviewPackage(base, excludeSpecs) {
  const headSha = s.git('rev-parse', '--short', 'HEAD').trim();
  const pkg = join(s.RUN, `review-final-${headSha}.diff`);
  const scope = excludeSpecs ? ['--', '.', ':(exclude,glob).docs/sdd/specs/**'] : [];
  writeFileSync(pkg, [
    `# Review package: ${s.git('rev-parse', '--short', base).trim()}..HEAD`, '', '## Commits', s.git('log', '--oneline', `${base}..HEAD`).replace(/\n$/, ''), '',
    '## Files changed', s.git('diff', '--stat', base, 'HEAD', ...scope).replace(/\n$/, ''), '',
    '## Diff', s.git('diff', '-U10', base, 'HEAD', ...scope).replace(/\n$/, ''), '',
  ].join('\n'));
  return axisBrief(base, headSha, pkg);
}
// La 0024 de hojas: recordar el filtro de estado, con su E2E y los timeouts subidos.
function hojas0024() {
  const fix = join(FIX, 'hojas-0024');
  s.copy(join(HERE, 'mold-hojas'));
  s.putKitMarker(MARKER);
  s.initRepo('feat: base del molde hojas');
  const base = s.git('rev-parse', 'HEAD').trim();
  s.git('checkout', '-q', '-b', 'feature/0024-remember-status-filter');
  cp(join(fix, 'InvoiceList.tsx'), 'src/invoices/InvoiceList.tsx');
  cp(join(fix, 'api.js'), 'server/api.js');
  s.commit('feat(invoices): la lista recuerda el último estado elegido');
  cp(join(fix, 'remember-filter.spec.ts'), 'e2e/0024-remember-filter.spec.ts');
  appendFileSync(at('e2e/helpers.ts'), readFileSync(join(fix, 'helpers-tail.ts')));
  cp(join(fix, 'playwright.config.ts'), 'playwright.config.ts');
  s.commit('test(invoices): e2e de recordar el filtro');
  return base;
}
// La spec de la feature en su rama, con su capacidad, y el encargo del revisor de la spec que compone el kit.
function specReview(folder, { capability, fixture }) {
  mkdirSync(at('.docs/sdd/capabilities'), { recursive: true });
  cp(join(FIX, 'capabilities', capability), `.docs/sdd/capabilities/${capability}`);
  const id = folder.split('-feature-')[1];
  s.git('checkout', '-q', '-b', `feature/${id}`);
  s.put(`${folder}/spec.md`, readFileSync(join(FIX, fixture), 'utf8'));
  s.commit(`docs(sdd): spec de la ${id.split('-')[0]}`);
  const composed = spawnSync(s.NODE, [join(HERE, 'compose-spec-review.mjs'), s.KIT, `${folder}/spec.md`, `.docs/sdd/capabilities/${capability}`], { cwd: s.R, env: s.env, encoding: 'utf8' });
  if (composed.status !== 0) s.die(`compose-spec-review falló: ${composed.stderr}`);
  return composed.stdout.replace(/\n+$/, '');
}
const reReview = (fixture) => copyFileSync(join(FIX, fixture), join(workspace(), 're-review.md'));
// La 0010 hecha, con una pasada de fix y su re-revisión con el veredicto que mide el escenario.
function reviewedFix({ app, test, title, verdict, fixture }) {
  done0010();
  cp(join(FIX, app), 'src/app.js');
  if (test) cp(join(FIX, test), 'test/cancel.test.js');
  else trimTest();
  s.commit(title);
  const B = short('HEAD');
  tasksMd(`Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre ${shas.A}`, `Pasada de fix: ${B}, 1 hallazgo RED→GREEN`, `Re-revisión: ${shas.A}..${B}, sdd-kit:effort-high + opus, ${verdict}`);
  s.commit('docs(sdd): tasks.md con la re-revisión');
  reReview(fixture);
}
// La app antes del cambio, con la ADR de las reservas en memoria y las capacidades; en f3n ninguna ADR cubre el diff.
function reviewBase() {
  mkdirSync(at('.docs/sdd/decisions'), { recursive: true });
  mkdirSync(at('.docs/sdd/capabilities'), { recursive: true });
  const adr = join(HERE, '..', 'sdd-propose', 'fixtures', 'adr-0003-bookings-in-memory.md');
  const text = s.SC === 'f3n' ? readLf(adr).replace(/^ {2}- src\/\*\*$/m, '  - docs/**') : readFileSync(adr);
  writeFileSync(at('.docs/sdd/decisions/0003-bookings-in-memory.md'), text);
  for (const name of readdirSync(join(FIX, 'capabilities')).filter((file) => file.endsWith('.md'))) cp(join(FIX, 'capabilities', name), `.docs/sdd/capabilities/${name}`);
  if (REMOVED_SCENARIOS.includes(s.SC)) cp(join(FIX, 'capabilities-rm', BODILESS.includes(s.SC) ? 'bookings-rm2.md' : 'bookings-rm1.md'), '.docs/sdd/capabilities/bookings.md');
  cp(join(...baseApp()), 'src/app.js');
  s.commit('feat: la app antes del cambio');
  return s.git('rev-parse', 'HEAD').trim();
}
function baseApp() {
  if (['f4', 'f6', 'f6b'].includes(s.SC)) return [IMPL, 'fixtures', 'app-done.js'];
  if (s.SC === 'rm2b') return [FIX, 'app-rm.js'];
  return [FIX, REMOVED_SCENARIOS.includes(s.SC) ? 'app-rm-base.js' : 'app-f3-base.js'];
}
const F25 = '.docs/sdd/specs/20261014-100000-feature-0025-void-no-mail';
// La 0025 quita el aviso por correo y deja la cola de salida: rm1-rm3 solo cambian el requisito vigente o su historia;
// en rm2b la base ya no nombra el correo y la rama no toca src/, con un commit que no nombra el aviso.
function reviewRemoved() {
  let base = reviewBase();
  if (s.SC === 'rm3') {
    cp(join(FIX, 'capabilities-rm', 'bookings-rm3.md'), '.docs/sdd/capabilities/bookings.md');
    s.commit('docs(sdd): fusionar el delta de la 0024 en bookings');
    base = s.git('rev-parse', 'HEAD').trim();
  }
  s.git('checkout', '-q', '-b', 'feature/0025-void-no-mail');
  s.put(`${F25}/spec.md`, readFileSync(join(FIX, 'spec-0025.md'), 'utf8'));
  s.put(`${F25}/plan.md`, readFileSync(join(FIX, 'plan-0025.md'), 'utf8'));
  s.commit('docs(sdd): abrir la feature 0025');
  if (s.SC !== 'rm2b') cp(join(FIX, 'app-rm.js'), 'src/app.js');
  cp(join(FIX, 'void-rm.test.js'), 'test/void.test.js');
  s.commit(s.SC === 'rm2b' ? 'test(bookings): cubrir anular' : 'feat(bookings): anular sin aviso por correo');
  ASK = reviewPackage(base, true);
}
function voidWithReason() {
  s.put(`${F21}/spec.md`, readFileSync(join(FIX, 'spec-0021.md'), 'utf8'));
  s.put(`${F21}/plan.md`, readFileSync(join(FIX, 'plan-0021.md'), 'utf8'));
  s.commit('docs(sdd): abrir la feature 0021');
  cp(join(FIX, 'app-f3.js'), 'src/app.js');
  cp(join(FIX, 'void-f3.test.js'), 'test/void.test.js');
  s.commit('feat(bookings): anular con motivo');
}
function spikeWithResearch() {
  s.put(`${F30}/spec.md`, readFileSync(join(IMPL, 'fixtures', 'spec-0030.md'), 'utf8'));
  s.put(`${F30}/plan.md`, readFileSync(join(IMPL, 'fixtures', 'plan-0030.md'), 'utf8'));
  s.commit('docs(sdd): abrir el spike 0030');
  s.put(`${F30}/evidence/o1.txt`, 'libres en bucle, 2 min 30 s, 0 errores\n');
  s.put(`${F30}/evidence/o3.txt`, 'Prueba hecha por el agente, sin ninguna persona: 12 s\n');
  s.put(`${F30}/research.md`, readFileSync(join(FIX, 'research-sv1.md'), 'utf8'));
  writeFileSync(at('src/app.js'), `${readLf(at('src/app.js'))}
export const kioskMode = true;
`);
  s.commit('docs(sdd): medir el spike 0030');
}
function reviewF3() {
  const base = reviewBase();
  s.git('checkout', '-q', '-b', 'feature/review');
  if (s.SC === 'f4') {
    cp(join(FIX, 'app-f4.js'), 'src/app.js');
    s.commit('feat(bookings): informe de ocupación');
  } else if (s.SC === 'sv1') {
    spikeWithResearch();
  } else if (s.SC === 'f6' || s.SC === 'f6b') {
    appendFileSync(at('src/app.js'), readLf(join(FIX, `app-${s.SC}.js`)));
    s.commit('feat(bookings): guardar la devolución');
  } else {
    voidWithReason();
  }
  ASK = reviewPackage(base, true);
}

// El gate filtrado de la batería de sdd-archive, en develop, con lo que lee cada tarea.
const GATE = 'node scripts/gate.mjs run bookings:test rooms:test --affected --base develop';
function filteredGate(bookingsTests, bookingsInputs) {
  const gate = join(HERE, '..', 'sdd-archive', 'fixtures', 'gate');
  mkdirSync(at('scripts'), { recursive: true });
  cp(join(gate, 'gate.mjs'), 'scripts/gate.mjs');
  cp(join(gate, 'rooms.js'), 'src/rooms.js');
  cp(join(gate, 'rooms.test.js'), 'test/rooms.test.js');
  const tasks = {
    'bookings:test': { command: `node --test ${bookingsTests.join(' ')}`, inputs: ['src/app.js', ...bookingsTests, ...bookingsInputs] },
    'rooms:test': { command: 'node --test test/rooms.test.js', inputs: ['src/rooms.js', 'test/rooms.test.js'] },
  };
  writeFileSync(at('gate.json'), `${JSON.stringify({ tasks })}\n`);
  edit('.docs/sdd/steering/constitution.md', (text) => text.replace('Gate de cierre: `node --test` entero en verde.', `Gate de cierre: \`${GATE}\` en verde.`));
  appendFileSync(at('.git/info/exclude'), '.temp/\n');
  s.commit('chore: gate de cierre filtrado por tareas');
}
// La pasada roja del gate en HEAD, guardada entera donde la guarda el cierre; devuelve su sha.
function redPass(rewrite = (text) => text) {
  const red = short('HEAD');
  const result = spawnSync(s.NODE, GATE.split(' ').slice(1), { cwd: s.R, env: s.env, encoding: 'utf8' });
  if (result.status === 0) s.die('la pasada del gate no salió roja');
  mkdirSync(at('.temp'), { recursive: true });
  writeFileSync(at('.temp/gate-red.log'), rewrite(`$ ${GATE}\n${result.stdout}${result.stderr}`));
  return red;
}
const askWith = (red, fix) => (ASK = ASK.replaceAll('<rojo>', red).replaceAll('<arreglo>', fix));
// t1: dos tests leen el README, que no nombra los comandos; el arreglo solo toca el README.
function redDocs() {
  s.put('test/docs.test.js', "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\n\nconst readme = readFileSync('README.md', 'utf8');\n\ntest('el README nombra cancelar con motivo', () => assert.match(readme, /cancelar <sala> <día> --motivo/));\ntest('el README nombra canceladas', () => assert.match(readme, /canceladas/));\n");
  filteredGate(['test/app.test.js', 'test/cancel.test.js', 'test/docs.test.js'], ['README.md']);
  done0010();
  const red = redPass();
  appendFileSync(at('README.md'), '\n- `cancelar <sala> <día> --motivo <motivo>`\n- `canceladas`\n');
  s.commit('docs: el README nombra cancelar con motivo y canceladas');
  askWith(red, short('HEAD'));
}
// t2: la rama rompe cancelar y toca rooms.js; moon saltó rooms:test por depender de la tarea roja.
function redCode() {
  filteredGate(['test/app.test.js', 'test/cancel.test.js'], []);
  done0010();
  cp(join(IMPL, 'fixtures', 'app-task1.js'), 'src/app.js');
  writeFileSync(at('src/rooms.js'), "export const rooms = ['Norte', 'Sur'].sort();\n");
  s.commit('refactor(bookings): cancelar y salas');
  const red = redPass((text) => {
    if (!/^▪ rooms:test.*$/m.test(text)) s.die('la pasada roja no nombra rooms:test');
    return `${text.replace(/^▪ rooms:test.*$/m, '').trimEnd()}\n▪ rooms:test skipped (depends on bookings:test, which failed)\n`;
  });
  cp(join(IMPL, 'fixtures', 'app-done.js'), 'src/app.js');
  s.commit('fix(bookings): canceladas vuelve a enseñar el motivo');
  askWith(red, short('HEAD'));
}

const steps = {
  t1: redDocs,
  t2: redCode,
  v1: () => {
    openTask1();
    ledger(taskLine(1, `${shas.T0}..${shas.T1}`, '2/2'));
    cp(join(FIX, 'app-v1.js'), 'src/app.js');
    cp(join(IMPL, 'fixtures', 'cancel-done.test.js'), 'test/cancel.test.js');
  },
  s1: () => (ASK = specReview(F22, { capability: 'bookings.md', fixture: 'spec-s1.md' })),
  s1b: () => (ASK = specReview(F23, { capability: 'reports.md', fixture: 'spec-s1b.md' })),
  c1: () => {
    done0010();
    tasksMd();
    copyFileSync(join(FIX, 'review-spec-c1.md'), join(workspace(), 'review-spec.md'));
    copyFileSync(join(FIX, s.SC === 'c7' ? 'review-code-c7.md' : 'review-code-c1.md'), join(workspace(), 'review-code.md'));
  },
  c2: () => {
    done0010();
    fixTrim();
    const B = short('HEAD');
    tasksMd(`Revisión final: Spec opus+high, 1 Minor · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre ${shas.A}`, `Pasada de fix: ${B}, 1 hallazgo RED→GREEN`, `Re-revisión: ${shas.A}..${B}, sdd-kit:effort-high + opus, limpia`);
    s.commit('docs(sdd): tasks.md con la revisión final cerrada');
    emptyListText();
  },
  c3: () => {
    done0010();
    tasksMd(`Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre ${shas.A}`);
    s.commit('docs(sdd): tasks.md con la revisión final');
    emptyListText();
  },
  c4: () => {
    done0010();
    fixTrim();
    const B = short('HEAD');
    tasksMd(`Revisión final: sdd-kit:effort-high + opus, 1 Important, sobre ${shas.A}`, `Pasada de fix: ${B}, 1 hallazgo RED→GREEN`);
    s.commit('docs(sdd): tasks.md con la revisión final');
    emptyListText();
  },
  c5: () => reviewedFix({ app: 'app-c5.js', title: 'fix(bookings): el motivo sin espacios alrededor', verdict: '1 Critical', fixture: 're-review-c5.md' }),
  // El arreglo de la pasada cambia un literal que fija la spec, y deshacerlo devuelve el hallazgo.
  c6: () => reviewedFix({ app: 'app-c6.js', test: 'cancel-c6.test.js', title: 'fix(bookings): canceladas enseña la franja de cada reserva', verdict: '1 Important', fixture: 're-review-c6.md' }),
  // La pasada arregla el recorte y rompe `--motivo` sin valor; el otro Important viene de la revisión final.
  c8: () => reviewedFix({ app: 'app-c8.js', title: 'fix(bookings): el motivo sin espacios alrededor', verdict: '2 Important', fixture: 're-review-c8.md' }),
  // El Minor propone un tope que no es el que fija la spec.
  c9: () => {
    amendSpec((text) => text.replace(/^3\. Sin review de spec[^\n]*$/m, '$&\n4. `canceladas` enseña como mucho las 20 últimas cancelaciones, y con más añade la línea «… y N más» — decidido con el dev-lead en la entrevista.'));
    steps.c1();
    copyFileSync(join(FIX, 'review-spec-c9.md'), join(workspace(), 'review-spec.md'));
  },
  // El Minor pide un literal que contradice una decisión aprobada de la spec.
  c10: () => {
    amendSpec((text) => text.replace(/^3\. Sin review de spec[^\n]*$/m, '$&\n4. `canceladas` separa la sala y el día del motivo con ` — `: `Norte lun — sala ocupada`.'));
    steps.c1();
    copyFileSync(join(FIX, 'review-code-c10.md'), join(workspace(), 'review-code.md'));
  },
  // El mismo Minor, que aplica literal una decisión registrada: se escribe sin parar.
  c10e: () => {
    amendSpec((text) => text.replace(/^## Intent$/m, '### Decisiones tomadas con el dev-lead\n\n- `canceladas` separa con ` - `, porque recepción usa una consola `cp850`: `Norte lun - sala ocupada`. — «Con guion normal, que en recepción la raya sale rota.»\n\n$&'));
    steps.c1();
    copyFileSync(join(FIX, 'review-code-c10.md'), join(workspace(), 'review-code.md'));
  },
  f5: () => {
    const base = hojas0024();
    ASK = reviewPackage(base, false);
  },
  f1: () => {
    mkdirSync(at('.docs/sdd/decisions'), { recursive: true });
    cp(join(HERE, '..', 'sdd-propose', 'fixtures', 'adr-0003-bookings-in-memory.md'), '.docs/sdd/decisions/0003-bookings-in-memory.md');
    s.commit('docs(decisions): las reservas viven en memoria');
    done0010();
  },
  // La regla de confirmar antes de paralelizar, del usuario, y una spec aprobada con su política de modelos.
  // La línea va en la spec que se aprobó: añadida en un commit posterior, 1 de 2 sujetos no la contó como aprobada (con razón).
  mp1: () => {
    amendSpec((text) => text.replace(/^## Decisiones que he tomado yo — valida estas$/m, '$&\n\n- Política de modelos (solo en `delegate`): revisores de la spec ninguno · ejes de la revisión final Spec opus+high, Código sonnet+high, Arquitectura no (plan) · en paralelo hasta `control.maxParallelAgents`'));
    done0010();
    s.env.APPEND_SYSTEM = 'Instrucciones del usuario: antes de paralelizar subagentes o workflows, justifica qué modelo va a cada tarea y pide confirmación.';
  },
};
steps.c1f = steps.c1;
// `--desde` entra en la spec: sin él, el sujeto para por freno de alcance y no llega al test.
steps.c7 = () => {
  amendSpec((text) => text.replace('comando `canceladas`.', 'comando `canceladas`, con `--desde <día>` para listar desde ese día.'));
  steps.c1();
};
steps.f2 = steps.f1;
for (const id of ['f3', 'f3n', 'f4', 'f6', 'f6b', 'sv1']) steps[id] = reviewF3;
for (const id of REMOVED_SCENARIOS) steps[id] = reviewRemoved;
steps[s.SC]?.();

const axisSubjects = ['f3', 'f3n', 'f4', 'f5', 'f6', 'f6b', 's1', 's1b', 'sv1', ...REMOVED_SCENARIOS];
if (['v1', ...axisSubjects].includes(s.SC)) s.env.EXTRA_DISALLOWED = 'Agent';
const turns = { f1: '30', f2: '30', mp1: '30', c2: '30', c3: '30', c4: '30' };
for (const id of axisSubjects) turns[id] = '25';
for (const id of ['c1', 'c1f', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c10e']) turns[id] = '50';
s.env.MAX_TURNS ||= turns[s.SC] ?? '40';

await s.launch(ASK);
const keepIf = (path, name) => existsSync(at(path)) && s.keep(at(path), name);
for (const kept of ['spec', 'plan', 'tasks', 'walkthrough']) keepIf(`${F10}/${kept}.md`, `${kept}.md`);
for (const test of existsSync(at('test')) ? readdirSync(at('test')).filter((file) => file.endsWith('.js')) : []) keepIf(`test/${test}`, test);
keepIf('src/app.js', 'app.js');
if (s.SC === 'f5') s.keep(at('e2e/0024-remember-filter.spec.ts'), '0024-remember-filter.spec.ts');
const sddTemp = at('.temp/sdd');
for (const plan of existsSync(sddTemp) ? readdirSync(sddTemp).sort() : []) keepIf(`.temp/sdd/${plan}/progress.md`, 'progress.md');
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## commits con sus ficheros\n${s.git('log', '--stat', '--format=--- %h %s', 'develop..HEAD')}`);
