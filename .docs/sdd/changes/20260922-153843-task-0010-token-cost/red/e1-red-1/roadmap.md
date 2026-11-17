# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0008 | Avisos por correo antes de la reserva | ⏳ |
| 0009 | Validar el formato de la franja horaria (`HH:MM-HH:MM`) en `libres` y `reservar`: si viene mal, mensaje de error en castellano y no se consulta ni se reserva nada | ✅ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| La capacidad `room-booking` no está declarada en ninguna spec ("Decisiones que he tomado yo"); el delta de la task 0009 no se pudo fusionar en `capabilities/` | Bajo | La próxima spec que toque `room-booking` la declara y arrastra el delta de la task 0009 |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
