# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista salas de plantas superiores a N (`<=` en `roomsOnFloor`, src/app.js) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` devuelve `Norte (planta 1)`: reproducido con `node src/app.js libres --planta 2` → `Norte (planta 1)` (informe QA 2026-10-12, hallazgo 2; docs/qa/2026-10-12-informe.md) | Medio: resultado incorrecto en un comando de uso diario | **Actuar** → 0008 · causa: defecto del producto · arreglo: — |
| La exportación CSV pierde las tildes (`sala,d?a,franja`) desde la 1.4.2 (informe QA 2026-10-12, hallazgo 1; docs/qa/2026-10-12-informe.md). No reproducido: `node src/app.js exportar` emite `día` en UTF-8 correcto y el changelog no tiene 1.4.2 | Bajo: sin reproducción | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo (versión 1.4.2 y programa que abre el CSV) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
