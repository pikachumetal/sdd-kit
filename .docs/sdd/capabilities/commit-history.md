# Capacidad — commit-history

Verdad viva de la historia de la rama de una task o de un patch: qué commits quedan al fusionar y qué hash apuntan los artefactos. Esta capacidad la declaró la spec de la task 0044 en sus «Decisiones que he tomado yo» (decisión 1). La receta y las guardas viven en `skills/sdd-start-task/references/commit-milestones.md`.

## Requisitos

### La apertura de una task queda en un commit
- GIVEN una task con la spec aprobada y, en full, `plan.md` y `tasks.md` escritos, con uno o más commits desde el `merge-base` con la rama de integración
- WHEN el hilo va a escribir los RED de la primera task (en Native, antes de su `task-start`; en lite, a empezar la implementación)
- THEN desde el `merge-base` la rama tiene un solo commit, con spec, hallazgos de la review de spec, `plan.md` y `tasks.md` (en lite, solo la spec)

### Cada task del plan queda en un commit
- GIVEN la task N con uno o más commits desde el BASE que el hilo apuntó al empezarla, y su revisión limpia (SDD) o su contrato de cierre cumplido (Native)
- WHEN el hilo va a empezar o despachar la task siguiente, o la revisión final de rama (en Native, antes de `task-done`)
- THEN desde ese BASE la rama tiene un solo commit, con los tests RED, la implementación, los arreglos de la revisión y la evidencia de la task
- AND el mensaje de ese commit lo escribe el hilo con la convención del proyecto, también cuando el rango ya tenía un solo commit
- AND el hash que `tasks.md` apunta para la task N es el de ese commit, escrito en el commit del hito siguiente

### El cierre de una task queda en un commit
- GIVEN las tasks juntadas, la revisión final de rama hecha, el trabajo validado y la documentación de `sdd-end-task` escrita
- WHEN el hilo va a hacer el merge del cierre
- THEN desde el commit de la última task la rama tiene un solo commit, con la documentación de cierre y los arreglos de la revisión final y de la validación
- AND una rama sin merges de sincronización tiene 2 + N commits desde el `merge-base`, con N tasks en el plan (3 en lite)
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama; el cierre no se vuelve a juntar

### El patch queda en dos commits
- GIVEN un patch con el fix verificado
- WHEN se cierra con `sdd-end-patch`
- THEN la rama tiene dos commits desde el `merge-base`: el fix (código, tests y `patch.md`) y el cierre (`patch.md` con el hash del fix y el tiempo, más changelog, roadmap y estimation-log si existen)
- AND el `commit:` de `patch.md` es el hash del commit del fix
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama
- AND si el dev-lead fija otra forma de commits, manda la suya y el fix no se junta; un test en RED va en el commit de su arreglo o en uno posterior, y el RED queda registrado en `patch.md` §4

### No se junta a través de un merge ni lo ya publicado
- GIVEN el rango de un hito que contiene un commit de merge, o un commit ya publicado en un remoto
- WHEN llega el momento de juntar ese hito
- THEN no se junta y no se hace push forzado
- AND el walkthrough (o `patch.md`) dice qué hito quedó sin juntar y por qué

### Un RED sin commitear no tumba los commits del hilo
- GIVEN un repo con un `pre-commit` que ejecuta la suite y un plan SDD
- WHEN el hilo prepara el despacho de una task
- THEN la apertura (o el hito anterior) ya está en su commit antes de escribir los RED
- AND si el hilo tiene que commitear con un RED en el árbol, lo aparta antes y lo devuelve después, sin `--no-verify`
