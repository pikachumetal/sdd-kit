### dev-lead

Actualízame al kit con sdd-init-brownfield. No estaré: lo que necesite mi respuesta déjalo pendiente.

### agente

Sin commit, según lo indicado (gate pendiente).

## Resumen: migración a v1.2.0

Proyecto ya estaba en v1.1.0, con `ids.mode`, `control.*` y `merge` completos (pasos 1 y 2 sin nada que hacer).

**Aplicado (sin gate):**
- `.gitignore`: añadidas `.playwright-mcp/` y `.superpowers/`.

**Pendiente — necesita tu respuesta:**
- `.claude/settings.json` con `"autoMemoryEnabled": false`: permiso de escritura denegado por el hook. Reintentar cuando lo autorices.
- Paso 4 (memoria automática), gate: carpeta `memory/` tiene 3 entradas (`model-policy.md`, `test-command.md`, `deploy-window.md`) indexadas en `MEMORY.md`. Hay que revisar cuál va a qué documento de anclaje antes de volcarlas y borrarlas. No se ha tocado nada.
- Marcador `sdd-kit.json`: sigue en `1.1.0` a propósito — no se escribe versión ni se hace commit mientras quede un gate pendiente.

**Siguiente paso:** reinvocar `sdd-init-brownfield` cuando estés para resolver ambos pendientes y cerrar la migración con su commit.
