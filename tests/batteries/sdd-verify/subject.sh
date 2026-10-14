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
[ "$SC" = c5 ] && MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native", "validation": {"mode": "field"}'
[ "$SC" = f2 ] && MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 2}, "execution": "native"'
F10=".docs/sdd/specs/20261008-100000-feature-0010-cancel-reason"
F21=".docs/sdd/specs/20261012-100000-feature-0021-void-reason"

cp -r "$IMPL/mold-reservas/." "$R/"
put_kit_marker "$MARKER"
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

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

# La 0010 implementada en Native, con sus dos tasks en el ledger y en tasks.md; deja A con el sha de la última task.
done_0010() {
  local base1 base2
  open_0010
  base1=$(short HEAD)
  cp "$IMPL/fixtures/app-task1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-task1.test.js" "$R/test/cancel.test.js"
  commit "feat(bookings): cancelar con un motivo de la lista"
  base2=$(short HEAD)
  cp "$IMPL/fixtures/app-done.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-done.test.js" "$R/test/cancel.test.js"
  commit "feat(bookings): listado de canceladas con su motivo"
  A=$(short HEAD)
  ledger "Task 1: complete (commits $base1..$base2, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits $base2..$A, tests: node --test test/cancel.test.js → 3/3 pass)"
}
tasks_md() {
  printf '%s\n' '---' 'id: 20261008-100000-feature-0010-cancel-reason' 'title: Tasks — Motivo al cancelar' '---' '' '# Tasks — Motivo al cancelar (registro vivo)' '' \
    '| # | Task | Status | Commit | Notas |' '| --- | --- | --- | --- | --- |' "| 1 | Cancelar con motivo | done | $A | |" "| 2 | Listado de canceladas | done | $A | |" '' "$@" | put "$F10/tasks.md"
}
fix_trim() {
  sed -i 's/return index === -1 ? undefined : params\[index + 1\];/return index === -1 ? undefined : params[index + 1]?.trim();/' "$R/src/app.js"
  printf '\ntest("cancelar con un espacio tras el motivo", () => {\n  assert.equal(run("cancelar", ["Sur", "mar", "--motivo", "otro "]), "sin reserva Sur mar");\n});\n' >> "$R/test/cancel.test.js"
  commit "fix(bookings): el motivo sin espacios alrededor"
}
empty_list_text() {
  sed -i "s/\.join('\\\\n');/.join('\\\\n') || 'sin canceladas';/" "$R/src/app.js"
  commit "fix(bookings): canceladas sin canceladas dice «sin canceladas»"
}
ws_dir() { cd "$R" && "$NODE" "$SDD_CLI" workspace "$F10/plan.md" | tail -n 1; }
# El encargo del eje de f3 o f4, compuesto con el texto del kit que se prueba.
axis_brief() {
  local axis=spec values="$RUN/axis-values.json" code focus files adrs caps dir
  [ "$SC" = f4 ] && axis=code
  dir="$(cygpath -m "$R" 2>/dev/null || echo "$R")"
  if [ "$SC" = f3 ]; then
    code=$'- Texto de la interfaz en castellano.\n- Sin comentarios que repitan el código ni que citen documentos.'
    focus='- `anular Norte lun` sin `--motivo` → «falta el motivo» · Task 1, `pide motivo al anular`'
  else
    code=$'- Texto de la interfaz en castellano.\n- Funciones de 30 líneas como mucho.'
    focus='ninguna: comprobado'
  fi
  files=$(g diff --name-only "$BASE" HEAD -- . ":(exclude,glob).docs/sdd/specs/**")
  # shellcheck disable=SC2086
  adrs=$(cd "$R" && "$NODE" "$SDD_CLI" decision index --path .docs/sdd --files $files 2>/dev/null)
  caps=$(cd "$R" && "$NODE" "$SDD_CLI" capability index --path .docs/sdd 2>/dev/null)
  "$NODE" -e '
    const [code, focus, pkg, sha, dir, adrs, caps, spec, plan] = process.argv.slice(1);
    console.log(JSON.stringify([
      ["<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>", code],
      ["<ruta del paquete que imprime la receta>", pkg], ["<sha>", sha], ["<REVIEW_DIR>", dir],
      ["<copia literal de la sección `## Review Focus` del plan: todas sus líneas, enteras>", focus],
      ["<ruta de spec.md>", spec], ["<ruta de plan.md>", plan],
      ["<líneas que imprime sdd decision index --files con los ficheros del diff, o «ninguna»>", adrs || "ninguna"],
      ["<salida de sdd capability index>", caps], ["<ruta del ledger del plan, o «sin ledger»>", "sin ledger"],
      ["[DESCRIPTION]", "la feature de la rama"], ["[PLAN_OR_REQUIREMENTS]", spec ? `${spec} y ${plan}` : "Comando ocupacion: cada sala con sus reservas activas, las canceladas si las hay y el total."],
      ["[BASE_SHA]", sha + "~"], ["[HEAD_SHA]", sha],
    ]));' -- "$code" "$focus" "$(cygpath -m "$PKG" 2>/dev/null || echo "$PKG")" "$HEADSHA" "$dir" "$adrs" "$caps" \
      "$([ "$SC" = f3 ] && echo "$F21/spec.md")" "$([ "$SC" = f3 ] && echo "$F21/plan.md")" > "$values"
  "$NODE" "$HERE/compose-axis.mjs" "$KIT" "${SUPERPOWERS_DIR:-}" "$axis" "$values"
}
case "$SC" in
  v1)
    open_0010
    BASE1=$(short HEAD)
    cp "$IMPL/fixtures/app-task1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-task1.test.js" "$R/test/cancel.test.js"
    commit "feat(bookings): cancelar con un motivo de la lista"
    ledger "Task 1: complete (commits $BASE1..$(short HEAD), tests: node --test test/cancel.test.js → 2/2 pass)"
    cp "$FIX/app-v1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-done.test.js" "$R/test/cancel.test.js" ;;
  c1)
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
    cp "$FIX/app-c5.js" "$R/src/app.js"
    printf '\ntest("cancelar con un espacio tras el motivo", () => {\n  assert.equal(run("cancelar", ["Sur", "mar", "--motivo", "otro "]), "sin reserva Sur mar");\n});\n' >> "$R/test/cancel.test.js"
    commit "fix(bookings): el motivo sin espacios alrededor"; B=$(short HEAD)
    tasks_md "Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre $A" "Pasada de fix: $B, 1 hallazgo RED→GREEN" "Re-revisión: $A..$B, sdd-kit:effort-high + opus, 1 Critical"
    commit "docs(sdd): tasks.md con la re-revisión"
    WS=$(ws_dir); cp "$FIX/re-review-c5.md" "$WS/re-review.md" ;;  f3|f4)
    mkdir -p "$R/.docs/sdd/decisions" "$R/.docs/sdd/capabilities"
    cp "$HERE/../sdd-propose/fixtures/adr-0003-bookings-in-memory.md" "$R/.docs/sdd/decisions/0003-bookings-in-memory.md"
    cp "$FIX/capabilities/"*.md "$R/.docs/sdd/capabilities/"
    if [ "$SC" = f3 ]; then cp "$FIX/app-f3-base.js" "$R/src/app.js"; else cp "$IMPL/fixtures/app-done.js" "$R/src/app.js"; fi
    commit "feat: la app antes del cambio"
    BASE=$(g rev-parse HEAD)
    g checkout -q -b feature/review
    if [ "$SC" = f3 ]; then
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
    ASK="$(axis_brief)" ;;  f1|f2)
    mkdir -p "$R/.docs/sdd/decisions"; cp "$HERE/../sdd-propose/fixtures/adr-0003-bookings-in-memory.md" "$R/.docs/sdd/decisions/0003-bookings-in-memory.md"
    commit "docs(decisions): las reservas viven en memoria"
    open_0010
    BASE1=$(short HEAD)
    cp "$IMPL/fixtures/app-task1.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-task1.test.js" "$R/test/cancel.test.js"
    commit "feat(bookings): cancelar con un motivo de la lista"
    BASE2=$(short HEAD)
    cp "$IMPL/fixtures/app-done.js" "$R/src/app.js"; cp "$IMPL/fixtures/cancel-done.test.js" "$R/test/cancel.test.js"
    [ "$SC" = f2 ] && printf '{"type": "module", "dependencies": {"zod": "^3.23.8"}}\n' > "$R/package.json"
    commit "feat(bookings): listado de canceladas con su motivo"
    ledger "Task 1: complete (commits $BASE1..$BASE2, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits $BASE2..$(short HEAD), tests: node --test test/cancel.test.js → 3/3 pass)" ;;
esac

case "$SC" in
  v1|f3|f4) export EXTRA_DISALLOWED="Agent" ;;
esac
case "$SC" in
  f1|f2) MAX_TURNS="${MAX_TURNS:-30}" ;;
  f3|f4) MAX_TURNS="${MAX_TURNS:-25}" ;;
  c1|c5) MAX_TURNS="${MAX_TURNS:-50}" ;;
  c2|c3|c4) MAX_TURNS="${MAX_TURNS:-30}" ;;
  *) MAX_TURNS="${MAX_TURNS:-40}" ;;
esac

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
for kept in spec plan tasks walkthrough; do [ -f "$R/$F10/$kept.md" ] && subject_keep "$R/$F10/$kept.md" "$kept.md"; done
[ -f "$R/test/cancel.test.js" ] && subject_keep "$R/test/cancel.test.js" cancel.test.js
[ -f "$R/src/app.js" ] && subject_keep "$R/src/app.js" app.js
for ledger in "$R"/.superpowers/sdd/*/progress.md; do [ -f "$ledger" ] && subject_keep "$ledger" progress.md; done
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## commits con sus ficheros"; g log --stat --format='--- %h %s' develop..HEAD; } | subject_save
