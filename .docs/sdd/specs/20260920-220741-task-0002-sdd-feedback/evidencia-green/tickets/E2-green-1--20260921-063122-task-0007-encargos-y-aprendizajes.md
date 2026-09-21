---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 0007
mode: full
date: 2026-09-21
---

# Ticket para el kit — task 0007: el encargo del implementador no lleva contratos entre tasks y el cierre no prevé destino para un aprendizaje estructural

## Contexto

- Carril y modo: task full
- Skills del kit usadas: `sdd-start-task` (con `superpowers:brainstorming`), `sdd-end-task` en los pasos 0 a 4 y 6 (los pasos 5, 7, 8, 10 y 11 no constan en la bitácora: el cierre seguía abierto al redactar este ticket), `sdd-feedback`
- Proyecto: aplicación web de negocio (Angular 20, .NET 9, SQL Server); una persona desarrolladora con agentes y un interlocutor de negocio del cliente; plan de 3 tasks
- Modelo del hilo: no consta en la bitácora
- Modelos de los subagentes: sonnet en los tres implementadores, según el plan (sin effort declarado)
- Coste en reloj: 4 h 20 min (estimado 3 h 30 min)
- Coste en tokens: subagentes 212k + 180k + 143k = 535k; hilo principal no medido
- Fuente de la evidencia: bitácora de la sesión, escrita por el ejecutor, contrastada con el texto del kit 1.1.0 y con los artefactos de la task en el árbol de trabajo. Donde no coinciden, se dice en el hallazgo.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El encargo del implementador no lleva los contratos entre tasks

- **Qué pasó**: el plan de 3 tasks se despachó en paralelo, una por subagente implementador. La task 2 exponía una interfaz de dominio que las tasks 1 y 3 consumían. El brief de la task 2 llevaba solo la descripción en prosa de lo que la interfaz debía resolver, no su firma. El implementador inventó la firma (con un parámetro de fecha que el plan no contemplaba). Lo detectó el hilo principal a las 11:20 comparando a mano los tres PR: la firma no encajaba con cómo las otras dos tasks la consumían. Hizo falta una ronda de fix para alinearla.
  Divergencia con el árbol de trabajo: la bitácora dice que la firma ya estaba fijada en el plan, pero el `plan.md` solo fija que la interfaz es la única puerta de acceso (en «Restricciones globales»), sin firma. No he podido resolver cuál de las dos versiones es cierta; la propuesta cubre ambas.
  Lo que la bitácora no registra: si los tests RED de la task 2 existían y estaban commiteados antes del despacho (paso 6), si el encargo llevó la cabecera de `encargo-revision.md`, y si el revisor de task de la task 2 recibió la firma.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6 y `skills/sdd-start-task/references/encargo-revision.md` §«Encargo del implementador» (la cabecera lleva dos bloques, «Restricciones globales» y «Tests RED»; el resto es el `task-brief` de superpowers, que según el propio paso 6 «extrae solo el texto de la task»). `skills/sdd-templates/templates/plan-template.md` §2 Tasks: no hay campo para las firmas que una task expone o consume; §1.4 solo cubre contratos de API.
- **Por qué el kit no lo evitó**: el kit ya midió que lo que no viaja en la cabecera del encargo se pierde (paso 6: las «Restricciones globales» llegaron a 1 de 5 encargos cuando se pegaban solo donde la plantilla tiene hueco) y cerró ese hueco para las restricciones y los tests RED. El mismo mecanismo se repite con otro contenido, las firmas, que ni la cabecera ni el plan-template nombran.
- **Coste**: una ronda de fix del implementador de la task 2 (dentro de sus 180k tokens; el desglose no se midió) y la revisión cruzada de los tres PR. Entre la detección (11:20) y la fusión (11:55) pasaron como mucho 35 min, incluida la revisión de las otras dos tasks. Las tasks 1 y 3, sin este hueco, pasaron a la primera.
- **Propuesta**: hipótesis en dos pasos, del más barato al más caro.
  1. Comprobar si el paso 6 ya lo cubre: si los tests RED de la task 2 llaman a la interfaz con la firma del plan y el implementador los recibe como contrato, no puede cambiar la firma sin romperlos. Si es así, basta con que el plan-template diga que los tests RED de una task que expone una interfaz la fijan con su firma.
  2. Si no basta, añadir un tercer bloque «Contratos» a la cabecera del implementador y de los revisores (firmas literales que la task expone o consume, copiadas del plan) y un campo por task en el plan-template para escribirlas.
- **Criterio de aceptación**: GIVEN un plan que fija la firma de una interfaz que la task A expone y las tasks B y C consumen, y un brief de A que solo la describe en prosa, WHEN el hilo principal construye el encargo de A siguiendo `encargo-revision.md`, THEN el encargo contiene la firma literal del plan y el implementador de A entrega la interfaz sin parámetros añadidos ni cambiados. RED que hoy falla: el encargo construido según la referencia no contiene la firma, y en esta sesión el implementador la inventó.

### 2. El cierre no dice dónde aterriza un aprendizaje estructural si el proyecto no tiene `architecture.md`

- **Qué pasó**: en el paso 4 de `sdd-end-task` había un aprendizaje estructural que las próximas tasks debían reutilizar (un patrón de diseño: resolver siempre a través de una interfaz, nunca contra el repositorio). El proyecto solo tenía `mission.md`, `constitution.md` y `tech-stack.md` (más roadmap, estimación y capacidades), sin `architecture.md`. El ejecutor descartó `constitution.md` por no ser una regla no negociable y `mission.md` y `tech-stack.md` por no ser ni el porqué ni una versión. Estuvo unos 20 min dudando entre crear un `architecture.md` solo para esa nota o forzarlo en otro sitio, y acabó en `tech-stack.md` (ver «Lo que hice por iniciativa propia»).
- **Dónde en el kit**: `skills/sdd-end-task/references/aprendizajes-skills.md` §Paso 4 (mapa: convención nueva → `constitution.md`, cambio estructural → `architecture.md`, versión o herramienta → `tech-stack.md`, comportamiento → `capabilities/`). Contexto: `skills/sdd-start-task/SKILL.md` paso 1 trata `architecture.md` como opcional («si existen») y `skills/sdd-init-greenfield/references/estructura.md` lo incluye en la estructura objetivo, que define `constitution.md` como «principios no negociables».
- **Por qué el kit no lo evitó**: el mapa solo cubre el caso «el destino existe». No dice qué hacer cuando falta (crearlo, preguntar, dejarlo en el walkthrough), y la última opción contradice la frase final del propio paso 4: un aprendizaje que se queda en el walkthrough se pierde. Además «convención nueva» y «cambio estructural» se solapan para un patrón de diseño, y la definición de `constitution.md` como «no negociable» empuja al ejecutor fuera de la primera.
- **Coste**: unos 20 min de reloj, y un aprendizaje en un documento cuyo propósito es otro.
- **Propuesta**: hipótesis. En `aprendizajes-skills.md` §Paso 4, fijar el caso destino ausente: si el aprendizaje es estructural y falta `architecture.md`, se crea con una sola sección y se anota en el walkthrough (es la estructura objetivo del kit, no un documento nuevo). Y aclarar el criterio entre `constitution.md` (regla que se exige) y `architecture.md` (patrón que se reutiliza).
- **Criterio de aceptación**: GIVEN un proyecto sin `architecture.md` y un aprendizaje estructural en el paso 4 de `sdd-end-task`, WHEN el ejecutor aplica `aprendizajes-skills.md`, THEN el aprendizaje queda en `architecture.md` (creado y anotado en el walkthrough) sin explorar destinos alternativos y sin escribirse en `tech-stack.md` ni `constitution.md`. RED que hoy falla: esta sesión eligió `tech-stack.md` tras unos 20 min de duda.

### 3. La validación de cierre se vivió como repetición del gate del plan

- **Qué pasó**: en el paso 0 de `sdd-end-task` el ejecutor preguntó al interlocutor del cliente si lo dado por bueno seguía en pie. Respondió «ya te lo he dicho» y aprobó, con la pregunta visiblemente de más. La bitácora atribuye la repetición al paso 7 de `sdd-start-task`, que sitúa «cuando cerramos el plan y antes de despachar».
  Divergencia con el kit: el paso 7 de `sdd-start-task` es la validación del trabajo terminado, después de la revisión final y antes de `sdd-end-task`; la pregunta previa al despacho es el gate del plan (paso 5). Entre el smoke (12:15) y el paso 0 (12:30) la bitácora no registra ninguna validación posterior a la implementación, y «ya te lo he dicho» más una aprobación no es validar según el kit: el usuario no dijo qué probó.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 7 y `skills/sdd-end-task/SKILL.md` paso 0; `skills/sdd-templates/templates/walkthrough-template.md` §4.2 («Validado por el dev-lead: <fecha> · <qué probó>»).
- **Por qué el kit no lo evitó**: probablemente es un error de ejecución, porque el texto ya define validar como «qué probó y que funciona». Queda como hallazgo por el coste visible con el cliente y porque el kit no fija dónde consta lo que el usuario probó en el paso 7 para que el paso 0 lo reconozca. Sin ese sitio fijo, el paso 0 no distingue «ya validó» de «nunca validó», y el ejecutor recurre a la pregunta del plan.
- **Coste**: una pregunta redundante y fricción con el interlocutor; sin coste de tiempo medible. El riesgo es que la validación se dé por hecha sin que el usuario haya dicho qué probó.
- **Propuesta**: hipótesis. Que el paso 7 anote la validación en un sitio fijo (por ejemplo, la línea «Validado por» del borrador del walkthrough) y que el paso 0 diga que, si ya consta, se cita y no se repite; solo se pregunta si no consta. Misma pregunta canónica en los dos pasos: «¿qué has probado tú y funciona?».
- **Criterio de aceptación**: GIVEN un usuario que tras la revisión final ya dijo qué probó y que funciona, WHEN se invoca `sdd-end-task`, THEN el paso 0 cita esa validación en el walkthrough sin volver a preguntar. GIVEN un usuario que solo aprobó el plan, WHEN llega el paso 0, THEN el ejecutor pregunta «qué has probado» y no «sigue en pie lo aprobado». RED que hoy falla: en esta sesión el paso 0 preguntó lo segundo y el usuario contestó que ya lo había dicho.

## Lo que hice por iniciativa propia

- **Tabla THEN → test en RED antes de despachar**: sin que ninguna skill lo pida, armé una tabla informal con cada THEN de la spec y el test que lo probaría en RED, antes de despachar los tres implementadores. Funcionó: al revisar los tres PR fue mecánico comprobar que cada test cubría su THEN. Lo más cercano en el kit es el paso 6 de `sdd-start-task` («un test por THEN») y el Self-review del plan-template (§4), que cruza requisito con task, no THEN con test. Candidato a regla: llevar ese cruce al Self-review a granularidad de THEN. Un solo caso, y no pude contrastarlo con la spec del árbol de trabajo, que lista los requisitos por título sin sus escenarios.
- **Destino improvisado del aprendizaje estructural**: sección «Patrones de dominio» al final de `tech-stack.md`, sin que ninguna skill lo respalde. Funcionó a medias: el paso 1 de `sdd-start-task` lee `tech-stack.md`, así que la próxima task lo encontrará, pero ese documento es de versiones y herramientas. No convertirlo en regla antes de resolver el hallazgo 2.

## Funcionó, no tocar

- **Gate de spec con el bloque «Decisiones que he tomado yo — valida estas»** (`sdd-start-task` paso 4, `spec-template.md`): obligó a que el cambio de criterio de un requisito ya existente quedara como decisión explícita y aprobada, no como detalle de implementación. Sin fricción.
- **Confirmación del intent antes de escribir la spec**: sin fricción. No la atribuyo al kit: la versión 1.1.0 no define un «gate de intent» (solo el de spec, paso 4, y el de plan, paso 5), así que lo más probable es que viniera de `superpowers:brainstorming`, que el paso 4 invoca.
- **Fusión del delta de la spec en la capacidad** (`aprendizajes-skills.md` §Paso 4, `capability-template.md`): según la bitácora, sin fricción; el ADDED se añadió, el MODIFIED sustituyó el texto por título estable y el Historial quedó anotado. En el árbol, la capacidad consta con las tres entradas y su Historial.
- **Tabla del `estimation-log`**: el formato ya consolidado no dio fricción. No consta si la fila la generó `Build-EstimationLog.ps1` (paso 3 de `sdd-end-task`, que pide no editarla a mano); el `walkthrough.md` de esta task no está en el árbol, así que no puedo confirmar el mecanismo.
- **Tasks con brief completo** (tasks 1 y 3): pasaron la revisión a la primera. Es el contraste con el hallazgo 1.

## Errores míos, no huecos del kit

- Fusioné las tres ramas de los implementadores y commiteé sin ejecutar el build del proyecto, dando por hecho que compilarían juntas porque compilaban por separado. Las tasks 2 y 3 tocaban el mismo `using` con un conflicto de nombres y la rama estuvo rota unos 15 min. El plan-template ya pide build por task (§2 Step 2) y build verde en la validación final (§3): no hay hueco del kit.
