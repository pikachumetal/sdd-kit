# Tasks — 0035 Horas reservadas por sala

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — `Rooms.Hours` | hecha | 15a7812 |

## Rulings

- Task 1: Ruling: trabajo en el sitio, sin worktree nuevo — la rama feature/0035-room-hours-cs ya está aislada de main y el perfil es delegate — si falla, solo se pierde el aislamiento extra
- Task 1: Ruling: base de integración comprobada contra develop y main, sin cambios en ROADMAP ni en ficheros de la task
- Final: Ruling: Hours de una sala desconocida devuelve «<sala>: 0 h» — la spec no define el caso y una persona espera 0 horas, no un error — si falla, habría que añadir validación de sala

Revisión final: autorrevisión del hilo (sin herramienta de subagentes) · Spec y Código sin hallazgos · Arquitectura no (plan), sobre 15a7812
