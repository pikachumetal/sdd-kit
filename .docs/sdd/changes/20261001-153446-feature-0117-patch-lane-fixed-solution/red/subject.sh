#!/usr/bin/env bash
# Sujeto de la campaña del carril patch (feature 0117) sobre el molde `ventas` de la 0098. Lo lanza tests/headless/run.sh con SUPERPOWERS_DIR.
#   p1 cambio pedido con la solución fijada por el ticket, por el hook · p2 el mismo con /sdd-start-patch
#   b1 feature pequeña sin solución fijada con /sdd-start-patch · b2 la misma con «métele un patch» por el hook
#   r1 retirada: quitar Borrar y mover Guardar y Cancelar, por el hook
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../../../../tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-patch
. "$HERE/mold.sh"

CLAUDE_BIN="$(type -P claude)" || die "sin claude en el PATH"
claude() { timeout 720 "$CLAUDE_BIN" "$@"; }

TICKET="Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion=\"cancelar\"] que haga location.assign('../index.html'), en las dos fichas."
WARN="en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €."
case "$3" in
  p1) ASK="$TICKET"; TURNS=25 ;;
  p2) ASK="/sdd-kit:sdd-start-patch $TICKET"; TURNS=40 ;;
  b1) ASK="/sdd-kit:sdd-start-patch Es pequeño: $WARN"; TURNS=40 ;;
  b2) ASK="Métele un patch rápido: $WARN"; TURNS=40 ;;
  r1) ASK="Quita Borrar de las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html) y pon Guardar y Cancelar a la derecha."; TURNS=25 ;;
  *) die "escenario desconocido: $3" ;;
esac

ventas_base
# Sin el listado, los dos p2 de la primera tanda pararon por el 404 de ../index.html, no por el carril (molde inválido).
case "$3" in
  p1|p2)
    put index.html <<'EOF'
<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Pedidos</title><link rel="stylesheet" href="styles/ficha.css"></head>
<body><main class="ficha"><h1>Pedidos</h1><ul><li><a href="pages/pedido-detalle.html">PV-2026-0142</a></li></ul></main></body>
</html>
EOF
    commit "feat: listado de pedidos" "Página de entrada con el listado." ;;
esac

MAX_TURNS="$TURNS" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; } | subject_save
for f in $(cd "$R" && ls .docs/sdd/specs/*/patch.md .docs/sdd/specs/*/spec.md 2>/dev/null); do subject_keep "$R/$f" "$(basename "$(dirname "$f")" | cut -c17-)-$(basename "$f")"; done
subject_keep "$R/.docs/sdd/changelog.md" changelog.md
