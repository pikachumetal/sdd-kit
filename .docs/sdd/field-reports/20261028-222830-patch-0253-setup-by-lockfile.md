---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261028-222830-patch-0253-setup-by-lockfile
task: 0253
mode:
date: 2026-10-28
---

# Ticket para el kit — patch 0253: el Step 2 de sdd-worktrees elige el gestor de Node por el lockfile

## Contexto

- Carril y modo: patch (petición cerrada)
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code, CLI en Node con Vitest, baterías de sujetos `claude -p`)
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica; 6 sujetos sonnet en la batería
- Coste en reloj: 0,43 h frente a 0,76 h estimadas (con el gate)
- Coste en tokens: 9.373.708 en el hilo, 3,75 $; sujetos 2,33 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El RED de sujetos que fijó el triaje no podía exhibir el fallo: los sujetos deducen el gestor del lockfile

- **Qué pasó**: la fila 0253 fijaba el RED como «GIVEN el molde `reservas-deps` sin la línea de pnpm en su `tech-stack.md` WHEN un sujeto sigue el carril patch THEN corre `pnpm install` antes del primer test». Con el texto viejo del Step 2 (`if [ -f package.json ]; then npm install; fi`), 0 de 3 sujetos medidos corrieron `npm install`: los que leyeron el Step 2 lo adaptaron al ver `pnpm-workspace.yaml` y `pnpm-lock.yaml` y corrieron `pnpm install --frozen-lockfile`. El fallo de la línea solo se ve ejecutándola: un test que corre el bloque bash del Step 2 en una carpeta por lockfile salió 3 de 4 en rojo (`expected 'npm install' to be 'pnpm install --frozen-lockfile'`). Hubo que parar al dev-lead por el desvío.
- **Fuente**: `.docs/sdd/specs/20261028-215919-patch-0253-setup-by-lockfile/patch.md` §4, filas 1-3; `red/out/ws3-1.tools.txt`, `red2/out/ws3-2.tools.txt` (`pnpm install --frozen-lockfile` antes del primer test); `cli/test/kit/worktrees-setup.slow.test.ts`
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, el triaje que escribe el criterio de aceptación de una fila «Actuar»; el paso 1 de `skills/sdd-start-patch/SKILL.md` («El test del comportamiento pedido va en RED antes del cambio»)
- **Por qué el kit no lo evitó**: ninguna regla distingue un defecto de un texto que el agente ejecuta (un bloque de comandos literal) de uno de conducta; el triaje eligió el RED de conducta, el caro, para un defecto que un test del bloque reproduce sin sujetos
- **Coste**: 1,55 $ en 4 sujetos y una parada del dev-lead (`patch.md` §4 y §3, decisión «RED determinista»)
- **Propuesta**: en el triaje, si el defecto está en un bloque de comandos que una skill da literal, el criterio de aceptación es un test que ejecuta el bloque; los sujetos, solo como control
- **Verificada**: sí — RED de sujetos limpio 0/3 y RED del bloque 3/4 en rojo, en este patch
- **Criterio de aceptación**: GIVEN un ticket que dice que una orden literal de una skill hace lo que no debe WHEN `sdd-roadmap` la tría a «Actuar» THEN el criterio de la fila es un test que ejecuta la orden, no un escenario de sujetos

### 2. La clasificación de `sdd-propose` ejecuta el código antes de preparar el entorno (segundo y tercer caso)

- **Qué pasó**: `red2/ws3-1` corrió `node --test` antes de instalar (`ℹ fail 2`), y `green/ws3-1` leyó `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'fecha'` en la clasificación; los dos instalaron después, ya en `sdd-start-patch`. Es la (a) de los menores del ticket del patch 0248, que el roadmap dejó en «Esperar 2.º ticket»
- **Fuente**: `.docs/sdd/specs/20261028-215919-patch-0253-setup-by-lockfile/red2/out/ws3-1.tools.txt` y `green/out/ws3-1.tools.txt`; fila «Menores del ticket del patch 0248» de `.docs/sdd/roadmap.md`
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 2 («reproduce a reported failure»), que corre antes del paso 1 de `sdd-start-patch`
- **Por qué el kit no lo evitó**: la 0248 puso el Step 2 de `sdd-worktrees` en el paso 1 de `sdd-start-patch` y en el carril config, no en el paso 2 de `sdd-propose`, que también ejecuta código
- **Coste**: un turno de sujeto por caso, sin efecto en el resultado (sin respaldo de coste en reloj)
- **Propuesta**: mover la regla del entorno al punto donde se ejecuta código por primera vez (el paso 2 de `sdd-propose`, «reproduce»), en vez de añadir otra frase
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN el molde `reservas-deps-sin-stack` WHEN `ws3` corre con n = 2 THEN en `tools.txt` ningún `node --test` ni `node src/…` va antes de un `pnpm install`

### 3. Dos de cuatro sujetos del RED preguntan el alcance pese a llevar el carril en la petición

- **Qué pasó**: `red/ws3-2` y `green/ws3-2` pararon con «¿Abro el patch 0012 con este alcance?» y dos suposiciones (franja con basura, fin antes del inicio), con la petición «carril patch» y perfil `delegate`; no llegaron a ningún test, y el RED necesitó una segunda tanda
- **Fuente**: `red/out/ws3-2.texts.txt`, `green/out/ws3-2.texts.txt`; `patch.md` §4, fila 2
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 2, «Lane in the request»
- **Por qué el kit no lo evitó**: la regla dice que no se repregunta el carril; no dice qué hacer con una suposición de alcance que la fila no fija (¿es «una decisión visible que nadie fijó», que sube el carril, o una pregunta cerrada?)
- **Coste**: 0,92 $, la segunda tanda del RED (`patch.md` §5)
- **Propuesta**: sin propuesta cerrada; medir antes si la pregunta es correcta (alcance sin fijar) o ceremonia
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `ws1` o `ws3` con n = 4 WHEN corre THEN o los cuatro siguen hasta el fix, o los que paran nombran una decisión que la fila no fija

## Lo que hice por iniciativa propia

- Completé la muestra del RED con una segunda tanda porque un sujeto no llegó a la conducta medida; no es relanzar un rojo, pero ninguna regla lo distingue. Funcionó: dio el único caso de la fila WS.
- Puse `ws3` en un paso propio (`setup-lockfile`) para lanzarlo solo con `STEPS`: `battery.mjs` filtra por paso, no por id.

## Funcionó, no tocar

- La parada por desvío en `delegate`, con el camino entero y tres opciones: el dev-lead eligió en una respuesta.
- `sdd merge --sync` integró la base sin conflictos y el gate filtrado corrió en 112 s.

## Menores

- El primer lanzamiento falló con `RUNS_DIR de 177 caracteres (máximo 100)` (el scratchpad de la sesión) y el segundo con `la copia del kit lleva .docs/ o tests/: sácala con git archive`; ninguna de las dos reglas está en «Baterías por skill» de `tech-stack.md` — no localizado en el kit
- `run.mjs` escribió `EPERM, Permission denied` al borrar la carpeta de dos sujetos — `tests/headless/campaign.mjs`
- `green/ws3-2` avisó «La sesión carga el kit 2.3.4 y el proyecto pide el 3.0.0»; no lo investigué — no localizado
