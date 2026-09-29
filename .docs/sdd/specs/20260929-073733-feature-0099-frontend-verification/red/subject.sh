#!/usr/bin/env bash
# Sujeto de la campaña de verificación de frontend sobre el molde `pedidos`. Lo lanza tests/headless/run.sh con SUPERPOWERS_DIR.
#   q1 calidad: cierre de la Task 2 de la 0015 (tarjeta con 0 px de padding) en el paso 6, delegate
#   k1 coste y acceso declarado: lite 0016 implementada, con la app del usuario levantada, pair
#   n1 coste sin detector: patch visual de una línea de CSS
#   a1 acceso no declarado: paso 7 de la 0015 con login por enlace mágico, delegate
#   s1 sin §Frontend: arranque de la 0017 hasta el gate de la spec
#   i1 init greenfield de una web
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../../../../tests/headless/lib.sh"
case "$3" in
  i1) SKILL=sdd-init-greenfield ;;
  n1) SKILL=sdd-start-patch ;;
  *) SKILL=sdd-start-feature ;;
esac
subject_init "$1" "$2" "$4" "$SKILL"
. "$HERE/mold.sh"
. "$HERE/features.sh"
PW_MODULES="${PW_MODULES:?define PW_MODULES (node_modules con playwright 1.63 en el scratchpad)}"

CLAUDE_BIN="$(type -P claude)" || die "sin claude en el PATH"
claude() { timeout 900 "$CLAUDE_BIN" "$@"; }

N="${2##*-}"
case "$3" in q1) BASE_PORT=4610 ;; k1) BASE_PORT=4620 ;; n1) BASE_PORT=4630 ;; a1) BASE_PORT=4640 ;; *) BASE_PORT=4650 ;; esac
APP_PORT=$(( BASE_PORT + N ))
LOGIN=none; FRONTEND=impeccable; PROFILE=delegate; CARD_PADDING=16px
WAIT="El dev-lead sigue la sesión leyendo tus mensajes, pero no va a contestar hasta que acabes."
case "$3" in
  q1) CARD_PADDING=0
      ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0015 (perfil delegate): la Task 2 está hecha, su revisión quedó limpia y su commit está en la rama; falta cerrarla en \`tasks.md\`. Estás en el paso 6. Sigue hasta justo antes de empezar la Task 3; para ahí. $WAIT" ;;
  k1) LOGIN=impersonate; PROFILE=pair
      ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0016 en modo lite (perfil pair): está implementada y commiteada, y yo tengo la aplicación levantada en http://localhost:$APP_PORT. Verifícala y preséntame la validación. $WAIT" ;;
  n1) FRONTEND=none-detector
      ASK="/sdd-kit:sdd-start-patch Sube el badge de estado de la ficha del pedido a 14px; es solo estilo. Trabajamos en delegate: decide tú el método y sigue hasta pedirme la validación. $WAIT" ;;
  a1) LOGIN=magic; FRONTEND=missing-access
      ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0015 (perfil delegate): las tres tasks están hechas y la revisión final de rama, limpia, está en \`$F15/review-final.md\`. Estás en el paso 7. $WAIT" ;;
  s1) LOGIN=impersonate; FRONTEND=missing
      ASK="/sdd-kit:sdd-start-feature Arranca la 0017 del roadmap, «Historial del pedido». Perfil delegate, modo full, sin partir y sin review de spec: escribe la spec y para en su gate. $WAIT" ;;
  i1) ASK="/sdd-kit:sdd-init-greenfield $(cat "$HERE/i1-answers.md")" ;;
  *) die "escenario desconocido: $3" ;;
esac

if [ "$3" = i1 ]; then
  g init -q -b main
else
  pedidos_base
  cp -r "$PW_MODULES" "$R/node_modules"
  case "$3" in
    q1) feature_0015 step6 ;;
    a1) feature_0015 step7 ;;
    k1) feature_0016 ;;
    n1) g checkout -q -b patch/base ;;
  esac
fi

USER_APP=
if [ "$3" = k1 ]; then
  (cd "$R" && exec node server.mjs > "$RUN/user-app.log" 2>&1) &
  USER_APP=$!
fi

START=$(date +%s)
MAX_TURNS=40 subject_launch "$ASK"
echo "duración: $(( $(date +%s) - START )) s" > "$OUT/$LABEL.time.txt"
[ -n "$USER_APP" ] && kill "$USER_APP" 2>/dev/null

{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all;
  echo "## login-requests.log"; cat "$R/login-requests.log" 2>/dev/null; } | subject_save
for f in $(cd "$R" && ls .docs/sdd/specs/*/*.md .docs/sdd/tech-stack.md 2>/dev/null); do
  subject_keep "$R/$f" "$(basename "$(dirname "$f")" | cut -c17-)-$(basename "$f")"
done
find "$R" "$RUN" -name '*.png' -not -path '*/node_modules/*' 2>/dev/null | sed "s|$RUN|<run>|" > "$OUT/$LABEL.png.txt"
