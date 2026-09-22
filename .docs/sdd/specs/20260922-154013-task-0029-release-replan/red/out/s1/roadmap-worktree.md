# Roadmap — salas

## Release 0.4.0 — en preparación

Scope decidido el 2026-09-12. Ids de secuencia reservados al abrir la release. Las peticiones se agrupan **por temática, no por orden de llegada**: cada nota va a la task de su tema, para que lo que hay que decidir junto no se contradiga.

| id | Task | Ficheros que toca | Estado |
| --- | --- | --- | --- |
| 0005 | **Reserva recurrente semanal** — repetir una reserva cada semana hasta una fecha de fin; la cancelación de una ocurrencia no borra las demás ([walkthrough](specs/20260915-090000-task-0005-recurring/walkthrough.md)) | `src/recurring.js`, `src/app.js` | ✅ |
| 0006 | **Avisos por correo antes de la reserva** — un correo 30 minutos antes de cada reserva, con la sala y la franja. Amplía a: correo de confirmación al cancelar una reserva (nota [usage-notes.md](feedback/usage-notes.md), 2026-09-22) | `src/notify.js`, `src/app.js` | 🔄 en curso (rama `feature/0006`) |
| 0007 | **Calendario `.ics`** — exportar las reservas propias a un fichero `.ics` e importar reservas desde un `.ics`. Las horas exportadas deben llevar la zona horaria de Madrid (nota [usage-notes.md](feedback/usage-notes.md), 2026-09-22) | `src/ics.js` | ⏳ |
| 0008 | **Recurrencia semanal por número de repeticiones** — alternativa a `--hasta <fecha>`: terminar la recurrencia tras N ocurrencias (nota [usage-notes.md](feedback/usage-notes.md), 2026-09-22) | `src/recurring.js` | ⏳ |

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
