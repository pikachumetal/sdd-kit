#!/usr/bin/env bash
# Sujeto headless del patch 0167 (el kit con brainstorming de superpowers 7.0.0).
# Uso (desde tests/headless/run.sh, con SUPERPOWERS_DIR en la caché 7.0.0): subject.sh <kit> <etiqueta> <escenario> <salida>
#   n  feature normal (0011, avisos por correo); segundo turno con la descripción que pide brainstorming.
#      Se mide si sale spec.md con su gate, a qué repaso llama, si despacha el builder check y cómo pregunta.
#   s  feature pequeña (0013, cuántas reservas hay); un turno.
#      Se mide si el tamaño de brainstorming («quick task», «small change») deja la feature sin spec.md ni gate.
#   y  la 0011 con «sí, empieza ya» a la oferta de saltarse las preguntas en el segundo turno.
#      Se mide si saltarse las preguntas se lleva la spec y su gate.
# La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
MOLD="$REPO/.docs/sdd/specs/20260923-102746-task-0006-task-verification/red"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature

cp -r "$MOLD/m/." "$R/"
put_kit_marker '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}'
sed -i 's/^| 0012 .*$/| 0012 | Filtrar la lista de reservas por estado | ✅ |\n| 0013 | Que la lista de reservas diga cuántas reservas hay | ⏳ |/' "$R/.docs/sdd/roadmap.md"
g init -q -b main
commit "feat: lista de reservas con paginación"
g checkout -q -b develop

FIRST="Te confirmo ya la primera pregunta: carril feature, perfil delegate, entera, sin partir."
case "$3" in
  n|y) g checkout -q -b feature/0011
       ASK="Invoca la skill sdd-kit:sdd-start-feature y arranca la feature 0011 del roadmap. $FIRST Modo full." ;;
  s)   g checkout -q -b feature/0013
       ASK="Invoca la skill sdd-kit:sdd-start-feature y arranca la feature 0013 del roadmap. $FIRST Modo lite." ;;
  *)   die "escenario desconocido: $3" ;;
esac
case "$3" in
  n) TURN2="Se nos quedan salas vacías porque la gente olvida que reservó. Quiero que al cliente le llegue un correo 24 horas antes de una reserva confirmada, con la fecha, la hora y la sala; si la cancela antes, que no le llegue. Hoy no mandamos ningún correo; lo de cómo enviarlo me da igual, elige tú." ;;
  y) TURN2="Sí, sáltate las preguntas y empieza ya." ;;
esac
export TURN2="${TURN2:-}"
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; cat "$R/.docs/sdd/roadmap.md"; exit 0; }

subject_launch "$ASK"
{ echo "## git log"; g log --oneline --all --decorate; echo "## git status"; g status --short --untracked-files=all; } | subject_save
SPEC=$(find "$R/.docs/sdd/specs" -name spec.md 2>/dev/null | head -n 1)
[ -n "$SPEC" ] && subject_keep "$SPEC" spec.md
DESIGN=$(find "$R/docs" -name '*-design.md' 2>/dev/null | head -n 1)
[ -n "$DESIGN" ] && subject_keep "$DESIGN" design.md
exit 0
