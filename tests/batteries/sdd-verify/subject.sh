#!/usr/bin/env bash
# Sujeto de la batería de sdd-verify: un punto de la implementación o del cierre de la 0010, con sus artefactos ya escritos.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
FIX="$HERE/fixtures"
IMPL="$HERE/../sdd-implement"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
GUARD="$(cell Esperado | sed 's/^sdd-kit://')"
subject_init "$1" "$2" "$4" "$([ -d "$1/skills/$GUARD" ] && echo "$GUARD" || echo using-sdd)"
ASK="$(cell Petición)"
SDD_CLI="$KIT/cli/bin/sdd.js"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"'
F10=".docs/sdd/specs/20261008-100000-feature-0010-cancel-reason"

cp -r "$IMPL/mold-reservas/." "$R/"
put_kit_marker "$MARKER"
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

# Sin «quién canceló»: el molde no tiene usuarios.
approved_0010() { sed -e 's/ y quién canceló//' -e 's/ cancelada por Ana con/ cancelada con/' -e 's/ — sala ocupada — Ana»/ — sala ocupada»/' -e '/^2\. El listado de canceladas enseña sala/d' -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$IMPL/fixtures/spec-0010.md"; }
open_0010() {
  g checkout -q -b feature/0010-cancel-reason
  approved_0010 | put "$F10/spec.md"; put "$F10/plan.md" < "$IMPL/fixtures/plan-0010.md"
  commit "docs(sdd): abrir la feature 0010 con su spec y su plan"
}
short() { g rev-parse --short=7 "$1"; }
ledger() {
  local ws
  ws=$(cd "$R" && "$NODE" "$SDD_CLI" workspace "$F10/plan.md" | tail -n 1)
  printf '# SDD ledger — plan: %s\n%s\n' "$F10/plan.md" "$1" > "$ws/progress.md"
}

case "$SC" in
  v1)
    open_0010
    BASE1=$(short HEAD)
    cp "$IMPL/fixtures/app-task1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-task1.test.js" "$R/test/cancel.test.js"
    commit "feat(bookings): cancelar con un motivo de la lista"
    ledger "Task 1: complete (commits $BASE1..$(short HEAD), tests: node --test test/cancel.test.js → 2/2 pass)"
    cp "$FIX/app-v1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-done.test.js" "$R/test/cancel.test.js" ;;
esac

case "$SC" in
  v1) export EXTRA_DISALLOWED="Agent" ;;
esac
MAX_TURNS="${MAX_TURNS:-40}"

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
for kept in spec plan tasks; do [ -f "$R/$F10/$kept.md" ] && subject_keep "$R/$F10/$kept.md" "$kept.md"; done
[ -f "$R/test/cancel.test.js" ] && subject_keep "$R/test/cancel.test.js" cancel.test.js
[ -f "$R/src/app.js" ] && subject_keep "$R/src/app.js" app.js
for ledger in "$R"/.superpowers/sdd/*/progress.md; do [ -f "$ledger" ] && subject_keep "$ledger" progress.md; done
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## commits con sus ficheros"; g log --stat --format='--- %h %s' develop..HEAD; } | subject_save
