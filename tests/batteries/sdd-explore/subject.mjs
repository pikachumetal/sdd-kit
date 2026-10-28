// Sujeto de la batería de sdd-explore: una pregunta sobre el proyecto, que puede acabar en trabajo.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const [kit, , SC] = process.argv.slice(2);
// Si el kit que se prueba aún no tiene la skill esperada, la guarda comprueba la puerta de entrada.
const expected = (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), existsSync(join(kit, 'skills', expected)) ? expected : 'using-sdd');
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}';

if (cell('Molde') !== 'salas') s.die(`molde desconocido en battery.md: ${s.SC}`);
s.copy(join(HERE, '..', 'using-sdd', 'mold-salas'));
s.putKitMarker(MARKER);
writeFileSync(join(s.R, 'package.json'), '{"type": "module", "engines": {"node": ">=22"}}\n');
s.initRepo();

s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
s.keep(join(s.R, '.docs', 'sdd', 'roadmap.md'), 'roadmap.md');
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}## package.json\n${readFileSync(join(s.R, 'package.json'), 'utf8')}`);
