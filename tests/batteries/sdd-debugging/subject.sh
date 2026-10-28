#!/usr/bin/env bash
# Sujeto de la batería de sdd-debugging: un pre-commit que falla por el entorno que hereda del commit.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
subject_init "$1" "$2" "$4" sdd-debugging
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'
FAKE_SECRET=ghp_FAKE0231notarealtoken0000000000000

cp -r "$HERE/../using-sdd/mold-salas/." "$R/"
put_kit_marker "$MARKER"
case "$(cell Molde)" in
  hook) cp -r "$HERE/mold-hook/." "$R/"; chmod +x "$R/.githooks/pre-commit" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop
g config core.hooksPath .githooks
echo 'Revisar el aforo de la sala 3.' > "$R/notas.txt"
g add notas.txt

# El sujeto hereda el entorno de quien lanza: un RED que lo vuelque copiaría a las salidas un secreto real.
while IFS= read -r name; do unset "$name"; done < <(compgen -e | grep -E 'TOKEN|SECRET|PASSWORD|_KEY$')
export GITHUB_PERSONAL_ACCESS_TOKEN="$FAKE_SECRET"

MAX_TURNS="${MAX_TURNS:-40}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## secreto falso en el transcript"; grep -c "$FAKE_SECRET" "$JSONL"
  echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; } | subject_save
