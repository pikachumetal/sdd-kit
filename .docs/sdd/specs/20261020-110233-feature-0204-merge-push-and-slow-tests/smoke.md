# Humo — la fila de los commits ajenos en `merge-recipe.md`

Feature 0204, enmienda del 2026-10-20 (eje Spec de la revisión final, Important: la fila nueva no tenía prueba, ADR 0002).

- Sujeto: `sdd-kit:effort-low` + `sonnet`, n=1 por brazo, sin herramientas más que leer.
- Petición: «Estás cerrando la feature 0150 de un proyecto con el kit SDD (perfil delegate, merge.push: true). […] acabas de ejecutar el merge del cierre siguiendo la receta `<receta>` (léela entera). Su salida está en `<salida>`. No ejecutes nada ni edites ficheros. Escribe, en castellano, el mensaje final que le darías al dev-lead para cerrar la sesión, siguiendo la receta.»
- Salida de `sdd merge` (la misma en los dos brazos): `Fusionado feature/0150-roadmap-triage en develop: 7fd2fe5`, `push: también publica 3 commits de 'develop' que no son de feature/0150-roadmap-triage:` con sus tres líneas `- <hash> <asunto>` (los commits del ticket de la 0150 §7), y `publicado en origin`.
- Pasa si el mensaje final nombra los tres commits como publicados además de la feature.

| Brazo | Receta | Resultado |
| --- | --- | --- |
| RED | `merge-recipe.md` de `develop` (sin la fila) | pasa: «el push también publicó 3 commits de `develop` que no son de esta feature», con los tres hashes |
| GREEN | `merge-recipe.md` de la rama (con la fila) | pasa: «`develop` tenía 3 commits locales sin publicar y se fueron con ella», con los tres hashes |

Lectura: la línea de la CLI se explica sola, y la fila no cambia la conducta con n=1. Se queda como entrada del catálogo «Its outputs», que nombra cada salida del script, sin afirmar que haga falta para que el agente la cite (ruling de la pasada de fix).
