#!/usr/bin/env bash
# Sujeto de la batería de sdd-propose: una petición de cambio, o un paso del flujo con sus artefactos ya escritos.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
FIX="$HERE/fixtures"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
# Si el kit que se prueba aún no tiene sdd-propose, la guarda comprueba la puerta de entrada
# y los pasos de spec y plan se piden a sdd-start-feature, donde vivían.
GUARD="$(cell Esperado | sed 's/^sdd-kit://')"
subject_init "$1" "$2" "$4" "$([ -d "$1/skills/$GUARD" ] && echo "$GUARD" || echo using-sdd)"
ASK="$(cell Petición)"
[ -d "$1/skills/sdd-propose" ] || ASK="${ASK//sdd-propose/sdd-start-feature}"
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
# Las carpetas del molde y de los fixtures son de 2026-10-08 o antes: la que crea el sujeto es la de fecha mayor.
newest=$(ls -d "$R"/.docs/sdd/specs/*/ 2>/dev/null | sort | tail -n 1)
case "$newest" in *"$F10"*|*"$F11"*|*task-000*|*patch-0007*) newest="" ;; esac
[ -n "$newest" ] && [ -f "$newest/spec.md" ] && subject_keep "$newest/spec.md" spec-new.md
[ -n "$newest" ] && [ -f "$newest/patch.md" ] && subject_keep "$newest/patch.md" patch-new.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --all --format='%h %d %s%n%b'; echo "## ficheros"; g ls-files --others --exclude-standard; echo "## package.json"; cat "$R/package.json"; } | subject_save
