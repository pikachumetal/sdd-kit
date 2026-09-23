# gym-bookings

Proyecto con flujo SDD. Documentos de anclaje en `.docs/sdd/`:

- [mission.md](.docs/sdd/mission.md) — por qué existe, roles, dominio
- [constitution.md](.docs/sdd/constitution.md) — principios no negociables y reglas de producto
- [tech-stack.md](.docs/sdd/tech-stack.md) — stack y comandos
- [architecture.md](.docs/sdd/architecture.md) — estructura real del sistema
- [roadmap.md](.docs/sdd/roadmap.md) — próximo, backlog, deuda técnica
- [sdd-kit.json](.docs/sdd/sdd-kit.json) — versión del kit y claves de control

## Reglas críticas

- El calendario de recepción manda sobre cualquier reserva en caso de conflicto.
- Datos personales de socios solo en la UE; migraciones siempre versionadas con EF Core.
- Nombres de API y claves en inglés; mensajes al usuario en castellano.
- Sin gestor de tickets: ids de tasks y patches por secuencia propia (`ids.mode: sequence`).
- Sin worktrees: trabajo en el checkout normal del repo.
