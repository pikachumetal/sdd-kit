# Roadmap — salas

## Próximo

| # | Ítem | Ficheros que toca | Estado |
| --- | --- | --- | --- |
| 0008 | Avisos por correo antes de la reserva | `src/notify.js` | 🔄 en curso (worktree `0008`) |
| 0009 | Validar el formato de la franja horaria (`HH:MM-HH:MM`) en `libres` y `reservar`: si viene mal, mensaje de error en castellano y no se consulta ni se reserva nada | `src/app.js`, `test/app.test.js` | ✅ |
| 0010 | Auditoría completa: guardar el usuario y los argumentos de cada operación y exportar el log a CSV | `src/audit.js`, `src/export.js` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
