#!/usr/bin/env bash
# Sujetos del cierre fuera del camino crítico, con el lanzador de referencia. c1 deniega Agent (deny-agent.mjs de la 0085);
# c2 y c3 reciben un veredicto limpio (clean-review.mjs), para que el sujeto siga hasta el cierre.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   c1 molde pedidos: la última task de la 0015, que cambia la UI, commiteada con su verificación visual pendiente
#   c2 molde salas: feature validada; el dev-lead pide cambiar el texto de un error antes de cerrar
#   c4 molde salas: un commit del hilo mientras revisaba el revisor final, y después su pasada de fix por un Important;
#      la petición no nombra ese commit (c4-2 la nombraba y el sujeto lo vio por ella)
#   c3 molde salas: pasada de fix y re-revisión apuntadas con shas del tramo que el cierre junta
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
SPECS="$REPO/.docs/sdd/specs"
. "$REPO/tests/headless/lib.sh"
case $3 in c1|c4) SKILL=sdd-start-feature ;; *) SKILL=sdd-end-feature ;; esac
subject_init "$1" "$2" "$4" "$SKILL"
SC="$3"
case $3 in
  c1) HOOK="$(cygpath -m "$SPECS/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs")" ;;
  *) HOOK="$(cygpath -m "$BASE/clean-review.mjs")" ;;
esac
SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Agent|Task","hooks":[{"type":"command","command":"node \"'"$HOOK"'\""}]}]}}'
WAIT="El dev-lead sigue la sesión leyendo tus mensajes, pero no va a contestar hasta que acabes."

last_ui_task_pending_visual() {
  local d="$SPECS/20260929-073733-feature-0099-frontend-verification/red"
  APP_PORT=$(( 4700 + ${LABEL##*-} )); LOGIN=none; FRONTEND=impeccable; PROFILE=delegate; CARD_PADDING=16px
  . "$d/mold.sh"; . "$d/features.sh"
  PW_MODULES="${PW_MODULES:?define PW_MODULES (node_modules con playwright 1.63 en el scratchpad)}"
  pedidos_base
  cp -r "$PW_MODULES" "$R/node_modules"
  printf '.superpowers/\n' >> "$R/.gitignore"
  g checkout -q -b feature/0015-order-summary
  f15_docs
  sed -i 's|^- Cada fila del listado muestra el total junto al cliente.|**Verificación visual**: `/pedidos` y `/pedidos?theme=dark` · temas claro y oscuro · qué mirar: la fila del 1042 dice «Ferretería López · 1.240,00 €» en una sola línea\n\n&|' "$R/$F15/plan.md"
  f15_tasks '' pending '' '' pending ''
  commit "docs(0015): abrir la feature 0015" "Spec, plan y tasks."
  local t0; t0=$(g rev-parse --short HEAD)
  f15_task1; local t1; t1=$(g rev-parse --short HEAD)
  f15_task2; local t2; t2=$(g rev-parse --short HEAD)
  f15_tasks "$t1" done "$t2" '' in_progress ''
  f15_task3; T3=$(g rev-parse --short HEAD)
  mkdir -p "$R/.superpowers/sdd/plan"
  printf '# SDD ledger — plan: %s/plan.md\n\nTask 1: complete (commits %s..%s, tests: node --test → 5/5 pass)\nTask 2: complete (commits %s..%s, tests: node --test → 6/6 pass)\n' "$F15" "$t0" "$t1" "$t1" "$t2" > "$R/.superpowers/sdd/plan/progress.md"
  ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0015 (perfil delegate) en \`feature/0015-order-summary\`: el plan dice \`Ejecución: native\`, las Tasks 1 y 2 están completas en el ledger (\`.superpowers/sdd/plan/progress.md\`) y la Task 3, la última, está commiteada en \`$T3\` y le falta su verificación visual. Sigue hasta presentar la validación. $WAIT"
}

salas_mold() {
  SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
  . "$SPECS/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
  . "$SPECS/20260924-105352-task-0057-native-adapt/red/mold.sh"
  FINAL_LINE='Revisión final: sdd-kit:effort-high + opus'
  g init -q -b main
  base_files; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; native_plan
  commit "docs(0012): abrir la feature 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
  native_tasks_done
  sed -i 's/| 1 | Validar al reservar | pending |/| 1 | Validar al reservar | done |/; s/| 2 | Validar al consultar libres | pending |/| 2 | Validar al consultar libres | done |/' "$R/$SPEC/tasks.md"
}

NATIVE="la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: native\` y las Tasks 1 y 2 están hechas"
VALIDATED="El dev-lead responde a la validación: «He probado \`salas reservar Norte 1012\` y \`salas libres 1012\`: los dos dan el error de la franja. Vale, funciona.»"

validated_then_text_change() {
  salas_mold
  REVIEWED=$(g rev-parse --short HEAD)
  final_review_recorded
  sed -i "s/^$FINAL_LINE, Ready (0 Critical, 0 Important, 2 Minor)\$/&, sobre $REVIEWED/" "$R/$SPEC/tasks.md"
  g commit -q --amend --no-edit -a
  ASK="Invoca la skill sdd-kit:sdd-end-feature y cierra $NATIVE. La revisión final de rama volvió limpia, apuntada en \`tasks.md\`, y presentaste la validación. $VALIDATED Y añade: «Antes de cerrar, cambia el mensaje del error de la franja a \"Franja no válida: escribe HH-HH, por ejemplo 10-12\" en los dos comandos, y cierra.» $WAIT"
}

fix_pass_and_rereview_in_closing_range() {
  salas_mold
  sed -i "/^export function free/,/^}/ s/new Error('[^']*')/new Error('Franja no válida')/" "$R/src/slots.js"
  g commit -q --amend --no-edit -a
  REVIEWED=$(g rev-parse --short HEAD)
  printf '\n%s, Needs fixes (0 Critical, 1 Important, 0 Minor), sobre %s\n' "$FINAL_LINE" "$REVIEWED" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): revisión final de rama" "Apunta la revisión final en tasks.md."
  sed -i "/^export function free/,/^}/ s/new Error('[^']*')/new Error('Franja no válida: usa HH-HH, p. ej. 10-12')/" "$R/src/slots.js"
  commit "fix(0012): mensaje literal de la franja en libres" "Pasada de fix de la revisión final, con su test RED→GREEN."
  PASS=$(g rev-parse --short HEAD)
  printf 'Pasada de fix: %s, 1 hallazgo RED→GREEN\n' "$PASS" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): pasada de fix en tasks.md" "Apunta el commit de la pasada de fix."
  printf '\n// Franja HH-HH de dos horas.\n' >> "$R/src/slots.js"
  commit "docs(0012): nota de formato en slots.js" "Comentario del formato de la franja."
  FIX=$(g rev-parse --short HEAD)
  printf 'Re-revisión: %s..%s, sdd-kit:effort-high + opus, limpia\n' "$PASS" "$FIX" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): re-revisión en tasks.md" "Apunta la re-revisión del tramo posterior a la pasada."
  ASK="Invoca la skill sdd-kit:sdd-end-feature y cierra $NATIVE. La revisión final, su pasada de fix y la re-revisión del tramo posterior están apuntadas en \`tasks.md\`, y presentaste la validación. $VALIDATED «Cierra la feature.» $WAIT"
}

commit_during_review_then_fix_pass() {
  salas_mold
  sed -i "/^export function free/,/^}/ s/new Error('[^']*')/new Error('Franja no válida')/" "$R/src/slots.js"
  g commit -q --amend --no-edit -a
  REVIEWED=$(g rev-parse --short HEAD)
  sed -i 's/if (!SLOT.test(slot)) throw/if (!isSlot(slot)) throw/' "$R/src/slots.js"
  printf '\nfunction isSlot(slot) {\n  return SLOT.test(slot);\n}\n' >> "$R/src/slots.js"
  commit "refactor(0012): nombrar la comprobación de la franja" "Visto en la verificación, mientras el revisor final trabajaba sobre la última task. Sin cambio de comportamiento."
  MID=$(g rev-parse --short HEAD)
  printf '
%s, Needs fixes (0 Critical, 1 Important, 0 Minor), sobre %s
' "$FINAL_LINE" "$REVIEWED" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): revisión final de rama" "Apunta la revisión final en tasks.md."
  sed -i "/^export function free/,/^}/ s/new Error('[^']*')/new Error('Franja no válida: usa HH-HH, p. ej. 10-12')/" "$R/src/slots.js"
  commit "fix(0012): mensaje literal de la franja en libres" "Pasada de fix de la revisión final, con su test RED→GREEN."
  PASS=$(g rev-parse --short HEAD)
  printf 'Pasada de fix: %s, 1 hallazgo RED→GREEN
' "$PASS" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): pasada de fix en tasks.md" "Apunta el commit de la pasada de fix."
  ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. La revisión final de rama volvió con un Important y su pasada de fix quedó en \`$PASS\`; las dos están apuntadas en \`tasks.md\`. Sigue con el paso 7: presenta la validación. $WAIT"
}

case $SC in
  c1) last_ui_task_pending_visual ;;
  c2) validated_then_text_change ;;
  c3) fix_pass_and_rereview_in_closing_range ;;
  c4) commit_during_review_then_fix_pass ;;
  *) die "escenario desconocido: $SC" ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; echo "$ASK"; exit 0; }
MAX_TURNS=60 subject_launch "$ASK"

reachability() {
  local f
  f=$(ls "$R"/.docs/sdd/specs/*/tasks.md 2>/dev/null | head -n 1)
  [ -n "$f" ] || return
  grep -oE '\b[0-9a-f]{7,40}\b' "$f" | sort -u | while read -r sha; do
    if g merge-base --is-ancestor "$sha" HEAD 2>/dev/null; then echo "$sha alcanzable"; else echo "$sha NO alcanzable"; fi
  done
}

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## worktrees"; g worktree list
  echo "## shas de tasks.md desde HEAD"; reachability
  echo "## tasks.md"; cat "$R"/.docs/sdd/specs/*/tasks.md 2>/dev/null
  echo "## diff desde el molde"; g diff --stat "$BEFORE"
} | subject_save
[ -f "$RUN/agent-prompts.txt" ] && subject_keep "$RUN/agent-prompts.txt" agent-prompts.txt
for f in "$R"/.docs/sdd/specs/*/walkthrough.md; do [ -f "$f" ] && subject_keep "$f" walkthrough.md; done
exit 0
