---
id: 20260924-204639-task-0060-testable-tasks
task: 0060
title: Tasks que se prueban, escenarios con datos y guion de pruebas
mode: full
status: approved
created: 2026-09-24
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-24
---

# Spec — Tasks que se prueban, escenarios con datos y guion de pruebas

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `capabilities` y uno de `task-flow`), contrato público (las plantillas las calcan los proyectos)
- Mínimo razonable: ninguna — deja sin mirar si el MODIFIED de «El delta declara el comportamiento por capacidad» pierde alguna cláusula vigente; lo cubre el repaso de coherencia, que lo compara línea a línea con la capacidad
```

1. **La pieza 1 va como una línea por task en `plan-template.md`**: `**Se prueba en la aplicación**: <qué hace el usuario y qué ve> · o «no, porque <base común | migración | refactor>»`, más la orientación en la ayuda de §2. La línea es la forma de que «el plan dice por qué». Además, la parada de `pair` saca de ella el guion de la task. Se omite si el plan no cambia ninguna aplicación (docs, tooling de proceso), como «Verificación visual». No hay tamaño en horas.
2. **Las piezas 2 y 3 son un solo `MODIFIED`** de «El delta declara el comportamiento por capacidad» (capacidad `capabilities`): las dos son forma del delta. La plantilla lleva el ejemplo del dev-lead («bolsa FR, IT, PT; oferta en DE → no cubre»), que es de otro dominio que el molde de la campaña (salas).
3. **Forma del guion**, común a la validación y a la parada de `pair`: pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice su propio paso, con la comprobación que sí se puede hacer. Sustituye a «cómo probarlo» en el paso 7. El smoke del agente va aparte: es lo que ya hizo él, y el guion es lo que hará el usuario.
4. **La parada de `pair` tras cada task va en el paso 6 de `sdd-start-task`**, en la frase que cierra cada task, como pediste; `control-profiles.md` no se toca. El RED mostró que hoy no se para: la parada solo vive en la tabla, y 1 de 1 sujetos en `pair` pasó a la task 2 sin abrirla. Es el caso de la 0055: la regla va en el paso que produce la salida.
5. **Evidencia con nombre de tema**: `tests/testable-tasks-red.md` y `tests/testable-tasks-green.md`, más un test de contrato de texto, `tests/TestableTasks.Tests.ps1`, que fija los literales en su sitio. Es la barrera que no depende de la muestra de un sujeto (la iniciativa de la 0059).
6. **Campaña, previsión y techo comunes** (Art. I, task 0039). Aprobaste 13 sujetos y 8 $, con `SUBJECT_CAP=13`, `COST_CAP=8` y el fichero `stop` en `red/run.sh`. El RED previo gastó 5 sujetos y 2,23 $. El GREEN usa 5 sujetos, 1 por escenario: p3, p2, v7, v6 y el control c6. Quedan 3 de reserva para una tanda de REFACTOR.
7. **Repaso de coherencia**. El segundo paso del guion de ejemplo decía «la reserva impresa», justo la frase abstracta que la pieza 2 quiere quitar; ahora dice `{"room":"Norte","slot":"10-12"}`. Además, los dos `MODIFIED` se compararon cláusula a cláusula con la capacidad vigente, y no se pierde ninguna.

### Decisiones tomadas con el dev-lead

- Carril y modo: task full, perfil `delegate` — «Full, delegate (Recomendada)».
- Previsión común del RED previo y del GREEN: 13 sujetos, techo 8 $ — «13 sujetos, techo 8 $ (Recomendada)».
- Pieza 1, limpia con un molde pequeño: un sujeto más con un molde por capas — «Un sujeto más, molde por capas (Recomendada)». Falló: la pieza se queda.

### RED previo (5 sujetos, 2,23 $; salidas en `red/out/`)

| Escenario | Pieza | Resultado |
| --- | --- | --- |
| p1: plan de una CLI pequeña (un módulo, un fichero de datos) | 1 | Limpio: dos tasks verticales. Lo sacó de `writing-plans` («split by responsibility, not by technical layer»). |
| p3: plan de una web por capas (BD, API, Angular) | 1 | **Falla**: «Task 1 — BD y API de favoritas», «Task 2 — Estrella en la web». Motivo: «las dos tasks se pasan un contrato de API entre capas». La task 1 no deja nada que probar en la aplicación. |
| p2: spec de una regla de negocio (tope por persona, salas grandes) | 2 y 3 | Parcial en la 2: 4 de 5 escenarios con datos, y «una reserva que incumple más de una regla» sin ellos. La capacidad del molde ya traía datos, una fuente que un proyecto real puede no tener. En la 3, limpio en el laboratorio: «los vigentes (…) más…». |
| spec de la 0059 (campo, coste cero) | 3 | **Falla**: «además de los vigentes, el script avisa…». La fusión perdió tres avisos y un límite (ticket 0059 §1). La plantilla dice literalmente «solo las entradas que cambian». |
| v7: validación del paso 7 | 4 | Forma parcial: comandos con su resultado, pero dentro del smoke, sin numerar y con «ejecuta los cuatro comandos de arriba». También la 0053 RED s3-1: viñetas sin la aplicación. |
| v6: `pair`, task 1 cerrada | 4 | **Falla**: no para, escribe los RED de la task 2 y solo se detiene porque no puede despachar. No da guion ni abre `control-profiles.md`. |

## Intent

Un compañero del dev-lead usa el kit 1.1.0 en un proyecto real y nota dos cosas. La primera es «hago la spec y luego no tengo nada que hacer»: las tasks se parten por capas y hasta la última no hay nada que probar, y la parada de `pair` no le da qué mirar. La segunda es «no acaba nunca»: una regla de negocio mal entendida solo se vio al validar y abrió otra task. Además, la fusión de reglas de capacidad pierde texto cuando la spec escribe solo lo nuevo (ticket 0059 §1). Se quiere que cada task deje algo probable en la aplicación, que los escenarios de reglas lleven datos, que una regla que cambia se copie completa y que cada parada para probar traiga un guion.

## Scope

- Entra: la orientación de tasks verticales y la línea «Se prueba en la aplicación» en `plan-template.md` §2. La ayuda del delta en `spec-template.md`: escenarios con datos y reglas con su valor completo. El guion de pruebas en el paso 7 de `sdd-start-task`, y la parada de `pair` con guion en el paso 6. Test de contrato de texto y evidencia RED/GREEN.
- No entra: arrancar el entorno antes del guion (es preferencia personal, va en la 0061). `control-profiles.md`, las init y `migrations/` (los toca la 0061). La fusión de `sdd-end-task`, que ya sustituye la entrada entera y es correcta. Un tamaño fijo por task. La futura `sdd-feature`.

## Approach

Todo es texto de plantilla y de skill, en el punto donde se escribe la salida. Las piezas 1 a 3 van en la ayuda de las plantillas, que lee quien planifica o especifica. La 4 va en los pasos 6 y 7 de `sdd-start-task`, con una sola forma de guion que los dos pasos citan. `superpowers:writing-plans` ya pide «an independently testable deliverable» y «split by responsibility, not by technical layer». El kit añade lo que el RED mostró que falta: *probable en la aplicación* y el *por qué* cuando no se puede (Art. IX, regla 3).

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — Cada task de producto acaba en algo que se prueba en la aplicación**
- GIVEN un plan para las salas favoritas, que tocan la migración `favorite_rooms`, la API y la estrella de la pantalla de salas
- WHEN se parte en tasks
- THEN la task «Marcar Sur como favorita» atraviesa migración, API y estrella, y su línea «Se prueba en la aplicación» dice «Ana pulsa la estrella de Sur y la ve llena tras recargar». No sale una task «BD y API» seguida de otra «web».
- AND una task que no deja nada probable (una migración de datos previa, un refactor) lleva en esa línea «no, porque <motivo>»
- AND el plan no fija un tamaño en horas por task

**ADDED — En `pair`, cada task cerrada para con su guion de pruebas**
- GIVEN perfil `pair` y la Task 1 de 2 de la task 0012 («Validar al reservar») con su revisión limpia y su commit
- WHEN el hilo cierra la Task 1
- THEN para antes de la Task 2 y presenta el guion de la Task 1, con la forma del guion de la validación: por ejemplo, «1. `salas reservar Norte 1012` → «Franja no válida: usa HH-HH, p. ej. 10-12»; 2. `salas reservar Norte 10-12` → `{"room":"Norte","slot":"10-12"}`»
- AND en `delegate` y `unattended` sigue con la Task 2 sin parar ni presentar guion

**MODIFIED — El trabajo se valida con el usuario antes de cerrar** (antes: «cómo probarlo»)
- GIVEN una task con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-task` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la task queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección

### Capacidad: `capabilities`

**MODIFIED — El delta declara el comportamiento por capacidad** (antes: «con solo las entradas que cambian»; se añade la cláusula de los datos)
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un escenario de una regla de negocio lleva datos concretos de entrada y de salida («bolsa FR, IT, PT; oferta en DE → no cubre»), no una frase abstracta («una oferta fuera de la bolsa no cubre»)
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), cada una con su valor completo: con **Avisos**: A y B vigentes y una task que añade C, la entrada dice A, B y C, porque `sdd-end-task` sustituye o añade cada entrada entera por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-24 | aprobada: «si» |
