---
id: 20261106-101305-patch-0012-cancel-message
task: 0012
title: Patch — mensaje de cancelar
type: patch
solution: dev-lead
status: done
created: 2026-11-06
branch: feature/0012-cancel-message
commit: 8fe152b
---

# Patch 0012 — mensaje de cancelar

Validación: dev-lead — el texto es lo que ve el usuario.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Petición: «cambia el mensaje de cancelar: en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»».

## 2. Solución fijada

Frase literal del dev-lead: «en vez de «cancelada Norte lun» que diga «reserva cancelada: Norte lun»». Lo que da por existente, comprobado: `cancelBooking` en `src/app.js` devuelve `cancelada ${room} ${day}` y el test de `test/cancel.test.js` lo fija.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: el mensaje de `cancelBooking` pasa a `reserva cancelada: ${room} ${day}`; el test espera el nuevo texto (RED antes del cambio).
- **Decisiones**:
  - Texto exacto `reserva cancelada: <sala> <día>` — dev-lead
  - `sin reserva <sala> <día>` y `anulada …` no cambian — dev-lead (la petición solo nombra el mensaje de cancelar)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 4/4 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte lun` devuelve `reserva cancelada: Norte lun` (RED: `actual 'cancelada Norte lun'`; GREEN: 4/4) | ✅ |

Revisión (revisor Sonnet, effort medio): sin hallazgos críticos ni importantes. Menores de documentación (`commit` pendiente, redacción de «Tiempo»): corregidos aquí.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + 0,63 h del gate de cierre (38 min, patch 0007)
- Inicio: 2026-11-06T10:13Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-06T10:11Z (0 esperas al dev-lead); gate de cierre medido: 2 s
- Coste de subagentes: no aplica
