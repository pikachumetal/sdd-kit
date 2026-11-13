// Sujeto de la batería del entrevistador: una petición de battery.md que llega a una entrevista de explore, init o propose.
// Lo lanza tests/headless/battery.mjs run con KIT_DIR en la copia del kit de un núcleo (make-kits.mjs).
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SC = process.argv[4];
const s = initSubject(process.argv.slice(2), (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, ''));
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const SALAS = join(HERE, '..', 'using-sdd', 'mold-salas');
const SALAS_MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';
// La «2» de la 2.x es la 0002, tras la de avisos por correo, la última de Now (la misma fila que el molde salas-csv de sdd-grilling).
const ROW_2 = '| 0002 | — | **Exportar a CSV las reservas de una sala**<br>*para que el responsable las cuadre los lunes en su hoja de cálculo; separador punto y coma (su Excel está en castellano) y por la salida estándar, que él redirige a su fichero (responsable de salas, 2026-11-01: «así me sirve»)*<details><summary>Brief</summary>**Carril:** feature<br>**Requisitos:** —<br>**Decisiones ya tomadas:** —<br>**Salda:** nada<br>**Toca:** —</details> | ⏳ | — | M |';

function addRow2() {
  const roadmap = join(s.R, 'ROADMAP.md');
  const text = readFileSync(roadmap, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const avisos = text.split(eol).find((line) => /^\| 0008 \|.*Avisos por correo antes de la reserva/.test(line));
  if (!avisos) throw new Error(`salas-csv: falta la fila de avisos por correo en ${roadmap}`);
  writeFileSync(roadmap, text.replace(avisos + eol, avisos + eol + ROW_2 + eol));
}

const molds = {
  salas: () => {
    s.copy(SALAS);
    s.putKitMarker(SALAS_MARKER);
  },
  'salas-csv': () => {
    molds.salas();
    addRow2();
  },
  'salas-sin-docs': () => {
    s.copy(SALAS);
    rmSync(join(s.R, '.docs'), { recursive: true });
  },
  vacio: () => s.put('README.md', '# citas\n'),
};
moldFrom(cell, s, molds)();
s.initRepo();

const goAhead = 'sí, adelante: feature full con delegate. La quiero porque cuando Norte está ocupada tengo que volver a mirar libres a mano cada rato';
const turn2 = {
  g1: 'lo quiero porque hay reuniones de media hora y hoy bloquean una franja entera de dos horas',
  g3: goAhead,
  fp: 'mantengo lo que dije',
};
if (turn2[s.SC]) s.env.TURN2 = turn2[s.SC];
if (s.SC === 'g9') s.env.EXTRA_ALLOWED = 'WebSearch WebFetch';
// Lo que pe mide acaba antes de la review de la spec, cuyos revisores costaban 1 $ por sujeto en la pasada en seco.
if (s.SC === 'pe') s.env.EXTRA_DISALLOWED = 'Agent';
s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
if (s.SC === 'pe') await s.converse(join(HERE, 'persona-pe.md'), 8);
for (const file of s.git('ls-files', '--others', '--exclude-standard', '--', '.docs/sdd/specs/*/spec.md', '.docs/sdd/changes/*/spec.md').split('\n').filter(Boolean)) {
  s.keep(join(s.R, file), 'spec.md');
}
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
