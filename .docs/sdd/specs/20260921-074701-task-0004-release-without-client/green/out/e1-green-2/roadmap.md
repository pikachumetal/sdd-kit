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

### v0.4.0 (2026-09-21)

Reserva recurrente semanal, listado de salas libres por franja y fix de la cancelación (patch 0007). [changelog](changelog.md)

smoke: 2026-09-21 · 3 hallazgos (`node --test` con 0 tests; `reservar --cada-semana`, `libres 10:00-12:00` y `cancelar 10:00` solo imprimen `salas`: `src/app.js` no implementa 0005, 0006 ni 0007 y los dos commits de la release están vacíos; 0 corregidos en la release)

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
