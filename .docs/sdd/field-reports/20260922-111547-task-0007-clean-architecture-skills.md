---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 20260922-111547-task-0007-clean-architecture-skills
task: 0007
mode: full
date: 2026-09-22
---

# Ticket para el kit — task 0007: task full que triplicó su scope y cerró sin validación del dev-lead

## Contexto

- Carril y modo: task full (15 tasks de plan más 6 fixes descubiertos, ~60 commits)
- Skills del kit usadas: `sdd-start-task`, `sdd-end-task`, `sdd-templates` (plantillas,
  `Build-EstimationLog.ps1`), `add-to-changelog` (a mano); ejecución por defecto del kit con
  superpowers `subagent-driven-development`
- Proyecto: repo de plantillas de aplicación, fullstack con dos dialectos de BD, una persona
  (dev-lead) más agentes
- Modelo del hilo: Opus 5 (1M)
- Modelos de los subagentes: Sonnet (implementadores, sujetos RED/GREEN, revisiones por task);
  Opus (revisión final)
- Coste en reloj: ~10 h en dos jornadas (plan: 30 h de esfuerzo en serie)
- Coste en tokens: no medido. El límite semanal de Sonnet cortó sujetos a mitad y hubo que
  repetirlos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Ningún gate del kit propone partir una task cuyo scope crece

- **Qué pasó**: la task entró con un objetivo acotado. En el brainstorming creció a dos fases (una
  realineación de arquitectura y el objetivo original), y en la ejecución sumó seis fixes
  descubiertos. Al cierre, el dev-lead: «se ha ido tanto de madre que no puedo validar tantas
  cosas… cerramos porque no puedo tardar más».
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` (aprobación de la spec) y la tabla «Fixes
  adicionales» de la plantilla de `tasks.md` en `sdd-templates`.
- **Por qué el kit no lo evitó**: la spec admite fases y alcance sin umbral, y «Fixes adicionales»
  registra el trabajo descubierto sin disparar ningún checkpoint.
- **Coste**: validación del dev-lead perdida (diferida a otra task), horas por encima de lo
  anunciado y pérdida de confianza en el kit, justo lo que el dev-lead necesita demostrar al
  venderlo.
- **Propuesta**: si la spec tiene más de una fase o la estimación pasa de un umbral,
  `sdd-start-task` propone partir en tasks con su propio cierre y validación antes de pedir la
  firma. En la ejecución, el tercer fix descubierto abre un checkpoint obligatorio: seguir, diferir
  a otra task o partir.
- **Criterio de aceptación**: GIVEN una spec con dos fases y 30 h estimadas, WHEN `sdd-start-task`
  llega a la aprobación, THEN pregunta si partir antes de pedir la firma. GIVEN `tasks.md` con tres
  filas en «Fixes adicionales», WHEN se va a abrir un cuarto, THEN el hilo para y pregunta.

### 2. Las decisiones de ejecución que cambian la salida del producto no se escalan

- **Qué pasó**: durante la ejecución, el hilo registró en el ledger como «Ruling» un atajo que
  cambiaba lo que el producto entrega al usuario final. El dev-lead lo descubrió en la presentación
  del smoke y exigió deshacerlo; el arreglo llegó después de la revisión final.
- **Dónde en el kit**: el bloque «Decisiones que he tomado yo» de `sdd-start-task` solo cubre la
  spec. En la ejecución por defecto del kit, las rulings viven en el ledger sin clasificar.
- **Por qué el kit no lo evitó**: no distingue una ruling interna (cómo se implementa) de una que
  cambia la salida observable (API, UI, ficheros generados, nombres).
- **Coste**: un arreglo en pleno cierre, con el dev-lead agotado y sin revisión de subagente.
- **Propuesta**: regla del kit para la ejecución: una decisión que cambia la salida observable se
  pregunta en el momento, no se toma. Las rulings internas siguen en el ledger y se listan al
  presentar el smoke.
- **Criterio de aceptación**: GIVEN un fix que altera lo que el producto genera o muestra, WHEN el
  hilo va a registrarlo como «Ruling», THEN pregunta al dev-lead con las opciones antes de
  despachar.

### 3. La verificación por task no se deriva de lo que la task toca

- **Qué pasó**: el gate de cierre completo, incluida la suite de BD más lenta (~5 min), se copió en
  las restricciones globales del plan y corrió en fixes que no tocaban BD. El dev-lead: «estás
  lanzando el test de sql server cada 2x3, estoy un poquito harto… si no has tocado db no lo
  lances».
- **Dónde en el kit**: plantilla de `plan.md` de `sdd-templates` (restricciones globales y
  verificación por task). Es el segundo reporte, tras el §4 del ticket de la task 0006a.
- **Por qué el kit no lo evitó**: la plantilla no pide declarar qué superficies toca cada task.
- **Coste**: decenas de minutos de reloj, máquina cargada (una medición de rendimiento salió
  invalidada) y un enfado explícito.
- **Propuesta**: cada task del plan declara las superficies que toca (BD, backend, frontend,
  tooling, docs) y su verificación sale de ahí. La suite de BD solo corre si toca migraciones,
  persistencia o código de dialecto.
- **Criterio de aceptación**: GIVEN una task de plan que solo toca docs y frontend, WHEN se genera
  su verificación, THEN no incluye ninguna suite de BD.

### 4. `sdd-end-task` no tiene salida para una validación que el dev-lead difiere a propósito

- **Qué pasó**: el paso 0 exige que el usuario diga qué probó. El dev-lead pidió cerrar y validar
  en el smoke final de otra task. El hilo tuvo que improvisar el formato en el walkthrough y en el
  roadmap.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 0 y `walkthrough-template.md` §4.2.
- **Por qué el kit no lo evitó**: solo modela «validado» o «en espera»; falta «diferido
  explícitamente, con destino».
- **Coste**: bajo en reloj; sin un formato fijo, la validación diferida puede perderse.
- **Propuesta**: tercer estado «validación diferida por el dev-lead a <task/release>», que exige
  una fila de deuda en el roadmap para que la task destino la recoja.
- **Criterio de aceptación**: GIVEN el dev-lead dice «cierra, valido en la task X», WHEN corre
  `sdd-end-task`, THEN el walkthrough lleva «Validación diferida → X» y el roadmap una fila de
  deuda que la cita, sin inventar un «Validado».

### 5. El paso 9 de `sdd-end-task` no cubre el código posterior a la revisión final

- **Qué pasó**: el arreglo del hallazgo 2 entró en línea durante el cierre, después de la revisión
  final y su re-revisión, con lógica no trivial.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 9, que solo pide code-review si la task
  se ejecutó en línea entera.
- **Por qué el kit no lo evitó**: el paso asume que la revisión final cubre todo el código de la
  rama.
- **Coste**: riesgo; se mitigó con verificación manual amplia.
- **Propuesta**: si hay commits de código posteriores al SHA de la revisión final, el paso 9 pide
  una revisión acotada de esos commits.
- **Criterio de aceptación**: GIVEN commits de código después del SHA revisado, WHEN corre el paso
  9, THEN lista esos commits y lanza la revisión acotada antes del merge.

### 6. No hay sitio en los docs de anclaje para el proyecto de referencia

- **Qué pasó**: el proyecto replica los patrones de otro proyecto (espejo). El dato solo vivía en
  la conversación. El hilo propuso seguir una versión simplificada propia y el dev-lead lo corrigió
  con dureza («te tengo que tirar de las orejas…»), lo que obligó a auditar y realinear.
- **Dónde en el kit**: plantillas de `constitution.md`/`architecture.md` que generan `sdd-init-*`;
  no tienen ese campo. Se resolvió añadiendo un artículo a la constitution del proyecto.
- **Por qué el kit no lo evitó**: `sdd-start-task` lee los docs de anclaje y el dato no estaba en
  ninguno.
- **Coste**: la fase más cara de la task nació de este malentendido.
- **Propuesta**: campo opcional «Proyecto de referencia» en la constitution, que `sdd-start-task`
  cita en el brainstorming cuando la task porta o replica patrones.
- **Criterio de aceptación**: GIVEN una constitution con «Proyecto de referencia: X», WHEN una task
  porta patrones, THEN el brainstorming compara contra X y lo dice antes de proponer.

### 7. Las reglas de capacidad del delta no dicen si sustituyen o añaden

- **Qué pasó**: el delta traía una regla con el mismo nombre que la vigente pero más corta.
  Sustituirla por nombre, como dice el paso 4, habría borrado texto válido; el hilo la fusionó a
  mano.
- **Dónde en el kit**: `skills/sdd-end-task/references/aprendizajes-skills.md` paso 4 y la sección
  de delta de la plantilla de spec.
- **Por qué el kit no lo evitó**: la regla de fusión solo contempla sustituir.
- **Coste**: bajo; riesgo de pérdida silenciosa en una capacidad.
- **Propuesta**: la plantilla de spec escribe las reglas del delta como texto completo de reemplazo,
  o las marca ADDED/MODIFIED como los requisitos.
- **Criterio de aceptación**: GIVEN una regla del delta más corta que la vigente, WHEN se fusiona,
  THEN el resultado lo decide la marca, no el juicio del agente.

### 8. El paso 10 no comprueba el checkout que tiene la rama base

- **Qué pasó**: con worktrees, el checkout de la rama de integración tenía cambios sin commitear de
  otra sesión sobre un fichero que la rama también toca. El merge quedó bloqueado después de
  ofrecer el menú.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 10.
- **Por qué el kit no lo evitó**: no hay pre-check del checkout base antes de delegar en
  `finishing-a-development-branch`.
- **Coste**: bajo; una ronda más con el dev-lead.
- **Propuesta**: antes de ofrecer el merge, `git status` del checkout base; si está sucio sobre
  ficheros de la rama, avisarlo en el menú e integrar la base en la rama desde el worktree.
- **Criterio de aceptación**: GIVEN el checkout base con cambios sin commitear en un fichero que la
  rama modifica, WHEN se presentan las opciones, THEN el menú lo avisa antes de elegir.

### 9. `sdd-feedback` no está en el plugin publicado

- **Qué pasó**: el dev-lead invocó `/sdd-feedback` al cerrar; la skill no existe en la 1.1.0
  instalada y el hilo tuvo que buscarla en un worktree de desarrollo del kit.
- **Dónde en el kit**: roadmap del kit, task 0002 de la release siguiente.
- **Por qué el kit no lo evitó**: está en desarrollo, no publicada.
- **Coste**: bajo; riesgo de usar una versión a medias.
- **Propuesta**: publicarla, u ofrecerla en `sdd-end-task` solo cuando esté instalada.
- **Criterio de aceptación**: GIVEN el kit instalado desde el canal plugin, WHEN el usuario invoca
  `/sdd-feedback`, THEN la skill carga.

## Lo que hice por iniciativa propia

- **Verificar el artefacto que el proyecto produce usándolo**, no solo con sus tests unitarios: dos
  fallos que la suite no veía salieron así. Candidato a regla del kit en `sdd-end-task`: la
  verificación de cierre ejercita la salida real del cambio.
- **Integrar la base en la rama desde el worktree**, en vez de mergear en un checkout ajeno y sucio.
  Funcionó; no pisa el trabajo de otra sesión.
- **Convertir en regla escrita del proyecto una queja del dev-lead** (cuándo corre la suite cara),
  en el momento en que la hizo, en vez de dejarla en la conversación. Candidato: el kit podría
  pedir que toda corrección de proceso del dev-lead acabe en un doc vivo en la misma sesión.

## Funcionó, no tocar

- Bloque «Decisiones que he tomado yo» en la spec, y el reparto «la spec es el contrato con el
  dev-lead, el plan el contrato con los subagentes» (palabras del dev-lead).
- Gate de validación de `sdd-end-task`: obligó a presentar el smoke y a no inventar un «Validado».
- Ejecución por defecto con revisión final, una sola fix wave y re-revisión acotada: 9/9 hallazgos
  resueltos sin rondas extra.
- `Build-EstimationLog.ps1` y la fusión de deltas por título estable.

## Errores míos, no huecos del kit

- Ignorar un dato que el dev-lead ya había dado (el proyecto de referencia).
- Tomar un atajo en vez de arreglar la causa, y registrarlo como ruling.
- Anunciar «estamos acabando» con horas de trabajo por delante.
- Relanzar la suite cara varias veces antes de que el dev-lead lo prohibiera.
