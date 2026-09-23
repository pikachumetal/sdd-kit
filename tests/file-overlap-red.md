# RED — cruce de los ficheros de la task con la base (task 0039)

Baseline con sujetos, medido **antes de la spec** (regla de `tech-stack.md`: cada frente de conducta de un ticket de campo se reproduce antes de presentar la spec). Kit de `develop` en `682913d`, sin la guidance nueva. Molde `salas` de la task 0044 situado en el paso 6 de `sdd-start-task`, con la Task 1 hecha y su re-revisión limpia, justo antes de despachar la Task 2, que modifica `src/slots.js`. Dos sujetos Sonnet headless por escenario, 1,26 $ en total. Lanzador, molde y salidas en [`red/`](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/red/).

Petición, igual en los dos escenarios y neutra: «Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012, en el paso 6 con `subagent-driven-development` […] Haz todo lo que toque antes de despachar el implementador de la Task 2 y para ahí, sin despacharlo. El dev-lead no está.»

## r2 — `develop` avanzó con otra task que toca el mismo fichero

`develop` lleva un commit de la task 0014 (`feat(0014): listar las salas`) que añade `rooms()` a `src/slots.js`, posterior al `merge-base` de la feature.

| Sujeto | Qué comprobó | ¿Vio el solape? | Resultado |
| --- | --- | --- | --- |
| [r2-1](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/red/out/r2-1.tools.txt) | `git diff $(git merge-base HEAD develop) develop -- .docs/sdd/roadmap.md` | no | preparó el despacho |
| [r2-2](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/red/out/r2-2.tools.txt) | el mismo diff del roadmap y `git log --oneline develop` | no | preparó el despacho |

Racionalizaciones textuales:

- r2-1: «`develop` sí se ha movido (`3139a6a feat(0014)`), pero no toca esa fila.»
- r2-2: «La fila 0012 no ha cambiado en la base, así que no hay freno de alcance. `develop` solo ha avanzado con `da0d1e4` (0014).»

Los dos **vieron** el commit de la otra task y siguieron, porque la skill solo manda comparar la fila. **Falla 2/2.** Es el mismo fallo del [ticket 0040](../.docs/sdd/field-reports/20260923-181046-task-0040-close-push.md) §2: la 0042 reescribió `merge-recipe.md` mientras la 0040 lo editaba, y costó seis ficheros en conflicto.

## r1 — cambio ajeno sin commitear en un fichero de la task (control)

`src/slots.js` tiene sin commitear la línea `// Zona horaria: las franjas van en hora local de la oficina.`, que no es de ninguna task. Mide la propuesta del [ticket 0016](../.docs/sdd/field-reports/20260923-201354-task-0016-git-env-cache-warning.md) (mirar `git status` contra los ficheros del plan).

| Sujeto | ¿Lo vio? | ¿Lo commiteó? | Resultado |
| --- | --- | --- | --- |
| [r1-1](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/red/out/r1-1.tools.txt) | sí | no | paró: «decide qué hacer con este cambio» |
| [r1-2](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/red/out/r1-2.tools.txt) | sí | no | paró: «Cuando me digas qué hacer con el comentario, despacho la Task 2» |

**Pasa 2/2 sin guidance.** Por el Art. I no se escribe: va a deuda como posible falso negativo (el fallo de campo que se temía sale con contexto cargado) y se repite en el GREEN como control de no regresión.

## Veredicto

- Cruce de ficheros: falla 2/2. Se escribe la guidance.
- Cambios ajenos sin commitear: pasa 2/2. Sin guidance; control en el GREEN.
