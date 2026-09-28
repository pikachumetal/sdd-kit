---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260928-120657-feature-6298-layout-two-columns
task: 6298
mode: lite
date: 2026-09-28
---

# Ticket para el kit — feature 6298: un retoque de maquetación de dos plantillas costó ~2,5 h de reloj

## Contexto

- Carril y modo: feature lite (y, al principio de la misma sesión, migración del kit v1.1.0 → v2.0.0)
- Skills del kit usadas: `sdd-init-brownfield` (migración), `sdd-config`, `sdd-start-feature`,
  `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`
- Proyecto: monorepo Angular + .NET, una persona validando; perfil `pair` fijado en su
  `sdd-kit.local.json` sobre un proyecto en `delegate`
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (revisor final y re-revisión, `sdd-kit:effort-high`)
- Coste en reloj: ~2,5 h de reloj para la feature (1,8 h según el walkthrough, descontando desvíos del
  dev-lead). El dev-lead estima el trabajo en ≤ 30 min
- Coste en tokens: hilo 29,4 M · subagentes 2,5 M en 2 despachos

Frase literal del dev-lead al cerrar: «la cantidad de tiempo de desarrollo es absurda para la tarea
pedida: era colocar elemtnos HTML en 2 columnas y hemos estados HORAS, esto es inasumible hasta el punto
de que un front end habria tardado no mas de media hora en hacerlo y probarlo todo».

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. No hay carril proporcional para un cambio solo de presentación

- **Qué pasó**: la petición era mover los botones de una cabecera a una columna derecha en dos páginas
  gemelas: dos plantillas HTML, sin lógica, sin textos, sin API. El enrutado ofreció patch (solo para
  bugs), edición directa (solo typo, renombrado o formato) y feature. Lo más ligero que encajaba era
  feature lite, que arrastró spec con gate, enmienda con gate, tests RED antes del código, revisión final
  Opus, gate de cierre completo, walkthrough con smoke por THEN, changelog, roadmap y estimation-log.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 2 (enrutado) y
  `skills/sdd-start-feature/references/modo-lite.md`; en `skills/using-sdd`, la fila «Una edición sin
  comportamiento».
- **Por qué el kit no lo evitó**: modo lite abarata solo `plan.md` y `tasks.md` («el gate de la spec, el
  smoke y el `walkthrough.md` con tiempo real no se abaratan nunca»). No hay predicado para «cambia dónde
  se ve algo, no qué hace», y un cambio visual tampoco cabe en «edición sin comportamiento».
- **Coste**: ~40 min solo en artefactos y gates de proceso, sobre un trabajo de ~30 min.
- **Propuesta**: un carril «ajuste visual» con predicado observable: solo plantillas o estilos; sin
  TypeScript, textos, API ni datos; sin capacidades en el delta. Su recorrido: una frase de intención en
  la primera pregunta → cambio → captura en el navegador enseñada al usuario → commit con changelog de
  una línea. Sin spec, walkthrough ni revisión subagente.
- **Criterio de aceptación**: GIVEN una petición «pon estos botones a la derecha, en dos columnas» sobre
  plantillas existentes, sin lógica · WHEN el agente enruta · THEN propone el carril de ajuste visual
  citando su predicado, y el trabajo se cierra sin `spec.md` ni `walkthrough.md`, con una captura
  enseñada al usuario antes del commit.

### 2. Revisor Opus effort-high fijo y re-revisión obligatoria, sin escala por tamaño

- **Qué pasó**: la revisión final de un diff de dos plantillas se despachó a Opus effort-high (4 min,
  1,26 M tokens). Después, un commit que solo regeneraba 2 PNG de baselines abrió una re-revisión Opus
  obligatoria (8 min, 1,2 M tokens) que concluyó lo mismo que la evidencia del hilo.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md` §«Revisor final»
  («Se despacha con `sdd-kit:effort-high` + `model: opus` … es el techo del kit»);
  `skills/sdd-start-feature/SKILL.md` pasos 6-7 y `skills/sdd-end-feature/SKILL.md` paso 9 (solo eximen
  «solo docs y menos de 20 líneas»).
- **Por qué el kit no lo evitó**: el modelo del revisor no depende del tamaño ni del tipo del diff, y la
  exención de re-revisión solo cubre docs, no baselines binarias.
- **Coste**: ~12 min de reloj y ~2,5 M tokens de subagente; además, el usuario esperó.
- **Propuesta**: (a) escalar el revisor final por tamaño y tipo, p. ej. Sonnet medium para < 200
  líneas sin lógica y Opus solo por encima o con lógica/datos; (b) añadir a la exención del hilo los
  commits que solo regeneran baselines de test, con la evidencia del fallo en la base anotada.
- **Criterio de aceptación**: GIVEN un commit posterior a la revisión que solo cambia 2 ficheros
  `*-snapshots/*.png` y su evidencia (el mismo fallo en la rama de integración) · WHEN se llega al paso 7
  / al paso 9 del cierre · THEN se anota «revisado en el hilo» y no se despacha re-revisión.

### 3. Un rojo ajeno se investiga a fondo antes de mirar la deuda ya registrada

- **Qué pasó**: el gate de cierre dio 2 capturas rojas de una pantalla que la feature no tocaba. El
  agente las reprodujo solas, luego en la rama de integración (cambiando HEAD a detached) y después
  analizó los PNG píxel a píxel. El roadmap ya tenía una fila de deuda que describía exactamente ese
  fallo («entre dos y cinco capturas de tamaño `sm` fallan por antialiasing en cada ejecución»). Además,
  la explicación técnica confundió al usuario y hubo que repetirla en llano.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7 (validación con el gate completo) y la
  regla «Si falla un test que no es tuyo, antes de relanzarlo copia su nombre y su mensaje al informe;
  no le atribuyas causa sin evidencia» de `references/encargo-revision.md`; «Trabajo descubierto fuera
  de scope» manda a `systematic-debugging` (causa raíz primero).
- **Por qué el kit no lo evitó**: la instrucción empuja a demostrar la causa, pero no dice que se busque
  primero en la deuda del roadmap, que ya es la evidencia.
- **Coste**: ~25 min más una ronda de preguntas que el usuario no entendió.
- **Propuesta**: ante un rojo fuera de los ficheros de la feature, antes de investigar se busca el
  test o la pantalla en la tabla de deuda del roadmap. Si está, se cita la fila y se pregunta al usuario
  en una frase llana qué hacer. Si no está, se reproduce **una vez** en la rama de integración y se para.
- **Criterio de aceptación**: GIVEN un rojo de una captura que el diff de la feature no toca y una fila
  de deuda que describe ese fallo · WHEN el agente lo encuentra · THEN su siguiente mensaje cita la fila
  y ofrece las opciones, sin haber lanzado ninguna ejecución extra.

### 4. «Verificación visual» empuja a montar un arnés de medidas cuando hay un entorno levantado

- **Qué pasó**: para comprobar la maquetación, el agente escribió un spec de Playwright propio con los
  fixtures del gate, build dedicado y medidas de cajas (4 ejecuciones de ~1 min más su escritura). El
  entorno de desarrollo del usuario estaba levantado y el usuario presente, en `pair`.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6, párrafo «Verificación visual»
  («mide en estilos computados lo que el campo pide mirar y saca una captura por estado y tema»).
- **Por qué el kit no lo evitó**: la regla fija el método máximo (medidas, estados × temas) sin grado
  proporcional; en lite no hay campo «Verificación visual» que la acote.
- **Coste**: ~15-20 min.
- **Propuesta**: en lite, o con el entorno del usuario levantado y el usuario presente, basta una captura
  por estado relevante sobre ese entorno. Las medidas en estilos computados solo cuando la spec fija un
  valor numérico (contraste, alineación exacta).
- **Criterio de aceptación**: GIVEN una feature lite de maquetación, el usuario presente y el entorno
  levantado · WHEN el agente verifica · THEN usa capturas de ese entorno y no crea ficheros de test
  nuevos fuera del repo.

### 5. La migración deja un doc vivo citando una skill retirada

- **Qué pasó**: la migración a 2.0.0 sustituyó `sdd-start-task`/`sdd-end-task` en los docs vivos (paso
  8), pero la tabla de skills del README de SDD del proyecto sigue citando `sdd-start-release`, retirada
  en la misma versión. El paso 5 solo manda decirlo en el informe.
- **Dónde en el kit**: `skills/sdd-init-brownfield/references/migrations/v2.0.0.md` paso 5.
- **Por qué el kit no lo evitó**: el paso 5 es «sin predicado ni cambios en el proyecto».
- **Coste**: bajo, pero la referencia rota sobrevive a la migración y queda como pendiente manual.
- **Propuesta**: el paso 5 sustituye, en los mismos docs vivos que el paso 8, `sdd-start-release` por
  `sdd-roadmap`, y lo verifica igual.
- **Criterio de aceptación**: GIVEN un `.docs/sdd/README.md` que cita `sdd-start-release` · WHEN se
  aplica la migración 2.0.0 · THEN `Select-String` sobre los docs vivos no devuelve `sdd-start-release`.

### 6. El predicado de «Propósito» de la migración casa con un documento funcional heredado

- **Qué pasó**: `capabilities/` contenía un fichero heredado que se declara a sí mismo «no es una
  capacidad» (documento funcional anterior al troceo). El paso 7 lo seleccionó por no tener
  `## Propósito`, pero añadirlo no lo haría válido: `Test-Capabilities.ps1` lo rechaza entero. Además, el
  paso habría borrado la nota que explica la excepción. El agente lo saltó y lo dejó pendiente.
- **Dónde en el kit**: `skills/sdd-init-brownfield/references/migrations/v2.0.0.md` paso 7 y su
  «Verificación» (`Test-Capabilities.ps1`).
- **Por qué el kit no lo evitó**: el kit no contempla un documento funcional heredado dentro de
  `capabilities/` (la regla de no trocear `funcional.md` existe, pero no dice qué hacer si está ahí).
- **Coste**: bajo en reloj; queda un validador en rojo permanente que tapa fallos reales.
- **Propuesta**: que `Test-Capabilities.ps1` y el paso 7 excluyan un fichero marcado como legado (p. ej.
  front-matter o nombre reservado), y que la migración pregunte si detecta uno.
- **Criterio de aceptación**: GIVEN `capabilities/legacy.md` con el marcador de legado · WHEN corre
  `Test-Capabilities.ps1` · THEN no informa errores de ese fichero y sí de las capacidades reales.

## Lo que hice por iniciativa propia

- Reproduje el rojo ajeno sobre el commit base de la rama de integración (HEAD en detached y vuelta)
  para demostrar que no lo causaba la feature. Funcionó, pero es caro; con el hallazgo 3 bastaría una
  vez.
- Al aplicar Prettier, revertí los reformateos de código que no era de la feature y formateé solo el
  bloque nuevo, para que el diff no mezclara cambios. Funcionó.
- Tras la validación visual, propuse la enmienda con la evidencia medida (capturas a 800 px) en vez de
  describir el problema. El usuario lo aprobó mirando el entorno. Funcionó.

## Funcionó, no tocar

- La primera pregunta de `sdd-start-feature` con el predicado lite citado condición a condición y el
  perfil de origen: el usuario la contestó sin dudas.
- El flujo de desvío en `pair`: parar con la evidencia y registrar la enmienda con la frase literal.
- `Invoke-SddMerge.ps1`: merge `--no-ff` y push en una llamada, sin tocar el checkout.
- `Build-EstimationLog.ps1` y `Measure-SessionTokens.ps1`: cifras sin trabajo manual.
- `sdd-config` desde la migración: seis preguntas, una por turno, sin fricción.

## Errores míos, no huecos del kit

- Primera maquetación con un breakpoint de viewport sin tener en cuenta un sidenav fijo: causó la
  enmienda y ~20 min de rehacer.
- No leí la tabla de deuda del roadmap antes de investigar el rojo ajeno, aunque la había visto ese mismo
  día.
- Usé `git stash` en el hilo para integrar la rama de integración con cambios sin commitear; la regla
  del kit lo prohíbe al implementador y el motivo aplica igual al hilo.
- Expliqué el rojo ajeno con jerga (antialiasing, píxeles, bandas) a un usuario que no la pedía; tuve
  que repetirlo en llano.
- Dos commits fallidos por el directorio de trabajo y un heredoc roto: ruido de ejecución.
