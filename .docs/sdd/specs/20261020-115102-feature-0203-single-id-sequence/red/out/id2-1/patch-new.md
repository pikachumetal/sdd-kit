---
id: 20261020-135048-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de la franja en `libres`
type: patch
solution: dev-lead
status: done
created: 2026-10-20
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de la franja en `libres`

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index` no lista ninguna).

## 1. Síntoma

`libres 25:00-26:00` lista las salas como si la franja fuera válida.

## 2. Solución fijada

Dev-lead: «`libres 25:00-26:00` … debe responder «franja no válida: usa HH:MM-HH:MM»». Salda la deuda «Sin validación del formato de franja horaria». Da por existente el comando `libres` (`src/app.js`, `run`): comprobado.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `HH:MM-HH:MM` (horas 00-23, minutos 00-59) antes de listar; si no cumple, responde el mensaje fijado.
- **Decisiones**:
  - Horas 00-23 y minutos 00-59: lo exige el ejemplo `25:00-26:00` — dev-lead
  - No se valida que el fin sea posterior al inicio — dev-lead (no pedido; queda fuera)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `25:00-26:00`, `10:60-11:00`, `10-12`, sin franja → mensaje | ✅ rojo antes, verde después |
| 2 | `node --test && node scripts/lint.mjs` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-20T13:50Z
- Esfuerzo real: pendiente de cierre
