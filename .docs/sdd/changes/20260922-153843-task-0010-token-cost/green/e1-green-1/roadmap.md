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
| La spec de la task 0009 declara un delta sobre la capacidad `room-booking` sin declararla en "Decisiones que he tomado yo": `capabilities/room-booking.md` no se ha creado | Bajo | Declarar la capacidad en la próxima spec que toque reservas y fusionar el delta pendiente |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
