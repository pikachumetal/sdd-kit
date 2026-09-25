#!/usr/bin/env bash
# Sujeto headless de la 0064 (renombrado task → feature), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   h1 h4 p1 p2 p3 p6  petición de trabajo: la primera skill debe ser sdd-start-feature (moldes de la 0014)
#   p4 p5              controles: pregunta → sdd-consult; bug → sdd-start-patch
#   e1                 «hemos acabado, cierra la tarea» con el plan hecho: la primera skill debe ser sdd-end-feature
#   m1                 «actualízame al kit» en un proyecto en v1.2.0 que nombra sdd-start-task y sdd-end-task
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
MOLDS="$REPO/.docs/sdd/specs/20260921-162213-task-0014-auto-routing/red"
. "$REPO/tests/headless/lib.sh"
SC="$3"
case $SC in m1) subject_init "$1" "$2" "$4" sdd-init-brownfield ;; *) subject_init "$1" "$2" "$4" sdd-start-feature ;; esac

routing_mold() {
  cp -r "$MOLDS/$1/." "$R/"
  g init -q -b main
  commit "feat: base con cancelación de reservas"
  g checkout -q -b develop
}

closing_mold() {
  local spec=.docs/sdd/specs/20260924-090000-feature-0081-booking-reminders
  routing_mold molde
  g checkout -q -b feature/0081-booking-reminders
  put $spec/spec.md <<'EOF'
---
id: 20260924-090000-feature-0081-booking-reminders
feature: 0081
title: Avisos por correo antes de la reserva
mode: full
status: approved
created: 2026-09-24
---

# Spec — Avisos por correo antes de la reserva

## Intent

Mandar un correo al dueño de la reserva 30 minutos antes de la franja.
EOF
  put $spec/plan.md <<'EOF'
---
id: 20260924-090000-feature-0081-booking-reminders
feature: 0081
title: Plan de implementación — Avisos por correo antes de la reserva
spec: ./spec.md
status: approved
created: 2026-09-24
---

# Plan de implementación — Avisos por correo

### Task 1 — Programar el aviso
### Task 2 — Enviar el correo
EOF
  put $spec/tasks.md <<'EOF'
# Tasks — Avisos por correo (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Programar el aviso | done | a1b2c3d | |
| 2 | Enviar el correo | done | d4e5f6a | |

Revisión final: sdd-kit:effort-high + opus, limpia
EOF
  commit "docs(0081): apertura de la feature 0081"
  put src/reminders.js <<'EOF'
export function reminderAt(slotStart) {
  return new Date(slotStart.getTime() - 30 * 60 * 1000);
}
EOF
  commit "feat(0081): avisos por correo antes de la reserva"
}

migration_mold() {
  put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "1.2.0", "channel": "plugin", "updated": "2026-09-20", "ids": {"mode": "sequence"}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}}
EOF
  put CLAUDE.md <<'EOF'
# Salas — guía para Claude

Proyecto con el kit SDD: arranca el trabajo con `sdd-start-task` y ciérralo con `sdd-end-task`. Los bugs pequeños van por `sdd-start-patch`.
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas

## Art. I — Trazabilidad

Toda task se cierra con `sdd-end-task`, que escribe el walkthrough y el changelog.
EOF
  put .docs/sdd/mission.md <<'EOF'
# Misión — salas

Reserva de salas de reuniones por franja para una oficina.
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0012 | Login con correo — cerrado con `sdd-end-task` | ✅ |
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]

- Login con correo (cerrado con `sdd-end-task`).
EOF
  put .docs/sdd/capabilities/bookings.md <<'EOF'
# Capacidad — bookings

## Propósito

Reservas de salas por franja.

## Requisitos

### Una sala no se reserva dos veces en la misma franja
- GIVEN la sala Norte reservada de 10 a 12
- WHEN otro usuario pide la sala Norte de 10 a 12
- THEN la reserva se rechaza
EOF
  put .docs/sdd/specs/20260910-080000-task-0012-login/spec.md <<'EOF'
---
task: 0012
title: Login con correo
---

# Spec — Login con correo

Se cierra con `sdd-end-task`.
EOF
  put src/app.js <<'EOF'
export const rooms = ['Norte', 'Sur'];
EOF
  g init -q -b main
  commit "feat: salas con el kit 1.2.0"
  g checkout -q -b develop
}

closing_row_mold() {
  local mold="$REPO/.docs/sdd/specs/20260922-153902-task-0018-roadmap-closing/red/mt"
  local legacy=.docs/sdd/specs/20260919-090000-task-SALAS-142-slot-format
  local spec=.docs/sdd/specs/20260919-090000-feature-SALAS-142-slot-format
  cp -r "$mold/." "$R/"
  mv "$R/.f" "$RUN/feature-files"
  g init -q -b main
  commit "feat: base con cancelación de reservas"
  g tag -a v0.3.0 -m "v0.3.0"
  g checkout -q -b develop
  g checkout -q -b feature/SALAS-142
  cp -r "$RUN/feature-files/." "$R/"
  mv "$R/$legacy" "$R/$spec"
  sed -i 's/^ticket: SALAS-142$/feature: SALAS-142/' "$R/$spec/spec.md"
  commit "fix: libres valida la franja HH:MM-HH:MM"
}

case $SC in
  r1) subject_init "$1" "$2" "$4" sdd-end-feature ;;
esac

case $SC in
  r1) closing_row_mold ;;
  h1|p1|p2|p3|p4|p5|p6) routing_mold molde ;;
  h4) routing_mold molde-code ;;
  e1) closing_mold ;;
  m1) migration_mold ;;
  *) die "escenario desconocido: $SC" ;;
esac

case $SC in
  h1) ASK="Let's build an email reminder that fires before each booking." ;;
  h4) ASK="Es un cambio pequeño: añade un campo 'notas' a cada reserva. Hazlo rápido." ;;
  p1) ASK="Añade a la app de salas la reserva recurrente mensual." ;;
  p2) ASK="Hazme que las reservas se puedan exportar a un fichero .ics." ;;
  p3) ASK="Quiero que las salas muestren estadísticas de uso. Empieza a montarlo." ;;
  p4) ASK="¿Cómo funciona ahora mismo la cancelación de reservas?" ;;
  p5) ASK="Hay un bug: al cancelar una reserva del lunes se cancela también la del martes. Arréglalo." ;;
  p6) ASK="Vamos a construir los avisos por correo antes de cada reserva." ;;
  e1) ASK="Hemos acabado, cierra la tarea." ;;
  m1) ASK="Actualízame al kit. Haz lo que toque sin preguntarme: el dev-lead leerá el informe al final." ;;
  r1) ASK="Invoca la skill sdd-kit:sdd-end-feature y cierra la feature SALAS-142. La he probado yo: \`node src/app.js libres 25:00-99\` da el error de formato y \`libres 10:00-12:00\` sigue dando Sur. Funciona." ;;
esac
case $SC in m1) MAX_TURNS=40 ;; r1) MAX_TURNS=60 ;; *) MAX_TURNS=6 ;; esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## primeras skills"; python "$MOLDS/first-skills.py" "$JSONL"
  echo "## status"; g status --short --untracked-files=all
  if [ "$SC" = r1 ]; then
    echo "## filas de Deuda técnica y Backlog del roadmap"; g show HEAD:.docs/sdd/roadmap.md 2>/dev/null | grep -nE '\*\*\[' ; grep -nE '\*\*\[' "$R/.docs/sdd/roadmap.md"
    echo "## diff del roadmap desde v0.3.0"; g diff v0.3.0 -- .docs/sdd/roadmap.md
  fi
  if [ "$SC" = m1 ]; then
    echo "## menciones vivas (CLAUDE.md, .docs/sdd/*.md salvo changelog y roadmap, capabilities/)"
    grep -nE 'sdd-(start|end)-task' "$R/CLAUDE.md" "$R"/.docs/sdd/*.md "$R"/.docs/sdd/capabilities/*.md 2>/dev/null | grep -vE '/(changelog|client-changelog|roadmap)\.md:' | sed "s#$R/##"
    echo "## histórico (debe seguir con los nombres viejos)"
    grep -rnE 'sdd-(start|end)-task' "$R/.docs/sdd/specs" "$R/.docs/sdd/changelog.md" "$R/.docs/sdd/roadmap.md" | sed "s#$R/##"
    echo "## carpetas de specs/"; ls "$R/.docs/sdd/specs"
    echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json"
  fi
} | subject_save
