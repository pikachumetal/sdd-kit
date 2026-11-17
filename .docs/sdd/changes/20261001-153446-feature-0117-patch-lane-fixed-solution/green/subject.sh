#!/usr/bin/env bash
# GREEN de la campaña del carril patch (feature 0117) sobre el molde `ventas` de red/. Lo lanza tests/headless/run.sh con SUPERPOWERS_DIR.
#   p2 petición cerrada con /sdd-start-patch, recorrida · c2 texto dado literal con /sdd-start-patch, recorrido
#   d1 petición que deja sin fijar algo visible · b1 puerta trasera con /sdd-start-patch (control) · k1 bug determinista (control)
#   r2 retirada recorrida con /sdd-start-patch · r3 retirada que añade algo (control)
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../../../../tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-patch
. "$HERE/../red/mold.sh"

CLAUDE_BIN="$(type -P claude)" || die "sin claude en el PATH"
claude() { timeout 720 "$CLAUDE_BIN" "$@"; }

TICKET="Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion=\"cancelar\"] que haga location.assign('../index.html'), en las dos fichas."
case "$3" in
  p2) ASK="/sdd-kit:sdd-start-patch $TICKET"; TURNS=40 ;;
  c2) ASK="/sdd-kit:sdd-start-patch Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas."; TURNS=40 ;;
  d1) ASK="/sdd-kit:sdd-start-patch Ticket VEN-32: en las dos fichas, Cancelar tiene que pedir confirmación antes de volver al listado de pedidos (../index.html)."; TURNS=40 ;;
  b1) ASK="/sdd-kit:sdd-start-patch Es pequeño: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €."; TURNS=25 ;;
  k1) ASK="/sdd-kit:sdd-start-patch El total de la línea sale mal: 3 × 9,99 € con IVA del 21 % da 36,30 € y debería dar 36,26 €."; TURNS=40 ;;
  r2) ASK="/sdd-kit:sdd-start-patch Quita Borrar de las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html) y pon Guardar y Cancelar en una columna a la derecha."; TURNS=40 ;;
  r3) ASK="Quita Borrar de las dos fichas y pon en su sitio un botón Archivar."; TURNS=25 ;;
  l1) ASK="/sdd-kit:sdd-start-feature Da de alta el estado «Anulado» en el catálogo de estados de pedido (tabla estados) con una migración nueva en db/migrations/."; TURNS=25 ;;
  e1) ASK="/sdd-kit:sdd-end-patch cierra el patch"; TURNS=45 ;;
  *) die "escenario desconocido: $3" ;;
esac

ventas_base
put index.html <<'EOF'
<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>Pedidos</title><link rel="stylesheet" href="styles/ficha.css"></head>
<body><main class="ficha"><h1>Pedidos</h1><ul><li><a href="pages/pedido-detalle.html">PV-2026-0142</a></li></ul></main></body>
</html>
EOF
commit "feat: listado de pedidos" "Página de entrada con el listado."
if [ "$3" = l1 ]; then
  put db/migrations/001-estados.sql <<'EOF'
CREATE TABLE IF NOT EXISTS estados (codigo TEXT PRIMARY KEY, nombre TEXT NOT NULL);
INSERT INTO estados (codigo, nombre) VALUES ('BOR', 'Borrador'), ('CON', 'Confirmado'), ('FAC', 'Facturado') ON CONFLICT (codigo) DO NOTHING;
EOF
  printf '%s\n' '- Base de datos: PostgreSQL; migraciones SQL numeradas en `db/migrations/`, idempotentes (`ON CONFLICT DO NOTHING`), con su `down` en el mismo fichero si hace falta.' >> "$R/.docs/sdd/tech-stack.md"
  commit "feat(db): catálogo de estados de pedido" "Tabla estados con Borrador, Confirmado y Facturado."
fi
if [ "$3" = e1 ]; then
  . "$HERE/partial-debt-done.sh"
  partial_debt_done
fi
if [ "$3" = k1 ]; then
  sed -i 's|return Math.round(quantity \* price \* (1 + vat) \* 100) / 100;|return Math.round(quantity * price) * (1 + vat);|' "$R/app.js"
  commit "refactor: simplificar el total de la línea" "Redondeo del importe antes del IVA."
fi

MAX_TURNS="$TURNS" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --format='%h %s' --all; } | subject_save
for f in $(cd "$R" && ls .docs/sdd/specs/*/patch.md .docs/sdd/specs/*/spec.md 2>/dev/null); do subject_keep "$R/$f" "$(basename "$(dirname "$f")" | cut -c17-)-$(basename "$f")"; done
subject_keep "$R/.docs/sdd/changelog.md" changelog.md
