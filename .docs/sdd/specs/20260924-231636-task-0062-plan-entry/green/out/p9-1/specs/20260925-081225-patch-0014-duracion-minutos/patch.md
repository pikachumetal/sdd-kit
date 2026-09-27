---
id: 20260925-081225-patch-0014-duracion-minutos
task: 0014
title: Patch — el informe cuenta los minutos como horas
type: patch
status: done
created: 2026-09-25
branch: feature/0014-duracion-minutos
commit: <hash>
---

# Patch 0014 — el informe cuenta los minutos como horas

## 1. Síntoma

El informe de septiembre sacó «Sur · 91.5 h». Una reserva de 90 minutos, apuntada en `data/usage.csv` como «90 min», contó como 90 horas. El usuario corrigió a mano esa fila a «1.5 h» para poder enviar el informe.

## 2. Causa raíz

`toHours` (`src/report.js`) hacía `parseFloat(duration)`, que lee el número y descarta la unidad: `toHours('90 min')` devuelve `90` (reproducido). Solo «h» daba un resultado correcto, por casualidad. Cualquier fila en minutos se sumaba como horas. `toHours` es el único punto por el que pasan las duraciones (`usageReport` es su único llamador).

## 3. Fix

- **Ficheros**: `src/report.js`, `tests/report.test.js`
- **Cambio**: `toHours` interpreta la unidad (`h` o `min`) y convierte los minutos a horas. Una unidad ausente o desconocida lanza un error, en vez de contarla como horas en silencio.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `toHours('90 min')` → 1.5 (antes 90) | ✅ agente, `node --test` |
| 2 | `1.5 h` y `2 h` siguen igual | ✅ agente |
| 3 | `90 s` y `90` lanzan error | ✅ agente |
| 4 | `usageReport` sobre `data/usage.csv` | ✅ agente |

Nota: la fila corregida a mano en el CSV es válida con el fix; no hace falta revertirla.

## 5. Tiempo

Sin `.docs/sdd/estimation.md`: no aplica.
