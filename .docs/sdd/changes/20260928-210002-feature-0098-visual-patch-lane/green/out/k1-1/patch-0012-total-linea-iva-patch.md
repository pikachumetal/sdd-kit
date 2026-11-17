---
id: 20260928-213139-patch-0012-total-linea-iva
task: 0012
title: Patch — El total de la línea redondea antes del IVA
type: patch
status: done
created: 2026-09-28
branch: feature/0012-total-linea-iva
commit:
---

# Patch 0012 — El total de la línea redondea antes del IVA

## Capacidades

- Ninguna, porque el fix devuelve `lineTotal` a lo que ya dice `order-sheets`

## 1. Síntoma

«El total de la línea sale mal: 3 × 9,99 € con IVA del 21 % da 36,30 € y debería dar 36,26 €.»

Reproducido: `lineTotal(3, 9.99, 0.21)` devolvía 36,30 (`toFixed(2)`) en las dos fichas (`pedido-detalle`, `albaran-detalle`), que comparten `app.js`.

## 2. Causa raíz

`app.js` línea 2 redondeaba el importe **antes** del IVA: `Math.round(quantity * price) * (1 + vat)`. Con 3 × 9,99 = 29,97 se redondea a 30 (a euros enteros) y 30 × 1,21 = 36,30. Lo correcto es aplicar el IVA y redondear a céntimos: 29,97 × 1,21 = 36,2637 → 36,26.

Evidencia: `git show 039b69e` (`refactor: simplificar el total de la línea`, «Redondeo del importe antes del IVA») cambió `Math.round(quantity * price * (1 + vat) * 100) / 100` por la fórmula actual; ese refactor introdujo la regresión. La capacidad `order-sheets` ya exige `36,26 €`.

## 3. Fix

- **Fichero(s)**: `app.js`
- **Cambio**: `lineTotal` vuelve a redondear a céntimos el total con IVA: `Math.round(quantity * price * (1 + vat) * 100) / 100`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `lineTotal(3, 9.99, 0.21)` con la función real de `app.js`, formateada como la página | ✅ `36,26 €` (antes `36,30 €`), verificado por el agente con `node` |
