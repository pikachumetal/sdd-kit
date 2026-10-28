// Sujeto de la batería de sdd-start-feature: un paso del flujo, con los artefactos de ese punto ya escritos.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const FIX = join(HERE, 'fixtures');
const SC = process.argv[4];
const s = initSubject(process.argv.slice(2), (scenarioCell(HERE, SC, 'Esperado') ?? '').replace(/^sdd-kit:/, ''));
const cell = (column) => scenarioCell(HERE, s.SC, column) ?? s.die(`sin el escenario ${s.SC} en battery.md`);
const ASK = cell('Petición');
const MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"';
const F10 = '.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason';
const F11 = '.docs/sdd/specs/20261008-110000-feature-0011-void-others';

s.copy(join(HERE, 'mold-reservas'));
const markers = { reservas: MARKER, 'reservas-campo': `${MARKER}, "validation": {"mode": "field"}` };
const marker = markers[cell('Molde')] ?? s.die(`molde desconocido en battery.md: ${s.SC}`);
s.putKitMarker(marker);
s.git('init', '-q', '-b', 'main');
s.commit('feat: base del molde');
s.git('checkout', '-q', '-b', 'develop');

// Como el sed de Git Bash, que dejaba las líneas en LF.
const approvedSpec = () => readFileSync(join(FIX, 'spec-0010.md'), 'utf8').replaceAll('\r\n', '\n')
  .replace(/^status: draft/m, 'status: approved')
  .replaceAll('approved_at: null', 'approved_at: 2026-10-08')
  .replaceAll('| dev-lead | Laura | | pendiente |', '| dev-lead | Laura | 2026-10-08 | aprobada |');
const withoutWho = (text) => text
  .replaceAll(' y quién canceló', '')
  .replaceAll(' cancelada por Ana con', ' cancelada con')
  .replaceAll(' — sala ocupada — Ana»', ' — sala ocupada»')
  .replace(/^2\. El listado de canceladas enseña sala.*\n/m, '');
function taskCommit(name, title) {
  copyFileSync(join(FIX, `app-${name}.js`), join(s.R, 'src', 'app.js'));
  copyFileSync(join(FIX, `cancel-${name}.test.js`), join(s.R, 'test', 'cancel.test.js'));
  s.commit(title);
}

if (s.SC === 'v1a' || s.SC === 'v1b') {
  s.git('checkout', '-q', '-b', 'feature/0010-cancel-reason');
  s.put(`${F10}/spec.md`, withoutWho(approvedSpec()));
  s.put(`${F10}/plan.md`, readFileSync(join(FIX, 'plan-0010.md'), 'utf8'));
  s.commit('docs(sdd): abrir la feature 0010 con su spec y su plan');
  taskCommit('task1', 'feat(bookings): cancelar con un motivo de la lista');
  taskCommit('done', 'feat(bookings): listado de canceladas con su motivo');
  s.put(`${F10}/tasks.md`, readFileSync(join(FIX, 'tasks-0010-v1.md'), 'utf8'));
  s.commit('docs(sdd): registro de tasks de la 0010');
} else if (s.SC === 'a1') {
  s.git('checkout', '-q', '-b', 'feature/0011-void-others');
  s.put(`${F11}/spec.md`, readFileSync(join(FIX, 'spec-0011.md'), 'utf8'));
}

s.env.MAX_TURNS ||= { v1b: '20', a1: '25' }[s.SC] ?? '40';
await s.launch(ASK);
for (const kept of ['spec', 'plan', 'tasks']) {
  for (const folder of [F10, F11]) if (existsSync(join(s.R, folder, `${kept}.md`))) s.keep(join(s.R, folder, `${kept}.md`), `${kept}.md`);
}
const specs = join(s.R, '.docs', 'sdd', 'specs');
const readme = statSync(join(s.R, 'README.md')).mtimeMs;
const newSpec = (existsSync(specs) ? readdirSync(specs) : [])
  .map((folder) => join(specs, folder, 'spec.md'))
  .find((path) => existsSync(path) && statSync(path).mtimeMs > readme && !path.includes(F10.split('/').at(-1)) && !path.includes(F11.split('/').at(-1)));
if (newSpec) s.keep(newSpec, 'spec-new.md');
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## ficheros\n${s.git('ls-files', '--others', '--exclude-standard')}`);
