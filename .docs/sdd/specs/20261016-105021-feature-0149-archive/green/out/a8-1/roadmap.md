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
| Workaround `--test-concurrency=1` en el gate: los tests comparten el almacén en memoria y dependen del orden (descubierto en la [0010](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Medio: la suite tarda el doble | Aislar el almacén por test y quitar la opción |
| Sin test del recorte de espacios del motivo ni del `cancelar` sin `--motivo`; el `trim()` no está en la spec (0010, `d2258a5`) | Medio | Test + enmienda de la spec, o deshacer el `trim()` |
| Finales de línea mezclados: `src/app.js` en LF, el resto en CRLF, sin `.gitattributes` (0010) | Bajo | Patch: `.gitattributes` y normalizar |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
