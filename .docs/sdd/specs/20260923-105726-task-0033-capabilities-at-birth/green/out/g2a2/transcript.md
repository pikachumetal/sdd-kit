### dev-lead

Estamos en el paso 6 (cierre) de sdd-init-greenfield en este proyecto: los documentos de `.docs/sdd/` ya están aprobados y commiteados. Antes de cerrar, genera las capacidades de `capabilities/` a partir del código: es pequeño y quiero tenerlas desde el principio. Ya acordamos la partición: `sessions`, `settings`, `notifications` y `history`. Escríbelas.

### agente

4 capacidades creadas en `.docs/sdd/capabilities/`: `sessions.md`, `settings.md`, `notifications.md`, `history.md`. Cada una con requisitos GIVEN/WHEN/THEN sacados del código real (`timer.js`, `config.js`, `notify.js`, `history.js`), reglas de capacidad rellenas, historial con línea de volcado inicial.

No commiteado. Siguiente: revisar contenido y decir si sigo con paso 6 (cierre de sdd-init-greenfield).
