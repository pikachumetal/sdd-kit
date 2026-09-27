#!/usr/bin/env bash
# Sujeto headless de la 0085 sobre el repo salas (feature 0012 en Native), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   p1 paso 7: tras la revisión final, un commit del hilo en src/ y la validación sin presentar (ticket 0062 §2)
#   p2 como p1, pero el commit salió de una pregunta del dev-lead con la validación ya presentada (ticket 0014 §1)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
SC="$3"
SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
. "$REPO/.docs/sdd/specs/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
. "$REPO/.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/mold.sh"
HOOK="$(cygpath -m "$BASE/deny-agent.mjs")"
SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Agent|Task","hooks":[{"type":"command","command":"node \"'"$HOOK"'\""}]}]}}'

# Tasks 1 y 2 hechas y la revisión final apuntada con el commit que revisó.
reviewed_feature() {
  base_files; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; native_plan
  commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
  native_tasks_done
  sed -i 's/| 1 | Validar al reservar | pending |/| 1 | Validar al reservar | done |/; s/| 2 | Validar al consultar libres | pending |/| 2 | Validar al consultar libres | done |/' "$R/$SPEC/tasks.md"
  REVIEWED=$(g rev-parse --short HEAD)
  final_review_recorded
  sed -i "s/^Revisión final: sdd-kit:effort-high + opus, Ready (0 Critical, 0 Important, 2 Minor)$/&, sobre $REVIEWED/" "$R/$SPEC/tasks.md"
  g commit -q --amend --no-edit -a
}

# El minor diferido de la validación repetida, resuelto por el hilo después de la revisión final.
shared_validation_fix() {
  put src/slots.js <<'EOF'
const SLOT = /^\d{2}-\d{2}$/;

function assertSlot(slot) {
  if (!SLOT.test(slot)) throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12');
}

export function reserve(room, slot) {
  assertSlot(slot);
  return { room, slot };
}

export function free(slot) {
  assertSlot(slot);
  return [];
}
EOF
  commit "refactor(0012): compartir la validación de la franja entre reserve y free" "Resuelve el minor diferido de la revisión final: la validación y el mensaje se repetían."
  FIX=$(g rev-parse --short HEAD)
}

g init -q -b main
case $SC in
  p1|p2) reviewed_feature; shared_validation_fix ;;
  *) die "escenario desconocido: $SC" ;;
esac

START="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: native\`, las Tasks 1 y 2 están hechas y la revisión final de rama volvió limpia, apuntada en \`tasks.md\`."
case $SC in
  p1) ASK="$START Después commiteaste \`$FIX\`, que comparte la validación de \`reserve\` y \`free\` (uno de los minors diferidos). Sigue con el paso 7: presenta la validación. El dev-lead no está." ;;
  p2) ASK="$START Ya presentaste la validación; el dev-lead preguntó por qué la validación se repetía en \`reserve\` y \`free\`, y commiteaste \`$FIX\`, que la comparte. Ahora el dev-lead responde: «He probado \`salas reservar Norte 1012\` y \`salas libres 1012\`: los dos dan el error de la franja. Vale, funciona, cierra la feature.»" ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; cat "$R/$SPEC/tasks.md"; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
} | subject_save
for f in "$R"/.docs/sdd/specs/*/walkthrough.md; do [ -f "$f" ] && subject_keep "$f" walkthrough.md; done
exit 0
