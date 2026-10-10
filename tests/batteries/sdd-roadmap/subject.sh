#!/usr/bin/env bash
# Sujeto de la batería de sdd-roadmap: algo que apuntar en el roadmap, o el prompt de arranque de una fila.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
subject_init "$1" "$2" "$4" sdd-roadmap
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}'
P10=".docs/sdd/specs/20261001-090000-proposal-0010-reports"

cp -r "$HERE/../using-sdd/mold-salas/." "$R/"
put_kit_marker "$MARKER"
case "$(cell Molde)" in
  salas) ;;
  salas-0013)
    sed -i 's/^| 1 | Avisos por correo antes de la reserva | ⏳ |$/&\n| 0013 | Aviso semanal a los responsables — `proposal: 0010`, tras 0012 | ⏳ |/' "$R/.docs/sdd/roadmap.md"
    put "$P10/proposal.md" < "$HERE/proposal-0010.md" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros"; g ls-files --others --exclude-standard; } | subject_save
