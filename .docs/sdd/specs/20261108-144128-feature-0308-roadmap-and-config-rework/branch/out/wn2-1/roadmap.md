# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0020 | Filtrar salas por aforo: `libres --aforo 8` lista solo las que caben | ⏳ |
| 0021 | Recordatorio al cancelar: avisa a quien estaba en espera | ⏳ |
| 0030 | Cobro a externos — partida en 0031, 0032 y 0033 | ⏳ |
| 0031 | Cobro: tarifa por sala — `parent: 0030` | ⏳ |
| 0032 | Cobro: factura mensual — `parent: 0030`, tras 0031 | ⏳ |
| 0033 | Cobro: recibo por correo — `parent: 0030` | ⏳ |

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

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
