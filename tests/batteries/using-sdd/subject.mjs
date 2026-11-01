// Sujeto de la batería de using-sdd: una frase de battery.md sobre su molde (salas o ventas).
// Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
import { appendFileSync, cpSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { subjectCell } from '../../headless/battery.mjs';
import { initSubject } from '../../headless/lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const s = initSubject(process.argv.slice(2), 'using-sdd');
const cell = subjectCell(HERE, s);
const ASK = cell('Petición');
const SALAS_MARKER = '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}';
const VENTAS_MARKER = `${SALAS_MARKER}, "control": {"profile": "delegate", "maxParallelAgents": 3}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"`;

// i1 mide la init: el proyecto llega sin .docs/; i2, una init en curso, con sdd-kit.json con la clave init. t1 necesita la errata en el README.
// u1 lleva el marcador en 2.3.3, por debajo de la v2.3.4.md del kit: el hook avisa de migraciones pendientes.
function moldBase(mold, marker) {
  cpSync(join(HERE, `mold-${mold}`), s.R, { recursive: true });
  if (s.SC === 'i1') {
    rmSync(join(s.R, '.docs'), { recursive: true });
  } else if (s.SC === 'i2') {
    rmSync(join(s.R, '.docs'), { recursive: true });
    s.put('PRODUCT.md', '# Salas\n\n## Users\n\n- **Oficina**: reserva salas.\n');
    s.put('.docs/sdd/sdd-kit.json', '{"init": {"approved": ["PRODUCT.md"]}}\n');
  } else if (s.SC === 'u1') {
    s.put('.docs/sdd/sdd-kit.json', `{"version": "2.3.3", ${marker}}\n`);
  } else {
    s.putKitMarker(marker);
  }
  if (s.SC === 't1') appendFileSync(join(s.R, 'README.md'), 'Consulta las recervas libres con `libres <franja>`.\n');
  s.git('init', '-q', '-b', 'main');
  s.commit(`feat: base del molde ${mold}`);
  s.git('checkout', '-q', '-b', 'develop');
}

const FEATURE_DIR = '.docs/sdd/specs/20260920-090000-feature-0020-room-filter';
const SPEC = `---\nmode: full\nprofile: delegate\n---\n\n# Spec — filtro por sala en libres\n\n## Intent\n\n\`libres\` da las salas libres de una franja; hay que poder preguntar por una sala y exigir la franja.\n\n## Requisitos\n\n- GIVEN Norte reservada en 10:00-12:00 WHEN \`libres 10:00-12:00 --sala Norte\` THEN responde \`ocupada\`\n- GIVEN cualquier estado WHEN \`libres\` sin franja THEN responde \`indica una franja\`\n- GIVEN el README WHEN se lee THEN explica \`--sala\`\n\n## Aprobaciones\n\n- Spec aprobada por el dev-lead, 2026-09-20.\n`;
const PLAN = `# Plan — filtro por sala\n\n**Spec**: spec.md\n**Ejecución**: native, fijado en sdd-kit.json.\n\n## Task 1: --sala en libres\n\nModificar: src/app.js, test/app.test.js. Verificación: node --test.\n\n## Task 2: libres sin franja\n\nModificar: src/app.js, test/app.test.js. Test: \`libres\` sin franja responde \`indica una franja\`. Verificación: node --test.\n\n## Task 3: README\n\nModificar: README.md. Una línea que explique \`--sala\`. Verificación: node --test.\n`;
const PATCH = `---\nsolution: causa raíz\n---\n\n# Patch 0021 — cancelar una reserva que no existe\n\n## 1. Síntoma\n\n«Si cancelo una reserva que no existe me dice cancelada igual.»\n\n## 2. Causa raíz\n\n\`run\` en src/app.js:12 devuelve \`cancelada\` sin mirar \`bookings\`.\n\n## 3. Fix\n\nSi no hay reserva de esa sala y día, responde \`no existe\`. Decisiones: texto, dev-lead.\n\n## 4. Verificación\n\nPendiente.\n\n## 5. Tiempo\n\n- Inicio: 2026-09-21T09:00:00Z\n`;
const TASK1_CODE = "if (cmd === 'libres' && params[1] === '--sala') return freeRooms(params[0]).includes(params[2]) ? 'libre' : 'ocupada';\n  if (cmd === 'libres')";

// Una feature en pausa: spec y plan aprobados, la Task 1 commiteada y en tasks.md, la 2 y la 3 sin empezar.
function pausedFeature() {
  s.git('checkout', '-q', '-b', 'feature/0020-room-filter');
  s.put(`${FEATURE_DIR}/spec.md`, SPEC);
  s.put(`${FEATURE_DIR}/plan.md`, PLAN);
  s.commit('docs(sdd): abrir la feature 0020');
  const app = readFileSync(join(s.R, 'src/app.js'), 'utf8');
  s.put('src/app.js', app.replace("if (cmd === 'libres')", TASK1_CODE));
  appendFileSync(join(s.R, 'test/app.test.js'), "\ntest('libres --sala dice si está ocupada', () => {\n  assert.equal(run('libres', ['10:00-12:00', '--sala', 'Norte']), 'ocupada');\n});\n");
  s.commit('feat(libres): filtro por sala');
  const sha = s.git('rev-parse', '--short', 'HEAD').trim();
  s.put(`${FEATURE_DIR}/tasks.md`, `# Tasks\n\n| Task | Estado | Commit |\n| --- | --- | --- |\n| 1 | ✅ | ${sha} |\n| 2 | ⏳ | |\n| 3 | ⏳ | |\n`);
  s.commit('docs(sdd): tasks de la 0020');
}

// Un patch en pausa tras el paso 3: patch.md sin commitear, porque va en el commit del fix.
function pausedPatch() {
  s.git('checkout', '-q', '-b', 'patch/0021-cancel-missing');
  s.put('.docs/sdd/specs/20260921-090000-patch-0021-cancel-missing/patch.md', PATCH);
}

const markers = { salas: SALAS_MARKER, ventas: VENTAS_MARKER };
const mold = cell('Molde');
if (!markers[mold]) s.die(`molde desconocido en battery.md: ${s.SC}`);
moldBase(mold, markers[mold]);
if (s.SC === 'rf1' || s.SC === 'rf2') pausedFeature();
if (s.SC === 'rp1') pausedPatch();

s.env.MAX_TURNS ||= cell('Paso') === 'retomar' ? '14' : '8';
await s.launch(ASK);
s.save(`## petición\n${ASK}\n## git status\n${s.git('status', '--short')}## git log\n${s.git('log', '--oneline', '--all')}`);
