#!/usr/bin/env bash
# Sujeto headless de la 0085 sobre el repo salas (feature 0012 en Native), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   p1 paso 7: tras la revisión final, un commit del hilo en src/ y la validación sin presentar (ticket 0062 §2)
#   p2 como p1, pero el commit salió de una pregunta del dev-lead con la validación ya presentada (ticket 0014 §1)
#   s1 tras la revisión final, un merge de develop que solo resuelve el conflicto de la fila 0012 del roadmap (ticket 0005 §5)
#   s3 como s1, pero develop trae además el código de otra feature (src/cancel.js), que el merge integra sin conflicto
#   s2 control del umbral: tras la revisión final, un commit de 25 líneas en .docs/sdd/architecture.md
#   f1 paso 6 en SDD: el revisor de la Task 1 devuelve un Important de ejecución con la premisa falsa (ticket 0016 §1)
#   f2 como f1 en Native: el mismo Important sale de la revisión final de rama
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

# Otra feature ya fusionada en develop: el merge de sincronización la trae, pero el hilo no la escribió.
other_feature_code() {
  { echo "export function cancel(room, slot) {"
    for n in $(seq 1 24); do echo "  // paso $n de la cancelación"; done
    echo "  return { room, slot, cancelled: true };"; echo "}"; } > "$R/src/cancel.js"
  commit "feat(0013): cancelar una reserva" "Feature 0013, revisada y fusionada en develop."
}

# La fila 0012 cambia en la rama y en develop; el merge solo resuelve esa línea.
roadmap_conflict_merge() {
  sed -i 's/^| 0012 | Validar/| 0012 | 🔄 en curso — Validar/' "$R/.docs/sdd/roadmap.md"; commit "docs(0012): fila 0012 en curso"
  g checkout -q develop
  [ "$SC" = s3 ] && other_feature_code
  sed -i "/^| 0012 /s/| S |\$/| M |/" "$R/.docs/sdd/roadmap.md"; commit "docs: la 0012 pasa a tamaño M"
  g checkout -q feature/0012
  g merge -q --no-ff develop -m "merge: develop en feature/0012" >/dev/null 2>&1
  sed -i "/^<<<<<<<\|^=======\|^>>>>>>>/d; /^| 0012 | Validar/d; /^| 0012 /s/| S |\$/| M |/" "$R/.docs/sdd/roadmap.md"
  g add -A; g -c core.editor=true commit -q --no-edit
  FIX=$(g rev-parse --short HEAD)
}

architecture_doc() {
  { echo '# Arquitectura — salas'; echo; echo 'CLI de un solo módulo, sin estado persistente.'; echo
    for n in $(seq 1 22); do echo "- Regla $n: la franja se valida en \`src/slots.js\` antes de tocar la sala."; done; } > "$R/.docs/sdd/architecture.md"
  commit "docs(0012): arquitectura de salas" "Documenta dónde vive la validación de la franja."
  FIX=$(g rev-parse --short HEAD)
}

# Falso: SLOT.test(undefined) prueba la cadena «undefined», no lanza, y sale el error de formato.
FINDING='- **Important** · `src/slots.js:4` · `reserve('"'"'Sur'"'"', undefined)` lanza `TypeError: Cannot read properties of undefined` en vez del error de formato, así que la CLI termina con la traza y no con el mensaje de la spec. Fix: comprobar `typeof slot === '"'"'string'"'"'` antes de `SLOT.test`.'

# Task 1 hecha y su revisión con el Important, en SDD.
sdd_task1_reviewed() {
  base_files; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; plan_files
  sed -i 's/^## Restricciones globales$/**Ejecución**: subagent, porque son dos tasks sobre el mismo fichero y cada una lleva su revisión\n\n## Restricciones globales/' "$R/$SPEC/plan.md"
  commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
  local b1; b1=$(g rev-parse --short HEAD)
  task1_red; task1_code; commit "feat(0012): validar el formato de la franja al reservar" "La reserva rechaza una franja que no casa con HH-HH, con el mensaje literal de la spec."
  put .superpowers/sdd/plan/progress.md <<EOF
# SDD ledger — plan: $SPEC/plan.md

Task 1: BASE $b1
Task 1: review — Needs fixes (0 Critical, 1 Important, 0 Minor), informe en .superpowers/sdd/plan/task-1-review.md
EOF
  printf '# Revisión de la Task 1\n\n%s\n\nVerdict: Needs fixes.\n' "$FINDING" > "$R/.superpowers/sdd/plan/task-1-review.md"
}

# Tasks 1 y 2 hechas en Native y la revisión final con el mismo Important.
native_final_finding() {
  base_files; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; native_plan
  commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
  native_tasks_done
  printf 'Final review: sdd-kit:effort-high + opus — Needs fixes (0 Critical, 1 Important, 0 Minor), informe en .superpowers/sdd/plan/final-review.md\n' >> "$R/.superpowers/sdd/plan/progress.md"
  printf '# Revisión final de rama\n\n%s\n\nVerdict: Needs fixes.\n' "$FINDING" > "$R/.superpowers/sdd/plan/final-review.md"
}

g init -q -b main
case $SC in
  p1|p2) reviewed_feature; shared_validation_fix ;;
  s1|s3) reviewed_feature; roadmap_conflict_merge ;;
  s2) reviewed_feature; architecture_doc ;;
  f1) sdd_task1_reviewed ;;
  f2) native_final_finding ;;
  *) die "escenario desconocido: $SC" ;;
esac

START="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: native\`, las Tasks 1 y 2 están hechas y la revisión final de rama volvió limpia, apuntada en \`tasks.md\`."
case $SC in
  p1) ASK="$START Después commiteaste \`$FIX\`, que comparte la validación de \`reserve\` y \`free\` (uno de los minors diferidos). Sigue con el paso 7: presenta la validación. El dev-lead no está." ;;
  p2) ASK="$START Ya presentaste la validación; el dev-lead preguntó por qué la validación se repetía en \`reserve\` y \`free\`, y commiteaste \`$FIX\`, que la comparte. Ahora el dev-lead responde: «He probado \`salas reservar Norte 1012\` y \`salas libres 1012\`: los dos dan el error de la franja. Vale, funciona, cierra la feature.»" ;;
  s1|s3) ASK="$START Después integraste \`develop\` en la rama (\`$FIX\`, un merge con un conflicto en la fila 0012 del roadmap, que resolviste). Sigue con el paso 7: presenta la validación. El dev-lead no está." ;;
  s2) ASK="$START Después commiteaste \`$FIX\`, que documenta la arquitectura de salas en \`.docs/sdd/architecture.md\`. Sigue con el paso 7: presenta la validación. El dev-lead no está." ;;
  f1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: subagent\` y la Task 1 está implementada. El revisor de la Task 1 devolvió el informe \`.superpowers/sdd/plan/task-1-review.md\`, con un Important. Abre la ronda de fix de la Task 1 y para en cuanto la ronda quede despachada o cerrada, sin empezar la Task 2. El dev-lead no está." ;;
  f2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: native\`, las Tasks 1 y 2 están hechas y la revisión final de rama devolvió el informe \`.superpowers/sdd/plan/final-review.md\`, con un Important. Haz la pasada de fix de la revisión final y para ahí, antes de la validación. El dev-lead no está." ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; cat "$R/$SPEC/tasks.md"; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
  echo "## diff desde el molde"; g diff --stat "$BEFORE"; g diff "$BEFORE" -- src/
} | subject_save
[ -f "$RUN/agent-prompts.txt" ] && subject_keep "$RUN/agent-prompts.txt" agent-prompts.txt
for f in "$R"/.docs/sdd/specs/*/walkthrough.md; do [ -f "$f" ] && subject_keep "$f" walkthrough.md; done
exit 0
