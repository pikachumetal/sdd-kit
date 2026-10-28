#!/usr/bin/env bash
# Sujeto de la batería de sdd-upgrade: una petición de battery.md sobre el molde salas de using-sdd, con migraciones pendientes.
# Lo lanza tests/headless/battery.mjs run, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
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

MOLD="$(cell Molde)"
case "$MOLD" in v2x*) V2X=1 ;; *) V2X= ;; esac
if [ -n "$V2X" ]; then cp -r "$HERE/mold-v2x/." "$R/"; else cp -r "$HERE/../using-sdd/mold-salas/." "$R/"; fi
case "$MOLD" in
  salas) echo "{\"version\": \"2.3.3\", $MARKER}" | put .docs/sdd/sdd-kit.json ;;
  # Un proyecto 2.x completo, en 2.3.4: lo que mide la migración a la 3.0.0.
  v2x) ;;
  # v2x con E2E: lo que mide que la migración proponga los campos E2E de operations-template.md.
  v2x-e2e)
    printf "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './e2e',\n  retries: process.env.CI ? 2 : 0,\n  timeout: 60_000,\n});\n" | put playwright.config.ts
    printf "import { expect, test } from '@playwright/test';\n\ntest('reserva Norte a las 10:00', async ({ page }) => {\n  await page.goto('/');\n  await page.getByRole('button', { name: 'Reservar' }).click();\n  await expect(page.getByText('reservada Norte 10:00')).toBeVisible();\n});\n" | put e2e/booking.spec.ts
    sed -i 's#"test": "vitest run"#"test": "vitest run", "e2e": "playwright test"#' "$R/package.json"
    sed -i 's#^- Gate de cierre: `npm test`.#- Gate de cierre: `npm test`.\n- E2E: `npx playwright test`.#' "$R/.docs/sdd/tech-stack.md" ;;
  # Solo configuración, sin version ni init: el molde trae mission.md y constitution.md de la 2.x.
  salas-noversion) echo '{"ids": {"mode": "sequence"}}' | put .docs/sdd/sdd-kit.json ;;
  salas-legacy)
    mkdir -p "$RUN/kit"; kit_with_toy_migration
    echo "{\"version\": \"2.3.4\", $MARKER}" | put .docs/sdd/sdd-kit.json
    printf '# Funcional heredado\n\nLas reservas son por franja de una hora.\n' | put .docs/sdd/legacy.md ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
if [ -n "$V2X" ]; then
  # Dos fechas pasadas: la fecha de una fila de deuda tiene que salir de su commit, no del día del sujeto.
  late='| Pasar `src/app.js` a TypeScript | Bajo | versión siguiente |'
  grep -vF "$late" "$R/.docs/sdd/roadmap.md" > "$R/roadmap.tmp" && mv "$R/roadmap.tmp" "$R/.docs/sdd/roadmap.md"
  GIT_AUTHOR_DATE=2026-09-01T10:00:00 GIT_COMMITTER_DATE=2026-09-01T10:00:00 commit "feat: base del molde salas"
  awk -v row="$late" '{ print } /^\| `cancel` no comprueba/ { print row }' "$R/.docs/sdd/roadmap.md" > "$R/roadmap.tmp" && mv "$R/roadmap.tmp" "$R/.docs/sdd/roadmap.md"
  GIT_AUTHOR_DATE=2026-09-15T10:00:00 GIT_COMMITTER_DATE=2026-09-15T10:00:00 commit "docs(roadmap): deuda de TypeScript"
else
  commit "feat: base del molde salas"
fi
g checkout -q -b develop

case "$SC" in
  o1) TURN2="No, ahora no. Sigue con lo del filtro." ;;
  o2) TURN2="Sí, actualízalo." ;;
esac
export TURN2="${TURN2:-}"

case "$SC" in v1|v3) MAX_TURNS="${MAX_TURNS:-90}" ;; esac
MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
case "$SC" in v1|v3) subject_converse "$HERE/persona-v2x.md" 12 ;; esac
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json"
  if [ -n "$V2X" ]; then
    echo "## ficheros"; (cd "$R" && find . -path ./.git -prune -o -name '*.md' -print | sort)
    echo "## sdd roadmap check"; "$NODE" "$KIT/cli/bin/sdd.js" roadmap check --path "$R/.docs/sdd" 2>&1
    echo "## sdd capability check"; "$NODE" "$KIT/cli/bin/sdd.js" capability check --path "$R/.docs/sdd" 2>&1
    for f in ROADMAP.md .docs/sdd/steering/debt.md PRODUCT.md .docs/sdd/steering/operations.md CLAUDE.md README.md .docs/sdd/steering/constitution.md .docs/sdd/steering/estimation.md .claude/commands/pregunta.md; do [ -f "$R/$f" ] && { echo "## $f"; cat "$R/$f"; }; done
  fi; } | subject_save
