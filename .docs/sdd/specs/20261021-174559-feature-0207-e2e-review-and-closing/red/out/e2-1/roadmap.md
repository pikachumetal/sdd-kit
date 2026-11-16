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
| Los tests comparten el almacén de reservas en memoria y pueden pisarse; la feature 0010 lo esquivó con el ruling `node --test --test-concurrency=1` (no aplicado en el gate; la suite pasa 5/5 sin él). Origen: [feature 0010](specs/20261008-100000-feature-0010-cancel-reason/tasks.md), 2026-10-21 | Bajo | Aislar el almacén por test y retirar el ruling |
| La suite E2E tarda ~48 s con traza completa frente al presupuesto de 0,5 min de `operations.md` (cada paso espera 6 s). Origen: [feature 0010](specs/20261008-100000-feature-0010-cancel-reason/), 2026-10-21 | Bajo | Recortar la espera por paso o subir el presupuesto |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
