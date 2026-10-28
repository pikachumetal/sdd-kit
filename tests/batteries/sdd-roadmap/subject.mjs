// Sujeto de la batería de sdd-roadmap: algo que apuntar en el roadmap, o el prompt de arranque de una fila.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

const molds = {
  salas: () => {},
  'salas-3': layer3,
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
  'salas-qa': layerQa,
  'salas-0013': salas0013,
};
const mold = moldFrom(cell, s, molds);
mold();
s.initRepo();

if (s.SC === 'id3') s.env.TURN2 = 'Súbela a Next.';
s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
const keepIfPresent = (path, name) => existsSync(path) && s.keep(path, name);
keepIfPresent(ROADMAP, 'roadmap.md');
keepIfPresent(join(s.R, 'ROADMAP.md'), 'roadmap-3.md');
keepIfPresent(join(s.R, '.docs', 'sdd', 'steering', 'debt.md'), 'debt.md');
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
