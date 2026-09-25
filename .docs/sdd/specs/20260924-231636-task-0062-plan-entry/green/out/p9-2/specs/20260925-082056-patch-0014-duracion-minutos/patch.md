---
id: 20260925-082056-patch-0014-duracion-minutos
task: 0014
title: Patch — el informe cuenta los minutos como horas
type: patch
status: done
created: 2026-09-25
branch: feature/0014-duracion-minutos
commit: pendiente
---

# Patch 0014 — el informe cuenta los minutos como horas

## 1. Síntoma

El informe de septiembre sacó «Sur · 91.5 h». Una reserva de 90 minutos, apuntada en `data/usage.csv` como «90 min», contó como 90 horas. La fila del CSV ya se corrigió a mano a «1.5 h» para poder mandar el informe.

## 2. Causa raíz

`toHours` (`src/report.js`) hacía `parseFloat(duration)`, que lee el número y descarta la unidad: `toHours('90 min')` devuelve `90` y `toHours('1.5 h')` devuelve `1.5` (reproducido con `node`). Cualquier duración que no esté en horas se sumaba como si lo estuviera. `usageReport` es el único llamador de `toHours`, así que el fallo vive solo ahí.

## 3. Fix

- **Fichero(s)**: `src/report.js`, `tests/report.test.js`
- **Cambio**: `toHours` interpreta la unidad (`h` o `min`, `min` se divide entre 60) y lanza un error con una unidad desconocida, en vez de adivinar.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `toHours('90 min')` → 1.5 (antes 90) | ✅ agente, `node --test` |
| 2 | `toHours('1.5 h')` y `'2 h'` siguen igual | ✅ agente |
| 3 | unidad desconocida lanza error | ✅ agente |
| 4 | `usageReport` con una fila en «90 min» da «Sur · 1.5 h» | ✅ agente |

## 5. Tiempo

No hay `.docs/sdd/estimation.md`; no aplica.
