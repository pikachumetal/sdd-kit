# Changelog — sdd-kit

Formato: [Keep a Changelog 1.1.0](https://keepachangelog.com/). Changelog técnico del kit. Backward-looking: el `roadmap.md` es forward-looking.

## [Unreleased]

## [1.1.0] - 2026-09-20

En uso desde el bump del 2026-09-09; cerrada formalmente el 2026-09-20. [Acta](releases/v1.1.0/feedback.md) · [release notes](releases/v1.1.0/release-notes.md).

### Changed

- **Convención de nombres (rompe para consumidores)** — los nombres que el kit fija a los proyectos pasan a inglés (Art. III): `funcional/` → `capabilities/`, `funcional/legado.md` → `capabilities/legacy.md`, el placeholder `<capacidad>` → `<capability>`, `changelog-cliente.md` → `client-changelog.md`; las plantillas `funcional-template.md` → `capability-template.md` y `changelog-cliente-template.md` → `client-changelog-template.md`. → [ref](specs/20260909-210515-task-0000-english-file-names/)
- **`migrations/v1.0.0.md`** — corregido en sitio: el `funcional.md` heredado aterriza en `capabilities/legacy.md`. → [ref](specs/20260909-210515-task-0000-english-file-names/)

### Added

- **`migrations/v1.1.0.md`** — migración idempotente por predicado para proyectos que ya declaraban `1.0.0`: sin ella la corrección de `v1.0.0.md` no les llegaría nunca, porque el procedimiento solo aplica versiones posteriores a la declarada. → [ref](specs/20260909-210515-task-0000-english-file-names/)
- **`tests/NamingConvention.Tests.ps1`** — barrido por lista blanca de rutas vivas que falla si un nombre en castellano vuelve a `skills/`, `README.md` o el anclaje vivo; el histórico sellado, el contenido de `capabilities/` y `migrations/` quedan fuera por diseño. → [ref](specs/20260909-210515-task-0000-english-file-names/)

### Fixed

- **`Build-EstimationLog.ps1`** — dejaba fuera del log, con un WARNING y sin más consecuencia visible, dos formas de escribir el bloque de tiempo que nadie considera erróneas: un `patch.md` redactado con las etiquetas largas del walkthrough (`- Estimación de implementación (del plan):` / `- Esfuerzo real:`) y una cifra precedida de `≈`. Las etiquetas pasan a constantes compartidas por `Read-Walkthrough` y `Read-Patch`, y `ConvertTo-Hours` acepta `≈`/`≃` junto a `~`. El daño era silencioso: el factor de calibración se calculaba sobre un conjunto incompleto. → [ref](specs/20260910-072132-patch-0000-estimation-parser-tolerante/patch.md)

## [1.0.0] - 2026-09-09

Planificada y trabajada como v0.6.0 (RC hacia 1.0.0); cerrada como 1.0.0 por decisión del dev-lead en el cierre. Los artefactos históricos conservan el nombre v0.6.0. [Acta](releases/v1.0.0/feedback.md) · [release notes](releases/v1.0.0/release-notes.md).

### Added

- **sdd-consult** — modo "sondear": un spike ("¿se puede…?", "pruébalo rápido") se prueba con código desechable y termina en una respuesta, sin carpeta, rama ni código conservado; antes la skill vetaba la prueba. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **sdd-start-task** — cuarta salida del enrutado: el spike no es una task y va a `sdd-consult`; antes salía como task con rama y spec. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **plan-template** — bloque "Restricciones globales" con copia literal de las restricciones de la spec y los artículos de la constitution aplicables, alineado con el `Global Constraints` de `writing-plans` 6.3.0. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **README / constitution / roadmap** — versión de superpowers validada (6.3.0, 2026-09-07), revisión de compatibilidad en cada release del kit (Art. V) y sección de referencias de vigilancia (superpowers, OpenSpec, Spec Kit). → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **Art. I** — el **A/B de no-regresión** (control = versión vigente, tratamiento = versión recortada) es el test válido para recortes y reestructuraciones de skills existentes; el baseline vacío no mide un recorte. → [ref](specs/20260907-184057-task-0000-progressive-disclosure/)
- **architecture.md** — criterio (a)+(b) que decide qué bloque baja a `references/`, con enlace relativo en el punto de uso, más la anatomía de `tests/<skill>-ab.md`. → [ref](specs/20260907-184057-task-0000-progressive-disclosure/)
- **Art. IX** — relación con superpowers en tres reglas: adoptar al máximo, aportar lo propio (artefactos, `.docs/sdd/`, gates), extender solo ante hueco demostrado y documentado. → [ref](specs/20260908-095857-task-0000-workflow-ejecucion/)
- **plan-template** — campos `Modelo` (modelo **y** effort, ambos explícitos) y `Ejecución` (solo si la task se desvía del default) por task; aviso de que las "Restricciones globales" no se heredan solas. → [ref](specs/20260908-095857-task-0000-workflow-ejecucion/)
- **environments-template** — contrato agnóstico del entorno por worktree: marcador `.sdd-env.json` (`ticket`, `state`, `created`), entradas `env:setup` / `env:clean` / `env:preflight`, dos tipos de entorno; el proyecto decide runner y scripts. → [ref](specs/20260908-135025-task-0000-entorno-por-worktree/)
- **spec-template** — spec ligera: "Decisiones que he tomado yo — valida estas" arriba, Intent/Scope/Approach, delta por capacidad con `ADDED`/`MODIFIED (antes: …)`/`REMOVED` y escenarios GIVEN/WHEN/THEN, aprobaciones. Lo técnico (datos, UX, riesgos, rollout) pasa a `plan.md`. → [ref](specs/20260908-150513-task-0000-spec-ligera-funcional/)
- **funcional-template** — `funcional/<capacidad>.md`, verdad viva del comportamiento por capacidad, con título estable por requisito como clave de fusión y cinco reglas contra la proliferación de ficheros. → [ref](specs/20260908-150513-task-0000-spec-ligera-funcional/)
- **sdd-templates** — `scripts/Build-EstimationLog.ps1`, primer código ejecutable del kit: regenera `estimation-log.md` desde walkthroughs, patches y hotfix legacy con parseo tolerante (negrita, `~`, coma decimal, rangos, extracción acotada a la sección de tiempo), factor global y mediana por Tipo, aviso ante esfuerzo real ilegible o log mantenido a mano; 26 tests Pester con fixtures versionadas en `tests/fixtures/`. → [ref](specs/20260909-065145-task-0000-estimation-log-script/)
- **Art. X** — calidad de código: sin comentarios que repitan el código, clean code, y la regla viaja literal en planes y encargos a subagentes. → [ref](specs/20260909-065145-task-0000-estimation-log-script/)
- **funcional/estimacion.md** — primera capacidad del kit fusionada por `sdd-end-task` con cinco requisitos `ADDED`. → [ref](specs/20260909-065145-task-0000-estimation-log-script/)
- **tests/Skills.Tests.ps1, tests/Manifests.Tests.ps1, .githooks/pre-commit** — validación de la anatomía de las 11 skills contra el propio repo (name, description, H1, Overview, enlaces, `references/` sin huérfanos, sin `@`, lista de superpowers, índice de plantillas, manifests) más `claude plugin validate` en strict; el hook pre-commit bloquea el commit si la suite falla. → [ref](specs/20260909-100606-task-0000-skills-validation/)
- **sdd-init-brownfield** — migración de proyectos consumidores: `references/migrations/vX.Y.Z.md` por versión con cambio estructural (v0.2.0 plantillas, v0.4.0 hotfix→patch, v1.0.0 `funcional/`, marcador, script de estimación, entorno) con pasos-predicado, gates y verificación, más el procedimiento en `migrations/README.md`; predicado «¿onboarding o migración?» (si existe `.docs/sdd/`, migrar y nada más). RED 1/3 aplicaba el onboarding encima → GREEN 0/4. → [ref](specs/20260909-105650-task-0000-migracion-consumidores/)
- **sdd-kit.json** — marcador de versión del kit en `.docs/sdd/` (`version`, `channel`, `updated`), escrito por `init-*` y por la migración; el propio kit lo lleva. Art. V exige el fichero de migración en toda release con cambio estructural. → [ref](specs/20260909-105650-task-0000-migracion-consumidores/)
- **funcional/migracion.md** — capacidad nueva fusionada con cinco `ADDED`. → [ref](specs/20260909-105650-task-0000-migracion-consumidores/)
- **sdd-start-task** — `references/review-spec.md`: rúbrica de complejidad (ocho señales, tres niveles) que propone cuánta review adversarial merece una spec, encargo del revisor por lente (dominio / técnica) con la pregunta del complemento de visibilidad, e incorporación de hallazgos antes del gate; `references/encargo-revision.md`: cabecera obligatoria de todo encargo de revisión con el bloque de Restricciones globales como primera sección (el revisor final de superpowers no tiene hueco para restricciones). → [ref](specs/20260909-131802-task-0000-gates-y-reviews/)
- **sdd-start-task, sdd-end-task** — ⛔ gate de validación del trabajo: antes de `sdd-end-task` el agente presenta qué hay, cómo probarlo y su smoke, y espera que el usuario diga qué probó; «cierra la tarea» no es validación; el pre-check de `sdd-end-task` no arranca sin ella. RED: 2/2 cerraban enteras y preguntaban por el merge al final. → [ref](specs/20260909-131802-task-0000-gates-y-reviews/)
- **plan-template, spec-template, walkthrough-template** — el plan abre con «Decisiones que he tomado yo» (modelo/effort, ejecución, decisiones técnicas, riesgos, coste) y exige el artículo de calidad de código en Restricciones globales; la spec pide el nivel de review como primera decisión; el walkthrough registra la review de spec y la validación del dev-lead. → [ref](specs/20260909-131802-task-0000-gates-y-reviews/)
- **Art. X, plan-template** — segunda regla de comentarios: ninguno cita constitution, spec, task, requisito ni `funcional/` (la trazabilidad vive en el commit y el walkthrough); la ayuda de Restricciones globales nombra las dos reglas para que viajen a implementador y revisores aunque la constitution del proyecto no las tenga. → [ref](specs/20260909-164438-task-0000-comentarios-sin-citas/)
- **sdd-start-task** — antes de despachar un implementador, el hilo principal escribe y commitea los tests que codifican los THEN de la task (RED); `encargo-revision.md` gana la cabecera del implementador con el contrato («los tests de `<ruta>` son el contrato; no los modifiques; si uno te parece incorrecto, para y explícalo») y `plan-template` el campo `Tests RED` por task con la recomendación de forma. Medido: sin el paso, el implementador los escribía 2/2; con él, 2/2 antes del despacho e intactos tras la implementación. → [ref](specs/20260909-173929-task-0000-tests-red-hilo/)
- **Reglas de producto con nombre y sitio** — las cinco decisiones que el agente tomaba al azar (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) tienen sección «Reglas de la capacidad» en `funcional-template` (fusión por nombre en `sdd-end-task`), subsección en el delta de `spec-template`, punto propio en la lente dominio de `review-spec.md` (inventada o contraria a la constitution = Crítico) y bloque de cinco preguntas en la entrevista de `sdd-init-greenfield` y la generación de `sdd-init-brownfield`, con la constitution llevando «Reglas de producto». Medido: la spec pasa de 3/5 con tope inventado a 5/5 con el tope de la constitution; la entrevista, de 1/5 a 5/5 por nombre. → [ref](specs/20260909-180422-task-0000-reglas-de-capacidad/)
- **sdd-templates, sdd-init-greenfield, sdd-init-brownfield** — changelog de cliente opt-in: `changelog-cliente-template.md` (acumulado por versión, derivado de las release notes de cada cierre) y la pregunta «¿y novedades para el cliente?» en la entrevista; `sdd-end-release` lo actualiza si existe, sin paso nuevo (medido 2/2 en el baseline). → [ref](specs/20260909-194633-task-0000-changelog-cliente/)

### Changed

- **sdd-start-task** — la fila de overrides sobre la clasificación de `brainstorming` queda acotada a `bounded`/`architectural` y remite el spike al enrutado; el override en sí se probó 2/2 con `brainstorming` 6.3.0 real y se mantiene sin cambios. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **6 skills** — `sdd-start-task`, `sdd-end-release`, `sdd-start-release`, `sdd-end-task`, `sdd-init-greenfield` y `sdd-init-brownfield` bajan su detalle a `references/` leídos en el punto de uso; el conjunto de las 11 pasa de 8011 a 7054 palabras (−12 %). → [ref](specs/20260907-184057-task-0000-progressive-disclosure/)
- **sdd-start-task** — `subagent-driven-development` pasa a ser el default de implementación; la ejecución en línea es la excepción que el plan declara por task; al despachar, las "Restricciones globales" viajan en el encargo del subagente (hueco de superpowers: lo exige en prosa, su `task-brief` no lo ejecuta). → [ref](specs/20260908-095857-task-0000-workflow-ejecucion/)
- **sdd-end-task** — paso de `requesting-code-review` antes de la rama, solo para tasks ejecutadas en línea (el default ya revisa cada task y la rama). → [ref](specs/20260908-095857-task-0000-workflow-ejecucion/)
- **Art. IV** — el modo de ejecución por defecto y la política de modelos (la de superpowers: turnos, no precio por token) son convención del kit. → [ref](specs/20260908-095857-task-0000-workflow-ejecucion/)
- **sdd-start-task, sdd-end-task, sdd-end-patch, sdd-init-greenfield, sdd-init-brownfield** — predicado `environments.md`: `env:setup` tras el worktree, `env:clean` antes de `finishing-a-development-branch`, y `init-*` lo calca por entrevista o cosecha. El worktree y su borrado se adoptan de superpowers; el override deja de negarlos. → [ref](specs/20260908-135025-task-0000-entorno-por-worktree/)
- **Convención `funcional/`** — `funcional.md` (declarado en siete sitios y escrito por ninguna skill) pasa a ser la carpeta `funcional/`, un fichero por capacidad; `sdd-start-task` presenta el gate de la spec empezando por las decisiones a validar; `plan-template` recibe riesgos y rollout. → [ref](specs/20260908-150513-task-0000-spec-ligera-funcional/)
- **sdd-end-task, sdd-end-patch** — el paso estimation-log ejecuta el script del kit por `<Base directory>/../sdd-templates/scripts/` en vez de buscar una copia en `.tools/sdd/` del proyecto; la fila a mano queda solo sin `pwsh` o sin el script (instalación parcial). RED 2/2 → GREEN 2/2. → [ref](specs/20260909-065145-task-0000-estimation-log-script/)
- **estimation-log.md del kit** — pasa de manual a generado por el script (dogfooding); `estimation.md`, `tech-stack.md`, `architecture.md` y README lo reflejan. → [ref](specs/20260909-065145-task-0000-estimation-log-script/)
- **sdd-start-task** — Gate 1 con dos vías explícitas: invocación sola → contexto y parar; con enunciado → contexto y seguir por el enrutado. Medido: la `description` dispara la skill sola 2/2 ante «implementa la task N», sin regla en el `CLAUDE.md` del proyecto. → [ref](specs/20260909-162118-task-0000-disparo-skills/)
- **sdd-end-release** — la release colapsada del roadmap lleva «smoke: fecha · N hallazgos», para leer el patrón «release pequeña, smoke por tramo» sin abrir las actas. Medido: `sdd-start-release` ya propone pequeño en la primera release (2/2). → [ref](specs/20260909-172400-task-0000-release-pequena/)
- **sdd-end-release** — la línea de smoke del roadmap colapsado admite «smoke: pendiente»: el número no se inventa (un sujeto escribió «0 hallazgos» sin smoke). → [ref](specs/20260909-194633-task-0000-changelog-cliente/)

### Fixed

- **sdd-templates, marketplace.json** — `## Overview` que faltaba en el índice de plantillas y `description` del marketplace (único aviso de `claude plugin validate --strict`); ambos destapados por la suite nueva. → [ref](specs/20260909-100606-task-0000-skills-validation/)
- **Build-EstimationLog.ps1** — la etiqueta «Estimación de implementación» admite cualquier paréntesis («(de la spec)» en walkthroughs lite), no solo «(del plan)»; la fila de T8 salía con estimado vacío. → [ref](specs/20260909-103518-patch-0000-estimacion-lite-label/)
- **Build-EstimationLog.ps1** — residuales parked de la revisión final de T7 cerrados: fixture del corte por encabezado, assert del singular «1 artefacto» y comprobación explícita de que `-Root` existe (sin `try/catch` que enmascare otras excepciones). → [ref](specs/20260909-120448-patch-0000-estimation-log-residuales/)

## [0.5.0] — 2026-09-02

### Added

- **modo lite del carril task** — variante para cambios acotados: spec corta y sin `plan.md`, habilitada por cinco condiciones observables y activada solo por confirmación del usuario; campo `mode` en el frontmatter de la spec, que lee `sdd-end-task`. Validado con RED→GREEN→REFACTOR. → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **dependencias declaradas en el manifest** — `plugin.json` declara `superpowers` como dependencia cross-marketplace y `marketplace.json` la autoriza; sin restricción de versión, para no depender de los tags de un repo ajeno. → [ref](specs/20260902-160308-task-0000-dependencias-declaradas/)

### Changed

- **sdd-start-task** — el paso 4 pasa a redactarse como invocación inequívoca de `superpowers:brainstorming`: 2/2 agentes del baseline lo leían como descripción de actividad y exploraban el código en su lugar. → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **sdd-start-task** — fila nueva de overrides: la clasificación de `brainstorming` (spike/bounded/architectural) no gobierna los artefactos del kit; su rama `bounded` ("no spec file, no implementation plan document") no aplica. → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **spec-template** — secciones marcadas *(solo full)* y bloque de estimación para el modo lite, que no tiene `plan.md` donde alojarlo. Plantilla única: no se crea `spec-lite-template.md` (Art. VIII). → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **declaración de dependencias en fuente única** — el README pasa a ser la declaración canónica (canal, instalación y obligatoriedad de cada una, más las 6 skills de superpowers que el kit invoca) y `tech-stack` apunta a él en vez de repetir la lista, que ya había divergido. → [ref](specs/20260902-160308-task-0000-dependencias-declaradas/)
- **README** — la línea de estado pasa de "v0.3.0 publicada" a "v0.4.0 cerrada, sin distribuir": ninguna versión está publicada mientras no haya remoto. → [ref](specs/20260902-160308-task-0000-dependencias-declaradas/)

### Fixed

- **sdd-consult** — la rama de estructurar invocaba `superpowers:grilling`, nombre que no resuelve: `grilling` no la distribuye el plugin superpowers, es una skill personal instalada vía `npx skills add`. Rama muerta desde `ea4f0ba`, el commit que creó la skill. → [ref](specs/20260902-153722-patch-0000-grilling-reference/)

## [0.4.0] — 2026-07-22

### Changed

- **sdd-start-hotfix / sdd-end-hotfix → sdd-start-patch / sdd-end-patch** — rename del carril ligero para eliminar el equívoco con `hotfix/*` de git-flow (el carril describe el proceso, no el tipo de rama); plantilla `hotfix-template.md` → `patch-template.md`, artefacto `patch.md`, prefijo de carpeta `patch-`. Histórico preservado. → [ref](specs/20260722-103807-task-0000-carril-rama-worktree/)
- **sdd-start-task** — la fila `using-git-worktrees` del override deja de negar los worktrees: el kit no los gestiona pero respeta el git-flow del proyecto (worktrees incluidos). Verificado con RED→GREEN. → [ref](specs/20260722-103807-task-0000-carril-rama-worktree/)

## [0.3.0] — 2026-07-21

### Added

- **sdd-consult** — carril de consulta: preguntar/entender/planificar/estructurar con el contexto cargado, sin artefactos; grilling para estructurar, handoff anunciado a los carriles de trabajo. Validado con RED→GREEN. → [ref](specs/20260721-114445-task-0000-consult-skill/)

## [0.2.0] — 2026-07-21

### Added

- **sdd-start-release / sdd-end-release** — carril release: apertura con scope decidido por el usuario y cierre con acta+triage, retro con evidencia, release notes de cliente y gate de merge/tag; validadas con ciclo RED→GREEN→REFACTOR. → [ref](specs/20260721-082038-task-0000-release-skills/)
- **feedback-template / release-notes-template** — plantillas del acta de release y de las release notes en la fuente única. → [ref](specs/20260721-082038-task-0000-release-skills/)

### Changed

- **fuente única de plantillas** — los proyectos dejan de llevar `.docs/sdd/templates/`: las skills afectadas calcan del skill `sdd-templates`. → [ref](specs/20260721-082038-task-0000-release-skills/)
- **add-to-changelog** — el corte de versión queda señalado como acción de `sdd-end-release`. → [ref](specs/20260721-082038-task-0000-release-skills/)

## [0.1.0] — 2026-07-09

### Added

- **sdd-start-task / sdd-end-task** — ciclo de task con gates de aprobación y Definition of Done, validadas con TDD de writing-skills. → [ref](../../tests/)
- **sdd-start-hotfix / sdd-end-hotfix** — carril ligero con causa raíz obligatoria y merge reservado al usuario. → [ref](../../tests/)
- **add-to-changelog** — contrato de formato de entrada (una línea + link de trazabilidad). → [ref](../../tests/)
- **sdd-init-greenfield / sdd-init-brownfield** — arranque de proyecto por entrevista con gate / onboarding de codebase documentando el estado real. → [ref](../../tests/)
- **sdd-templates** — las 7 plantillas canónicas (base marketplace + injertos del legacy).
- Manifests de plugin (`.claude-plugin/`) con distribución dual (plugin de Claude Code + npx skills add).
- Documentos de flujo del equipo en `.docs/flux/` (greenfield, brownfield, annex — en catalán).
