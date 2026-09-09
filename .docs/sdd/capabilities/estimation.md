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
- THEN aparece el factor global (mediana real/estimado, n) y una tabla Tipo | n | Mediana
- AND con menos de 10 filas con ratio el log avisa de que la calibración es orientativa

### Un bloque presente sin esfuerzo real avisa
- GIVEN un walkthrough o patch con sección de tiempo cuyo esfuerzo real no se puede leer
- WHEN se genera el log
- THEN el script emite un warning con la carpeta afectada y excluye la fila, en vez de descartarla en silencio
- AND un estimado ilegible no avisa: la fila entra con estimado vacío (requisito anterior)

## Historial

- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El estimation-log se genera desde los artefactos de cierre
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El script vive en el kit y las skills de cierre lo invocan
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El parseo tolera el formato real de las plantillas
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED El log muestra el factor global y por Tipo
- 2026-09-09 — 20260909-065145-task-0000-estimation-log-script — ADDED Un bloque presente sin esfuerzo real avisa
