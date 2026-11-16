#!/usr/bin/env bash
# Sujeto del RED previo a la spec de la 0180, sobre el molde hojas.
# r1: el implementador escribe el E2E de pegar desde el menú contextual (¿espera interna, waitForTimeout, teclear tras Enter?).
# r2: sdd-propose escribe la spec de recordar el filtro (¿«Dónde se prueba» pide un E2E nuevo?).
# Lo lanza tests/headless/run.sh, con SUPERPOWERS_DIR.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
SC="$3"
case "$SC" in
  r1) SKILL=sdd-tdd ;;
  r2) SKILL=sdd-propose ;;
  *) echo "escenario desconocido: $SC" >&2; exit 1 ;;
esac
subject_init "$1" "$2" "$4" "$SKILL"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native", "validation": {"mode": "manual"}'
F25=".docs/sdd/specs/20261020-090000-feature-0025-paste-menu"

cp -r "$HERE/mold-hojas/." "$R/"
put_kit_marker "$MARKER"
g init -q -b main
commit "feat: base del molde hojas"
g checkout -q -b develop

case "$SC" in
  r1)
    g checkout -q -b feature/0025-paste-menu
    put "$F25/spec.md" <<'EOF'
---
feature: 0025
title: Pegar desde el menú contextual
mode: full
profile: delegate
status: approved
---

# Spec — Pegar desde el menú contextual

## Intent

Hoy solo se pega con Ctrl+V, y administración usa el ratón. Con el clic derecho en una celda sale «Pegar», que pega lo último copiado en la hoja.

## Dónde se prueba

- Pegar desde el menú: un E2E en `e2e/0025-paste-menu.spec.ts`, como los de la hoja.

## Delta de comportamiento

### Capacidad: `sheet`

**ADDED — Pegar desde el menú contextual**
- GIVEN la hoja `demo` con 4321 en A1, copiado con Ctrl+C
- WHEN el usuario hace clic derecho en B1 y elige «Pegar»
- THEN B1 muestra 4321
EOF
    put "$F25/plan.md" <<'EOF'
# Plan — Pegar desde el menú contextual

**Ejecución**: Native.

## Task 1: menú contextual con «Pegar» — hecha

## Task 2: E2E del flujo

- **Fichero**: `e2e/0025-paste-menu.spec.ts`
- **Flujo**: el usuario escribe 4321 en A1, lo copia con Ctrl+C, hace clic derecho en B1, elige «Pegar» y B1 muestra 4321.
EOF
    commit "feat(sheet): menú contextual con Pegar"
    ASK='Invoca la skill sdd-kit:sdd-tdd y sigue con la Task 2 del plan de la 0025 (.docs/sdd/specs/20261020-090000-feature-0025-paste-menu/plan.md): escribe el E2E del flujo en e2e/0025-paste-menu.spec.ts. El código de la Task 1 ya está en src/sheet/. En esta máquina no hay navegadores de Playwright ni red, así que no lo ejecutes: escríbelo, haz commit y para.'
    ;;
  r2)
    g checkout -q -b feature/0024-remember-status-filter
    ASK='Invoca la skill sdd-kit:sdd-propose: arranca la 0024 del roadmap, la lista de facturas recuerda el último estado elegido al volver a la pantalla. Apruebo la spec por delegación, nos vemos en la validación: no me preguntes nada, escribe la spec y para antes del plan.'
    ;;
esac

MAX_TURNS="${MAX_TURNS:-40}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; } | subject_save
case "$SC" in
  r1) [ -f "$R/e2e/0025-paste-menu.spec.ts" ] && subject_keep "$R/e2e/0025-paste-menu.spec.ts" paste-menu.spec.ts
      [ -f "$R/e2e/helpers.ts" ] && subject_keep "$R/e2e/helpers.ts" helpers.ts ;;
  r2) spec="$(find "$R/.docs/sdd/specs" -name spec.md -path '*0024*' | head -n 1)"
      [ -n "$spec" ] && subject_keep "$spec" spec.md ;;
esac
