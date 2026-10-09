#!/usr/bin/env bash
# Sujeto de la batería de sdd-start-feature: un paso del flujo, con los artefactos de ese punto ya escritos.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
FIX="$HERE/fixtures"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
subject_init "$1" "$2" "$4" "$(cell Esperado | sed 's/^sdd-kit://')"
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"'
F10=".docs/sdd/specs/20261008-100000-feature-0010-cancel-reason"
F11=".docs/sdd/specs/20261008-110000-feature-0011-void-others"

cp -r "$HERE/mold-reservas/." "$R/"
case "$(cell Molde)" in
  reservas) put_kit_marker "$MARKER" ;;
  reservas-campo) put_kit_marker "$MARKER, \"validation\": {\"mode\": \"field\"}" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

approved_spec() { sed -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$FIX/spec-0010.md"; }
without_who() { sed -e 's/ y quién canceló//' -e 's/ cancelada por Ana con/ cancelada con/' -e 's/ — sala ocupada — Ana»/ — sala ocupada»/' -e '/^2\. El listado de canceladas enseña sala/d'; }
open_0010() {
  approved_spec | ${1:-cat} | put "$F10/spec.md"
  cp "$FIX/plan-0010.md" "$R/$F10/plan.md"
  commit "docs(sdd): abrir la feature 0010 con su spec y su plan"
}
task_commit() {
  cp "$FIX/app-$1.js" "$R/src/app.js"
  cp "$FIX/cancel-$1.test.js" "$R/test/cancel.test.js"
  commit "$2"
}

case "$SC" in
  s1) g checkout -q -b feature/0010-cancel-reason ;;
  g1) g checkout -q -b feature/0010-cancel-reason; put "$F10/spec.md" < "$FIX/spec-0010.md" ;;
  r1) g checkout -q -b feature/0011-void-others; put "$F11/spec.md" < "$FIX/spec-0011.md" ;;
  p1) g checkout -q -b feature/0010-cancel-reason; approved_spec | without_who | put "$F10/spec.md" ;;
  u1|u2)
    g checkout -q -b feature/0010-cancel-reason; open_0010
    task_commit task1 "feat(bookings): cancelar con un motivo de la lista"
    put "$F10/tasks.md" < "$FIX/tasks-0010-u1.md"
    TURN2='Apruebo la enmienda.'
    [ "$SC" = u2 ] && TURN2='Apruebo guardar quién cancela con --por <nombre> en cancelar.'
    export TURN2 ;;
  v1a|v1b)
    g checkout -q -b feature/0010-cancel-reason; open_0010 without_who
    task_commit task1 "feat(bookings): cancelar con un motivo de la lista"
    task_commit done "feat(bookings): listado de canceladas con su motivo"
    put "$F10/tasks.md" < "$FIX/tasks-0010-v1.md"
    commit "docs(sdd): registro de tasks de la 0010" ;;
esac

case "$SC" in
  g1|r1) MAX_TURNS="${MAX_TURNS:-15}" ;;
  v1b) MAX_TURNS="${MAX_TURNS:-20}" ;;
  *) MAX_TURNS="${MAX_TURNS:-40}" ;;
esac

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
for kept in spec plan tasks; do
  for folder in "$F10" "$F11"; do
    [ -f "$R/$folder/$kept.md" ] && subject_keep "$R/$folder/$kept.md" "$kept.md"
  done
done
newspec=$(find "$R/.docs/sdd/specs" -name spec.md -newer "$R/README.md" 2>/dev/null | grep -v -e "$F10" -e "$F11" | head -n 1)
[ -n "$newspec" ] && subject_keep "$newspec" spec-new.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros"; g ls-files --others --exclude-standard; } | subject_save
