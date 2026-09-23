# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0008 | Avisos por correo antes de la reserva. Al integrar, incorporar la corrección de la hora 24 hecha en `src/slots.js` por la task 0009 | ⏳ |
| 0009 | Validar el formato de la franja horaria (`HH:MM-HH:MM`) en `libres` y `reservar`: si viene mal, mensaje de error en castellano y no se consulta ni se reserva nada | 🧪 validación diferida a uso en producción |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| ~~Sin validación del formato de franja horaria~~ — saldada por [task 0009](specs/20260921-090000-task-0009-slot-format/) | Bajo | — |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
