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
| Workaround del gate: `node --test --test-concurrency=1` esquiva la carrera de los tests sobre el almacén de reservas compartido en memoria (ruling de la Task 2, [tasks.md](specs/20261008-100000-feature-0010-cancel-reason/tasks.md)); la suite tarda el doble. Descubierta en la feature 0010, 2026-10-28 | Medio | Aislar el almacén por test y volver a `node --test` |
| Sin test del recorte de espacios del motivo (`.trim()` en `reasonOf`) ni del caso «sin `--motivo`», y el recorte no consta en la spec ni en la capacidad `bookings`. Descubierta en la feature 0010, 2026-10-28 ([walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Medio | Patch: test RED→GREEN y enmienda del requisito |
| `canceladas` sale vacío entre invocaciones de la CLI: las reservas viven en memoria y no sobreviven al proceso. Descubierta en la feature 0010, 2026-10-28 ([walkthrough](specs/20261008-100000-feature-0010-cancel-reason/walkthrough.md)) | Alto | Lo cubre la 0014 (Motivo guardado) |
| Sin `.gitattributes`: un commit de la feature 0010 convirtió los finales de línea de todo `src/app.js` de CRLF a LF. Descubierta 2026-10-28 | Bajo | Fijar los finales de línea con `.gitattributes` |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
