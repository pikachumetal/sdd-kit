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
| `test/cancel.test.js`: el test de `canceladas` depende de que el anterior haya cancelado (almacén compartido en memoria) — origen: feature 0010, 2026-11-05 ([walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Bajo | Aislar el almacén por test |
| `package.json` no está entre los `inputs` de `bookings:test` en `gate.json`: un cambio solo ahí no la activa con `--affected` — origen: feature 0010, 2026-11-05 | Bajo | Añadirlo a los `inputs` |
| Sin test del escenario «cancelar sin `--motivo`» (la spec lo pide, el código lo cumple) — origen: feature 0010, 2026-11-05 | Bajo | Añadir el test |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
