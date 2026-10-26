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
CONTROL='"profile": "delegate"'
[ "$SC" = f2 ] && CONTROL='"profile": "delegate", "maxParallelAgents": 2'
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {'"$CONTROL"'}, "execution": "native"'
[ "$SC" = c5 ] && MARKER="$MARKER"', "validation": {"mode": "field"}'
[ "$SC" = c1f ] && MARKER="$MARKER"', "review": {"minors": "fix"}'
F10=".docs/sdd/specs/20261008-100000-feature-0010-cancel-reason"
F21=".docs/sdd/specs/20261012-100000-feature-0021-void-reason"
F22=".docs/sdd/specs/20261013-100000-feature-0022-cancel-notice"
F23=".docs/sdd/specs/20261013-110000-feature-0023-cancelled-list"

# f5 monta su propio molde, hojas.
if [ "$SC" != f5 ]; then
  cp -r "$IMPL/mold-reservas/." "$R/"
  put_kit_marker "$MARKER"
  g init -q -b main
  commit "feat: base del molde"
  g checkout -q -b develop
fi

# Sin «quién canceló»: el molde no tiene usuarios.
approved_0010() { sed -e 's/ y quién canceló//' -e 's/ cancelada por Ana con/ cancelada con/' -e 's/ — sala ocupada — Ana»/ — sala ocupada»/' -e '/^2\. El listado de canceladas enseña sala/d' -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$IMPL/fixtures/spec-0010.md"; }
with_axis() { sed 's/^\*\*Ejecución\*\*: native.*/&\n\n**Eje Arquitectura**: no — solo la app de reservas/' "$IMPL/fixtures/plan-0010.md"; }
open_0010() {
  g checkout -q -b feature/0010-cancel-reason
  approved_0010 | put "$F10/spec.md"; with_axis | put "$F10/plan.md"
  commit "docs(sdd): abrir la feature 0010 con su spec y su plan"
}
short() { g rev-parse --short=7 "$1"; }
ledger() {
  local ws
  ws=$(cd "$R" && "$NODE" "$SDD_CLI" workspace "$F10/plan.md" | tail -n 1)
  printf '# SDD ledger — plan: %s\n%s\n' "$F10/plan.md" "$1" > "$ws/progress.md"
}

task1() {
  cp "$IMPL/fixtures/app-task1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-task1.test.js" "$R/test/cancel.test.js"
  commit "feat(bookings): cancelar con un motivo de la lista"
}
task2() {
  cp "$IMPL/fixtures/app-done.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-done.test.js" "$R/test/cancel.test.js"
  [ "$SC" = f2 ] && printf '{"type": "module", "dependencies": {"zod": "^3.23.8"}}\n' > "$R/package.json"
  commit "feat(bookings): listado de canceladas con su motivo"
}
task_line() { echo "Task $1: complete (commits $2, tests: node --test test/cancel.test.js → $3 pass)"; }
# La 0010 abierta y su Task 1 commiteada; deja T0 y T1 con sus sha.
open_task1() { open_0010; T0=$(short HEAD); task1; T1=$(short HEAD); }
# La 0010 implementada en Native, con sus dos tasks en el ledger; deja A con el sha de la última task.
done_0010() {
  open_task1; task2; A=$(short HEAD)
  ledger "$(task_line 1 "$T0..$T1" 2/2)
$(task_line 2 "$T1..$A" 3/3)"
}
tasks_md() {
  printf '%s\n' '---' 'id: 20261008-100000-feature-0010-cancel-reason' 'title: Tasks — Motivo al cancelar' '---' '' '# Tasks — Motivo al cancelar (registro vivo)' '' \
    '| # | Task | Status | Commit | Notas |' '| --- | --- | --- | --- | --- |' "| 1 | Cancelar con motivo | done | $A | |" "| 2 | Listado de canceladas | done | $A | |" '' "$@" | put "$F10/tasks.md"
}
trim_test() {
  printf '\ntest("cancelar con un espacio tras el motivo", () => {\n  assert.equal(run("cancelar", ["Sur", "mar", "--motivo", "otro "]), "sin reserva Sur mar");\n});\n' >> "$R/test/cancel.test.js"
}
fix_trim() {
  sed -i 's/return index === -1 ? undefined : params\[index + 1\];/return index === -1 ? undefined : params[index + 1]?.trim();/' "$R/src/app.js"
  trim_test; commit "fix(bookings): el motivo sin espacios alrededor"
}
empty_list_text() {
  sed -i "s/\.join('\\\\n');/.join('\\\\n') || 'sin canceladas';/" "$R/src/app.js"
  commit "fix(bookings): canceladas sin canceladas dice «sin canceladas»"
}
ws_dir() { cd "$R" && "$NODE" "$SDD_CLI" workspace "$F10/plan.md" | tail -n 1; }
# El encargo del eje de f3, f3n o f4, compuesto con el texto del kit que se prueba; f3n usa los valores de f3.
axis_brief() {
  local axis=spec files
  case "$SC" in f4|f5) axis=code ;; esac
  files=$(g diff --name-only "$BASE" HEAD -- . ":(exclude,glob).docs/sdd/specs/**")
  # shellcheck disable=SC2086
  "$NODE" "$HERE/compose-axis.mjs" --kit="$KIT" --superpowers="${SUPERPOWERS_DIR:-}" --axis="$axis" --scenario="${SC%n}" \
    --package="$(cygpath -m "$PKG" 2>/dev/null || echo "$PKG")" --sha="$HEADSHA" --dir="$(cygpath -m "$R" 2>/dev/null || echo "$R")" \
    --adrs="$(cd "$R" && "$NODE" "$SDD_CLI" decision index --path .docs/sdd --files $files 2>/dev/null)" \
    --caps="$(cd "$R" && "$NODE" "$SDD_CLI" capability index --path .docs/sdd 2>/dev/null)"
}
# La 0024 de hojas: recordar el filtro de estado, con su E2E y los timeouts subidos.
hojas_0024() {
  local fix="$FIX/hojas-0024"
  cp -r "$HERE/mold-hojas/." "$R/"; put_kit_marker "$MARKER"
  g init -q -b main; commit "feat: base del molde hojas"; g checkout -q -b develop
  BASE=$(g rev-parse HEAD)
  g checkout -q -b feature/0024-remember-status-filter
  cp "$fix/InvoiceList.tsx" "$R/src/invoices/InvoiceList.tsx"; cp "$fix/api.js" "$R/server/api.js"
  commit "feat(invoices): la lista recuerda el último estado elegido"
  cp "$fix/remember-filter.spec.ts" "$R/e2e/0024-remember-filter.spec.ts"; cat "$fix/helpers-tail.ts" >> "$R/e2e/helpers.ts"
  cp "$fix/playwright.config.ts" "$R/playwright.config.ts"
  commit "test(invoices): e2e de recordar el filtro"
}
case "$SC" in
  v1)
    open_task1; ledger "$(task_line 1 "$T0..$T1" 2/2)"
    cp "$FIX/app-v1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-done.test.js" "$R/test/cancel.test.js" ;;
  s1)
    mkdir -p "$R/.docs/sdd/capabilities"; cp "$FIX/capabilities/bookings.md" "$R/.docs/sdd/capabilities/bookings.md"
    g checkout -q -b feature/0022-cancel-notice
    put "$F22/spec.md" < "$FIX/spec-s1.md"
    commit "docs(sdd): spec de la 0022"
    ASK="$("$NODE" "$HERE/compose-spec-review.mjs" "$KIT" "$F22/spec.md" .docs/sdd/capabilities/bookings.md)" ;;
  s1b)
    mkdir -p "$R/.docs/sdd/capabilities"; cp "$FIX/capabilities/reports.md" "$R/.docs/sdd/capabilities/reports.md"
    g checkout -q -b feature/0023-cancelled-list
    put "$F23/spec.md" < "$FIX/spec-s1b.md"
    commit "docs(sdd): spec de la 0023"
    ASK="$("$NODE" "$HERE/compose-spec-review.mjs" "$KIT" "$F23/spec.md" .docs/sdd/capabilities/reports.md)" ;;
  c1|c1f)
    done_0010; tasks_md
    WS=$(ws_dir); cp "$FIX/review-spec-c1.md" "$WS/review-spec.md"; cp "$FIX/review-code-c1.md" "$WS/review-code.md" ;;
  c2)
    done_0010; fix_trim; B=$(short HEAD)
    tasks_md "Revisión final: Spec opus+high, 1 Minor · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre $A" "Pasada de fix: $B, 1 hallazgo RED→GREEN" "Re-revisión: $A..$B, sdd-kit:effort-high + opus, limpia"
    commit "docs(sdd): tasks.md con la revisión final cerrada"; empty_list_text ;;
  c3)
    done_0010
    tasks_md "Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre $A"
    commit "docs(sdd): tasks.md con la revisión final"; empty_list_text ;;
  c4)
    done_0010; fix_trim; B=$(short HEAD)
    tasks_md "Revisión final: sdd-kit:effort-high + opus, 1 Important, sobre $A" "Pasada de fix: $B, 1 hallazgo RED→GREEN"
    commit "docs(sdd): tasks.md con la revisión final"; empty_list_text ;;
  c5)
    done_0010
    cp "$FIX/app-c5.js" "$R/src/app.js"; trim_test
    commit "fix(bookings): el motivo sin espacios alrededor"; B=$(short HEAD)
    tasks_md "Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre $A" "Pasada de fix: $B, 1 hallazgo RED→GREEN" "Re-revisión: $A..$B, sdd-kit:effort-high + opus, 1 Critical"
    commit "docs(sdd): tasks.md con la re-revisión"
    WS=$(ws_dir); cp "$FIX/re-review-c5.md" "$WS/re-review.md" ;;
  f3|f3n|f4)
    mkdir -p "$R/.docs/sdd/decisions" "$R/.docs/sdd/capabilities"
    cp "$HERE/../sdd-propose/fixtures/adr-0003-bookings-in-memory.md" "$R/.docs/sdd/decisions/0003-bookings-in-memory.md"
    # En f3n ninguna ADR cubre el diff.
    [ "$SC" = f3n ] && sed -i 's#^  - src/\*\*$#  - docs/**#' "$R/.docs/sdd/decisions/0003-bookings-in-memory.md"
    cp "$FIX/capabilities/"*.md "$R/.docs/sdd/capabilities/"
    if [ "$SC" = f4 ]; then cp "$IMPL/fixtures/app-done.js" "$R/src/app.js"; else cp "$FIX/app-f3-base.js" "$R/src/app.js"; fi
    commit "feat: la app antes del cambio"
    BASE=$(g rev-parse HEAD)
    g checkout -q -b feature/review
    if [ "$SC" != f4 ]; then
      put "$F21/spec.md" < "$FIX/spec-0021.md"; put "$F21/plan.md" < "$FIX/plan-0021.md"
      commit "docs(sdd): abrir la feature 0021"
      cp "$FIX/app-f3.js" "$R/src/app.js"; cp "$FIX/void-f3.test.js" "$R/test/void.test.js"
      commit "feat(bookings): anular con motivo"
    else
      cp "$FIX/app-f4.js" "$R/src/app.js"
      commit "feat(bookings): informe de ocupación"
    fi
    HEADSHA=$(g rev-parse --short HEAD)
    PKG="$RUN/review-final-$HEADSHA.diff"
    { echo "# Review package: $(g rev-parse --short "$BASE")..HEAD"; echo; echo "## Commits"; g log --oneline "$BASE..HEAD"; echo
      echo "## Files changed"; g diff --stat "$BASE" HEAD -- . ":(exclude,glob).docs/sdd/specs/**"; echo
      echo "## Diff"; g diff -U10 "$BASE" HEAD -- . ":(exclude,glob).docs/sdd/specs/**"; } > "$PKG"
    ASK="$(axis_brief)" ;;
  f5)
    hojas_0024
    HEADSHA=$(g rev-parse --short HEAD)
    PKG="$RUN/review-final-$HEADSHA.diff"
    { echo "# Review package: $(g rev-parse --short "$BASE")..HEAD"; echo; echo "## Commits"; g log --oneline "$BASE..HEAD"; echo
      echo "## Files changed"; g diff --stat "$BASE" HEAD; echo
      echo "## Diff"; g diff -U10 "$BASE" HEAD; } > "$PKG"
    ASK="$(axis_brief)" ;;
  f1|f2)
    mkdir -p "$R/.docs/sdd/decisions"; cp "$HERE/../sdd-propose/fixtures/adr-0003-bookings-in-memory.md" "$R/.docs/sdd/decisions/0003-bookings-in-memory.md"
    commit "docs(decisions): las reservas viven en memoria"
    done_0010 ;;
  # El caso de la 0187: la regla de confirmar antes de paralelizar, del usuario, y una spec aprobada con su política de modelos.
  # La línea va en la spec que se aprobó: añadida en un commit posterior, 1 de 2 sujetos no la contó como aprobada (con razón).
  mp1)
    eval "$(declare -f approved_0010 | sed '1s/approved_0010/approved_0010_plain/')"
    approved_0010() { approved_0010_plain | sed 's/^## Decisiones que he tomado yo — valida estas$/&\n\n- Política de modelos (solo en `delegate`): revisores de la spec ninguno · ejes de la revisión final Spec opus+high, Código sonnet+high, Arquitectura no (plan) · en paralelo hasta `control.maxParallelAgents`/'; }
    done_0010
    export APPEND_SYSTEM="Instrucciones del usuario: antes de paralelizar subagentes o workflows, justifica qué modelo va a cada tarea y pide confirmación." ;;
esac

case "$SC" in
  v1|f3|f3n|f4|f5|s1|s1b) export EXTRA_DISALLOWED="Agent" ;;
esac
case "$SC" in
  f1|f2|mp1) MAX_TURNS="${MAX_TURNS:-30}" ;;
  f3|f3n|f4|f5|s1|s1b) MAX_TURNS="${MAX_TURNS:-25}" ;;
  c1|c1f|c5) MAX_TURNS="${MAX_TURNS:-50}" ;;
  c2|c3|c4) MAX_TURNS="${MAX_TURNS:-30}" ;;
  *) MAX_TURNS="${MAX_TURNS:-40}" ;;
esac

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
for kept in spec plan tasks walkthrough; do [ -f "$R/$F10/$kept.md" ] && subject_keep "$R/$F10/$kept.md" "$kept.md"; done
[ -f "$R/test/cancel.test.js" ] && subject_keep "$R/test/cancel.test.js" cancel.test.js
[ -f "$R/src/app.js" ] && subject_keep "$R/src/app.js" app.js
[ "$SC" = f5 ] && subject_keep "$R/e2e/0024-remember-filter.spec.ts" 0024-remember-filter.spec.ts
for ledger in "$R"/.temp/sdd/*/progress.md; do [ -f "$ledger" ] && subject_keep "$ledger" progress.md; done
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## commits con sus ficheros"; g log --stat --format='--- %h %s' develop..HEAD; } | subject_save
