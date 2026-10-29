// Sujeto de la batería de sdd-init: un repo en el punto de la init que mide el escenario.
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenarioCell, subjectCell, moldFrom } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const [kit, , SC] = process.argv.slice(2);
const MOLD = scenarioCell(HERE, SC, 'Molde') ?? '';
// Un kit sin sdd-init (el RED) usa la init vieja que toca y el molde en la forma 2.x que esa lee.
const SKILL = existsSync(join(kit, 'skills', 'sdd-init')) ? 'sdd-init' : ['blank', 'template'].includes(MOLD) ? 'sdd-init-greenfield' : 'sdd-init-brownfield';
const s = initSubject(process.argv.slice(2), SKILL);
const cell = subjectCell(HERE, s);
const ASK = cell('Petición').replaceAll('sdd-kit:sdd-init', `sdd-kit:${SKILL}`);
const fresh = SKILL === 'sdd-init';

const doc = (title, body, path) => s.put(path, `# ${title} — Reservas\n\n${body}\n`);
const moldBlank = () => s.put('README.md', '# Reservas de salas\n');
function moldCode() {
  moldBlank();
  s.put('package.json', '{\n  "name": "reservas",\n  "scripts": { "dev": "vite", "test": "vitest run", "e2e": "playwright test" },\n  "devDependencies": { "vite": "^7.0.0", "vitest": "^4.0.0", "@playwright/test": "^1.55.0" }\n}\n');
  s.put('src/app.ts', 'export function reserve(room: string, slot: string): string {\n  return `reservada ${room} ${slot}`;\n}\n');
  s.put('.github/workflows/ci.yml', 'name: ci\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n');
  s.put('CLAUDE.md', '# Reservas\n\n- Usa `npm run dev` en el puerto 3000.\n- Las fechas van en UTC.\n');
}
function moldE2e() {
  s.put('playwright.config.ts', "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './e2e',\n  retries: process.env.CI ? 2 : 0,\n  timeout: 60_000,\n});\n");
  s.put('e2e/booking.spec.ts', "import { expect, test } from '@playwright/test';\n\ntest('reserva Norte a las 10:00', async ({ page }) => {\n  await page.goto('/');\n  await page.getByRole('button', { name: 'Reservar' }).click();\n  await expect(page.getByText('reservada Norte 10:00')).toBeVisible();\n});\n");
  s.put('e2e/cancel.spec.ts', "import { expect, test } from '@playwright/test';\n\ntest('cancela una reserva', async ({ page }) => {\n  await page.goto('/mis-reservas');\n  await page.getByRole('button', { name: 'Cancelar' }).click();\n  await expect(page.getByText('cancelada')).toBeVisible();\n});\n");
}
function moldGate() {
  s.put('package.json', '{\n  "name": "reservas",\n  "scripts": { "dev": "vite", "test": "vitest run", "e2e": "playwright test", "lint": "eslint ." },\n  "devDependencies": { "vite": "^7.0.0", "vitest": "^4.0.0", "@playwright/test": "^1.55.0", "eslint": "^9.0.0" }\n}\n');
  s.put('package-lock.json', '{\n  "name": "reservas",\n  "lockfileVersion": 3,\n  "packages": {}\n}\n');
  s.put('vitest.config.ts', "import { defineConfig } from 'vitest/config';\n\nexport default defineConfig({ test: { include: ['src/**/*.test.ts'] } });\n");
  s.put('playwright.config.ts', "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({ testDir: './e2e' });\n");
  s.put('tests/helpers/rooms.ts', "export const rooms = ['Norte', 'Sur'];\n");
  s.put('src/app.test.ts', "import { expect, test } from 'vitest';\nimport { reserve } from './app';\nimport { rooms } from '../tests/helpers/rooms';\n\ntest('reserva', () => expect(reserve(rooms[0], '10:00')).toBe('reservada Norte 10:00'));\n");
}
const approvedNew = (list) => s.put('.docs/sdd/sdd-kit.json', `{"init": {"approved": [${list}], "config": {"ids": {"mode": "sequence"}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "execution": "auto", "validation": {"mode": "manual"}}}}\n`);
function progressNew() {
  doc('Product', '## Users\n\nEl equipo de oficina reserva salas.\n\n## Product Purpose\n\nReservar salas por franja.', 'PRODUCT.md');
  doc('Constitution', '## Reglas de producto\n\n- **Dónde viven los datos**: en memoria.', '.docs/sdd/steering/constitution.md');
}
function progressOld() {
  doc('Mission', 'El equipo de oficina reserva salas por franja.', '.docs/sdd/mission.md');
  doc('Constitution', '## Reglas de producto\n\n- **Dónde viven los datos**: en memoria.', '.docs/sdd/constitution.md');
}
function claudeNew() {
  progressNew();
  doc('Operations', '## Comandos\n\n- **Arrancar**: `npm run dev` (puerto 3000)\n\n## Testing\n\n- **Gate de cierre**: `npm test`', '.docs/sdd/steering/operations.md');
  doc('Architecture', 'Una SPA con Vite.', '.docs/sdd/steering/architecture.md');
  s.put('ROADMAP.md', '# Roadmap — Reservas\n\n## Now\n\n## Next\n\n## Later\n');
  doc('Debt', '## Por triar', '.docs/sdd/steering/debt.md');
  doc('Estimation', 'Método: horas.', '.docs/sdd/steering/estimation.md');
  approvedNew('"PRODUCT.md", ".docs/sdd/steering/constitution.md", ".docs/sdd/steering/operations.md", ".docs/sdd/steering/architecture.md", "ROADMAP.md", ".docs/sdd/steering/debt.md", ".docs/sdd/steering/estimation.md"');
}
function claudeOld() {
  progressOld();
  doc('Tech stack', '- **Arrancar**: `npm run dev` (puerto 3000)\n- **Tests**: `npm test`', '.docs/sdd/tech-stack.md');
  doc('Architecture', 'Una SPA con Vite.', '.docs/sdd/architecture.md');
  s.put('.docs/sdd/roadmap.md', '# Roadmap — Reservas\n\n## Próximo\n');
}
function moldTemplate() {
  s.put('package.json', '{\n  "name": "nuevo-proyecto",\n  "scripts": { "dev": "ng serve", "test": "ng test" }\n}\n');
  s.put('src/login.ts', 'export function login(user: string): boolean {\n  return user.length > 0;\n}\n');
  doc('Mission', '<!-- sdd-template: pending -->', '.docs/sdd/mission.md');
  s.put('.docs/sdd/roadmap.md', '# Roadmap\n\n<!-- sdd-template: pending -->\n');
  doc('Constitution', '## Convenciones\n\n- Commits convencionales.\n\n## Reglas de producto\n\n<!-- sdd-template: pending -->', '.docs/sdd/constitution.md');
  doc('Tech stack', '- Angular 20 y .NET 10.\n- **Tests**: `ng test`', '.docs/sdd/tech-stack.md');
  doc('Architecture', 'Frontend Angular, backend .NET, login con cookie.', '.docs/sdd/architecture.md');
  doc('Environments', '- **Runner**: `pnpm env:setup`', '.docs/sdd/environments.md');
  s.put('.docs/sdd/sdd-kit.json', '{"version": "1.1.0", "channel": "plugin", "updated": "2026-09-01"}\n');
}
function progress() {
  if (!fresh) return progressOld();
  progressNew();
  approvedNew('"PRODUCT.md", ".docs/sdd/steering/constitution.md"');
}

const molds = {
  blank: moldBlank,
  code: moldCode,
  'code-progress': () => {
    moldCode();
    progress();
  },
  'code-e2e-progress': () => {
    moldCode();
    moldE2e();
    progress();
  },
  'code-gate-progress': () => {
    moldCode();
    moldGate();
    progress();
  },
  'code-claude': () => {
    moldCode();
    if (fresh) claudeNew();
    else claudeOld();
  },
  template: moldTemplate,
};
const mold = moldFrom(() => MOLD, s, molds);
mold();
s.git('init', '-q', '-b', 'main');
s.commit('feat: base del molde');

// Una pregunta por turno: si n7 para en una, el segundo turno la contesta para que llegue a proponer ## Testing entero.
if (s.SC === 'n7') s.env.TURN2 = 'La que recomiendas. Sigue con el resto de operations.md.';
s.env.MAX_TURNS ||= '30';
await s.launch(ASK);
for (const kept of ['CLAUDE.md', 'PRODUCT.md', '.docs/sdd/sdd-kit.json', '.docs/sdd/steering/operations.md', '.docs/sdd/tech-stack.md', '.docs/sdd/mission.md']) {
  if (existsSync(join(s.R, kept))) s.keep(join(s.R, kept), basename(kept));
}
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## diff\n${s.git('diff', '--stat')}`);
