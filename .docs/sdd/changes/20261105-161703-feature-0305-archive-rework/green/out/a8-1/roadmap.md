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
| `src/app.js` pasó de CRLF a LF en el fix de validación de la [0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md); el resto del repo está en CRLF y no hay `.gitattributes` | Bajo: el diff de ese fix sale de 48/48 líneas por una real | Decidir la convención de finales de línea con un `.gitattributes` y renormalizar, en un commit aparte |
| El recorte del motivo no está en la spec ni en la capacidad `bookings` (la [0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md) lo añadió al validar) | Bajo: el comportamiento existe y tiene test, pero no está documentado | Que el dev-lead enmiende la spec y se fusione el delta |
| «Sin `--motivo`» no tiene test propio (0010) | Bajo: funciona, comprobado con ejecución real | Patch cuando moleste |
| Los tests comparten el almacén de reservas en memoria y corren con `--test-concurrency=1` (ruling de la 0010) | Bajo: la suite tarda el doble | Aislar el almacén por test |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
