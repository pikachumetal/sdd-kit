# Capacidad — estimation

## Propósito

Cómo se acumulan los tiempos de features y patches en `estimation-log.md` y quién lo genera, y cómo se miden los tokens y el coste de una sesión de Claude Code. El método de estimación vive en `estimation.md`.

## Requisitos

### El estimation-log se genera desde los artefactos de cierre

- GIVEN un proyecto con `estimation.md` en `.docs/sdd/steering/` (3.0.0) o en `.docs/sdd/` (2.x) y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo en `.docs/sdd/changes/` o en `.docs/sdd/specs/`
- WHEN se ejecuta `sdd estimation log --root <proyecto>`
- THEN `estimation-log.md` se regenera entero, en la carpeta de `estimation.md`, con una fila por artefacto (fecha, id, tipo, estimado, real, ratio, tokens del hilo, tokens de subagentes, sujetos ($), sesión ($), carpeta), ordenado por carpeta
- AND un proyecto con `specs/20260920-100000-feature-0079-b/walkthrough.md` y `changes/20261010-090000-feature-0160-c/walkthrough.md` tiene las dos filas, `0079` y `0160`
- AND con `estimation.md` en las dos rutas, el log va a `steering/` y escribe por stderr que también existe `.docs/sdd/estimation.md`
- AND `sdd merge`, cuando regenera el log tras un conflicto, lo escribe en esa misma carpeta
- AND la fecha de la fila es la de cierre: la primera línea `created: AAAA-MM-DD` o `date: AAAA-MM-DD` del artefacto; sin ella, o con el placeholder de la plantilla, la fecha de la carpeta, que es la de apertura
- AND `Sesión ($)` es la cifra de `Coste de la sesión`; «sin precio» y «no medido» aparecen tal cual, y sin la línea la celda es `—`
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"
- AND sin `changes/` ni `specs/` bajo `.docs/sdd/` ni `docs/sdd/`, sale con error y dice qué carpetas buscó

### El script vive en el kit y las skills de cierre lo invocan

- GIVEN un proyecto con `.docs/sdd/estimation.md` y el kit instalado
- WHEN `sdd-end-feature` o `sdd-end-patch` llegan al paso estimation-log
- THEN ejecutan `sdd estimation log` desde el kit, sin buscar ni crear copia en el proyecto
- AND solo si `pwsh` no está disponible añaden la fila a mano

### El parseo tolera el formato real de las plantillas

- GIVEN un bloque de tiempo con negrita, `~`, coma decimal, unidad con espacio o rango (`2 h (rango 1,5–3)`)
- WHEN el script lo lee
- THEN obtiene estimado 2 y el real correspondiente, sin descartar la fila
- AND un `walkthrough.md` con `Estimación: —` entra con estimado vacío y ratio vacío
- AND `hotfix.md` se lee como `patch.md` con tipo `hotfix`
- AND la unidad `h`, `hora` u `horas`, o ninguna, deja la cifra en horas; `min`, `mins`, `minuto` o `minutos` la dividen entre 60 (`30 min` → 0,5)
- AND los minutos que siguen a las horas se suman (`~1 h 20 min` → 1,33)
- AND otra unidad (`2 días`) deja la celda vacía y avisa con el texto y el fichero, sin adivinar la conversión; si es el real, la fila se excluye con el aviso del requisito siguiente

### El log muestra el factor global y por Tipo

- GIVEN filas con ratio
- WHEN se genera el log
- THEN aparece el factor global (mediana real/estimado, n) con la media al lado
- AND una tabla Tipo | n | Mediana | p25–p75, donde p25–p75 es `—` en los tipos con menos de 5 artefactos con ratio
- AND con menos de 10 filas con ratio el log avisa de que la calibración es orientativa

### Un bloque presente sin esfuerzo real avisa

- GIVEN un walkthrough o patch con sección de tiempo cuyo esfuerzo real no se puede leer
- WHEN se genera el log
- THEN el script emite un warning con la carpeta afectada y excluye la fila, en vez de descartarla en silencio
- AND un estimado ilegible no avisa: la fila entra con estimado vacío (requisito anterior)
- AND un `patch.md` sin sección «Tiempo» que escribe `Real:`, `Estimación:` o `Estimado:` en otra parte (`Estimado: 0,5 h · Real: 0,7 h` en una línea) también avisa con su ruta y no da fila; sin ninguna de esas etiquetas, se omite sin aviso

### El log resume la dispersión de los ratios

- GIVEN 5 o más filas con ratio
- WHEN se genera el log
- THEN aparecen el p25–p75 y el p80, con una línea que explica que el p80 sirve para comprometer fechas (la estimación × p80 cubre 4 de cada 5 artefactos)
- AND un histograma por tramos del ratio (`<0.5`, `0.5–0.8`, `0.8–1.25`, `1.25–2`, `≥2`) con n y %
- AND el % dentro de ±25 % (ratio de 0,75 a 1,25), el % de sobreestimadas (<0,75) y el % de infraestimadas (>1,25)
- AND el error absoluto |real − estimado| en horas, con media y mediana
- AND con menos de 5 filas con ratio, todo lo anterior se sustituye por «n insuficiente (hacen falta 5)», sin dividir entre cero

### El log muestra la tendencia del ratio

- GIVEN 20 o más filas con ratio
- WHEN se genera el log
- THEN aparece la mediana de las 10 primeras frente a la de las 10 últimas, en el orden del log
- AND con menos de 20, la tendencia dice «n insuficiente (hacen falta 20)»

### El log agrupa por release

- GIVEN un `CHANGELOG.md` en la raíz del proyecto (3.0.0) o un `<docs>/changelog.md` (2.x) con versiones `## [X.Y.Z] - AAAA-MM-DD` (o con `—`)
- WHEN se genera el log
- THEN aparece una tabla Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($), de la release más antigua a la más reciente
- AND con los dos changelogs, manda `CHANGELOG.md` y escribe por stderr que también existe `<docs>/changelog.md`
- AND `Sesión ($)` suma las cifras de los artefactos de la release que la tienen; sin ninguna, `—`
- AND cada artefacto va a la primera versión cuyo tag `vX.Y.Z` contiene el commit que lo añadió, y a la primera con fecha igual o posterior a la de su fila (la de cierre) si la versión no tiene tag; dos versiones del mismo día van de la anterior a la siguiente; los que no caen en ninguna van a «sin publicar», y los que no tienen fecha, a «sin fecha»
- AND sin changelog, o sin versiones con fecha, la tabla no aparece

### El walkthrough registra el modelo y el effort del hilo en cada fase

- GIVEN una feature cuya spec y plan corrieron con Opus 5.5 y effort medium, y cuya ejecución corrió con Sonnet 5 y effort medium tras un `/model`
- WHEN el agente rellena «Modelo del hilo» del walkthrough
- THEN escribe los dos, con su fase: «Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución)»
- AND si no sabe el effort de una fase, escribe «effort no registrado» en esa fase, no un valor supuesto

### La sesión se mide desde los transcripts

- GIVEN un worktree `D:\w\t1` y, en `<proyectos>/D--w-t1/`, una sesión con dos respuestas de `claude-sonnet-5`: la `msg_A` en tres líneas con salida 8, 8 y 4.000 (entrada 2, escritura en caché 1h 100.000, lectura 1.000.000 en las tres), y la `msg_B` en una línea (entrada 3, lectura 1.500.000, salida 1.000), más una línea `<synthetic>`
- WHEN se ejecuta `sdd session tokens --path D:\w\t1`
- THEN el hilo suma, para `claude-sonnet-5`: entrada 5, escritura 1h 100.000, lectura 2.500.000 y salida 5.000, en total 2.605.005 tokens
- AND la línea `<synthetic>` no aparece en ningún modelo

### Los subagentes se miden aparte del hilo

- GIVEN la sesión anterior con `subagents/agent-x1.jsonl` (una respuesta de `claude-opus-5-5`: entrada 10, lectura 500.000 y salida 10.000, entre las 10:00 y las 10:12) y su `agent-x1.meta.json` con `description` «Revisión final de rama»
- WHEN se ejecuta el script
- THEN la línea empieza por `Tokens de subagentes: 510.010 en 1 despacho — Revisión final de rama claude-opus-5-5 510.010 / 12 min` (con dos o más, «despachos» y los despachos separados por `; `)
- AND los tokens del subagente no se suman a los del hilo
- AND un despacho cuya última respuesta no acaba en texto ni en `SubagentHandback` (sigue trabajando) sale con `, en curso` detrás de los minutos: `… 510.010 / 12 min, en curso`

### El coste sale de la tabla de precios del proyecto

- GIVEN la sesión y el subagente anteriores, y un `sdd-kit.json` con `pricing.usdPerMillionTokens` para `claude-sonnet-5` (2 / 2,5 / 4 / 0,2 / 10) y para `claude-opus-5-5` (4 / 5 / 8 / 0,2 / 20)
- WHEN se ejecuta el script
- THEN la línea es `Coste de la sesión: 1,25 $ (hilo 0,95 $ + subagentes 0,30 $)`: el hilo cuesta 0,00001 + 0,4 + 0,5 + 0,05 = 0,95001 $ y el subagente 0,00004 + 0,1 + 0,2 = 0,30004 $, redondeados a céntimos
- AND sin la clave `pricing`, o con un modelo que tiene tokens y no está en la tabla, la línea es `Coste de la sesión: sin precio (<motivo>)` y nombra los modelos que faltan
- AND una respuesta con `usage.speed: "fast"` cuenta con el modelo `claude-sonnet-5:fast`, que necesita su propia fila

### Con `--branch` solo cuenta la rama de la feature

- GIVEN la sesión del primer requisito, con todas sus líneas en la rama `feature/0068`, y una segunda sesión con la respuesta `msg_C` de `claude-sonnet-5` (lectura 900.000) en la rama `develop`
- WHEN se ejecuta el script con `--branch feature/0068`
- THEN el hilo suma 2.605.005 tokens: `msg_C` queda fuera
- AND sin `--branch`, el hilo suma 3.505.005

### Sin `--projects-root`, junta todas las configuraciones de Claude Code

- GIVEN un home con `~/.claude/projects/<carpeta del worktree>/` y `~/.claude-gco/projects/<carpeta del worktree>/`, cada una con una sesión, y `CLAUDE_CONFIG_DIR` que apunta a `~/.claude-gco` o a otra carpeta
- WHEN se ejecuta `sdd session tokens` sin `--projects-root`
- THEN el hilo suma las sesiones de `CLAUDE_CONFIG_DIR`, `~/.claude` y todas las `~/.claude-*` que tengan carpeta del worktree
- AND una carpeta que nombran a la vez `CLAUDE_CONFIG_DIR` y el home cuenta una sola vez

### Sin transcripts, «no medido»

- GIVEN un worktree sin carpeta en `<proyectos>/`
- WHEN se ejecuta el script
- THEN las tres líneas dicen `no medido (sin transcripts de Claude Code para <ruta>)` y el script sale con código 0
- AND con la carpeta pero sin ninguna respuesta de la rama pedida, las tres dicen `no medido (sin respuestas de <rama> en los transcripts)`
- AND con respuestas del hilo y ningún subagente, la línea de subagentes dice `no aplica` y la del coste lleva solo el hilo: `Coste de la sesión: 0,95 $ (hilo 0,95 $)`

### El cierre rellena los tokens y el coste de la sesión

- GIVEN una feature en Claude Code que llega al paso de tiempo real de `sdd-end-feature`, en un proyecto con `.docs/sdd/estimation.md`
- WHEN se rellena la sección 2 del walkthrough
- THEN `Tokens del hilo`, `Tokens de subagentes` y `Coste de la sesión` son las líneas que imprimió `sdd session tokens --path <worktree> --branch <rama de la feature>`, ejecutado desde el kit
- AND en otro harness, las tres dicen «no medido», con el motivo

### El log lee las features y las tasks heredadas

- GIVEN `specs/20260920-100000-task-0063-a/walkthrough.md` con `task: 0063` y `specs/20261001-091500-feature-0079-b/walkthrough.md` con `feature: 0079`, los dos con su bloque de tiempo
- WHEN se ejecuta `sdd estimation log --root <proyecto>`
- THEN `estimation-log.md` tiene dos filas, con ids `0063` y `0079`
- AND la cabecera de la tabla es `| Fecha | Id | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Sesión ($) | Carpeta |`

### El log lee igual los walkthroughs de antes y de después de la evidencia por THEN

- GIVEN un walkthrough cerrado con la tabla 4.2 vieja (`| # | Caso | Resultado |`) y otro con la forma nueva (fila por THEN con evidencia y duración de la suite en 4.1)
- WHEN se ejecuta `sdd estimation log`
- THEN los dos dan su fila con el mismo tipo, estimación, esfuerzo real, tokens y coste que declara su bloque «2. Tiempo y coste», sin aviso

### La estimación de un patch se escribe antes del fix

- GIVEN un proyecto con `.docs/sdd/estimation.md` y un patch clasificado por `sdd-propose`
- WHEN el agente abre el patch
- THEN si pregunta el carril, la pregunta lleva la estimación en horas
- AND, pregunte o no, `patch.md` §5 la escribe antes del fix, y la hora de inicio en UTC en la línea siguiente: `- Estimación: 0,5h` y `- Inicio: 2026-10-09T11:20Z`, con `- Real:` debajo
- AND `sdd estimation log` lee `- Estimación: 0,5h` como hoy, y `- Inicio:` no cuenta como estimación ni como real

## Reglas de la capacidad

- **Dónde viven los datos**: los bloques de tiempo de `walkthrough.md` (§2) y de `patch.md` (§5) de cada carpeta de artefactos, con la estimación previa del patch y su hora de inicio en §5, escritas antes del fix; el log, generado, en la carpeta de `estimation.md`.
- **Idioma de los nombres**: columnas, etiquetas y avisos del log en castellano, como las plantillas que lee.
- **Límites**: no aplica.
- **Avisos**: por stderr y sin cambiar el código de salida: un bloque de tiempo sin esfuerzo real legible (la fila se excluye), un log mantenido a mano que se sobrescribe y un documento presente en sus dos rutas.
- **Regla ante conflicto**: con un documento en su ruta 3.0.0 y en la 2.x a la vez (`steering/estimation.md` y `estimation.md`, `CHANGELOG.md` y `<docs>/changelog.md`), manda la 3.0.0 y el verbo avisa por stderr del otro. Las carpetas de artefactos (`changes/` y `specs/`) se leen las dos.
