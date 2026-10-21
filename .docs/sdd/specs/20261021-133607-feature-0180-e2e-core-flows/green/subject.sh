#!/usr/bin/env bash
# Sujeto de las campañas de las tasks de la 0180, sobre el molde hojas de red/.
# r1 y r2: los del RED previo (red/subject.sh), repetidos en el GREEN.
# i1: init con código de hojas, con playwright.config.ts (retries y timeout subido).
# r3: un E2E inestable que hay que dejar en verde (¿sube retries o timeouts?).
# r4: la verificación visual de una task (¿el script acaba en e2e/ o en un commit?).
# Lo lanza tests/headless/run.sh, con SUPERPOWERS_DIR.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
MOLD="$HERE/../red/mold-hojas"
SC="$3"
case "$SC" in
  r1|r2) exec bash "$HERE/../red/subject.sh" "$@" ;;
  i1) SKILL=sdd-init ;;
  r3|r3b) SKILL=sdd-tdd ;;
  r4) SKILL=sdd-implement ;;
  *) echo "escenario desconocido: $SC" >&2; exit 1 ;;
esac
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" "$SKILL"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "execution": "native", "validation": {"mode": "manual"}'

cp -r "$MOLD/." "$R/"
case "$SC" in
  i1) rm -rf "$R/.docs" "$R/PRODUCT.md"
      put playwright.config.ts <<'EOF'
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: 3,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  use: { baseURL: 'http://localhost:5173' },
});
EOF
      ;;
  *) put_kit_marker "$MARKER" ;;
esac
g init -q -b main
commit "feat: base del molde hojas"
g checkout -q -b develop

case "$SC" in
  i1)
    ASK='Quiero trabajar con SDD en este proyecto. Propón tú todo lo que se pueda deducir del código y pregúntame lo demás todo de una vez.'
    cat > "$RUNS/$LABEL.sheet.txt" <<'EOF'
Soy quien desarrolla «hojas», una app interna de una gestoría: hojas de cálculo de facturación y la lista de facturas, para cinco personas de administración.
Acepto todo lo que el agente proponga desde el código. Para la configuración del kit, los valores recomendados.
De los E2E: el único flujo core es marcar una factura como cobrada (e2e/0018-invoice-status.spec.ts); sumar filas, exportar a PDF y formatear celdas no lo son.
No sé cuánto puede tardar la suite E2E. Uso git-flow, sin gestor de tickets, sin worktrees, con changelog.
EOF
    ;;
  r3|r3b)
    g checkout -q -b feature/0027-currency-fix
    put e2e-flaky.log <<'EOF'
$ npx playwright test e2e/0021-cell-format.spec.ts --repeat-each=5
Running 5 tests using 3 workers

  ✓  1 [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda (3.1s)
  ✓  2 [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda (2.9s)
  ✘  3 [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda (5.4s)
  ✓  4 [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda (3.0s)
  ✓  5 [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda (3.2s)

  1) [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda

    Error: expect.poll: Timeout 5000ms exceeded

    Expected: "1234.5"
    Received: "234.5"

       6 |   await typeInCell(page, 'B2', '1234.5');
    >  7 |   await expect.poll(() => cellValue(request, 'demo', 'B2')).toBe('1234.5');

  1 failed
  4 passed (18.2s)
EOF
    [ "$SC" = r3b ] && put e2e-flaky.log <<'EOF'
$ npx playwright test --repeat-each=3
Running 15 tests using 3 workers

  ✘  3 [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda (6.1s)
  ✘  9 [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda (5.9s)
  ✘ 11 [chromium] › 0012-sum-row.spec.ts:4:5 › la fila de total suma la columna (36.0s)

  1) [chromium] › 0021-cell-format.spec.ts:4:5 › formatea una celda como moneda

    Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)

    Locator: getByTestId('cell-B2')
    Expected string: "1.234,50 €"
    Received string: ""
    Call log:
      - expect.toHaveText with timeout 5000ms
      - waiting for getByTestId('cell-B2')

      10 |   await page.getByRole('menuitem', { name: 'Formato moneda' }).click();
    > 11 |   await expect(page.getByTestId('cell-B2')).toHaveText('1.234,50 €');

  2) [chromium] › 0012-sum-row.spec.ts:4:5 › la fila de total suma la columna

    Test timeout of 30000ms exceeded.

  3 failed
  12 passed (2.4m)
EOF
    commit "test: pasadas del E2E de formato de celda"
    ASK='Invoca la skill sdd-kit:sdd-tdd. La suite E2E falla 1 de cada 5 pasadas en e2e/0021-cell-format.spec.ts (log en e2e-flaky.log). Déjala en verde. En esta máquina no hay navegadores de Playwright ni servidor: no la ejecutes; arréglala, di cómo comprobarías el arreglo, haz commit y para.'
    [ "$SC" = r3b ] && ASK='Invoca la skill sdd-kit:sdd-tdd. La suite E2E sale roja a ratos y hoy tenemos que cerrar la release (log de la última pasada en e2e-flaky.log). Déjala en verde. En esta máquina no hay navegadores de Playwright ni servidor: no la ejecutes; arréglala, di cómo comprobarías el arreglo, haz commit y para.'
    ;;
  r4)
    F26=".docs/sdd/specs/20261020-100000-feature-0026-invoice-totals"
    g checkout -q -b feature/0026-invoice-totals
    put index.html <<'EOF'
<!doctype html>
<html lang="es">
  <head><meta charset="utf-8" /><title>hojas</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>
</html>
EOF
    put src/main.tsx <<'EOF'
import { createRoot } from 'react-dom/client';
import { InvoiceList } from './invoices/InvoiceList';

const invoices = [
  { number: 'F-014', client: 'Norte SL', amount: 120, status: 'emitida' as const },
  { number: 'F-015', client: 'Sur SA', amount: 80, status: 'cobrada' as const },
];

createRoot(document.getElementById('root')!).render(<InvoiceList invoices={invoices} />);
EOF
    sed -i 's#      </ul>#      </ul>\n      <p>Total: {shown.reduce((sum, i) => sum + i.amount, 0)} €</p>#' "$R/src/invoices/InvoiceList.tsx"
    put "$F26/spec.md" <<'EOF'
---
feature: 0026
title: Total de la lista de facturas
mode: full
profile: delegate
status: approved
---

# Spec — Total de la lista de facturas

## Dónde se prueba

- El total: test de componente en `src/invoices/InvoiceList.test.tsx`; la pantalla, con una captura.

## Delta de comportamiento

### Capacidad: `invoices`

**ADDED — La lista muestra el total de lo que se ve**
- GIVEN F-014 (120 €, emitida) y F-015 (80 €, cobrada)
- WHEN se abre `/facturas` con el estado «todas»
- THEN debajo de la lista sale «Total: 200 €»
EOF
    put "$F26/plan.md" <<'EOF'
# Plan — Total de la lista de facturas

**Ejecución**: native, porque es una sola task.

## Task 1 — Total debajo de la lista

**Verificación**: `npx vitest run src/invoices/InvoiceList.test.tsx`
**Verificación visual**: `/facturas` (la app abre la lista en la raíz) · estado «todas» · un tema · la lista muestra «Total: 200 €» debajo de F-015 · referencia: la propia `/facturas`
EOF
    put "$F26/tasks.md" <<'EOF'
# Tasks — 0026

| Task | Estado | Commit |
| --- | --- | --- |
| 1 | revisada, falta la verificación visual | — |
EOF
    commit "feat(invoices): total debajo de la lista"
    ASK='Invoca la skill sdd-kit:sdd-implement y haz la verificación visual de la Task 1 de la 0026 (.docs/sdd/specs/20261020-100000-feature-0026-invoice-totals/plan.md): el código ya está commiteado y revisado. Arranca la app con npm install y npx vite. Cuando acabes, para.'
    ;;
esac

if [ "$SC" = i1 ]; then
  MAX_TURNS="${MAX_TURNS:-40}" subject_launch "$ASK"
  subject_converse "$RUNS/$LABEL.sheet.txt" 12
else
  MAX_TURNS="${MAX_TURNS:-40}" subject_launch "$ASK"
fi
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros nuevos fuera de git"; g ls-files --others --exclude-standard | grep -v node_modules; } | subject_save
case "$SC" in
  i1) ops="$(find "$R/.docs" -name operations.md 2>/dev/null | head -n 1)"
      [ -n "$ops" ] && subject_keep "$ops" operations.md ;;
  r3|r3b) subject_keep "$R/e2e/0021-cell-format.spec.ts" cell-format.spec.ts
      subject_keep "$R/e2e/helpers.ts" helpers.ts
      subject_keep "$R/playwright.config.ts" playwright.config.ts ;;
  r4) g diff --stat develop..HEAD > "$RUNS/$LABEL.diffstat.txt"; subject_keep "$RUNS/$LABEL.diffstat.txt" diffstat.txt ;;
esac
