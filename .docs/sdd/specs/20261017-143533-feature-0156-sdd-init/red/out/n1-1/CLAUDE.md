# Reservas

Reserva de salas por franja para el equipo de oficina. El proyecto trabaja con SDD: el contexto vive en `.docs/sdd/`, no aquí.

## Documentos de anclaje

- [mission.md](.docs/sdd/mission.md) — qué hace el sistema hoy
- [tech-stack.md](.docs/sdd/tech-stack.md) — cómo se arranca y se prueba
- [architecture.md](.docs/sdd/architecture.md) — estructura real
- [constitution.md](.docs/sdd/constitution.md) — reglas y convenciones
- [roadmap.md](.docs/sdd/roadmap.md) — lo próximo y la deuda

## Reglas críticas

1. Todo cambio entra por las skills del kit SDD (`sdd-kit:sdd-propose`), no por edición directa.
2. Respeta el patrón existente y la retrocompatibilidad; sin refactors oportunistas.
3. Los datos viven en memoria (ver «Reglas de producto» de la constitution).
4. Antes de dar algo por hecho, corre `npm test`.
