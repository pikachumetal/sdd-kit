# Molde del GREEN de la 0044: funciones que escriben el repo de juguete; subject.sh las carga con «.».
# Usa g, put, commit, R, SPEC y PATCHDIR de subject.sh.

base_files() {
  put README.md <<'EOF'
# salas

CLI de reservas de salas: `salas libres <franja>`, `salas reservar <sala> <franja>`, `salas cancelar <sala> <franja>`.
EOF
  put .gitignore <<'EOF'
.superpowers/
EOF
  put src/slots.js <<'EOF'
export function reserve(room, slot) {
  return { room, slot };
}
EOF
  put tests/slots.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve } from '../src/slots.js';

test('reserva una sala en una franja', () => {
  assert.deepStrictEqual(reserve('Norte', '10-12'), { room: 'Norte', slot: '10-12' });
});
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas

## Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. II — Tests

Suite: `node --test`. Todo verde antes de fusionar.
EOF
  put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false}}
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | dev-lead | `src/slots.js` | S |
| 0013 | `cancelar` sin hora debe pedir el uso en vez de fallar | dev-lead | `src/slots.js` | patch |
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]
EOF
}

spec_files() {
  put $SPEC/spec.md <<'EOF'
---
id: 20260923-100000-task-0012-franja
task: 0012
title: Validar el formato de la franja
mode: full
status: approved
created: 2026-09-23
approvers:
  - role: dev-lead
    name: Dev Lead
    approved_at: 2026-09-23
---

# Spec — Validar el formato de la franja

## Intent

`salas reservar Norte 1012` reserva una franja sin sentido. Se quiere un error claro.

## Delta de comportamiento

### Capacidad: `booking`

**ADDED — La franja se valida al reservar**
- GIVEN una franja que no casa con `HH-HH`
- WHEN se reserva
- THEN falla con «Franja no válida: usa HH-HH, p. ej. 10-12»

**ADDED — La franja se valida al consultar libres**
- GIVEN una franja que no casa con `HH-HH`
- WHEN se consultan las salas libres
- THEN falla con el mismo mensaje

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-23 | aprobada |
EOF
}

plan_files() {
  put $SPEC/plan.md <<'EOF'
---
id: 20260923-100000-task-0012-franja
task: 0012
title: Plan — Validar el formato de la franja
spec: ./spec.md
status: approved
---

# Plan — Validar el formato de la franja

## Restricciones globales

### De código

- Mensaje literal: «Franja no válida: usa HH-HH, p. ej. 10-12».

### De proceso

- Implementadores y revisores Sonnet, effort medio.

## 2. Tasks

### Task 1 — Validar al reservar

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/slot-format.test.js`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: backend
**Verificación**: `node --test tests/slot-format.test.js`

- [ ] **Step 1: Implementación** — `reserve` lanza el error si la franja no casa con `/^\d{2}-\d{2}$/`.
- [ ] **Step 2: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 2 — Validar al consultar libres

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/free-format.test.js`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: backend
**Verificación**: `node --test tests/free-format.test.js`

- [ ] **Step 1: Implementación** — `free(slot)` en `src/slots.js` con la misma validación.
- [ ] **Step 2: Commit de la task** — uno solo, al quedar limpia su revisión.
EOF
  put $SPEC/tasks.md <<'EOF'
# Tasks — Validar el formato de la franja (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Validar al reservar | pending | — | |
| 2 | Validar al consultar libres | pending | — | |
EOF
}

opening_in_three() {
  g checkout -q -b feature/0012
  spec_files; commit "docs(0012): spec de la task 0012"
  printf '\n## Hallazgos de la review\n\n- El mensaje de error va literal en la spec.\n' >> "$R/$SPEC/spec.md"; commit "docs(0012): hallazgos de la review de spec"
  plan_files; commit "docs(0012): plan y registro de tasks"
}

opening_in_one() {
  g checkout -q -b feature/0012
  spec_files; plan_files; commit "docs(0012): abrir la task 0012"
}

ledger() {
  put .superpowers/sdd/plan/progress.md <<EOF
# SDD ledger — plan: $SPEC/plan.md

Task 1: BASE $1
$2
EOF
  put .superpowers/sdd/plan/task-1-rereview.md <<'EOF'
# Re-revisión de la Task 1

- Hallazgo Important «falta el mensaje literal»: ADDRESSED (src/slots.js:3).
- New breakage: none.

Verdict: all findings addressed.
EOF
}

task1_red() {
  put tests/slot-format.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve } from '../src/slots.js';

test('rechaza una franja sin guion', () => {
  assert.throws(() => reserve('Norte', '1012'), /Franja no válida: usa HH-HH, p\. ej\. 10-12/);
});
EOF
}

task1_code() {
  put src/slots.js <<'EOF'
const SLOT = /^\d{2}-\d{2}$/;

export function reserve(room, slot) {
  if (!SLOT.test(slot)) throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12');
  return { room, slot };
}
EOF
}

task1_in_three() {
  local base; base=$(g rev-parse --short HEAD)
  task1_red; commit "test(0012): RED de la task 1"
  put src/slots.js <<'EOF'
export function reserve(room, slot) {
  if (!/^\d{2}-\d{2}$/.test(slot)) throw new Error('Franja no válida');
  return { room, slot };
}
EOF
  commit "feat(0012): validar el formato de la franja al reservar"
  task1_code; commit "fix(0012): mensaje literal de la revisión de la task 1"
  ledger "$base" "Task 1: fix round 1/5 (1 addressed, 0 open; commits $(g rev-parse --short HEAD~1)..$(g rev-parse --short HEAD))"
}

task1_with_merge() {
  local base; base=$(g rev-parse --short HEAD)
  task1_red; commit "test(0012): RED de la task 1"
  g checkout -q develop
  printf '\nLicencia: MIT.\n' >> "$R/README.md"; commit "docs: licencia en el README"
  g checkout -q feature/0012
  g -c core.editor=true merge -q --no-ff develop -m "merge: integrar develop en la task 0012"
  task1_code; commit "feat(0012): validar el formato de la franja al reservar"
  ledger "$base" "Task 1: review clean"
}

task2_code() {
  cat >> "$R/src/slots.js" <<'EOF'

export function free(slot) {
  if (!SLOT.test(slot)) throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12');
  return [];
}
EOF
  put tests/free-format.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { free } from '../src/slots.js';

test('libres rechaza una franja sin guion', () => {
  assert.throws(() => free('1012'), /Franja no válida/);
});
EOF
}

closing_state() {
  task1_red; task1_code; commit "feat(0012): validar el formato de la franja al reservar"
  local t1; t1=$(g rev-parse --short HEAD)
  task2_code
  sed -i "s/| 1 | Validar al reservar | pending | — |/| 1 | Validar al reservar | done | $t1 |/; s/| 2 | Validar al consultar libres | pending |/| 2 | Validar al consultar libres | done |/" "$R/$SPEC/tasks.md"
  commit "feat(0012): validar el formato de la franja al consultar libres"
  printf '\nexport const SLOT_FORMAT = SLOT;\n' >> "$R/src/slots.js"; commit "fix(0012): hallazgos de la revisión final de rama"
}

patch_in_two() {
  g checkout -q -b feature/0013
  cat >> "$R/src/slots.js" <<'EOF'

export function cancel(room, slot) {
  if (!slot) throw new Error('Uso: salas cancelar <sala> <franja>');
  return { room, slot, cancelled: true };
}
EOF
  commit "fix(0013): cancelar sin hora pide el uso"
  put tests/cancel.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { cancel } from '../src/slots.js';

test('cancelar sin franja pide el uso', () => {
  assert.throws(() => cancel('Norte'), /Uso: salas cancelar/);
});
EOF
  put $PATCHDIR/patch.md <<'EOF'
---
id: 20260923-110000-patch-0013-cancelar-sin-hora
patch: 0013
commit: <hash>        # se rellena al commitear
---

# Patch 0013 — `cancelar` sin hora

## 1. Síntoma

`salas cancelar Norte` falla con `TypeError: Cannot read properties of undefined`.

## 2. Causa raíz

`cancel` no comprobaba la franja antes de usarla.

## 3. Fix

`cancel` pide el uso si falta la franja.

## 4. Verificación

| Comprobación | Resultado |
| --- | --- |
| `node --test tests/cancel.test.js` | 1/1 verde |

## 5. Tiempo

- Real: 0,3h
EOF
  commit "test(0013): test y patch.md del cancelar sin hora"
}
