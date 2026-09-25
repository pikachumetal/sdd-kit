---
id: 20260925-070657-patch-0014-informe-minutos-como-horas
task: 0014
title: Patch — el informe contaba los minutos como horas
type: patch
status: done
created: 2026-09-25
branch: hotfix/0014
commit: <hash>
---

# Patch 0014 — el informe contaba los minutos como horas

## 1. Síntoma

El informe de septiembre sacó «Sur · 91.5 h». Una reserva de 90 minutos, apuntada en `data/usage.csv` como «90 min», contó como 90 horas. La fila se corrigió a mano a «1.5 h» para poder enviar el informe.

## 2. Causa raíz

`toHours` (`src/report.js`) hacía `parseFloat(duration)`: leía el número y descartaba la unidad, así que «90 min» daba 90. Reproducido antes del fix: `toHours('90 min')` → `90`. Su único llamador es `usageReport`, que suma el resultado como horas. Con «h» funcionaba solo porque el número ya venía en horas.

## 3. Fix

- **Fichero(s)**: `src/report.js`, `tests/report.test.js`
- **Cambio**: `toHours` interpreta la unidad: `min` se divide entre 60, `h` se deja igual y cualquier otra unidad lanza error en lugar de sumarse en silencio.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `toHours('90 min')` → 1.5 | ✅ (agente, `node --test`) |
| 2 | `toHours('1.5 h')` y `'2 h'` siguen igual | ✅ (agente) |
| 3 | Unidad desconocida lanza error | ✅ (agente) |
| 4 | `usageReport('data/usage.csv')` → Norte 3 h, Sur 1.5 h | ✅ (agente) |

La corrección manual del CSV no se ha revertido: no hay ninguna fila en minutos con la que probar el informe real de extremo a extremo (cubierto por el test unitario).

## 5. Tiempo

Sin `.docs/sdd/estimation.md`: no aplica.
