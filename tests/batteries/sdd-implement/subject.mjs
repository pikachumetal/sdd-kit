// Sujeto de la batería de sdd-implement: un paso de la implementación, con los artefactos de ese punto ya escritos,
// o el encargo de un implementador como petición. Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR.
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
const fixture = (name) => readFileSync(join(FIX, name), 'utf8');
const at = (path) => join(s.R, path);
// En los encargos, la carpeta con barras, la forma que llevaban los encargos medidos.
const forward = (path) => path.replaceAll('\\', '/');
const cp = (name, path) => copyFileSync(join(FIX, name), at(path));
const sddCli = (...args) => spawnSync(s.NODE, [SDD_CLI, ...args], { cwd: s.R, env: s.env, encoding: 'utf8' }).stdout ?? '';

// El molde recibe las reglas de forma del kit que se prueba: así el mismo escenario es RED y GREEN.
function formRules() {
  const constitution = join(s.KIT, '.docs', 'sdd', 'constitution.md');
  const lines = existsSync(constitution) ? readLf(constitution).split('\n') : [];
  const from = lines.findIndex((line) => line.startsWith('## Art. II — La forma sigue al fallo'));
  const to = lines.findIndex((line, i) => i > from && line.startsWith('*Por qué*'));
  const article = from < 0 ? [] : lines.slice(from, to < 0 ? undefined : to + 1);
  if (article.length === 0) s.die(`sin el Art. II en la copia del kit: ${constitution}`);
  article[0] = article[0].replace(/^## Art\. II /, '## Art. III ');
  writeFileSync(join(s.RUN, 'form-article.md'), `${article.join('\n')}\n`);
  appendFileSync(at('.docs/sdd/constitution.md'), `\n${article.join('\n')}\n`);
  const refactor = readLf(join(s.KIT, '.docs', 'sdd', 'tech-stack.md')).split('\n').filter((line) => line.includes('- **Una ronda de REFACTOR que da 0/N'));
  writeFileSync(at('.docs/sdd/tech-stack.md'), ['# Tech stack — notas', '', '## Pruebas de skills', '', ...refactor, ''].join('\n'));
  writeFileSync(at('CLAUDE.md'), '# notas\n\nReglas del repo: `.docs/sdd/constitution.md` y `.docs/sdd/tech-stack.md`.\n');
}

s.copy(join(HERE, ['k2', 'k3', 'o1', 'o2'].includes(s.SC) ? 'mold-kit' : 'mold-reservas'));
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
    cp('environments-w1.md', '.docs/sdd/environments.md');
    cp('tech-stack-w1.md', '.docs/sdd/tech-stack.md');
  },
  k1: () => (cp('app-0018.js', 'src/app.js'), cp('readme-0018.md', 'README.md'), cp('readme.test.js', 'test/readme.test.js')),
  // La base no responde con la ruta: el paso 3 llega sin commitear, como trabajo en curso.
  o1: () => {
    const skill = at('skills/guardar-nota/SKILL.md');
    writeFileSync(skill, readLf(skill).split('\n').filter((line) => line !== '3. Tell the user the path you wrote.').join('\n'));
    formRules();
  },
};
molds.r2 = molds.r1;
for (const id of ['t1a', 't1b', 't1c']) molds[id] = molds.r1b;
for (const id of ['t5a', 'p1', 'p2']) molds[id] = molds.t2;
molds.t5b = molds.t3;
molds.o2 = molds.o1;
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
  const values = [
    ['<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>',
      '- Texto de la interfaz en castellano.\n- Sin comentarios que repitan el código ni que citen documentos.'],
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
  const workspace = sddCli('workspace', `${F10}/plan.md`).trim().split('\n').at(-1);
  sddCli('task', 'brief', `${F10}/plan.md`, '2');
  writeFileSync(join(workspace, 'progress.md'), `# SDD ledger — plan: ${F10}/plan.md\nTask 1: complete (commits ${base1}..${base2}, review clean)\n`);
  writeFileSync(join(workspace, 'task-2-report.md'), `# Task 2 — informe del implementador\n\n**Status:** DONE\n\n- Commits: ${head2} feat(bookings): listado de canceladas con su motivo\n- Tests: \`node --test test/cancel.test.js\` → 4/4\n- Ficheros: src/app.js, test/cancel.test.js\n`);
}

const greenNote = (folder, name, txt) => s.put(`${folder}/green/${name}`, fixture(txt));
const steps = {
  t2: () => openFixture('0016-room-hours', F16, '0016'),
  t3: () => openFixture('0017-reactivate', F17, '0017'),
  p2: () => {
    openFixture('0016-room-hours', F16, '0016');
    cp('app-0016-done.js', 'src/app.js');
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
    s.git('checkout', '-q', 'develop');
    s.git('worktree', 'add', '-q', join(s.RUN, 'wt'), 'feature/0010-cancel-reason');
    s.R = join(s.RUN, 'wt');
  },
  h2: () => {
    writeFileSync(join(s.RUN, 'plan-sdd.md'), asSubagent(join(FIX, 'plan-0010.md')));
    openFeature('0010-cancel-reason', { folder: F10, spec: approved0010(), plan: readFileSync(join(s.RUN, 'plan-sdd.md'), 'utf8') });
  },
  r4: reviewedTwoTasks,
};
steps.p1 = steps.t2;
for (const id of ['t1a', 't1b', 't1c']) steps[id] = steps.r1b;
steps.o2 = steps.o1;
steps.u2 = steps.u1;
steps[s.SC]?.();

if (['r2', 'r3', 'h1', 't2', 't3', 't5a', 't5b', 'p1', 'p2', 'k1', 'k2', 'k3', 'o1', 'o2', 'w1'].includes(s.SC)) s.env.EXTRA_DISALLOWED = 'Agent';
const turns = { r2: '35', r3: '35', r4: '35', t5a: '20', t5b: '20', w1: '30', h2: '80' };
for (const id of ['r1', 'r1b', 'r5', 't1a', 't1b', 't1c', 't2', 't3', 'p1', 'p2', 'k1', 'k2', 'k3', 'o1', 'o2']) turns[id] = '40';
s.env.MAX_TURNS ||= turns[s.SC] ?? '60';

await s.launch(ASK);
const keepIf = (path, name) => existsSync(at(path)) && s.keep(at(path), name);
for (const folder of [F10, F12, F13, F14, F15, F16, F17, F18, F19, F20, F21]) {
  for (const kept of ['spec', 'plan', 'tasks']) keepIf(`${folder}/${kept}.md`, `${kept}.md`);
}
for (const test of ['informe', 'price', 'store.e2e', 'cancel', 'horas', 'reactivar', 'ayuda']) keepIf(`test/${test}.test.js`, `${test}.test.js`);
keepIf('src/app.js', 'app.js');
keepIf('.sdd-env.json', 'sdd-env.json');
keepIf('README.md', 'README.md');
keepIf('skills/guardar-nota/SKILL.md', 'guardar-nota.md');
const sddTemp = at('.temp/sdd');
for (const plan of existsSync(sddTemp) ? readdirSync(sddTemp).sort() : []) keepIf(`.temp/sdd/${plan}/progress.md`, 'progress.md');
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## commits con sus ficheros\n${s.git('log', '--stat', '--format=--- %h %s', 'develop..HEAD')}`);
