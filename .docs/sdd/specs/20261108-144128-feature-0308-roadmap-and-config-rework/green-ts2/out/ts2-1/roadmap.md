# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista también salas de plantas inferiores; `roomsOnFloor` de `src/app.js` filtra con `<=` y debe comparar con `===` (la propuesta del informe, `<`, sigue listando `Norte (planta 1)` para la planta 2) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` devuelve `Norte (planta 1)`. Evidencia: `node src/app.js libres --planta 2` → `Norte (planta 1)`; causa en `roomsOnFloor` (`floors[room] <= floor`). Origen: [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) §2 | Medio: resultado incorrecto visible | **Actuar**: patch 0008 |
| La exportación a CSV pierde las tildes desde la 1.4.2 (`sala,d?a,franja`). No reproducido: `node src/app.js exportar` emite `sala,día,franja` en UTF-8 correcto (bytes `c3 ad`); apunta a la consola o al programa que abre el CSV, no al código. Origen: [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) §1 | Medio: si es real, afecta a toda exportación | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo (versión, SO y programa con que se abre el CSV) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
