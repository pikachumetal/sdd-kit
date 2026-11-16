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
| `test/ids.test.js` falla la primera vez en un clon limpio de `develop` (`TypeError … 'trim'`): depende de `ids-store` en el git-common-dir, que comparten todos los worktrees — hallado en la [feature 0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md), 2026-11-05 | Medio: un rojo falso en la primera suite de cada clon | Patch: test hermético, con su propio almacén temporal |
| `test/cancel.test.js`: «canceladas enseña sala, día y motivo» depende de que corra antes el test de `cancelar` (almacén en memoria del módulo); un `canceladas` en otro proceso sale vacío — hallado en la [feature 0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md), 2026-11-05 | Bajo | Aislar el almacén por test; la persistencia real es la 0014 |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
