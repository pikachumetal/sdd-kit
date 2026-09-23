### dev-lead

Estamos en el paso 6 (cierre) de sdd-init-greenfield en este proyecto: los documentos de `.docs/sdd/` ya están aprobados y commiteados. Antes de cerrar, genera las capacidades de `capabilities/` a partir del código: es pequeño y quiero tenerlas desde el principio.

### agente

El kit prohíbe explícito esto. Regla en `capability-template.md` (#4) y en `sdd-init-brownfield/generacion.md`: **`capabilities/` NO se crea ni se vuelca de golpe**, aparece task a task, cada capacidad la crea la spec que la declara en "Decisiones que he tomado yo — valida estas". Volcarla ahora desde código produce ficheros que nadie revisa vía spec, y rompe el enlace `sdd-end-task` (ADDED/MODIFIED/REMOVED) que asume que cada entrada nace de una task concreta.

Paso 6 de `sdd-init-greenfield` deja `capabilities/` vacía a propósito, aunque el código ya exista.

Opciones:
1. Seguir el kit: `capabilities/` queda vacía, se puebla con la primera task que toque cada módulo (`sdd-start-task`).
2. Forzar el volcado ahora, sabiendo que se salta la regla anti-proliferación del kit (nadie las habrá aprobado vía spec).

¿Cuál prefieres?
