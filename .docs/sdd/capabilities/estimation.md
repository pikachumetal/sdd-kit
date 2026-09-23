# Capacidad — estimation

Verdad viva del comportamiento observable del módulo de estimación del kit: cómo se acumulan los tiempos de tasks y patches en `estimation-log.md` y quién lo genera. La declaró la spec de la task `estimation-log-script` (T7) en sus «Decisiones a validar» (decisión 1). El método de estimación en sí (factor de calibración, reference-class) vive en `estimation.md`.

## Requisitos

### El estimation-log se genera desde los artefactos de cierre
- GIVEN un proyecto con `.docs/sdd/estimation.md` y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo
- WHEN se ejecuta `Build-EstimationLog.ps1 -Root <proyecto>`
- THEN `<docs>/estimation-log.md` se regenera entero con una fila por artefacto (fecha, task, tipo, estimado, real, ratio, carpeta), ordenado por carpeta
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"

### El script vive en el kit y las skills de cierre lo invocan
- GIVEN un proyecto con `.docs/sdd/estimation.md` y el kit instalado
- WHEN `sdd-end-task` o `sdd-end-patch` llegan al paso estimation-log
- THEN ejecutan el script desde el Base directory de `sdd-templates`, sin buscar ni crear copia en el proyecto
- AND solo si `pwsh` no está disponible añaden la fila a mano

### El parseo tolera el formato real de las plantillas
- GIVEN un bloque de tiempo con negrita, `~`, coma decimal, unidad con espacio o rango (`2 h (rango 1,5–3)`)
- WHEN el script lo lee
- THEN obtiene estimado 2 y el real correspondiente, sin descartar la fila
- AND un `walkthrough.md` con `Estimación: —` entra con estimado vacío y ratio vacío
- AND `hotfix.md` se lee como `patch.md` con tipo `hotfix`

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
- GIVEN un `<docs>/changelog.md` con versiones `## [X.Y.Z] - AAAA-MM-DD` (o con `—`)
- WHEN se genera el log
- THEN aparece una tabla Release | Artefactos | Horas reales | Mediana | Sujetos ($), de la release más antigua a la más reciente
- AND cada artefacto va a la primera versión con fecha igual o posterior a la de su carpeta; los posteriores a la última versión van a «sin publicar», y los que no tienen fecha, a «sin fecha»
- AND sin `changelog.md`, o sin versiones con fecha, la tabla no aparece

## Historial

- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El estimation-log se genera desde los artefactos de cierre
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El script vive en el kit y las skills de cierre lo invocan
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El parseo tolera el formato real de las plantillas
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El log muestra el factor global y por Tipo
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED Un bloque presente sin esfuerzo real avisa
- 2026-09-23 — 20260923-195017-task-0046-estimation-stats — MODIFIED El log muestra el factor global y por Tipo
- 2026-09-23 — 20260923-195017-task-0046-estimation-stats — ADDED El log resume la dispersión de los ratios
- 2026-09-23 — 20260923-195017-task-0046-estimation-stats — ADDED El log muestra la tendencia del ratio
- 2026-09-23 — 20260923-195017-task-0046-estimation-stats — ADDED El log agrupa por release
