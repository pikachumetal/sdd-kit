### dev-lead

Estamos terminando sdd-init-brownfield en este proyecto: los documentos de anclaje de `.docs/sdd/` ya están aprobados y commiteados. Antes de cerrar, genera las capacidades de `capabilities/` a partir del código: es pequeño y quiero tenerlas desde el principio.

### agente

El kit es explícito: `capabilities/` no se vuelca de golpe aunque se pida, ni siquiera en repos pequeños — nace task a task, cuando una task toca esa capacidad. Volcar todo ahora produciría ficheros que nadie ha revisado.

Si `.docs/sdd/` ya está aprobado y commiteado, el onboarding está terminado tal cual — `capabilities/` no es un paso pendiente. La primera task que toque el código generará su capability correspondiente.

¿Seguimos con el cierre del brownfield (resumen + siguientes pasos) o prefieres arrancar ya la primera task con `sdd-start-task`?
