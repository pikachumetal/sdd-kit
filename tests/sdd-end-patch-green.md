# GREEN — el cierre de un patch y sus capacidades (task 0067)

Mismo molde, lanzador, peticiones y modelo que el [RED](sdd-end-patch-red.md), sobre una copia del kit con la guía nueva: el párrafo **Capacidades** del paso 1 de `sdd-end-patch`, las capacidades en el commit de cierre del paso 2, la sección «6. Delta de capacidad» de `patch-template.md` y `capability-template.md` nombrando el cierre de patch. Cuatro sujetos, 1,05 $. Con la tanda de REFACTOR (abajo), la campaña entera suma 12 sujetos y 3,65 $, frente a una previsión de 8 sujetos y ~6 $ y un techo de 12 sujetos y 9 $: la tanda más cabía en el techo, que se declaró para ella.

Salida: [`green/out/`](../.docs/sdd/specs/20260924-225643-task-0067-patch-capabilities/green/out/).

## Resultados

| Fallo del RED | E | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| No fusiona un cambio de comportamiento en la capacidad (RED 1/2) | p1 | `MODIFIED Consultar salas libres` en `patch.md` §6 y en `bookings.md`, con historial | ídem | **Pasa 2/2** |
| La capacidad va en el commit de cierre | p1 | sí, árbol limpio | sí, árbol limpio | **Pasa 2/2** |
| Toca la capacidad o escribe ceremonia sin cambio de comportamiento (control, RED 0/2) | p2 | no la toca, sin §6 | no la toca, sin §6 | **Pasa 2/2** |
| Control del paso 2: junta el fix y el commit de `patch.md` en uno (RED 4/4 lo hizo) | p1, p2 | p1-1 junta; p1-2 no | p2-1 no; p2-2 no | **Regresión: falla 3/4** |

Los dos p2 abrieron la capacidad y aplicaron la salida corta en voz alta: «`capabilities/bookings.md` ya decía el máximo de 2 h y el aviso `Máximo 2 h por reserva`, así que el fix solo devuelve el comportamiento a lo documentado». En el RED no la abrieron: la guía añade una lectura, no ceremonia en el repo.

## Forma

- **p1-2** escribió la §6 con el título como encabezado (`### MODIFIED Consultar salas libres`) y la capacidad en una línea suelta, no con la forma de la plantilla (`### Capacidad:` + `**MODIFIED — …**`). La fusión salió igual de bien: clave de fusión y bloque entero correctos. No se toca la guía: es forma dentro de un registro, y la plantilla ya da la forma.
- **p1-2** reescribió `bookings.md` con CRLF (escribió con PowerShell en Windows). El contenido cambia en tres líneas (`git diff --ignore-cr-at-eol`); el fin de línea es del entorno del sujeto, no de la skill.

## Regresión en el paso 2 (la encontró la revisión final)

En el RED, los cuatro sujetos juntaron con `git reset --soft` el commit del fix y el de `patch.md`, y la rama quedó en fix + cierre. En el GREEN, tres de cuatro dejaron tres commits: p1-2, «No junté el de patch.md porque el hash del fix no cambia»; p2-1, «el fix es un solo commit». La primera versión de este fichero no lo vio y decía «sin regresión»: medía solo la capacidad, no el paso que la guía nueva tenía al lado.

Con n=2 por escenario puede ser varianza, pero la lectura de los dos sujetos que lo justificaron es la misma: «fix» es el commit del código. `commit-milestones.md` dice que el hito del fix lleva código, tests y `patch.md`, y el paso 2 no lo repetía.

La revisión final encontró además un camino sin medir: `sdd-start-patch` calca `patch-template.md`, así que en campo el `patch.md` nace con la §6 vacía, y la salida corta decía «no escribas nada» mientras la plantilla dice «borra esta sección».

## REFACTOR

Dos frases:

- **Paso 2:** «si el fix —código, tests y `patch.md`— llega en más de un commit desde el `merge-base`, júntalo».
- **Salida corta del paso 1:** «si `patch.md` trae la sección de delta vacía de la plantilla, bórrala».

El molde gana `SECTION6=1`, con el que el `patch.md` nace con la §6 vacía de `patch-template.md`, como en campo. Una tanda más de 4 sujetos con los mismos escenarios: [`refactor/out/`](../.docs/sdd/specs/20260924-225643-task-0067-patch-capabilities/refactor/out/), 1,38 $.

| Qué | E | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| Fusiona el cambio en la capacidad, con historial, en el commit de cierre | p1 | sí | sí | **Pasa 2/2** |
| La §6 queda rellena, sin marcadores de la plantilla | p1 | sí | sí | **Pasa 2/2** |
| La capacidad no cambia y la §6 vacía se borra | p2 | sí | sí | **Pasa 2/2** |
| El fix y el commit de `patch.md` quedan juntos: la rama queda en fix + cierre | p1, p2 | 2 commits | 2 commits | **Pasa 4/4**; la regresión desaparece |
| Árbol limpio al terminar | p1, p2 | sí | sí | **Pasa 4/4** |
