---
release: v2.2.0
title: sdd-kit v2.2.0 — cerrar sin esperas, verificar el frontend y varias sesiones a la vez
created: 2026-09-29
---

# sdd-kit v2.2.0 — cerrar sin esperas, verificar el frontend y varias sesiones a la vez

*29 de septiembre de 2026*

## Resumen

La 2.2.0 sale de los tickets de los primeros días con la 2.0.0 y la 2.1.0 en proyectos del equipo. El cierre de una feature ya no te deja esperando después de validar, el frontend se verifica con un método en vez de a ojo, y varias sesiones pueden cerrar a la vez sin pisarse. Además, el asistente te avisa al arrancar cuando la sesión va con un kit viejo o cuando el proyecto tiene una actualización pendiente.

## Novedades

- **Para quien cierra una feature**: la revisión final ya no va al final. El asistente la lanza en segundo plano en cuanto termina la última tarea y, mientras tanto, hace la verificación visual y prepara los documentos del cierre. La validación te llega cuando vuelve la revisión, y el cierre sigue en cuanto la das. En un proyecto del equipo, ese tramo pasaba de 25 minutos.
- **Para quien trabaja en frontend**: cuando un cambio toca lo que se ve, el asistente escribe antes qué debe cumplir la pantalla, mide la página renderizada con el detector que declare el proyecto, en escritorio y en móvil, y mira las capturas con una rúbrica de composición. Te enseña todo eso al validar. Si el proyecto no declara detector, te avisa de que la composición no está medida. La regresión visual por píxeles deja de ser un freno del día a día.
- **Para quien lanza varias sesiones a la vez**: cuando dos cierres chocan solo porque los dos añaden su línea al changelog o su fila al roadmap, el merge los une solo. Antes, con varias sesiones cerrando a la vez, casi todas acababan pidiéndote que las desatascaras.
- **Para quien actualiza el kit**: al arrancar una sesión, el asistente avisa si ha cargado un kit más viejo que el del proyecto, con el comando para actualizarlo, y si el proyecto tiene una actualización pendiente, con la frase para aplicarla.
- **Para quien escribe el plan**: el plan lleva una sección con lo que ningún test comprueba, y el revisor final la mira a propósito.
- **Arreglos que se notaban cada día**: el cierre ya no falla en un proyecto sin remoto; la numeración de tareas funciona con carpetas antiguas de nombre partido; en Windows, los scripts de las tareas ya no se lanzan con el `bash` de WSL; y la cita literal de tu validación ya no rompe el corrector ortográfico del proyecto.

## Problemas conocidos

- La revisión final sigue yendo siempre con el modelo más caro, también en cambios pequeños, y un commit que solo toca documentación fuera de `.docs/` abre otra revisión completa. Es lo siguiente que se va a medir.
- Los tests se siguen pasando enteros varias veces al cerrar. Ejecutar solo lo afectado llega en la próxima versión.

## Fuera de alcance de esta entrega

La revisión final proporcional al cambio y los tests afectados quedan para la próxima versión, junto con otros arreglos pequeños que han salido de vuestros tickets.

## Próximos pasos

- Por nuestra parte: medir si la revisión final puede ir con un modelo más barato sin perder calidad, y sacar los tests afectados.
- Por vuestra parte: actualizad el plugin y reiniciad la sesión. Al arrancar, el asistente os dirá que hay una actualización pendiente del proyecto: pedidle «ponme el proyecto al día con `sdd-init-brownfield`», que solo sube el número de versión. Si trabajáis en frontend, declarad en `tech-stack.md` el detector y cómo entra el agente en la aplicación. Y seguid aceptando el ticket de mejora al cerrar cada tarea.
