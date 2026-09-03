# Roadmap — sdd-kit

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Estreno real: instalar en un proyecto del equipo y ciclar las primeras tareas | 🔄 en curso — feedback devuelto al kit: carril release, fuente única de plantillas, rename hotfix→patch, modo lite (v0.4.0–v0.5.0). En v0.5.0 el bucle se cerró desde dentro: una consulta destapó la referencia rota a `grilling` y la ausencia de declaración de dependencias |
| 2 | Recorte de skills largas (`sdd-start-task` 1403→<500 palabras) con re-test Art. I | ⏳ backlog — REFACTOR con ciclo propio; **más urgente tras la task modo-lite**, que la engordó un 45% |
| 3 | Compatibilidad con Claude Code y dependencias — ~~`grilling` referenciada como `superpowers:grilling`~~ ✅ ([patch 20260902-153722](specs/20260902-153722-patch-0000-grilling-reference/patch.md)) · ~~declaración de dependencias~~ ✅ ([task dependencias-declaradas](specs/20260902-160308-task-0000-dependencias-declaradas/walkthrough.md)): `plugin.json` declara `superpowers` cross-marketplace y el README es la fuente única. Queda **solo** un pendiente: las referencias a "crea un todo por paso" en 8 skills, tras la retirada de TodoWrite por defecto (Claude Code v2.1.233) | ⏳ parcial — alcance acordado con el usuario el 2026-09-02 |

## Backlog

- Kit de nivel 2 (skills técnicas parametrizadas por stack: sql-migration, backend-command/query, backend-feature, frontend-feature) — decisión pendiente: ¿segundo plugin o carpetas por stack en este?
- Script `Build-EstimationLog.ps1` genérico distribuible con el kit (hoy cada proyecto lleva el suyo).
- **`funcional.md` vivo con delta specs** (idea tomada de [OpenSpec](https://openspec.dev)) — hoy el kit declara `funcional.md` en cuatro sitios (`sdd-init-greenfield` lo crea, `sdd-start-task` y `sdd-consult` lo leen) pero **ninguna skill lo escribe**: `sdd-end-release` delega en "su dueño". Un documento que se lee en cada task y no se actualiza en ninguna deriva hasta volverse mentira. Propuesta: la spec lleva su delta funcional (`ADDED` / `MODIFIED` / `REMOVED`) y `sdd-end-task` lo fusiona en el cierre. Cambio de convención → Art. IV: spec dedicada.
- **Dos ideas baratas de OpenSpec para `spec-template.md`**: el quick test de qué NO va en una spec (*"si la implementación puede cambiar sin cambiar el comportamiento observable, no va en la spec"*) y escenarios GIVEN/WHEN/THEN con RFC 2119, que darían al smoke de `sdd-end-task` algo contra lo que verificar en vez de prosa.

## Deuda técnica

| Ítem | Impacto |
| --- | --- |
| `sdd-start-task` con **1403 palabras** (eran 965; la task modo-lite añadió el predicado, el override y dos racionalizaciones). Guía: <500 para skills de carga frecuente; recortar exige re-test (Art. I) | Medio — la deuda crece cada vez que se le añade guidance |
| El override sobre la clasificación de `brainstorming` está escrito pero **no probado**: el GREEN no pudo demostrar que fuera él quien evitó el fallo. Vigilar en la próxima task que lo atraviese | Bajo |
| `.docs/sdd/templates/` sigue existiendo en este repo pese al Art. VIII (fuente única en `skills/sdd-templates/templates/`) | Bajo — residuo, ninguna skill lo lee |
| ~~El propio kit aún no ha ciclado ninguna tarea con su flujo~~ — saldada: la task del carril release (20260721) cicló spec → plan → RED/GREEN → cierre | — |
| El método de test no sabe montar un entorno **sin** una skill: el staging por renombrado la hace ininvocable, no ausente (task dependencias-declaradas). Limita lo que se puede probar de cualquier degradación | Medio |
| Sin CI que valide frontmatter/estructura de las skills | Bajo |

## Decisiones tomadas

- **Distribución: local-only** (2026-09-02). El kit se instala apuntando a la ruta local del repo y lo usa el dev-lead; no se configura remoto hasta que la empresa decida distribuirlo al equipo. Cierra el action item A2-ter, arrastrado desde v0.1.0. Consecuencia asumida: v0.2.0–v0.5.0 quedan cerradas y no distribuidas, y `claude plugin tag --push` no aplica. → [acta v0.5.0](releases/v0.5.0/feedback.md)

## Decisiones pendientes

- Dónde se aloja el repo el día que la empresa quiera distribuirlo (GitHub / Azure DevOps / interno).
- ¿Changelog de cliente además del técnico? (por ahora solo técnico).

## Releases cerradas

### v0.5.0 — 2026-09-02

Modo lite del carril task + declaración de dependencias del kit (manifest cross-marketplace y README como fuente única) + la referencia rota a `grilling`. **Cerrada, no distribuida** — por decisión, no por olvido: el kit es local-only. [Release notes](releases/v0.5.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.5.0/feedback.md).

### v0.4.0 — 2026-07-22

Rename del carril `hotfix`→`patch` + override de worktrees neutral en `sdd-start-task`. **Cerrada pero no distribuida**: sin remoto configurado, no llega a los consumidores vía `/plugin marketplace update`. [Release notes](releases/v0.4.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.4.0/feedback.md).

### v0.3.0 — 2026-07-21

Carril consult (`sdd-consult`). [Release notes](releases/v0.3.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.3.0/feedback.md).

### v0.2.0 — 2026-07-21

Carril release (`sdd-start-release`, `sdd-end-release`) + fuente única de plantillas. [Release notes](releases/v0.2.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.2.0/feedback.md).

### v0.1.0 — 2026-07-09

Las 7 skills de proceso iniciales + plantillas + manifests. Sin acta (el carril release no existía).

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-02 | [20260902-153722-patch-0000-grilling-reference](specs/20260902-153722-patch-0000-grilling-reference/patch.md) | `sdd-consult` invocaba `superpowers:grilling`, nombre que no resuelve. Corregido a `grilling`. |
