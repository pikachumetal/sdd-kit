Asunto: sdd-kit 2.1.0 disponible

Hola:

Ya está en `main` la versión 2.1.0 del kit SDD. Sale de vuestros primeros tickets con la 2.0.0:

- Un retoque que solo cambia cómo se ve una pantalla (mover botones, márgenes, colores) entra como un patch corto: intención en una frase, el cambio y una captura para validar. Sin spec ni revisión final.
- El asistente vigila a los agentes que lanza. Si uno se queda colgado, lo para, lo relanza una vez y te avisa.
- La revisión final ya no se atasca en ramas que borran mucho código.

Para actualizar:

1. Actualiza el plugin (los pasos están en el README) y reinicia la sesión. Los proyectos no necesitan migración.
2. Comprueba que el asistente usa `sdd-start-feature` y `sdd-end-feature`. Si ves `sdd-start-task`, la sesión ha cargado una versión vieja del kit: actualízala y reinicia.

Lo próximo es el aviso de versión al arrancar la sesión y un cierre que no os deje esperando tras validar. Seguid aceptando el ticket de mejora al cerrar cada tarea y pasádmelo.

Las notas completas están en `.docs/sdd/releases/v2.1.0/release-notes.md`.

Àngel
