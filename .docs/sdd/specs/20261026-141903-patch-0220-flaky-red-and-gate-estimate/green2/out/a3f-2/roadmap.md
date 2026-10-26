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
| Tests sin aislamiento: comparten el almacén de reservas en memoria y `canceladas` depende de que `cancelar` corra antes (Feature 0010, 2026-10-26; workaround `--test-concurrency=1` de la Task 2, sin dejar en ningún fichero: [walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Medio | Aislar el almacén por test y no depender del orden |
| Test flaky `test/ids.test.js` «una reserva nueva lleva su id»: `TypeError: Cannot read properties of undefined (reading 'trim')` en la primera pasada sobre un clon sin `ids-store` en el directorio común de git (lo lee y lo crea él mismo); verde en 10 pasadas posteriores y en `develop` (Feature 0010, 2026-10-26: [walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Medio | Que el test cree su propio estado en un directorio temporal |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
