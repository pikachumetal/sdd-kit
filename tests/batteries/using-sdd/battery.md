# Batería de regresión — `using-sdd`

Puerta de entrada del kit: una frase de dev, vaga y en castellano, en un proyecto con `.docs/sdd/` y superpowers. Cada escenario mide la primera skill que invoca el sujeto (la primera línea `>>> Skill:` de su `tools.txt`), o que no invoca ninguna. El **paso** es la fila de la tabla de puertas de `skills/using-sdd/SKILL.md` que decide la frase: una edición de esa fila lanza el tramo de su paso (`STEPS=<paso>`) más un escenario del fallo que la motiva.

Se lanza con `tests/headless/battery.sh` (`BATTERY=using-sdd`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 8 turnos como máximo. Dos moldes: `salas` (`mold-salas/`, la app de reservas de la 0014) y `ventas` (`mold-ventas/`, las fichas estáticas de la 0098). Los dos llevan el marcador con la versión del kit que se prueba (`put_kit_marker`).

`d1` pasa con «ninguna», pero la conducta completa es una sola pregunta sobre qué es y cuánto abarca, con la recomendación primero: se lee en su `texts.txt`.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| i1 | sdd-init | Quiero empezar a trabajar con SDD en este proyecto. | salas | `sdd-kit:sdd-init-brownfield` | 1 | 1/1 | sonnet | 0074, control |
| c1 | sdd-consult | Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo. | salas | `sdd-kit:sdd-consult` | 1 | 1/1 | sonnet | 0074, control |
| r1 | sdd-roadmap | El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Ponte con ello. | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | `using-sdd-red.md`: `sdd-start-feature` 2 de 2 |
| r2 | sdd-roadmap | Te paso las notas de la reunión de hoy con el cliente: quieren reservas recurrentes, ver las salas libres por la tarde y quitar lo del correo. A ver qué hacemos. | salas | `sdd-kit:sdd-roadmap` | 1 | 1/1 | sonnet | 0074, control |
| r3 | sdd-roadmap | Me han asignado en Azure el 412 (exportar reservas a .ics) y el 415 (máximo 2 reservas por persona). | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | `using-sdd-red.md`: `sdd-start-feature` 2 de 2 |
| r4 | sdd-roadmap | Lo de exportar a calendario tiene que ir antes que los avisos por correo. | salas | `sdd-kit:sdd-roadmap` | 1 | 1/1 | sonnet | 0074, control |
| r5 | sdd-roadmap | Apunta en el roadmap lo del filtro por sala, no lo arranques todavía. | salas | `sdd-kit:sdd-roadmap` | 1 | 1/1 | sonnet | `using-sdd-green.md`, control tras la revisión final |
| f1 | sdd-propose | Mete un filtro por sala en el comando libres. | salas | `sdd-kit:sdd-propose` | 1 | 1/1 | sonnet | 0074, control |
| f2 | sdd-propose | Let's build a waitlist for when a room is full. | salas | `sdd-kit:sdd-propose` | 1 | 1/1 | sonnet | task 0014: `brainstorming` primero 1 de 3 |
| f3 | sdd-propose | Es una tontería: que al reservar se pueda poner una nota. Hazlo rápido. | salas | `sdd-kit:sdd-propose` | 1 | 1/1 | sonnet | task 0014: `brainstorming` primero 2 de 3 |
| p1 | sdd-propose | Si cancelo una reserva que no existe me dice «cancelada» igual. | salas | `sdd-kit:sdd-propose` | 1 | 1/1 | sonnet | 0074, control |
| v1 | sdd-propose | Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación. | ventas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `visual-patch-red.md`: edición directa 2 de 2 |
| c1w | sdd-propose | Oculta Borrar si el pedido está facturado y pásalo a la derecha, en las dos fichas. | ventas | `sdd-kit:sdd-propose` | 1 | 1/1 | sonnet | `visual-patch-red.md` (`c1`), control |
| pc1 | sdd-propose | Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas. | ventas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `patch-lane-red.md` (`p1`): `sdd-start-feature` 4 de 4 |
| bt1 | sdd-propose | Métele un patch rápido: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €. | ventas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `patch-lane-red.md` (`b2`): control de la puerta trasera |
| e1 | sdd-end-release | Ya está todo lo de esta versión: hay que cerrar la entrega y mandarle el correo al cliente. | salas | `sdd-kit:sdd-end-release` | 1 | 1/1 | sonnet | 0074, control |
| s1 | sdd-config | No me gusta que me pares tanto, quiero trabajar con menos preguntas. | salas | `sdd-kit:sdd-config` | 2 | 2/2 | sonnet | `using-sdd-red.md`: a la memoria, 2 de 2 |
| d1 | duda | Hay que mejorar las reservas, que se quejan los usuarios. | salas | ninguna | 2 | 2/2 | sonnet | `using-sdd-red.md`: `sdd-start-feature` 2 de 2 |
| t1 | sdd-propose | Corrige el typo «recervas» del README. | salas | `sdd-kit:sdd-propose` | 1 | 1/1 | sonnet | 0074, control; desde la 0160, carril config |
| c2 | sdd-propose | Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas. | ventas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `visual-patch-red.md`: edición directa 2 de 2; desde la 0117, un texto dado literal es petición cerrada |

## Procedencia de las reglas

Cada regla de `skills/using-sdd/SKILL.md`, de dónde viene y qué escenario la cubre. Quien edita la skill lee esta tabla antes: una regla sin escenario es la primera candidata a salir si su RED no la respalda.

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Overview: prevalece sobre `brainstorming` | task 0014 (GH #1: con «Let's build» y «hazlo rápido», `brainstorming` primero 3 de 6) | f2, f3 |
| Puerta: sin `.docs/sdd/`, init greenfield o brownfield | router de la 0014 | i1 (brownfield); greenfield sin escenario |
| Puerta: una pregunta o una duda → `sdd-consult` | router de la 0014 | c1 |
| Puerta: planificar sin hacerlo todavía, algo grande, notas de reunión, items del gestor (también asignados), reordenar, preparar la release → `sdd-roadmap` | `using-sdd-red.md` (r1, r3: 2 de 2 a `sdd-start-feature`); router de la 0014 | r1, r2, r3, r4, r5; «preparar la release» sin escenario |
| Puerta: un cambio de cualquier tamaño —funcionalidad, fallo, ajuste o retirada de presentación, dependencias, CI o configuración, typo o renombrado, investigación que deja medidas— → `sdd-propose`, antes que `brainstorming` (feature 0160: una sola puerta; las filas de feature, patch y edición directa se funden) | task 0014; `patch-lane-red.md` (b1, b2: control de la puerta trasera); `visual-patch-red.md` (v1 y c2: edición directa 2 de 2); `tests/sdd-propose-0160-red.md` (k1: un cambio de configuración, directo y sin gate, 2 de 2) | f1, f2, f3, p1, v1, c1w, pc1, bt1, t1, c2 |
| Puerta: cerrar la entrega → `sdd-end-release` | router de la 0014 | e1 |
| Puerta: cómo quiere trabajar cada uno → `sdd-config`, nunca la memoria | `using-sdd-red.md` (s1: memoria 2 de 2) | s1 |
| Regla de duda: una sola pregunta, con la recomendación primero | `using-sdd-red.md` (d1: `sdd-start-feature` 2 de 2) | d1 |
| Racionalización «Quiere que se haga, así que es una feature» | `using-sdd-red.md` (d1) | d1 |
| Racionalización «Lo guardo en memoria para próximas sesiones» | `using-sdd-red.md` (s1) | s1 |
| Racionalización «Es un typo o subir una versión: edición directa» | `visual-patch-red.md` (v1, c2); `tests/sdd-propose-0160-red.md` (k1) | t1, c2 |
| Racionalización «Me los han asignado: los hago uno detrás de otro» | `using-sdd-red.md` (r3) | r3 |
