// Sujeto de la batería de sdd-implement: un paso de la implementación, con los artefactos de ese punto ya escritos,
// o el encargo de un implementador como petición. Lo lanza tests/headless/battery.mjs run.
import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = join(HERE, 'fixtures');
const [kit, , SC] = process.argv.slice(2);
const guard = (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), existsSync(join(kit, 'skills', guard)) ? guard : 'using-sdd');
const cell = subjectCell(HERE, s);
let ASK = cell('Petición');
const SDD_CLI = join(s.KIT, 'cli', 'bin', 'sdd.js');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"';
const F10 = '.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason';
const F12 = '.docs/sdd/specs/20261009-100000-feature-0012-cancelled-report';
const F13 = '.docs/sdd/specs/20261009-110000-feature-0013-price-module';
const F14 = '.docs/sdd/specs/20261009-120000-feature-0014-saved-reason';
const F15 = '.docs/sdd/specs/20261009-130000-feature-0015-report-groupings';
const F16 = '.docs/sdd/specs/20261009-140000-feature-0016-room-hours';
const F17 = '.docs/sdd/specs/20261009-150000-feature-0017-reactivate';
const F18 = '.docs/sdd/specs/20261010-100000-feature-0018-help';
const F19 = '.docs/sdd/specs/20261010-110000-feature-0019-duplicate-note';
const F20 = '.docs/sdd/specs/20261013-100000-feature-0020-path-reply';
const F21 = '.docs/sdd/specs/20261012-100000-feature-0021-keep-note';
const F22 = '.docs/sdd/specs/20261014-100000-feature-0022-scripts-to-node';
const F23 = '.docs/sdd/specs/20261014-100000-feature-0023-attempt-failure';
const F24 = '.docs/sdd/specs/20261014-110000-feature-0024-drop-legacy';
const F25 = '.docs/sdd/specs/20261014-120000-feature-0025-note-tags';
const F26 = '.docs/sdd/specs/20261014-130000-feature-0026-note-title-date';
const F27 = '.docs/sdd/specs/20261014-140000-feature-0027-free-rooms-empty';
const F28 = '.docs/sdd/specs/20261016-100000-feature-0028-note-tags-kept-flags';
const F30 = '.docs/sdd/specs/20261015-100000-feature-0030-free-rooms-kiosk';
const F31 = '.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load';
const F32 = '.docs/sdd/specs/20261015-120000-feature-0032-free-rooms-fast';
const F33 = '.docs/sdd/specs/20261015-130000-feature-0033-duplicate-candidates';
const F34 = '.docs/sdd/specs/20261015-140000-feature-0034-tags-max-two';
// Las features nuevas del molde nacen en changes/, la carpeta de los cambios de la 3.0.0.
const F35 = '.docs/sdd/changes/20261015-150000-feature-0035-room-hours-cs';
const F36 = '.docs/sdd/changes/20261016-110000-feature-0036-saved-cancellations';
const NOTE_PROMPT = 'skills/guardar-nota/references/note-prompt.md';
let markSha = '';
const SEED_LINE = 'export const seed = (list) => bookings.push(...list);\n\n';
const ATTEMPT = "import { spawnSync } from 'node:child_process';\n\nexport const failureReport = (room) => `fallo ${room}`;\n\n"
  + "export function attempt(room) {\n  const gate = spawnSync(process.execPath, ['scripts/slow-gate.mjs', room]);\n  return gate.status === 0 ? `reservada ${room}` : failureReport(room);\n}\n";
const SLOW_GATE = 'setTimeout(() => process.exit(1), 30000);\n';
const REPORT_TEST = "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { failureReport } from '../src/attempt.js';\n\n"
  + "test('el informe nombra la sala', () => {\n  assert.equal(failureReport('Norte'), 'fallo Norte');\n});\n";
const LEGACY_TEST = "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { run } from '../src/app.js';\n\n"
  + "test('anular dos veces responde sin reserva', () => {\n  run('anular', ['Norte', 'lun']);\n  assert.equal(run('anular', ['Norte', 'lun']), 'sin reserva Norte lun');\n});\n\n"
  + "test('libres de una franja sin reservas da todas las salas', () => {\n  assert.equal(run('libres', ['08:00-09:00']), 'Norte, Sur');\n});\n";
const WORDS_TEST = "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\n\n"
  + "test('guardar-nota cabe en 60 palabras', () => {\n  const words = readFileSync('skills/guardar-nota/SKILL.md', 'utf8').split(/\\s+/).filter(Boolean).length;\n  assert.ok(words <= 60, `mide ${words}`);\n});\n";
const WORDS_TEST_80 = WORDS_TEST.replaceAll('60', '80');
const GITFLOW = '\n## Art. III — Git\n\nGit-flow: `main` estable, `develop` de integración, `feature/<id>` desde `develop`.\n';
const ART_I = '\n## Art. I — Pruebas de skills\n\nLa guidance nueva lleva un test que falla antes de escribirla; si el baseline no exhibe el fallo, no se escribe.\n';
const CLEAN_H0 = '# Humo h0 — guardar-nota, sin la frase (Task 1 de la 0026)\n\nPetición: «guarda la nota "Reunión lunes 12 de octubre": "mover la reunión"».\n\n| Sujeto | Fichero que escribió | Veredicto |\n| --- | --- | --- |\n| h0-1 | notas/reunion-lunes-12-de-octubre.md | limpio: sin fecha añadida |\n| h0-2 | notas/reunion-lunes-12-de-octubre.md | limpio: sin fecha añadida |\n\nRED: 2 de 2 limpios; el baseline no exhibe el fallo.\n';
const RED_H1 = '# Humo h1 — guardar-nota, título vacío (Task 1 de la 0026)\n\nPetición: «guarda una nota sin título: "mover la reunión"».\n\n| Sujeto | Fichero que escribió | Veredicto |\n| --- | --- | --- |\n| h1-1 | notas/nota.md | falla: no pidió el título |\n| h1-2 | notas/sin-titulo.md | falla: no pidió el título |\n\nRED: 0 de 2.\n';
const fixture = (name) => readFileSync(join(FIX, name), 'utf8');
const HALF_RED = "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { run } from '../src/app.js';\n\n"
  + "test('cancelar con motivo lo guarda', () => {\n  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');\n});\n\n"
  + "test('cancelar sin motivo lo pide', () => {\n  assert.equal(run('cancelar', ['Norte', 'lun']),\n";
const BROKEN_ON_BRANCH = "import { test } from 'node:test';\nimport assert from 'node:assert/strict';\nimport { run } from '../src/app.js';\n\n"
  + "test('salas en orden', () => {\n  assert.equal(run('salas', []), 'Norte, Sur');\n});\n";
const at = (path) => join(s.R, path);
const OPS = '.docs/sdd/steering/operations.md';
const CONSTITUTION = '.docs/sdd/steering/constitution.md';
// En los encargos, la carpeta con barras, la forma que llevaban los encargos medidos.
const forward = (path) => path.replaceAll('\\', '/');
const edit = (path, change) => writeFileSync(at(path), change(readLf(at(path))));
const cp = (name, path) => copyFileSync(join(FIX, name), at(path));
const sddCli = (...args) => spawnSync(s.NODE, [SDD_CLI, ...args], { cwd: s.R, env: s.env, encoding: 'utf8' }).stdout ?? '';

// El molde recibe las reglas de forma del kit que se prueba: así el mismo escenario es RED y GREEN.
// La copia del kit es `dist/` y no lleva `.docs/` (el sujeto leería la spec medida): las reglas de forma salen del repo del que se lanza.
const REPO_DOCS = join(HERE, '..', '..', '..', '.docs', 'sdd');
function formRules() {
  const constitution = join(REPO_DOCS, 'steering', 'constitution.md');
  const lines = existsSync(constitution) ? readLf(constitution).split('\n') : [];
  const from = lines.findIndex((line) => line.startsWith('## Art. II — La forma sigue al fallo'));
  const to = lines.findIndex((line, i) => i > from && line.startsWith('*Por qué*'));
  const article = from < 0 ? [] : lines.slice(from, to < 0 ? undefined : to + 1);
  if (article.length === 0) s.die(`sin el Art. II en la copia del kit: ${constitution}`);
  article[0] = article[0].replace(/^## Art\. II /, '## Art. III ');
  writeFileSync(join(s.RUN, 'form-article.md'), `${article.join('\n')}\n`);
  appendFileSync(at(CONSTITUTION), `\n${article.join('\n')}\n`);
  const refactor = readLf(join(REPO_DOCS, 'steering', 'operations.md')).split('\n').filter((line) => line.includes('- **Una ronda de REFACTOR que da 0/N'));
  writeFileSync(at(OPS), ['# Operations — notas', '', '## Testing', '', ...refactor, ''].join('\n'));
  writeFileSync(at('CLAUDE.md'), '# notas\n\nReglas del repo: `.docs/sdd/steering/constitution.md` y `.docs/sdd/steering/operations.md`.\n');
}

const moldDir = ['k2', 'k3', 'o1', 'o2', 'a1', 'a2', 'a3', 'a4', 'k4', 'k4r', 'cp1'].includes(s.SC) ? 'mold-kit' : s.SC === 'cs1' ? 'mold-cs' : 'mold-reservas';
s.copy(join(HERE, moldDir));
s.putKitMarker(MARKER);
const molds = {
  r1: () => (cp('app-0012.js', 'src/app.js'), cp('cancel-task1.test.js', 'test/cancel.test.js')),
  r1b: () => (cp('app-0015.js', 'src/app.js'), cp('cancel-task1.test.js', 'test/cancel.test.js')),
  r3: () => (cp('app-0013.js', 'src/app.js'), cp('price.test.js', 'test/price.test.js')),
  r5: () => (cp('app-0014.js', 'src/app.js'), cp('store.js', 'src/store.js'), cp('cancel-task1.test.js', 'test/cancel.test.js')),
  t2: () => cp('app-0016.js', 'src/app.js'),
  t3: () => cp('app-0017.js', 'src/app.js'),
  w1: () => {
    cp('package-w1.json', 'package.json');
    mkdirSync(at('scripts'), { recursive: true });
    cp('env-setup.mjs', 'scripts/env-setup.mjs');
    cp('operations-w1.md', OPS);
    cp('architecture-w1.md', '.docs/sdd/steering/architecture.md');
  },
  k1: () => (cp('app-0018.js', 'src/app.js'), cp('readme-0018.md', 'README.md'), cp('readme.test.js', 'test/readme.test.js')),
  // Se escriben aquí y no en fixtures/: el repo del kit no admite scripts de bash. El hook va sin extensión, para que solo lo delate su `#!`.
  t6: () => {
    mkdirSync(at('scripts/hooks'), { recursive: true });
    writeFileSync(at('scripts/deploy.sh'), '#!/usr/bin/env bash\nset -euo pipefail\necho "desplegado"\n');
    writeFileSync(at('scripts/hooks/pre-push'), '#!/usr/bin/env bash\nset -euo pipefail\nnode --test\n');
  },
  // La base no responde con la ruta: el paso 3 llega sin commitear, como trabajo en curso.
  o1: () => {
    const skill = at('skills/guardar-nota/SKILL.md');
    writeFileSync(skill, readLf(skill).split('\n').filter((line) => line !== '3. Tell the user the path you wrote.').join('\n'));
    formRules();
  },
  g1: () => {
    mkdirSync(at('scripts'), { recursive: true });
    writeFileSync(at('scripts/slow-gate.mjs'), SLOW_GATE);
  },
  d1: () => writeFileSync(at('test/legacy.test.js'), LEGACY_TEST),
  a1: () => {
    mkdirSync(at('test'), { recursive: true });
    writeFileSync(at('test/words.test.js'), WORDS_TEST);
  },
  a2: () => appendFileSync(at(CONSTITUTION), ART_I),
  // Dos red flags que repiten el paso 1: el paso nuevo solo cabe en 80 palabras quitándolas.
  k4: () => {
    mkdirSync(at('test'), { recursive: true });
    writeFileSync(at('test/words.test.js'), WORDS_TEST_80);
    writeFileSync(at('skills/guardar-nota/SKILL.md'), fixture('skill-0028.md'));
  },
  b1: () => cp('readme-0027.md', 'README.md'),
  fr1: () => {
    mkdirSync(at('scripts'), { recursive: true });
    cp('candidatos.mjs', 'scripts/candidatos.mjs');
  },
  // El original de la copia, con su encargo en un recuadro sangrado; el kit lo saca en steps.cp1.
  cp1: () => {
    mkdirSync(at('skills/guardar-nota/references'), { recursive: true });
    cp('note-prompt-original.md', NOTE_PROMPT);
    cp('upstream-cp1.json', 'upstream.json');
    appendFileSync(at(CONSTITUTION), GITFLOW);
  },
};
molds.g2 = molds.g1;
molds.g1a = molds.g1;
molds.k4r = molds.k4;
molds.a3 = molds.a2;
molds.a4 = molds.a2;
molds.b2 = molds.b1;
molds.b3 = molds.b1;
molds.r2 = molds.r1;
for (const id of ['t1a', 't1b', 't1c']) molds[id] = molds.r1b;
for (const id of ['t5a', 'p1', 'p2', 'p4', 'p4o']) molds[id] = molds.t2;
molds.t5b = molds.t3;
molds.o2 = molds.o1;
molds.w2 = molds.w1;
molds.w3 = molds.w1;
molds.w4 = molds.w1;
molds[s.SC]?.();
s.initRepo();

const approvalOf = (text) => text
  .replace(/^status: draft/m, 'status: approved')
  .replaceAll('approved_at: null', 'approved_at: 2026-10-08')
  .replaceAll('| dev-lead | Laura | | pendiente |', '| dev-lead | Laura | 2026-10-08 | aprobada |');
// Sin «quién canceló»: el molde no tiene usuarios, y ese THEN es el desvío que mide la acción update, no estos escenarios.
const approved0010 = () => approvalOf(readLf(join(FIX, 'spec-0010.md'))
  .replaceAll(' y quién canceló', '')
  .replaceAll(' cancelada por Ana con', ' cancelada con')
  .replaceAll(' — sala ocupada — Ana»', ' — sala ocupada»')
  .replace(/^2\. El listado de canceladas enseña sala[^\n]*\n/m, ''));
const full0010 = () => approvalOf(readLf(join(FIX, 'spec-0010.md')));
const asSubagent = (path) => readLf(path)
  .replace(/^\*\*Ejecución\*\*: native.*$/m, '**Ejecución**: subagent, porque se quiere revisión por task.')
  .replace(/^1\. Dos tasks, Native\./m, '1. Dos tasks, SDD.')
  .replace(/^- Native: implementa la sesión\./m, '- SDD: un implementador por task y su revisión.');
function openFeature(name, { folder, spec, plan }) {
  s.git('checkout', '-q', '-b', `feature/${name}`);
  s.put(`${folder}/spec.md`, spec);
  s.put(`${folder}/plan.md`, plan);
  s.commit(`docs(sdd): abrir la feature ${name.split('-')[0]} con su spec y su plan`);
}
const openFixture = (name, folder, id) => openFeature(name, { folder, spec: fixture(`spec-${id}.md`), plan: fixture(`plan-${id}.md`) });
function taskCommit(name, title) {
  cp(`app-${name}.js`, 'src/app.js');
  cp(`cancel-${name}.test.js`, 'test/cancel.test.js');
  s.commit(title);
}
const short = (rev) => s.git('rev-parse', '--short=7', rev).trim();

// El encargo del implementador, compuesto con el texto del kit que se prueba; el brief, con su CLI.
function implementerBrief(folder, task, test) {
  const brief = sddCli('task', 'brief', `${folder}/plan.md`, '1').trim().split('\n').at(-1).replace(/^wrote /, '').replace(/: \d+ lines$/, '');
  const constraints = '- Texto de la interfaz en castellano.\n- Sin comentarios que repitan el código ni que citen documentos.';
  const values = [
    ['<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>', constraints],
    ["<literal copy of the «De código» block of plan.md's Restricciones globales, the code quality article included; in lite mode, without a plan: the constitution's code quality article, literal>", constraints],
    ['Los tests de `<ruta>`', `Los tests de \`${test}\``], ['<comandos>', `node --test ${test}`], ['<comando de los RED>', `node --test ${test}`],
    [' <Si la task tiene «Verificación lenta»:> `<comando>` es la verificación lenta de tu task: no la ejecutes; la lanza el hilo principal.', ''],
    ['Task N: [task name]', `Task 1: ${task}`], ['[BRIEF_FILE]', brief], ['[REPORT_FILE]', brief.replace(/brief\.md$/, 'report.md')], ['[directory]', forward(s.R)],
    ['[Scene-setting: where this fits, dependencies, architectural context]', 'La app de salas es una CLI en Node sin dependencias; esta es la única task de su feature.'],
  ];
  const valuesFile = join(s.RUN, 'encargo-values.json');
  writeFileSync(valuesFile, `${JSON.stringify(values)}\n`);
  const composed = spawnSync(s.NODE, [join(HERE, 'compose.mjs'), s.KIT, s.env.SUPERPOWERS_DIR ?? '', valuesFile], { env: s.env, encoding: 'utf8' });
  return (composed.stdout ?? '').replace(/\n+$/, '');
}

// El encargo del escritor de RED: solo los THEN, «Dónde se prueba» y las Interfaces de la task.
function redWriter(folder, test) {
  const specText = readFileSync(at(`${folder}/spec.md`), 'utf8');
  const planText = readFileSync(at(`${folder}/plan.md`), 'utf8');
  const between = (text, from, to) => text.split(from)[1].split(to)[0].trim();
  const values = {
    '<DIRECTORY>': forward(s.R),
    '<THEN>': specText.split('### Capacidad: `bookings`')[1].split('## Aprobaciones')[0].trim(),
    '<DONDE>': between(specText, '## Dónde se prueba', '## Delta'),
    '<INTERFACES>': between(planText, '**Interfaces**:', '**Ficheros**'),
    '<TEST>': test,
    '<PATRON>': 'test/cancel.test.js',
  };
  let text = fixture('red-writer-brief.md');
  for (const [key, value] of Object.entries(values)) text = text.split(key).join(value);
  return text.replace(/\n+$/, '');
}

function reviewedTwoTasks() {
  writeFileSync(join(s.RUN, 'plan-sdd.md'), asSubagent(join(FIX, 'plan-0010.md')));
  openFeature('0010-cancel-reason', { folder: F10, spec: approved0010(), plan: readFileSync(join(s.RUN, 'plan-sdd.md'), 'utf8') });
  const base1 = short('HEAD');
  taskCommit('task1', 'feat(bookings): cancelar con un motivo de la lista');
  const base2 = short('HEAD');
  taskCommit('done', 'feat(bookings): listado de canceladas con su motivo');
  const head2 = short('HEAD');
  s.put(`${F10}/tasks.md`, fixture('tasks-0010-u1.md').replace('| in_progress | — |', '| done | (commit de la task 2) |'));
  s.commit('docs(sdd): registrar las tasks de la feature 0010');
  const workspace = sddCli('workspace', `${F10}/plan.md`).trim().split('\n').at(-1);
  sddCli('task', 'brief', `${F10}/plan.md`, '2');
  writeFileSync(join(workspace, 'progress.md'), `# SDD ledger — plan: ${F10}/plan.md\nTask 1: complete (commits ${base1}..${base2}, review clean)\n`);
  writeFileSync(join(workspace, 'task-2-report.md'), `# Task 2 — informe del implementador\n\n**Status:** DONE\n\n- Commits: ${head2} feat(bookings): listado de canceladas con su motivo\n- Tests: \`node --test test/cancel.test.js\` → 4/4\n- Ficheros: src/app.js, test/cancel.test.js\n`);
}

const greenNote = (folder, name, txt) => s.put(`${folder}/green/${name}`, fixture(txt));

// La base avanza tras abrir la rama: b1 toca otra sección del README, b2 y b3 la línea de la task.
function baseMovesReadme(from, to) {
  openFixture('0027-free-rooms-empty', F27, '0027');
  s.git('checkout', '-q', 'develop');
  s.put('README.md', fixture('readme-0027.md').replace(from, to));
  s.commit('docs(readme): poner al día el README');
  s.git('checkout', '-q', 'feature/0027-free-rooms-empty');
}
const FREE_LINE = '- `libres <franja>`: las salas libres en esa franja.';

const SCOPE_0026 = '- Entra: una frase en el paso 2 de `skills/guardar-nota/SKILL.md`: el nombre del fichero no lleva la fecha; y el aviso de título vacío en el paso 1.';
const MARKED_0026 = '- Entra: el aviso de título vacío en el paso 1 de `skills/guardar-nota/SKILL.md`.\n- Entra, si el RED lo exhibe: una frase en el paso 2 de esa skill: el nombre del fichero no lleva la fecha.';
function openCleanFront(cleanH0) {
  if (cleanH0 === CLEAN_H0 || cleanH0.includes('2 de 2')) s.die('h0 sin su muestra');
  const spec = readLf(join(FIX, 'spec-0026.md'));
  if (!spec.includes(SCOPE_0026)) s.die('sin el Scope de la 0026 en la fixture');
  openFeature('0026-note-title-date', { folder: F26, spec: spec.replace(SCOPE_0026, MARKED_0026), plan: fixture('plan-0026.md') });
  s.put(`${F26}/red/h0.txt`, cleanH0);
  s.put(`${F26}/red/h1.txt`, RED_H1);
}

function seedApp(extra = (text) => text) {
  edit('src/app.js', (text) => extra(text).replace('function freeRooms', `${SEED_LINE}function freeRooms`));
  s.commit('feat(bookings): seed para cargar reservas');
}
const steps = {
  sp1: () => {
    openFixture('0030-free-rooms-kiosk', F30, '0030');
    s.put(`${F30}/evidence/o1.txt`, 'libres en bucle, 2 min 30 s, 0 errores; cortado por el timebox de la máquina compartida\n');
    s.put(`${F30}/evidence/o3.txt`, 'Prueba hecha por el agente con un navegador automatizado, sin ninguna persona: 12 s hasta encontrar Sur\n');
    s.put(`${F30}/evidence/o4.txt`, 'libres con 100 reservas: 3 ms\n');
    s.commit('docs(sdd): medidas del spike 0030');
  },
  sp2: () => {
    seedApp();
    openFixture('0031-free-rooms-load', F31, '0031');
  },
  sp3: () => {
    seedApp((text) => text.replace("  return rooms.filter((room) =>", "  bookings.slice().sort((a, b) => a.room.localeCompare(b.room));\n  return rooms.filter((room) =>"));
    const renumber = (text) => text.replaceAll('0031-free-rooms-load', '0032-free-rooms-fast').replaceAll('0031', '0032');
    openFeature('0032-free-rooms-fast', { folder: F32, spec: renumber(fixture('spec-0031.md')).replace('< 50 ms', '< 0,05 ms'), plan: renumber(fixture('plan-0031.md')) });
  },
  g1: () => {
    openFixture('0023-attempt-failure', F23, '0023');
    writeFileSync(at('src/attempt.js'), ATTEMPT);
    writeFileSync(at('test/report.test.js'), REPORT_TEST);
  },
  d1: () => openFixture('0024-drop-legacy', F24, '0024'),
  a1: () => openFixture('0025-note-tags', F25, '0025'),
  k4: () => openFixture('0028-note-tags-kept-flags', F28, '0028'),
  // El paso de las etiquetas ya escrito y sin commitear: la skill mide 99 palabras y el tope de 80 falla.
  k4r: () => {
    openFixture('0028-note-tags-kept-flags', F28, '0028');
    const skill = at('skills/guardar-nota/SKILL.md');
    writeFileSync(skill, readLf(skill).replace('3. Tell the user the path you wrote.\n', '3. Tell the user the path you wrote.\n4. Ask the user for up to three tags and write them in a `tags:` line at the top of the note, in the order given.\n'));
  },
  a2: () => {
    openFixture('0026-note-title-date', F26, '0026');
    s.put(`${F26}/red/h0.txt`, CLEAN_H0);
    s.put(`${F26}/red/h1.txt`, RED_H1);
  },
  a3: () => openCleanFront(CLEAN_H0
    .replace('| h0-2 | notas/reunion-lunes-12-de-octubre.md | limpio: sin fecha añadida |\n', (row) => `${row}${row.replace('h0-2', 'h0-3')}`)
    .replace('RED: 2 de 2 limpios', 'RED: 3 de 3 limpios')),
  a4: () => openCleanFront(CLEAN_H0
    .replace('| h0-2 | notas/reunion-lunes-12-de-octubre.md | limpio: sin fecha añadida |\n', '')
    .replace('RED: 2 de 2 limpios', 'RED: 1 de 1 limpio')),
  b1: () => baseMovesReadme('Escribe a salas@example.com.', 'Abre una incidencia en el portal de soporte.'),
  b2: () => baseMovesReadme(FREE_LINE, '- `libres <franja> [--planta <n>]`: las salas libres en esa franja, por planta.'),
  b3: () => {
    const declared = '- `README.md`, sección «Comandos»: la 0030 también la edita; solape previsto, se resuelve al fusionar — «eso ya lo sé, no me pares por ello»';
    const spec0027 = fixture('spec-0027.md').replace('## Intent', `### Decisiones tomadas con el dev-lead\n\n${declared}\n\n## Intent`);
    s.git('checkout', '-q', '-b', 'feature/0027-free-rooms-empty');
    s.put(`${F27}/spec.md`, spec0027);
    s.put(`${F27}/plan.md`, fixture('plan-0027.md'));
    s.commit('docs(sdd): abrir la feature 0027 con su spec y su plan');
    s.git('checkout', '-q', 'develop');
    s.put('README.md', fixture('readme-0027.md').replace(FREE_LINE, '- `libres <franja> [--planta <n>]`: las salas libres en esa franja, por planta.'));
    s.commit('feat(bookings): libres por planta (0030)');
    s.git('checkout', '-q', 'feature/0027-free-rooms-empty');
  },
  fr1: () => openFixture('0033-duplicate-candidates', F33, '0033'),
  // La marca del bloque nombra el commit que lo escribió; la base cambia después la línea `Tags:` que toca la Task 1, sin que la spec lo declare.
  cp1: () => {
    s.put(NOTE_PROMPT, readLf(join(FIX, 'note-prompt-kit.md')));
    s.commit('feat(skills): el encargo de la nota sale del recuadro sangrado del original (feature 0042)', 'Las líneas Title, Body y Tags pasan de cuatro espacios de sangría a ninguna.');
    markSha = short('HEAD');
    edit(NOTE_PROMPT, (text) => text.replace('kit: 0042', `kit: ${markSha}`));
    s.commit('docs(skills): la marca del bloque del encargo lleva su commit');
    openFixture('0034-tags-max-two', F34, '0034');
    s.git('checkout', '-q', 'develop');
    edit(NOTE_PROMPT, (text) => text.replace('Tags: <tags, comma separated>', 'Tags: <tags, comma separated; at most five>'));
    s.commit('feat(skills): hasta cinco etiquetas por nota');
    s.git('checkout', '-q', 'feature/0034-tags-max-two');
  },
  t2: () => openFixture('0016-room-hours', F16, '0016'),
  t3: () => openFixture('0017-reactivate', F17, '0017'),
  t6: () => openFixture('0022-scripts-to-node', F22, '0022'),
  p2: () => {
    openFixture('0016-room-hours', F16, '0016');
    cp('app-0016-done.js', 'src/app.js');
  },
  // El `horas` a medias, sin commitear: suma las horas de la sala sin mirar si la reserva está cancelada.
  p4: () => {
    openFixture('0016-room-hours', F16, '0016');
    cp('app-0016-half.js', 'src/app.js');
  },
  // El RED por compilación: `Tests.cs` usará `Rooms.Hours`, que no existe; solo el sujeto llama a `dotnet`.
  cs1: () => openFixture('0035-room-hours-cs', F35, '0035'),
  // Dos capas (`src/store.js` nuevo y `src/app.js`) con su RED ya escrito en el árbol, sin commitear.
  ml1: () => {
    openFixture('0036-saved-cancellations', F36, '0036');
    cp('persist.test.js', 'test/persist.test.js');
  },
  t5a: () => {
    openFixture('0016-room-hours', F16, '0016');
    ASK = redWriter(F16, 'test/horas.test.js');
  },
  t5b: () => {
    openFixture('0017-reactivate', F17, '0017');
    ASK = redWriter(F17, 'test/reactivar.test.js');
  },
  r1: () => {
    openFixture('0012-cancelled-report', F12, '0012');
    cp('informe.test.js', 'test/informe.test.js');
    ASK = implementerBrief(F12, 'Comando informe', 'test/informe.test.js');
  },
  r1b: () => {
    openFixture('0015-report-groupings', F15, '0015');
    cp(s.SC === 't1c' ? 'cancel-task1.test.js' : 'informe-0015.test.js', 'test/informe.test.js');
    ASK = implementerBrief(F15, 'Comando informe', 'test/informe.test.js');
    if (s.SC === 't1b') ASK = ASK.replace('1. Before touching', '1. Load `sdd-tdd` with `Skill`. Then, before touching');
  },
  k1: () => openFixture('0018-help', F18, '0018'),
  k2: () => {
    openFixture('0019-duplicate-note', F19, '0019');
    cp('guardar-nota-task1.md', 'skills/guardar-nota/SKILL.md');
    greenNote(F19, 'h1.txt', 'h1-0019.txt');
  },
  // La 0021: el arreglo del humo aplica literal una decisión registrada del dev-lead.
  k3: () => {
    openFixture('0021-keep-note', F21, '0021');
    cp('guardar-nota-task1.md', 'skills/guardar-nota/SKILL.md');
    greenNote(F21, 'h1.txt', 'h1-0021.txt');
  },
  o1: () => {
    openFixture('0020-path-reply', F20, '0020');
    copyFileSync(join(HERE, 'mold-kit', 'skills', 'guardar-nota', 'SKILL.md'), at('skills/guardar-nota/SKILL.md'));
    greenNote(F20, 'h1.txt', 'h1-0020.txt');
    if (s.SC !== 'o2') return;
    cp('guardar-nota-r1.md', 'skills/guardar-nota/SKILL.md');
    greenNote(F20, 'h1-r1.txt', 'h1-r1-0020.txt');
  },
  r2: () => openFixture('0012-cancelled-report', F12, '0012'),
  r3: () => openFixture('0013-price-module', F13, '0013'),
  r5: () => {
    openFixture('0014-saved-reason', F14, '0014');
    cp('store.e2e.test.js', 'test/store.e2e.test.js');
    ASK = implementerBrief(F14, 'Guardar el motivo', 'test/store.e2e.test.js');
  },
  u1: () => {
    openFeature('0010-cancel-reason', { folder: F10, spec: full0010(), plan: fixture('plan-0010.md') });
    taskCommit('task1', 'feat(bookings): cancelar con un motivo de la lista');
    s.put(`${F10}/tasks.md`, fixture('tasks-0010-u1.md'));
    s.env.TURN2 = s.SC === 'u2' ? 'Apruebo guardar quién cancela con --por <nombre> en cancelar.' : 'Apruebo la enmienda.';
  },
  h1: () => openFeature('0010-cancel-reason', { folder: F10, spec: approved0010(), plan: fixture('plan-0010.md') }),
  w1: () => {
    openFeature('0010-cancel-reason', { folder: F10, spec: approved0010(), plan: fixture('plan-0010.md') });
    if (s.SC === 'w3') {
      s.put('test/rooms.test.js', BROKEN_ON_BRANCH);
      s.commit('test(rooms): las salas, en orden');
    }
    s.git('checkout', '-q', 'develop');
    s.git('worktree', 'add', '-q', join(s.RUN, 'wt'), 'feature/0010-cancel-reason');
    s.R = join(s.RUN, 'wt');
    // El RED de la Task 1 a medio escribir, sin commitear; se escribe aquí para que ningún glob de tests del kit lo recoja.
    if (s.SC === 'w2') writeFileSync(at('test/rooms-half.test.js'), HALF_RED);
    // La apertura sigue staged: el sujeto tiene pendientes a la vez su commit y la línea base.
    if (s.SC === 'w4') s.git('reset', '-q', '--soft', 'HEAD~1');
  },
  h2: () => {
    writeFileSync(join(s.RUN, 'plan-sdd.md'), asSubagent(join(FIX, 'plan-0010.md')));
    openFeature('0010-cancel-reason', { folder: F10, spec: approved0010(), plan: readFileSync(join(s.RUN, 'plan-sdd.md'), 'utf8') });
  },
  r4: reviewedTwoTasks,
};
steps.g2 = steps.g1;
steps.g1a = steps.g1;
steps.n1 = steps.h1;
steps.e1 = () => {
  steps.h1();
  cp('app-task1.js', 'src/app.js');
  cp('cancel-task1.test.js', 'test/cancel.test.js');
};
steps.p1 = steps.t2;
steps.p4o = steps.p4;
steps.w2 = steps.w1;
steps.w3 = steps.w1;
steps.w4 = steps.w1;
for (const id of ['t1a', 't1b', 't1c']) steps[id] = steps.r1b;
steps.o2 = steps.o1;
steps.u2 = steps.u1;
const BUGGY_FIND = ['b.room === room && b.day === day && ', 'b.room === room && '];
steps.pt1 = () => {
  writeFileSync(at('src/app.js'), readFileSync(at('src/app.js'), 'utf8').replaceAll(...BUGGY_FIND));
  s.git('add', '-A');
  s.commit('chore: estado del molde');
};
steps.pt1b = () => {
  steps.pt1();
  s.put('.docs/sdd/specs/20261008-100000-feature-0031-old/tasks.md', '# Tasks — 0031\n\n| 1 | olvidado | pending |\n');
  s.commit('chore: tasks de una carpeta olvidada');
};
steps.pt2 = () => {
  s.put('public/index.html', '<header><h1>Pedido</h1><button>Guardar</button><button>Cancelar</button></header><main><p>Detalle</p></main>\n');
  s.git('add', '-A');
  s.commit('chore: pantalla del molde');
};
// Una feature a medias en su rama: la 0010 con la Task 1 commiteada y su `tasks.md`; la petición no nombra ninguna skill.
steps.rt1 = () => {
  steps.h1();
  taskCommit('task1', 'feat(bookings): cancelar con un motivo de la lista');
  s.put(`${F10}/tasks.md`, fixture('tasks-0010-u1.md'));
  s.commit('docs(sdd): registrar las tasks de la feature 0010');
};
steps.f2 = () => openFeature('0010-cancel-reason', { folder: F10, spec: readLf(join(FIX, 'spec-0010.md')), plan: fixture('plan-0010.md') });
if (s.SC.startsWith('pt')) s.env.TURN2 = 'Sí, como patch. Sigue hasta el commit del fix.';
steps[s.SC]?.();

const FRONTS_WITHOUT_AGENT = ['g1', 'g2', 'd1', 'a1', 'a2', 'a3', 'a4', 'k4', 'k4r', 'b1', 'b2', 'b3', 'n1', 'e1', 'fr1', 'cp1', 'rt1'];
if (['sp1', 'sp2', 'sp3', 'r2', 'r3', 'h1', 't2', 't3', 't5a', 't5b', 'p1', 'p2', 'k1', 'k2', 'k3', 'o1', 'o2', 'w1', 'w2', 'w3', 'w4', 't6', 'p4', 'p4o', 'cs1', 'ml1', ...FRONTS_WITHOUT_AGENT].includes(s.SC)) s.env.EXTRA_DISALLOWED = 'Agent';
const turns = { r2: '35', r3: '35', r4: '35', t5a: '20', t5b: '20', w1: '30', w2: '40', w3: '40', w4: '40', h2: '80' };
for (const id of ['r1', 'r1b', 'r5', 't1a', 't1b', 't1c', 't2', 't3', 't6', 'p1', 'p2', 'p4', 'p4o', 'cs1', 'ml1', 'k1', 'k2', 'k3', 'o1', 'o2', ...FRONTS_WITHOUT_AGENT]) turns[id] = '40';
s.env.MAX_TURNS ||= turns[s.SC] ?? '60';

// cs1: dotnet sin aviso de primera vez ni telemetría en el entorno del sujeto.
if (s.SC === 'cs1') Object.assign(s.env, { DOTNET_NOLOGO: '1', DOTNET_CLI_TELEMETRY_OPTOUT: '1', DOTNET_SKIP_FIRST_TIME_EXPERIENCE: '1' });
await s.launch(ASK);
const keepIf = (path, name) => existsSync(at(path)) && s.keep(at(path), name);
for (const folder of [F30, F31, F32, F33, F34, F35, F36, F10, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21, F22, F23, F24, F25, F26, F27, F28]) {
  for (const kept of ['spec', 'plan', 'tasks', 'research']) keepIf(`${folder}/${kept}.md`, `${kept}.md`);
}
for (const test of ['informe', 'price', 'store.e2e', 'cancel', 'horas', 'reactivar', 'ayuda', 'rooms-half', 'rooms', 'no-bash', 'attempt', 'report', 'legacy', 'free', 'words', 'note-prompt', 'persist']) keepIf(`test/${test}.test.js`, `${test}.test.js`);
keepIf(NOTE_PROMPT, 'note-prompt.md');
keepIf('src/app.js', 'app.js');
keepIf('src/store.js', 'store.js');
keepIf('Rooms.cs', 'Rooms.cs');
keepIf('Tests.cs', 'Tests.cs');
// cs1 y ml1: el gate de la task, pasado por el lanzador sobre el árbol que dejó el sujeto, para que una fila de fichero lo lea.
const gateOf = { cs1: ['dotnet', ['run', '--nologo'], 'gate.txt'], ml1: [s.NODE, ['--test'], 'suite.txt'] }[s.SC];
if (gateOf) {
  const [command, args, name] = gateOf;
  const gate = spawnSync(command, args, { cwd: s.R, env: s.env, encoding: 'utf8', timeout: 120000 });
  writeFileSync(join(s.RUN, name), `${gate.stdout ?? ''}${gate.stderr ?? ''}salida ${gate.status}\n`);
  s.keep(join(s.RUN, name), name);
}
keepIf('.sdd-env.json', 'sdd-env.json');
keepIf('README.md', 'README.md');
keepIf('skills/guardar-nota/SKILL.md', 'guardar-nota.md');
const sddTemp = at('.temp/sdd');
for (const plan of existsSync(sddTemp) ? readdirSync(sddTemp).sort() : []) keepIf(`.temp/sdd/${plan}/progress.md`, 'progress.md');
// El patch del sujeto nace en changes/; si lo crea en specs/ (donde está el patch 0007 del molde), también se guarda.
const patchIn = (dir) => (existsSync(at(dir)) ? readdirSync(at(dir)).filter((name) => name.includes('-patch-')).sort().map((name) => `${dir}/${name}`).at(-1) : undefined);
const patchFolder = patchIn('.docs/sdd/changes') ?? patchIn('.docs/sdd/specs');
if (patchFolder) s.keep(at(`${patchFolder}/patch.md`), 'patch-new.md');
s.save(`## petición\n${ASK}\n${markSha ? `## sha de la marca\n${markSha}\n` : ''}## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## commits con sus ficheros\n${s.git('log', '--stat', '--format=--- %h %s', 'develop..HEAD')}## worktrees\n${s.git('worktree', 'list')}`);
