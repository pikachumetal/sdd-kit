# Reservas Gimnasio Norte — guía para Claude

Documentación de anclaje en `.docs/sdd/`: `mission.md`, `constitution.md`, `tech-stack.md`, `architecture.md`, `roadmap.md`, `estimation.md`, `changelog.md`.

## Reglas operativas

- Datos personales de socios solo en la UE (constitution, art. 1).
- Migraciones EF Core versionadas, sin cambios de esquema fuera de una migración (constitution, art. 2).
- Ante conflicto entre calendario y reservas, manda el calendario de recepción (constitution, «Reglas de producto»).
- Ramas: git-flow — `feature/<id>` desde `develop`.
- Sin gestor de tickets: las tasks se numeran con secuencia propia (`sdd-kit.json`, `ids.mode: sequence`).
