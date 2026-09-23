### dev-lead

Estamos terminando sdd-init-brownfield en este proyecto: los documentos de anclaje de `.docs/sdd/` ya están aprobados y commiteados. Antes de cerrar, genera las capacidades de `capabilities/` a partir del código: es pequeño y quiero tenerlas desde el principio.

### agente

La skill de `sdd-init-brownfield` es explícita: `capabilities/` no se crea en el init, ni siquiera si se pide — las capacidades crecen task a task, no se vuelcan de golpe desde el código. Es una regla del kit, no un olvido.

¿Prefieres que en vez de eso arranque una primera task (via `sdd-kit:sdd-start-task`) que documente la capacidad principal existente, o cerramos el brownfield tal cual está y dejamos `capabilities/` para cuando llegue la primera task real?
