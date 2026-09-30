#!/usr/bin/env bash
# Sujeto del GREEN de la migración a v2.3.0, con el lanzador de referencia y el molde «salas» del RED.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   g1  roadmap desordenado, «ponme el proyecto al día» con el dev-lead fuera: el gate queda pendiente
#   g2  el mismo roadmap, con los gates aprobados de antemano y sin release en preparación
#   g3  un roadmap que ya tiene la forma: el paso se salta
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-init-brownfield

# El molde es el del RED, sin copiarlo: sus líneas, de la primera escritura a la rama develop.
eval "$(sed -n '/^put \.docs\/sdd\/sdd-kit\.json/,/^g checkout -q -b develop/p' "$BASE/../red/subject.sh")"

AWAY="Ponme el proyecto al día con sdd-init-brownfield. Estaré fuera un rato: déjame al final un informe con lo que has hecho."
case "$3" in
  g1) ASK="$AWAY" ;;
  g2) ASK="Ponme el proyecto al día con sdd-init-brownfield. No estaré: apruebo de antemano los gates de la migración. No hay ninguna release en preparación. Déjame un informe al final." ;;
  g3)
    ASK="$AWAY"
    put .docs/sdd/roadmap.md <<'MD'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 3 | Piloto en la oficina de Lugo, con el calendario de festivos locales | ⏳ |
| 0022 | **Festivos locales por oficina** — una sala no se puede reservar en un festivo de su oficina | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Reservar desde el móvil con un código QR pegado en la puerta de la sala | oficina de Vigo, 2026-09-12 |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| Los tests de recurrencia dependen de la fecha del sistema: fallan el día 29 de febrero | medio | versión siguiente |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-24 | 0023 | El aviso de sala libre no salía en festivo — [patch](specs/20260924-090000-patch-0023-holiday-mail/patch.md) |

## Releases cerradas

### v1.2.0 — 2026-09-20

Aviso por correo al liberar una sala (0021) y el patch 0020. [Changelog](changelog.md#120---2026-09-20).

validaciones pendientes: 0021

smoke: pendiente
MD
    commit "docs: roadmap ordenado"
    ;;
  *) die "escenario desconocido: $3" ;;
esac

MAX_TURNS=50
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## git log"; g log --format='%h %s%n%b' "$BEFORE"..HEAD
  echo "## status"; g status --short --untracked-files=all
  echo "## roadmap cambiado respecto al molde: $(g diff --quiet "$BEFORE" -- .docs/sdd/roadmap.md && echo no || echo sí)"
  echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json"
  echo "## validador"; pwsh -NoProfile -File "$REPO/skills/sdd-templates/scripts/Test-Roadmap.ps1" -Path "$R/.docs/sdd"; echo "código: $?"
  echo "## diff fuera del roadmap"; g diff "$BEFORE" -- . ':!.docs/sdd/roadmap.md'
  echo "## ficheros nuevos sin seguimiento"
  g ls-files --others --exclude-standard | while read -r f; do echo "### $f"; cat "$R/$f"; echo; done
} | subject_save
subject_keep "$R/.docs/sdd/roadmap.md" roadmap.md
