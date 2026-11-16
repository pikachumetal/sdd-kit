# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | fe8ce3f |
| 2 — Listado de canceladas | hecha | d5d878d |

Revisión final: autorevisión (sin herramienta de subagentes), Arquitectura no (plan), sobre 3a973e1

## Rulings

- Trabajo en el sitio en la rama de la feature, sin worktree nuevo (coste si falla: ninguno).
- Sin tipo sdd-kit:effort-<level> en el harness: la revisión hereda el esfuerzo de la sesión.
- Sin motivo ni reserva, cancelar responde «motivo no válido» (motivo primero); coste: mensaje distinto en ese borde.
- Commit de estilo que restaura CRLF de test/cancel.test.js, revisado en el hilo.

## Deferred minors

- Los tests de test/cancel.test.js dependen del orden (estado de módulo, sin reset).
