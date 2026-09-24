---
id: 20260924-223521-patch-0066-estimation-log-minutes
task: 0066
title: Patch — Build-EstimationLog.ps1 convierte los minutos a horas y avisa de otras unidades
type: patch
status: done
created: 2026-09-25
branch: feature/0066
commit: <hash>
---

# Patch 0066 — Build-EstimationLog.ps1 convierte los minutos a horas y avisa de otras unidades

## 1. Síntoma

Reportado (ticket del patch 0065 §1, `.docs/sdd/field-reports/20260924-222724-patch-0065-merge-hook-rejection.md`): `Build-EstimationLog.ps1` lee «30 min» como 30 horas y no avisa. La §5 del `patch.md` de la 0065 decía «Estimación: 30 min» y «Real: 25 min», y el log generó la fila «30 | 25»: las horas reales de la release sin publicar pasaron de 50,05 a 75,05.

Medido: el mismo síntoma. Con un `patch.md` de prueba con «30 min» / «25 min», el script escribe `| patch | 30 | 25 | 0.83 |`; con «2 días» escribe 2 horas. En el corpus actual ya no queda ninguna fila en minutos: el `patch.md` de la 0065 se corrigió a mano a «0.5h» / «0.4 h» en su cierre.

## 2. Causa raíz

`ConvertTo-Hours` (`skills/sdd-templates/scripts/Build-EstimationLog.ps1:48`) aplicaba `'^[\s*~≈≃]*(\d+(?:[.,]\d+)?)'`, que captura la cifra y descarta todo lo que viene detrás: la unidad nunca se leía. Todas las lecturas de estimación y real (walkthrough, patch y hotfix, líneas 127-128 y 140-141 antes del fix) pasan por esa función, así que el arreglo en ella cubre a todos los llamantes.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1`, `tests/Build-EstimationLog.Tests.ps1`
- **Cambio**: `ConvertTo-Hours` captura la palabra que sigue a la cifra. `h`, `hora(s)` o sin unidad devuelven la cifra como hasta ahora; `min`, `mins` y `minuto(s)` se dividen entre 60; cualquier otra unidad escribe un aviso con el fichero y deja la celda vacía, sin adivinar. Un real en otra unidad queda ilegible, así que la fila se excluye con el aviso que ya existía.

## 4. Verificación

Todo verificado por el agente.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: «30 min» / «25 min» → el test esperaba `0.5 \| 0.42` y el script dio `30 \| 25`; «2 días» dio 2 h; un real en «1 semana» dio 1 h | ✅ 3 tests en rojo, el síntoma literal |
| 2 | GREEN: `tests/Build-EstimationLog.Tests.ps1` | ✅ 57/57 |
| 3 | «1 hora» / «2 horas» se leen como horas, sin aviso | ✅ |
| 4 | Regenerar `.docs/sdd/estimation-log.md` | ✅ sin diff: ninguna fila del corpus lleva minutos ni otra unidad (comprobado con grep sobre todos los bloques de tiempo) |
| 5 | Suite completa de `tests/` | ✅ 608 pasan, 0 fallan, 6 skipped |

## 5. Tiempo (ligero)

- Estimación: 0.5 h
- Real: 0.4 h
