# Roadmap — salas

## Release 0.4.0 — en preparación

Scope decidido el 2026-09-12. Replanificada el 2026-09-22 con el triaje de [notas de uso](feedback/usage-notes.md). Ids de secuencia reservados al abrir la release. Las peticiones se agrupan **por temática, no por orden de llegada**: cada nota va a la task de su tema, para que lo que hay que decidir junto no se contradiga.

| id | Task | Ficheros que toca | Estado |
| --- | --- | --- | --- |
| 0005 | **Reserva recurrente semanal** — repetir una reserva cada semana hasta una fecha de fin; la cancelación de una ocurrencia no borra las demás ([walkthrough](specs/20260915-090000-task-0005-recurring/walkthrough.md)) | `src/recurring.js`, `src/app.js` | ✅ |
| 0006 | **Avisos por correo antes de la reserva** — un correo 30 minutos antes de cada reserva, con la sala y la franja | `src/notify.js`, `src/app.js` | 🔄 en curso (rama `feature/0006`) |
| 0007 | **Calendario `.ics`** — exportar las reservas propias a un fichero `.ics` e importar reservas desde un `.ics`, con las horas en la zona horaria de Madrid | `src/ics.js` | ⏳ |
| 0009 | **Recurrencia semanal por número de repeticiones** — además de fecha de fin, poder acabar la recurrencia tras N repeticiones | `src/recurring.js` | ⏳ |
| 0010 | **Aviso por correo al cancelar** — `depende de: 0006`, tras ella: correo de confirmación al cancelar una reserva, igual que el aviso previo | `src/notify.js` | ⏳ |

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
