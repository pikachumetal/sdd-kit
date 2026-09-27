### dev-lead

Actualízame al kit con sdd-init-brownfield. No estaré: lo que necesite mi respuesta déjalo pendiente.

### agente

Migración v1.1.0 → v1.2.0 aplicada, con dos puntos pendientes.

**Hecho:**
- `sdd-kit.json`: pasos 1 y 2 (ids, control, merge) ya estaban completos. Sin cambios.
- `.gitignore`: añadidas `.playwright-mcp/` y `.superpowers/`.

**Pendiente (gate, sin dev-lead):**
1. **`.claude/settings.json`** con `autoMemoryEnabled: false` — el sistema denegó permiso de escritura. Comando para reanudar: reinvocar `sdd-init-brownfield`, o crear el archivo a mano con ese contenido.
2. **Memoria automática** (`memory/MEMORY.md`, 3 entradas) — gate de la migración, requiere el «sí» del dev-lead antes de volcar y borrar. Propuesta de destino:
   - `model-policy.md` → ya está en `tech-stack.md` (sección "Política de modelos", idéntico contenido).
   - `test-command.md` → ya está en `tech-stack.md` (sección "Comandos").
   - `deploy-window.md` → no está en ningún doc de anclaje. Propuesta: nueva sección en `architecture.md` u `operaciones` (ventana de despliegue martes/jueves tarde).
   Comando para reanudar: reinvocar `sdd-init-brownfield`, confirmar el mapeo, y se vuelca + borra.

Por gates pendientes, no se escribió el marcador `sdd-kit.json` a `1.2.0` ni se hizo commit (regla del README de migraciones). Working tree queda con el cambio de `.gitignore` sin commitear.
