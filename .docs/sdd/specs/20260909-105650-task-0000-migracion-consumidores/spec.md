---
id: 20260909-105650-task-0000-migracion-consumidores
task: 0000
title: Migración de proyectos consumidores entre versiones del kit (T10)
mode: full
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Migración de proyectos consumidores entre versiones del kit (T10)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

1. **Capacidad nueva `funcional/migracion.md`** — actualizar un proyecto consumidor al kit instalado es un sustantivo del dominio con comportamiento observable propio.
2. **Marcador `.docs/sdd/sdd-kit.json`** con `{ "version": "X.Y.Z", "channel": "plugin" | "cli", "updated": "YYYY-MM-DD" }` (confirmado en el brainstorming). Lo escriben `sdd-init-greenfield` y `sdd-init-brownfield` al inicializar, y la migración al terminar. **El propio kit lo lleva** (dogfooding): sus skills se aplican a este repo.
3. **Un fichero de migración por versión con cambio estructural**, en `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` (confirmado): pasos verificables por predicado («si existe `funcional.md`…»), sin prosa. Viaja por los dos canales porque va dentro de una skill. Esta task escribe `v0.4.0.md` (hotfix→patch) y `v0.6.0.md` (`funcional/`, `sdd-kit.json`, borrar `.tools/sdd/Build-EstimationLog.ps1` y regenerar el log, `environments.md` opcional). v0.2.0, v0.3.0 y v0.5.0 no tuvieron cambio estructural.
4. **La versión objetivo es la mayor de `migrations/`**, no la del `plugin.json`: el canal CLI no instala el manifest, y el listado de migraciones es lo que hay que aplicar. Sin `sdd-kit.json` se asume anterior a v0.4.0 y se aplican todas en orden.
5. **`funcional.md` heredado no se vuelca ni se borra**: pasa a `funcional/legado.md` marcado «pendiente de trocear por capacidad»; cada task que toque una capacidad saca lo suyo de ahí. Trocearlo de golpe es exactamente el volcado que la regla 4 de `funcional-template` prohíbe. `legado` no es un sustantivo del dominio y se declara excepción temporal en el propio fichero.
6. **La migración la ejecuta `sdd-init-brownfield` por predicado** («si ya existe `.docs/sdd/`, no es onboarding: es migración»), **condicionado al RED**: si el baseline con el fichero de migración delante ya migra bien, no se escribe guidance (aprendizaje de T4/T5: un artefacto bien formado es guidance). Sin skill nueva `sdd-migrate` (decisión 2026-09-07: la unidad es el fichero auxiliar).
7. **El RED/GREEN estrena el método de T9**: sujetos en sesión headless (`claude -p --settings … --plugin-dir <working tree del kit>`), sin pegar skills por prompt. RED = working tree con los ficheros de migración y sin guidance en brownfield; GREEN = con la guidance. Fixture calcada de Alybo en v0.5.0 (`funcional.md`, `.tools/sdd/`, log manual, sin marcador).
8. **Escribir `sdd-kit.json` en `init-*` es receta de forma, no guidance de disciplina** (Art. II): un baseline no puede crear un fichero cuyo contrato no conoce, así que no se mide con RED; se añade a la lista de estructura de las dos skills y se anota como no medido. La constitution del kit (Art. V) fija que toda release con cambio estructural escribe su `migrations/vX.Y.Z.md`.
9. **Alybo y MDT no se migran en esta task**: la fixture del RED es Alybo en corto. Migrarlos de verdad es la primera invocación real, a petición tuya, en sus repos.

## Intent

Cada release del kit ha dejado migraciones al proyecto consumidor que hoy se hacen a mano leyendo el changelog: `hotfix`→`patch` (v0.4.0), `funcional.md`→`funcional/`, `environments.md`, y ahora borrar la copia local de `Build-EstimationLog.ps1` (v0.6.0). Ningún proyecto sabe qué versión del kit tiene, así que ningún agente puede saber desde dónde migra. Se quiere que un consumidor diga «actualízame al kit» y el agente aplique, en orden y con gate, exactamente los pasos que le faltan.

## Scope

- Entra: `sdd-kit.json` (contrato, escritura en `init-*`, en la migración y en el kit); `references/migrations/v0.4.0.md` y `v0.6.0.md`; predicado de migración en `sdd-init-brownfield` (si el RED lo respalda); RED/GREEN con el método headless; `funcional/migracion.md`; Art. V ampliado; mission (glosario); `sdd-templates`/README si procede; changelog.
- No entra: migrar Alybo/MDT; migración de artefactos históricos (specs antiguas, `hotfix.md`: el script ya los lee); skill `sdd-migrate`; fichero de pipeline.

## Approach

El artefacto manda: un fichero de migración por versión, con pasos-predicado que un agente ejecuta y un dev puede verificar, y un marcador que dice desde dónde. La skill que ya recibe «este proyecto existe» (`sdd-init-brownfield`) distingue onboarding de migración por la presencia de `.docs/sdd/`. Primero se mide si con el fichero delante el agente migra bien sin guidance; solo lo que el RED reclame entra en la skill. Cierre con dogfooding: el kit escribe su propio `sdd-kit.json`.

## Delta de comportamiento

### Capacidad: `migracion`

**ADDED — El proyecto declara la versión del kit que tiene**
- GIVEN un proyecto inicializado con `sdd-init-greenfield` o `sdd-init-brownfield`
- WHEN termina la inicialización
- THEN existe `.docs/sdd/sdd-kit.json` con `version`, `channel` y `updated`

**ADDED — Cada release con cambio estructural lleva su migración**
- GIVEN una release del kit que cambia la estructura de `.docs/sdd/` o retira algo del proyecto
- WHEN se cierra la release
- THEN existe `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos verificables por predicado

**ADDED — Un proyecto ya inicializado se migra, no se re-inicializa**
- GIVEN un proyecto con `.docs/sdd/` y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-init-brownfield`
- THEN lee `sdd-kit.json` (o asume anterior a v0.4.0 si no existe), aplica en orden las migraciones posteriores a esa versión hasta la mayor disponible, con gate por fichero, y escribe el marcador al final
- AND no regenera los documentos de anclaje ni vuelca `funcional/`

**ADDED — El `funcional.md` heredado se conserva como legado**
- GIVEN un proyecto con `funcional.md`
- WHEN se aplica la migración a v0.6.0
- THEN el fichero pasa a `funcional/legado.md` con una nota de excepción temporal, y ninguna capacidad se crea de golpe

**ADDED — La copia local del script de estimación se retira**
- GIVEN un proyecto con `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/Build-EstimationLog.ps1`
- WHEN se aplica la migración a v0.6.0
- THEN se borra la copia, se regenera `estimation-log.md` con el script del kit y el diff del log se presenta al dev-lead antes de commitear

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 9 decisiones sin cambios) |
