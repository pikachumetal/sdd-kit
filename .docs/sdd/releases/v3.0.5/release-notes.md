---
release: v3.0.5
title: sdd-kit v3.0.5 — la validación vuelve a la implementación
created: 2026-11-26
---

# sdd-kit v3.0.5 — la validación vuelve a la implementación

*26 de noviembre de 2026*

## Resumen

Hasta ahora la validación era el primer paso del cierre, y los arreglos que salían de ella se hacían ya cerrando, sin revisar. Esta versión la devuelve al final de la implementación: el agente recorre el guion antes de dároslo, lo que falla vuelve como una task con su test, y el cierre solo empieza cuando habéis validado. Trae además dos arreglos de la CLI que en uso real pararon a todo un equipo.

## Novedades

- **Para quien valida una feature o un patch**: al acabar las tasks, la skill nueva `sdd-validate` corre el gate de cierre, recorre ella misma el guion, pasa la revisión final y os pide la validación. Si algo falla, en el guion, en la revisión o en vuestra prueba, vuelve a la implementación como una task nueva, sin preguntaros, y se repite solo lo que toca el arreglo. `sdd-archive` ya no valida ni arregla código: si la validación no está registrada, devuelve el trabajo. El hotfix y el spike pasan por el mismo camino.
- **Para quien trabaja en `delegate`**: el agente ya no para a preguntar si vuelve a la implementación con un arreglo ni si pasa al cierre tras registrar la validación.
- **Para quien trabaja con varias ramas a la vez**: `sdd merge` para antes de fusionar si la rama trae un id de cambio o un número de ADR que la rama de destino ya usa, y nombra los dos ficheros. Antes se fusionaban y bloqueaban las reservas y los cierres de todo el proyecto.
- **Para quien apunta filas en el roadmap**: `sdd roadmap publish` funciona desde el checkout que tiene sacada la rama de integración, sin tener que pasar por un worktree temporal.
- **Para quien mira las estimaciones**: el esfuerzo real de un cambio se cuenta desde su `Inicio:`, no desde que arrancó la sesión, así que un patch abierto a mitad de sesión ya no carga con todo lo anterior.

## Próximos pasos

- Por vuestra parte: actualizad el kit, reiniciad la sesión y pedid «actualízame al kit»; no cambia nada en vuestro proyecto salvo la versión.
