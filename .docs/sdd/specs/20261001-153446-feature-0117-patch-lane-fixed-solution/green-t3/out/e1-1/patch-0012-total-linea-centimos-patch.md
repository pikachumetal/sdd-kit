---
id: 20261001-090000-patch-0012-total-linea-centimos
task: 0012
title: Patch — el total de la línea se redondea a céntimos
type: patch
solution: causa raíz
status: done
created: 2026-10-01
branch: feature/0012-total-linea-centimos
commit: 5cc3f1141b114e18b2f6ccd23d18809727db023e
---

# Patch 0012 — el total de la línea se redondea a céntimos

## Capacidades

- Ninguna, porque el fix devuelve el total de la línea a lo que ya dice `order-sheets`

## 1. Síntoma

Parte (a) de la fila de deuda «Fichas con dos defectos de presentación del total»: el total con IVA de la línea no se redondea a céntimos.

## 2. Causa raíz

`lineTotal` redondeaba antes de aplicar el IVA. Se redondea el importe con IVA a céntimos.

## 3. Fix

- **Fichero(s)**: `app.js`
- **Cambio**: `lineTotal` redondea el importe con IVA a céntimos. Salda la parte (a) de la fila de deuda; la (b) sigue abierta.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | 3 × 9,99 € con IVA del 21 % → `36,26 €` | ✅ abierto en Chromium (reportado en el patch, no repetido en el cierre) |
| 2 | `app.js` ejecutado con `pages/pedido-detalle.html` → `36,26 €` | ✅ ejecución real en el cierre (node, DOM simulado) |
| 3 | `app.js` ejecutado con `pages/albaran-detalle.html` → `36,26 €` | ✅ ejecución real en el cierre (node, DOM simulado) |

Validación en campo: 2026-10-01 · smoke 2/2 casos con ejecución real (pedido y albarán, `36,26 €`; node con DOM simulado, sin navegador; no hay `npm test`)

## 5. Tiempo (ligero)

- Real: 0,3h
