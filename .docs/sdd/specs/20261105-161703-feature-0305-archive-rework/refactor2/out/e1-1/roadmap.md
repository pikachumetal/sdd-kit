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
| `test/cancel.test.js`: `canceladas enseña sala, día y motivo` solo pasa si antes corrió `cancelar con un motivo de la lista` (estado compartido en el fichero; `operations.md` §Datos lo prohíbe). Descubierta en la 0010, que la atribuyó por error a una carrera entre ficheros y no se arregla con `--test-concurrency=1` ([walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Medio: un test aislado con `--test-name-pattern` falla | Patch: que el test cree su propia cancelación |
| La suite E2E tarda 49 s frente al «Presupuesto E2E» de `operations.md` (0,5 min = 30 s): cada paso espera 6 s con la traza completa. Medido en el cierre de la 0010, 2026-11-05 | Bajo | Subir el presupuesto o aligerar la traza, lo decide el dev-lead |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
