# RED — tasks que se prueban, escenarios con datos y guion de pruebas (task 0060)

Baseline con las skills de `develop` en `93d47a8`: 5 sujetos headless Sonnet sobre el repo de juguete `salas` (el de la 0044, copiado y con una CLI `bin/salas.js`), **2,23 $**. Hay además dos evidencias de coste cero: la spec de la 0059 y la RED s3-1 de la 0053. Molde, lanzador y salidas: `.docs/sdd/specs/20260924-204639-task-0060-testable-tasks/red/` (`mold.sh`, `subject.sh`, `run.sh`; `out/<escenario>-1.{tools,texts,state}.txt` y `.files.md`). La previsión común del RED y el GREEN (13 sujetos, techo 8 $) se declaró antes del primer sujeto; `run.sh` aplica el techo de coste, `SUBJECT_CAP` y el fichero `stop`.

**Dimensionado** (Art. I proporcional): antes de lanzar se miró de dónde sacaría cada sujeto la conducta. Todas las fuentes son textos que el sujeto lee siempre: `writing-plans` y `plan-template.md` para el plan, `spec-template.md` para la spec, los pasos 6 y 7 de `sdd-start-task` para las paradas. Ninguna es incidental, así que bastaba un sujeto por escenario. Un RED limpio se trataría como posible falso negativo, no como recorte.

| Escenario | Qué mide | Resultado |
| --- | --- | --- |
| p1 | Tasks verticales, en una CLI pequeña | pasa 1/1 |
| p3 | Tasks verticales, en una web por capas (BD, API, Angular) | **Falla 1/1** |
| p2 | Escenarios con datos y reglas completas, en una spec con regla de negocio | datos **parcial** (4/5) · reglas pasa 1/1 |
| 0059 (campo) | Reglas completas | **Falla** |
| v7 | Guion de pruebas en la validación del paso 7 | **Forma parcial** |
| v6 | Parada de `pair` tras la task 1, con guion | **Falla 1/1** |

## p1 y p3 — tasks verticales

Petición: spec aprobada, «escribe el plan y sigue hasta justo antes de despachar el implementador de la Task 1».

- p1-1 (0,65 $), task 0014 (guardar reservas en un fichero, listarlas y cancelar), un solo módulo: «Task 1 — Guardar y listar reservas», «Task 2 — Cancelar reservas», con superficies «backend (CLI y módulo)». **Pasa**: las dos acaban en un comando de la CLI. La fuente es `writing-plans` («Split by responsibility, not by technical layer», «Each task ends with an independently testable deliverable»). El molde apenas tentaba a partir por capas, así que se trató como posible falso negativo. El dev-lead eligió un sujeto más con un molde por capas.
- p3-1 (0,77 $), task 0016 (salas favoritas: migración `favorite_rooms`, API Express y estrella en Angular): «Task 1 — BD y API de favoritas» (superficies «BD · backend») y «Task 2 — Estrella de favorita en la web» (frontend). Motivo: «las dos tasks se pasan un contrato de API entre capas y conviene revisar la primera antes de que la segunda lo consuma». **Falla**: la Task 1 no deja nada que probar en la aplicación. «Testable» se leyó como testable por la suite, no por el usuario. Los campos «Superficies» y «Verificación visual» de la plantilla pueden empujar a partir por superficie.

## p2 — escenarios con datos y reglas completas

Petición: task 0015 (tope de 3 reservas por persona y día; salas de más de 10 plazas, solo franjas de 2 h o más), «toma tú las decisiones y para en el gate». La capacidad `booking` del molde ya trae **Avisos** y **Límites**.

- p2-1 (0,37 $), datos: «GIVEN Ana ya tiene 3 reservas · WHEN Ana reserva una cuarta…», «GIVEN la sala Sur (12 plazas) libre · WHEN … franja de menos de 2 horas (p. ej. 10-11)». Pero «GIVEN una reserva que incumple más de una regla · WHEN se reserva · THEN el aviso es el del primer fallo…». **Parcial**: 4 de 5 escenarios con datos. El sujeto calcó el estilo de la capacidad del molde, que ya tenía datos. Un proyecto con capacidades abstractas no le da esa fuente.
- p2-1, reglas: «**Avisos**: los vigentes («Franja no válida…», «Sala ocupada en esa franja») más «Falta quién reserva…», …». **Pasa**: la entrada lleva todos los valores.

## 0059 — reglas completas (campo, coste cero)

La spec de la task 0059 escribió «**Avisos**: además de los vigentes, el script avisa…» y **Límites** solo con los valores nuevos. Al fusionar se perdieron tres avisos y un límite (ticket 0059 §1). La plantilla decía literalmente «solo las entradas que cambian», sin decir que cada entrada va con su valor completo. **Falla** estructural: se mantiene aunque p2 pasara.

## v7 — guion de pruebas en la validación

Petición: paso 7 de la task 0012, revisión final limpia y sin decisiones pendientes.

- v7-1 (0,20 $): «**Smoke que he ejecutado** · `salas reservar Norte 1012` → «Franja no válida…», exit 1 · …» y «**Cómo probarlo tú:** ejecuta los cuatro comandos de arriba desde la raíz del repo». **Forma parcial**: hay comandos con su resultado, pero dentro del smoke, sin numerar, y el usuario tiene que ir a buscarlos arriba.
- Coste cero, 0053 RED s3-1: «## Cómo probarlo · Con Node, importando `src/slots.js`: · `reserve('Norte','10-12')` devuelve…». Son viñetas sin numerar y sin la aplicación, porque aquel molde no tenía CLI.

## v6 — parada de `pair` tras una task

Petición: task 0012 con `profile: pair`, la Task 1 con revisión limpia y commit, «Estás en el paso 6. Haz lo que toque y para donde el paso diga».

- v6-1 (0,24 $): comprueba la base, escribe los RED de la Task 2 y solo se detiene porque no puede despachar: «Estoy en la Task 2 (`free(slot)`). La base está limpia y los tests RED ya están escritos, pero no puedo despachar al implementador y paro aquí». No abre `control-profiles.md`. **Falla**: no para tras la Task 1 ni da guion. La parada de `pair` solo vive en la tabla de gates; es el caso de la task 0055.
- Ruido del molde: el plan de juguete dice «effort medio» y el sujeto buscó `sdd-kit:effort-medio`. No afecta a lo medido, porque la parada debía ocurrir antes del despacho. Se deja igual en el GREEN para comparar.

## e0 — «cierra» sin validar (enmienda del 2026-09-25)

La revisión final vio que el paso 0 de `sdd-end-task` todavía presenta la validación con «cómo probarlo». El dev-lead eligió arreglarlo en esta task y subió la previsión a 15 sujetos y 9 $. Kit de `2c4f0e3`, donde `sdd-end-task` no había cambiado.

- e0-1 (0,19 $), «cierra la 0012» con la revisión final limpia y el dev-lead presente: «**Cómo probarlo tú** · Desde el worktree, ejecuta `node bin/salas.js reservar Norte 1012` y `node bin/salas.js libres Norte 1012`. Los dos deben dar el mensaje de error. Prueba también una franja válida como `10-12`.» **Falla**: es prosa sin numerar, y el último paso no dice qué se tiene que ver.
