#!/usr/bin/env bash
# Sujeto de la batería de sdd-end-patch: un patch hecho y validado, listo para cerrar.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
subject_init "$1" "$2" "$4" sdd-end-patch
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "validation": {"mode": "field"}'
P8=".docs/sdd/specs/20261010-090000-patch-0008-cancel-missing"
ROW='| 0008 | Patch: si cancelo una reserva que no existe me dice «cancelada» igual | ⏳ |'

case "$(cell Molde)" in
  salas-patch) cp -r "$HERE/../using-sdd/mold-salas/." "$R/"; put_kit_marker "$MARKER" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
grep -q '^| 1 | Avisos por correo antes de la reserva | ⏳ |$' "$R/.docs/sdd/roadmap.md" || die "el roadmap del molde salas cambió: no hay dónde poner la fila 0008"
sed -i "s/^| 1 | Avisos por correo antes de la reserva | ⏳ |\$/&\n$ROW/" "$R/.docs/sdd/roadmap.md"
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop
g checkout -q -b feature/0008-cancel-missing
sed -i "s|  if (cmd === 'cancelar') return \`cancelada \${params\[0\]} \${params\[1\]}\`;|  if (cmd === 'cancelar') return bookings.some((b) => b.day === params[0] \&\& b.slot.startsWith(params[1])) ? \`cancelada \${params[0]} \${params[1]}\` : \`no hay reserva \${params[0]} \${params[1]}\`;|" "$R/src/app.js"
grep -q 'no hay reserva' "$R/src/app.js" || die "no se plantó el fix en src/app.js"
sed -i "s/run('cancelar', \['mar', '10:00'\]), 'cancelada mar 10:00'/run('cancelar', ['lun', '10:00']), 'cancelada lun 10:00'/" "$R/test/app.test.js"
printf "
test('cancelar sin reserva avisa', () => {
  assert.equal(run('cancelar', ['mie', '10:00']), 'no hay reserva mie 10:00');
});
" >> "$R/test/app.test.js"
put "$P8/patch.md" < "$HERE/patch-0008.md"
commit "fix: cancelar una reserva que no existe avisa (0008)"

MAX_TURNS="${MAX_TURNS:-40}" subject_launch "$ASK"
subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## roadmap en develop"; g show develop:.docs/sdd/roadmap.md 2>/dev/null | sed -n '/^## Próximo/,/^## Backlog/p;/^## Patches/,/^## Releases/p'; } | subject_save
