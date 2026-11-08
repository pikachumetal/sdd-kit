# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista salas de plantas inferiores; `roomsOnFloor` debe filtrar por igualdad de planta (`===`), no `<=` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` devuelve `Norte (planta 1)`: `roomsOnFloor` usa `<=` (reproducido con `node src/app.js libres --planta 2`; el arreglo del informe QA, `<`, no basta: seguiría devolviendo la planta 1; hace falta `===`) — [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) #2 | Medio: resultado erróneo visible al usuario | **Actuar** → 0008 · causa: defecto del producto · arreglo: — |
| La exportación a CSV pierde las tildes desde la 1.4.2 (`sala,d?a,franja`); no reproducido: `node src/app.js exportar` emite UTF-8 correcto, así que puede ser la consola o el programa que abre el CSV — [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) #1 | Medio: tildes ilegibles para quien exporta | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo (versión, SO y programa con que se abre el CSV) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
