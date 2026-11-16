// Molde hojas con «Flujos core» y un test() fuera de la lista. Una task añade un E2E, o un test de componente sin E2E.
// t1: lista declarada, con «formatea una celda como moneda» fuera. t2: «Flujos core» `pendiente`. t3: proyecto sin E2E.
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initSubject } from '../../../../../tests/headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = process.env.KIT_REPO || resolve(HERE, '../../../../..');
const s = initSubject(process.argv.slice(2), 'sdd-tdd');
s.env.MAX_TURNS ||= '50';
s.env.SUBJECT_TIMEOUT ||= '900';
s.copy(join(REPO, 'tests/batteries/sdd-verify/mold-hojas'));
s.put('.gitignore', 'node_modules/\ntest-results/\nplaywright-report/\n');
s.put('vitest.config.ts', "import { defineConfig } from 'vitest/config';\n\nexport default defineConfig({ test: { include: ['src/**/*.test.tsx'], environment: 'jsdom' } });\n");
s.putKitMarker('"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native", "validation": {"mode": "field"}');
const pkg0 = JSON.parse(readFileSync(join(s.R, 'package.json'), 'utf8'));
pkg0.devDependencies.jsdom ||= '25.0.1';
writeFileSync(join(s.R, 'package.json'), JSON.stringify(pkg0, null, 2) + String.fromCharCode(10));
const OPS = join(s.R, '.docs/sdd/steering/operations.md');
const ops = readFileSync(OPS, 'utf8');
const lines = ops.split('\n');
const flowsAt = lines.findIndex((l) => l.startsWith('- **Flujos core**'));
let flowsEnd = flowsAt + 1;
while (lines[flowsEnd].startsWith('  - ')) flowsEnd += 1;

if (s.SC === 't2') {
  lines.splice(flowsAt, flowsEnd - flowsAt, '- **Flujos core**: `pendiente`');
  writeFileSync(OPS, lines.join('\n'));
}
if (s.SC === 't3') {
  rmSync(join(s.R, 'e2e'), { recursive: true });
  rmSync(join(s.R, 'playwright.config.ts'));
  const pkg = JSON.parse(readFileSync(join(s.R, 'package.json'), 'utf8'));
  delete pkg.scripts.e2e;
  delete pkg.devDependencies['@playwright/test'];
  writeFileSync(join(s.R, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
  const kept = lines.filter((l, i) => !(i >= flowsAt && i < flowsEnd)
    && !/^- \*\*(Presupuesto E2E|Retries|Timeouts|Entorno de la suite|Datos)\*\*/.test(l)
    && !/Runner E2E/.test(l));
  writeFileSync(OPS, kept.join('\n').replace(/; `e2e` · `npm run e2e` · ~6 min/, '').replace(/npm test && npm run e2e/g, 'npm test'));
}

s.initRepo('feat: base del molde hojas');
const F = '.docs/sdd/specs/20261101-090000-feature-0030-paid-filter';
s.git('checkout', '-q', '-b', 'feature/0030-paid-filter');
const e2e = s.SC !== 't3';
s.put(`${F}/spec.md`, `---\nfeature: 0030\ntitle: Filtro de cobradas\nmode: full\nprofile: delegate\nstatus: approved\n---\n\n# Spec — Filtro de cobradas\n\n## Intent\n\nAl marcar una factura como cobrada, administración la quiere ver con el filtro «cobrada» de la lista.\n\n## Dónde se prueba\n\n- ${e2e ? 'E2E: la factura marcada sale con el filtro «cobrada».' : 'Test de componente en `src/invoices/InvoiceList.test.tsx`.'}\n\n## Delta\n\n**ADDED — La factura marcada sale en el filtro**\n- GIVEN F-014 emitida\n- WHEN se marca como cobrada y se elige el estado «cobrada»\n- THEN F-014 sale en la lista\n\n## Aprobaciones\n\n| Fecha | Estado |\n| --- | --- |\n| 2026-11-01 | aprobada por delegación |\n`);
s.put(`${F}/plan.md`, `# Plan — Filtro de cobradas\n\n**Ejecución**: Native.\n\n## §3 Gate de cierre\n\n\`${e2e ? 'npm test && npm run e2e' : 'npm test'}\`\n\n## Task 1: la factura marcada sale en el filtro\n\n- **Qué**: ${e2e ? 'un E2E nuevo: marcar F-014 como cobrada y elegir el estado «cobrada»; F-014 sale en la lista.' : 'un test de componente nuevo: con F-014 cobrada y el estado «cobrada», F-014 sale en la lista.'}\n`);
s.commit('docs(sdd): abrir la 0030');
const ASK = e2e
  ? `Invoca la skill sdd-kit:sdd-tdd y haz la Task 1 del plan de la 0030 (${F}/plan.md), también lo que la guía del kit pida al proyecto para esa task. Puedes usar npm install y npm test. En esta máquina no hay navegadores de Playwright: el E2E escríbelo sin ejecutarlo. Haz commit de lo que deba quedar y para; acaba diciendo en dos líneas qué has dejado y qué pides al dev-lead.`
  : `Invoca la skill sdd-kit:sdd-tdd y haz la Task 1 del plan de la 0030 (${F}/plan.md), también lo que la guía del kit pida al proyecto para esa task. Puedes usar npm install y npm test. Haz commit de lo que deba quedar y para; acaba diciendo en dos líneas qué has dejado y qué pides al dev-lead.`;
await s.launch(ASK);
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}\n## git log\n${s.git('log', '--oneline', '--all')}\n## ficheros frente a develop\n${s.git('diff', '--name-status', 'develop..HEAD')}\n## fuera de git\n${s.git('ls-files', '--others', '--exclude-standard')}\n`);
for (const f of s.git('diff', '--name-only', '--diff-filter=AM', 'develop..HEAD').split('\n').filter((n) => n && !n.startsWith('.docs/sdd/specs'))) {
  if (existsSync(join(s.R, f))) s.keep(join(s.R, f), f.replaceAll('/', '__'));
}
// Lo que deja la task, en verde o en rojo: el criterio de hecho de la 0278.
