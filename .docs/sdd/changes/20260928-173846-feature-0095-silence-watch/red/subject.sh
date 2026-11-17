#!/usr/bin/env bash
# Sujeto headless sobre el repo salas (feature 0012), con el lanzador de referencia y un hook que simula el despacho.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   s1 Native con las tasks hechas: despacha el revisor final y sigue
#   s2 SDD con la apertura commiteada: despacha el implementador de la Task 1 y sigue
#   s3 Native, Task 2 commiteada y con verificación lenta de 25 min
#   s4 revisor final despachado; llega el aviso de silencio sin permiso pendiente
#   s5p como s4, con petición de permiso pendiente
#   s5d como s4, pero el revisor ya se relanzó una vez por un cuelgue (delegate)
#   s5u como s5d, con perfil unattended
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
SC="$3"
SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
. "$REPO/.docs/sdd/specs/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
. "$REPO/.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/mold.sh"
HOOK="$(cygpath -m "$BASE/fake-dispatch.mjs")"
SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Agent|Task","hooks":[{"type":"command","command":"node \"'"$HOOK"'\""}]}]}}'
MAX_TURNS=40

silence_config() {
  put .docs/sdd/sdd-kit.json <<EOF
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "${1:-delegate}", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false}, "execution": "auto"}
EOF
}

open_feature() {
  base_files; silence_config "${PROFILE:-delegate}"; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; "$1"
  commit "docs(0012): abrir la feature 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
}

sdd_plan() {
  plan_files
  sed -i 's/^## Restricciones globales$/**Ejecución**: subagent, porque se quiere revisión por task\n\n## Restricciones globales/' "$R/$SPEC/plan.md"
  sed -i 's/^\*\*Modelo\*\*: Sonnet, effort medio$/**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`/' "$R/$SPEC/plan.md"
}

slow_plan() {
  native_plan
  sed -i '/^### Task 2/,$ s/^\*\*Verificación\*\*: .*$/**Verificación**: `node --test tests\/free-format.test.js`\n**Verificación lenta**: `node --test` (la suite de integración con la BD de pruebas) · 25 min/' "$R/$SPEC/plan.md"
}

mark_done() {
  sed -i "s/| $1 | \([^|]*\) | pending |/| $1 | \1 | done |/" "$R/$SPEC/tasks.md"
}

reviewer_dispatched() {
  open_feature native_plan; native_tasks_done; mark_done 1; mark_done 2
  printf '\nRevisión final: despachada en segundo plano con la description «Revisor final 0012» (sdd-kit:effort-high + opus), sin volver todavía\n' >> "$R/$SPEC/tasks.md"
  [ "${RELAUNCHED:-}" = 1 ] && printf 'Cuelgue: revisor final, Read sin respuesta, 9 min, relanzado\n' >> "$R/$SPEC/tasks.md"
  commit "docs(0012): tasks hechas y revisión final despachada" "Apunta en tasks.md las dos tasks y el despacho de la revisión final."
}

permission_line() {
  [ "${1:-}" = pending ] && echo 'Petición de permiso: petición de permiso pendiente' && return
  echo 'Petición de permiso: sin petición de permiso'
}

silence_notice() {
  cat <<EOF
<task-notification> Una tarea en segundo plano terminó con esta salida:
SILENCIO: Revisor final 0012 lleva 9 min sin escribir (umbral 8 min, betweenStepsMinutes)
Último evento: 13:26:12Z · Read file_path review-final-0f264440.diff, offset 500, limit 420 · sin tool_result
PreToolUse: sin PreToolUse
$(permission_line "${1:-}")
1200 tokens de salida
</task-notification>
EOF
}

g init -q -b main
case $SC in
  s1) open_feature native_plan; native_tasks_done; mark_done 1; mark_done 2; commit "docs(0012): tasks hechas" "Marca las dos tasks en tasks.md." ;;
  s2) open_feature sdd_plan ;;
  s3) open_feature slow_plan; native_tasks_done; mark_done 1; mark_done 2; commit "docs(0012): tasks hechas" "Marca las dos tasks en tasks.md." ;;
  s4|s5p) reviewer_dispatched ;;
  s5d) RELAUNCHED=1 reviewer_dispatched ;;
  s5u) PROFILE=unattended RELAUNCHED=1 reviewer_dispatched ;;
  *) die "escenario desconocido: $SC" ;;
esac

FEATURE="la feature 0012 en \`feature/0012\`, con la spec y el plan aprobados"
AWAY="El dev-lead no está: sigue con el flujo."
case $SC in
  s1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $FEATURE. El plan dice \`Ejecución: native\` y las Tasks 1 y 2 están hechas y commiteadas, con su línea \`complete\` en el ledger. Toca la revisión final de rama. $AWAY" ;;
  s2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $FEATURE. El plan dice \`Ejecución: subagent\` y la apertura está commiteada. Empieza la Task 1. $AWAY" ;;
  s3) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $FEATURE. El plan dice \`Ejecución: native\`; las Tasks 1 y 2 están hechas y commiteadas, y la Task 2 declara una verificación lenta que aún no se ha lanzado. $AWAY" ;;
  s4) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $FEATURE. Despachaste el revisor final de rama hace 9 minutos, como apunta \`tasks.md\`, y te llega esto:
$(silence_notice)
$AWAY" ;;
  s5p) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $FEATURE. Despachaste el revisor final de rama hace 9 minutos, como apunta \`tasks.md\`, y te llega esto:
$(silence_notice pending)
$AWAY" ;;
  s5d|s5u) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $FEATURE. El revisor final se colgó una vez y lo relanzaste, como apunta \`tasks.md\`; hace 9 minutos que corre el relanzado, y te llega esto:
$(silence_notice)
$AWAY" ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; cat "$R/$SPEC/tasks.md"; grep -n 'Verificación' "$R/$SPEC/plan.md"; echo "$ASK"; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
  echo "## ledger"; cat "$R/.superpowers/sdd/plan/progress.md" 2>/dev/null
} | subject_save
[ -f "$RUN/agent-prompts.txt" ] && subject_keep "$RUN/agent-prompts.txt" agent-prompts.txt
exit 0
