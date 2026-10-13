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
P10_3=".docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md"

cp -r "$HERE/../using-sdd/mold-salas/." "$R/"
put_kit_marker "$MARKER"
# La capa 3.0.0 sustituye al roadmap 2.x por ROADMAP.md y debt.md; la propuesta cuelga de changes/.
layer_3() {
  [ -f "$R/.docs/sdd/roadmap.md" ] || die "el molde salas cambió: no hay roadmap.md que retirar"
  rm "$R/.docs/sdd/roadmap.md"
  [ -f "$R/.docs/sdd/changelog.md" ] || die "el molde salas cambió: no hay changelog.md 2.x que retirar"
  rm "$R/.docs/sdd/changelog.md"
  cp -r "$HERE/mold-salas-3/." "$R/"
  put "$P10_3" < "$HERE/proposal-0010.md"
}

# salas-3 sin la exportación a CSV ni su fila de deuda: m5 apunta la exportación como fila nueva.
layer_3_plain() {
  layer_3
  cp -r "$HERE/mold-salas-3-plain/." "$R/"
}

# La capa del informe de QA, con las versiones del changelog antes de la 0.3.0 del molde.
layer_qa() {
  grep -qF '## [0.3.0]' "$R/.docs/sdd/changelog.md" || die "el changelog del molde salas cambió: no hay dónde poner las versiones"
  cp -r "$HERE/mold-salas-qa/." "$R/"
  local versions changelog="$R/.docs/sdd/changelog.md"
  versions="$(sed -n '/^## \[1\.4\.1\]/,$p' "$HERE/mold-salas-3/CHANGELOG.md")"
  awk -v v="$versions" 'index($0, "## [0.3.0]") == 1 { print v; print "" } { print }' "$changelog" > "$changelog.new" && mv "$changelog.new" "$changelog"
}

case "$(cell Molde)" in
  salas) ;;
  salas-3) layer_3 ;;
  salas-3-plain) layer_3_plain ;;
  salas-qa) layer_qa ;;
  salas-0013)
    grep -q '^| 1 | Avisos por correo antes de la reserva | ⏳ |$' "$R/.docs/sdd/roadmap.md" || die "el roadmap del molde salas cambió: no hay dónde poner la fila 0013"
    sed -i 's/^| 1 | Avisos por correo antes de la reserva | ⏳ |$/&\n| 0013 | Aviso semanal a los responsables — `proposal: 0010`, tras 0012 | ⏳ |/' "$R/.docs/sdd/roadmap.md"
    put "$P10/proposal.md" < "$HERE/proposal-0010.md" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
keep_if_present() { [ -f "$1" ] && subject_keep "$1" "$2"; }
keep_if_present "$R/.docs/sdd/roadmap.md" roadmap.md
keep_if_present "$R/ROADMAP.md" roadmap-3.md
keep_if_present "$R/.docs/sdd/steering/debt.md" debt.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros"; g ls-files --others --exclude-standard; } | subject_save
