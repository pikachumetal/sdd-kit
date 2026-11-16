# Tasks — 0016 Horas reservadas por sala

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Comando `horas` | hecha | 023b129 |

Revisión final: autorrevisión del hilo (sin herramienta de subagentes) · Spec sin hallazgos · Código sin hallazgos · Arquitectura no (sin señales en el diff), sobre df80180

## Rulings

- Task 1: trabajo en la rama feature/0016-room-hours sin crear otro worktree — el dev-lead la dejó abierta con el commit de apertura — si es error, mover la rama a un worktree
- Final: sala desconocida responde `<sala>: 0 h` — la spec no la cubre y una persona esperaría 0 h, no un error — si es error, añadir una THEN en la spec
