#!/usr/bin/env bash
# Sujeto headless de la 0036 sobre el repo salas (CLI de la 0044), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   d1 paso 6 en Native: ejecutar la Task 1; el pre-commit corre la suite y un test ajeno a su «Verificación» falla (ticket 0061 §1)
#   b1 paso 4, spec por delegación: la fila 0012 tiene un THEN que solo se observa con la base de integración al día (ticket template 0016 §2)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
SC="$3"
SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
. "$REPO/.docs/sdd/specs/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
. "$REPO/.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/mold.sh"

legacy_import_test() {
  put tests/import.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve } from '../src/slots.js';

test('acepta la franja compacta del importador antiguo', () => {
  assert.deepStrictEqual(reserve('Sur', '1416'), { room: 'Sur', slot: '1416' });
});
EOF
}

changed_row() {
  put package.json <<'EOF'
{ "name": "salas", "type": "module", "scripts": { "test": "node --test" } }
EOF
  sed -i 's#^| 0012 | .*#| 0012 | `npm run check:changed` pasa `node --check` solo por los `.js` y `.mjs` que la rama cambia respecto a `develop`; si la rama no cambia ninguno, escribe «Nada que comprobar» y sale con 0 | dev-lead | `scripts/check-changed.mjs`, `package.json` | S |#' "$R/.docs/sdd/roadmap.md"
}

g init -q -b main
base_files
case $SC in
  d1) legacy_import_test; suite_hook; commit "feat: base de reservas de salas"
      g checkout -q -b develop; g checkout -q -b feature/0012
      spec_files; native_plan
      commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja." ;;
  b1) changed_row; commit "feat: base de reservas de salas"
      g checkout -q -b develop; g checkout -q -b feature/0012 ;;
  *) die "escenario desconocido: $SC" ;;
esac

case $SC in
  d1) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate): la spec y el plan están aprobados y la apertura está commiteada en \`feature/0012\`. El plan dice \`Ejecución: native\`. Estás en el paso 6: ejecuta la Task 1 y para en cuanto quede registrada como completa en el ledger, sin empezar la Task 2. El dev-lead no está." ;;
  b1) ASK="Invoca la skill sdd-kit:sdd-start-feature con la fila 0012 del roadmap, en la rama \`feature/0012\`, ya creada. Modo full, perfil delegate. El dev-lead eligió en la primera pregunta «apruebo la spec por delegación, nos vemos en la validación» y no está: toma tú las decisiones y lístalas. Escribe la spec, commitéala y para ahí, antes del plan." ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## ledger"; cat "$R/.superpowers/sdd/plan/progress.md" 2>/dev/null
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
} | subject_save
[ "$SC" = b1 ] && for f in "$R"/.docs/sdd/specs/*/spec.md; do [ -f "$f" ] && subject_keep "$f" spec.md; done
exit 0
