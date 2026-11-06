# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0010 | **Motivo al cancelar**: al cancelar una reserva se elige un motivo de una lista, y el listado de canceladas lo enseña | ✅ |
| 0011 | **Anular reservas de otros**: solo el responsable de cada sala anula reservas de otras personas | ⏳ |
| 0012 | **Informe de canceladas**: `informe` lista las reservas canceladas por sala, con su motivo y el total | ⏳ |
| 0013 | **Precio en su módulo**: el cálculo del precio sale de `app.js` sin cambiar lo que responde `precio` | ⏳ |
| 0014 | **Motivo guardado**: el motivo de una cancelación se guarda en el almacén de reservas | ⏳ |
| 1 | Avisos por correo antes de la reserva | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Sin test para «cancelar sin `--motivo`» (THEN de la feature 0010): solo lo cubrió el smoke del cierre ([walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Bajo | Añadir el test en `test/cancel.test.js` |
| `test/cancel.test.js`: el test de `canceladas` depende del estado que deja el de cancelar (acoplamiento de orden; el Ruling de `--test-concurrency=1` de la 0010 nunca se aplicó) | Bajo | Aislar el almacén por test |
| `package.json` no figura en los `inputs` de ninguna tarea de `gate.json`: con `--affected`, un cambio solo ahí no dispara tests | Bajo | Añadirlo a los `inputs` de `bookings:test` |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
