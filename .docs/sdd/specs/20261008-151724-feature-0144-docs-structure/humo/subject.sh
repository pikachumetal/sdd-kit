#!/usr/bin/env bash
# Sujeto del humo de la 0144: el molde salas pasado a la estructura de documentos 3.0.0.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
SC="$3"
HERE_TABLE="$HERE/battery.md"
cell() { node "$REPO/tests/headless/battery.mjs" field "$HERE_TABLE" "$SC" "$1" || { echo "sin el escenario $SC" >&2; exit 1; }; }
subject_init "$1" "$2" "$4" "$(cell Paso)"
ASK="$(cell Petición)"
cp -r "$REPO/tests/batteries/using-sdd/mold-salas/." "$R/"
mkdir -p "$R/.docs/sdd/steering"
mv "$R/.docs/sdd/constitution.md" "$R/.docs/sdd/steering/constitution.md"
mv "$R/.docs/sdd/roadmap.md" "$R/ROADMAP.md"
mv "$R/.docs/sdd/changelog.md" "$R/CHANGELOG.md"
mv "$R/.docs/sdd/specs" "$R/.docs/sdd/changes"
rm "$R/.docs/sdd/tech-stack.md" "$R/.docs/sdd/mission.md"
put_kit_marker '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}'
g init -q -b main
commit "feat: base del molde salas en la estructura 3.0.0"
g checkout -q -b develop
MAX_TURNS="${MAX_TURNS:-20}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## decision check"; node "$KIT/cli/bin/sdd.js" decision check --path "$R/.docs/sdd"; } | subject_save
