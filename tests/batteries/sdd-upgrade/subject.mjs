// Sujeto de la batería de sdd-upgrade: una petición de battery.md sobre el molde salas de using-sdd, con migraciones pendientes.
// Lo lanza tests/headless/battery.mjs run: el sujeto no lleva el CLAUDE.md del dev-lead.
import { spawnSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject, readLf } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const kit = process.argv[2];
// En el RED el kit aún no trae sdd-upgrade: la guarda de initSubject mira using-sdd.
const s = initSubject(process.argv.slice(2), existsSync(join(kit, 'skills', 'sdd-upgrade', 'SKILL.md')) ? 'sdd-upgrade' : 'using-sdd');
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const MARKER = '"channel": "plugin", "updated": "2026-10-01", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';
const edit = (path, change) => writeFileSync(join(s.R, path), change(readLf(join(s.R, path))));

// El kit propio de m2: la migración de juguete no puede llegar a los sujetos de los demás escenarios, que comparten KIT_DIR.
function kitWithToyMigration() {
  const own = join(s.RUN, 'kit');
  cpSync(s.KIT, own, { recursive: true });
  const upgrade = join(own, 'skills', 'sdd-upgrade', 'references', 'migrations');
  const dir = existsSync(upgrade) ? upgrade : join(own, 'skills', 'sdd-init', 'references', 'migrations');
  copyFileSync(join(HERE, 'v2.3.5.md'), join(dir, 'v2.3.5.md'));
  s.KIT = own;
}

const MOLD = cell('Molde');
const V2X = MOLD.startsWith('v2x');
const SALAS3 = MOLD.startsWith('salas3');
const moldSource = () => {
  if (V2X) return join(HERE, 'mold-v2x');
  return join(HERE, '..', SALAS3 ? 'sdd-roadmap/mold-salas-3' : 'using-sdd/mold-salas');
};
s.copy(moldSource());
// Lo que entra en develop tras la etiqueta de la release: la migración decide lo publicado por ella.
const AFTER_RELEASE = {};
const SUPERPOWERS_MARKETPLACE = { source: { source: 'github', repo: 'obra/superpowers-marketplace' }, autoUpdate: true };
// Ya en la estructura de la 3.0.0: los pasos 1 a 6 se saltan, y el sujeto llega barato al paso de superpowers.
function salas3WithSuperpowers(enabledPlugins) {
  // La fila B1 no valida en `sdd roadmap check`, y el sujeto paraba antes del marcador.
  edit('ROADMAP.md', (text) => text.split('\n').filter((line) => !line.startsWith('| B1 ')).join('\n'));
  s.put('.docs/sdd/sdd-kit.json', `{"version": "2.3.4", ${MARKER}}\n`);
  s.put('.claude/settings.json', `${JSON.stringify({ extraKnownMarketplaces: { 'superpowers-marketplace': SUPERPOWERS_MARKETPLACE }, enabledPlugins }, null, 2)}\n`);
}
const molds = {
  salas3: () => salas3WithSuperpowers({ 'superpowers@superpowers-marketplace': true }),
  'salas3-shared': () => salas3WithSuperpowers({ 'superpowers@superpowers-marketplace': true, 'elements-of-style@superpowers-marketplace': true }),
  // Ya migrado, con una regla que repite el kit: lo que mide que la revisión de reglas no abra el paso de superpowers.
  'salas3-current': () => {
    salas3WithSuperpowers({ 'superpowers@superpowers-marketplace': true });
    s.put('.docs/sdd/sdd-kit.json', `{"version": "3.0.0", ${MARKER}}\n`);
    s.put('CLAUDE.md', '# salas\n\n- El id de una feature se elige a mano.\n');
  },
  // Un proyecto 2.x con superpowers activado: el paso 10 tras las tablas y los gates de una migración real.
  'v2x-superpowers': () => s.put('.claude/settings.json', `${JSON.stringify({ extraKnownMarketplaces: { 'superpowers-marketplace': SUPERPOWERS_MARKETPLACE }, enabledPlugins: { 'superpowers@superpowers-marketplace': true } }, null, 2)}\n`),
  salas: () => s.put('.docs/sdd/sdd-kit.json', `{"version": "2.3.3", ${MARKER}}\n`),
  // Un proyecto 2.x completo, en 2.3.4: lo que mide la migración a la 3.0.0.
  v2x: () => {},
  // v2x con lo que destapó migrar un repo real: release por prefijo, filas hechas tras la etiqueta, ids del Backlog,
  // enlaces relativos y un escenario de capabilities/ que cita el cambio de nombre.
  'v2x-release': () => {
    const walk = (id, slug) => `.docs/sdd/specs/20261005-1${id.slice(2)}000-feature-${id}-${slug}/walkthrough.md`;
    edit('.docs/sdd/roadmap.md', (text) => text
      .replace('| 0024 |', `| 0029 | **Avisos por sala** — [walkthrough](specs/20260910-100000-feature-0029-room-notices/walkthrough.md) | ✅ |\n| 0030 | **Release 3.0.0**. **Filtro por planta** — [walkthrough](${walk('0030', 'floor-filter').replace('.docs/sdd/', '')}) | ✅ |\n| 0031 | **Release 3.0.0** (dev-lead, 2026-10-01). **Aviso de sala llena** | ⏳ |\n| 0032 | **Exportar a iCal** — [walkthrough](${walk('0032', 'ical').replace('.docs/sdd/', '')}) | ✅ |\n| 0033 | Patch: **Release 3.0.0**. **La franja de las 14:00 no se reserva** | ✅ |\n| 1 | Estreno con recepción: usar el kit en las tareas reales | 🔄 en curso |\n| 0024 |`)
      .replace('| B3 |', '| 0040 | Reservas recurrentes | Recepción, reunión del 2026-09-18 |\n| B3 |')
      .replace(/^(\| 2026-09-25 \| 0023 .*)$/m, '$1\n| 2026-10-06 | 0033 | La franja de las 14:00 no se reserva — [patch](specs/20261006-100000-patch-0033-two-pm/patch.md) |'));
    edit('.docs/sdd/tech-stack.md', (text) => text.replace('- Gate de cierre: `npm test`.', '- Gate de cierre: `npm test`.\n- Una validación escrita de antemano no valida (task 0012): 2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0 a preguntar.'));
    edit('.docs/sdd/changelog.md', (text) => text.replace('- **Feature 0016** — Resumen semanal de reservas.', '- **Feature 0016** — Resumen semanal de reservas. → [ref](specs/20260915-090000-feature-0016-weekly/walkthrough.md)'));
    // Cerrada antes de la etiqueta: publicada en la 1.2.0, sale del roadmap.
    s.put('.docs/sdd/specs/20260910-100000-feature-0029-room-notices/walkthrough.md', '# Walkthrough — Avisos por sala\n');
    s.put('.docs/sdd/capabilities/cierre.md','# Capacidad — cierre\n\n## Propósito\n\nCerrar una tarea del proyecto.\n\n## Requisitos\n\n### El cierre de un patch\n\n- GIVEN un patch terminado\n- WHEN se cierra con `sdd-end-patch`\n- THEN queda fusionado en `develop`\n\n### El nombre del cierre cambia en la 3.0.0\n\n- GIVEN un proyecto en 2.3.4\n- WHEN migra a la 3.0.0\n- THEN `sdd-end-patch` pasa a `sdd-archive`\n\n## Reglas de la capacidad\n\n- **Dónde viven los datos**: no aplica.\n- **Idioma de los nombres**: no aplica.\n- **Límites**: no aplica.\n- **Avisos**: no aplica.\n- **Regla ante conflicto**: no aplica.\n');
    AFTER_RELEASE[walk('0030', 'floor-filter')] = '# Walkthrough — Filtro por planta\n';
    AFTER_RELEASE[walk('0032', 'ical')] = '# Walkthrough — Exportar a iCal\n';
    AFTER_RELEASE['.docs/sdd/specs/20261006-100000-patch-0033-two-pm/patch.md'] = '# Patch — La franja de las 14:00\n';
  },
  // v2x con E2E: lo que mide que la migración proponga los campos E2E de operations-template.md.
  'v2x-e2e': () => {
    s.put('playwright.config.ts', "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './e2e',\n  retries: process.env.CI ? 2 : 0,\n  timeout: 60_000,\n});\n");
    s.put('e2e/booking.spec.ts', "import { expect, test } from '@playwright/test';\n\ntest('reserva Norte a las 10:00', async ({ page }) => {\n  await page.goto('/');\n  await page.getByRole('button', { name: 'Reservar' }).click();\n  await expect(page.getByText('reservada Norte 10:00')).toBeVisible();\n});\n");
    edit('package.json', (text) => text.replace('"test": "vitest run"', '"test": "vitest run", "e2e": "playwright test"'));
    edit('.docs/sdd/tech-stack.md', (text) => text.replace(/^- Gate de cierre: `npm test`\./m, '- Gate de cierre: `npm test`.\n- E2E: `npx playwright test`.'));
  },
  // v2x con un gate de merge encadenado: lo que mide el aviso del paso 9 de la migración a la 3.0.0.
  'v2x-gate': () => edit('.docs/sdd/tech-stack.md', (text) => text.replace(/^- Gate de cierre: `npm test`\./m, '- Gate de cierre: `npm test`.\n- Gate de merge: `pnpm lint && pnpm test`.')),
  // v2x con E2E, lint en el pre-commit y un pipeline sin orden de lectura: lo que mide que el paso 2 proponga nivel, «Sin filtro», «Lint» y «CI de la base».
  'v2x-levels': () => {
    molds['v2x-e2e']();
    s.put('package-lock.json', '{\n  "name": "salas",\n  "lockfileVersion": 3,\n  "packages": {}\n}\n');
    s.put('.husky/pre-commit', 'npx lint-staged\n');
    s.put('azure-pipelines.yml', 'trigger:\n  - develop\npool:\n  vmImage: ubuntu-latest\nsteps:\n  - script: npm ci && npm test\n');
  },
  // v2x con lint en el gate de cierre: lo que mide el aviso «Gate con lint» del paso 9.
  'v2x-lint': () => edit('.docs/sdd/tech-stack.md', (text) => text.replace(/^- Gate de cierre: `npm test`\./m, '- Gate de cierre: `moon run :typecheck :test :lint`.')),
  // Solo configuración, sin version ni init: el molde trae mission.md y constitution.md de la 2.x.
  'salas-noversion': () => s.put('.docs/sdd/sdd-kit.json', '{"ids": {"mode": "sequence"}}\n'),
  'salas-legacy': () => {
    kitWithToyMigration();
    s.put('.docs/sdd/sdd-kit.json', `{"version": "2.3.4", ${MARKER}}\n`);
    s.put('.docs/sdd/legacy.md', '# Funcional heredado\n\nLas reservas son por franja de una hora.\n');
  },
};
const mold = moldFrom(() => MOLD, s, molds);
mold();
s.git('init', '-q', '-b', 'main');

function commitAt(date, title) {
  Object.assign(s.env, { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date });
  s.commit(title);
  delete s.env.GIT_AUTHOR_DATE;
  delete s.env.GIT_COMMITTER_DATE;
}

if (V2X) {
  // Dos fechas pasadas: la fecha de una fila de deuda tiene que salir de su commit, no del día del sujeto.
  const late = '| Pasar `src/app.js` a TypeScript | Bajo | versión siguiente |';
  const roadmap = '.docs/sdd/roadmap.md';
  edit(roadmap, (text) => text.split('\n').filter((line) => !line.includes(late)).join('\n'));
  const patch0023 = '.docs/sdd/specs/20260925-100000-patch-0023-double-booking/patch.md';
  AFTER_RELEASE[patch0023] = readFileSync(join(s.R, patch0023), 'utf8');
  rmSync(join(s.R, patch0023));
  commitAt('2026-09-01T10:00:00', 'feat: base del molde salas');
  s.git('tag', 'v1.2.0');
  edit(roadmap, (text) => text.replace(/^(\| `cancel` no comprueba.*)$/m, `$1\n${late}`));
  commitAt('2026-09-15T10:00:00', 'docs(roadmap): deuda de TypeScript');
  for (const [path, text] of Object.entries(AFTER_RELEASE)) s.put(path, text);
  commitAt('2026-09-25T10:00:00', 'docs(sdd): lo cerrado tras la 1.2.0');
} else {
  s.commit('feat: base del molde salas');
}
s.git('checkout', '-q', '-b', 'develop');

const turn2 = { o1: 'No, ahora no. Sigue con lo del filtro.', o2: 'Sí, actualízalo.', s1: 'Sí, quítala.', s2: 'No, lo usamos fuera del kit.', s3: 'Sí, quítala.' };
if (turn2[s.SC]) s.env.TURN2 = turn2[s.SC];

const long = ['v1', 'v3', 'g1', 'v4', 'g2', 's4', 'v5'].includes(s.SC);
if (long) s.env.MAX_TURNS ||= '90';
s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
if (long) await s.converse(join(HERE, 'persona-v2x.md'), 12);

const markdown = (dir) => readdirSync(dir).flatMap((name) => {
  if (name === '.git') return [];
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return markdown(path);
  return name.endsWith('.md') ? [`./${relative(s.R, path).replaceAll('\\', '/')}`] : [];
});
function sdd(...args) {
  const result = spawnSync(s.NODE, [join(s.KIT, 'cli', 'bin', 'sdd.js'), ...args], { encoding: 'utf8', env: s.env });
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}
function v2xReport() {
  const capabilities = join(s.R, '.docs', 'sdd', 'capabilities');
  const capabilityFiles = existsSync(capabilities) ? readdirSync(capabilities).map((name) => `.docs/sdd/capabilities/${name}`) : [];
  const shown = ['ROADMAP.md', 'CHANGELOG.md', ...capabilityFiles, '.docs/sdd/steering/debt.md', 'PRODUCT.md', '.docs/sdd/steering/operations.md', 'CLAUDE.md', 'README.md', '.docs/sdd/steering/constitution.md', '.docs/sdd/steering/estimation.md', '.claude/commands/pregunta.md']
    .filter((path) => existsSync(join(s.R, path)))
    .map((path) => `## ${path}\n${readFileSync(join(s.R, path), 'utf8')}`);
  return [`## ficheros\n${markdown(s.R).sort().join('\n')}\n`, `## git tag\n${s.git('tag')}`, `## sdd roadmap check\n${sdd('roadmap', 'check', '--path', join(s.R, '.docs', 'sdd'))}`, `## sdd capability check\n${sdd('capability', 'check', '--path', join(s.R, '.docs', 'sdd'))}`, ...shown].join('');
}
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}## sdd-kit.json\n${readFileSync(join(s.R, '.docs', 'sdd', 'sdd-kit.json'), 'utf8')}${existsSync(join(s.R, '.claude', 'settings.json')) ? `## settings.json\n${readFileSync(join(s.R, '.claude', 'settings.json'), 'utf8')}` : ''}${V2X ? v2xReport() : ''}`);
