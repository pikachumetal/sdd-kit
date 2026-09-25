# Misión — sdd-kit

## Por qué existe

El equipo aplicaba SDD con skills copiadas en cada repo (marketplace, legacy, banco de pruebas), y las copias derivaban: rutas distintas, módulos distintos, fraseos distintos. El kit es el **nivel 1 de la taxonomía de skills del equipo** — el proceso, agnóstico de stack — con un único origen de verdad, instalable y actualizable centralmente.

El principio que lo gobierna: **el resultado debe depender del proceso, no del criterio individual de quien ejecuta**. Las skills encapsulan las convenciones; el dev aprueba la spec y valida el resultado, y el resto lo recorre el agente según el perfil de control (ver «Cómo se trabaja con el kit»).

## Usuarios

- Developers del equipo trabajando con Claude Code en cualquier proyecto (nuevo o legacy).
- Los propios agentes: las skills están escritas para que un agente las cumpla bajo presión (validadas contra baselines que fallan sin ellas).

## Qué es y qué no es

- **Es**: las 12 skills de proceso (init ×2, task ×2, patch ×2, release ×2, consult, configuración, changelog, feedback del kit) y la de plantillas + las plantillas canónicas.
- **No es**: skills técnicas por stack (nivel 2: sql-migration, backend-*, frontend-*) ni específicas de proyecto (nivel 3: build, dialogs, styles) — esas viven en cada repo o en futuros kits.

## Cómo se trabaja con el kit

Decidido por el dev-lead el 2026-09-21 a partir del [issue GH #1](field-reports/20260921-gh-1-velocity-ceremony.md) y de la experiencia propia: el kit se sentía lento por ceremonia, no por errores. Es la visión que implementan las tasks de la 1.2.0; el reparto está en el roadmap.

**Flujo por defecto (perfil `delegate`).** El dev pide en lenguaje natural y entra sola la skill que toca (`sdd-start-task`, `sdd-start-patch` o `sdd-consult`). La primera pregunta de la entrevista confirma carril y modo, y ofrece lite si la tarea cumple su predicado. La entrevista usa `brainstorming` y cada pregunta va con `AskUserQuestion`: varias opciones, una recomendada y el motivo. Con los datos, el agente escribe la spec con su lista de decisiones ocultas y el dev la aprueba. La review de la spec es opcional: por defecto no se hace; el agente la recomienda solo cuando la task lo justifica, dice por qué, y se hace antes del gate. Desde la aprobación el agente trabaja solo: planifica sin gate del plan (comprueba que cada escenario de la spec tiene su task y escribe el método que recomienda el plan) y ejecuta en la propia sesión (Native) o, en los planes largos, con subagentes: un máximo de tres en paralelo, cada uno en su worktree y solo en tasks que el plan clasifica como independientes. Al terminar para los procesos que arrancó (front, backend), presenta lo hecho, las decisiones que tomó, los desvíos, cómo arrancar y el guion de prueba, y espera la validación. Validar cierra la task y hace el merge según la política del proyecto, sin volver a preguntar.

**Lo que la autonomía no cubre.** Cambiar algo de la spec aprobada exige parar y preguntar. Las acciones hacia fuera (push, PR, publicar) se confirman siempre, salvo el push de la rama de integración tras el merge del cierre, que en `delegate` y `unattended` sigue `merge.push`. El merge a main y el tag los decide siempre una persona.

**Perfiles de control.** Se eligen en el init, la migración los pregunta si faltan, viven en `sdd-kit.json` y una release o una task pueden cambiarlos para sí.

- **`pair`** (en pareja): además de lo del flujo por defecto, para en el plan, tras cada task y antes del merge.
- **`delegate`** (delegado, el default): para en la spec, en los desvíos y en la validación.
- **`unattended`** (desatendido): sin paradas hasta terminar la release. Solo con información suficiente (funcional y planificación de `sdd-roadmap`); si una task no la tiene, se aparca como bloqueada. La spec la aprueba el agente con las decisiones registradas; un desvío se resuelve con la opción más conservadora y se registra, y si bloquea, la task se aparca. La validación se aplaza a un único smoke de release. Al final, un solo informe; el merge a main y el tag siguen siendo del dev.

Los interruptores por gate sueltos quedan fuera: cuatro gates opcionales son 16 combinaciones que nadie prueba. Si hace falta, el perfil se cambia para una task concreta.

**Frenos del modo autónomo.** Tope de reintentos por tipo de fallo: tres rondas de fix y se aparca; un fallo de permisos o de entorno aparca al instante; repetir sin avanzar aparca. Vigía de silencio con dos umbrales configurables en `sdd-kit.json`: 8 minutos entre pasos y 20 dentro de un comando largo. Al saltar, el agente lee lo último y decide o avisa; nunca relanza a ciegas. Lo largo (subagentes, suites) se lanza en segundo plano para poder vigilarlo, porque la herramienta de subagentes no tiene timeout.

**Por qué.** La calidad la compran pocas piezas, medidas en un proyecto real del equipo ([research del hackaton](releases/v1.0.0/research-hackaton.md)): contrato en la spec, tests RED escritos por el hilo principal, documentos de anclaje, restricciones en cada encargo y la review por defecto. La review adversarial no aportó con el contrato cerrado, y 2–3 agentes fueron más rápidos que 15. El resto de la ceremonia se activa cuando la task lo pide, no por defecto. Fuera coincide la crítica al SDD: el valor está en escribir la spec antes; las herramientas que ponen un gate humano en cada fase generan revisión de más y no escalan a tareas pequeñas.

## Dominio (lenguaje del equipo)

- **Documentos de anclaje**: mission, constitution, tech-stack, architecture, `capabilities/` (una capacidad por fichero), roadmap — el contexto por capas que sustituye al CLAUDE.md monolítico.
- **Carril task / carril patch**: flujo completo con spec y plan vs registro ligero para bugs deterministas.
- **Modo lite**: variante del carril task —no un carril nuevo: sin skills propias ni prefijo de carpeta— para cambios acotados que cumplen un predicado observable. Spec corta y sin plan; el gate de la spec, el smoke y el walkthrough se conservan intactos. Lo habilita el predicado y lo activa la confirmación del usuario.
- **Carril release**: apertura (el acta triada se convierte en scope que decide el usuario) y cierre (Definition of Done del hito: acta + triage, retro con evidencia, changelog sellado, release notes de cliente, roadmap colapsado; merge y tag los confirma el usuario). **Es opcional** (task 0004): la apertura es la vía ideal para generar tasks, y en un equipo con gestor de tickets es herramienta del PM o PO, o no se usa. El cierre es el corte de publicación y funciona sin apertura previa.
- **Modo incremental**: trabajar solo con task y patch, acumulando en `[Unreleased]`, y cortar con `sdd-end-release` cuando se publica. No es un interruptor: es lo que ocurre cuando no se abre release.
- **Destinatario**: persona o grupo, distinto de quien hace la release, que la recibe. Lo declara `release.hasRecipient` en `sdd-kit.json`; qué cambia en el carril con y sin destinatario está en [`release-flow`](capabilities/release-flow.md).
- **Acta de release (feedback.md)**: acta única por release — inventario del feedback, triage y retro; vive en `.docs/sdd/releases/vX.Y.Z/`.
- **Carril consult**: el anti-carril — preguntar, entender, planificar o estructurar con el contexto de anclaje cargado, sin producir artefactos. Tres modos: entender (lee y responde), **sondear** (spike: prueba desechable cuya salida es una respuesta, nada persiste) y pensar (interrogatorio sin artefactos). Cuando la consulta se vuelve trabajo, transiciona (anunciándolo) a task/patch/release, que gatean; un scope de varias tasks es release, no task.
- **Spike**: la vía de `brainstorming` cuya salida es una respuesta, no código que se conserve ("¿se puede…?", "pruébalo rápido"). En el kit no es una task: `sdd-start-task` la enruta a `sdd-consult`.
- **Módulo por predicado observable**: una capacidad opcional (estimación, changelog) se activa por la presencia de su fichero, sin configuración.
- **Walkthrough**: cierre de una task; el cuerpo no se reescribe y lo posterior se añade como adenda fechada; alimenta docs vivos, skills y estimation-log.
- **Nivel de review**: cuánta review adversarial merece una spec —sin · un revisor (lente dominio o técnica) · dos revisores—, **recomendado por el agente** con la rúbrica de complejidad (señales observables en la spec: capacidad nueva, contrato público, `MODIFIED`/`REMOVED`, tres o más capacidades, datos, dependencia externa, área no explorada), ninguno por defecto; el usuario acepta o cambia. Sus hallazgos entran en «Decisiones a validar» antes del gate. Nunca en lite.
- **Perfil de control**: cuánto para el agente a esperar al dev — `pair`, `delegate` (default) o `unattended`; se guarda en `sdd-kit.json`. Detalle en «Cómo se trabaja con el kit».
- **Gate de validación**: el usuario prueba y valida el trabajo terminado **antes** de `sdd-end-task`; el merge viene después, en el cierre. Es distinto de la revisión final de rama, que es del agente.
- **Marcador de versión** (`.docs/sdd/sdd-kit.json`): la versión del kit que un proyecto tiene aplicada, con el canal por el que llegó. **Migración**: aplicar, en orden y con gate, los `migrations/vX.Y.Z.md` posteriores a esa versión; la ejecuta `sdd-init-brownfield` cuando `.docs/sdd/` ya existe. No es re-inicializar: no regenera anclaje ni vuelca `capabilities/`.
- **Entorno por worktree**: lo que un worktree necesita además de sus dependencias —base de datos, puertos, servicios, datos de prueba— para trabajar aislado. El kit fija el contrato (`environments.md`, marcador `.sdd-env.json`, entradas `env:setup` / `env:clean` / `env:preflight`); el proyecto escribe los scripts. El worktree lo crea y borra superpowers.
