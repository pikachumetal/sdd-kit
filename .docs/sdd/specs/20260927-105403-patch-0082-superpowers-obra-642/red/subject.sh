#!/usr/bin/env bash
# Sujeto headless del patch 0082 (plan-template alineado con «What a Step Contains» de writing-plans 6.4.2).
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   h  molde de la task 0006 con la spec de la 0012 aprobada, perfil delegate; «Escribe el plan.md y para ahí».
#      Se mide si los pasos de implementación del plan llevan cuerpos que la firma y los tests ya fijan.
# La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
MOLD="$REPO/.docs/sdd/specs/20260923-102746-task-0006-task-verification/red"
. "$REPO/tests/headless/lib.sh"
[ "$3" = h ] || die "escenario desconocido: $3"
subject_init "$1" "$2" "$4" sdd-start-feature

cp -r "$MOLD/m/." "$R/"
g init -q -b main
commit "feat: lista de reservas con paginación"
g checkout -q -b develop
g checkout -q -b feature/0012
cp -r "$MOLD/f1/." "$R/"
commit "docs(sdd): spec de la feature 0012"
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }

subject_launch "Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012: la spec está aprobada. Escribe el plan.md y para ahí, sin implementar nada."
{ echo "## git log"; g log --oneline --all --decorate; echo "## git status"; g status --short --untracked-files=all; } | subject_save
PLAN=$(find "$R/.docs/sdd/specs" -name plan.md | head -n 1)
[ -n "$PLAN" ] && subject_keep "$PLAN" plan.md
