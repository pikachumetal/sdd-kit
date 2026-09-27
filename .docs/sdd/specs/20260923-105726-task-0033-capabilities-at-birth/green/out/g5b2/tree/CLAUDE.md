# CLAUDE.md — Gimnasio Norte · Reservas de clases

Proyecto llevado con SDD (`sdd-kit`). Documentos de anclaje en `.docs/sdd/`:

- [mission.md](.docs/sdd/mission.md) — por qué existe, usuarios, dominio
- [constitution.md](.docs/sdd/constitution.md) — principios no negociables y reglas de producto
- [tech-stack.md](.docs/sdd/tech-stack.md) — tecnologías, comandos, testing
- [architecture.md](.docs/sdd/architecture.md) — cómo está construido (crece con las tasks)
- [roadmap.md](.docs/sdd/roadmap.md) — backlog, releases, deuda técnica
- [changelog.md](.docs/sdd/changelog.md) — histórico técnico

## Reglas críticas

- Toda task o patch pasa por el flujo `sdd-kit` (`sdd-start-task` / `sdd-start-patch`), no directo.
- Ids de task en secuencia propia (`sdd-kit.json` → `ids.mode: sequence`), no de gestor de tickets.
- Perfil de control `delegate`: para en spec, desvíos y validación; sin gate en el plan.
- Ramas git-flow: `main` estable, `develop` integración, `feature/<id>` desde `develop`. Sin worktrees.
- Datos personales de socios solo en la UE; migraciones siempre versionadas con EF Core.
