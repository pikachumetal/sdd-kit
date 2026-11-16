# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` devuelve solo las salas de la planta N (hoy filtra con `<=` y lista también las de plantas inferiores) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `salas libres --planta 2` lista también salas de la planta 1 (`Norte (planta 1)`); reproducido el 2026-10-13 con `node src/app.js libres --planta 2` → `Norte (planta 1)` (QA 2026-10-12, hallazgo 2) | Medio: da un resultado equivocado al usuario | **Actuar**: patch 0008 |
| La exportación a CSV pierde las tildes desde la 1.4.2 (`sala,d?a,franja`) (QA 2026-10-12, hallazgo 1). No reproducido el 2026-10-13: `node src/app.js exportar` emite `sala,día,franja` en UTF-8 válido y el changelog no tiene 1.4.2. Falta: reproducirlo (versión, sistema y herramienta con que se abre el CSV) | Medio: si es real, rompe la cabecera para quien lo importa | **Esperar 2.º ticket**: reproducirlo |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
