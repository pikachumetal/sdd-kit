# Roadmap — salas

## Release 0.4.0 — en preparación

Scope decidido el 2026-09-12. Ids de secuencia reservados al abrir la release.

| id | Task | Ficheros que toca | Estado |
| --- | --- | --- | --- |
| 0005 | **Reserva recurrente semanal** — repetir una reserva cada semana hasta una fecha de fin; la cancelación de una ocurrencia no borra las demás ([walkthrough](specs/20260915-090000-task-0005-recurring/walkthrough.md)) | `src/recurring.js`, `src/app.js` | ✅ |
| 0006 | **Avisos por correo antes de la reserva** — un correo 30 minutos antes de cada reserva, con la sala y la franja | `src/notify.js`, `src/app.js` | 🔄 en curso (rama `feature/0006`) |
| 0009 | **Fin de recurrencia por número de repeticiones** — además de `--hasta <fecha>`, poder cerrar la recurrencia con `--repeticiones <n>` | `src/recurring.js`, `src/app.js` | ⏳ |
| 0010 | **Aviso por correo al cancelar una reserva** — mismo mecanismo de aviso que 0006, disparado también al cancelar | `src/notify.js`, `src/app.js` | ⏳ 🔒 depende de que 0006 esté cerrada |
| 0007 | **Exportar reservas propias a `.ics`** | `src/ics.js` | ⏳ |
| 0008 | **Importar reservas desde un `.ics`** | `src/ics.js` | ⏳ 🔒 depende del formato fijado en 0007 |

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
