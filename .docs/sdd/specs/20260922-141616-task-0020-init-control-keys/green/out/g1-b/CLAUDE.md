# statusline

Proyecto llevado con SDD. Antes de cualquier task, patch o consulta, invoca la skill del kit que corresponda (`sdd-start-task`, `sdd-start-patch`, `sdd-consult`) — ella carga el contexto que hace falta.

## Documentos de anclaje (`.docs/sdd/`)

- [`mission.md`](.docs/sdd/mission.md) — qué hace el proyecto y para quién
- [`tech-stack.md`](.docs/sdd/tech-stack.md) — versiones exactas, comandos, decisiones abiertas
- [`architecture.md`](.docs/sdd/architecture.md) — estructura real y dónde va el código nuevo
- [`constitution.md`](.docs/sdd/constitution.md) — principios y convenciones (marcados como propuesta, pendientes de una segunda confirmación con más código)
- [`roadmap.md`](.docs/sdd/roadmap.md) — próximo, backlog, deuda técnica, patches
- [`changelog.md`](.docs/sdd/changelog.md) — histórico técnico (Keep a Changelog)
- [`estimation.md`](.docs/sdd/estimation.md) / [`estimation-log.md`](.docs/sdd/estimation-log.md) — método y calibración de estimación

## Reglas críticas

1. Sin `package.json`: no añadas una dependencia sin antes resolver la decisión abierta de `tech-stack.md` (Node 22 vs entorno real, y el vestigio de `.gitignore`).
2. Reglas de oro brownfield: retrocompatibilidad por defecto, respeta el patrón existente, cero refactor oportunista, migraciones masivas solo con justificación escrita.
3. `control.profile: delegate` — para en spec, desvíos y validación; sin gate en el plan.
4. Toda task o patch pasa por su skill de `sdd-kit` (`sdd-start-task` / `sdd-start-patch`) y cierra con `sdd-end-task` / `sdd-end-patch`, que actualiza `changelog.md` y `roadmap.md`.
