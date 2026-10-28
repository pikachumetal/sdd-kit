// Sujeto de la batería de sdd-feedback: el ticket de una sesión resumida en notas-sesion.md.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { subjectCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const s = initSubject(process.argv.slice(2), 'sdd-feedback');
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';

s.copy(join(HERE, '..', 'using-sdd', 'mold-salas'));
s.putKitMarker(MARKER);
if (cell('Molde') !== 'sesion') s.die(`molde desconocido en battery.md: ${s.SC}`);
s.copy(join(HERE, 'mold-sesion'));
s.initRepo();

s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
const feedback = join(s.R, '.docs', 'sdd', 'kit-feedback');
const ticket = existsSync(feedback) ? readdirSync(feedback).sort().find((name) => name.endsWith('.md')) : undefined;
if (ticket) s.keep(join(feedback, ticket), 'ticket.md');
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
