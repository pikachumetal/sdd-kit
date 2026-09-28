#!/usr/bin/env bash
# Sujeto de la campaña del patch visual sobre el molde `ventas`. Lo lanza tests/headless/run.sh con SUPERPOWERS_DIR.
#   v1 ajuste visual por el hook · v2 el mismo con /sdd-start-feature · c1 lógica en la plantilla · c2 texto visible
#   f1 recorrido con /sdd-start-patch · f2 cierre con /sdd-end-patch de un patch visual validado · k1 bug determinista
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../../../../tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-patch
. "$HERE/mold.sh"
PW_MODULES="${PW_MODULES:?define PW_MODULES (node_modules con playwright 1.63 en el scratchpad)}"

CLAUDE_BIN="$(type -P claude)" || die "sin claude en el PATH"
claude() { timeout 720 "$CLAUDE_BIN" "$@"; }

MOVE="Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación."
case "$3" in
  v1) ASK="$MOVE"; TURNS=25 ;;
  v2) ASK="/sdd-kit:sdd-start-feature $MOVE"; TURNS=25 ;;
  c1) ASK="Oculta Borrar si el pedido está facturado y pásalo a la derecha, en las dos fichas."; TURNS=25 ;;
  c2) ASK="Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas."; TURNS=25 ;;
  f1) ASK="/sdd-kit:sdd-start-patch $MOVE"; TURNS=40 ;;
  f2) ASK="/sdd-kit:sdd-end-patch Validado: lo he probado y funciona. He abierto las dos fichas en Chromium y los botones quedan en la columna derecha. Cierra el patch."; TURNS=40 ;;
  k1) ASK="/sdd-kit:sdd-start-patch El total de la línea sale mal: 3 × 9,99 € con IVA del 21 % da 36,30 € y debería dar 36,26 €."; TURNS=40 ;;
  *) die "escenario desconocido: $3" ;;
esac

ventas_base
case "$3" in
  f1|k1) cp -r "$PW_MODULES" "$R/node_modules" ;;
esac
if [ "$3" = k1 ]; then
  sed -i 's|return Math.round(quantity \* price \* (1 + vat) \* 100) / 100;|return Math.round(quantity * price) * (1 + vat);|' "$R/app.js"
  commit "refactor: simplificar el total de la línea" "Redondeo del importe antes del IVA."
fi
if [ "$3" = f2 ]; then
  . "$HERE/visual-patch-done.sh"
  visual_patch_done
fi

MAX_TURNS="$TURNS" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; } | subject_save
for f in $(cd "$R" && ls .docs/sdd/specs/*/patch.md .docs/sdd/specs/*/spec.md 2>/dev/null); do subject_keep "$R/$f" "$(basename "$(dirname "$f")" | cut -c17-)-$(basename "$f")"; done
subject_keep "$R/.docs/sdd/changelog.md" changelog.md
find "$R" "$RUN" -name '*.png' -not -path '*/node_modules/*' 2>/dev/null | sed "s|$RUN|<run>|" > "$OUT/$LABEL.png.txt"
