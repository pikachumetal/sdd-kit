# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` devuelve también salas de plantas inferiores (`roomsOnFloor` usa `<=` en vez de `===`; reproducido: `--planta 2` → `Norte (planta 1)`). Origen: docs/qa/2026-10-12-informe.md §2 | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| CSV pierde las tildes (`sala,d?a,franja`), informe QA docs/qa/2026-10-12-informe.md §1 | Medio | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo: `node src/app.js exportar` emite UTF-8 correcto; el informe cita la 1.4.2 y el proyecto va por v0.3.0; probable lector sin BOM/codificación |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
