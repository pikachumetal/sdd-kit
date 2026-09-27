# GREEN — tasks que se prueban, escenarios con datos y guion de pruebas (task 0060)

Mismos escenarios que [`testable-tasks-red.md`](testable-tasks-red.md), con el kit de `a691c49` (Tasks 1 y 2) y, en la tanda de REFACTOR, con el cambio de `plan-template.md` §2 de la Task 3. Son 7 sujetos headless Sonnet y **3,33 $**. Salidas en `.docs/sdd/specs/20260924-204639-task-0060-testable-tasks/green/out/`; molde y lanzador, los de `red/`.

**Campaña entera** (RED previo + GREEN + REFACTOR): 12 sujetos y **5,56 $**, frente a una previsión común de 13 sujetos y un techo de 8 $. La aplicaron `SUBJECT_CAP` y `COST_CAP` en `red/run.sh`.

| Escenario | RED | GREEN | REFACTOR |
| --- | --- | --- | --- |
| p3 — tasks verticales en una web por capas | falla 1/1 | **falla 1/1** | **pasa 2/2** |
| p2 — escenarios con datos y reglas completas | datos 4/5 · reglas pasa | **pasa 1/1** | — |
| v7 — guion de pruebas en la validación | forma parcial | **pasa 1/1** | — |
| v6 — parada de `pair` tras la task, con guion | falla 1/1 | **pasa 1/1** | — |
| c6 — control: `delegate` tras la task no para | — | **pasa 1/1** | — |

## p3 — tasks verticales

- p3-1 (0,65 $, GREEN): sigue partiendo por capas. «Task 1 — Favoritas en BD y API» · «**Se prueba en la aplicación**: no, porque es una base común: la estrella no existe hasta la Task 2». **Falla**: la salida «no, porque <base común…>» legitimó el corte horizontal. La línea obligó a decir por qué, pero el porqué valía para cualquier corte por capas.
- **REFACTOR** en la ayuda de §2: «Las capas de una sola funcionalidad no son base común: «BD y API de facturas» con la pantalla de subida en la task siguiente es partir por capas; la primera task lleva la subida de punta a punta, de la tabla al botón». La base común pasa a ser «una base común que usan varias funcionalidades». El ejemplo es de facturas, otro dominio que el molde.
- p3-2 (0,73 $): «Task 1 — Marcar y desmarcar una favorita, de la tabla a la estrella» (superficies BD · backend · frontend) y «Task 2 — Las favoritas salen primero», cada una con su prueba en la aplicación. Lo que no se puede probar en la web (Luis, sin selector de usuario) lo dice en la línea y da la comprobación con `GET /rooms` y `X-User: luis`. **Pasa**.
- p3-3 (0,84 $): «Task 1 — Marcar y desmarcar una favorita, con su estrella» (BD · backend · frontend), «Task 2 — Las favoritas salen primero»; «El orden no cambia todavía» en la prueba de la Task 1. **Pasa**.

## p2 — escenarios con datos y reglas completas

- p2-1 (0,43 $): todos los escenarios llevan datos. Por ejemplo, «GIVEN Ana con 3 reservas: Norte 08-09, Norte 09-10 y Norte 10-11 · WHEN Ana reserva Norte 11-12 · THEN falla con «Tope alcanzado: Ana ya tiene 3 reservas hoy»». El conflicto, abstracto en el RED, ahora es concreto: «si Ana ya tiene 3 reservas y pide Sur 10-11, el aviso es el de sala grande, no el del tope». **Avisos** lleva los dos vigentes y los tres nuevos, uno a uno. **Pasa**.

## v7 — guion de pruebas en la validación

- v7-1 (0,21 $): el smoke va en su sección, y aparte «## Guion de pruebas (para ti)» con «1. `node bin/salas.js reservar Norte 1012`. Debe mostrar `Franja no válida: usa HH-HH, p. ej. 10-12` y salir con código 1.», y así hasta el paso 4. **Pasa**: pasos numerados, acción en la aplicación y resultado esperado, separados del smoke.

## v6 y c6 — parada tras la task

- v6-1 (0,21 $, `pair`): «**Task 1 cerrada** (`654b3f6`…). En `pair` paro aquí antes de la Task 2», con «**Guion de pruebas de la Task 1**: 1. `node bin/salas.js reservar Norte 1012` → stderr `Franja no válida…` y código de salida 1. 2. …». Vio que el plan de juguete no traía la línea «Se prueba en la aplicación» y sacó el guion de la spec y la CLI. No escribió los RED de la Task 2. **Pasa**.
- c6-1 (0,27 $, `delegate`, control del Art. I contra una parada de más): no presenta guion ni para tras la Task 1. Escribe los RED de la Task 2, guarda su copia y prepara el encargo; para donde la petición dice, antes de despachar. **Pasa**.

La tanda de REFACTOR solo cambió la ayuda de §2 de `plan-template.md`, que p2, v7, v6 y c6 no leen para producir lo que se mide. Por eso no se repitieron.

## e0 — «cierra» sin validar (enmienda del 2026-09-25)

El paso 0 de `sdd-end-task` presenta ahora «el **guion de pruebas** del paso 7 de `sdd-start-task` (pasos numerados, cada uno con una acción en la aplicación y su resultado esperado) y tu smoke por separado».

- e0-1 (0,20 $): «**Guion de pruebas para ti**», una tabla con las columnas `#`, Acción y Resultado esperado. La fila 1 es `node bin/salas.js reservar Norte 1012` → «Franja no válida: usa HH-HH, p. ej. 10-12» y código de salida distinto de 0, y así hasta la 4. Va separado de «**Smoke mío**». **Pasa**. Pero los pasos 2 y 4 dan un resultado genérico («Reserva correcta, sin error»), aunque su smoke tenía el literal (`{"room":"Norte","slot":"10-12"}`). La forma se cumple; los datos, a medias.

**Campaña final**: 14 sujetos y **5,95 $**, frente a la previsión ampliada de 15 sujetos y 9 $.
