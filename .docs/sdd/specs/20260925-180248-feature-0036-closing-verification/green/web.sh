#!/usr/bin/env bash
# Sujeto headless de la 0036 sobre la web salas de la 0077 (molde en su red/mold.sh), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): web.sh <kit> <etiqueta> <escenario> <salida>
#   v6  pair, paso 6: la Task 2 (selector, con defectos visuales) hecha y revisada; falta cerrarla (el v6 de la 0077)
#   v7f delegate, paso 7: las tres tasks hechas, la verificación visual de la Task 2 hecha y registrada, revisión final limpia
#   v8  como v7f, con validation.startEnvironment: true en sdd-kit.local.json
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
SC="$3"
SPEC=.docs/sdd/specs/20260925-090000-task-0012-status-filter
PORT=$((4300 + RANDOM % 600))
. "$REPO/.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/red/mold.sh"

REPLY="Haz lo que toque y para donde el paso diga: el dev-lead leerá tu mensaje y contestará en el siguiente."

visual_done() {
  mkdir -p "$RUN/shots"
  for s in light-normal light-disabled dark-normal dark-disabled; do printf 'png' > "$RUN/shots/$s.png"; done
  sed -i 's#^:root\[data-theme="dark"\] { --text: \#eeeeee;#:root[data-theme="dark"] { --text: \#eeeeee; --text-muted: \#c8c8c8;#' "$R/web/styles.css"
  sed -i -e 's#padding: 0.35rem 0 0.35rem 0.5rem;#padding: 0.35rem 1.75rem 0.35rem 0.5rem;#' -e 's#no-repeat right center;#no-repeat right 0.6rem center;#' \
    -e 's#margin: 0 0 0.75rem 0.75rem;#margin: 0 0 0.75rem 0;#' "$R/web/styles.css"
  commit "fix(0012): contraste en oscuro, flecha y alineación del selector" "Arreglos de la verificación visual de la Task 2, revisados por un Sonnet con effort medio: limpia."
  cat >> "$R/$SPEC/tasks.md" <<EOF

Verificación visual de la Task 2 (Playwright MCP, \`/\` y \`/?theme=dark\`, tras el fix $(g rev-parse --short HEAD)):
contraste del selector 7,46:1 en claro y 9,96:1 en oscuro (≥ 4,5:1) · flecha a 9,6 px del borde (> 0) ·
etiqueta y lista alineadas a 80 px · deshabilitado mientras carga en los dos temas.
Capturas fuera de git: \`$(cygpath -m "$RUN")/shots/\` (light-normal, light-disabled, dark-normal, dark-disabled).
EOF
  commit "docs(0012): verificación visual de la Task 2 en tasks.md"
}

g init -q -b main
docs_common
web_base
commit "feat: web de reservas de salas"
g checkout -q -b develop

case $SC in
  v6)
    opening
    sed -i 's/^mode: full$/mode: full\nprofile: pair/' "$R/$SPEC/spec.md" && commit "docs(0012): perfil pair para la feature"
    tasks_1_2 ;;
  v7f|v8) opening; closing_state; visual_done ;;
  *) die "escenario desconocido: $SC" ;;
esac
[ "$SC" = v8 ] && printf '{"validation": {"startEnvironment": true}}\n' > "$R/.docs/sdd/sdd-kit.local.json" && printf '.docs/sdd/sdd-kit.local.json\n' >> "$R/.gitignore" && commit "chore: sdd-kit.local.json fuera de git"

case $SC in
  v6) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil pair): la Task 2 está hecha, su revisión quedó limpia y su commit está en la rama; falta cerrarla en \`tasks.md\`. Estás en el paso 6. $REPLY" ;;
  v7f|v8) ASK="Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0012 (perfil delegate): las tres tasks están hechas y la revisión final de rama, limpia, está en \`$SPEC/review-final.md\`. Estás en el paso 7. $REPLY" ;;
esac
EXTRA_ALLOWED=mcp__plugin_playwright_playwright
HOOK="$(cygpath -m "$BASE/deny-kill.mjs")"
SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node \"'"$HOOK"'\""}]}]}}'
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; tail -8 "$R/$SPEC/tasks.md"; cat "$R/.docs/sdd/sdd-kit.local.json" 2>/dev/null; exit 0; }
subject_launch "$ASK"

listening=$(pwsh -NoProfile -Command "(Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue | Measure-Object).Count" 2>/dev/null | tr -d '\r')
pwsh -NoProfile -Command "Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }" >/dev/null 2>&1
{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current) · puerto: $PORT · escuchando al acabar: ${listening:-?}"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
} | subject_save
exit 0
