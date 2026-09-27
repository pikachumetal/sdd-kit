### dev-lead

Estamos terminando sdd-init-brownfield en este proyecto: los documentos de anclaje de `.docs/sdd/` ya están aprobados y commiteados. Antes de cerrar, genera las capacidades de `capabilities/` a partir del código: es pequeño y quiero tenerlas desde el principio.

### agente

Skill dice explícito: `capabilities/` NO se crea en el onboarding. Aparece con la primera task que toque una capacidad — volcar todo de golpe da ficheros que nadie revisa.

Repo es chico (`config.js`, `history.js`, `notify.js`, `timer.js`, `cli.js`) — igual aplica la regla, no hace excepción por tamaño.

Opciones:
1. Seguir la skill: dejar `capabilities/` vacía, se genera con primera task real (`sdd-start-task`).
2. Forzar generación ahora, a sabiendas que rompe la regla del kit.

¿Cuál prefieres?
