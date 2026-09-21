# Misión — sdd-kit

## Por qué existe

El equipo aplicaba SDD con skills copiadas en cada repo (marketplace, legacy, banco de pruebas), y las copias derivaban: rutas distintas, módulos distintos, fraseos distintos. El kit es el **nivel 1 de la taxonomía de skills del equipo** — el proceso, agnóstico de stack — con un único origen de verdad, instalable y actualizable centralmente.

El principio que lo gobierna: **el resultado debe depender del proceso, no del criterio individual de quien ejecuta**. Las skills encapsulan las convenciones; el dev sigue un flujo guiado con gates.

## Usuarios

- Developers del equipo trabajando con Claude Code en cualquier proyecto (nuevo o legacy).
- Los propios agentes: las skills están escritas para que un agente las cumpla bajo presión (validadas contra baselines que fallan sin ellas).

## Qué es y qué no es

- **Es**: las 11 skills de proceso (init ×2, task ×2, patch ×2, release ×2, consult, changelog, feedback del kit) y la de plantillas + las plantillas canónicas.
- **No es**: skills técnicas por stack (nivel 2: sql-migration, backend-*, frontend-*) ni específicas de proyecto (nivel 3: build, dialogs, styles) — esas viven en cada repo o en futuros kits.

## Dominio (lenguaje del equipo)

- **Documentos de anclaje**: mission, constitution, tech-stack, architecture, `capabilities/` (una capacidad por fichero), roadmap — el contexto por capas que sustituye al CLAUDE.md monolítico.
- **Carril task / carril patch**: flujo completo con spec y plan vs registro ligero para bugs deterministas.
- **Modo lite**: variante del carril task —no un carril nuevo: sin skills propias ni prefijo de carpeta— para cambios acotados que cumplen un predicado observable. Spec corta y sin plan; el gate de la spec, el smoke y el walkthrough se conservan intactos. Lo habilita el predicado y lo activa la confirmación del usuario.
- **Carril release**: apertura (el acta triada se convierte en scope que decide el usuario) y cierre (Definition of Done del hito: acta + triage, retro con evidencia, changelog sellado, release notes de cliente, roadmap colapsado; merge y tag los confirma el usuario).
- **Acta de release (feedback.md)**: acta única por release — inventario del feedback, triage y retro; vive en `.docs/sdd/releases/vX.Y.Z/`.
- **Carril consult**: el anti-carril — preguntar, entender, planificar o estructurar con el contexto de anclaje cargado, sin producir artefactos. Tres modos: entender (lee y responde), **sondear** (spike: prueba desechable cuya salida es una respuesta, nada persiste) y pensar (interrogatorio sin artefactos). Cuando la consulta se vuelve trabajo, transiciona (anunciándolo) a task/patch/release, que gatean; un scope de varias tasks es release, no task.
- **Spike**: la vía de `brainstorming` cuya salida es una respuesta, no código que se conserve ("¿se puede…?", "pruébalo rápido"). En el kit no es una task: `sdd-start-task` la enruta a `sdd-consult`.
- **Módulo por predicado observable**: una capacidad opcional (estimación, changelog) se activa por la presencia de su fichero, sin configuración.
- **Walkthrough**: cierre inmutable de una task; alimenta docs vivos, skills y estimation-log.
- **Nivel de review**: cuánta review adversarial merece una spec —sin · un revisor (lente dominio o técnica) · dos revisores—, propuesto por la rúbrica de complejidad (señales observables en la spec: capacidad nueva, contrato público, `MODIFIED`/`REMOVED`, tres o más capacidades, datos, dependencia externa, área no explorada) y **activado por el usuario**. Sus hallazgos entran en «Decisiones a validar» antes del gate. Nunca en lite.
- **Gate de validación**: el usuario prueba y valida el trabajo terminado **antes** de `sdd-end-task`; el merge viene después, en el cierre. Es distinto de la revisión final de rama, que es del agente.
- **Marcador de versión** (`.docs/sdd/sdd-kit.json`): la versión del kit que un proyecto tiene aplicada, con el canal por el que llegó. **Migración**: aplicar, en orden y con gate, los `migrations/vX.Y.Z.md` posteriores a esa versión; la ejecuta `sdd-init-brownfield` cuando `.docs/sdd/` ya existe. No es re-inicializar: no regenera anclaje ni vuelca `capabilities/`.
- **Entorno por worktree**: lo que un worktree necesita además de sus dependencias —base de datos, puertos, servicios, datos de prueba— para trabajar aislado. El kit fija el contrato (`environments.md`, marcador `.sdd-env.json`, entradas `env:setup` / `env:clean` / `env:preflight`); el proyecto escribe los scripts. El worktree lo crea y borra superpowers.
