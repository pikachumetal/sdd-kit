# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista también salas de plantas inferiores (`floors[room] <= floor` en `roomsOnFloor`); debe listar solo la planta pedida | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` devuelve `Norte (planta 1)`: `roomsOnFloor` filtra con `<=` en vez de igualdad. Reproducido el 2026-10-13 con `node src/app.js libres --planta 2` → `Norte (planta 1)`. Origen: [informe de QA 2026-10-12](../qa/2026-10-12-informe.md), hallazgo 2 | Medio: devuelve salas de otra planta | **Actuar**: patch 0008 |
| La exportación a CSV pierde las tildes desde la 1.4.2 (cabecera `sala,d?a,franja`). No reproducido el 2026-10-13: `node src/app.js exportar` emite `día` en UTF-8 válido (bytes `c3 ad`), y la 1.4.2 no existe (última publicada: 1.4.1). Origen: [informe de QA 2026-10-12](../qa/2026-10-12-informe.md), hallazgo 1 | Medio: si es real, rompe la exportación | **Esperar 2.º ticket**: falta reproducirlo (versión y terminal/Excel del caso) o un segundo caso |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
