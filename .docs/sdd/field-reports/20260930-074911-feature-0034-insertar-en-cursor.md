---
kit_version: 2.0.0 (sdd-kit.json del proyecto); plugin 2.1.0 al abrir la sesión y 2.2.0 al cerrarla
superpowers_version: 6.4.2
lane: feature
id: 20260930-074911-feature-0034-insertar-en-cursor
task: 0034
mode: full
date: 2026-09-30
---

# Ticket para el kit — feature 0034: feature full de cinco tasks subagent-driven, con revisión final «With fixes»

## Contexto

- Carril y modo: feature full, perfil `delegate`, `execution: auto` (salió subagent-driven)
- Skills del kit usadas: `sdd-start-feature`, `sdd-templates` (spec, plan, tasks, walkthrough, scripts),
  `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans` y
  `subagent-driven-development`
- Proyecto: gestor documental interno con un editor de oficina embebido por plugins; backend .NET, frontend
  React, E2E con Playwright contra el editor real; una persona como dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (implementadores, revisores de task y de spec), Opus 5.5 (task de
  medida y revisión final)
- Coste en reloj: ~3,7 h de hilo (spec y plan 0,7 h; implementación, smoke y validación 3,0 h)
- Coste en tokens: hilo 131.270.560; subagentes 52.095.310 en 18 despachos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El vigía de silencio no vigila las rondas de fix de un agente retomado

- **Qué pasó**: las rondas de fix se hacen retomando al mismo implementador (`SendMessage`), que conserva la
  `description` del despacho original. El vigía lanzado para la ronda, con esa `description`, encontró el
  transcript ya terminado de la primera vuelta y devolvió `TERMINADO:` al instante, con el agente todavía
  trabajando. Pasó en las rondas de fix de dos tasks: durante esas rondas no hubo vigilancia real, y el hilo
  tuvo que comprobar a mano que no había commit nuevo para no dar por acabada una ronda en curso.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1` y
  `skills/sdd-start-feature/references/control-profiles.md` («Vigía de silencio», «Cada despacho lleva una
  `description` distinta»).
- **Por qué el kit no lo evitó**: la regla de `description` distinta vale para despachos nuevos; una ronda
  retomada no puede cambiarla, y el vigía no distingue actividad anterior a su arranque.
- **Coste**: dos rondas sin vigía y una duda del hilo sobre si el agente había terminado.
- **Propuesta**: que el vigía solo cuente la actividad del transcript posterior a su propio arranque (o
  acepte `-Since <marca>`), y que `control-profiles.md` diga que la ronda retomada se vigila así.
- **Criterio de aceptación**: GIVEN un subagente que terminó y se retoma con `SendMessage` WHEN se lanza el
  vigía con la misma `description` THEN no devuelve `TERMINADO:` hasta que el transcript registra un final
  posterior a su arranque, y devuelve `SILENCIO:` si no hay actividad nueva en el umbral.

### 2. Los RED que escribe el hilo llegan rotos al implementador sin haberse ejecutado

- **Qué pasó**: en una task de frontend, dos sustituciones del hilo sobre el test no se aplicaron (finales
  de línea distintos) y otro test tenía dos errores de tipos. El hilo no ejecutó el RED ni el
  control de tipos del proyecto antes de despachar. El implementador paró antes del commit, como pide el contrato, y
  hubo una vuelta más: corregir, volver a copiar los RED fuera del repo y retomar.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6, «el hilo principal escribe los tests que
  codifican los escenarios de la task… en RED por compilación o por fallo».
- **Por qué el kit no lo evitó**: pide que estén en RED, pero no que el hilo lo compruebe ejecutándolos, ni
  que el RED falle por la razón esperada (falta el código) y no por un defecto del propio test.
- **Coste**: una vuelta completa del implementador (~2 min de reloj) y una corrección del contrato después
  del despacho.
- **Propuesta**: antes de guardar la copia y despachar, el hilo ejecuta los RED (y el control de tipos
  del proyecto si lo hay) y anota en el ledger por qué falla cada uno; un fallo que no sea «falta el código
  de la task» se corrige antes de despachar.
- **Criterio de aceptación**: GIVEN un RED cuyo stub no devuelve el dato que el test busca WHEN el hilo
  sigue el paso 6 THEN el ledger registra que ese test falla por el stub y no por la ausencia del código, y
  el test se corrige antes del despacho.

### 3. Un E2E de contrato sobre un editor externo no se puede dejar bien antes de implementar

- **Qué pasó**: el E2E del flujo en el editor, escrito por el hilo como contrato, falló 5 de 5 con el
  código ya correcto: el editor manda sus cambios al servidor cada ~2 s y el test salía antes, y el foco no
  volvía al documento tras un diálogo. El implementador, por contrato, no pudo tocar las esperas. Lo midió
  con una copia desechable y lo reportó; el hilo corrigió su propio test.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Tests RED»: «no los
  modifiques: no cambies una aserción, un nombre de test ni un dato»; solo exceptúa el formato.
- **Por qué el kit no lo evitó**: la excepción cubre el formato, no las esperas ni la sincronización de un
  test contra un sistema real, que no se pueden fijar sin el código delante.
- **Coste**: una vuelta del hilo y una ejecución más del E2E (~2 min de suite y la revisión del arreglo).
- **Propuesta**: en un E2E de contrato, permitir al implementador ajustar esperas, sincronización y foco
  sin cambiar aserciones ni datos, con la obligación de listar cada ajuste en su informe para que el revisor
  de la task los mire.
- **Criterio de aceptación**: GIVEN un E2E de contrato que falla solo por una espera corta WHEN el
  implementador la alarga y lo lista en su informe THEN el hilo no lo cuenta como cambio del contrato al
  comparar la copia, y el revisor de la task lo recibe marcado.

### 4. `Get-NextSddId.ps1 -Reserve` devuelve el id de la rama actual al reservar el de la feature partida

- **Qué pasó**: la feature se partió en la primera pregunta. Estando en `feature/<id>` sin carpeta de spec
  todavía, `-Reserve` devolvió el propio `<id>` de la rama, no el siguiente. Hubo que crear la carpeta de la
  spec antes y volver a reservar para obtener el id de la mitad nueva.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Get-NextSddId.ps1` (devuelve `CurrentBranchId` si
  nadie lo usa) y `skills/sdd-start-feature/references/nombrado.md` («Una feature partida toma un id
  reservado con `Get-NextSddId.ps1 -Reserve`»).
- **Por qué el kit no lo evitó**: la regla del script tiene sentido para la feature de la rama, pero
  `nombrado.md` no dice que la mitad partida se reserva después de crear la carpeta de la actual.
- **Coste**: bajo; una llamada de más y una duda sobre si el id estaba ya consumido.
- **Propuesta**: un parámetro `-ExcludeCurrentBranch` (o que `nombrado.md` diga el orden: carpeta de la
  feature actual primero, reserva de la partida después).
- **Criterio de aceptación**: GIVEN la rama `feature/0034-x` sin carpeta de spec WHEN se reserva el id de la
  mitad partida THEN sale el `0035`.

### 5. En `delegate` sin gate de plan, la regla del usuario de confirmar subagentes queda sin sitio

- **Qué pasó**: el perfil no para en el plan, pero las instrucciones del usuario exigen justificar el modelo
  de cada tarea y pedir confirmación antes de lanzar subagentes. El hilo añadió una pregunta de método que
  el kit no prevé en ese perfil.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 5 («En `delegate` y `unattended` no hay
  gate») y `references/control-profiles.md`.
- **Por qué el kit no lo evitó**: `review-spec.md` ya trata el caso parecido para la review de la spec,
  pero el paso 5 no dice qué hacer cuando `execution` sale subagent-driven y el usuario pide confirmar.
- **Coste**: bajo; una pregunta, pero improvisada.
- **Propuesta**: en el paso 5, si las instrucciones del usuario exigen confirmar subagentes, la pregunta
  del método va aunque el perfil no tenga gate de plan, con los modelos por task; en `unattended`, se
  registra.
- **Criterio de aceptación**: GIVEN perfil `delegate`, plan subagent-driven e instrucciones que exigen
  confirmar subagentes WHEN termina el plan THEN hay una única pregunta con el método y los modelos, y sin
  respuesta no se despacha.

### 6. La línea de tokens de subagentes rompe el lint de longitud del walkthrough

- **Qué pasó**: con 18 despachos, la línea `Tokens de subagentes` que imprime `Measure-SessionTokens.ps1`
  tiene 1.303 caracteres; el lint del proyecto (MD013, 200) falló y hubo que añadir
  `<!-- markdownlint-disable-next-line MD013 -->` para no tocar las cifras que lee el log.
- **Dónde en el kit**: `skills/sdd-templates/walkthrough-template.md` (línea de tokens de subagentes) y
  `scripts/Measure-SessionTokens.ps1`.
- **Por qué el kit no lo evitó**: la plantilla manda pegar la línea tal cual, y el log necesita la cifra
  total en esa línea.
- **Coste**: bajo; una vuelta de lint.
- **Propuesta**: que la plantilla lleve ya la directiva de markdownlint delante de esa línea, o que el
  script imprima el desglose en una lista anidada y deje en la línea solo el total.
- **Criterio de aceptación**: GIVEN un proyecto con MD013 a 200 y una feature con 18 despachos WHEN se
  pega la salida del script según la plantilla THEN el lint pasa y `Build-EstimationLog.ps1` lee el total.

## Lo que hice por iniciativa propia

- **Fusionar el delta con un script.** Para 12 ADDED, 6 MODIFIED y dos bloques de reglas, un script que
  lee el delta de la spec y sustituye por título en `capabilities/` (falla si un MODIFIED no tiene vigente).
  Funcionó a la primera y `Test-Capabilities.ps1` lo dio por válido; solo arrastró una línea de
  verificación que citaba decisiones de la spec. Candidato: un `Merge-CapabilityDelta.ps1` en
  `sdd-templates/scripts/` que además avise de referencias a la spec en lo fusionado.
- **Verificación visual como fuente de hallazgos, no solo de capturas.** Mirando el diálogo en el navegador
  salió un hueco que ni los tests ni el revisor de la task vieron (el valor elegido era ambiguo con dos
  entradas de igual nombre, contra el diseño que aprobó el dev-lead). Entró como ronda de fix con su RED.
- **Subir un Minor de accesibilidad a Important** por ruling (una etiqueta que no nombraba un control).
- **Smoke con el paquete real de ficheros del cliente**, automatizando su importación con Playwright, para
  cubrir la recomendación de la revisión final (un cierre sin cambios no debe borrar vínculos legítimos en
  un documento real). Confirmó el caso de riesgo sin incidencias.
- **Separar el commit del scaffold** del squash de su task, porque la constitution del proyecto lo exige.

## Funcionó, no tocar

- La primera pregunta con el recuento de tasks propuso partir (7 tasks, varias superficies) y el dev-lead
  aceptó; la mitad partida quedó con fila propia.
- La review de spec con dos lentes: 20 hallazgos, uno Crítico (una regla de la capacidad que habría
  desaparecido al fusionar); tres decisiones con efecto visible salieron de ahí y se preguntaron aparte.
- «Reproducir antes de arreglar»: los dos hallazgos de ejecución de la revisión final se vieron en RED antes
  del arreglo.
- La revisión final en el modelo más capaz encontró tres fallos que los revisores de task no vieron (un
  reintento que nunca funcionaba, un cancelar que no cancelaba y un E2E cuyo oráculo no probaba lo que
  decía).
- La re-revisión del tramo posterior a la revisión, también para un commit de test de tres líneas.

## Errores míos, no huecos del kit

- Varias sustituciones de texto de PowerShell sobre bloques de varias líneas fallaron en silencio por los finales
  de línea; tendría que haber comprobado cada sustitución.
- Escribí en el walkthrough que un aprendizaje estaba en un doc vivo antes de escribirlo allí; lo corregí antes
  del commit.
- La condición de espera de un smoke usó una fecha que el cierre sin cambios no mueve.
