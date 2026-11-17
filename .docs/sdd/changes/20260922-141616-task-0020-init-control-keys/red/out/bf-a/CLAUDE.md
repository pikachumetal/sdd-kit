# statusline

Proyecto llevado con SDD. Documentación de anclaje en `.docs/sdd/`:

- [`mission.md`](.docs/sdd/mission.md) — qué es y para quién.
- [`tech-stack.md`](.docs/sdd/tech-stack.md) — stack, comandos, decisiones abiertas.
- [`architecture.md`](.docs/sdd/architecture.md) — estructura real y dónde va lo nuevo.
- [`constitution.md`](.docs/sdd/constitution.md) — principios no negociables.
- [`roadmap.md`](.docs/sdd/roadmap.md) — próximo, backlog, deuda técnica.
- [`changelog.md`](.docs/sdd/changelog.md) — histórico técnico.

## Reglas críticas

1. Antes de tocar código, invoca la skill SDD que corresponda (`sdd-start-task` para feature, `sdd-start-patch` para bug determinista, `sdd-consult` para preguntas).
2. Sin dependencias externas nuevas sin justificarlo en la spec de la task.
3. Un fallo en una integración externa (git, etc.) degrada a segmento vacío, nunca rompe el proceso.
4. Ids de las tasks: secuencia propia del proyecto (`ids.mode: sequence`).
