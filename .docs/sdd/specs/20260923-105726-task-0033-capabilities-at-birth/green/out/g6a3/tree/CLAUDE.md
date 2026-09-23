# pomodoro-cli — punteros

Proyecto anclado con SDD. Contexto largo vive en `.docs/sdd/`, no aquí:

- [`mission.md`](.docs/sdd/mission.md) — qué es y para quién
- [`tech-stack.md`](.docs/sdd/tech-stack.md) — versiones, comandos, política de tests
- [`architecture.md`](.docs/sdd/architecture.md) — estructura real, dónde va lo nuevo
- [`constitution.md`](.docs/sdd/constitution.md) — principios y convenciones (propuestas a confirmar)
- [`roadmap.md`](.docs/sdd/roadmap.md) — backlog, deuda técnica, releases
- [`changelog.md`](.docs/sdd/changelog.md) — historial de cambios
- [`sdd-kit.json`](.docs/sdd/sdd-kit.json) — configuración del kit (perfil de control `delegate`, merge a `develop`)

## Reglas críticas

1. Sin tests todavía pese a `npm test` declarado — antes de tocar `src/`, mira la deuda técnica en `roadmap.md`.
2. Sin dependencias de producción: no añadir una sin justificarlo (ver `constitution.md`).
3. Persistencia en ficheros planos del home (`~/.pomodororc`, `~/.pomodoro-history.json`) — mantener ese patrón para datos nuevos.
4. `main` es la rama estable; `develop`, la de integración. El merge a `main` siempre lo decide una persona.
5. Para arrancar una task o patch nuevo, usa las skills `sdd-kit:*` (`sdd-start-task`, `sdd-start-patch`, `sdd-consult`…), no `/init`.
