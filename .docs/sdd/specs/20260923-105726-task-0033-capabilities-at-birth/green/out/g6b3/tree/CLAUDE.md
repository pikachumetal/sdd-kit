# pomodoro-cli

Proyecto trabajado con SDD (`sdd-kit`). El contexto vive en `.docs/sdd/`, no aquí:

- [`mission.md`](.docs/sdd/mission.md) — qué hace el sistema hoy
- [`tech-stack.md`](.docs/sdd/tech-stack.md) — versiones exactas, comandos, testing
- [`architecture.md`](.docs/sdd/architecture.md) — estructura real y dónde va lo nuevo
- [`constitution.md`](.docs/sdd/constitution.md) — principios y convenciones (propuestas a confirmar)
- [`roadmap.md`](.docs/sdd/roadmap.md) — próximo, backlog y deuda técnica
- [`changelog.md`](.docs/sdd/changelog.md) — historial de versiones

## Reglas críticas

1. Antes de tocar código, lee `architecture.md` y `constitution.md`: el patrón real manda sobre el ideal.
2. Sin dependencias externas: todo con módulos core de Node.js.
3. Toda task o patch sigue el flujo `sdd-kit` (`sdd-start-task` / `sdd-start-patch`), no se improvisa fuera de él.
4. Cero refactor oportunista: una task no reescribe código fuera de su alcance.
