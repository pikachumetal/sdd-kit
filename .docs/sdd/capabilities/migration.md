# Capacidad — migracion

Verdad viva del comportamiento observable de la migración de un proyecto consumidor entre versiones del kit: cómo declara la versión que tiene, qué escribe cada release del kit y qué hace «actualízame al kit». La declaró la spec de la task `migracion-consumidores` (T10) en sus «Decisiones a validar» (decisión 1). El procedimiento detallado vive en `skills/sdd-init-brownfield/references/migrations/README.md`.

## Requisitos

### El proyecto declara la versión del kit que tiene
- GIVEN un proyecto inicializado con `sdd-init-greenfield` o `sdd-init-brownfield`
- WHEN termina la inicialización
- THEN existe `.docs/sdd/sdd-kit.json` con `version`, `channel` y `updated`

### Cada release con cambio estructural lleva su migración
- GIVEN una release del kit que cambia la estructura de `.docs/sdd/` o retira algo del proyecto
- WHEN se cierra la release
- THEN existe `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos verificables por predicado

### Un proyecto ya inicializado se migra, no se re-inicializa
- GIVEN un proyecto con `.docs/sdd/` y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-init-brownfield`
- THEN lee `sdd-kit.json` (o asume anterior a v0.2.0 si no existe), aplica en orden las migraciones posteriores a esa versión hasta la mayor disponible, con gate por fichero, y escribe el marcador al final
- AND no regenera los documentos de anclaje ni vuelca `funcional/`

### El `funcional.md` heredado se conserva como legado
- GIVEN un proyecto con `funcional.md`
- WHEN se aplica la migración a v1.0.0
- THEN el fichero pasa a `funcional/legado.md` con una nota de excepción temporal, y ninguna capacidad se crea de golpe

### La copia local del script de estimación se retira
- GIVEN un proyecto con `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/Build-EstimationLog.ps1`
- WHEN se aplica la migración a v1.0.0
- THEN se borra la copia, se regenera `estimation-log.md` con el script del kit y el diff del log se presenta al dev-lead antes de commitear

## Historial

- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED El proyecto declara la versión del kit que tiene
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED Cada release con cambio estructural lleva su migración
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED Un proyecto ya inicializado se migra, no se re-inicializa
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED El `funcional.md` heredado se conserva como legado
- 2026-09-09 — 20260909-105650-task-0000-migracion-consumidores — ADDED La copia local del script de estimación se retira
