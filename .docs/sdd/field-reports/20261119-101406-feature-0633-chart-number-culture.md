---
kit_version: 3.0.3
lane: feature
id: 20261119-101406-feature-0633-chart-number-culture
task: 0633
mode: full
date: 2026-11-19
---

# Ticket para el kit — feature 0633: la entrevista no se hizo y las decisiones del dev-lead acabaron en el ✋

## Contexto

- Carril y modo: feature full, perfil `delegate` (del proyecto)
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-parallel-agents`, `sdd-grilling` (tarde, a petición del
  dev-lead), `sdd-feedback`
- Proyecto: aplicación web con backend .NET, frontend React y un editor de documentos con plugins; equipo pequeño
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (revisor de dominio), Sonnet (revisor técnico y segunda ronda)
- Coste en reloj: no medido; la spec aún no está aprobada al escribir este ticket
- Coste en tokens: no medido en el hilo; revisores ~77k, ~106k y ~100k tokens (sus notificaciones)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La sesión decidió sola qué era del dev-lead y no invocó `sdd-grilling`

- **Qué pasó**: el prompt de arranque traía «Decisiones ya tomadas» y un bloque «Abierto» con dos puntos, cada uno con
  su propuesta. La sesión los resolvió investigando y no preguntó ninguno. Dio el montón del dev-lead por vacío y no
  invocó `sdd-grilling`. Mandó al «✋ Decisiones que he tomado yo» cuatro cosas que eran del dev-lead:
  - una decisión de producto con efecto visible (que la cultura se aplique a todo el documento y no solo a lo
    vinculado);
  - una excepción visible (un parpadeo al abrir);
  - un tope de rendimiento inventado;
  - ningún antiobjetivo preguntado.

  El dev-lead tuvo que aportar el antiobjetivo principal (rendimiento y tope de la sesión del editor) sin que se le
  preguntara. Después preguntó por qué no se había usado `sdd-grilling`. La sesión sí había leído
  `references/spec-writing.md` entero antes de escribir la spec.
- **Fuente**: `.docs/sdd/sdd-kit.json:2` → `"version": "3.0.3"`; `skills/sdd-propose/references/spec-writing.md:5`
  («Ask with `sdd-grilling`»), `:13` («Ask it in `pair` and in `delegate`: the profile isn't a "decide for me"»),
  `:15` («A point under «Abierto» of a launch prompt is never answered… With nothing in the dev-lead's pile, don't
  ask: write the spec»); `skills/sdd-propose/SKILL.md:65` (invocar `sdd-grilling` antes de la primera pregunta).
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4; `skills/sdd-propose/references/spec-writing.md`,
  «What the spec covers».
- **Por qué el kit no lo evitó**: la regla existía y no se aplicó. Su forma deja la puerta abierta: invocar
  `sdd-grilling` depende de que haya «primera pregunta», y la línea 15 da permiso explícito para no preguntar con el
  montón vacío. Clasificar los montones queda en el juicio de la sesión y no deja rastro visible. La sesión usó un
  atajo que el kit no da: «la técnica obliga, luego no es decisión».
- **Coste**: unos 30 minutos de hilo y una segunda ronda de review sobre una spec cuyas decisiones centrales no
  estaban preguntadas; varios turnos del dev-lead para descubrirlo. Causa sin respaldo en artefactos (la spec aún no
  está aprobada).
- **Propuesta**:
  - `sdd-grilling` se invoca siempre en feature y spike, y es él quien dice «no hay preguntas»;
  - antes de escribir `spec.md`, la sesión enseña los tres montones (contestado, menor, del dev-lead), y cada punto
    que no va al del dev-lead lleva su porqué en una línea;
  - todo punto de «Abierto» de un prompt de arranque va siempre al montón del dev-lead;
  - «lo impone la técnica» no saca un punto del montón si cambia lo que ve el usuario.
- **Verificada**: sí — contrastado con `skills/sdd-propose/references/spec-writing.md:13` y `:15`; la propuesta, sin
  verificar.
- **Criterio de aceptación**: GIVEN un prompt de arranque de una feature con un bloque «Abierto» de dos puntos con
  propuesta, y un enfoque técnico que obliga a un efecto visible no pedido · WHEN la sesión llega al paso 4 de
  `sdd-propose` en `delegate` · THEN invoca `sdd-grilling`, enseña los tres montones antes de `spec.md`, y su primera
  pregunta cita uno de los puntos de «Abierto» como «propuesta del prompt», no como decidido.

### 2. La pregunta de la review con `AskUserQuestion` tapó el 🦆 y el ✋

- **Qué pasó**: tras un mensaje largo con el estado de la spec, la sesión preguntó cuántos revisores lanzar con
  `AskUserQuestion`. El diálogo tapó el mensaje y el dev-lead lo rechazó dos veces («ya sabemos que oculta el último
  mensaje, ni he visto el 🦆 ni el ✋»). Las instrucciones globales del usuario piden `AskUserQuestion` para preguntas
  cerradas, con una única excepción para el cierre; el kit no dice en qué forma va esta pregunta.
- **Fuente**: `skills/sdd-propose/references/review-spec.md:26` («Two reviewers, restricted parallelism and a spec
  not delegated → one question», sin forma); `skills/sdd-grilling/SKILL.md`, «Shape of a question» (la pregunta
  operativa va en prosa numerada).
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md` §2.
- **Por qué el kit no lo evitó**: el gate de la spec y `sdd-grilling` fijan la prosa, pero la pregunta de los
  revisores no dice forma, y la instrucción del usuario ganó.
- **Coste**: tres turnos del dev-lead; menos de 10 minutos, pero se repitió dos veces.
- **Propuesta**: toda pregunta de `sdd-propose` que sigue a un mensaje con contenido que leer (🦆, ✋, hallazgos)
  va en prosa numerada al final del mensaje, nunca con una herramienta de diálogo; decirlo una vez en `SKILL.md` y
  enlazarlo desde `review-spec.md` §2.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec de dos revisores en `delegate`, con instrucciones del usuario que piden
  confirmar antes de paralelizar y usar diálogos para preguntas cerradas · WHEN la sesión pregunta cuántos revisores
  lanzar · THEN la pregunta va en prosa numerada al final de un mensaje que incluye el 🦆 y el ✋.

### 3. El primer 🦆 empezó por la causa y el dev-lead lo leyó como la solución

- **Qué pasó**: el 🦆 abría con lo que pasa hoy (el gráfico sigue el idioma de la interfaz de cada usuario) y lo
  ilustraba con dos personas. El dev-lead entendió que la feature hacía eso («has cometido un grave error, el idioma
  no es el de la interfaz…»). Hubo que medirlo en el editor y reescribir el 🦆 empezando por lo que cambia.
- **Fuente**: `skills/sdd-templates/templates/spec-template.md:19` (`🦆 <qué cambia para quien usa el producto, con
  un ejemplo con datos, y después cómo>`).
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, línea del 🦆; `skills/sdd-rubber-duck`, modo
  corto.
- **Por qué el kit no lo evitó**: la plantilla pide «qué cambia» primero y la sesión no lo aplicó. La plantilla no
  avisa del riesgo de abrir con el problema de hoy.
- **Coste**: una medición en el editor real (~10 minutos) y dos turnos, que de todos modos aportaron evidencia útil.
- **Propuesta**: añadir a la línea del 🦆 que la primera frase dice lo que pasará después del cambio, y que el
  comportamiento de hoy, si va, va después y marcado como «hoy».
- **Verificada**: sí — contrastado con `skills/sdd-templates/templates/spec-template.md:19`; la propuesta, sin
  verificar.
- **Criterio de aceptación**: GIVEN un bug cuya causa es un comportamiento distinto por usuario · WHEN la sesión
  escribe el 🦆 · THEN su primera frase describe el comportamiento después del cambio, y el de hoy aparece después,
  marcado como tal.

### 4. «Reglas de la capacidad» en el delta sustituye entradas vigentes enormes

- **Qué pasó**: la review pidió las cinco reglas de producto en el delta. Al probar el delta en una copia,
  `sdd capability merge` sustituyó las cinco entradas vigentes de la capacidad. La de nombres tiene cientos de
  líneas, y llevarla entera al delta para añadir dos nombres no es práctico. La sesión sacó las reglas del delta y
  dejó el texto que añadirá el cierre a mano. La segunda ronda de review lo marcó como un `MODIFIED` sin declarar.
- **Fuente**: `skills/sdd-templates/templates/spec-template.md:132` («al fusionar sustituye entera a la vigente»);
  `sdd capability merge --path <copia> --artifact <spec.md>` → «regla «Idioma de los nombres» sustituida» (y las
  otras cuatro).
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Reglas de la capacidad»; `cli`,
  `capability merge`.
- **Por qué el kit no lo evitó**: la plantilla solo admite sustituir la entrada entera; no hay forma de añadir a una
  entrada larga.
- **Coste**: unos 10 minutos y un hallazgo de la segunda ronda que no se puede cerrar limpio.
- **Propuesta**: que «Reglas de la capacidad» admita una forma de añadido (`- **Idioma de los nombres** (añade): …`)
  que `capability merge` concatena al final de la entrada vigente.
- **Verificada**: sí — reproducido con `sdd capability merge` en PowerShell sobre una copia de `.docs/sdd`; la
  propuesta, sin verificar.
- **Criterio de aceptación**: GIVEN una capacidad con una entrada «Idioma de los nombres» de 200 líneas y un delta con
  `- **Idioma de los nombres** (añade): el aviso X` · WHEN `sdd capability merge` · THEN la entrada conserva sus 200
  líneas y termina con «el aviso X».

## Lo que hice por iniciativa propia

- Medí la causa del bug en el Document Server local antes de diseñar: grep del código del editor dentro del contenedor
  y una sonda de Playwright en el scratchpad que reutiliza los helpers de las E2E del proyecto. Descartó dos
  enfoques (la configuración regional y un código de cultura en el formato) con evidencia, y confirmó la causa con
  dos usuarios. Funcionó; candidato a regla: «un bug cuya causa sale de leer código de terceros se mide en el
  entorno antes de escribir el enfoque».

## Funcionó, no tocar

- La rúbrica de `review-spec.md`: los dos revisores con lentes repartidas no duplicaron hallazgos y encontraron tres
  críticos reales (un orden de entrega con carrera, un THEN que contradecía un requisito vivo y uno que el
  repintado existente no cumplía). La segunda ronda obligatoria encontró otro.
- Probar el delta en una copia con `sdd capability merge` antes del gate destapó el hallazgo 4.

## Menores

- El preview de `spec-writing.md` y `control-profiles.md` leídos juntos se truncó por tamaño (33,7 KB) y hubo que
  leer el resto desde un fichero aparte — `skills/sdd-propose/SKILL.md` paso 4 (leerlos por separado).
