---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7bbb3d1 | |
| 2 | Listado de canceladas | done | 72945a7 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` en verde (RED visto: 3 tests fallaban por feature ausente)
- [x] Task 2 — `node --test test/cancel.test.js` en verde (RED visto: `canceladas` respondía «salas»)

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| `const bookings =[` sin espacio (de la Task 1) | descuido de edición | corregido en la revisión final | eb2ddb0 |

## Revisión

Revisión final: self-review (sin herramienta de subagentes) + sesión Native, limpia tras 1 hallazgo de formato corregido, sobre 72945a7
Pasada de fix: eb2ddb0, 1 hallazgo de formato (sin cambio de conducta, no aplica RED)

## Rulings

- Pre-flight: sin `--motivo`, `cancelar` responde la lista de motivos (la spec dice «pide un motivo»; no da THEN para su ausencia); «sin reserva» se comprueba antes. Coste si falla: quien cancelaba sin motivo recibe el error de la lista.
- Task 1: el test «cancelar una reserva activa» pasa a llevar `--motivo`: es el escenario de la spec y `bookings` es estado de módulo (el test viejo consumía el GIVEN).
- Final: el motivo se valida tras comprobar que hay reserva; «sin reserva» sigue siendo lo primero que se dice.
- Final: los blobs base de `src/app.js` y `test/cancel.test.js` están en CRLF y con `core.autocrlf=true` git los guarda en LF: el diff muestra el fichero entero cambiado; no se toca la configuración del repo.

## Deferred minors

- `canceladas` sin canceladas imprime una línea vacía (la spec no da THEN).
- El estado vive en memoria por proceso: por la CLI, `canceladas` en otra invocación sale vacío; lo cubre 0014 «Motivo guardado».
