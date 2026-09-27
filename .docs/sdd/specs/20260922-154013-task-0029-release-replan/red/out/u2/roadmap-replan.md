# Roadmap — salas

## Release 0.4.0 — en preparación

Scope decidido el 2026-09-12. Ids de secuencia reservados al abrir la release. Las peticiones se agrupan **por temática, no por orden de llegada**: cada nota va a la task de su tema, para que lo que hay que decidir junto no se contradiga.

| id | Task | Ficheros que toca | Estado |
| --- | --- | --- | --- |
| 0005 | **Reserva recurrente semanal** — repetir una reserva cada semana hasta una fecha de fin o hasta N repeticiones; la cancelación de una ocurrencia no borra las demás | `src/recurring.js`, `src/app.js` | 🔄 en curso (rama `feature/0005`) — spec ampliada, pendiente reaprobación |
| 0006 | **Avisos por correo antes de la reserva** — un correo 30 minutos antes de cada reserva, con la sala y la franja; correo de confirmación también al cancelar | `src/notify.js`, `src/app.js` | 🔄 en curso (rama `feature/0006`) |
| 0007 | **Calendario `.ics`** — exportar las reservas propias a un fichero `.ics` (con zona horaria de Madrid) e importar reservas desde un `.ics` | `src/ics.js` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Estadísticas de ocupación por sala | idea propia |

## Deuda técnica

| Deuda | Impacto | Plan |
| --- | --- | --- |
| Sin validación del formato de franja horaria | Bajo | Patch cuando moleste |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-18 | 0004 | La cancelación borraba reservas de otro día con la misma hora |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia (tasks 0001–0003). [changelog](changelog.md)
