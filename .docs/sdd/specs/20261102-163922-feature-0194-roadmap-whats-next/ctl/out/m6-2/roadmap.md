# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |
| 0008 | Patch: `salas libres --planta N` lista salas de plantas inferiores (`floors[room] <= floor` debería ser `===`; informe QA 2026-10-12, hallazgo 2) | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |
| La exportación a CSV pierde las tildes desde la 1.4.2 (cabecera `sala,d?a,franja`; informe QA 2026-10-12, hallazgo 1) | Medio | **Esperar 2.º ticket** · causa: sin determinar — falta reproducirlo: `node src/app.js exportar` emite UTF-8 correcto (`dÃ­a`); preguntar a QA con qué se abre el CSV |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
