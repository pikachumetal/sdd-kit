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
| `src/slots.js` creado en paralelo en las tasks 0008 y 0009, en worktrees distintos | Medio | Resolver el fichero al fusionar (ver walkthrough 0009) |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
