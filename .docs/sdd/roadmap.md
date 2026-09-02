# Roadmap — sdd-kit

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | 🔒 Subir a remoto (GitHub / Azure DevOps) — **pospuesto 4ª vez**; bloquea la distribución real de v0.2.0, v0.3.0 y v0.4.0 al equipo | ⏳ pendiente (decisión del usuario) |
| 2 | Estreno real: instalar en un proyecto del equipo y ciclar las primeras tareas | 🔄 en curso — feedback devuelto al kit: carril release, fuente única de plantillas, rename hotfix→patch + override de worktrees neutral (task carril-rama-worktree) y modo lite + invocación explícita de brainstorming (task modo-lite) |
| 3 | Recorte de skills largas (`sdd-start-task` 1403→<500 palabras) con re-test Art. I | ⏳ backlog — REFACTOR con ciclo propio; **más urgente tras la task modo-lite**, que la engordó un 45% |
| 4 | Patch de compatibilidad con Claude Code y dependencias — `grilling` referenciada como `superpowers:grilling` cuando es una skill personal de `mattpocock/skills`; referencias a "crea un todo por paso" tras la retirada de TodoWrite por defecto (Claude Code v2.1.233); `dependencies` con `superpowers ^6.3.0` en `plugin.json` | ⏳ pendiente — alcance acordado con el usuario el 2026-09-02 |

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
| Sin CI que valide frontmatter/estructura de las skills | Bajo |

## Decisiones pendientes

- Remoto y visibilidad (¿repo interno del equipo?).
- ¿Changelog de cliente además del técnico? (por ahora solo técnico).

## Releases cerradas

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
