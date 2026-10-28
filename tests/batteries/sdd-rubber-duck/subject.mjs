// Sujeto de la batería de sdd-rubber-duck: algo que explicar a un dev-lead que conoce el producto y no el código.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SC = process.argv[4];
const red = (process.env.PHASE || 'red').startsWith('red');
// En el RED la skill que se mide aún no existe: la guarda comprueba la copia del kit con la puerta de entrada.
const guard = red ? 'using-sdd' : (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), guard);
const cell = (column) => scenarioCell(HERE, s.SC, column) ?? s.die(`sin el escenario ${s.SC} en battery.md`);
let ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';

const molds = { exportes: join(HERE, 'mold-exportes'), salas: join(HERE, '..', 'using-sdd', 'mold-salas') };
const mold = molds[cell('Molde')] ?? s.die(`molde desconocido en battery.md: ${s.SC}`);
s.copy(mold);
s.putKitMarker(MARKER);
s.git('init', '-q', '-b', 'main');
s.commit('feat: base del molde');
s.git('checkout', '-q', '-b', 'develop');

if (s.SC === 's1') s.git('checkout', '-q', '-b', 'feature/0013-export-by-room');
if (s.SC === 's2' || s.SC === 'w1') s.git('checkout', '-q', '-b', 'feature/0012-ics-export');

// La skill no existe en el kit del RED: la petición de una parada la nombra solo fuera de él.
if ((s.SC === 's1' || s.SC === 's2') && !red) ASK = `Invoca la skill sdd-kit:sdd-rubber-duck en modo corto y ${ASK[0].toLowerCase()}${ASK.slice(1)}`;

s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
