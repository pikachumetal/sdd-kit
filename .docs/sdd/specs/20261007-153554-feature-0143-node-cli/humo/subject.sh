#!/usr/bin/env bash
# Sujeto del humo de la 0143: una skill editada ejecuta su verbo de la CLI sobre el molde salas.
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
[ "$SC" = h7 ] && mkdir -p "$R/.docs/sdd/capabilities" && cp "$REPO/cli/test/fixtures/capabilities/bookings.md" "$R/.docs/sdd/capabilities/"
put_kit_marker '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}'
g init -q -b main
commit "feat: base del molde salas"
g checkout -q -b develop
MAX_TURNS="${MAX_TURNS:-15}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; } | subject_save
