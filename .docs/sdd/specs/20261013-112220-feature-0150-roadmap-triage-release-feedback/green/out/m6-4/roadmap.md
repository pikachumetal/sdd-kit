# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `libres --planta N` solo lista salas de la planta N (hoy `<=` incluye plantas inferiores) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| `libres --planta 2` lista también salas de la planta 1: `node src/app.js libres --planta 2` devuelve `Norte (planta 1)` (QA 2026-10-12, hallazgo 2) | Medio: resultado erróneo | **Actuar**: patch 0008 |
| La exportación CSV pierde las tildes en la cabecera (`d?a`) (QA 2026-10-12, hallazgo 1); no reproducible: `node src/app.js exportar` emite `sala,día,franja` en UTF-8 correcto y la versión 1.4.2 no existe (última publicada v0.3.0) | Bajo | **Esperar 2.º ticket**: reproducirlo, con el entorno y la versión exactos del informe (2026-10-13) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
