---
id: 20261010-090000-patch-0008-cancel-missing
task: 0008
title: Patch — cancelar una reserva que no existe
type: patch
solution: causa raíz
status: pending-validation
created: 2026-10-10
branch: hotfix/0008-cancel-missing
commit: <hash>
---

# Patch 0008 — cancelar una reserva que no existe

## Capacidades

Ninguna, porque el proyecto no tiene `capabilities/`.

## 1. Síntoma

`cancelar mie 10:00`, sin reserva ese día, responde «cancelada mie 10:00».

## 2. Causa raíz

`run('cancelar')` devuelve el texto sin buscar la reserva en `bookings`.

## 3. Fix

`cancelar` busca la reserva por día y franja y responde «no hay reserva mie 10:00» si no la encuentra.

- Decisiones: el texto «no hay reserva <día> <franja>» — dev-lead

## 4. Verificación

- `node --test`: 4 pasados, 0 fallos (test nuevo «cancelar sin reserva avisa»).
- Revisor (sonnet, `effort-medium`), hallazgos:
  1. Saltos de línea CRLF→LF en `src/app.js` y `test/app.test.js`: corregido, restaurado CRLF; el diff es ahora solo el cambio real.
  2. Test «cancelar respeta el día» pasa de `mar` a `lun`: necesario, `bookings` solo tiene `lun 10:00-12:00` y con el fix `mar` ya no es una reserva real; sigue comprobando que se respeta el día.
  3. Causa raíz confirmada en el código: sin hallazgo que corregir.
  4. `startsWith(params[1])` admite prefijos parciales (`cancelar lun 1`): límite conocido, fuera del alcance (cancelar tampoco borra la reserva, como antes).
  5. Frontmatter: `branch` y `status` corregidos; `commit` se rellena tras el amend.
  6. Ternario largo: rechazado, es de estilo y el fix debe ser mínimo.

| THEN | Evidencia |
| --- | --- |
| `cancelar mie 10:00` sin reserva → «no hay reserva mie 10:00» | ejecución real (`node src/app.js cancelar mie 10:00`) |
| `cancelar lun 10:00` con reserva → «cancelada lun 10:00» | ejecución real |
| `libres 10:00-12:00` sin regresión → «Sur» | ejecución real |

Validación en campo: 2026-11-25 · gate `node --test` 4 pasados, 0 fallos; los tres pasos de la tabla ejecutados con la CLI real. Sin pantalla: no hay verificación visual.
