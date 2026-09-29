#!/usr/bin/env bash
# Sujeto headless del patch 0110: paso 6 en Native, con PowerShell como shell principal y la
# Verificación de la Task 2 silenciosa (un script de asserts que no imprime nada si pasa).
# Uso (desde run.sh de tests/headless): subject.sh <kit> <etiqueta> <escenario> <salida>
#   w  ejecutar las Tasks 1 y 2 en Native y parar cuando la Task 2 quede registrada en el ledger
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
. "$BASE/../../../../../tests/headless/lib.sh"
MOLD_NAME=salas
subject_init "$1" "$2" "$4" sdd-start-feature
SPEC=.docs/sdd/specs/20260923-100000-feature-0012-franja
. "$BASE/../../20260923-191212-task-0044-commit-per-milestone/green/mold.sh"

g init -q -b main; g config core.autocrlf false
base_files
sed -i 's/"version": "2.0.0"/"version": "2.1.0"/' "$R/.docs/sdd/sdd-kit.json"
# El entorno del dev-lead del ticket: el sujeto va sin la configuración del usuario (SUPERPOWERS_DIR).
put CLAUDE.md <<'EOF'
# salas

## Entorno

- Windows 11. Shell principal: herramienta `PowerShell` (pwsh 7+). Bash (Git Bash) solo para scripts POSIX puntuales.
EOF
commit "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0012
spec_files; plan_files
sed -i 's/task-0012-franja/feature-0012-franja/' "$R/$SPEC/spec.md" "$R/$SPEC/plan.md"
sed -i 's/^## Restricciones globales$/**Ejecución**: native, porque son dos tasks cortas y encadenadas sobre el mismo fichero\n\n## Restricciones globales/' "$R/$SPEC/plan.md"
sed -i 's/^- Implementadores y revisores Sonnet, effort medio\.$/- Subagentes: Sonnet con effort medio de suelo./' "$R/$SPEC/plan.md"
sed -i 's/^\*\*Modelo\*\*: Sonnet, effort medio$/**Modelo**: la sesión (Native)/' "$R/$SPEC/plan.md"
sed -i 's/, escritos antes de despachar y sin commitear: van en el commit de la task$/; Native: TDD del propio hilo/' "$R/$SPEC/plan.md"
sed -i 's/uno solo, al quedar limpia su revisión\./uno solo por task./' "$R/$SPEC/plan.md"
# Task 2: la comprobación es un script de asserts, como `tsc --noEmit`: sin salida si pasa.
sed -i 's#`tests/free-format.test.js`; Native#`tests/free-format.check.mjs` (script con `node:assert`, sin salida si pasa); Native#; s#`node --test tests/free-format.test.js`#`node tests/free-format.check.mjs`#' "$R/$SPEC/plan.md"
commit "docs(0012): abrir la feature 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."

ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate): la spec y el plan están aprobados y la apertura está commiteada en \`feature/0012\`. El plan dice \`Ejecución: native\`. Estás en el paso 6: ejecuta la Task 1 y la Task 2 y para en cuanto la Task 2 quede registrada como completa en el ledger, antes de la revisión final de rama. El dev-lead no está."
ORPHAN_BEFORE=$(sha256sum /c/progress.md /d/progress.md 2>/dev/null)
subject_launch "$ASK"
{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## git log"; g log --format='%h %s' --all
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## ledger"; cat "$R/.superpowers/sdd/plan/progress.md" 2>/dev/null || echo "(sin ledger en el workspace)"
  echo "## workspace"; ls -1 "$R/.superpowers/sdd/plan" 2>/dev/null
  echo "## ledgers en la raíz de C: y D: (cambio frente al arranque)"
  [ "$(sha256sum /c/progress.md /d/progress.md 2>/dev/null)" = "$ORPHAN_BEFORE" ] && echo "sin cambios" || sha256sum /c/progress.md /d/progress.md 2>&1
  echo "## tests en disco"; ls -1 "$R/tests"
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md"
} 2>&1 | subject_save
