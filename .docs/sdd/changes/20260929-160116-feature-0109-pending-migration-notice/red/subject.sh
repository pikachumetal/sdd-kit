#!/usr/bin/env bash
# Sujeto de la migración sin cambios, con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   m1  «ponme el proyecto al día» en un proyecto en 2.0.0 con el kit 2.1.0 (RED: copia sin v2.1.0.md; GREEN: con ella)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-init-brownfield
[ "$3" = m1 ] || die "escenario desconocido: $3"

put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "2.0.0", "channel": "plugin", "updated": "2026-09-27", "ids": {"mode": "sequence"}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"}
JSON
put .claude/settings.json <<'JSON'
{"autoMemoryEnabled": false, "extraKnownMarketplaces": {"superpowers-marketplace": {"source": {"source": "github", "repo": "obra/superpowers-marketplace"}}}}
JSON
printf '.playwright-mcp/\n.superpowers/\n.docs/sdd/sdd-kit.local.json\n' | put .gitignore
put CLAUDE.md <<'MD'
# Salas — guía para Claude

Proyecto con el kit SDD: arranca el trabajo con `sdd-start-feature` y ciérralo con `sdd-end-feature`.
MD
put .docs/sdd/mission.md <<'MD'
# Misión — salas

Reserva de salas de reuniones por franja para una oficina.
MD
put .docs/sdd/constitution.md <<'MD'
# Constitution — salas

## Art. I — Trazabilidad

Toda feature se cierra con `sdd-end-feature`, que escribe el walkthrough y el changelog.
MD
put .docs/sdd/roadmap.md <<'MD'
# Roadmap — salas

## Próximo

| id | Feature | Estado |
| --- | --- | --- |
| 0013 | Reserva recurrente mensual | pendiente |
MD
put .docs/sdd/capabilities/bookings.md <<'MD'
# Capacidad — bookings

## Propósito

Reservas de salas por franja.

## Requisitos

### Una sala no se reserva dos veces en la misma franja
- GIVEN la sala Norte reservada de 10 a 12
- WHEN otro usuario pide la sala Norte de 10 a 12
- THEN la reserva se rechaza
MD
put src/app.js <<'JS'
export const rooms = ['Norte', 'Sur'];
JS
g init -q -b main
commit "feat: salas con el kit 2.0.0"
g checkout -q -b develop

ASK="Ponme el proyecto al día con sdd-init-brownfield. Haz lo que toque sin preguntarme: el dev-lead leerá el informe al final."
MAX_TURNS=40
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## git log"; g log --oneline --all
  echo "## ficheros cambiados desde el molde"; g diff --stat "$BEFORE" HEAD
  echo "## status"; g status --short --untracked-files=all
  echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json"
} | subject_save
