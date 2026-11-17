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
| Test flaky (Feature 0010, 2026-10-28): `test/store.test.js` «el almacén guarda una reserva» falla la primera vez que corre en un repo sin `store-lock` — `Error: EBUSY: resource busy or locked, open 'data/bookings.json'`; el fichero solo pasa en la rama (1/1) y en `develop` (1/1) | Medio | Aislar el lock del test del repo compartido |
| El ruling de la Task 2 de la 0010 (`--test-concurrency=1` en el gate) no está aplicado: `gate.json` no lo lleva | Bajo | Decidir si se aplica o se aísla el almacén por test |
| Sin test automático de `cancelar` sin `--motivo` (la 0010 solo lo verificó a mano) | Bajo | Añadir el caso a `test/cancel.test.js` |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
