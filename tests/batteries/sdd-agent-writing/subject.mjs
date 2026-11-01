// Sujeto de la batería de sdd-agent-writing: un proyecto con skills propias y algo que escribir para un agente.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const red = (process.env.PHASE || 'red').startsWith('red');
const guard = red ? 'using-sdd' : (scenarioCell(HERE, process.argv[4], 'Esperado') ?? '').replace(/^sdd-kit:/, '');
const s = initSubject(process.argv.slice(2), guard);
const cell = subjectCell(HERE, s);
const REQUEST = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';

const salas = join(HERE, '..', 'using-sdd', 'mold-salas');
s.copy(moldFrom(cell, s, { skill: salas }));
s.copy(join(HERE, 'mold-skill'));
s.putKitMarker(MARKER);
s.initRepo();

// En el RED la skill no existe: la petición de quien la invoca la nombra solo fuera de él.
const named = s.SC !== 'p1' && !red;
const ask = named ? `Invoca la skill sdd-kit:sdd-agent-writing y ${REQUEST[0].toLowerCase()}${REQUEST.slice(1)}` : REQUEST;

s.env.MAX_TURNS ||= '30';
await s.launch(ask);
s.save(`## petición\n${ask}\n## git status\n${s.git('status', '--short')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}\n## diff\n${s.git('diff')}`);
