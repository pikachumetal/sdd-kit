Asunto: sdd-kit 2.2.0 disponible

Hola:

Ya está en `main` la versión 2.2.0 del kit SDD. Sale de vuestros tickets de estos dos días:

- Cerrar una feature ya no te deja esperando: la revisión final corre en segundo plano mientras el asistente verifica y prepara el cierre.
- El frontend se verifica con método: criterio escrito antes, un detector sobre la página renderizada y capturas revisadas. Sin regresión visual por píxeles en el día a día.
- Varias sesiones pueden cerrar a la vez: el merge une solo las líneas nuevas del changelog y del roadmap.
- Al arrancar, el asistente avisa si la sesión lleva un kit viejo o si el proyecto tiene una actualización pendiente.
- Y varios arreglos: el cierre sin remoto, la numeración con carpetas antiguas, los scripts en Windows y la cita literal frente al corrector.

Para actualizar:

1. Actualiza el plugin (los pasos están en el README) y reinicia la sesión.
2. En cada proyecto, pide «ponme el proyecto al día con `sdd-init-brownfield`». Esta vez solo sube el número de versión, y a partir de ahora el arranque te avisa cuando toque.
3. Si trabajas en frontend, declara en `tech-stack.md` el detector que uses y cómo entra el agente en la aplicación.

Lo próximo es medir si la revisión final puede ir con un modelo más barato y ejecutar solo los tests afectados. Seguid pasándome los tickets de mejora al cerrar cada tarea.

Las notas completas están en `.docs/sdd/releases/v2.2.0/release-notes.md`.

Àngel
