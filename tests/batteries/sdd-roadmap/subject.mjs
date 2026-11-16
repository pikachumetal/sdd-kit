// Sujeto de la batería de sdd-roadmap: algo que apuntar en el roadmap, o el prompt de arranque de una fila.
// Lo lanza tests/headless/battery.mjs run: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const s = initSubject(process.argv.slice(2), 'sdd-roadmap');
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}';
const P10_3 = '.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md';
const ROADMAP = join(s.R, 'ROADMAP.md');
const ROADMAP_2X = join(s.R, '.docs', 'sdd', 'roadmap.md');
const CHANGELOG_2X = join(s.R, '.docs', 'sdd', 'changelog.md');
const PATCH_0007 = '.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md';

// El molde salas ya es 3.0.0; los moldes que miden la forma 2.x parten de mold-salas-2x.
const MOLDS_2X = ['salas-qa'];
s.copy(join(HERE, '..', 'using-sdd', MOLDS_2X.includes(cell('Molde')) ? 'mold-salas-2x' : 'mold-salas'));
s.putKitMarker(MARKER);
// La capa salas-3 pisa ROADMAP.md, debt.md y CHANGELOG.md con más filas, y trae el informe de QA y exportar; la propuesta cuelga de changes/.
function layer3() {
  s.copy(join(HERE, 'mold-salas-3'));
  s.put(P10_3, readFileSync(join(HERE, 'proposal-0010.md'), 'utf8'));
}

// 2.x: la capa del informe de QA, con las versiones del changelog antes de la 0.3.0 del molde.
function layerQa() {
  const changelog = readLf(CHANGELOG_2X);
  if (!changelog.includes('## [0.3.0]')) s.die('el changelog del molde salas-2x cambió: no hay dónde poner las versiones');
  s.copy(join(HERE, 'mold-salas-qa'));
  const source = readLf(join(HERE, 'mold-salas-3', 'CHANGELOG.md'));
  const versions = source.slice(source.search(/^## \[1\.4\.1\]/m)).replace(/\n$/, '');
  writeFileSync(CHANGELOG_2X, changelog.replace(/^## \[0\.3\.0\]/m, `${versions}\n\n## [0.3.0]`));
}

const QA_REPORT = join(s.R, 'docs', 'qa', '2026-10-12-informe.md');
const FLOOR_FINDING = '2. `salas libres --planta 2` lista también salas de la planta 1: pide la planta 2 y devuelve `Norte (planta 1)`.';

// El informe de QA propone para la planta un arreglo que no la arregla: con `<`, la planta 2 sigue dando Norte.
function withProposedFix() {
  const report = readLf(QA_REPORT);
  if (!report.split('\n').includes(FLOOR_FINDING)) s.die('el informe del molde cambió: no hay hallazgo 2');
  writeFileSync(QA_REPORT, report.replace(FLOOR_FINDING, `${FLOOR_FINDING} Arreglo propuesto: en \`roomsOnFloor\` de \`src/app.js\`, cambiar \`<=\` por \`<\`.`));
}

function replaceOnce(text, from, to, where) {
  if (!text.includes(from)) s.die(`el molde salas-3 cambió: ${where}`);
  return text.replace(from, to);
}

// `libres --planta` deja fuera las salas ocupadas y, sin número, da las libres de todas las plantas:
// el hallazgo de ayuda es cierto, y sustituir solo su fragmento deja dos «sin número» que se contradicen.
function withOccupiedRoom() {
  const app = join(s.R, 'src', 'app.js');
  const floorCall = "if (cmd === 'libres' && params[0] === '--planta') return roomsOnFloor(Number(params[1])).join(', ');";
  const freeOnAnyFloor = "rooms.filter((room) => !occupiedNow.includes(room)).map((room) => `${room} (planta ${floors[room]})`)";
  let code = readLf(app);
  code = replaceOnce(code, "const rooms = ['Norte', 'Sur'];", "const rooms = ['Norte', 'Oeste', 'Sur'];", 'no hay lista de salas');
  code = replaceOnce(code, 'const floors = { Norte: 1, Sur: 3 };', "const floors = { Norte: 1, Oeste: 1, Sur: 3 };\nconst occupiedNow = ['Oeste'];", 'no hay plantas');
  code = replaceOnce(code, 'floors[room] <= floor)', 'floors[room] <= floor && !occupiedNow.includes(room))', 'no hay filtro de planta');
  code = replaceOnce(code, floorCall, `if (cmd === 'libres' && params[0] === '--planta') return (params[1] ? roomsOnFloor(Number(params[1])) : ${freeOnAnyFloor}).join(', ');`, 'no hay libres --planta');
  writeFileSync(app, code);
}

function withHelpFinding() {
  const oldHelp = '«`libres --planta <n>` lista las salas de la planta <n>»';
  const newHelp = '«`libres --planta <n>` lista las salas libres de la planta <n>; sin número, las libres de todas las plantas»';
  const helpFinding = `3. \`docs/ayuda.md\` no dice que \`libres --planta\` lista solo las salas libres, ni qué da sin número. Arreglo propuesto: cambiar ${oldHelp} por ${newHelp}.`;
  writeFileSync(QA_REPORT, `${readLf(QA_REPORT).replace(/\n$/, '')}\n${helpFinding}\n`);
}

function withHelpDebtRow() {
  const debt = join(s.R, '.docs', 'sdd', 'steering', 'debt.md');
  const floorRow = '| `salas libres --planta 2` lista también salas de la planta 1 | `docs/qa/2026-10-12-informe.md` | 2026-10-12 |';
  const helpRow = '| `docs/ayuda.md` no dice que `libres --planta` lista solo las salas libres, ni qué da sin número | `docs/qa/2026-10-12-informe.md` | 2026-10-12 |';
  const text = readLf(debt);
  if (!text.split('\n').includes(floorRow)) s.die('la deuda del molde cambió: no hay fila de la planta');
  writeFileSync(debt, text.replace(floorRow, `${floorRow}\n${helpRow}`));
}

// salas-3 con el arreglo propuesto y un hallazgo de ayuda que sustituye solo media frase.
function layer3Fix() {
  layer3();
  s.copy(join(HERE, 'mold-salas-3-fix'));
  withProposedFix();
  withOccupiedRoom();
  withHelpFinding();
  withHelpDebtRow();
}

function salas0013() {
  const header = '## Next\n\n| Id | Externo | Tarea | Estado | Tras | Tamaño |\n| --- | --- | --- | --- | --- | --- |\n';
  const roadmap = readLf(ROADMAP);
  if (!roadmap.includes(header)) s.die('el roadmap del molde salas cambió: no hay dónde poner la fila 0013');
  const row = (id, title, oneLiner, requisitos, decisions, tras) => `| ${id} | — | **${title}**<br>*${oneLiner}*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** ${requisitos}<br>**Decisiones ya tomadas:** ${decisions}<br>**Salda:** nada<br>**Toca:** \`src/app.js\`</details> | ⏳ | ${tras} | M |\n`;
  const rows = row('0012', 'Exportar a Excel', 'Una hoja por sala con una fila por reserva', `\`${P10_3}\`, §Reglas de negocio`, 'una hoja por sala', '—')
    + row('0013', 'Aviso semanal a los responsables', 'Cada lunes, las reservas de su planta', `\`${P10_3}\`, §Reglas de negocio y §Enmiendas`, 'el aviso sale los lunes a las 8:00', '0012');
  writeFileSync(ROADMAP, roadmap.replace(header, `${header}${rows}`));
  s.put(P10_3, readFileSync(join(HERE, 'proposal-0010.md'), 'utf8'));
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

const OPEN_BRANCH = { 'salas-3-family': 'feature/0014-room-ranking', 'salas-3-nofamily': 'feature/0019-favorite-rooms' };

const molds = {
  salas: () => {},
  'salas-3-family': layer3Family,
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
  'salas-3-fix': layer3Fix,
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
keepIfPresent(ROADMAP_2X, 'roadmap.md');
keepIfPresent(join(s.R, PATCH_0007), 'patch-0007.md');
keepIfPresent(ROADMAP, 'roadmap-3.md');
keepIfPresent(join(s.R, '.docs', 'sdd', 'steering', 'debt.md'), 'debt.md');
// La propuesta que escribe el sujeto, para leer su forma.
for (const base of ['specs', 'changes']) {
  const dir = join(s.R, '.docs', 'sdd', base);
  if (!existsSync(dir)) continue;
  for (const folder of readdirSync(dir).filter((name) => name.includes('-proposal-'))) {
    keepIfPresent(join(dir, folder, 'proposal.md'), `${folder.replace(/^\d{8}-\d{6}-/, '')}.md`);
  }
}
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
