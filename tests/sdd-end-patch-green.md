# GREEN — el cierre de un patch y sus capacidades (task 0067)

Mismo molde, lanzador, peticiones y modelo que el [RED](sdd-end-patch-red.md), sobre una copia del kit con la guía nueva: el párrafo **Capacidades** del paso 1 de `sdd-end-patch`, las capacidades en el commit de cierre del paso 2, la sección «6. Delta de capacidad» de `patch-template.md` y `capability-template.md` nombrando el cierre de patch. Cuatro sujetos, 1,05 $; la campaña entera, 8 sujetos y 2,27 $, frente a una previsión de 8 sujetos y ~6 $ y un techo de 12 sujetos y 9 $.

Salida: [`green/out/`](../.docs/sdd/specs/20260924-225643-task-0067-patch-capabilities/green/out/).

## Resultados

| Fallo del RED | E | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| No fusiona un cambio de comportamiento en la capacidad (RED 1/2) | p1 | `MODIFIED Consultar salas libres` en `patch.md` §6 y en `bookings.md`, con historial | ídem | **Pasa 2/2** |
| La capacidad va en el commit de cierre | p1 | sí, árbol limpio | sí, árbol limpio | **Pasa 2/2** |
| Toca la capacidad o escribe ceremonia sin cambio de comportamiento (control, RED 0/2) | p2 | no la toca, sin §6 | no la toca, sin §6 | **Pasa 2/2**, sin regresión |

Los dos p2 abrieron la capacidad y aplicaron la salida corta en voz alta: «`capabilities/bookings.md` ya decía el máximo de 2 h y el aviso `Máximo 2 h por reserva`, así que el fix solo devuelve el comportamiento a lo documentado». En el RED no la abrieron: la guía añade una lectura, no ceremonia en el repo.

## Forma

- **p1-2** escribió la §6 con el título como encabezado (`### MODIFIED Consultar salas libres`) y la capacidad en una línea suelta, no con la forma de la plantilla (`### Capacidad:` + `**MODIFIED — …**`). La fusión salió igual de bien: clave de fusión y bloque entero correctos. No se toca la guía: es forma dentro de un registro, y la plantilla ya da la forma.
- **p1-2** reescribió `bookings.md` con CRLF (escribió con PowerShell en Windows). El contenido cambia en tres líneas (`git diff --ignore-cr-at-eol`); el fin de línea es del entorno del sujeto, no de la skill.

Sin REFACTOR: ningún hueco de la guía.
