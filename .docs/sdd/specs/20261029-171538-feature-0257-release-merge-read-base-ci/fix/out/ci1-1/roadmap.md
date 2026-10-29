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
| Gate de la 0010 con `--test-concurrency=1` como workaround de una carrera sobre el almacén en memoria que no se reprodujo (`node --test` sin la bandera pasa 5/5): quitar la bandera o aislar el almacén por test. Origen: [feature 0010, 2026-10-29](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | Bajo | Patch cuando moleste |
| Los tests de `canceladas` dependen del estado que deja el test de cancelar (almacén compartido, orden de ejecución). Origen: [feature 0010, 2026-10-29](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | Bajo | Aislar el almacén por test |
| CI de la base (`ci.yml`, rama `develop`) en rojo en 1860c29426de626116a6b89ad9fb5d8c3cb047f2, detectado al cerrar la feature 0010 (2026-10-29); causa sin investigar. Bloquea fusionar en `develop` | Alto | Patch que arregle el CI de `develop` |
| Falta test de suite del THEN «sin `--motivo`» de `bookings` (solo verificado por smoke). Origen: [feature 0010, 2026-10-29](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) | Bajo | Patch cuando moleste |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
