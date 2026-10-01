---
id: 20261001-161043-patch-0012-total-linea-redondeo
task: 0012
title: Patch — El total de la línea redondea antes del IVA
type: patch
solution: causa raíz
status: done
created: 2026-10-01
branch: feature/0012-total-linea-redondeo
commit: <hash>
---

# Patch 0012 — El total de la línea redondea antes del IVA

## Capacidades

- Ninguna, porque el fix devuelve `lineTotal` a lo que ya dice `order-sheets` («El total de la línea incluye el IVA»: `36,26 €`).

## 1. Síntoma

Reportado: «El total de la línea sale mal: 3 × 9,99 € con IVA del 21 % da 36,30 € y debería dar 36,26 €.»

Medido: coincide. En `pedido-detalle.html` y `albaran-detalle.html` (`data-cantidad="3" data-precio="9.99" data-iva="0.21"`), `lineTotal(3, 9.99, 0.21)` devuelve `36.3` → se pinta `36,30 €`.

## 2. Causa raíz

El commit `8382194` («refactor: simplificar el total de la línea») cambió en `app.js`:

```
- return Math.round(quantity * price * (1 + vat) * 100) / 100;
+ return Math.round(quantity * price) * (1 + vat);
```

El refactor movió el redondeo antes del IVA y, al quitar el `* 100 / 100`, lo dejó en euros enteros en vez de céntimos: `Math.round(3 × 9,99 = 29,97) = 30`, y `30 × 1,21 = 36,30`. El importe correcto es `29,97 × 1,21 = 36,2637 → 36,26`. Evidencia: ejecutadas ambas fórmulas con `node`, la anterior da `36.26` y la actual `36.3`. Un refactor no debía cambiar el resultado. La capacidad `order-sheets` ya fija `36,26 €`.

## 3. Fix

- **Fichero(s)**: `app.js`
- **Cambio**: `lineTotal` vuelve a redondear a céntimos el importe con IVA: `Math.round(quantity * price * (1 + vat) * 100) / 100`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `lineTotal(3, 9.99, 0.21)` evaluando `app.js` con `node`, y su formato de pantalla | ✅ antes `36,30 €`, ahora `36,26 €` |
