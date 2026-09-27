---
id: 20260920-202137-task-0001-task-ids
task: 0001
title: Plan de implementación — Ids de task y numeración sin gestor de tickets
spec: ./spec.md
status: draft
created: 2026-09-20
---

# Plan de implementación — Ids de task y numeración sin gestor de tickets

## Decisiones que he tomado yo — valida estas

1. **Orden RED → guidance → GREEN, con el RED como Task 1** — el Art. I no admite escribir la guidance antes del baseline. Las Tasks 3 y 4 no arrancan hasta que la evidencia RED está commiteada, y si un escenario no falla se recorta el alcance y te lo vuelvo a pedir.
2. **El RED reutiliza la evidencia de campo ya verificada y añade solo dos sujetos headless** — los siete tickets de campo y esta misma release (16 tasks numeradas a mano porque el kit las habría llamado todas `0000`) ya son baseline a coste cero, precedente T16. Los dos sujetos nuevos cubren lo que la evidencia de campo no dice: qué id elige un agente con la skill vigente en un proyecto sin gestor, y qué hace al partir una task. ~5 min y ~0,5 $ cada uno.
3. **Modelo y effort por task**: implementadores **Sonnet high** (Tasks 2, 3, 4 — interpretan prosa de guidance y escriben PowerShell con parsing); revisor de task y revisor final **Sonnet medium** (suelo de gama media del Art. IV). Sin `fable` ni `opus xhigh`.
4. **Las Tasks 1 y 5 van en línea** — lanzar sujetos headless y juzgar si un baseline está contaminado es trabajo del hilo: un sujeto-subagente no puede despachar subagentes (tech-stack, T3) y la decisión de recortar alcance ante un RED limpio es un gate tuyo, no delegable.
5. **Las Tasks 3 y 4 se reparten por fichero, no por tema** — ninguna toca un fichero de la otra, así que pueden ir en paralelo sin conflicto: Task 3 = skills de carril, Task 4 = init, plantillas, migración y constitution.
6. **`capabilities/task-ids.md` NO se escribe en la implementación** — lo fusiona `sdd-end-task` desde el delta de la spec al cerrar. Escribirlo ahora duplicaría la fuente.
7. **Los tests del hilo son dos ficheros**: `tests/Get-NextSddId.Tests.ps1` (Pester, un caso por THEN del script, con fixtures versionadas) y `tests/TaskIds.Tests.ps1` (aserciones estructurales sobre los documentos: plantillas, migración, Art. IV, marcador del repo). Un THEN de guidance que no se puede asertar mecánicamente lo cubre la campaña GREEN, no un test de texto.
8. **Coste estimado**: 2,5 h de reloj de hilo y ~1,2 M tokens de subagentes (3 implementadores + 3 revisores de task + 1 revisor final + 2 sujetos), orden de magnitud 10–14 $.

**Goal**: que el kit numere el trabajo de un proyecto sin gestor de tickets con una secuencia propia, decidida una vez en la init y leída por las cuatro skills de carril.

**Architecture**: el modo es un dato en `.docs/sdd/sdd-kit.json` (`ids.mode`), con `tracker` como valor efectivo cuando el campo falta; la reserva planificada vive en la fila del roadmap y el trabajo no planificado usa un script PowerShell de solo lectura que deriva el siguiente id de tres fuentes ya presentes en el repositorio (carpetas de `specs/`, `roadmap.md`, nombres de rama). Ninguna skill guarda contador.

**Tech Stack**: Markdown (skills, plantillas, evidencia) · PowerShell 7 + Pester (script y sus tests) · sujetos headless `claude -p` con copia limpia del kit para las campañas Art. I.

**Spec**: `./spec.md`

## Restricciones globales

- **Art. X — Calidad de código (literal de `.docs/sdd/constitution.md`)**:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Art. I — Ley de hierro de skills**: ninguna edición de skill sin ciclo RED→GREEN documentado en `tests/`. Aplica a recortes y a «pequeños ajustes».
- **Art. III — Idioma**: texto humano en castellano con tildes; nombres de skill y de fichero en inglés kebab-case.
- **Art. VIII — Una sola fuente de plantillas**: las plantillas canónicas viven SOLO en `skills/sdd-templates/templates/`; no se crea ninguna copia.
- **Art. IX — Relación con superpowers**: si superpowers ya cubre algo, se cita, no se copia.
- **Valores exactos que fija la spec**: `ids.mode` con valores `tracker` y `sequence`; ausencia del campo `ids` = `tracker`; ids de cuatro dígitos con ceros a la izquierda (`0001`–`9999`); `0000` es comodín de «sin ticket» solo en modo `tracker` y no cuenta como id ocupado; el script no escribe nada y no ejecuta `git fetch`; nombre y ruta del script: `skills/sdd-templates/scripts/Get-NextSddId.ps1`.
- **Política de modelos (Art. IV)**: modelo **y** effort explícitos en todo despacho; gama media como suelo para revisores e implementadores que trabajan de prosa; `fable` y `opus xhigh` prohibidos sin justificación escrita.
- **Modo de ejecución por defecto**: `superpowers:subagent-driven-development`; una task va en línea solo si su campo `Ejecución` lo declara con motivo.
- **Commits (Art. VI)**: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only. El controlador commitea **por ruta**; `git add -A` está prohibido.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el modo es un campo en un fichero que ya existe y el script usa solo lo que el repositorio ya contiene (carpetas, roadmap, ramas). Sin base de datos, sin contador, sin estado nuevo.
- [x] **YAGNI gate**: nada se abstrae con menos de tres usos. El script es una función pública única; no hay módulo, ni clase, ni capa de configuración.
- [x] **Brownfield gate**: retrocompatible por construcción — sin campo `ids` nada cambia; las carpetas históricas no se renombran.
- [x] **Constitution check**: el Art. IV se reescribe en esta misma task (decisión 6 de la spec), que es la «spec dedicada» que el propio artículo exige.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/Get-NextSddId.ps1` — calcula el siguiente id libre de la secuencia. Solo lectura.
- `tests/Get-NextSddId.Tests.ps1` — Pester del script, un `It` por THEN de la spec.
- `tests/fixtures/task-ids/` — fixtures versionadas del formato que el script lee (carpetas de `specs/`, `roadmap.md` recortado).
- `tests/TaskIds.Tests.ps1` — aserciones estructurales de los documentos que la task cambia.
- `tests/task-ids-red.md` — baseline Art. I.
- `tests/task-ids-green.md` — verificación Art. I con la guidance.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md` — migración con el gate del modo de ids.

**Modificar**:

- `skills/sdd-start-task/references/nombrado.md` — el `<id>` depende del modo; hoy dice «el id del ticket… si no hay: `0000`».
- `skills/sdd-start-task/SKILL.md` — paso 3 (rama) y paso 4 (carpeta): de dónde sale el id según el modo.
- `skills/sdd-start-patch/SKILL.md:36` — igual, y la secuencia compartida con las tasks.
- `skills/sdd-start-release/SKILL.md:31,47,58` y `references/roadmap-fuente.md:5-6` — reserva de ids correlativos al planificar; la prohibición de inventar se precisa, no se quita.
- `skills/sdd-consult/SKILL.md:37` — puede calcular y proponer, no reservar ni escribir.
- `skills/sdd-init-greenfield/SKILL.md` paso 1 bloque (d) y paso 3 — pregunta de numeración y `ids` en el marcador.
- `skills/sdd-init-brownfield/SKILL.md` — misma pregunta en su entrevista.
- `skills/sdd-templates/templates/spec-template.md` y `patch-template.md` — frontmatter: `task:` documenta los dos modos y se añade `parent:`.
- `skills/sdd-templates/SKILL.md` — índice: el script nuevo.
- `.docs/sdd/constitution.md` Art. IV — cláusula del modo `sequence`.
- `.docs/sdd/sdd-kit.json` — el propio kit declara su modo (`sequence`: sus ids salen del roadmap).

**NO se tocan**:

- `.docs/sdd/capabilities/*` — los escribe `sdd-end-task` al fusionar el delta.
- Carpetas de `.docs/sdd/specs/` ya existentes, `changelog.md`, `releases/` — histórico sellado.
- `skills/sdd-templates/scripts/Build-EstimationLog.ps1` y `tests/Build-EstimationLog.Tests.ps1` — el formato del log no entra (task 0010).
- `skills/sdd-end-task/SKILL.md`, `skills/sdd-end-patch/SKILL.md` — el cierre no decide ids.

### 1.2 Modelo de datos

`.docs/sdd/sdd-kit.json` gana un objeto:

```json
{ "version": "1.2.0", "channel": "plugin", "updated": "2026-09-20", "ids": { "mode": "sequence" } }
```

Lectura tolerante: fichero ausente, JSON sin `ids`, o `ids.mode` con valor desconocido ⇒ modo efectivo `tracker`.

### 1.3 Migraciones

`skills/sdd-init-brownfield/references/migrations/v1.2.0.md`, con el formato de los anteriores: pasos-predicado, el del modo marcado **gate**, y sección «Verificación» con comandos comprobables.

### 1.4 Contratos API

Contrato del script, que las skills invocan:

```powershell
# skills/sdd-templates/scripts/Get-NextSddId.ps1
param([string] $ProjectRoot = '.')
```

- Salida estándar: el id, cuatro dígitos con ceros (`0007`), y nada más.
- Salida de error + ningún id: proyecto en modo `tracker`; id duplicado entre artefactos.
- Código de salida: 0 con id; 1 sin id.
- Fuentes de ids ocupados: nombres de carpeta de `.docs/sdd/specs/` con `-(task|patch)-(\d{4})-`; primera columna de tabla de `.docs/sdd/roadmap.md` (`| 0007 |`); segmento de nombre de rama local o remota (`feature/0007`, `hotfix/0007-slug`). `0000` nunca cuenta.

### 1.5 UX

No aplica: el kit no tiene interfaz. Lo más parecido es el texto de la pregunta de la entrevista, que fija la Task 4.

### 1.6 Dependencias

PowerShell 7 y Pester (ya en uso por `Build-EstimationLog.ps1`). `git` para leer ramas; si el directorio no es un repositorio, el script omite esa fuente sin fallar. Ninguna dependencia nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un escenario del RED no falla y la guidance sobra | Media | Medio | Art. I: se recorta el alcance y se vuelve a pedir aprobación (Task 1, step final) |
| El regex de cuatro dígitos captura fechas o versiones del roadmap (`2026`, `1.2.0`) | Alta | Alto | Patrón anclado por contexto (columna de tabla, `task-`/`patch-`, segmento de rama), nunca `\d{4}` libre; fixture con fechas y versiones que no deben contar |
| Las ramas remotas obsoletas dejan un id sin ver | Media | Bajo | El script no hace fetch y lo dice; la reserva planificada del roadmap manda ante conflicto |
| Dos arranques simultáneos sin fila calculan el mismo id | Baja | Medio | La rama es el acto de reserva; residual aceptado en la spec con regla de renumeración |
| Los tests estructurales de documentos se vuelven frágiles | Media | Bajo | Solo aserciones de presencia de contrato (campo `parent:`, fichero de migración, cláusula del Art. IV), nunca de redacción |

### 1.8 Rollout

Directo, dentro de la release 1.2.0: el bump de `plugin.json` y la entrada de changelog los hace el carril release, no esta task. La migración `v1.2.0.md` es el camino de los proyectos ya inicializados.

### 1.9 Excepciones a la constitution

Ninguna. El Art. IV se modifica por el procedimiento que él mismo fija.

---

## 2. Tasks

Registro vivo en `./tasks.md`.

### Task 1 — Baseline RED (Art. I)

**Modelo**: n/a — hilo principal
**Ejecución**: en línea. Motivo: un sujeto-subagente no puede despachar subagentes ni juzgar contaminación de fixture (tech-stack, T3), y decidir si un baseline limpio recorta el alcance es un gate del dev-lead.
**Tests RED**: n/a (esta task *produce* el baseline)

**Ficheros**: crear `tests/task-ids-red.md`

- [ ] **Step 1: Inventario de la evidencia de campo reutilizable** — recoger, con fichero y línea, lo ya verificado: `nombrado.md:7` y `spec-template.md:3` (`0000` si no hay ticket), `sdd-start-task:34` (rama `feature/<ticket>`), la petición 38 del acta v1.1.0 y los ids `0004, 0005, 0006a, 0008` de `sdd-project-template`. Precedente de reutilización: T16.
- [ ] **Step 2: Sujeto E1 — proyecto sin gestor** — fixture desechable en el scratchpad: `.docs/sdd/` con `constitution.md` corta sin regla de ids, `roadmap.md` con dos tasks sin id y dos carpetas históricas `…-task-0000-…`. Petición neutra: «arranca la task de la fila 2 del roadmap» con la copia limpia del kit vigente. Se mide: id de la carpeta creada y nombre de rama.
- [ ] **Step 3: Sujeto E2 — task partida** — misma fixture, petición neutra: «esta task es demasiado grande, pártela en dos y arranca la primera». Se mide: si aparece un sufijo tipo `0006a`.
- [ ] **Step 4: Verificar en disco** — comprobar carpetas y ramas creadas en cada copia, no el autoinforme del sujeto.
- [ ] **Step 5: Escribir `tests/task-ids-red.md`** — método (lanzamiento headless exacto), tabla de resultados por escenario, racionalizaciones citadas textuales, y veredicto por requisito de la spec: qué falla y qué no.
- [ ] **Step 6: Gate de alcance** — si algún escenario NO falla, recortar el alcance de las Tasks 3 y 4 al subconjunto respaldado y pedir aprobación antes de seguir.
- [ ] **Step 7: Commit** — `git add tests/task-ids-red.md` · `test: baseline RED de la numeración de ids (task 0001)`

---

### Task 2 — Script `Get-NextSddId.ps1`

**Modelo**: Sonnet, effort high
**Tests RED**: hilo principal · `tests/Get-NextSddId.Tests.ps1` + `tests/fixtures/task-ids/`, escritos y commiteados antes de despachar
**Ficheros**: crear `skills/sdd-templates/scripts/Get-NextSddId.ps1`; modificar `skills/sdd-templates/SKILL.md` (índice de scripts)

**Interfaces**:
- Consumes: nada de tasks anteriores.
- Produces: `Get-NextSddId.ps1 -ProjectRoot <ruta>` → id de cuatro dígitos por salida estándar, código 0; sin id y mensaje por salida de error, código 1. Las Tasks 3 y 4 citan esta ruta y este contrato en la guidance.

- [ ] **Step 1: Leer el contrato** — `§1.4` de este plan y los requisitos del script en la spec (cuatro escenarios: siguiente id, duplicado, modo `tracker`, `0000` ignorado). Seguir el estilo de `Build-EstimationLog.ps1`: `[CmdletBinding()]`, `Set-StrictMode -Version Latest`, ayuda de `Get-Help`, sin alias.
- [ ] **Step 2: Implementar** — una función por fuente de ids (`specs/`, roadmap, ramas), cada una ≤ 20 líneas, y una función de composición que devuelve el máximo + 1. Patrones exactos: `-(task|patch)-(\d{4})-` sobre nombres de carpeta; `^\|\s*(\d{4})\s*\|` sobre líneas del roadmap; `(?:^|/)(\d{4})(?:$|-)` sobre `git branch --all --format='%(refname:short)'`. Sin `git fetch`. `0000` se descarta al normalizar. Mensajes de error en castellano.
- [ ] **Step 3: Ejecutar los tests** — `Invoke-Pester tests/Get-NextSddId.Tests.ps1 -Output Detailed`. Esperado: todos verdes. Los tests son contrato: no se modifican; si uno parece incorrecto, parar y explicarlo.
- [ ] **Step 4: Suite completa** — `Invoke-Pester tests/ -Output Detailed`. Esperado: sin regresiones.
- [ ] **Step 5: Commit** — `git add skills/sdd-templates/scripts/Get-NextSddId.ps1 skills/sdd-templates/SKILL.md` · `feat(templates): script determinista del siguiente id de la secuencia`

---

### Task 3 — Skills de carril leen el modo de ids

**Modelo**: Sonnet, effort high
**Tests RED**: hilo principal · `tests/task-ids-red.md` (Task 1) es el baseline de estos cambios; contrato mecánico en `tests/TaskIds.Tests.ps1`
**Ficheros**: modificar `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-task/references/nombrado.md`, `skills/sdd-start-patch/SKILL.md`, `skills/sdd-start-release/SKILL.md`, `skills/sdd-start-release/references/roadmap-fuente.md`, `skills/sdd-consult/SKILL.md`

**Interfaces**:
- Consumes: `skills/sdd-templates/scripts/Get-NextSddId.ps1 -ProjectRoot <ruta>` (Task 2) — id por salida estándar, código 1 y mensaje si no procede.
- Produces: el texto de guidance que la campaña GREEN (Task 5) mide.

- [ ] **Step 1: `nombrado.md`** — la entrada `<id>` pasa a depender del modo declarado en `.docs/sdd/sdd-kit.json`: en `tracker`, el id del ticket y `0000` si no hay; en `sequence`, el id reservado en la fila del roadmap, o el que devuelve el script si no hay fila. Añadir que tasks y patches comparten secuencia y que una task partida toma el siguiente id con `parent:` en el frontmatter, nunca un sufijo. Mantener la prohibición vigente: «nunca el nombre de un módulo».
- [ ] **Step 2: `sdd-start-task`** — en el paso 3 (rama) y el paso 4 (carpeta), decir de dónde sale el id en cada modo, y que en `sequence` sin fila de roadmap la rama se crea **antes** de la carpeta porque es el acto de reserva. Añadir una fila a la tabla de racionalizaciones con la frase del RED y una red flag si el RED la respalda.
- [ ] **Step 3: `sdd-start-patch`** — el paso 2 (carpeta) lee el modo igual que la task, y declara explícitamente la secuencia única con las tasks.
- [ ] **Step 4: `sdd-start-release` y `roadmap-fuente.md`** — al escribir el scope, en modo `sequence` cada fila del roadmap lleva su id reservado y correlativo. Precisar «los ids de ticket no se inventan»: el origen legítimo es el gestor o la secuencia del proyecto; elegir un número a ojo sigue prohibido. Actualizar la fila de la tabla de racionalizaciones (`:58`) en la misma línea.
- [ ] **Step 5: `sdd-consult`** — la fila `:37` pasa a: la consulta puede calcular y proponer el siguiente id (con el script), pero no lo reserva ni lo escribe en ningún artefacto.
- [ ] **Step 6: Verificación** — `Invoke-Pester tests/TaskIds.Tests.ps1 tests/Skills.Tests.ps1 -Output Detailed`. Esperado: verde (los `It` de skills de carril dejan de fallar).
- [ ] **Step 7: Commit** — `git add` con las seis rutas · `feat(skills): las skills de carril leen el modo de ids del proyecto`

---

### Task 4 — Init, plantillas, migración y Art. IV

**Modelo**: Sonnet, effort high
**Tests RED**: hilo principal · `tests/task-ids-red.md` (Task 1) para la entrevista; contrato mecánico en `tests/TaskIds.Tests.ps1`
**Ficheros**: modificar `skills/sdd-init-greenfield/SKILL.md`, `skills/sdd-init-brownfield/SKILL.md`, `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-templates/templates/patch-template.md`, `.docs/sdd/constitution.md`, `.docs/sdd/sdd-kit.json`; crear `skills/sdd-init-brownfield/references/migrations/v1.2.0.md`

**Interfaces**:
- Consumes: el contrato del campo `ids` (`§1.2`) y la ruta del script (`§1.4`).
- Produces: el campo `ids` en el marcador, que las skills de la Task 3 leen.

- [ ] **Step 1: Entrevista greenfield** — en el bloque (d) del paso 1, tras «¿gestor de tickets?», añadir la pregunta de numeración con sus dos opciones nombradas (ids del gestor / secuencia propia del proyecto) y que «no sé» deja `tracker`. En el paso 3, el `sdd-kit.json` que se crea incluye `ids`.
- [ ] **Step 2: Entrevista brownfield** — misma pregunta en su entrevista, y el marcador que escribe al terminar incluye `ids`.
- [ ] **Step 3: Plantillas** — en `spec-template.md` y `patch-template.md`, el comentario del campo `task:` documenta los dos orígenes (ticket del gestor · id de la secuencia) y se añade `parent: <id>` con su comentario: «solo si esta task o patch nace de partir otra; la relación no va en el id».
- [ ] **Step 4: Art. IV** — en `.docs/sdd/constitution.md`, sustituir «naming `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>` en UTC con id de ticket (0000 si no hay)» por la forma que contempla los dos modos: id del gestor (`0000` si no hay) en modo `tracker`, id de la secuencia única de tasks y patches en modo `sequence`, con el modo declarado en `sdd-kit.json`. No tocar el resto del artículo.
- [ ] **Step 5: Marcador del propio kit** — `.docs/sdd/sdd-kit.json` declara `"ids": { "mode": "sequence" }` sin tocar `version` ni `channel` (la versión la sube el carril release).
- [ ] **Step 6: Migración v1.2.0** — crear `migrations/v1.2.0.md` con el formato de `v1.1.0.md`: paso 1 **gate** que presenta los dos modos al dev-lead y escribe `ids.mode`, con el pendiente explícito si no está; paso 2, marcador con la versión; sección «Verificación» con comandos (`Test-Path`, lectura del JSON) y la constancia de que nada de `specs/` ni del changelog se toca.
- [ ] **Step 7: Verificación** — `Invoke-Pester tests/TaskIds.Tests.ps1 tests/Manifests.Tests.ps1 tests/NamingConvention.Tests.ps1 -Output Detailed`. Esperado: verde.
- [ ] **Step 8: Commit** — `git add` con las siete rutas · `feat(init): el modo de numeración se decide en la entrevista y se migra`

---

### Task 5 — Campaña GREEN (Art. I)

**Modelo**: n/a — hilo principal
**Ejecución**: en línea. Motivo: mismo que la Task 1; además el GREEN debe correr contra una copia limpia del kit **ya editado**, que solo el hilo puede preparar tras integrar las Tasks 3 y 4.
**Tests RED**: n/a (esta task verifica contra el RED de la Task 1)

**Ficheros**: crear `tests/task-ids-green.md`

- [ ] **Step 1: Copia limpia** — copiar `skills/` y `.claude-plugin/` del working tree a una carpeta del scratchpad (sin `.docs/`, que filtraría esta spec al sujeto).
- [ ] **Step 2: Repetir E1 y E2** — mismas fixtures y mismas peticiones neutras que la Task 1, con la copia editada.
- [ ] **Step 3: Verificar en disco** — id de carpeta, nombre de rama, orden rama→carpeta, `parent:` en la spec de la mitad partida.
- [ ] **Step 4: Escribir `tests/task-ids-green.md`** — veredicto contra **cada** fallo del RED, y los huecos de la propia guidance que aparezcan, con su REFACTOR y re-verificación en el mismo fichero.
- [ ] **Step 5: Suite completa** — `Invoke-Pester tests/ -Output Detailed`. Esperado: verde.
- [ ] **Step 6: Commit** — `git add tests/task-ids-green.md` · `test: GREEN de la numeración de ids (task 0001)`

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 2,5h (rango 2–4h), condicionada al RED: si E1 o E2 no fallan, las Tasks 3 y 4 se recortan y baja a ~1,5h
- Base de la estimación: 5 tasks, de las que 2 son campañas (≈10 min de redacción por fichero de evidencia + espera en paralelo que no suma, avisos 2 y 3 de `estimation.md`), 1 es código con tests (la más cara del hilo: escribir el Pester del script) y 2 son ediciones de guidance de una a tres líneas por fichero. Referencia del log: tasks del kit con ratio mediano < 1.
- Confianza: media — el riesgo está en el regex del roadmap y en cuántos escenarios del RED fallen de verdad.

---

## 3. Validación final

- [ ] `Invoke-Pester tests/ -Output Detailed` verde, incluidos los dos ficheros nuevos
- [ ] Cada requisito del delta de la spec tiene su verificación: Pester (script), campaña GREEN (guidance) o aserción estructural (documentos)
- [ ] `tests/task-ids-red.md` y `tests/task-ids-green.md` cierran el ciclo del Art. I para las seis skills tocadas
- [ ] Revisión final de rama limpia
- [ ] Gate de validación del dev-lead antes de `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- El proyecto declara cómo numera su trabajo → Task 4 (steps 1, 2, 5, 6). ✓
- Un proyecto sin campo `ids` numera como hasta ahora → Task 2 (lectura tolerante) + Task 3 (texto de las skills) + `tests/TaskIds.Tests.ps1`. ✓
- La entrevista de init decide el modo de ids → Task 4 (steps 1, 2). ✓
- Tasks y patches comparten una sola secuencia → Task 2 (patrón `-(task|patch)-`) + Task 3 (steps 1, 3). ✓
- En modo secuencia el id lo reserva el hilo principal al planificar → Task 3 (step 4). ✓
- Una task no planificada obtiene su id con un script determinista → Task 2. ✓
- El script avisa de un id duplicado y no devuelve ninguno → Task 2 + su Pester. ✓
- El script avisa si el proyecto no está en modo secuencia → Task 2 + su Pester. ✓
- La rama reserva el id del trabajo no planificado → Task 3 (step 2), verificado en Task 5 (step 3). ✓
- Una task partida toma el siguiente id, no un sufijo → Task 3 (step 1) + Task 4 (step 3, `parent:`), medido en Task 1 E2 y Task 5. ✓
- En modo gestor el id es el del ticket → Task 3 (steps 1-5, la rama `tracker` no cambia conducta). ✓
- En modo secuencia el id sale de la reserva o del script → Task 3 (steps 1-5). ✓
- Reglas de la capacidad (datos, idioma, límites, avisos, conflicto, contrato de lectura del roadmap) → Task 2 (límites, avisos, contrato) + Task 4 (dónde viven los datos, idioma). ✓
- `onboarding`: la entrevista fija además el modo de ids → Task 4 (steps 1, 2). ✓
- `migration`: el marcador incluye `ids` y v1.2.0 lo pregunta con gate → Task 4 (steps 5, 6). ✓
- Art. IV reescrito → Task 4 (step 4). ✓
- Ciclo RED→GREEN por skill tocada (Art. I) → Tasks 1 y 5. ✓
- `capabilities/task-ids.md` → N/A: lo fusiona `sdd-end-task` al cerrar (decisión 6 de este plan). ✓
