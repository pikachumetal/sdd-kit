#!/usr/bin/env bash
# Sujeto de la batería de sdd-feedback: el ticket de una sesión resumida en notas-sesion.md.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
subject_init "$1" "$2" "$4" sdd-feedback
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'

cp -r "$HERE/../using-sdd/mold-salas/." "$R/"
put_kit_marker "$MARKER"
case "$(cell Molde)" in
  sesion) cp -r "$HERE/mold-sesion/." "$R/" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
ticket="$(ls "$R"/.docs/sdd/kit-feedback/*.md 2>/dev/null | head -n 1)"
[ -n "$ticket" ] && subject_keep "$ticket" ticket.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros"; g ls-files --others --exclude-standard; } | subject_save
