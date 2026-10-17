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
| Los tests comparten el almacén en memoria y dependen del orden; la suite necesita `--test-concurrency=1` (descubierta en la [0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Medio | Aislar el almacén por test |
| `src/app.js` pasó de CRLF a LF en el fix de la [0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) y el resto del repo sigue en CRLF, sin `.gitattributes` | Bajo | Decidir el fin de línea y renormalizar en un commit aparte |
| `cancelBooking` exportada no recorta el motivo; solo lo hace la línea de comandos ([0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Bajo | Mover el recorte a `cancelBooking` si tiene otro llamador |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
