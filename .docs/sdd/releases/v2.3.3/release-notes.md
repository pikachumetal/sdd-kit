---
release: v2.3.3
title: sdd-kit v2.3.3 — un patch cerrado el día de la release ya no se da por publicado, y la documentación del sistema acepta vuestras propias marcas
created: 2026-10-08
---

# sdd-kit v2.3.3 — un patch cerrado el día de la release ya no se da por publicado, y la documentación del sistema acepta vuestras propias marcas

*8 de octubre de 2026*

## Resumen

La 2.3.3 es una versión de arreglos que sale de cuatro tickets de campo. Arregla dos rechazos que obligaban a dar un rodeo. El primero: un patch cerrado el mismo día que se cortó una release se daba por publicado en ella. El segundo: al cerrar un cambio, la documentación del sistema rechazaba vuestras propias marcas como si fueran huecos sin rellenar. Además, el merge del cierre para menos y explica mejor por qué para. No tenéis que cambiar nada en vuestro proyecto.

## Novedades

- **Para quien cierra un patch el día que se corta una release**: si el patch entra después del corte, el validador del roadmap ya no lo rechaza como «sale en el corte». El registro de estimación lo deja como «sin publicar», no en la release que acaba de salir. Para saberlo, el kit mira si el patch está en la historia de la versión etiquetada, no la fecha. En un proyecto del equipo, dos patches de ese día dejaron el roadmap en rojo en la rama de integración.
- **Para quien cierra un cambio que modifica la documentación del sistema**: los requisitos pueden llevar marcas vuestras, como el comentario que indica a qué base de datos aplica una línea (`<!-- db:sqlite -->`) o un `<destino>` que forma parte del texto. Ahora pasan tal cual. Solo se para si queda sin rellenar un hueco de la plantilla, como `<título estable>`. En un proyecto del equipo, dos cambios seguidos tuvieron que esconder esas marcas a mano para poder cerrar.
- **Para quien cierra dos cambios que añaden al mismo documento**: si cada uno añade su sección al final del mismo fichero, o una palabra al diccionario, el merge del cierre se queda con las dos y sigue sin preguntaros. Si los dos tocan la misma línea, sigue parando para que decidáis. En un proyecto del equipo, dos estudios de la misma tanda pararon el cierre por esto.
- **Para quien cierra con la aplicación arrancada**: si la verificación del merge falla porque otro programa tiene abierto un fichero del build, el aviso empieza por `bloqueado:` y dice qué fichero y, si se sabe, qué programa lo tiene. Antes parecía que los tests estaban en rojo.

## Problemas conocidos

- El criterio nuevo del roadmap necesita la etiqueta de la versión en git (`vX.Y.Z`), la que pone el cierre de la release. Sin ella, o en una fila sin enlace a su carpeta, se sigue decidiendo por la fecha.

## Próximos pasos

- Por nuestra parte: la 3.0.0, que reorganiza el cierre de las releases y la planificación.
- Por vuestra parte: actualizad el plugin y reiniciad la sesión. Al arrancar, el asistente os avisará de que el proyecto tiene una actualización pendiente. Pedidle «ponme el proyecto al día con `sdd-init-brownfield`»: esta vez solo avanza la versión que el proyecto tiene apuntada.
