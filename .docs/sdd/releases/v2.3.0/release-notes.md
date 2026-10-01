---
release: v2.3.0
title: sdd-kit v2.3.0 — un roadmap ordenado, validación en el uso y un carril patch más claro
created: 2026-10-01
---

# sdd-kit v2.3.0 — un roadmap ordenado, validación en el uso y un carril patch más claro

*1 de octubre de 2026*

## Resumen

La 2.3.0 sale de vuestros tickets de los últimos dos días y de un repaso del roadmap del propio kit, que se había convertido en un cajón de sastre. El roadmap vuelve a tener una forma fija que el asistente comprueba en cada cierre. Un proyecto sin pantalla que probar puede declarar que la validación llega con el uso. Y el carril patch se decide por quién fija la solución, no por los minutos.

## Novedades

- **Para quien mantiene el roadmap**: el roadmap solo tiene las secciones de su plantilla, y fuera del historial de releases todo son tablas. El asistente lo comprueba al cerrar cada feature y cada patch, y te avisa si algo se sale de la forma. Al cortar una release, lo publicado sale de las tablas y queda en el resumen de la versión, con una línea de las validaciones que siguen pendientes. Si el roadmap no está en la forma, el corte se para y te lo dice, en vez de cortar desde donde pueda.
- **Para proyectos sin pantalla que probar**: si el trabajo solo se puede validar usándolo de verdad, como pasa con el propio kit, el proyecto puede declararlo. Entonces el cierre no para a pedirte la validación: el asistente registra su propia verificación (revisión, smoke y tests), y la validación humana llega con el uso. Sin esa declaración, todo sigue como antes. La configuración del kit te lo pregunta, y recomienda la validación manual salvo que de verdad no haya nada que probar.
- **Para quien pide un patch**: el patch ya no depende de los minutos, sino de quién fija la solución: la causa raíz de un fallo, una petición que solo cambia o quita algo de la presentación, o un ticket o una persona que dicen exactamente qué cambia. Si el asistente tendría que decidir qué texto sale, dónde o con qué regla, es una feature, aunque sea pequeña y aunque pidas un patch. Cada decisión queda escrita con quién la tomó. Y si el patch crece a más de 10 ficheros o 300 líneas, el asistente para y te pregunta.
- **Para quien cierra una feature**: el comportamiento nuevo pasa a la documentación del sistema con un script, en vez de a mano. En proyectos del equipo, esa fusión manual costaba unos 10 minutos de cada cierre y a veces dejaba restos que el validador rechazaba.
- **Para quien escribe el ticket de mejora**: si el cierre fue limpio, el ticket tiene tres líneas. Cuando no, cada propuesta dice si se comprobó, y lo que la regla del kit pudo evitar cuenta como hallazgo, no como error del asistente.
- **Arreglos que se notaban cada día**: cuando el merge falla en la verificación, el mensaje enseña la salida del comando y dónde está el log completo, sin tener que relanzarlo. Y un commit pequeño que solo toca documentación o comentarios ya no abre otra revisión completa con el modelo más caro.

## Problemas conocidos

- La estimación de un patch se escribe al cerrarlo, cuando el tiempo real ya se conoce. Eso contamina el registro de estimaciones.
- En proyectos con ficheros de capacidades heredados o que solo apuntan a otro sitio, el validador de capacidades sigue en rojo.
- Dos skills mandan usar un método de preguntas de un plugin que el kit no declara como dependencia: si no lo tienes instalado, la instrucción no lleva a ninguna parte.

## Fuera de alcance de esta entrega

La estimación del patch antes de empezar, el marcador de las capacidades heredadas y el método de preguntas propio del kit van en la próxima versión. También la revisión final proporcional al cambio y los tests afectados.

## Próximos pasos

- Por nuestra parte: adelgazar las skills más largas sin perder lo que miden sus pruebas, sacar la actualización del proyecto a una skill propia y traer el método de preguntas dentro del kit.
- Por vuestra parte: actualizad el plugin y reiniciad la sesión. Al arrancar, el asistente os avisará de que el proyecto tiene una actualización pendiente: pedidle «ponme el proyecto al día con `sdd-init-brownfield`». Esta vez tiene pasos. Si vuestro roadmap no está en la forma de la plantilla, os propondrá una tabla con adónde va cada bloque y esperará vuestro visto bueno; tened el roadmap commiteado antes. Y os preguntará quién valida el trabajo al cerrar.
