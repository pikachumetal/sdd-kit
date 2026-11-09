# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista salas de plantas inferiores; filtrar con `===` en `roomsOnFloor` (`src/app.js`), no con `<` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` devuelve `Norte (planta 1)` (QA 2026-10-12, [informe](../../docs/qa/2026-10-12-informe.md) §2). Evidencia: `node src/app.js libres --planta 2` → `Norte (planta 1)` | Medio | **Actuar** → 0008 · causa: defecto del producto · arreglo: — |
| La exportación a CSV pierde las tildes (QA 2026-10-12, [informe](../../docs/qa/2026-10-12-informe.md) §1) | Bajo | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo: `node src/app.js exportar` emite `sala,día,franja` en UTF-8 correcto; el informe cita la 1.4.2, que no consta en el changelog (última 1.4.1) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
