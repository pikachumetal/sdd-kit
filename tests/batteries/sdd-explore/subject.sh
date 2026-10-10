#!/usr/bin/env bash
# Sujeto de la batería de sdd-explore: una pregunta sobre el proyecto, que puede acabar en trabajo.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
# Si el kit que se prueba aún no tiene la skill esperada, la guarda comprueba la puerta de entrada.
GUARD="$(cell Esperado | sed 's/^sdd-kit://')"
[ -d "$1/skills/$GUARD" ] || GUARD=using-sdd
subject_init "$1" "$2" "$4" "$GUARD"
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}'

case "$(cell Molde)" in
  salas) cp -r "$HERE/../using-sdd/mold-salas/." "$R/"; put_kit_marker "$MARKER" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
echo '{"type": "module", "engines": {"node": ">=22"}}' > "$R/package.json"
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros"; g ls-files --others --exclude-standard; echo "## package.json"; cat "$R/package.json"; } | subject_save
