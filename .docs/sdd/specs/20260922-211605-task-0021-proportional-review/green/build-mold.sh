#!/usr/bin/env bash
# Construye el repo del molde m1 en <destino>: develop con la base y feature/0007 con las dos tasks.
# Uso: build-mold.sh <destino>
set -eu
BASE="$(cd "$(dirname "$0")" && pwd)"; M="$BASE/m1"; RUN="$1"
SP="${SP_SCRIPTS:-$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/6.4.1/skills/subagent-driven-development/scripts}"
TRAILER="Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
rm -rf "$RUN"; mkdir -p "$RUN"; cp -r "$M/base/." "$RUN/"
g() { git -C "$RUN" -c user.email=dev@example.com -c user.name=Dev "$@"; }
commit() { g add -A; g commit -q -m "$1" -m "$2" -m "$TRAILER"; }
printf '.superpowers/\n' > "$RUN/.gitignore"
g init -q -b main; commit "feat(slots): huecos con solape" "Base de la agenda: parseSlot e isOverlapping."
g checkout -q -b develop
g checkout -q -b feature/0007
cp -r "$M/t1/." "$RUN/"; commit "feat(slots): duración en minutos de un hueco" "Task 1 de la 0007: slotMinutes."
cp -r "$M/t2red/." "$RUN/"; commit "test(summary): tests RED de la task 2" "Escritos por el hilo principal desde los THEN de la spec."
cp -r "$M/t2impl/." "$RUN/"
awk '{print} /^  assert.equal\(formatWeekSummary\(slots\), .2026-10-05: 2 huecos/{getline; print; print ""; next}' "$RUN/test/summary.test.js" > "$RUN/t.tmp" && mv "$RUN/t.tmp" "$RUN/test/summary.test.js"
commit "feat(summary): resumen semanal de huecos" "Task 2 de la 0007: formatWeekSummary, con una línea en blanco que exigía el lint en el test."
PLAN=".docs/sdd/specs/20260920-100000-task-0007-week-summary/plan.md"
cd "$RUN"
WS="$(bash "$SP/sdd-workspace" "$PLAN")"
BRIEF="$(bash "$SP/task-brief" "$PLAN" 2 | tail -1)"
T2BASE="$(git rev-parse HEAD~1)"; T2HEAD="$(git rev-parse HEAD)"
bash "$SP/review-package" "$PLAN" "$T2BASE" "$T2HEAD" "$WS/review-task2.diff" >/dev/null
bash "$SP/review-package" "$PLAN" "$(git merge-base develop HEAD)" "$T2HEAD" "$WS/review-final.diff" >/dev/null
cp "$BASE/report-task2.md" "$WS/task-2-report.md"
echo "WS=$WS"; echo "BRIEF=$BRIEF"; echo "T2BASE=$T2BASE"; echo "T2HEAD=$T2HEAD"; echo "FINALBASE=$(git merge-base develop HEAD)"
