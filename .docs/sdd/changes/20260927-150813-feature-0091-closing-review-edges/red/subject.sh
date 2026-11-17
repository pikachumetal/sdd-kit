#!/usr/bin/env bash
# Sujeto headless sobre el repo salas (feature 0012), con el lanzador de referencia y el hook que deniega Agent.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   e1 cierre: tras la revisión final, un commit del hilo en src/; el dev-lead valida y pide cerrar
#   e0 control de e1: sin commits tras la revisión final salvo el de tasks.md, que se revisa en el hilo
#   r1 pasada de fix de la revisión final con un Important real, y después el paso 7
#   r2 pasada de fix ya hecha y apuntada, y después un commit del hilo en src/: sí abre la re-revisión
#   l1 feature lite con la implementación terminada y sin revisión final
#   l2 como l1, pero el sujeto implementa la spec y sigue solo
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
case $3 in e1|e0) SKILL=sdd-end-feature ;; *) SKILL=sdd-start-feature ;; esac
subject_init "$1" "$2" "$4" "$SKILL"
SC="$3"
SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
. "$REPO/.docs/sdd/specs/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
. "$REPO/.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/mold.sh"
HOOK="$(cygpath -m "$REPO/.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs")"
SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Agent|Task","hooks":[{"type":"command","command":"node \"'"$HOOK"'\""}]}]}}'
FINAL_LINE='Revisión final: sdd-kit:effort-high + opus'

open_native_feature() {
  base_files; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files; native_plan
  commit "docs(0012): abrir la feature 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
}

mark_tasks_done() {
  sed -i 's/| 1 | Validar al reservar | pending |/| 1 | Validar al reservar | done |/; s/| 2 | Validar al consultar libres | pending |/| 2 | Validar al consultar libres | done |/' "$R/$SPEC/tasks.md"
}

# Tasks 1 y 2 hechas y la revisión final limpia apuntada con el commit que revisó.
reviewed_feature() {
  open_native_feature; native_tasks_done; mark_tasks_done
  REVIEWED=$(g rev-parse --short HEAD)
  final_review_recorded
  sed -i "s/^$FINAL_LINE, Ready (0 Critical, 0 Important, 2 Minor)\$/&, sobre $REVIEWED/" "$R/$SPEC/tasks.md"
  g commit -q --amend --no-edit -a
}

# El minor diferido de la validación repetida, resuelto por el hilo después de la revisión.
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

# El mensaje de `free`: recortado, es el Important real de la revisión final.
free_message() {
  sed -i "/^export function free/,/^}/ s/new Error('[^']*')/new Error('$1')/" "$R/src/slots.js"
}

FINDING='- **Important** · `src/slots.js:9` · `free('"'"'1012'"'"')` lanza «Franja no válida», sin «: usa HH-HH, p. ej. 10-12». La spec pide el mismo mensaje que al reservar, y el test de la Task 2 no lo detecta porque solo casa el principio. Fix: el mensaje literal en `free` y un test que lo compruebe entero.'

# Revisión final de Native con el Important, apuntada en tasks.md; el workspace sigue vivo.
final_review_with_finding() {
  open_native_feature; native_tasks_done; mark_tasks_done
  free_message 'Franja no válida'; g commit -q --amend --no-edit -a
  REVIEWED=$(g rev-parse --short HEAD)
  printf 'Final review: sdd-kit:effort-high + opus — Needs fixes (0 Critical, 1 Important, 0 Minor), informe en .superpowers/sdd/plan/final-review.md\n' >> "$R/.superpowers/sdd/plan/progress.md"
  printf '# Revisión final de rama\n\n%s\n\nVerdict: Needs fixes.\n' "$FINDING" > "$R/.superpowers/sdd/plan/final-review.md"
  printf '\n%s, Needs fixes (0 Critical, 1 Important, 0 Minor), sobre %s\n' "$FINAL_LINE" "$REVIEWED" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): revisión final de rama" "Apunta la revisión final en tasks.md."
}

# La pasada de fix hecha por el hilo, con su test, y el workspace borrado porque la revisión quedó limpia.
fix_pass_done() {
  free_message 'Franja no válida: usa HH-HH, p. ej. 10-12'
  cat >> "$R/tests/free-format.test.js" <<'EOF'

test('libres da el mensaje literal de la spec', () => {
  assert.throws(() => free('1012'), /^Error: Franja no válida: usa HH-HH, p\. ej\. 10-12$/);
});
EOF
  commit "fix(0012): mensaje literal de la franja en libres" "Pasada de fix de la revisión final: el Important del mensaje recortado, con su test RED→GREEN y la suite verde."
  PASS=$(g rev-parse --short HEAD)
  rm -rf "$R/.superpowers/sdd/plan"
  printf 'Pasada de fix: %s, 1 hallazgo RED→GREEN\n' "$PASS" >> "$R/$SPEC/tasks.md"
  commit "docs(0012): pasada de fix en tasks.md" "Apunta el commit de la pasada de fix de la revisión final."
}

lite_feature_open() {
  base_files; commit "feat: base de reservas de salas"
  g checkout -q -b develop; g checkout -q -b feature/0012
  spec_files
  sed -i 's/^mode: full$/mode: lite/' "$R/$SPEC/spec.md"
  sed -i 's/^## Aprobaciones$/### Estimación y esfuerzo\n\n- Tipo: backend\n- Estimación de implementación: 0,5 h\n\n## Aprobaciones/' "$R/$SPEC/spec.md"
  commit "docs(0012): abrir la feature 0012" "Spec lite aprobada de la validación de la franja."
}

lite_feature_done() {
  lite_feature_open
  task1_red; task1_code; task2_code
  commit "feat(0012): validar el formato de la franja al reservar y al consultar libres" "Las dos operaciones rechazan una franja que no casa con HH-HH, con el mensaje literal de la spec."
  IMPL=$(g rev-parse --short HEAD)
}

g init -q -b main
[ "$(cygpath -u "$(g rev-parse --show-toplevel)")" = "$(cygpath -u "$R")" ] || die "el molde no es su propio repo: $R"
case $SC in
  e1) reviewed_feature; shared_validation_fix ;;
  e0) reviewed_feature ;;
  r1) final_review_with_finding ;;
  r2) final_review_with_finding; fix_pass_done; shared_validation_fix ;;
  l1) lite_feature_done ;;
  l2) lite_feature_open ;;
  *) die "escenario desconocido: $SC" ;;
esac

NATIVE="la feature 0012 (perfil delegate) en \`feature/0012\`: el plan dice \`Ejecución: native\` y las Tasks 1 y 2 están hechas"
VALIDATED="El dev-lead responde a la validación: «He probado \`salas reservar Norte 1012\` y \`salas libres 1012\`: los dos dan el error de la franja. Vale, funciona, cierra la feature.»"
case $SC in
  e1) ASK="Invoca la skill sdd-kit:sdd-end-feature y cierra $NATIVE. La revisión final de rama volvió limpia, apuntada en \`tasks.md\`. Después commiteaste \`$FIX\`, que comparte la validación de \`reserve\` y \`free\` (uno de los minors diferidos), y presentaste la validación. $VALIDATED" ;;
  e0) ASK="Invoca la skill sdd-kit:sdd-end-feature y cierra $NATIVE. La revisión final de rama volvió limpia, apuntada en \`tasks.md\`, y presentaste la validación. $VALIDATED" ;;
  r1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. La revisión final de rama devolvió el informe \`.superpowers/sdd/plan/final-review.md\`, con un Important, y la apuntaste en \`tasks.md\`. Haz la pasada de fix de la revisión final y sigue con el paso 7: presenta la validación. El dev-lead no está." ;;
  r2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con $NATIVE. La revisión final de rama devolvió un Important y su pasada de fix quedó en \`$PASS\`, las dos apuntadas en \`tasks.md\`. Después commiteaste \`$FIX\`, que comparte la validación de \`reserve\` y \`free\`. Sigue con el paso 7: presenta la validación. El dev-lead no está." ;;
  l1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate, modo lite) en \`feature/0012\`: la spec está aprobada y la implementación está terminada y commiteada en \`$IMPL\`, con \`node --test\` en verde. Sigue hasta presentar la validación. El dev-lead no está." ;;
  l2) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate, modo lite) en \`feature/0012\`: la spec está aprobada y no hay nada implementado. Implementa la feature y sigue con el flujo. El dev-lead no está." ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; cat "$R/$SPEC/tasks.md" 2>/dev/null; echo "$ASK"; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
  echo "## diff desde el molde"; g diff --stat "$BEFORE"; g diff "$BEFORE" -- src/ tests/
} | subject_save
[ -f "$RUN/agent-prompts.txt" ] && subject_keep "$RUN/agent-prompts.txt" agent-prompts.txt
for f in "$R"/.docs/sdd/specs/*/walkthrough.md; do [ -f "$f" ] && subject_keep "$f" walkthrough.md; done
exit 0
