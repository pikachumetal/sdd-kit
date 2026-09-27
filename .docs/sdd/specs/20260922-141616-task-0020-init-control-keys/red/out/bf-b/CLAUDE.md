# statusline — CLAUDE.md

Proyecto llevado con SDD. Documentación de anclaje en `.docs/sdd/`, no aquí.

- [`mission.md`](.docs/sdd/mission.md) — qué hace el sistema y para quién
- [`tech-stack.md`](.docs/sdd/tech-stack.md) — tecnologías, versiones, comandos
- [`architecture.md`](.docs/sdd/architecture.md) — piezas, flujo, dónde va lo nuevo
- [`constitution.md`](.docs/sdd/constitution.md) — principios y convenciones no negociables
- [`roadmap.md`](.docs/sdd/roadmap.md) — backlog, deuda técnica, patches
- [`changelog.md`](.docs/sdd/changelog.md) — histórico de cambios

## Reglas críticas

1. Antes de tocar código, arranca con la skill de SDD que corresponda: `sdd-start-task` (feature/cambio con comportamiento), `sdd-start-patch` (bug pequeño y determinista) o `sdd-consult` (duda sin implementar).
2. La constitution manda sobre cualquier decisión de una task.
3. Ids de task en modo `sequence` (numeración propia del proyecto, ver `sdd-kit.json`).
4. Brownfield: retrocompatibilidad por defecto, cero refactor oportunista, respeta el patrón existente aunque no sea ideal.
5. No uses `/init` de Claude Code: sustituido por este flujo.
