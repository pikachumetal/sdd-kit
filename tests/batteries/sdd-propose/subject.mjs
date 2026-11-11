// Sujeto de la batería de sdd-propose: una petición de cambio, o un paso del flujo con sus artefactos ya escritos.
// Lo lanza tests/headless/battery.mjs run: el sujeto no lleva el CLAUDE.md del dev-lead.
import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = join(HERE, 'fixtures');
const [kit, , SC] = process.argv.slice(2);
const guard = (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), existsSync(join(kit, 'skills', guard)) ? guard : 'using-sdd');
const cell = subjectCell(HERE, s);
let ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"';
// El comando de previsión del molde reservas-skills: una línea por escenario y la suma, a 0,70 $ por sujeto.
const PLAN_MJS = [
  "import { readFileSync } from 'node:fs';", '',
  "const wanted = (process.env.SCENARIOS ?? '').split(' ').filter(Boolean);",
  "const rows = readFileSync(process.argv[2], 'utf8').split('\\n').map((line) => line.split('|').map((cell) => cell.trim()))",
  "  .filter((cell) => /^\\d+$/.test(cell[3] ?? '') && (wanted.length === 0 || wanted.includes(cell[1])));",
  'let total = 0;',
  'for (const cell of rows) {',
  '  const n = Number(process.env.N ?? cell[3]);',
  '  total += n;',
  "  console.log(cell[1] + ' · ' + n + ' sujetos · ' + (n * 0.7).toFixed(2) + ' $');",
  '}',
  "console.log('suma: ' + total + ' sujetos · coste previsto: ' + (total * 0.7).toFixed(2) + ' $');", '',
].join('\n');
const F10 = '.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason';
const F11 = '.docs/sdd/specs/20261008-110000-feature-0011-void-others';
const F13 = '.docs/sdd/specs/20261008-120000-feature-0013-cancel-many-days';
const F28 = '.docs/sdd/specs/20261008-130000-feature-0028-close-notice-pending';
const F31 = '.docs/sdd/specs/20261012-090000-feature-0031-close-notice-row';
const F29 = '.docs/sdd/specs/20261008-140000-feature-0029-room-floors';
const F30 = '.docs/sdd/specs/20261008-150000-feature-0030-retire-close-notice';
const F18 = '.docs/sdd/specs/20261008-160000-feature-0018-concierge-phone';
const F19 = '.docs/sdd/specs/20261008-170000-feature-0019-free-without-slot';
const F20 = '.docs/sdd/specs/20261008-180000-feature-0020-export-dir';
const F21 = '.docs/sdd/specs/20261008-190000-feature-0021-slot-check';
const FOLDERS = [F10, F11, F13, F18, F19, F20, F21, F28, F29, F30, F31];
const edit = (path, change) => writeFileSync(join(s.R, path), change(readLf(join(s.R, path))));
const at = (path) => join(s.R, path);
const OPS = '.docs/sdd/steering/operations.md';
const CONSTITUTION = '.docs/sdd/steering/constitution.md';
// Una fila de Now de la 3.0.0, con su brief de cinco etiquetas; va delante de la fila 0008 (avisos por correo), la última del molde.
const nowRow = (id, title, oneLiner, lane = 'feature') => `| ${id} | — | **${title}**<br>*${oneLiner}*<details><summary>Brief</summary>**Carril:** ${lane}<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |`;
const addNow = (row) => edit('ROADMAP.md', (text) => text.replace(/^\| 0008 \|/m, `${row}\n| 0008 |`));

s.copy(join(HERE, 'mold-reservas'));
s.putKitMarker(MARKER);
const MOLD = cell('Molde');
const fillerCapabilities = () => {
  const purposes = {
    billing: 'Qué se factura a cada departamento por usar las salas.', calendar: 'Los días laborables y festivos del edificio.', cleaning: 'Los turnos de limpieza de las salas.',
    equipment: 'El material de cada sala: proyector, pizarra, sillas.', visitors: 'Las visitas externas y sus acreditaciones.', keys: 'Quién recoge y devuelve las llaves.',
    notifications: 'Los correos que recibe quien reserva.', permissions: 'Qué puede hacer cada rol.', history: 'El registro de reservas pasadas.', catering: 'Los pedidos de café y comida para una reunión.',
    parking: 'Las plazas de aparcamiento de las visitas.', incidents: 'Las averías que se avisan desde una sala.',
  };
  for (const [name, purpose] of Object.entries(purposes)) {
    s.put(`.docs/sdd/capabilities/${name}.md`, `# Capacidad — ${name}\n\n## Propósito\n\n${purpose}\n\n## Requisitos\n\n### Lo básico de ${name}\n\n- GIVEN el edificio en uso\n- WHEN alguien lo consulta\n- THEN ve lo vigente\n`);
  }
};
const molds = {
  reservas() {},
  'reservas-main'() {},
  'reservas-plan'() {},
  'reservas-remoto'() {},
  // La 0011 implementa los responsables de sala que una fila pendiente (0009) prometía, y docs/config.md apunta a esa fila.
  // El puntero va fuera de los documentos que el paso 1 lee: en PRODUCT.md lo vieron 2 de 2 sin buscarlo.
  'reservas-puntero'() {
    edit('ROADMAP.md', (text) => text.replace(/^\| 0011 \|/m, `${nowRow('0009', 'Responsables de sala', 'quién responde de cada sala y qué puede hacer')}\n| 0011 |`));
    appendFileSync(at('README.md'), '\nConfiguración: [docs/config.md](docs/config.md).\n');
    s.put('docs/config.md', '# Configuración\n\n- `data/`: ficheros de datos de la herramienta. Hoy no hay ninguno.\n- Responsables de sala: aún no hay; quién es cada uno y su fichero los define la 0009.\n');
  },
  // Dos suites con nivel: la unitaria y la de integración, que escribe ficheros.
  'reservas-levels'() {
    edit(OPS, (text) => text.replace('- **Suites**: `unit` · `node --test` · ~1 s','- **Suites**: `unit` · `node --test test/app.test.js test/cancel.test.js` · ~1 s · unitario\n- `store` · `node --test test/store.test.js` · ~40 s · integración'));
    copyFileSync(join(FIX, 'store.test.js'), at('test/store.test.js'));
  },
  'reservas-sin-ops'() {
    rmSync(at(OPS));
  },
  // El último patch midió su gate de cierre: 38 min de un cierre de 0,9 h.
  'reservas-gate'() {
    s.put('.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md', [
      '# Patch — cancel', '', 'Causa raíz: comparación solo por hora. Fix y test de regresión.', '', '## Verificación', '',
      '- Gate de cierre `node --test && node scripts/lint.mjs` sobre el fix: verde, 38 min (el lint recorre el histórico de reservas)', '',
      '## Tiempo', '', '- Estimación: 0,25 h', '- Esfuerzo real: 0,9 h', '- Desvío: +260 %, por el gate de cierre (38 min)', '',
    ].join('\n'));
  },
  // La 0012 retira anular: la nombran el README, la guía (con tope de palabras) y la capacidad, y la guía apunta a la fila.
  'reservas-topes'() {
    mkdirSync(at('.docs/sdd/capabilities'), { recursive: true });
    mkdirSync(at('docs'), { recursive: true });
    copyFileSync(join(FIX, 'bookings-capability.md'), at('.docs/sdd/capabilities/bookings.md'));
    copyFileSync(join(FIX, 'guia.md'), at('docs/guia.md'));
    copyFileSync(join(FIX, 'words.test.js'), at('test/words.test.js'));
    appendFileSync(at('README.md'), '\nComandos: `cancelar` y `anular`; guía en [docs/guia.md](docs/guia.md).\n');
    addNow(nowRow('0012', 'Retirar anular', 'el comando anular desaparece'));
  },
  // La 0013 añade un requisito que contradice otro vivo de la capacidad, con otro título.
  'reservas-contradice'() {
    mkdirSync(at('.docs/sdd/capabilities'), { recursive: true });
    copyFileSync(join(FIX, 'bookings-long-capability.md'), at('.docs/sdd/capabilities/bookings.md'));
    addNow(nowRow('0013', 'Cancelar varios días de una vez', '—'));
  },
  // El tope limita la carpeta entera, no el fichero que edita la spec.
  'reservas-tope-carpeta'() {
    s.put('docs/plantillas/aviso.md', 'Aviso de sala: {sala} el {dia}.\n');
    s.put('docs/plantillas/recibo.md', `${'palabra '.repeat(46)}\n`);
    s.put('test/words.test.js', [
      "import { test } from 'node:test';", "import assert from 'node:assert';", "import { readdirSync, readFileSync } from 'node:fs';", '',
      "test('docs/plantillas cabe en su tope de 60 palabras', () => {",
      "  const words = readdirSync('docs/plantillas').flatMap((name) => readFileSync(`docs/plantillas/${name}`, 'utf8').split(/\\s+/).filter(Boolean));",
      '  assert.ok(words.length <= 60);', '});', '',
    ].join('\n'));
  },
  // La guía deja dos palabras de margen: la línea pedida no cabe sin recortar otra.
  'reservas-tope-justo'() {
    const guide = readLf(join(FIX, 'guia.md'));
    s.put('docs/guia.md', guide);
    const cap = guide.split(/\s+/).filter(Boolean).length + 2;
    s.put('test/words.test.js', readLf(join(FIX, 'words.test.js')).replace("'docs/guia.md': 60", `'docs/guia.md': ${cap}`));
  },
  // Dos tareas con caché por inputs: la fast no ve el repo entero que recorre test/paths.test.js.
  'reservas-tareas'() {
    s.put('gate.json', `${JSON.stringify({ tasks: {
      fast: { command: 'node --test test/app.test.js', inputs: ['src/**', 'test/app.test.js'] },
      slow: { command: 'node --test test/paths.test.js', inputs: ['**/*'] },
    } }, null, 2)}\n`);
    s.put('test/paths.test.js', [
      "import { test } from 'node:test';", "import assert from 'node:assert';", "import { execFileSync } from 'node:child_process';", '',
      "test('ninguna ruta del repo pasa de 140 caracteres', () => {",
      "  const paths = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\\n');",
      '  assert.ok(paths.every((path) => path.length <= 140));', '});', '',
    ].join('\n'));
    edit(OPS, (text) => `${text}\n- Tareas:\`gate.json\`, con caché: una tarea se salta si no cambia ninguno de sus \`inputs\`. El pre-commit corre \`fast\`.\n`);
  },
  // Un repo de skills con su batería, la regla de la previsión, su comando de previsión y dos precios por sujeto: el vigente y uno viejo.
  'reservas-skills'() {
    s.put('skills/aviso-cierre/SKILL.md', '---\nname: aviso-cierre\ndescription: Usar al cerrar una feature.\n---\n\n# aviso-cierre\n\n1. Di qué se cierra.\n2. Corre el gate.\n');
    s.put('tests/batteries/aviso-cierre/battery.md', '# Batería — aviso-cierre\n\n| Id | Paso | n | Modelo |\n| --- | --- | --- | --- |\n| c1 | cierre | 2 | sonnet |\n| c2 | cierre | 2 | sonnet |\n');
    edit(CONSTITUTION, (text) => `${text}5. Ninguna edición de una skill sin su prueba con sujetos (RED → GREEN). La previsión de coste (sujetos, minutos y dólares) se declara antes del primer sujeto y la spec la repite; si la prueba la supera, una tanda más de REFACTOR incluida, se para y decide el dev-lead.\n`);
    s.put('scripts/plan.mjs', PLAN_MJS);
    edit(OPS, (text) => `${text}\n- Sujetos: Sonnet. Un sujeto de \`aviso-cierre\` cuesta ~0,70 $, porque cierra una feature entera. La previsión de una tanda: \`SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md\`.\n`);
    s.put('.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md', '# Patch — aviso\n\nRED y GREEN de `aviso-cierre`, 4 sujetos, ~1,24 $ (~0,31 $ por sujeto).\n');
  },
  // mold-c lleva un pendientes.md que solo se ve abriéndolo.
  'reservas-skills-molde'() {
    molds['reservas-skills']();
    s.put('tests/batteries/aviso-cierre/mold-c/pendientes.md', '# Pendientes\n\n- 0011: responsables de sala\n');
  },
  // Un molde de varios ficheros cuya lista de pendientes va en una carpeta oculta.
  'reservas-skills-suite'() {
    molds['reservas-skills']();
    const root = 'tests/batteries/aviso-cierre/mold-cierre';
    for (const name of ['README.md', 'src/app.js', 'src/rooms.js', 'test/app.test.js', 'docs/guia.md', 'docs/salas.md', 'ROADMAP.md']) s.put(`${root}/${name}`, `# ${name}\n`);
    s.put(`${root}/.docs/sdd/pendientes.md`, '# Pendientes\n\n- 0011: responsables de sala\n');
  },
  // Una opción nueva en libres, que describe cli, con un delta en rooms y reports.
  // Con pocas capacidades el sujeto las lee todas: el relleno obliga a elegir.
  'reservas-cli'() {
    fillerCapabilities();
    copyFileSync(join(FIX, 'cli-capability.md'), at('.docs/sdd/capabilities/cli.md'));
    copyFileSync(join(FIX, 'rooms-capability.md'), at('.docs/sdd/capabilities/rooms.md'));
    copyFileSync(join(FIX, 'reports-capability.md'), at('.docs/sdd/capabilities/reports.md'));
    addNow(nowRow('0029', 'Las salas tienen planta', '—'));
  },
  // Una skill retirada: dos requisitos citan su «paso 2» sin nombrarla, y otras dos líneas, el paso 2 de otra skill.
  // Las dos citas van en una capacidad que el delta no declara: en la declarada, el sujeto las lee de paso.
  'reservas-retira'() {
    fillerCapabilities();
    copyFileSync(join(FIX, 'closing-capability.md'), at('.docs/sdd/capabilities/closing.md'));
    copyFileSync(join(FIX, 'quality-gate-capability.md'), at('.docs/sdd/capabilities/quality-gate.md'));
    s.put('skills/aviso-cierre/SKILL.md', '---\nname: aviso-cierre\ndescription: Usar al cerrar una feature.\n---\n\n# aviso-cierre\n\n1. Di qué se cierra.\n2. Corre el gate.\n');
    s.put('skills/aviso-apertura/SKILL.md', '---\nname: aviso-apertura\ndescription: Usar al abrir una feature.\n---\n\n# aviso-apertura\n\n1. Di qué se abre.\n2. Di en qué rama se trabaja.\n');
    s.put('skills/resumen-cierre/SKILL.md', '---\nname: resumen-cierre\ndescription: Usar al acabar el cierre de una feature.\n---\n\n# resumen-cierre\n\n1. Cuenta los commits de la rama.\n2. Lista las filas del roadmap que salda.\n');
    addNow(nowRow('0030', 'Retirar la skill aviso-cierre', '—'));
  },
  'reservas-adr'() {
    mkdirSync(at('.docs/sdd/decisions'), { recursive: true });
    copyFileSync(join(FIX, 'adr-0003-bookings-in-memory.md'), at('.docs/sdd/decisions/0003-bookings-in-memory.md'));
  },
  'reservas-adr6'() {
    s.copy(join(FIX, 'decisions-6'), '.docs/sdd/decisions');
  },
  'reservas-adr-docs'() {
    s.put('.docs/sdd/decisions/0003-bookings-in-memory.md', readLf(join(FIX, 'adr-0003-bookings-in-memory.md')).replace(/ {2}- src\/\*\*/g, '  - docs/**'));
  },
  // Un gate de cierre filtrado, con los flags de moon (el de la batería de sdd-archive): un cambio en gate.json no casa con ningún input.
  'reservas-filtro'() {
    const gate = join(HERE, '..', 'sdd-archive', 'fixtures', 'gate');
    mkdirSync(at('scripts'), { recursive: true });
    copyFileSync(join(gate, 'gate.mjs'), at('scripts/gate.mjs'));
    copyFileSync(join(gate, 'gate.json'), at('gate.json'));
    copyFileSync(join(gate, 'rooms.js'), at('src/rooms.js'));
    copyFileSync(join(gate, 'rooms.test.js'), at('test/rooms.test.js'));
    edit(OPS, (text) => text.replace(/^- \*\*Gate de cierre\*\*: .*$/gm, '- **Gate de cierre**: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`'));
    if (!readFileSync(at(OPS), 'utf8').includes('scripts/gate.mjs')) s.die('no se plantó el gate filtrado');
  },
  // Un workspace de pnpm recién clonado, sin node_modules: app.js importa fecha, y npm install no lo instala.
  'reservas-deps'() {
    molds['reservas-deps-sin-stack']();
    edit(OPS, (text) => text.replace(/^(- \*\*Arrancar\*\*: .*)$/m, '$1\n- **Dependencias**: workspace de pnpm (`pnpm-workspace.yaml`); `pnpm install` una vez por worktree.'));
  },
  // El mismo workspace sin la línea de Dependencias de operations.md: el gestor solo lo dice el lockfile.
  'reservas-deps-sin-stack'() {
    s.copy(join(FIX, 'deps'));
    edit('package.json', (text) => text.replace('"engines"', '"dependencies": {"fecha": "workspace:*"}, "engines"'));
    edit('src/app.js', (text) => `import { dayName } from 'fecha';\n${text}\nexport const today = () => dayName(new Date().getDay());\n`);
  },
  // La carpeta de exportación vive en config.json, y un test fija su valor suelto, '.', sin nombrar la clave.
  'reservas-export'() {
    s.put('config.json', '{\n  "base": "."\n}\n');
    s.put('src/export.js', "import { readFileSync } from 'node:fs';\n\nexport const readConfig = () => JSON.parse(readFileSync('config.json', 'utf8'));\nexport const exportPath = () => `${readConfig().base}/reservas.csv`;\n");
    s.put('test/config.test.js', "import { test } from 'node:test';\nimport assert from 'node:assert';\nimport { readConfig } from '../src/export.js';\n\ntest('la exportación escribe en la raíz', () => {\n  assert.equal(readConfig().base, '.');\n});\n");
  },
  // Una sala más rompe el test de libres: el gate de cierre sale en rojo.
  'reservas-rojo'() {
    edit('src/app.js', (text) => text.replaceAll("const rooms = ['Norte', 'Sur'];", "const rooms = ['Norte', 'Sur', 'Este'];"));
  },
};
const mold = moldFrom(() => MOLD, s, molds);
mold();
// El fallo de a2 y a3: findBooking busca solo por sala, y «cancelar Norte mar» cancela la reserva del lunes.
if (['a2', 'a3', 'd1', 'p3', 'pr1'].includes(s.SC)) edit('src/app.js', (text) => text.replaceAll('b.room === room && b.day === day && ', 'b.room === room && '));
s.git('init', '-q', '-b', 'main');
s.commit('feat: base del molde');
if (MOLD !== 'reservas-main') s.git('checkout', '-q', '-b', 'develop');

// reservas-remoto: un remoto bare con develop publicado; otro clon publica su 0012 y aquí queda una 0012 sin publicar.
const gitOutside = (...args) => spawnSync('git', args, { env: s.env, stdio: 'ignore' });
const addRow = (root, row) => {
  const path = join(root, 'ROADMAP.md');
  writeFileSync(path, readLf(path).replace(/^\| 0011 \|.*$/m, `$&\n${row}`));
};
function remoteMold(row) {
  const origin = join(s.RUN, 'origin.git');
  const other = join(s.RUN, 'other');
  gitOutside('init', '-q', '--bare', '-b', 'develop', origin);
  s.git('remote', 'add', 'origin', origin);
  s.git('push', '-q', '-u', 'origin', 'develop');
  gitOutside('clone', '-q', '-b', 'develop', origin, other);
  if (!row) return;
  addRow(other, nowRow('0012', 'Informe de ocupación', 'horas reservadas por sala y semana'));
  gitOutside('-C', other, '-c', 'user.email=otro@example.com', '-c', 'user.name=Otro', 'commit', '-qam', 'docs(roadmap): reserva 0012');
  gitOutside('-C', other, 'push', '-q', 'origin', 'develop');
  addRow(s.R, row);
  s.commit('docs(roadmap): reserva 0012');
}

const approvedSpec = () => readLf(join(FIX, 'spec-0010.md'))
  .replace(/^status: draft/m, 'status: approved')
  .replaceAll('approved_at: null', 'approved_at: 2026-10-08')
  .replaceAll('| dev-lead | Laura | | pendiente |', '| dev-lead | Laura | 2026-10-08 | aprobada |');
const withoutWho = (text) => text
  .replaceAll(' y quién canceló', '')
  .replaceAll(' cancelada por Ana con', ' cancelada con')
  .replaceAll(' — sala ocupada — Ana»', ' — sala ocupada»')
  .replace(/^2\. El listado de canceladas enseña sala[^\n]*\n/m, '');
const branch = (name) => s.git('checkout', '-q', '-b', name);

const steps = {
  sr1: () => {
    s.git('checkout', '-q', '-b', 'feature/0011-void-others');
    s.put(`${F11}/spec.md`, readFileSync(join(FIX, 'spec-0011-review.md'), 'utf8'));
  },
  id1: () => {
    remoteMold(nowRow('0012', 'Exportar las reservas a CSV', 'un fichero con una fila por reserva'));
    branch('feature/0012-export-csv');
  },
  id4: () => {
    remoteMold(nowRow('0012', 'Franja no válida en libres', '`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»', 'patch'));
    branch('feature/0012-slot-format');
  },
  id2: () => {
    remoteMold();
    branch('feature/0016-slot-format');
  },
  a1: () => s.put('.docs/sdd/sdd-kit.local.json', '{"merge": {"push": true}}\n'),
  a2: () => (s.env.TURN2 = 'Sí, como patch.'),
  d1: () => (s.env.PHASE || 'red') === 'red' && (s.env.TURN2 = 'Sí, como patch.'),
  k5: () => {
    s.env.TURN2 = 'Sí.';
    const config = at('.docs/sdd/sdd-kit.json');
    const json = JSON.parse(readFileSync(config, 'utf8'));
    json.merge = { into: 'develop', noFf: true, removeWorktree: false, push: false };
    writeFileSync(config, `${JSON.stringify(json, null, 2)}\n`);
    s.commit('chore: política de merge');
    branch('feature/bump-node-22-18');
  },
  ws1: () => {
    addRow(s.R, nowRow('0012', 'Franja no válida en libres', '`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»', 'patch'));
    s.commit('docs(roadmap): reserva 0012');
    branch('feature/0012-slot-format');
  },
  s1: () => branch('feature/0010-cancel-reason'),
  c1: () => branch('feature/0010-cancel-reason'),
  sp1: () => branch('feature/0012-retire-void'),
  g1: () => {
    branch('feature/0010-cancel-reason');
    s.put(`${F10}/spec.md`, readFileSync(join(FIX, 'spec-0010.md'), 'utf8'));
  },
  p1: () => {
    branch('feature/0010-cancel-reason');
    s.put(`${F10}/spec.md`, withoutWho(approvedSpec()));
  },
  // La 0010 con su anexo: dos reglas de un comando que se funde en cancelar, cada una con su destino.
  pl2: () => {
    branch('feature/0010-cancel-reason');
    s.put(`${F10}/spec.md`, withoutWho(approvedSpec()) + readFileSync(join(FIX, 'annex-0010.md'), 'utf8'));
  },
  pl3: () => {
    branch('feature/0010-cancel-reason');
    s.put(`${F10}/spec.md`, withoutWho(approvedSpec()));
  },
  // La 0010 con una dependencia nueva: el plan declara el eje Arquitectura de la revisión final.
  ax: () => {
    branch('feature/0010-cancel-reason');
    const spec = withoutWho(approvedSpec()).replace(/^El motivo se guarda con la reserva cancelada;/m, 'El motivo se valida con la librería `zod`, una dependencia nueva en `dependencies` de `package.json`. $&');
    s.put(`${F10}/spec.md`, spec);
  },
};
for (const id of ['k1', 'k3', 'k4', 'k6']) steps[id] = () => (s.env.TURN2 = 'Sí.');
steps.p2 = steps.p1;
steps.k2p = () => {
  const folder = '.docs/sdd/specs/20261015-110000-feature-0031-free-rooms-load';
  s.git('checkout', '-q', '-b', 'feature/0031-free-rooms-load');
  s.put(`${folder}/spec.md`, readFileSync(join(HERE, '..', 'sdd-implement', 'fixtures', 'spec-0031.md'), 'utf8'));
  s.commit('docs(sdd): abrir el spike 0031 con su spec');
};
steps.g1b = steps.g1;
steps.ws2 = steps.k5;
steps.ws3 = steps.ws1;
const voidOthers = () => {
  branch('feature/0011-void-others');
  s.put(`${F11}/spec.md`, readFileSync(join(FIX, 'spec-0011.md'), 'utf8'));
};
steps.r1 = voidOthers;
steps.t1 = voidOthers;
steps.co1 = () => {
  branch('feature/0013-cancel-many-days');
  s.put(`${F13}/spec.md`, readFileSync(join(FIX, 'spec-0013.md'), 'utf8'));
};
steps.co5 = () => {
  branch('feature/0029-room-floors');
  s.put(`${F29}/spec.md`, readFileSync(join(FIX, 'spec-0029.md'), 'utf8'));
};
steps.co6 = () => {
  branch('feature/0030-retire-close-notice');
  s.put(`${F30}/spec.md`, readFileSync(join(FIX, 'spec-0030.md'), 'utf8'));
};
steps.co2 = () => branch('feature/0014-notice-room');
steps.co2p = steps.co2;
steps.rc1 = () => {
  branch('feature/0031-close-notice-row');
  s.put(`${F31}/spec.md`, readFileSync(join(FIX, 'spec-0031.md'), 'utf8'));
};
// Como en la 0326: la fila floja vive en la batería y la spec solo la nombra.
steps.rc2 = () => {
  edit('tests/batteries/aviso-cierre/battery.md', (text) => `${text}\n## Rúbrica\n\n| Fila | Escenario | Falla si |\n| --- | --- | --- |\n| C1-A Aviso | c1 | \`text: /pendiente/\` |\n`);
  s.commit('test(aviso-cierre): rúbrica de c1');
  steps.rc1();
  edit(`${F31}/spec.md`, (text) => text.replace(/^- El paso 1: .*$/m, '- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2.'));
};
steps.co3 = () => branch('feature/0015-paths-in-fast');
steps.co4 = () => branch('feature/0016-close-notice');
steps.cr1 = () => {
  s.put('.docs/sdd/field-reports/20260914-aviso.md', '# Ticket — aviso de cierre\n\n## 1. El aviso no dice qué queda pendiente\n\n- **Qué pasó**: al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que quedaba una fila abierta.\n- **Coste**: una parada del dev-lead.\n');
  branch('feature/0028-close-notice-pending');
};
steps.cr2 = () => {
  branch('feature/0028-close-notice-pending');
  s.put(`${F28}/spec.md`, readFileSync(join(FIX, 'spec-0028.md'), 'utf8'));
};
const NAMED_MOLD = '`c1` de `tests/batteries/aviso-cierre/battery.md`, cuyo molde `mold-c` no tiene `pendientes.md`, así que el sujeto saca lo pendiente de la skill.';
steps.cr3 = () => {
  const spec = readLf(join(FIX, 'spec-0028.md'));
  if (!spec.includes(NAMED_MOLD)) s.die('sin la línea del molde en la fixture');
  branch('feature/0028-close-notice-pending');
  s.put(`${F28}/spec.md`, spec.replace(NAMED_MOLD, '`c1`, en un molde sin lista de pendientes.').replace('GIVEN un cierre sin `pendientes.md` en el molde', 'GIVEN un cierre en un molde sin lista de pendientes'));
};
const PATCH_TO_COMMIT = 'Sí, como patch. Sigue hasta el commit del fix.';
steps.pw1 = () => {
  branch('feature/0017-saturday-note');
  s.env.TURN2 = PATCH_TO_COMMIT;
};
const reviewSpec = (folder, fixture) => () => {
  branch(`feature/${folder.split('-feature-')[1]}`);
  s.put(`${folder}/spec.md`, readFileSync(join(FIX, fixture), 'utf8'));
};
steps.rv1 = reviewSpec(F11, 'spec-0011-review.md');
// La spec de la 0018 edita la guía y sale de su fila: sin las dos, el repaso de coherencia la para antes de la review.
steps.rv2 = () => {
  reviewSpec(F18, 'spec-0018-small.md')();
  s.put('docs/guia.md', readLf(join(FIX, 'guia.md')).replace('; lo retira la 0012', ''));
  addNow(nowRow('0018', 'El teléfono de conserjería en la guía', '—'));
};
// Con --setting-sources "" no llega ningún CLAUDE.md: la instrucción de confirmar va por el system prompt.
steps.rv3 = () => {
  steps.rv1();
  s.env.APPEND_SYSTEM = 'Antes de paralelizar subagentes, pide confirmación con el modelo de cada uno.';
};
steps.lr1 = reviewSpec(F19, 'spec-0019-lite.md');
steps.rr1 = reviewSpec(F11, 'spec-0011-round1.md');
steps.pr1 = () => (s.env.TURN2 = PATCH_TO_COMMIT);
steps['pb-p'] = () => (s.env.TURN2 = 'Sigue con el que recomiendas.');
steps.co7 = reviewSpec(F20, 'spec-0020-export-dir.md');
steps.co8 = reviewSpec(F21, 'spec-0021-slot-check.md');
steps[s.SC]?.();

const turns = { g1: '40', r1: '15', d1: '60', p3: '60', pr1: '70' };
for (const id of ['a1', 'a3', 'a4', 'k2', 'l1', 'pl1', 'pt1', 'x1', 'c1', 't1', 'pb', 'pb-p', 'pb-c', 'adr', 'adr-c', 'e1']) turns[id] = '25';
s.env.MAX_TURNS ||= turns[s.SC] ?? '40';

await s.launch(ASK);
for (const kept of ['spec', 'plan', 'tasks']) {
  for (const folder of FOLDERS) if (existsSync(at(`${folder}/${kept}.md`))) s.keep(at(`${folder}/${kept}.md`), `${kept}.md`);
}
// Las carpetas del molde y de los fixtures son de 2026-10-08 o antes y viven en specs/ (proyecto migrado): la que crea el sujeto es la de fecha mayor y nace en changes/.
// Si la crea en specs/, también se guarda: `git status` en state.txt dice dónde nació.
const ours = FOLDERS.map((folder) => folder.split('/').at(-1));
const newestIn = (dir) => (existsSync(dir) ? readdirSync(dir).sort().at(-1) : undefined);
const newestSpecs = newestIn(at('.docs/sdd/specs'));
const [dir, newest] = newestIn(at('.docs/sdd/changes')) ? [at('.docs/sdd/changes'), newestIn(at('.docs/sdd/changes'))] : [at('.docs/sdd/specs'), newestSpecs];
if (newest && !ours.includes(newest) && !/task-000|patch-0007/.test(newest)) {
  for (const [file, name] of [['spec.md', 'spec-new.md'], ['patch.md', 'patch-new.md'], ['plan.md', 'plan-new.md']]) {
    if (existsSync(join(dir, newest, file))) s.keep(join(dir, newest, file), name);
  }
}
if (s.SC === 'pw1') s.keep(at('docs/guia.md'), 'guia.md');
s.save([
  `## petición\n${ASK}\n`,
  `## git status\n${s.git('status', '--short')}`,
  `## git log\n${s.git('log', '--all', '--format=%h %d %s%n%b')}`,
  `## develop\n${s.git('log', 'develop', '--oneline')}`,
  `## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`,
  `## package.json\n${readFileSync(at('package.json'), 'utf8')}`,
].join(''));
