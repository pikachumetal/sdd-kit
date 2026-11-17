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
| Test flaky `test/ids.test.js` («una reserva nueva lleva su id»): guarda estado en `<git-common-dir>/ids-store` y falla la primera pasada (`TypeError … reading 'trim'`); verde sin la rama y verde otra vez en la rama ([walkthrough 0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Medio: un rojo falso en el gate | Aislar el estado por test |
| Workaround `--test-concurrency=1` (ruling de la 0010) para la carrera sobre el almacén compartido en memoria; no está configurado en el repo ([walkthrough 0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Bajo: la suite tarda el doble | Aislar el almacén por test y quitar el flag |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
