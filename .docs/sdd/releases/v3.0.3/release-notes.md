---
release: v3.0.3
title: sdd-kit v3.0.3 — en delegate te vuelve a preguntar lo que es tuyo
created: 2026-11-19
---

# sdd-kit v3.0.3 — en delegate te vuelve a preguntar lo que es tuyo

*19 de noviembre de 2026*

## Resumen

Esta versión arregla dos cosas que se notaban al trabajar en `delegate`: el agente decidía por su cuenta lo que tenía que preguntar, y los prompts de arranque daban por decidido lo que solo había propuesto un agente. Trae también el inventario de lo que el kit dicta a cada repo, para decidir qué sale del kit.

## Novedades

- **Para quien trabaja en `delegate`**: antes de escribir la spec, el agente os pregunta, una por turno, lo que falta y solo vosotros podéis decidir: el porqué, el criterio, el alcance. Lo que la petición ya trae no lo pregunta, y lo de método lo decide él y os lo enseña en el ✋. Es como preguntaba `brainstorming` en la 2.x.
- **Para quien lanza trabajo con los prompts del kit**: en «Decisiones ya tomadas» solo va lo que dijisteis o está escrito, cada línea con su origen. Lo que propone el agente va a una sección `Abierto:`, y la sesión que arranca la tarea os lo pregunta en vez de tomarlo como vuestro.
- **Para quien piensa que el kit pide demasiado**: el inventario de la 0355 lista qué texto de las skills es política de cada repo (tests más allá del unitario, camino crítico, guion de validación, verificación de frontend) y adónde podría ir. Todavía no cambia nada: qué sale y en qué versión lo decidís vosotros.

## Próximos pasos

- Por vuestra parte: actualizad el kit, reiniciad la sesión y pedid «actualízame al kit»; no cambia nada en vuestro proyecto salvo la versión.
