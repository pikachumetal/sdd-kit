// Sujeto de la batería de sdd-propose: una petición de cambio, o un paso del flujo con sus artefactos ya escritos.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { spawnSync } from 'node:child_process';
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = join(HERE, 'fixtures');
const [kit, , SC] = process.argv.slice(2);
// Si el kit que se prueba aún no tiene sdd-propose, la guarda comprueba la puerta de entrada
// y los pasos de spec y plan se piden a sdd-start-feature, donde vivían.
const guard = (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), existsSync(join(kit, 'skills', guard)) ? guard : 'using-sdd');
const cell = subjectCell(HERE, s);
let ASK = cell('Petición');
if (!existsSync(join(kit, 'skills', 'sdd-propose'))) ASK = ASK.replaceAll('sdd-propose', 'sdd-start-feature');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"';
const F10 = '.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason';
const F11 = '.docs/sdd/specs/20261008-110000-feature-0011-void-others';
const edit = (path, change) => writeFileSync(join(s.R, path), change(readLf(join(s.R, path))));
const at = (path) => join(s.R, path);

s.copy(join(HERE, 'mold-reservas'));
s.putKitMarker(MARKER);
const MOLD = cell('Molde');
const molds = {
  reservas() {},
  'reservas-main'() {},
  'reservas-plan'() {},
  'reservas-remoto'() {},
  // La 0011 implementa los responsables de sala que una fila pendiente (0009) prometía, y docs/config.md apunta a esa fila.
  // El puntero va fuera de los documentos que el paso 1 lee: en PRODUCT.md lo vieron 2 de 2 sin buscarlo.
  'reservas-puntero'() {
    edit('.docs/sdd/roadmap.md', (text) => text.replace(/^\| 0011 \|/gm, '| 0009 | **Responsables de sala**: quién responde de cada sala y qué puede hacer | ⏳ |\n| 0011 |'));
    appendFileSync(at('README.md'), '\nConfiguración: [docs/config.md](docs/config.md).\n');
    s.put('docs/config.md', '# Configuración\n\n- `data/`: ficheros de datos de la herramienta. Hoy no hay ninguno.\n- Responsables de sala: aún no hay; quién es cada uno y su fichero los define la 0009.\n');
  },
  // Dos suites con nivel: la unitaria y la de integración, que escribe ficheros.
  'reservas-levels'() {
    edit('.docs/sdd/operations.md', (text) => text.replace('- **Suites**: `unit` · `node --test` · ~1 s', '- **Suites**: `unit` · `node --test test/app.test.js test/cancel.test.js` · ~1 s · unitario\n- `store` · `node --test test/store.test.js` · ~40 s · integración'));
    copyFileSync(join(FIX, 'store.test.js'), at('test/store.test.js'));
  },
  'reservas-sin-ops'() {
    rmSync(at('.docs/sdd/operations.md'));
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
    edit('.docs/sdd/roadmap.md', (text) => text.replace(/^\| 1 \|/gm, '| 0012 | **Retirar anular**: el comando anular desaparece | ⏳ |\n| 1 |'));
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
    edit('.docs/sdd/operations.md', (text) => text.replace(/^- \*\*Gate de cierre\*\*: .*$/gm, '- **Gate de cierre**: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`'));
    if (!readFileSync(at('.docs/sdd/operations.md'), 'utf8').includes('scripts/gate.mjs')) s.die('no se plantó el gate filtrado');
  },
  // Un workspace de pnpm recién clonado, sin node_modules: app.js importa fecha, y npm install no lo instala.
  'reservas-deps'() {
    molds['reservas-deps-sin-stack']();
    edit('.docs/sdd/tech-stack.md', (text) => `${text}\n- Dependencias: workspace de pnpm (\`pnpm-workspace.yaml\`); \`pnpm install\` una vez por worktree.\n`);
  },
  // El mismo workspace sin la línea de tech-stack.md: el gestor solo lo dice el lockfile.
  'reservas-deps-sin-stack'() {
    s.copy(join(FIX, 'deps'));
    edit('package.json', (text) => text.replace('"engines"', '"dependencies": {"fecha": "workspace:*"}, "engines"'));
    edit('src/app.js', (text) => `import { dayName } from 'fecha';\n${text}\nexport const today = () => dayName(new Date().getDay());\n`);
  },
  // Una sala más rompe el test de libres: el gate de cierre sale en rojo.
  'reservas-rojo'() {
    edit('src/app.js', (text) => text.replaceAll("const rooms = ['Norte', 'Sur'];", "const rooms = ['Norte', 'Sur', 'Este'];"));
  },
};
const mold = moldFrom(() => MOLD, s, molds);
mold();
// El fallo de a2 y a3: findBooking busca solo por sala, y «cancelar Norte mar» cancela la reserva del lunes.
if (['a2', 'a3', 'd1', 'p3'].includes(s.SC)) edit('src/app.js', (text) => text.replaceAll('b.room === room && b.day === day && ', 'b.room === room && '));
s.git('init', '-q', '-b', 'main');
s.commit('feat: base del molde');
if (MOLD !== 'reservas-main') s.git('checkout', '-q', '-b', 'develop');

// reservas-remoto: un remoto bare con develop publicado; otro clon publica su 0012 y aquí queda una 0012 sin publicar.
const gitOutside = (...args) => spawnSync('git', args, { env: s.env, stdio: 'ignore' });
const addRow = (root, row) => {
  const path = join(root, '.docs', 'sdd', 'roadmap.md');
  writeFileSync(path, readLf(path).replace(/^\| 0011 \|.*$/gm, `$&\n${row}`));
};
function remoteMold(row) {
  const origin = join(s.RUN, 'origin.git');
  const other = join(s.RUN, 'other');
  gitOutside('init', '-q', '--bare', '-b', 'develop', origin);
  s.git('remote', 'add', 'origin', origin);
  s.git('push', '-q', '-u', 'origin', 'develop');
  gitOutside('clone', '-q', '-b', 'develop', origin, other);
  if (!row) return;
  addRow(other, '| 0012 | **Informe de ocupación**: horas reservadas por sala y semana | ⏳ |');
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
  id1: () => {
    remoteMold('| 0012 | **Exportar las reservas a CSV**: un fichero con una fila por reserva | ⏳ |');
    branch('feature/0012-export-csv');
  },
  id4: () => {
    remoteMold('| 0012 | Patch: **Franja no válida en libres**: `libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM» | ⏳ |');
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
    addRow(s.R, '| 0012 | Patch: **Franja no válida en libres**: `libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM» | ⏳ |');
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
steps.ws2 = steps.k5;
steps.ws3 = steps.ws1;
const voidOthers = () => {
  branch('feature/0011-void-others');
  s.put(`${F11}/spec.md`, readFileSync(join(FIX, 'spec-0011.md'), 'utf8'));
};
steps.r1 = voidOthers;
steps.t1 = voidOthers;
steps[s.SC]?.();

const turns = { g1: '15', r1: '15', d1: '60', p3: '60' };
for (const id of ['a1', 'a3', 'a4', 'k2', 'l1', 'pl1', 'pt1', 'x1', 'c1', 't1', 'pb', 'pb-c', 'adr', 'adr-c', 'e1']) turns[id] = '25';
s.env.MAX_TURNS ||= turns[s.SC] ?? '40';

await s.launch(ASK);
for (const kept of ['spec', 'plan', 'tasks']) {
  for (const folder of [F10, F11]) if (existsSync(at(`${folder}/${kept}.md`))) s.keep(at(`${folder}/${kept}.md`), `${kept}.md`);
}
// Las carpetas del molde y de los fixtures son de 2026-10-08 o antes: la que crea el sujeto es la de fecha mayor.
const specs = at('.docs/sdd/specs');
const newest = existsSync(specs) ? readdirSync(specs).sort().at(-1) : undefined;
const ours = [F10, F11].map((folder) => folder.split('/').at(-1));
if (newest && !ours.includes(newest) && !/task-000|patch-0007/.test(newest)) {
  for (const [file, name] of [['spec.md', 'spec-new.md'], ['patch.md', 'patch-new.md'], ['plan.md', 'plan-new.md']]) {
    if (existsSync(join(specs, newest, file))) s.keep(join(specs, newest, file), name);
  }
}
s.save([
  `## petición\n${ASK}\n`,
  `## git status\n${s.git('status', '--short')}`,
  `## git log\n${s.git('log', '--all', '--format=%h %d %s%n%b')}`,
  `## develop\n${s.git('log', 'develop', '--oneline')}`,
  `## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`,
  `## package.json\n${readFileSync(at('package.json'), 'utf8')}`,
].join(''));
