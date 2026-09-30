---
kit_version: 2.2.0
superpowers_version: 6.4.2
lane: feature
id: 20260930-114135-feature-0035-pegar-vinculo
task: 0035
mode: full
date: 2026-09-30
---

<!-- cspell:ignore ofimático explicamelo desregistró -->

# Ticket para el kit — feature 0035: copiar un rango en un editor y pegarlo como vínculo en otro

## Contexto

- Carril y modo: feature full, perfil delegate, ejecución subagent-driven
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates` (spec, plan, tasks, walkthrough,
  scripts), `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`,
  `subagent-driven-development`
- Proyecto: aplicación web con backend .NET, SPA React y un editor ofimático embebido con plugins propios;
  una persona (el dev-lead) más el agente
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (implementadores y revisores), Opus 5.5 (revisor final)
- Coste en reloj: ~2,3 h de implementación y ~40 min de spec y plan
- Coste en tokens: hilo 85,3 M; subagentes 25,7 M en 15 despachos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una decisión de producto preguntada sin escena concreta se contesta mal o no se contesta

- **Qué pasó**: dos veces el dev-lead no pudo decidir con la pregunta tal cual.
  - Antes de la spec: un lote de cuatro preguntas de producto con opciones técnicas («el plugin no ve el
    portapapeles», «evento sin medir»). El dev-lead lo rechazó para aclarar; su respuesta cambió el alcance
    entero (quería el flujo transparente y proponía ir por pasos).
  - En la validación: una decisión de la revisión final («copiar en los ~2 s siguientes a teclear publica sin
    la última edición»). Eligió una opción, interrumpió al momento («no espera explicamelo mejor») y, con un
    ejemplo paso a paso con cifras y lo que se ve en cada paso, eligió la contraria (la recomendada).
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, paso 7 («Si la revisión final deja una decisión que
  es del usuario… pregúntala sola, en su propio turno»), y la pregunta de decisiones de producto previa a la
  spec (paso 4, vía `brainstorming`).
- **Por qué el kit no lo evitó**: el kit exige que la pregunta vaya sola, pero no fija su forma. La regla de
  «enseñar lo que el usuario va a ver» vivía solo en la constitution de este proyecto, y el hilo no la aplicó
  a una decisión nacida en la revisión final.
- **Coste**: dos turnos extra del dev-lead y una respuesta casi registrada en contra de lo que quería. Si no
  hubiera interrumpido, el cierre habría aceptado como límite un fallo del THEN principal.
- **Propuesta**: en el paso 7, y en las preguntas de producto previas a la spec, la pregunta lleva antes de
  las opciones una escena numerada con datos concretos: qué hace el usuario y qué ve en cada paso, hoy y con
  cada opción. Las causas técnicas van, si acaso, en una línea aparte.
- **Criterio de aceptación**: GIVEN una revisión final que deja «un gesto rápido publica un dato viejo» como
  decisión del usuario, WHEN el hilo la pregunta, THEN el mensaje contiene una lista numerada con acción y
  resultado visible por paso, con valores concretos, antes de las opciones; y 2 de 2 sujetos la escriben así
  (hoy 0 de 1 en esta sesión).

### 2. Un RED de E2E escrito por el hilo sin ejecutarlo trae defectos del propio test

- **Qué pasó**: el hilo escribió el E2E del flujo completo antes de despachar, como pide el kit, sin
  ejecutarlo contra el entorno. Tenía dos defectos que solo aparecieron al implementar:
  - copiaba antes de que el editor mandara sus cambios (~2 s);
  - podía leer el estado global que dejaba una ejecución anterior.

  El implementador devolvió `DONE_WITH_CONCERNS` y hubo que abrir una ronda solo para arreglar el test (un
  ruling del hilo sobre sus propios RED).
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, paso 6 («el hilo principal escribe los tests que
  codifican los escenarios de la task… en RED por compilación o por fallo»).
- **Por qué el kit no lo evitó**: «en RED por compilación o por fallo» se da por bueno con que el test no pase.
  No pide comprobar que falla por la ausencia de la feature y no por el propio test, y en un E2E es donde más
  difieren.
- **Coste**: una ronda extra del implementador de la task más larga (~5 min y ~0,5 M tokens) y un ruling.
- **Propuesta**: un RED de E2E (o de integración contra un entorno) se ejecuta una vez antes de despachar, y
  su salida debe fallar en el primer paso que depende de la feature. Si falla antes, o por tiempo, el test se
  corrige antes del despacho.
- **Criterio de aceptación**: GIVEN una task cuyo RED es un E2E contra el entorno del worktree, WHEN el hilo
  lo escribe, THEN el ledger apunta su ejecución y la línea en que falla, que es la primera interacción con la
  feature nueva; y ningún implementador devuelve un defecto del test como concern.

### 3. La fusión del delta en `capabilities/` es manual y el validador no la acompaña

- **Qué pasó**: fusionar el delta (7 ADDED y 5 reglas en una capacidad, 1 ADDED y 3 reglas en otra) llevó
  varias vueltas:
  - un script improvisado para sustituir cada regla entera;
  - dos rondas de lint por líneas en blanco dobles;
  - al limpiar en la capacidad una referencia a «la decisión 10» de la spec, `Test-Capabilities.ps1` la
    rechazó porque el THEN ya no coincidía con el delta, y hubo que devolver el texto con la referencia
    colgando.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 7 («el delta fusionado en `capabilities/`») y
  `skills/sdd-end-feature/SKILL.md` paso 4; `sdd-templates/scripts/Test-Capabilities.ps1`.
- **Por qué el kit no lo evitó**: no hay script de fusión. La plantilla del delta tampoco avisa de que un THEN
  que cita decisiones de la spec («por la decisión 10») acabará literal en la verdad viva.
- **Coste**: ~10 min del hilo en el camino crítico del cierre y una capacidad con una referencia a la spec.
- **Propuesta**:
  - un `Merge-CapabilityDelta.ps1` que convierta cada `ADDED — título` en `### título` antes de «Reglas de la
    capacidad», sustituya cada regla por nombre y normalice las líneas en blanco;
  - en `spec-template.md`, que un THEN no cite decisiones de la spec por número.
- **Criterio de aceptación**: GIVEN una spec con N ADDED y M reglas en una capacidad, WHEN se ejecuta el
  script, THEN `Test-Capabilities.ps1` y el lint de markdown pasan sin editar a mano, y la capacidad no
  contiene «decisión» seguida de un número.

### 4. El gate de E2E del proyecto no sabe los puertos del worktree

- **Qué pasó**: `moon run frontend:e2e` en el worktree falló en 8 s con `ECONNREFUSED ::1:5080`: el
  runner apuntaba a los puertos por defecto y no a los del marcador `.sdd-env.json`. Se resolvió pasando a
  mano las dos variables de entorno.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 (*si existe `environments.md`*: `env:setup`
  y el marcador) y paso 7 (gate de cierre); `sdd-templates/templates/environments-template.md`.
- **Por qué el kit no lo evitó**: el kit nombra el marcador para los implementadores, pero no dice que el gate
  de cierre del hilo lo necesita también, ni pide que `environments.md` declare cómo lo leen los comandos del
  gate.
- **Coste**: bajo (una ejecución fallida), pero un sujeto menos atento podría haber dado el E2E por «roto en
  el entorno» y dejarlo `no probado`.
- **Propuesta**: `environments-template.md` gana un campo «Comandos que leen el marcador» (cuáles lo leen
  solos y cuáles necesitan variables), y el paso 7 lo cita al ejecutar el gate.
- **Criterio de aceptación**: GIVEN un worktree con puertos propios, WHEN el hilo ejecuta el gate de cierre con
  E2E, THEN la primera ejecución apunta a los puertos del marcador.

### 5. `git worktree remove` del revisor final falla en Windows y deja la carpeta

- **Qué pasó**: al retirar el worktree desanclado del revisor final, `git worktree remove` dio
  `Permission denied`. Lo desregistró pero dejó el directorio, que hubo que borrar aparte.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md` («Revisor final», «el hilo lo
  retira con `git worktree remove`»).
- **Por qué el kit no lo evitó**: la receta no prevé el fallo parcial en Windows.
- **Coste**: bajo; un minuto y una comprobación.
- **Propuesta**: añadir a la receta que, si `git worktree remove` falla, se compruebe con `git worktree list`
  y se borre el directorio que queda, solo si ya no está registrado.
- **Criterio de aceptación**: GIVEN un `git worktree remove` que devuelve `Permission denied`, WHEN el hilo
  sigue la receta, THEN al acabar ni `git worktree list` ni el disco tienen `review-<id>-<sha>`.

## Lo que hice por iniciativa propia

- **Responder una petición de posición en la interfaz con el código del editor delante.** Antes de proponer
  opciones, leí el código de la interfaz de plugins del editor dentro del contenedor, que coloca las entradas
  siempre al final. Con eso la respuesta fue «no se puede con la API pública; esto sí» en vez de una
  suposición. Funcionó: el dev-lead eligió en una pregunta.
- **Llevar la verificación visual a un estado que el detector no alcanza.** El diálogo solo se abre con un
  mensaje entre ventanas; simulé ese mensaje con Playwright para capturar el estado. El detector declarado,
  que solo abre la URL, cubrió la página y lo dije. Funcionó.
- **Diagnosticar un fallo intermitente del E2E con `--repeat-each` antes de darlo por inestable.** Mostró que
  era el estado global compartido entre ejecuciones en paralelo, por diseño, y no un defecto. Funcionó:
  quedó como residual con su causa.
- **Tests RED de backend y frontend escritos en el scratchpad mientras la task anterior corría**, y copiados
  al repo justo antes de despachar, para que el commit de la task en curso no los arrastrara. Funcionó.
- **Script de fusión del delta** (hallazgo 3). Funcionó a medias: faltó normalizar las líneas en blanco.

## Funcionó, no tocar

- «Reproducir antes de arreglar»: una carrera real (el guardado llegaba antes de apuntar la copia) salió en RED
  y se arregló. Otro hallazgo de ejecución que no se reprodujo no se tocó y quedó como ruling. Evitó un
  cambio a ciegas.
- La comprobación de la base antes de cada despacho: `develop` avanzó dos veces durante la feature y el cruce
  de ficheros dejó seguir sin dudas.
- Las re-revisiones acotadas por tramo, también tras la validación: el cambio pedido al validar tuvo su
  revisión antes del merge.
- El revisor final en un worktree desanclado, en segundo plano, mientras el hilo hacía la verificación visual
  y los borradores de cierre.
- `Measure-SessionTokens.ps1`, `Build-EstimationLog.ps1` e `Invoke-SddMerge.ps1` con `-VerifyCommand` sobre el
  resultado del merge.
- La opción «apruebo la spec por delegación» en la primera pregunta: no hizo falta, pero estaba.

## Errores míos, no huecos del kit

- No propuse `§Frontend` en la spec aunque el paso 4 lo pide para una feature que cambia lo que se ve; lo
  arreglé como ruling en el plan.
- Una orden encadenada que falló a mitad dejó una línea duplicada en `tasks.md`; la vi y la quité al cerrar.
- Mi primer script de verificación visual importaba un paquete que el proyecto no tiene (`playwright` en vez de
  `@playwright/test`).
