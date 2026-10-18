#!/usr/bin/env bash
# Sujeto de la batería de sdd-upgrade: una petición de battery.md sobre el molde salas de using-sdd, con migraciones pendientes.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
# En el RED el kit aún no trae sdd-upgrade: la guarda de subject_init mira using-sdd.
SKILL=sdd-upgrade; [ -f "$1/skills/sdd-upgrade/SKILL.md" ] || SKILL=using-sdd
subject_init "$1" "$2" "$4" "$SKILL"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "updated": "2026-10-01", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'

# El kit propio de m2: la migración de juguete no puede llegar a los sujetos de los demás escenarios, que comparten KIT_DIR.
kit_with_toy_migration() {
  cp -r "$KIT/." "$RUN/kit/"
  local dir="$RUN/kit/skills/sdd-upgrade/references/migrations"
  [ -d "$dir" ] || dir="$RUN/kit/skills/sdd-init/references/migrations"
  cp "$HERE/v2.3.5.md" "$dir/"
  KIT="$(cygpath -m "$RUN/kit" 2>/dev/null || echo "$RUN/kit")"
}

cp -r "$HERE/../using-sdd/mold-salas/." "$R/"
case "$(cell Molde)" in
  salas) echo "{\"version\": \"2.3.3\", $MARKER}" | put .docs/sdd/sdd-kit.json ;;
  salas-legacy)
    mkdir -p "$RUN/kit"; kit_with_toy_migration
    echo "{\"version\": \"2.3.4\", $MARKER}" | put .docs/sdd/sdd-kit.json
    printf '# Funcional heredado\n\nLas reservas son por franja de una hora.\n' | put .docs/sdd/legacy.md ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde salas"
g checkout -q -b develop

case "$SC" in
  o1) TURN2="No, ahora no. Sigue con lo del filtro." ;;
  o2) TURN2="Sí, actualízalo." ;;
esac
export TURN2="${TURN2:-}"

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json"; } | subject_save
