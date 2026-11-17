### dev-lead

Actualízame al kit con sdd-init-brownfield. No estaré: lo que necesite mi respuesta déjalo pendiente.

### agente

Proyecto ya tenía `.docs/sdd/` en v1.1.0 → tocaba migración, no init. Única migración pendiente: v1.2.0.

**Aplicado:**
- Paso 1 (`ids.mode`): ya era `sequence`. Saltado, nada que hacer.
- Paso 2 (claves de control): `profile`, `maxParallelAgents`, `silence.*` y `merge` ya completos. Saltado.
- Paso 3, parte `.gitignore`: añadidas `.playwright-mcp/` y `.superpowers/`.

**Pendiente (usuario ausente, no me invento respuesta):**
- Paso 3, parte `.claude/settings.json`: no existía, tocaba crearlo con `autoMemoryEnabled: false`. Pidió permiso de escritura que nadie puede conceder ahora. **Pendiente**: crear el fichero con ese contenido.
- Paso 4 (memoria automática), es gate — necesita tu "sí" para volcar y borrar. Tabla:

| Entrada | Destino |
|---|---|
| `model-policy.md` | ya está en `tech-stack.md` |
| `test-command.md` | ya está en `tech-stack.md` |
| `deploy-window.md` (ventana de despliegue martes/jueves) | sin doc todavía — propuesta: sección operaciones/despliegue en `architecture.md` |

Nada se ha borrado de la carpeta de memoria.

- Paso 5 (marcador `sdd-kit.json` → v1.2.0): no escrito a propósito — la migración deja gates pendientes, así que el marcador se queda en `1.1.0` hasta cerrarlos (regla del README de migraciones).
- Sin commit: mismo motivo.

**Para reanudar**: reinvoca `sdd-init-brownfield` sobre este proyecto; resuelve el permiso de `.claude/settings.json`, contesta el "sí" del paso 4, y entonces se escribe el marcador `1.2.0` y se commitea.
