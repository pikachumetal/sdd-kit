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
| Suite E2E de 48,2 s sobre un presupuesto de 0,5 min (`operations.md`); descubierta al cerrar la 0010 (2026-10-21), [walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | Medio: el cierre y el merge esperan casi un minuto | Triar: acortar los pasos del runner o subir el presupuesto con el dev-lead |
| Workaround sin aplicar de la 0010: `--test-concurrency=1` para una carrera de los tests sobre el almacén compartido en memoria (Ruling de la Task 2, [tasks.md](specs/20261008-100000-feature-0010-cancel-reason/tasks.md)); no está en `operations.md` ni en `package.json` | Medio: la carrera puede dar rojos intermitentes | Aislar el almacén por test y descartar el workaround |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
