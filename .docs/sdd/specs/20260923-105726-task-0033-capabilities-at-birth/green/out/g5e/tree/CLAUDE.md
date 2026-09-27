# gym-bookings

Proyecto llevado con el flujo SDD del kit. Documentación de anclaje en `.docs/sdd/`:

- [mission.md](.docs/sdd/mission.md) — por qué existe, usuarios, dominio.
- [constitution.md](.docs/sdd/constitution.md) — principios no negociables y reglas de producto.
- [tech-stack.md](.docs/sdd/tech-stack.md) — tecnologías, comandos, decisiones abiertas.
- [architecture.md](.docs/sdd/architecture.md) — estructura real (crece con cada task).
- [roadmap.md](.docs/sdd/roadmap.md) — backlog, deuda técnica, releases.
- [changelog.md](.docs/sdd/changelog.md) — changelog técnico.

## Reglas críticas

- No inventar nada fuera de estos documentos: constitution manda sobre cualquier spec.
- Sin gestor de tickets: las tasks se numeran en secuencia propia (`sdd-kit.json` → `ids.mode: sequence`).
- Sin worktrees por convenio de este proyecto.
- Perfil de control: `delegate` (para en spec, desvíos y validación; sin gate en el plan).
- Ramas: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
