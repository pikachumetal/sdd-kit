---
id: 20260924-232447-patch-0014-duracion-minutos
task: 0014
title: Patch — el informe contaba los minutos como horas
type: patch
status: done
created: 2026-09-25
branch: feature/0014-duracion-minutos
commit: pendiente
---

# Patch 0014 — el informe contaba los minutos como horas

## 1. Síntoma

El informe de septiembre sacó «Sur · 91.5 h». Una reserva de 90 minutos, apuntada en `data/usage.csv` como «90 min», contó como 90 horas.

## 2. Causa raíz

`toHours` en `src/report.js` hacía `parseFloat(duration)`, que lee el número y descarta el sufijo: `toHours('90 min')` devuelve `90`. Reproducido en la base actual (`node -e` sobre `toHours('90 min')` → `90`). `toHours` es el único punto por el que pasan todas las filas (`usageReport`), así que se arregla ahí. Con una unidad que no fuera `h` pasaba lo mismo, sin aviso.

## 3. Fix

- **Fichero(s)**: `src/report.js`, `tests/report.test.js`
- **Cambio**: `toHours` interpreta `h` y `min` (los minutos se dividen entre 60) y lanza un error ante cualquier otro formato, en vez de devolver un total equivocado sin avisar.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `toHours('90 min')` → `1.5` (antes `90`) | ✅ agente, `node --test` |
| 2 | `toHours('1.5 h')` → `1.5` | ✅ agente |
| 3 | unidad ausente o desconocida lanza error | ✅ agente |
| 4 | `usageReport('data/usage.csv')` con el CSV actual | ✅ agente |
| 5 | fila corregida a mano a «1.5 h» en el CSV | reportado por el usuario; no se ha tocado |

## 5. Tiempo

- Real: ~0.25 h
