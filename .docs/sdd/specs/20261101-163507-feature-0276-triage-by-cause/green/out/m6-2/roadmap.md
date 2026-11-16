# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` devuelve también las salas de plantas inferiores (`<=` en `roomsOnFloor`, debería ser igualdad) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` lista `Norte (planta 1)`: [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) #2 | Medio: resultado erróneo en una consulta de uso normal | **Actuar** → 0008 · causa: defecto del producto · arreglo: — |
| Exportación CSV pierde las tildes desde la 1.4.2 (`sala,d?a,franja`): [informe QA 2026-10-12](../../docs/qa/2026-10-12-informe.md) #1. No reproducido: `node src/app.js exportar` emite `sala,día,franja` en UTF-8 correcto | Medio: datos corruptos en la exportación, si se confirma | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo (dónde se abre el CSV, sistema y codificación) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
