# RED — el 🦆 de una parada no nombra un id de la batería sin decir qué es (feature 0327)

Escenario `s5` de la [batería de `sdd-rubber-duck`](batteries/sdd-rubber-duck/battery.md), sonnet, en modo corto, con el kit de `develop` (`git archive origin/develop:dist`) y la batería de la rama. Material de una parada por dinero que nombra el escenario `co2p`, la fila `CO2P-M` y los sujetos `co2p-1` y `co2p-2`. Salidas en [`red/out/`](../.docs/sdd/specs/20261110-141415-feature-0327-review-conduct-plain-names/red/out/) y [`control/out/`](../.docs/sdd/specs/20261110-141415-feature-0327-review-conduct-plain-names/control/out/).

| Sujeto | $ | Cómo nombra la prueba | `R12` | `R7` |
| --- | --- | --- | --- | --- |
| `red/s5-1` | 0,08 | «La prueba de la tarea 3 mira si la spec dice con qué comando se contaron las palabras…» | ✅ | ✅ |
| `red/s5-2` | 0,09 | «La prueba de esta tarea mira si la spec dice con qué herramienta se contaron…» | ✅ | ✅ |
| `control/s5-1` | 0,08 | «Probamos la tarea con dos ejecuciones independientes, y las dos dieron la cifra sin la herramienta» | ✅ | ✅ |

`battery.mjs run`: `s5 · 2/2 · umbral 2/2 · puerta verde` y, de control, `s5 · 1/1`. Total: 3 sujetos, 0,25 $.

## Lo que dice el RED

1. **El 🦆 de hoy ya explica sin ids** (3/3): ninguno nombra `co2p` ni `CO2P-M`; dicen qué mide la prueba y qué cuesta seguir. La frase de la decisión 5 de la spec no se escribe: Scope «si el RED lo exhibe».
2. **Lo que esto dice del ticket 0326 §2**: los ids salieron en los mensajes de progreso y las preguntas del hilo, no en un 🦆 escrito con la skill; es el caso «la regla existía y no la apliqué», que el ticket ya registra.
