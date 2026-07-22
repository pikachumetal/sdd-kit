# Roadmap — sdd-kit

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Subir a remoto (decidir: GitHub / Azure DevOps) para instalación del equipo | ⏳ pendiente |
| 2 | Estreno real: instalar en un proyecto del equipo y ciclar las primeras tareas | 🔄 en curso — primer feedback ya devuelto al kit (carril release, fuente única de plantillas) |
| 3 | v0.4.0: REFACTOR con la fricción del estreno real + pasada de recorte de skills largas (con re-test, Art. I) | ⏳ backlog |

## Backlog

- Kit de nivel 2 (skills técnicas parametrizadas por stack: sql-migration, backend-command/query, backend-feature, frontend-feature) — decisión pendiente: ¿segundo plugin o carpetas por stack en este?
- Script `Build-EstimationLog.ps1` genérico distribuible con el kit (hoy cada proyecto lleva el suyo).

## Deuda técnica

| Ítem | Impacto |
| --- | --- |
| `sdd-start-task` con 965 palabras (guía: <500 para skills de carga frecuente); recortar exige re-test (Art. I) | Bajo — carga bajo demanda |
| ~~El propio kit aún no ha ciclado ninguna tarea con su flujo~~ — saldada: la task del carril release (20260721) cicló spec → plan → RED/GREEN → cierre | — |
| Sin CI que valide frontmatter/estructura de las skills | Bajo |

## Decisiones pendientes

- Remoto y visibilidad (¿repo interno del equipo?).
- ¿Changelog de cliente además del técnico? (por ahora solo técnico).

## Releases cerradas

### v0.3.0 — 2026-07-21

Carril consult (`sdd-consult`). [Release notes](releases/v0.3.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.3.0/feedback.md).

### v0.2.0 — 2026-07-21

Carril release (`sdd-start-release`, `sdd-end-release`) + fuente única de plantillas. [Release notes](releases/v0.2.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.2.0/feedback.md).

### v0.1.0 — 2026-07-09

Las 7 skills de proceso iniciales + plantillas + manifests. Sin acta (el carril release no existía).

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
