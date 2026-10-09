#!/usr/bin/env bash
# Sujeto de la batería de sdd-propose: una petición de cambio, o un paso del flujo con sus artefactos ya escritos.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
FIX="$HERE/fixtures"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
# En el RED la skill que se mide aún no existe: la guarda comprueba la copia del kit con la puerta de entrada.
GUARD="$(cell Esperado | sed 's/^sdd-kit://')"
case "${PHASE:-red}" in red*) GUARD=using-sdd ;; esac
subject_init "$1" "$2" "$4" "$GUARD"
ASK="$(cell Petición)"
# En el RED, los pasos de spec y plan viven en sdd-start-feature.
case "${PHASE:-red}" in red*) ASK="${ASK//sdd-propose/sdd-start-feature}" ;; esac
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native"'
F10=".docs/sdd/specs/20261008-100000-feature-0010-cancel-reason"
F11=".docs/sdd/specs/20261008-110000-feature-0011-void-others"

cp -r "$HERE/mold-reservas/." "$R/"
put_kit_marker "$MARKER"
case "$(cell Molde)" in
  reservas|reservas-main) ;;
  reservas-sin-ops) rm "$R/.docs/sdd/operations.md" ;;
  # Una sala más rompe el test de libres: el gate de cierre sale en rojo.
  reservas-rojo) sed -i "s/const rooms = \['Norte', 'Sur'\];/const rooms = ['Norte', 'Sur', 'Este'];/" "$R/src/app.js" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
# El fallo de a2 y a3: findBooking busca solo por sala, y «cancelar Norte mar» cancela la reserva del lunes.
case "$SC" in a2|a3) sed -i 's/b.room === room \&\& b.day === day \&\& /b.room === room \&\& /' "$R/src/app.js" ;; esac
g init -q -b main
commit "feat: base del molde"
[ "$(cell Molde)" = reservas-main ] || g checkout -q -b develop

approved_spec() { sed -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$FIX/spec-0010.md"; }
without_who() { sed -e 's/ y quién canceló//' -e 's/ cancelada por Ana con/ cancelada con/' -e 's/ — sala ocupada — Ana»/ — sala ocupada»/' -e '/^2\. El listado de canceladas enseña sala/d'; }

case "$SC" in
  a1) echo '{"merge": {"push": true}}' | put .docs/sdd/sdd-kit.local.json ;;
  a2) export TURN2='Sí, como patch.' ;;
  k1|k3|k4) export TURN2='Sí.' ;;
  s1|c1) g checkout -q -b feature/0010-cancel-reason ;;
  g1) g checkout -q -b feature/0010-cancel-reason; put "$F10/spec.md" < "$FIX/spec-0010.md" ;;
  r1) g checkout -q -b feature/0011-void-others; put "$F11/spec.md" < "$FIX/spec-0011.md" ;;
  p1|p2) g checkout -q -b feature/0010-cancel-reason; approved_spec | without_who | put "$F10/spec.md" ;;
esac

case "$SC" in
  g1|r1) MAX_TURNS="${MAX_TURNS:-15}" ;;
  a1|a3|a4|k2|l1|x1|c1) MAX_TURNS="${MAX_TURNS:-25}" ;;
  *) MAX_TURNS="${MAX_TURNS:-40}" ;;
esac

MAX_TURNS="$MAX_TURNS" subject_launch "$ASK"
for kept in spec plan tasks; do
  for folder in "$F10" "$F11"; do
    [ -f "$R/$folder/$kept.md" ] && subject_keep "$R/$folder/$kept.md" "$kept.md"
  done
done
newspec=$(find "$R/.docs/sdd/specs" -name spec.md -newer "$R/README.md" 2>/dev/null | grep -v -e "$F10" -e "$F11" | head -n 1)
[ -n "$newspec" ] && subject_keep "$newspec" spec-new.md
newpatch=$(find "$R/.docs/sdd/specs" -name patch.md -newer "$R/README.md" 2>/dev/null | head -n 1)
[ -n "$newpatch" ] && subject_keep "$newpatch" patch-new.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --all --format='%h %d %s%n%b'; echo "## ficheros"; g ls-files --others --exclude-standard; echo "## package.json"; cat "$R/package.json"; } | subject_save
