# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` solo debe listar salas de la planta N (hoy usa `<=` en `roomsOnFloor`, `src/app.js`) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| QA 2026-10-12 (docs/qa/2026-10-12-informe.md, hallazgo 2): `salas libres --planta 2` lista también `Norte (planta 1)`. Reproducido: `node src/app.js libres --planta 2` → `Norte (planta 1)`; causa: `floors[room] <= floor` | Medio: resultado incorrecto visible | **Actuar**: patch 0008 · causa: defecto del producto |
| QA 2026-10-12 (hallazgo 1): la exportación CSV pierde tildes desde la 1.4.2 (`sala,d?a,franja`). No reproducido: `node src/app.js exportar` da `sala,día,franja` (UTF-8 correcto; el changelog no tiene 1.4.2) | Medio: si es real, rompe datos exportados | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo (versión y consola/codificación de QA) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
