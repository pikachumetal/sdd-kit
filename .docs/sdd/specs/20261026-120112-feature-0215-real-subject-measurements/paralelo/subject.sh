#!/usr/bin/env bash
# Sujeto de la reproducción en paralelo de la 0215 (ticket del patch 0087 §1): dos sujetos a la vez, ¿lee cada uno su molde?
# El título del patch 0013 lleva la etiqueta del sujeto: citar el de otro, o no encontrarlo, es acabar fuera del molde.
# Lo lanza tests/headless/run.sh con MAX_PARALLEL=2.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-explore
g init -q -b main
put_kit_marker '"ids": {"mode": "sequence"}'
put .docs/sdd/roadmap.md <<'MD'
# Roadmap

## Patches

| # | Ítem | Estado |
| --- | --- | --- |
| 0013 | Patch: ajuste del listado | 🔄 |
MD
put ".docs/sdd/specs/20260901-100000-patch-0013-list-adjust/patch.md" <<MD
# Patch 0013 — ajuste $LABEL

Ajuste del orden del listado de salas.
MD
commit "docs: roadmap y patch 0013"
ASK='¿Qué hay en el patch 0013 de este proyecto? Dime su título literal.'
MAX_TURNS=20 subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git log"; g log --oneline --all; } | subject_save
