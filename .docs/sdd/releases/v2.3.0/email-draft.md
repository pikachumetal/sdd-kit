Asunto: sdd-kit 2.3.0 disponible

Hola:

Ya está en `main` la versión 2.3.0 del kit SDD. Sale de vuestros tickets de estos dos días y de un repaso del roadmap del propio kit:

- El roadmap tiene una forma fija, y el asistente la comprueba al cerrar cada feature, cada patch y cada release.
- Un proyecto sin pantalla que probar puede declarar que la validación llega con el uso, y el cierre no para a pedirla.
- El carril patch se decide por quién fija la solución: si el asistente tendría que decidir qué se ve, es una feature.
- El comportamiento nuevo pasa a la documentación del sistema con un script, unos 10 minutos menos por cierre.
- Los tickets de mejora tienen menos ruido: tres líneas si el cierre fue limpio.
- Y dos arreglos: el fallo del merge enseña la salida de la verificación, y un commit pequeño de documentación ya no abre otra revisión completa.

Para actualizar:

1. Actualiza el plugin (los pasos están en el README) y reinicia la sesión.
2. Commitea el roadmap de cada proyecto si tiene cambios.
3. En cada proyecto, pide «ponme el proyecto al día con `sdd-init-brownfield`». Esta vez tiene pasos: si el roadmap no está en la forma de la plantilla, te propone adónde va cada bloque y espera tu visto bueno, y te pregunta quién valida el trabajo al cerrar.

Lo próximo es adelgazar las skills más largas, sacar la actualización del proyecto a una skill propia y estimar el patch antes de empezarlo. Seguid pasándome los tickets de mejora al cerrar cada tarea.

Las notas completas están en `.docs/sdd/releases/v2.3.0/release-notes.md`.

Àngel
