---
release: v2.3.2
title: sdd-kit v2.3.2 — la documentación del sistema ya no pierde líneas al cerrar, y el roadmap avisa de lo que se sale de la plantilla
created: 2026-10-05
---

# sdd-kit v2.3.2 — la documentación del sistema ya no pierde líneas al cerrar, y el roadmap avisa de lo que se sale de la plantilla

*5 de octubre de 2026*

## Resumen

La 2.3.2 es una versión de arreglos que sale de un ticket de campo de esta semana. El arreglo importante: al cerrar un cambio, la documentación del sistema podía perder un requisito sin que nadie se enterara. Además, el validador del roadmap avisa de las filas que el cierre de una release no sabe tratar. No tenéis que cambiar nada en vuestro proyecto.

## Novedades

- **Para quien cierra un cambio que modifica la documentación del sistema**: si el cambio reescribe un requisito y se deja por el camino alguna de sus condiciones, el cierre ya no lo fusiona en silencio. Se para, te dice qué línea se perdería y no toca nada. Si quitarla era lo que querías, el asistente lo deja escrito en el propio cambio. En un proyecto del equipo, una condición desapareció así y solo se vio al repasar el diff.
- **Para quien mantiene el roadmap**: el validador avisa de dos cosas que antes daba por buenas. La primera, una fila de deuda técnica cuyo destino no es uno de los tres de la plantilla: actuar, esperar un segundo ticket o descartarla. La segunda, una fila marcada como saldada con un formato que el cierre de la release no reconoce, y que por eso se quedaba en el roadmap después del corte. Es un aviso, no un error: tus commits no se bloquean, y puedes normalizar esas filas cuando las toques.
- **Para quien arranca un patch o una feature**: al reservar el id, los proyectos con carpetas antiguas con sufijo (`0006a`, `0006b`) veían un mensaje con aspecto de error, aunque la reserva salía bien. Ahora es una línea de aviso.

## Problemas conocidos

- En la 3.0.0, los avisos del roadmap pasarán a ser errores. Si tu roadmap los da, conviene normalizar esas filas antes. La actualización a esa versión os guiará.
- En proyectos con ficheros de capacidades heredados o que solo apuntan a otro sitio, el validador de capacidades sigue en rojo si no se marcan con la línea que trajo la 2.3.1.

## Fuera de alcance de esta entrega

Tres cosas del mismo ticket van a la reorganización de la 3.0.0. La primera, que un hotfix que pida algo al proyecto lo traiga como paso de la actualización. La segunda, que un arreglo nacido del smoke de la release no obligue a otra pregunta antes del merge. La tercera, un freno cuando una release ya comprometida sigue creciendo.

## Próximos pasos

- Por nuestra parte: la 3.0.0, que reorganiza el cierre de las releases y la planificación, y convierte los avisos del roadmap en errores con un paso de actualización que los resuelve.
- Por vuestra parte: actualizad el plugin y reiniciad la sesión. Al arrancar, el asistente os avisará de que el proyecto tiene una actualización pendiente. Pedidle «ponme el proyecto al día con `sdd-init-brownfield`»: esta vez solo avanza la versión que el proyecto tiene apuntada.
