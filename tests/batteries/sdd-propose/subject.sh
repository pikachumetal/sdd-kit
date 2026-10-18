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
  reservas|reservas-main|reservas-plan) ;;
  # La 0011 implementa los responsables de sala que una fila pendiente (0009) prometía, y docs/config.md apunta a esa fila.
  # El puntero va fuera de los documentos que el paso 1 lee: en PRODUCT.md lo vieron 2 de 2 sin buscarlo (red-v1 del patch 0174).
  reservas-puntero)
    sed -i 's/^| 0011 |/| 0009 | **Responsables de sala**: quién responde de cada sala y qué puede hacer | ⏳ |\n| 0011 |/' "$R/.docs/sdd/roadmap.md"
    printf '\nConfiguración: [docs/config.md](docs/config.md).\n' >> "$R/README.md"
    mkdir -p "$R/docs"
    printf '%s\n' '# Configuración' '' '- `data/`: ficheros de datos de la herramienta. Hoy no hay ninguno.' '- Responsables de sala: aún no hay; quién es cada uno y su fichero los define la 0009.' > "$R/docs/config.md" ;;
  reservas-sin-ops) rm "$R/.docs/sdd/operations.md" ;;
  # La 0012 retira anular: la nombran el README, la guía (con tope de palabras) y la capacidad, y la guía apunta a la fila.
  reservas-topes)
    mkdir -p "$R/.docs/sdd/capabilities" "$R/docs"
    cp "$FIX/bookings-capability.md" "$R/.docs/sdd/capabilities/bookings.md"
    cp "$FIX/guia.md" "$R/docs/guia.md"
    cp "$FIX/words.test.js" "$R/test/words.test.js"
    printf '\nComandos: `cancelar` y `anular`; guía en [docs/guia.md](docs/guia.md).\n' >> "$R/README.md"
    sed -i 's/^| 1 |/| 0012 | **Retirar anular**: el comando anular desaparece | ⏳ |\n| 1 |/' "$R/.docs/sdd/roadmap.md" ;;
  reservas-adr) mkdir -p "$R/.docs/sdd/decisions"; cp "$FIX/adr-0003-bookings-in-memory.md" "$R/.docs/sdd/decisions/0003-bookings-in-memory.md" ;;
  reservas-adr6) cp -r "$FIX/decisions-6" "$R/.docs/sdd/decisions" ;;
  reservas-adr-docs) mkdir -p "$R/.docs/sdd/decisions"; sed 's#  - src/\*\*#  - docs/**#' "$FIX/adr-0003-bookings-in-memory.md" > "$R/.docs/sdd/decisions/0003-bookings-in-memory.md" ;;
  # Una sala más rompe el test de libres: el gate de cierre sale en rojo.
  reservas-rojo) sed -i "s/const rooms = \['Norte', 'Sur'\];/const rooms = ['Norte', 'Sur', 'Este'];/" "$R/src/app.js" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
# El fallo de a2 y a3: findBooking busca solo por sala, y «cancelar Norte mar» cancela la reserva del lunes.
case "$SC" in a2|a3|d1|p3) sed -i 's/b.room === room \&\& b.day === day \&\& /b.room === room \&\& /' "$R/src/app.js" ;; esac
g init -q -b main
commit "feat: base del molde"
[ "$(cell Molde)" = reservas-main ] || g checkout -q -b develop

approved_spec() { sed -e 's/^status: draft/status: approved/' -e 's/approved_at: null/approved_at: 2026-10-08/' -e 's/| dev-lead | Laura | | pendiente |/| dev-lead | Laura | 2026-10-08 | aprobada |/' "$FIX/spec-0010.md"; }
without_who() { sed -e 's/ y quién canceló//' -e 's/ cancelada por Ana con/ cancelada con/' -e 's/ — sala ocupada — Ana»/ — sala ocupada»/' -e '/^2\. El listado de canceladas enseña sala/d'; }

case "$SC" in
  a1) echo '{"merge": {"push": true}}' | put .docs/sdd/sdd-kit.local.json ;;
  a2) export TURN2='Sí, como patch.' ;;
  d1) [ "${PHASE:-red}" = red ] && export TURN2='Sí, como patch.' ;;
  k1|k3|k4) export TURN2='Sí.' ;;
  k5) export TURN2='Sí.'
    "$NODE" -e "const f=process.argv[1],fs=require('fs'),j=JSON.parse(fs.readFileSync(f,'utf8'));j.merge={into:'develop',noFf:true,removeWorktree:false,push:false};fs.writeFileSync(f,JSON.stringify(j,null,2)+'\n')" "$R/.docs/sdd/sdd-kit.json"
    commit "chore: política de merge"
    g checkout -q -b feature/bump-node-22-18 ;;
  s1|c1) g checkout -q -b feature/0010-cancel-reason ;;
  sp1) g checkout -q -b feature/0012-retire-void ;;
  g1) g checkout -q -b feature/0010-cancel-reason; put "$F10/spec.md" < "$FIX/spec-0010.md" ;;
  r1|t1) g checkout -q -b feature/0011-void-others; put "$F11/spec.md" < "$FIX/spec-0011.md" ;;
  p1|p2) g checkout -q -b feature/0010-cancel-reason; approved_spec | without_who | put "$F10/spec.md" ;;
  # La 0010 con el anexo del Art. I: dos reglas de un comando que se funde en cancelar, cada una con su destino.
  pl2) g checkout -q -b feature/0010-cancel-reason; { approved_spec | without_who; cat "$FIX/annex-0010.md"; } | put "$F10/spec.md" ;;
  # La 0010 con una dependencia nueva: el plan declara el eje Arquitectura de la revisión final.
  ax) g checkout -q -b feature/0010-cancel-reason; approved_spec | without_who | sed 's/^El motivo se guarda con la reserva cancelada;/El motivo se valida con la librería `zod`, una dependencia nueva en `dependencies` de `package.json`. &/' | put "$F10/spec.md" ;;
esac

case "$SC" in
  g1|r1) MAX_TURNS="${MAX_TURNS:-15}" ;;
  d1|p3) MAX_TURNS="${MAX_TURNS:-60}" ;;
  a1|a3|a4|k2|l1|pl1|pt1|x1|c1|t1|pb|pb-c|adr|adr-c) MAX_TURNS="${MAX_TURNS:-25}" ;;
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
[ -n "$newest" ] && [ -f "$newest/plan.md" ] && subject_keep "$newest/plan.md" plan-new.md
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --all --format='%h %d %s%n%b'; echo "## develop"; g log develop --oneline; echo "## ficheros"; g ls-files --others --exclude-standard; echo "## package.json"; cat "$R/package.json"; } | subject_save
