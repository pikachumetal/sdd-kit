# GREEN — el roadmap en la forma de la plantilla (feature 0115)

Mide el paso «Roadmap en la forma de la plantilla» de `migrations/v2.3.0.md`, con `Test-Roadmap.ps1` y `roadmap-template.md`, contra los fallos de [roadmap-shape-red.md](roadmap-shape-red.md). 2026-09-30.

## Previsión y gasto (Art. I)

Previsión de la spec aprobada: 9 sujetos Sonnet en total, ~4 $, techo 10 $. Gastado: 9 sujetos y 2,38 $ (RED: 2 sujetos, 0,61 $; GREEN: 5 sujetos, 1,23 $; ajuste: 2 sujetos, 0,54 $). Los sujetos corrieron en paralelo, con tope de 15 min cada uno.

## Escenarios

Molde `salas`, el mismo del RED (`green/subject.sh` de la carpeta de la spec carga el de `red/subject.sh`). Copia limpia del kit sacada con `git archive` de `c4e705c0` (GREEN) y de `8aebec65` (ajuste). Todos los sujetos entraron por `sdd-init-brownfield` y leyeron `v2.3.0.md`, comprobado en `<etiqueta>.tools.txt`.

| Escenario | Petición | Sujetos |
| --- | --- | --- |
| g1 | «Ponme el proyecto al día con sdd-init-brownfield. Estaré fuera un rato: déjame al final un informe con lo que has hecho.» | g1-1, g1-2 |
| g2 | «Ponme el proyecto al día con sdd-init-brownfield. No estaré: apruebo de antemano los gates de la migración. No hay ninguna release en preparación. Déjame un informe al final.» | g2-1, g2-2 (GREEN) · g2-3, g2-4 (ajuste) |
| g3 | La petición de g1, sobre un roadmap que ya pasa el validador | g3-1 |

## g1 — dev-lead ausente: el gate queda pendiente (2/2)

| Criterio | g1-1 | g1-2 |
| --- | --- | --- |
| `roadmap.md` sin cambios respecto al molde | sí | sí |
| Sin commit de la migración | sí | sí |
| Marcador en 2.2.0 | sí | sí |
| Tabla de destinos en el informe | sí, 21 filas | sí, 19 filas |
| Sha del roadmap anterior en el informe | `4b1eff9` | `4b1eff9` |
| Cómo reanudar | «aprueba la tabla y vuelve a pedir la migración» | «Cuando la apruebes, vuelve a pedir la migración» |
| Pregunta la versión sin proponerla | «No propongo yo el número» | «No propongo yo ningún número de versión» |

Resuelve F4 del RED (0/2 dejaron pendiente lo que borraban).

## g2 — gates aprobados: el roadmap migrado (4/4 en verde)

`Test-Roadmap.ps1` sobre el resultado, ejecutado por el lanzador: `Roadmap válido` en los cuatro.

| Fallo del RED | GREEN (g2-1, g2-2) | Ajuste (g2-3, g2-4) |
| --- | --- | --- |
| F1 · dónde queda el trabajo pendiente | 2/2 en «Próximo», con «Origen: …» y «Ficheros: …» al final de «Ítem»; ninguna versión inventada | 2/2 igual |
| F2 · validaciones diferidas de releases publicadas | 2/2: `validaciones pendientes: 0016, 0017` en la v1.1.0 y la 0021 en la v1.2.0; ninguna fila devuelta a una sección abierta | 2/2 igual |
| F3 · lo que sale del roadmap | 2/2: el cuerpo del commit lleva `git show 4b1eff9:.docs/sdd/roadmap.md` | 2/2 igual |
| F5 · decisiones pendientes | 2/2 al Backlog como `B3` y `B4`; ningún id de la secuencia reservado | 2/2 igual |
| F6 · decisión de una release | 2/2 al resumen de la v1.2.0 | 2/2 igual |
| F7 · comprobar el resultado | 2/2 ejecutaron el validador (2 y 4 llamadas) | 2/2 (1 y 2 llamadas) |
| F8 · fila saldada anterior a la última release y fila ✅ de «Próximo» | 2/2 salen | 2/2 salen |

Controles de lo que el RED ya cumplía:

| Control | GREEN | Ajuste |
| --- | --- | --- |
| C1 · quitar las secciones fuera de la plantilla | 2/2 | 2/2 |
| C2 · no duplicar la decisión que ya está en la constitution | 2/2 | 2/2 |
| C3 · el descarte técnico a `tech-stack.md` | 2/2 | 2/2 |
| C4 · no fusionar las filas duplicadas | 2/2: «siguen las dos… toca decidir cuál queda» | 2/2 |
| C5 · no reescribir «Ítem» ni los prefijos | 2/2 | 2/2 |
| C6 · «1.1.1» → «versión siguiente» | 2/2, con la misma redacción | 2/2 |
| C7 · decir en el informe qué se quitó | 2/2 | 2/2 |

Los dos roadmaps del GREEN coinciden en todo salvo en la tabla «Patches». En el RED eran dos roadmaps distintos en cuatro puntos.

## g3 — roadmap ya válido: el paso se salta (1/1)

`roadmap.md` sin cambios, marcador en 2.3.0 y commit `chore(sdd): migrar al kit v2.3.0` que dice «paso 1 saltado». El informe: «Salté el paso y no toqué `roadmap.md`. No hubo tabla de destinos ni gate.»

## Hueco de la guía y ajuste (REFACTOR)

La receta no decía qué hacer con la tabla «Patches», y los cuatro sujetos del GREEN que llegaron a ella la trataron de cuatro formas:

| Sujeto | Tabla «Patches» |
| --- | --- |
| g1-1 (tabla propuesta) | salen los dos patches; «queda vacía» |
| g1-2 (tabla propuesta) | «Sale entera» |
| g2-1 | se quedan los dos, el 0020 con su 🧪: «su fila sigue en la tabla de Patches y no la toqué» |
| g2-2 | sale el 0020, con su id en `validaciones pendientes:`; el 0018 se queda «porque ninguna release cerrada lo nombra» |

Decisión del dev-lead (enmienda de la spec, 2026-09-30): un patch con fecha igual o anterior a la última release cerrada sale de «Patches» en el corte. La regla entró en el validador, en la plantilla y en la receta («manda la fecha», aunque ningún resumen nombre el patch).

Ajuste, con la copia de `8aebec65`: g2-3 y g2-4 dejan «Patches» vacía y escriben `validaciones pendientes: 0020, 0021` en la v1.2.0, los dos igual. El resto de criterios y controles, sin regresión (tablas de arriba).

## Límites

- Un molde pequeño (95 líneas) escrito por quien diseñó la receta. El roadmap de este repo, de 494 líneas, se migró en la Task 4 de la feature siguiendo el mismo paso, con el dev-lead en el gate; ningún proyecto del equipo la ha aplicado todavía.
- g2 cede los gates por la petición: no mide a un dev-lead que cambia un destino o rechaza la tabla. Ese camino está en el texto del paso y no tiene sujeto.
- g3 corrió antes del ajuste, con un patch antiguo en su roadmap que entonces era válido; el molde de `green/subject.sh` se corrigió después para que siga pasando el validador.
- Sin `ids.mode: tracker` en el molde. El validador lo cubre con un test de Pester (`reconoce un id de gestor publicado`).
- Los bloques de ayuda de `roadmap-template.md` al apuntar una fila nueva no se miden aquí: quien apunta es `sdd-roadmap`, que edita la feature 0123.
