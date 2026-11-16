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
| Los tests de `cancel.test.js` comparten el almacén en memoria: el de `canceladas` solo pasa si antes corre el de `cancelar` (el workaround `--test-concurrency=1` del ruling de la 0010 no llegó a la rama) — [walkthrough 0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | Bajo | Aislar el almacén por test |
| Sin test de «sin reserva» al cancelar con un motivo válido: la 0010 sustituyó el que había y el código sigue respondiendo `sin reserva <sala> <día>` — [walkthrough 0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | Bajo | Patch con su test |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
