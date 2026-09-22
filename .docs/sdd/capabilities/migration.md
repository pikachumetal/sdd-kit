# Capacidad — migration

Verdad viva del comportamiento observable de la migración de un proyecto consumidor entre versiones del kit: cómo declara la versión que tiene, qué escribe cada release del kit y qué hace «actualízame al kit». La declaró la spec de la task `migracion-consumidores` (T10) en sus «Decisiones a validar» (decisión 1). El procedimiento detallado vive en `skills/sdd-init-brownfield/references/migrations/README.md`.

## Requisitos

### El proyecto declara la versión del kit que tiene
- GIVEN un proyecto inicializado con `sdd-init-greenfield` o `sdd-init-brownfield`
- WHEN termina la inicialización
- THEN existe `.docs/sdd/sdd-kit.json` con `version`, `channel`, `updated` e `ids`

### Cada release con cambio estructural lleva su migración
- GIVEN una release del kit que cambia la estructura de `.docs/sdd/` o retira algo del proyecto
- WHEN se cierra la release
- THEN existe `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos verificables por predicado

### Un proyecto ya inicializado se migra, no se re-inicializa
- GIVEN un proyecto con `.docs/sdd/` y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-init-brownfield`
- THEN lee `sdd-kit.json` (o asume anterior a v0.2.0 si no existe), aplica en orden las migraciones posteriores a esa versión hasta la mayor disponible, con gate por fichero, y escribe el marcador al final
- AND no regenera los documentos de anclaje ni vuelca `capabilities/`

### El `funcional.md` heredado se conserva como legado
- GIVEN un proyecto con `funcional.md`
- WHEN se aplica la migración a v1.0.0
- THEN el fichero pasa a `capabilities/legacy.md` con una nota de excepción temporal, y ninguna capacidad se crea de golpe

### La copia local del script de estimación se retira
- GIVEN un proyecto con `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/Build-EstimationLog.ps1`
- WHEN se aplica la migración a v1.0.0
- THEN se borra la copia, se regenera `estimation-log.md` con el script del kit y el diff del log se presenta al dev-lead antes de commitear

### Un proyecto que ya migró a v1.0.0 recibe el rename por `v1.1.0.md`
- GIVEN un proyecto cuyo `sdd-kit.json` declara `1.0.0` y que tiene `funcional/` en disco
- WHEN se aplica la migración a v1.1.0
- THEN `funcional/` pasa a `capabilities/`, `legado.md` a `legacy.md` y `changelog-cliente.md` a `client-changelog.md`, con gate por ser rename masivo
- AND si el proyecto no tiene `funcional/`, el paso se salta y se dice — la migración es idempotente
- AND los nombres de capacidad en castellano se presentan al dev-lead con su propuesta en inglés: el sustantivo del dominio es suyo, no del kit

**Reglas de la capacidad**
- **Dónde viven los datos**: las migraciones viven en `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto.
- **Idioma de los nombres**: los nombres que una migración crea o renombra en el proyecto van en inglés kebab-case.

### La migración a v1.2.0 pregunta el modo de ids
- GIVEN un proyecto que migra a v1.2.0 y cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el paso es un **gate**: presenta los dos modos al dev-lead y escribe su respuesta
- AND si el dev-lead no está, el paso queda pendiente explícito y el proyecto sigue funcionando en `tracker`

### La migración a v1.2.0 pregunta las claves de control que faltan
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile`, un bloque `merge` completo o las claves de frenos (`control.maxParallelAgents`, `control.silence.*`)
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el agente hace, una por turno, las preguntas del bloque de `control-profiles.md` que corresponden a lo que falta, las mismas que hace la init, y escribe solo lo que responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con los defaults y con el paso 10 del cierre preguntando el merge, y el informe dice cómo reanudarlo

## Historial

- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED El proyecto declara la versión del kit que tiene
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED Cada release con cambio estructural lleva su migración
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED Un proyecto ya inicializado se migra, no se re-inicializa
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED El `funcional.md` heredado se conserva como legado
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED La copia local del script de estimación se retira
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — MODIFIED Un proyecto ya inicializado se migra, no se re-inicializa
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — MODIFIED El `funcional.md` heredado se conserva como legado
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — ADDED Un proyecto que ya migró a v1.0.0 recibe el rename por `v1.1.0.md`
- 2026-09-20 — 20260920-202137-task-0001-task-ids — MODIFIED El proyecto declara la versión del kit que tiene
- 2026-09-20 — 20260920-202137-task-0001-task-ids — ADDED La migración a v1.2.0 pregunta el modo de ids
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — ADDED La migración a v1.2.0 pregunta las claves de control que faltan
- 2026-09-22 — 20260922-141616-task-0020-init-control-keys — MODIFIED La migración a v1.2.0 pregunta las claves de control que faltan
