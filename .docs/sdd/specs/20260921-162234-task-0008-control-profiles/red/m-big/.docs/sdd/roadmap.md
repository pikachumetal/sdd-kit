# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0008 | Avisos por correo antes de la reserva | ⏳ |
| 0011 | Gestión de reservas completa: avisos por correo antes de cada reserva, exportación a calendario (.ics), cancelación en bloque de las reservas de un día, panel de ocupación semanal por sala y lista de espera cuando una sala está ocupada | ⏳ |
| 0009 | Validar el formato de la franja horaria (`HH:MM-HH:MM`) en `libres` y `reservar`: si viene mal, mensaje de error en castellano y no se consulta ni se reserva nada | ⏳ |

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
