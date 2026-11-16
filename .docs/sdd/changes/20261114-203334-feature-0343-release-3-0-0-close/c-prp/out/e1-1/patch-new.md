---
id: 20261115-195423-patch-0012-cancel-message
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-11-15
branch: feature/0012-cancel-message
commit: pendiente
---

# Patch 0012 — mensaje de cancelar

Validación: dev-lead — es texto que ve el usuario de la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Petición del dev-lead: «cambia el mensaje de cancelar: en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»».

## 2. Solución fijada

Frase literal del dev-lead: «reserva cancelada: Norte lun». Da por existente `cancelBooking` en `src/app.js`, que hoy devuelve `cancelada ${room} ${day}` (comprobado). El resto de mensajes («sin reserva …», «anulada …») no cambia.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `cancelBooking` devuelve `reserva cancelada: ${room} ${day}`; el test de cancelar espera ese texto.
- **Decisiones**:
  - Texto exacto del mensaje — dev-lead

## 4. Verificación

Gate: `node --test` · `node --test && node scripts/lint.mjs` → unit: corrió 4/4 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/cancel.test.js` falló con actual `cancelada Norte lun`, esperado `reserva cancelada: Norte lun` | ✅ |
| 2 | GREEN: `node --test` 4/4 | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,1 h + 0,63 h del gate de cierre (38 min, patch 0007)
- Inicio: 2026-11-15T19:54Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica

Revisión del patch (sonnet): sin hallazgos bloqueantes. Menores: los campos `pendiente` se rellenan en el cierre (aceptado); `anulada` sin test es previo al patch (rechazado: fuera de alcance).
