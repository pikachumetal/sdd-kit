# Molde del GREEN (frente A) de la 0039: repo salas con la task 0012 cerrada en su worktree y develop
# avanzado con la 0014, que también cerró. subject.sh lo carga con «.»; usa g, gw, put, putw, commit, commitw,
# R, W y LOGBUILDER.

base_files() {
  put README.md <<'EOF'
# salas

CLI de reservas de salas: `salas libres <franja>`, `salas reservar <sala> <franja>`.
EOF
  put src/slots.js <<'EOF'
export function reserve(room, slot) {
  return { room, slot };
}
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
  put .docs/sdd/estimation.md <<'EOF'
# Método de estimación — salas

El plan estima horas y el walkthrough registra el tiempo real. El log lo genera `Build-EstimationLog.ps1`.
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | dev-lead | `src/slots.js` | S |
| 0014 | Listar las salas con `salas lista` | dev-lead | `src/rooms.js` | S |
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]

### Añadido

EOF
  walkthrough 20260901-000000-task-0001-base 0001 "Base de reservas" | put .docs/sdd/specs/20260901-000000-task-0001-base/walkthrough.md
  pwsh -NoProfile -File "$LOGBUILDER" -Root "$R" > /dev/null
}

walkthrough() {
  local dir="$1" id="$2" title="$3"
  cat <<EOF
---
id: $dir
task: $id
---

# Walkthrough — $title

## 1. Qué se hizo

$title.

## 2. Tiempo: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 1h
- Esfuerzo real: 0,8h

## 3. Validación

Validado por el dev-lead: «he probado \`salas\` y funciona».
EOF
}

close_0014() {
  local variant="$1"
  g checkout -q -b feature/0014 develop
  put src/rooms.js <<'EOF'
export function rooms() {
  return ['Norte', 'Sur'];
}
EOF
  [ "$variant" = a2 ] && sed -i 's/return { room, slot };/return { room, slot, source: "cli" };/' "$R/src/slots.js"
  local d=.docs/sdd/specs/20260923-090000-task-0014-lista
  walkthrough 20260923-090000-task-0014-lista 0014 "Listar las salas" | put $d/walkthrough.md
  sed -i 's/^| 0014 | Listar/| 0014 | ✅ Listar/' "$R/.docs/sdd/roadmap.md"
  [ "$variant" = a3 ] && sed -i 's/^| 0012 | Validar el formato de la franja al reservar/| 0012 | Validar el formato de la franja al reservar y al consultar libres/' "$R/.docs/sdd/roadmap.md"
  sed -i 's/^### Añadido$/### Añadido\n\n- `salas lista` muestra las salas (task 0014)./' "$R/.docs/sdd/changelog.md"
  pwsh -NoProfile -File "$LOGBUILDER" -Root "$R" > /dev/null
  commit "feat(0014): listar las salas" "Implementación, walkthrough y registros de la task 0014."
  g checkout -q develop
  g merge -q --no-ff feature/0014 -m "merge: feature/0014 en develop" -m "Fusión hecha con Invoke-SddMerge.ps1 (sdd-kit)."
}

open_0012() {
  g branch -q feature/0012 develop
}

close_0012() {
  local d=.docs/sdd/specs/20260923-100000-task-0012-franja
  putw $d/spec.md <<'EOF'
---
id: 20260923-100000-task-0012-franja
task: 0012
title: Validar el formato de la franja
mode: full
status: approved
created: 2026-09-23
---

# Spec — Validar el formato de la franja

## Delta de comportamiento

### Capacidad: `booking`

**ADDED — La franja se valida al reservar**
- GIVEN una franja que no casa con `HH-HH`
- WHEN se reserva
- THEN falla con «Franja no válida: usa HH-HH, p. ej. 10-12»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-23 | aprobada |
EOF
  putw $d/plan.md <<'EOF'
---
id: 20260923-100000-task-0012-franja
task: 0012
spec: ./spec.md
status: approved
---

# Plan — Validar el formato de la franja

## 2. Tasks

### Task 1 — Validar al reservar

**Modelo**: Sonnet, effort medio
**Verificación**: `node --test`

## Estimación y esfuerzo

- Tipo: backend
- Estimación de implementación: 1h
EOF
  commitw "docs(0012): abrir la task 0012" "Spec aprobada y plan de una task."
  putw src/slots.js <<'EOF'
const SLOT = /^\d{2}-\d{2}$/;

export function reserve(room, slot) {
  if (!SLOT.test(slot)) throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12');
  return { room, slot };
}
EOF
  commitw "feat(0012): validar el formato de la franja al reservar" "Implementación de la task 1 con su revisión limpia."
  walkthrough 20260923-100000-task-0012-franja 0012 "Validar el formato de la franja" | putw $d/walkthrough.md
  sed -i 's/^| 0012 | Validar/| 0012 | ✅ Validar/' "$W/.docs/sdd/roadmap.md"
  sed -i 's/^### Añadido$/### Añadido\n\n- `salas reservar` rechaza una franja mal escrita (task 0012)./' "$W/.docs/sdd/changelog.md"
  pwsh -NoProfile -File "$LOGBUILDER" -Root "$W" > /dev/null
  commitw "docs(0012): cerrar la task 0012" "Walkthrough, changelog, roadmap y estimation-log."
}
