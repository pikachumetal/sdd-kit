# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` devuelve también salas de plantas inferiores (`floors[room] <= floor` en `roomsOnFloor` debería ser `===`); reproducido: `--planta 2` → `Norte (planta 1)`. Origen: [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) §2 | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| Exportación CSV pierde tildes (`d?a`) desde la 1.4.2 — [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) §1 | Medio | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo: `node src/app.js exportar` emite `día` en UTF-8 correcto; probable entorno de quien lo abre (p. ej. Excel/consola sin UTF-8) o versión 1.4.2 que no está en este repo |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
