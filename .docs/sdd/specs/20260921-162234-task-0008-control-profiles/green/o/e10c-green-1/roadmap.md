# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0010 | Listar mis reservas (`salas mias`) | 🧪 validación diferida a la próxima release |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.4.0 (2026-09-22)

Formato de franja horaria validado en `libres`/`reservar`, listado de reservas propias (`salas mias`), reserva recurrente semanal, listado de salas libres por franja y fix de cancelación por día. [changelog](changelog.md)

smoke: 2026-09-22 · 0 hallazgos (suite `node --test`, 6/6 verde; prueba manual de franja en `libres`; 0 corregidos en la release)

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
