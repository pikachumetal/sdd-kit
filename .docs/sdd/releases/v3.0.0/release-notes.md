---
release: v3.0.0
title: sdd-kit v3.0.0 — un kit más ligero, con tres verbos y los documentos donde se leen
created: 2026-11-16
---

# sdd-kit v3.0.0 — un kit más ligero, con tres verbos y los documentos donde se leen

*16 de noviembre de 2026*

## Resumen

La 3.0.0 rehace el kit desde los carriles. El trabajo pasa por tres verbos: planificar en el roadmap, hacer un cambio y entregar una versión. Lo que lee una persona va a la raíz del proyecto, y lo que lee el asistente, a `.docs/sdd/`. Las skills son más cortas, y cada una se ha medido con pruebas de uso antes de publicarla. Al actualizar, el asistente os ofrece mover vuestros documentos a la forma nueva, y no mueve nada sin que aprobéis cada paso.

## Novedades

- **Para quien planifica**: el roadmap vive en `ROADMAP.md`, en la raíz, con tres secciones: lo que se hace ahora, lo siguiente y más adelante. La deuda técnica tiene su propio fichero y su triaje. Al apuntar algo, el asistente os enseña la fila antes de escribirla y os da el texto para arrancarla en otra sesión.
- **Para quien pide un cambio**: hay una sola entrada para cualquier cambio, grande o pequeño. El asistente propone el carril (una feature, un cambio pequeño con la solución ya fijada, una investigación o un ajuste de configuración) y os dice qué tendríais que decidir si elegís otro.
- **Para quien contesta las preguntas**: el asistente pregunta una cosa por turno, empieza por el porqué y deja como pendiente lo que no sabéis, en vez de suponerlo.
- **Para quien revisa**: la revisión final sale en ejes separados, la conformidad con la spec y la calidad del código, cada uno con el modelo que le toca, y se cierra con una sola pasada de arreglos y una segunda revisión.
- **Para quien valida y cierra**: el cierre es uno solo para todos los carriles. Integra la base antes de fusionar, deja el walkthrough con el tiempo real y apunta en el roadmap lo que queda.
- **Para quien entrega una versión**: el changelog se escribe al cortar la versión, a partir de lo cerrado, y cada corte deja una retro con la deuda agrupada por causa.
- **Para quien trabaja solo o en equipo**: cada persona guarda su forma de trabajar (cuánto la para el asistente, qué modelo usa) en su configuración personal, sin cambiar la del equipo.

## Problemas conocidos

- Algunas conductas del asistente siguen fallando en una parte de las pruebas: arrancar una inicialización nueva sin cargar el entrevistador del kit, dejar como decisión propia un detalle que cambia algo aprobado, o explicar un término en la frase siguiente en vez de en la misma. Están apuntadas como deuda para las próximas versiones.
- Mover los documentos a la forma nueva lleva varios pasos con vuestra aprobación en cada uno; en un proyecto grande, reservad un rato.

## Fuera de alcance de esta entrega

- El panel de validación en el navegador sigue en investigación.
- La búsqueda autónoma en internet durante una entrevista queda fuera; irá en las investigaciones.

## Próximos pasos

- Por nuestra parte: arreglar primero las conductas que fallan en dos medidas seguidas, y el aviso de Node 20 de la integración continua del kit.
- Por vuestra parte: actualizad el kit y reiniciad la sesión. Al arrancar, el asistente os avisará de la actualización pendiente: pedidle «actualízame al kit» y aprobad cada paso del movimiento de documentos.
