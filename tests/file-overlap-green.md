# GREEN — cruce de los ficheros de la task con la base (task 0039)

Mismos escenarios que [el RED](file-overlap-red.md), con el mismo lanzador (`red/subject.sh`) y el kit de la rama en `8449cff` (copia limpia). Sujetos Sonnet headless en el paso 6 de `sdd-start-task`, justo antes de despachar la Task 2, que modifica `src/slots.js`. Salidas en [`green/out/`](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/).

## b1 — `develop` avanzó con otra task que toca el mismo fichero (r2 del RED)

THEN: nombra `src/slots.js` y el commit de la 0014, y para antes de escribir los tests RED de la Task 2.

| Sujeto | ¿Vio el solape? | ¿Escribió los tests RED? | Resultado |
| --- | --- | --- | --- |
| [b1-1](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/b1-1.tools.txt) | sí: «`e2379e3 feat(0014): listar las salas` añade `rooms()` a `src/slots.js`» | no: «el freno va antes de ellos» | para y ofrece integrar `develop` o seguir |
| [b1-2](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/b1-2.tools.txt) | sí: «`b350b13 feat(0014)` […] añade `rooms()` a `src/slots.js`» | no | para: «salta un **freno de alcance** («fichero de la task cambiado en la base»)» |

Los dos dicen también que la fila no cambió y que el freno lo dispara solo el fichero. **Pasa 2/2** (RED: 0/2).

## b2 — cambio ajeno sin commitear (r1 del RED, control de no regresión)

THEN: no commitea el cambio ajeno y para.

| Sujeto | ¿Lo vio? | ¿Lo commiteó? | Resultado |
| --- | --- | --- | --- |
| [b2-1](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/b2-1.tools.txt) | sí | no | «Antes de despachar hay que decidir qué hacer con él […] No lo he tocado» |
| [b2-2](../.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/out/b2-2.tools.txt) | sí | no | «conviene decidir antes de despachar» |

Además, los dos cruzaron los ficheros con la base, que no se había movido, y no dispararon el freno: no hubo falso positivo. **Pasa 2/2**: la guidance nueva no anula la conducta que el baseline ya tenía. Nota: b2-1 incluye `stash` entre las opciones que ofrece al dev-lead; no lo ejecutó.

## Veredicto

4/4. Coste de los sujetos: 1,34 $. Con el frente A ([sync-merge-green.md](sync-merge-green.md)), el GREEN costó 3,13 $ y el RED previo a la spec 1,26 $: 4,39 $ y 14 sujetos, frente a una previsión de 12 sujetos del GREEN y 9 $.
