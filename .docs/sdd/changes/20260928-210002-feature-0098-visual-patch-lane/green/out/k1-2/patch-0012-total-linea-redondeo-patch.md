---
id: 20260928-213310-patch-0012-total-linea-redondeo
task: 0012
title: Patch — El total de la línea redondea el subtotal a euros enteros
type: patch
status: done
created: 2026-09-28
branch: feature/0012-total-linea-redondeo
commit: pendiente
---

# Patch 0012 — El total de la línea redondea el subtotal a euros enteros

## Capacidades

- Ninguna, porque el fix devuelve `lineTotal` a lo que ya dice `order-sheets`.

## 1. Síntoma

Reportado: «El total de la línea sale mal: 3 × 9,99 € con IVA del 21 % da 36,30 € y debería dar 36,26 €.»

Medido: coincide con lo reportado. Abiertas `pages/pedido-detalle.html` y `pages/albaran-detalle.html` en Chromium (Playwright), la celda `.total` muestra `36,30 €` en las dos.

## 2. Causa raíz

`lineTotal` en `app.js` hace `Math.round(quantity * price) * (1 + vat)`: redondea el subtotal **a un entero** antes de aplicar el IVA. Con 3 × 9,99 = 29,97 el subtotal pasa a 30, y 30 × 1,21 = 36,30. Sin ese redondeo, 29,97 × 1,21 = 36,2637 → 36,26.

Evidencia: `git show fd5085a -- app.js` (refactor «simplificar el total de la línea», cuerpo «Redondeo del importe antes del IVA») cambió `Math.round(q * p * (1 + vat) * 100) / 100` (redondeo a céntimos al final) por el redondeo del subtotal a euros. Es una regresión de ese refactor, que no conservó el comportamiento. La capacidad `order-sheets` pide `36,26 €`.

## 3. Fix

- **Fichero(s)**: `app.js`
- **Cambio**: `lineTotal` vuelve a redondear a céntimos al final: `Math.round(quantity * price * (1 + vat) * 100) / 100`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Sin el fix, `pedido-detalle` y `albaran-detalle` en Chromium (Playwright) muestran `36,30 €` | ✅ reproducido |
| 2 | Con el fix, las dos fichas muestran `36,26 €` | ✅ |

No hay tests automáticos en el proyecto (`tech-stack.md`); la verificación es abrir las páginas en un navegador real.

## 5. Tiempo

- Real: ~0,25 h
