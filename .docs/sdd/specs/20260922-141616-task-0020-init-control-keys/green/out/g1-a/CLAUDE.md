# statusline — CLAUDE.md

Proyecto llevado con SDD. Documentación de anclaje en `.docs/sdd/`:

- **Qué y para quién**: `.docs/sdd/mission.md`
- **Stack y comandos**: `.docs/sdd/tech-stack.md`
- **Estructura y flujo**: `.docs/sdd/architecture.md`
- **Principios y convenciones**: `.docs/sdd/constitution.md`
- **Deuda y próximos pasos**: `.docs/sdd/roadmap.md`
- **Config del kit**: `.docs/sdd/sdd-kit.json`

## Reglas críticas

1. Sin dependencias externas — solo Node built-in.
2. CommonJS (`require`/`module.exports`); no introducir `"type": "module"` sin decisión registrada.
3. Perfil de control: `delegate` (para en spec, desvíos y validación).
4. Cambio de comportamiento → sigue el flujo SDD (`sdd-start-task` / `sdd-start-patch`), no edición directa.
