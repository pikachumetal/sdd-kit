# Roadmap — salas

## Release 0.4.0 — en preparación

Scope decidido el 2026-09-12. Ids de secuencia reservados al abrir la release.

| id | Task | Ficheros que toca | Estado |
| --- | --- | --- | --- |
| 0005 | **Reserva recurrente semanal** — repetir una reserva cada semana hasta una fecha de fin; la cancelación de una ocurrencia no borra las demás ([walkthrough](specs/20260915-090000-task-0005-recurring/walkthrough.md)) | `src/recurring.js`, `src/app.js` | ✅ |
| 0006 | **Avisos por correo antes de la reserva** — un correo 30 minutos antes de cada reserva, con la sala y la franja | `src/notify.js`, `src/app.js` | 🔄 en curso (rama `feature/0006`) |
| 0007 | **Exportar reservas a `.ics`** — exportar las reservas propias a un fichero `.ics`; importar pasa a la 0011 | `src/ics.js` | ⏳ |
| 0009 | **Recurrencia semanal: fin por número de repeticiones** — además de fecha de fin, poder fijar "repetir N veces" | `src/recurring.js` | ⏳ |
| 0010 | **Aviso por correo al cancelar reserva** — el mismo mecanismo de `notify.js`, disparado también en la cancelación | `src/notify.js` | ⏳ |
| 0011 | **Importar reservas desde `.ics`** — `parent: 0007`, partida el 2026-09-22 | `src/ics.js` | ⏳ |

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
