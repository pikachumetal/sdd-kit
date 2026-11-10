// Sujeto de la batería de sdd-rubber-duck: algo que explicar a un dev-lead que conoce el producto y no el código.
// Lo lanza tests/headless/battery.mjs run: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const [kit, , SC] = process.argv.slice(2);
// Sin la skill en el kit que se prueba (el RED de la 0145) la guarda comprueba la puerta de entrada; mirar la fase falla en el RED de un patch posterior (feature 0161).
const red = !existsSync(join(kit, 'skills', 'sdd-rubber-duck'));
const guard = red ? 'using-sdd' :(scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), guard);
const cell = subjectCell(HERE, s);
let ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';

const molds = { exportes: join(HERE, 'mold-exportes'), salas: join(HERE, '..', 'using-sdd', 'mold-salas') };
const mold = moldFrom(cell, s, molds);
s.copy(mold);
s.putKitMarker(MARKER);
// s3 y s4 (patch 0317): las dos líneas de ayuda ya van dentro de un recuadro; la Task 2 solo les pone cuatro espacios delante.
const indent = s.SC === 's3' || s.SC === 's4';
const usage = (pad) => `# exportes\n\nReservas de salas de reuniones desde la terminal, con exportación al calendario.\n\n## Uso\n\n\`\`\`text\n${pad}node src/cli.js exportar --mes 2026-03\n${pad}node --test\n\`\`\`\n`;
if (indent) s.put('README.md', usage(''));
s.initRepo();

if (s.SC === 's1' || indent) s.git('checkout', '-q', '-b', 'feature/0013-export-by-room');
if (s.SC === 's2' || s.SC === 'w1') s.git('checkout', '-q', '-b', 'feature/0012-ics-export');
if (indent) {
  s.put('README.md', usage('    '));
  s.commit('feat(export): Task 2 de la feature 0013');
}

// Sin la skill en el kit, la petición de una parada no la nombra.
if ((['s1', 's2', 's3', 's4'].includes(s.SC) && !red) || s.SC === 's5') ASK = `Invoca la skill sdd-kit:sdd-rubber-duck en modo corto y ${ASK[0].toLowerCase()}${ASK.slice(1)}`;

s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
