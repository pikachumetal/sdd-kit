---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`). Una task cerrada que cambia por una enmienda no se reabre: lleva en «Notas» `afectada por enmienda <fecha> → Task N`, y la Task N nueva hace el trabajo; si la enmienda solo cambia la task en curso, sigue en ella con la nota.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | cf23ea5 | |
| 2 | Listado de canceladas | done | 79d7b09 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

Revisión final: autorrevisión (sin herramienta de subagentes en la sesión) — Spec limpio · Código limpio, 1 minor diferido · Arquitectura limpio (subido: dato nuevo en la reserva), sobre 79d7b09

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Setup: Ruling: trabajo en sitio sobre feature/0010-cancel-reason, sin worktree nuevo — el dev-lead está fuera y no declaró preferencia de worktree; la rama no es main — si se quería aislar, el trabajo queda en la misma rama y no hay que moverlo.
- Task 1: Ruling: sustituyo el test existente «cancelar una reserva activa» (esperaba `cancelada Norte lun` sin motivo) por los tests del requisito, y «cancelar sin reserva lo dice» pasa `--motivo otro` — la spec manda que sin `--motivo` responda «motivo no válido…» — si se quería conservar cancelar sin motivo, es una enmienda de la spec y se revierte el test.
- Task 1: Ruling: el motivo se valida antes de buscar la reserva (sin motivo válido, «motivo no válido» aunque no haya reserva) — la spec dice «sin --motivo responde lo mismo» sin condición — si se quería «sin reserva» primero, cambia el orden de dos líneas y un test.
- Task 2: Ruling: `canceladas` lista una línea por reserva cancelada (`<sala> <día> — <motivo>`, separadas por salto de línea) y responde vacío si no hay ninguna; las anuladas (`voided`) no salen — la spec solo fija el caso de una cancelada y deja las anulaciones fuera (0011) — si se quería un texto para la lista vacía, es una línea más y su test.
- Task 2: Ruling: el test de `canceladas` hace su propio GIVEN (cancela Norte lun con «sala ocupada») porque el estado del módulo se comparte entre los tests del fichero — si se ejecuta en orden, la cancelación repetida responde «sin reserva» sin cambiar el estado; coste: ninguno en el resultado.
- Final: Ruling: Eje Arquitectura (sin línea) → sí — el diff añade un dato a la reserva y la spec ya lo marcaba como señal — coste si sobraba: una pasada más de autorrevisión.
- Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF en el índice (el resto del repo está en CRLF, sin .gitattributes) — el diff lo muestra reescrito entero y pierde el blame de 3 líneas; sin efecto en el comportamiento.
- Final: minor (deferred): `canceladas` sin ninguna cancelada imprime una línea vacía; la spec no fija ese caso.
- Final: Ruling: (declinado) el motivo se compara exacto, «Sala ocupada» con mayúscula se rechaza — la lista es cerrada por decisión con el dev-lead y el rechazo enseña los valores válidos — coste si se quería tolerancia: normalizar en una línea y un test.
- Final: Ruling: (declinado) cancelar sin `--motivo` deja de funcionar para quien lo usaba así — lo manda la spec («sin --motivo responde lo mismo») — coste: lo anota el changelog en el cierre.
- Final: Ruling: en el borrador de cierre cambio «Capacidades» de la spec de «Modificadas: bookings» a «Nuevas: bookings» (sin commitear) — `sdd capability merge` falla porque el proyecto no tiene `capabilities/` y la spec la declaraba modificada; no toca requisitos, THEN, Scope ni «Dónde se prueba» — si el dev-lead prefería otra clasificación o nombre, se revierte una línea y el fichero `capabilities/bookings.md`.
