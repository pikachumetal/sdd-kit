# Feedback del kit SDD — task 0004 (filtro por etiqueta)

Para: quien mantiene `sdd-kit`.
Fecha: 2026-09-21.
Fuente: `session-log.md` (sesión del 2026-09-19, 08:40–09:20), contrastada con `spec.md` y `sdd-kit.json`. El historial git solo tiene el commit `base`, así que los commits que cita la bitácora no se pueden comprobar.

## Contexto

- Proyecto Horizon Notes. `sdd-kit` 1.1.0 (canal plugin), `superpowers` 6.3.0.
- Task 0004: filtrar el listado de notas por etiqueta. Modo lite.
- Un solo desarrollador, que también es el único usuario.
- La sesión llegó hasta la validación. `sdd-end-task` no se ha ejecutado.

## Qué falló

Nada. La bitácora no registra ningún fallo: ningún gate estorbó, ningún paso pidió información ya dada y no hubo decisiones de última hora. No hay incidencias que reportar de esta sesión.

## Qué funcionó

- **Enrutado.** `sdd-start-task` propuso modo lite citando las condiciones del predicado una por una. Se comprobaron, se cumplían todas y se confirmó sin fricción. La carga de contexto (constitution, mission, tech-stack, roadmap) no dio problemas con `capabilities/` todavía inexistente.
- **Brainstorming.** Dos preguntas (una etiqueta o varias; qué cuenta como etiqueta). Las dos respuestas acabaron como decisiones 2 y 3 de la spec.
- **Spec.** Plantilla calcada con las decisiones arriba, dos escenarios ADDED y el bloque de estimación de lite. Aprobada en dos minutos (08:50–08:52) sin cambios.
- **Implementación.** Test en rojo escrito antes del código (un test por THEN, más el de mayúsculas) y subagente implementador con la ruta del test como contrato. Los tests pasaron a la primera.
- **Revisión, smoke y validación.** El revisor de la task no encontró nada. El smoke cubrió tres casos (etiqueta real, la misma en mayúsculas, sin etiqueta) y los tres coinciden con la spec.
- **Estimación.** 1 h estimada, 40 min de reloj (0.67 h). La spec citaba 0003 como referencia.

## Datos sin valorar

Coste en tokens: 96k el subagente implementador y 41k el revisor de la task, unos 137k en total. El hilo principal no tiene contador. Es una función pura con dos escenarios. La bitácora no dice si el coste fue proporcionado y una sola sesión no permite compararlo; con cifras de otras tasks lite se vería.

## Límites de esta evidencia

"Nada falló" pesa poco aquí:

- Es el caso más favorable para lite: función pura, dos escenarios, todas las condiciones del predicado cumplidas. No se probó la frontera del predicado (una task que incumpla alguna condición), ni el modo completo, ni los patches.
- Autor y aprobador de la spec son la misma persona (`dev-lead`) y esa persona validó su propio trabajo. No se sabe si la aprobación o la validación cazarían algo con más de una persona.
- El cierre no se ha ejercitado: `sdd-end-task`, walkthrough, changelog, `estimation-log.md` y la creación de la capacidad `search` en `capabilities/` (la spec la declara, la carpeta no existe) siguen pendientes. Sobre esas partes no hay nada que decir todavía.
- La bitácora es un juicio del desarrollador ("fluido", "ningún gate estorbó") y no lista qué gates se dispararon.
- Una sola sesión, sin repetición.
