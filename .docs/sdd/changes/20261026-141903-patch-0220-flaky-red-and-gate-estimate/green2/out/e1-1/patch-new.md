---
id: 20261026-144758-patch-0012-mensaje-cancelar
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-10-26
branch: feature/0012-mensaje-cancelar
commit: pendiente
---

# Patch 0012 — mensaje de cancelar

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Petición: «cambia el mensaje de cancelar: en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»».

## 2. Solución fijada

«en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»» — dev-lead. Comprobado que existe: `cancelBooking` en `src/app.js:17` devuelve `cancelada ${room} ${day}` y el test `test/cancel.test.js:6` lo fija.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el mensaje de una cancelación correcta pasa a `reserva cancelada: ${room} ${day}`; el test se actualiza antes (RED). `sin reserva …` y `anulada …` no cambian.
- **Decisiones**:
  - Texto literal `reserva cancelada: <sala> <día>` — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte lun` → `reserva cancelada: Norte lun` (RED antes, verde después) | ✅ |
| 2 | gate de cierre `node --test && node scripts/lint.mjs`: 4/4 tests, lint sin hallazgos, 1 s | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,25 h + 0,63 h del gate de cierre (38 min, patch 0007)
- Inicio: 2026-10-26T14:47Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
