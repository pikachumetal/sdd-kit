# gym-bookings

Reservas de clases para un gimnasio, con SDD (`.docs/sdd/`).

## Documentos de anclaje

- [Misión](.docs/sdd/mission.md) — por qué existe, usuarios, dominio.
- [Constitution](.docs/sdd/constitution.md) — principios y reglas de producto, no negociables.
- [Tech Stack](.docs/sdd/tech-stack.md) — .NET 9 + ASP.NET Core, Angular 20, PostgreSQL.
- [Architecture](.docs/sdd/architecture.md) — cómo está construido (pendiente hasta el scaffolding).
- [Roadmap](.docs/sdd/roadmap.md) — qué viene, deuda técnica, patches.
- [Estimation](.docs/sdd/estimation.md) — método y calibración.
- [Changelog](.docs/sdd/changelog.md) — histórico técnico.

## Reglas críticas

- Sin gestor de tickets: los ids de task son secuencia propia (`sdd-kit.json` → `ids.mode: "sequence"`).
- Sin worktrees en este proyecto.
- Perfil de control: `delegate`. Merge a `develop` con `--no-ff`; el borrado del worktree lo hace una persona.
- Toda task o feature nueva pasa por `sdd-kit:sdd-start-task`; bug pequeño y determinista, por `sdd-kit:sdd-start-patch`.
