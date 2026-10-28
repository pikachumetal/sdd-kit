// Sujeto de la batería de sdd-grilling: una petición de battery.md que lleva a una skill que entrevista.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { appendFileSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SC = process.argv[4];
const s = initSubject(process.argv.slice(2), (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, ''));
const cell = (column) => scenarioCell(HERE, s.SC, column) ?? s.die(`sin el escenario ${s.SC} en battery.md`);
const ASK = cell('Petición');
const SALAS = join(HERE, '..', 'using-sdd', 'mold-salas');
const SALAS_MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';

const molds = {
  salas: () => {
    s.copy(SALAS);
    s.putKitMarker(SALAS_MARKER);
  },
  reservas: () => {
    s.copy(join(HERE, '..', 'sdd-start-feature', 'mold-reservas'));
    s.putKitMarker(SALAS_MARKER);
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
const mold = molds[cell('Molde')] ?? s.die(`molde desconocido en battery.md: ${s.SC}`);
mold();
s.git('init', '-q', '-b', 'main');
s.commit('feat: base del molde');
s.git('checkout', '-q', '-b', 'develop');

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
