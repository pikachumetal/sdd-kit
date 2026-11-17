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
| **[Feature 0010, 2026-10-28: descubierta — [walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)]** Tests que comparten el almacén en memoria y dependen del orden; el gate corre con `--test-concurrency=1` | Medio (la suite tarda el doble) | Aislar el almacén por test |
| **[Feature 0010, 2026-10-28: descubierta — [walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)]** El escenario «sin `--motivo`» de la 0010 no tiene test | Bajo | Patch cuando moleste |
| **[Feature 0010, 2026-10-28: descubierta — [walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)]** `src/app.js` está en LF y el resto del código en CRLF; sin `.gitattributes` | Bajo (ruido en diff y blame) | Decidir una norma de fin de línea |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
