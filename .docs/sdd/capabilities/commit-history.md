# Capacidad — commit-history

Verdad viva de la historia de la rama de una task o de un patch: qué commits quedan al fusionar y qué hash apuntan los artefactos. Esta capacidad la declaró la spec de la task 0044 en sus «Decisiones que he tomado yo» (decisión 1). La receta y las guardas viven en `skills/sdd-start-task/references/commit-milestones.md`.

## Requisitos

### La apertura de una task queda en un commit
- GIVEN una task con la spec aprobada y, en full, `plan.md` y `tasks.md` escritos, con uno o más commits desde el `merge-base` con la rama de integración
- WHEN el hilo va a despachar la primera task (en lite, a empezar la implementación)
- THEN desde el `merge-base` la rama tiene un solo commit, con spec, hallazgos de la review de spec, `plan.md` y `tasks.md` (en lite, solo la spec)

### Cada task del plan queda en un commit
- GIVEN la revisión de la task N limpia (y su re-revisión, si la hubo) con uno o más commits desde el BASE que el hilo apuntó antes de despacharla
- WHEN el hilo va a despachar la task siguiente o la revisión final de rama
- THEN desde ese BASE la rama tiene un solo commit, con los tests RED, la implementación, los arreglos de la revisión y la evidencia de la task
- AND el hash que `tasks.md` apunta para la task N es el de ese commit, escrito en el commit del hito siguiente

### El cierre de una task queda en un commit
- GIVEN las tasks juntadas, la revisión final de rama hecha, el trabajo validado y la documentación de `sdd-end-task` escrita
- WHEN el hilo va a hacer el merge del cierre
- THEN desde el commit de la última task la rama tiene un solo commit, con la documentación de cierre y los arreglos de la revisión final y de la validación
- AND una rama sin merges de sincronización tiene 2 + N commits desde el `merge-base`, con N tasks en el plan (3 en lite)

### El patch queda en dos commits
- GIVEN un patch con el fix verificado
- WHEN se cierra con `sdd-end-patch`
- THEN la rama tiene dos commits desde el `merge-base`: el fix (código, tests y `patch.md`) y el cierre (`patch.md` con el hash del fix y el tiempo, más changelog, roadmap y estimation-log si existen)
- AND el `commit:` de `patch.md` es el hash del commit del fix

### No se junta a través de un merge ni lo ya publicado
- GIVEN el rango de un hito que contiene un commit de merge, o un commit ya publicado en un remoto
- WHEN llega el momento de juntar ese hito
- THEN no se junta y no se hace push forzado
- AND el walkthrough (o `patch.md`) dice qué hito quedó sin juntar y por qué

## Historial

- 2026-09-23 — 20260923-191212-task-0044-commit-per-milestone — ADDED La apertura de una task queda en un commit
- 2026-09-23 — 20260923-191212-task-0044-commit-per-milestone — ADDED Cada task del plan queda en un commit
- 2026-09-23 — 20260923-191212-task-0044-commit-per-milestone — ADDED El cierre de una task queda en un commit
- 2026-09-23 — 20260923-191212-task-0044-commit-per-milestone — ADDED El patch queda en dos commits
- 2026-09-23 — 20260923-191212-task-0044-commit-per-milestone — ADDED No se junta a través de un merge ni lo ya publicado
