// Sujeto de la batería de sdd-grilling: una petición de battery.md que lleva a una skill que entrevista.
// Lo lanza tests/headless/battery.mjs run: el sujeto no lleva el CLAUDE.md del dev-lead.
import { appendFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

const molds = {
  salas: () => {
    s.copy(SALAS);
    s.putKitMarker(SALAS_MARKER);
  },
  reservas: () => {
    s.copy(join(HERE, 'mold-reservas'));
    s.putKitMarker(SALAS_MARKER);
  },
  'salas-csv': () => {
    molds.salas();
    const roadmap = join(s.R, '.docs', 'sdd', 'roadmap.md');
    const row1 = '| 1 | Avisos por correo antes de la reserva | ⏳ |';
    const row2 = '| 2 | Exportar a CSV las reservas de una sala, para que el responsable las cuadre los lunes en su hoja de cálculo; separador punto y coma (su Excel está en castellano) y por la salida estándar, que él redirige a su fichero (responsable de salas, 2026-11-01: «así me sirve») | ⏳ |';
    const text = readFileSync(roadmap, 'utf8');
    const eol = text.includes('\r\n') ? '\r\n' : '\n';
    if (!text.includes(row1 + eol)) throw new Error(`salas-csv: falta la fila 1 en ${roadmap}`);
    writeFileSync(roadmap, text.replace(row1 + eol, row1 + eol + row2 + eol));
  },
  'salas-sin-docs': () => {
    s.copy(SALAS);
    rmSync(join(s.R, '.docs'), { recursive: true });
  },
  'salas-web': () => {
    s.copy(SALAS);
    s.putKitMarker(SALAS_MARKER);
    s.copy(join(HERE, 'mold-web', 'public'), 'public');
    s.copy(join(HERE, 'mold-web', 'src'), 'src');
    appendFileSync(join(s.R, '.docs', 'sdd', 'tech-stack.md'), readFileSync(join(HERE, 'mold-web', 'tech-stack-frontend.md')));
  },
  vacio: () => s.put('README.md', '# citas\n'),
};
const mold = moldFrom(cell, s, molds);
mold();
s.initRepo();

const turn2 = { g3: 'sí, adelante: feature full con delegate', g4: 'mantengo lo que dije', g5: 'decide tú lo que puedas', g6: 'sí, adelante: feature full con delegate' };
if (turn2[s.SC]) s.env.TURN2 = turn2[s.SC];
if (s.SC === 'g9') s.env.EXTRA_ALLOWED = 'WebSearch WebFetch';

if (s.SC === 'ag') s.env.MAX_TURNS ||= '45';
s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
if (s.SC === 'g7') await s.converse(join(HERE, 'persona-g7.md'), 8);
if (s.SC === 'g6') await s.resume('no, espera, explícamelo mejor');
for (const file of s.git('ls-files', '--others', '--exclude-standard', '--', '.docs/sdd/specs/*/spec.md').split('\n').filter(Boolean)) {
  s.keep(join(s.R, file), 'spec.md');
}
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
