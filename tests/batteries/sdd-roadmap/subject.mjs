// Sujeto de la batería de sdd-roadmap: algo que apuntar en el roadmap, o el prompt de arranque de una fila.
// Lo lanza tests/headless/battery.mjs run: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const s = initSubject(process.argv.slice(2), 'sdd-roadmap');
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}';
const P10 = '.docs/sdd/specs/20261001-090000-proposal-0010-reports';
const P10_3 = '.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md';
const ROADMAP = join(s.R, '.docs', 'sdd', 'roadmap.md');
const CHANGELOG = join(s.R, '.docs', 'sdd', 'changelog.md');
const PATCH_0007 = '.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md';

s.copy(join(HERE, '..', 'using-sdd', 'mold-salas'));
s.putKitMarker(MARKER);
// La capa 3.0.0 sustituye al roadmap 2.x por ROADMAP.md y debt.md; la propuesta cuelga de changes/.
function layer3() {
  if (!existsSync(ROADMAP)) s.die('el molde salas cambió: no hay roadmap.md que retirar');
  rmSync(ROADMAP);
  if (!existsSync(CHANGELOG)) s.die('el molde salas cambió: no hay changelog.md 2.x que retirar');
  rmSync(CHANGELOG);
  s.copy(join(HERE, 'mold-salas-3'));
  s.put(P10_3, readFileSync(join(HERE, 'proposal-0010.md'), 'utf8'));
}

// La capa del informe de QA, con las versiones del changelog antes de la 0.3.0 del molde.
function layerQa() {
  const changelog = readLf(CHANGELOG);
  if (!changelog.includes('## [0.3.0]')) s.die('el changelog del molde salas cambió: no hay dónde poner las versiones');
  s.copy(join(HERE, 'mold-salas-qa'));
  const source = readLf(join(HERE, 'mold-salas-3', 'CHANGELOG.md'));
  const versions = source.slice(source.search(/^## \[1\.4\.1\]/m)).replace(/\n$/, '');
  writeFileSync(CHANGELOG, changelog.replace(/^## \[0\.3\.0\]/m, `${versions}\n\n## [0.3.0]`));
}

function salas0013() {
  const row = '| 1 | Avisos por correo antes de la reserva | ⏳ |';
  const roadmap = readLf(ROADMAP);
  if (!roadmap.split('\n').includes(row)) s.die('el roadmap del molde salas cambió: no hay dónde poner la fila 0013');
  writeFileSync(ROADMAP, roadmap.replace(`${row}\n`, `${row}\n| 0013 | Aviso semanal a los responsables — \`proposal: 0010\`, tras 0012 | ⏳ |\n`));
  s.put(`${P10}/proposal.md`, readFileSync(join(HERE, 'proposal-0010.md'), 'utf8'));
}

// El reparto de la propuesta 0010 con las dos piezas más que trae la familia a medias.
function layer3Family() {
  layer3();
  s.copy(join(HERE, 'mold-salas-3-family'));
  const proposal = join(s.R, P10_3);
  const row = '| 3 | 0013 | Aviso semanal a los responsables | 0012 |';
  const text = readLf(proposal);
  if (!text.split('\n').includes(row)) s.die('la propuesta 0010 cambió: no hay dónde añadir piezas al reparto');
  writeFileSync(proposal, text.replace(row, `${row}\n| 4 | 0014 | Ranking de salas | 0012 |\n| 5 | 0015 | Informe trimestral | 0014 |`));
}

// 2.x: la familia solo ha empezado por una pieza en curso, y su madre sigue ⏳.
function salasFamily2x() {
  const row = '| 1 | Avisos por correo antes de la reserva | ⏳ |';
  const roadmap = readLf(ROADMAP);
  if (!roadmap.split('\n').includes(row)) s.die('el roadmap del molde salas cambió: no hay dónde poner la familia');
  const rows = [
    '| 0020 | Filtrar salas por aforo: `libres --aforo 8` lista solo las que caben | ⏳ |',
    '| 0021 | Recordatorio al cancelar: avisa a quien estaba en espera | ⏳ |',
    '| 0030 | Cobro a externos — partida en 0031, 0032 y 0033 | ⏳ |',
    '| 0031 | Cobro: tarifa por sala — `parent: 0030` | ⏳ |',
    '| 0032 | Cobro: factura mensual — `parent: 0030`, tras 0031 | ⏳ |',
    '| 0033 | Cobro: recibo por correo — `parent: 0030` | ⏳ |',
  ];
  writeFileSync(ROADMAP, roadmap.replace(row, rows.join('\n')));
}

const OPEN_BRANCH = { 'salas-3-family': 'feature/0014-room-ranking', 'salas-family-2x': 'feature/0031-room-tariff', 'salas-3-nofamily': 'feature/0019-favorite-rooms' };

const molds = {
  salas: () => {},
  'salas-3-family': layer3Family,
  'salas-family-2x': salasFamily2x,
  'salas-3-nofamily': () => {
    layer3();
    s.copy(join(HERE, 'mold-salas-3-nofamily'));
  },
  'salas-3': layer3,
  'salas-3-retro': () => {
    layer3();
    s.put('.docs/sdd/releases/v1.5.0/retro.md', '# Retro — v1.5.0\n\n## Propuestas\n\n| Causa | Filas | Cambio | Arreglo |\n| --- | --- | --- | --- |\n| carga o paralelismo | «El lote de avisos agota su tiempo» | Lanzar el lote con un solo worker | conectar comprobación |\n\n## Estimación y action items\n\n- **Action items nuevos**:\n  - [A1] Medir el lote con la máquina cargada — su tiempo en el log\n');
  },
  // salas-3-retro sin `release` en el marcador: el paso del destinatario pregunta.
  'salas-3-retro-ask': () => {
    molds['salas-3-retro']();
    const marker = MARKER.replace('"release": {"hasRecipient": false}, ', '');
    if (marker === MARKER) s.die('el marcador cambió: no hay release que quitar');
    s.putKitMarker(marker);
  },
  // salas-3 sin la exportación a CSV ni su fila de deuda: m5 apunta la exportación como fila nueva.
  'salas-3-plain': () => {
    layer3();
    s.copy(join(HERE, 'mold-salas-3-plain'));
  },
  // salas-3 con un ticket cuyo dato solo desmiente el walkthrough que cita: m3b, el contraste de campo.
  'salas-3-wt': () => {
    layer3();
    s.copy(join(HERE, 'mold-salas-3-wt'));
  },
  // salas-3 con dos tickets que cuentan la misma causa con palabras distintas, y otro de la misma categoría y otro mecanismo.
  'salas-3-cause': () => {
    layer3();
    s.copy(join(HERE, 'mold-salas-3-cause'));
  },
  // 2.x: una fila que espera su 2.º ticket, sin causa, y el ticket que la completa con otras palabras.
  'salas-cause-2x': () => {
    s.copy(join(HERE, 'mold-salas-cause-2x'));
    const row = '| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |';
    const roadmap = readLf(ROADMAP);
    if (!roadmap.includes(row)) s.die('el roadmap del molde salas cambió: no hay dónde poner la fila de deuda');
    writeFileSync(ROADMAP, roadmap.replace(row, `${row}\n| Las salidas de \`DRY_RUN=1\` no aparecen en \`out/\` ([ticket](../../docs/tickets/2026-10-05-salidas.md)) | Medio | **Esperar 2.º ticket** — falta 2.º caso |`));
  },
  // salas-3-plain con un fichero que solo reexporta: el arreglo vive en src/lib/notify.js.
  'salas-3-reexport': () => {
    layer3();
    s.copy(join(HERE, 'mold-salas-3-plain'));
    s.put('src/avisos.js', "export { notify } from './lib/notify.js';\n");
    s.put('src/lib/notify.js', 'export const notify = (room) => `aviso: ${room.toLowerCase()}`;\n');
    const app = join(s.R, 'src', 'app.js');
    const code = readLf(app);
    if (!code.includes("if (cmd === 'libres')")) s.die('el molde salas-3-plain cambió: no hay dónde poner avisar');
    writeFileSync(app, `import { notify } from './avisos.js';\n${code.replace("  if (cmd === 'libres')", "  if (cmd === 'avisar') return notify(params[0]);\n  if (cmd === 'libres')")}`);
  },
  // Las medidas de un gate solo en un log sin versionar.
  'salas-gate': () => {
    s.put('.gitignore', '.temp/\n');
    s.put('.temp/gate-times.log', 'test/app.test.js 1,2 s\ntest/store.test.js 31 min 40 s\ntest/report.test.js 8 min 12 s\ntotal 40 min\n');
  },
  'salas-qa': layerQa,
  'salas-0013': salas0013,
};
const mold = moldFrom(cell, s, molds);
mold();
s.initRepo();
const openBranch = OPEN_BRANCH[cell('Molde')];
if (openBranch) s.git('branch', openBranch);

if (s.SC === 'id3') s.env.TURN2 = 'Súbela a Next.';
if (s.SC === 'rl1') s.env.TURN2 = 'Dame el prompt de esa fila.';
s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
const keepIfPresent = (path, name) => existsSync(path) && s.keep(path, name);
keepIfPresent(ROADMAP, 'roadmap.md');
keepIfPresent(join(s.R, PATCH_0007), 'patch-0007.md');
keepIfPresent(join(s.R, 'ROADMAP.md'), 'roadmap-3.md');
keepIfPresent(join(s.R, '.docs', 'sdd', 'steering', 'debt.md'), 'debt.md');
// La propuesta que escribe el sujeto, para leer su forma (M2b).
for (const base of ['specs', 'changes']) {
  const dir = join(s.R, '.docs', 'sdd', base);
  if (!existsSync(dir)) continue;
  for (const folder of readdirSync(dir).filter((name) => name.includes('-proposal-'))) {
    keepIfPresent(join(dir, folder, 'proposal.md'), `${folder.replace(/^\d{8}-\d{6}-/, '')}.md`);
  }
}
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
