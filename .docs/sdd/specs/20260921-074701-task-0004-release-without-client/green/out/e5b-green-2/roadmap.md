# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Avisos por correo antes de la reserva | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.5.0 (2026-09-21)

Reserva recurrente semanal, salas libres por franja y fix de la cancelación entre días. [changelog](changelog.md)
smoke: 2026-09-21 · 0 hallazgos (suite 3/3 + uso real de `libres`, `reservar --cada-semana` y `cancelar`; 0 corregidos en la release)

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
