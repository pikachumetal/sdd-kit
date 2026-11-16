#!/usr/bin/env bash
# Sujeto del RED del patch 0219, sobre el molde hojas de la 0180 con «Flujos core» y «Presupuesto E2E» en operations.md.
# s1: el smoke del paso 7 de sdd-start-feature (validación en campo) de una pantalla: ¿su script se queda en e2e/?
# s2: la Task 2 de un plan pide una prueba de estrés de la edición a la vez: ¿entra en la suite E2E del gate?
# Lo lanza tests/headless/run.sh, con SUPERPOWERS_DIR.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
SC="$3"
case "$SC" in
  s1) SKILL=sdd-start-feature ;;
  s2) SKILL=sdd-tdd ;;
  *) echo "escenario desconocido: $SC" >&2; exit 1 ;;
esac
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" "$SKILL"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native", "validation": {"mode": "field"}'

cp -r "$HERE/mold-hojas/." "$R/"
put_kit_marker "$MARKER"
put .gitignore <<'EOF'
node_modules/
test-results/
playwright-report/
EOF
g init -q -b main
commit "feat: base del molde hojas"
g checkout -q -b develop

case "$SC" in
  s1)
    F26=".docs/sdd/specs/20261026-080000-feature-0026-invoice-totals"
    g checkout -q -b feature/0026-invoice-totals
    put "$F26/spec.md" <<'EOF'
---
feature: 0026
title: Total de la lista de facturas
mode: full
profile: delegate
status: approved
---

# Spec — Total de la lista de facturas

## Intent

Administración suma a mano lo que ve en la lista. Debajo de la lista sale el total de las facturas que se ven con el estado elegido.

## Dónde se prueba

- El total: test de componente en `src/invoices/InvoiceList.test.tsx`. No es un flujo core: sin E2E.

## Delta de comportamiento

### Capacidad: `invoices`

**ADDED — La lista muestra el total de lo que se ve**
- GIVEN F-014 (120 €, emitida) y F-015 (80 €, cobrada)
- WHEN se abre `/facturas` con el estado «todas»
- THEN debajo de la lista sale «Total: 200 €»

**ADDED — El total sigue al filtro**
- GIVEN las mismas facturas
- WHEN se elige el estado «cobrada»
- THEN debajo de la lista sale «Total: 80 €»

## Aprobaciones

| Fecha | Estado |
| --- | --- |
| 2026-10-26 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
EOF
    put "$F26/plan.md" <<'EOF'
# Plan — Total de la lista de facturas

**Ejecución**: Native, porque es una sola task.

## §3 Gate de cierre

`npm test && npm run e2e`

## Task 1 — Total debajo de la lista

**Verificación**: `npx vitest run src/invoices/InvoiceList.test.tsx` → `Tests  3 passed (3)`
EOF
    put "$F26/tasks.md" <<'EOF'
# Tasks — 0026

| Task | Estado | Commit |
| --- | --- | --- |
| 1 | hecha y revisada | ver `git log` |

Revisión final: Spec y Código sobre HEAD, sdd-kit:effort-high + opus y sonnet, limpia.
EOF
    sed -i 's#      </ul>#      </ul>\n      <p>Total: {shown.reduce((sum, i) => sum + i.amount, 0)} €</p>#' "$R/src/invoices/InvoiceList.tsx"
    sed -i "s#^});\$#  it('muestra el total de lo que se ve', () => {\n    render(<InvoiceList invoices={invoices} />);\n    expect(screen.getByText('Total: 200 €')).toBeTruthy();\n  });\n\n  it('el total sigue al filtro', () => {\n    render(<InvoiceList invoices={invoices} />);\n    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'cobrada' } });\n    expect(screen.getByText('Total: 80 €')).toBeTruthy();\n  });\n});#" "$R/src/invoices/InvoiceList.test.tsx"
    commit "feat(invoices): total debajo de la lista"
    ASK='Invoca la skill sdd-kit:sdd-start-feature y sigue con la 0026 (.docs/sdd/specs/20261026-080000-feature-0026-invoice-totals/): la Task 1 y la revisión final están hechas. Sigue con el paso 7, la validación, y para justo antes de invocar sdd-archive. Para arrancar la app: npm install, npm run api y npm run dev.'
    ;;
  s2)
    F27=".docs/sdd/specs/20261026-090000-feature-0027-concurrent-edit"
    g checkout -q -b feature/0027-concurrent-edit
    put "$F27/spec.md" <<'EOF'
---
feature: 0027
title: Edición a la vez
mode: full
profile: delegate
status: approved
---

# Spec — Edición a la vez

## Intent

Al cierre de mes, las cinco personas de administración editan la misma hoja a la vez, y alguna edición se perdía: el API guardaba la hoja entera y la última escritura pisaba las demás. Ahora cada celda se guarda por separado.

## Delta de comportamiento

### Capacidad: `sheet`

**MODIFIED — Guardar una celda**
- GIVEN cinco personas con la hoja `cierre` abierta
- WHEN cada una edita 10 celdas distintas a la vez
- THEN las 50 celdas guardan su valor

## Aprobaciones

| Fecha | Estado |
| --- | --- |
| 2026-10-26 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
EOF
    put "$F27/plan.md" <<'EOF'
# Plan — Edición a la vez

**Ejecución**: Native.

## §3 Gate de cierre

`npm test && npm run e2e`

## Task 1: el API guarda cada celda por separado — hecha

`PUT /api/sheets/<hoja>/cells/<celda>` guarda solo esa celda (`server/api.js`).

## Task 2: prueba de estrés de la edición a la vez

- **Qué**: cinco sesiones del navegador con la hoja `cierre` abierta, cada una edita 10 celdas distintas a la vez; al acabar, las 50 celdas tienen su valor.
- **Verificación**: la prueba pasa contra la app arrancada con `npm run api` y `npm run dev`.
EOF
    put "$F27/tasks.md" <<'EOF'
# Tasks — 0027

| Task | Estado | Commit |
| --- | --- | --- |
| 1 | hecha y revisada | ver `git log` |
| 2 | pendiente | — |
EOF
    commit "feat(sheet): el API guarda cada celda por separado"
    ASK='Invoca la skill sdd-kit:sdd-tdd y sigue con la Task 2 del plan de la 0027 (.docs/sdd/specs/20261026-090000-feature-0027-concurrent-edit/plan.md): escribe la prueba. La Task 1 ya está en server/api.js. En esta máquina no hay navegadores de Playwright, así que no la ejecutes: escríbela, haz commit y para.'
    ;;
esac

MAX_TURNS="${MAX_TURNS:-50}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all;
  echo "## ficheros nuevos frente a develop"; g diff --name-status develop..HEAD;
  echo "## ficheros nuevos fuera de git"; g ls-files --others --exclude-standard | grep -v node_modules; } | subject_save
# Lo que el sujeto dejó en e2e/ y la config de Playwright: lo que corre el gate.
for f in $(cd "$R" && ls e2e 2>/dev/null); do
  case "$f" in 0012-sum-row.spec.ts|0015-export-pdf.spec.ts|0018-invoice-status.spec.ts|0021-cell-format.spec.ts|helpers.ts) ;;
    *) subject_keep "$R/e2e/$f" "e2e-$f" ;; esac
done
subject_keep "$R/playwright.config.ts" playwright.config.ts
subject_keep "$R/package.json" package.json
