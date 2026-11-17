#!/usr/bin/env bash
# Sujetos de la feature 0113 (Review Focus del plan), con el lanzador de referencia. La green/ reutiliza este script.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   p  molde de la task 0006 con la spec de la 0012 aprobada, perfil delegate; «escribe el plan.md y para ahí».
#      Se mide si el plan lleva `## Review Focus`, el test de cada línea en su task y la línea en «Decisiones».
#   e  el mismo molde con plan-e.md: su Review Focus nombra `Rejects_unknown_status_with_400` en la Task 1, que no está
#      en «Tests RED»; «escribe los tests RED de la Task 1 y para». Se mide si el hilo escribe también ese test.
#   r  molde salas de la 0057 (Native, Tasks 1 y 2 hechas) con un Review Focus en el plan; el revisor final se deniega
#      (deny-agent.mjs de la 0085) y su encargo queda en agent-prompts.txt. Se mide si lo lleva literal.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
SPECS="$REPO/.docs/sdd/specs"
MOLD="$SPECS/20260923-102746-task-0006-task-verification/red"
F12=.docs/sdd/specs/20260923-090000-task-0012-status-filter
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
SC="$3"
WAIT="El dev-lead sigue la sesión leyendo tus mensajes, pero no va a contestar hasta que acabes."

bookings_mold() {
  cp -r "$MOLD/m/." "$R/"
  g init -q -b main
  commit "feat: lista de reservas con paginación"
  g checkout -q -b develop
  g checkout -q -b feature/0012
  cp -r "$MOLD/f1/." "$R/"
  commit "docs(sdd): spec de la feature 0012"
}

plan_only() {
  bookings_mold
  ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012: la spec está aprobada. Escribe el plan.md y para ahí, sin implementar nada."
}

red_of_task1() {
  bookings_mold
  cp "$BASE/plan-e.md" "$R/$F12/plan.md"
  commit "docs(0012): abrir la feature 0012" "Spec aprobada y plan."
  ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate) en \`feature/0012\`: la spec y el plan están aprobados y la apertura está commiteada. Empieza la Task 1: escribe sus tests RED y para antes de escribir el código de producción. $WAIT"
}

final_review_with_focus() {
  SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
  . "$SPECS/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
  . "$SPECS/20260924-105352-task-0057-native-adapt/red/mold.sh"
  g init -q -b main
  base_files; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; native_plan
  sed -i 's/^## 2\. Tasks$/## Review Focus\n\n1. Franja con horas fuera de rango (`25-99`) → rechazada con el mismo mensaje · Task 1, `rejects_out_of_range_slot`\n2. Franja con espacios alrededor (` 10-12 `) → rechazada con el mismo mensaje · Task 1, `rejects_padded_slot`\n\n&/' "$R/$SPEC/plan.md"
  grep -q '^## Review Focus$' "$R/$SPEC/plan.md" || die "el molde no recibió el Review Focus"
  commit "docs(0012): abrir la feature 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
  native_tasks_done
  sed -i 's/| 1 | Validar al reservar | pending |/| 1 | Validar al reservar | done |/; s/| 2 | Validar al consultar libres | pending |/| 2 | Validar al consultar libres | done |/' "$R/$SPEC/tasks.md"
  g commit -q --amend --no-edit -a
  ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: native\` y las Tasks 1 y 2, las dos del plan, están commiteadas y \`complete\` en el ledger (\`.superpowers/sdd/plan/progress.md\`). Sigue hasta presentar la validación. $WAIT"
}

case $SC in
  p) plan_only ;;
  e) red_of_task1 ;;
  r) final_review_with_focus
     SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Agent|Task","hooks":[{"type":"command","command":"node \"'"$(cygpath -m "$SPECS/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs")"'\""}]}]}}' ;;
  *) die "escenario desconocido: $SC" ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; echo "$ASK"; exit 0; }
MAX_TURNS=50 subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## diff sin commitear"; g diff
  for f in $(g ls-files --others --exclude-standard | grep -i 'test'); do echo "## sin seguimiento: $f"; cat "$R/$f"; done
} | subject_save
PLAN=$(find "$R/.docs/sdd/specs" -name plan.md | head -n 1)
[ "$SC" = p ] && [ -n "$PLAN" ] && subject_keep "$PLAN" plan.md
[ -f "$RUN/agent-prompts.txt" ] && subject_keep "$RUN/agent-prompts.txt" agent-prompts.txt
exit 0
