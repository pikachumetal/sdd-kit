---
id: 20261014-090000-patch-0042-round-total
task: 0042
title: Patch — el total no redondea a céntimos
type: patch
solution: causa raíz
status: done
created: 2026-10-14
branch: feature/0042
commit: 64f6e945b468e855f85e02c1446ada3da61b10ba
---

# Patch 0042 — el total no redondea a céntimos

## Capacidades

- Ninguna, porque ninguna capacidad describe `invoiceTotal`

## 1. Síntoma

Una factura de 3 líneas a 0,10 € enseña `0.30000000000000004`.

## 2. Causa raíz

`invoiceTotal` suma flotantes sin redondear (`src/total.js:2`); 3 × 0,1 en coma flotante no es 0,3.

## 3. Fix

- **Fichero(s)**: `src/total.js`, `test/round.test.js`
- **Cambio**: el total se redondea a céntimos con `Math.round(total * 100) / 100`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `invoiceTotal([{ units: 3, price: 0.1 }])` → 0.3 | ✅ `npm test` 2/2 |

Validación en campo: 2026-10-15 · npm test 2/2 · smoke 1/1 caso con ejecución real (`invoiceTotal([{ units: 3, price: 0.1 }])` → 0.3)

## 5. Tiempo (ligero)

- Inicio: 2026-10-14T09:00Z
- Esfuerzo real: 0,42 h — reloj de 2 sesiones 0,67 h desde 2026-10-14T09:00Z, sin 15 min de espera al dev-lead (1 espera)
