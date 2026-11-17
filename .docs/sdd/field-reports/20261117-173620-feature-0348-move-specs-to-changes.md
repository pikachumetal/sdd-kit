---
kit_version: 3.0.1
lane: feature
id: 20261117-173620-feature-0348-move-specs-to-changes
task: 0348
mode: full
date: 2026-11-17
---

# Ticket para el kit — feature 0348: la 3.0.1 mueve `specs/` a `changes/`

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (no hubo entrevista: delegate con decisiones dadas), `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-agent-writing`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code, CLI en Node, una persona)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisores de spec, eje Código), Opus 5.5 (eje Spec, re-revisión)
- Coste en reloj: 1,66 h frente a 2,5 h estimadas
- Coste en tokens: 83.425.958 del hilo y 15.850.604 de subagentes; 33,02 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El repaso de coherencia no corre los tests del repo sobre la copia con el cambio, y un cambio masivo de rutas rompió cuatro comprobaciones que solo vieron los revisores y el gate

- **Qué pasó**: el repaso probó los comandos de la migración en un clon (319 carpetas movidas, 512 `.md` reescritos), pero no corrió la suite del repo sobre ese clon. Después aparecieron cuatro roturas:
  - `path-length.test.ts`: 26 rutas de evidencia pasan a 140-141 caracteres. Crítico de la segunda ronda de revisión de la spec.
  - `skills-3x-paths.test.ts`: las entradas de `ALLOWED` sin ruta 2.x. Crítico de la primera ronda.
  - `root-docs-links.test.ts`: rechazó el commit «solo de renombrados» que fijaba la spec, y obligó a un ruling en la Task 3.
  - `molds.test.ts`: el molde `salas3-current` quedó por debajo de la última migración. Fue el rojo del gate de cierre.
- **Fuente**: `walkthrough.md` de la 0348, §3 y §4.1 (en `.docs/sdd/changes/20261117-162953-feature-0348-move-specs-to-changes/`); `spec.md`, «Hallazgos de la review» (T2, R1); el pre-commit del commit de mover rechazado con `× ROADMAP.md no tiene enlaces relativos rotos`; `moon run kit:test-headless` → `× el molde salas3-current de sdd-upgrade (r1) no queda por debajo de la última migración`.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md`, «The delta on a copy» (solo prueba el delta de capacidades sobre la copia).
- **Por qué el kit no lo evitó**: el repaso pide probar en una copia el delta y los casos reales que cita la spec, no la suite del proyecto con el cambio aplicado.
- **Coste**: dos rondas de revisión de la spec con un crítico cada una, un desvío en la Task 3 y un rojo en el gate de cierre con su arreglo después de la re-revisión (`walkthrough.md` §1, «Tras la re-revisión, sin revisar»), unos 30 min.
- **Propuesta**: en `coherence-pass.md`, cuando la spec mueve o renombra ficheros en bloque, o sube la versión del kit, correr el pre-commit del proyecto sobre la copia con el cambio aplicado, y llevar cada rojo a «Lo que se retira o cambia de forma».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que mueve 300 carpetas de evidencia en un repo con un test de longitud de ruta · WHEN `sdd-propose` hace el repaso de coherencia · THEN la tabla «Lo que se retira o cambia de forma» lleva la fila del test de longitud antes de despachar a los revisores.

### 2. La reescritura de rutas por cadena falsea las rutas citadas de otros proyectos y de moldes

- **Qué pasó**: el comando de la migración cambia `.docs/sdd/specs/` por `.docs/sdd/changes/` en todo `.md`. En este repo también reescribió rutas de carpetas que no son suyas: tickets de campo de otros proyectos, rutas de moldes y lo que escribió un sujeto. Hubo que devolver a mano 24 apariciones (19 y luego 5). Lo cazó el eje Spec en dos pasadas.
- **Fuente**: `walkthrough.md` de la 0348, §5, segundo aprendizaje; `tasks.md`, línea `Re-revisión:` («quedan Spec I2 en parte»).
- **Dónde en el kit**: `skills/sdd-upgrade/references/migrations/v3.0.1.md`, paso 3.
- **Por qué el kit no lo evitó**: la regla de la spec (decisión 4) solo distingue la evidencia por su carpeta, no si la carpeta citada existe en el proyecto.
- **Coste**: dos rondas de arreglo y un `sin revisar`, unos 20 min.
- **Propuesta**: que el paso 3 reescriba una ruta solo si su carpeta existe en `changes/` tras el paso 2, y liste las demás en el informe. En un proyecto consumidor da lo mismo; en un repo que guarda tickets de otros proyectos, evita el falseo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un `.md` que cita `.docs/sdd/specs/20260918-081722-task-0005-x/` sin esa carpeta en el proyecto · WHEN corre el comando del paso 3 · THEN la línea no cambia y sale en el informe.

### 3. La receta del paquete de revisión no aguanta un movimiento masivo

- **Qué pasó**: la receta de `encargo-revision.md` dio un paquete de 2.537.019 líneas, porque las rutas de origen de 35.573 renombrados salían como borrados completos. Lo partí a mano en «lo escrito» y «lo mecánico» (1.541 líneas).
- **Fuente**: `wc -l` del paquete en el workspace del plan → `2537019`, y tras partirlo `1541`.
- **Dónde en el kit**: `skills/sdd-verify/references/encargo-revision.md`, la receta con `EXCLUDE`.
- **Por qué el kit no lo evitó**: `EXCLUDE` solo quita `red/` y `green/`, y no contempla renombrados.
- **Coste**: unos 5 min; sin el arreglo, el paquete no se puede leer.
- **Propuesta**: que la receta liste los renombrados R100 por cuenta (`git diff --name-status -M | grep -c '^R100'`) y los quite del diff con `--diff-filter=AMDT` y la exclusión de las dos rutas.
- **Verificada**: sí — al reconstruir el paquete con la exclusión de `.docs/sdd/specs/**` salió de 1.541 líneas.
- **Criterio de aceptación**: GIVEN una rama con 30.000 renombrados al 100 % y 200 líneas escritas · WHEN se construye el paquete con la receta · THEN el paquete pasa de 2.000 líneas como mucho y nombra la cuenta de renombrados.

## Lo que hice por iniciativa propia

- Probé los comandos de la migración en un clon y en un repo sintético con los casos de la spec antes de presentarla, y lo dejé como test lento (`migration-v3-0-1.slow.test.ts`) que extrae los comandos del `.md`: sirvió para cazar el mensaje y la carpeta con subcarpetas vacías.
- Comprobé que los comandos son ASCII imprimible con un test: un U+FFFD literal habría cambiado al pegarlo en una consola con otra página de códigos.

## Funcionó, no tocar

- Las dos rondas de revisión de la spec cazaron tres críticos reales antes de implementar.
- `sdd estimation log` tras el arreglo dio la misma tabla de releases antes y después de mover (`walkthrough.md` §4.2).

## Menores

- El rojo de la línea base `molds.test.ts > … reservas-e2e-stale (e1)` («el entorno no responde en http://localhost:59084/health») pasa solo; intermitente bajo la carga de `kit:test-headless` — `skills/sdd-worktrees/SKILL.md`, paso 3
- El RED de la Task 1 pasaba sin el arreglo porque `git mv` deja `specs/` vacía en disco y `changeFolders` la sigue leyendo — no localizado (lo resolvió el test)
- El primer `git mv` del repo falló con «bad source» en un fichero presente y versionado; relanzar el comando retomó — `skills/sdd-upgrade/references/migrations/v3.0.1.md`, paso 2, que ya lo dice
- El marcador fijo del molde `salas3-current` en `tests/batteries/sdd-upgrade/subject.mjs` se queda atrás en cada subida de versión, y solo lo caza `kit:test-headless`, fuera del pre-commit — `tests/batteries/sdd-upgrade/subject.mjs:51`
