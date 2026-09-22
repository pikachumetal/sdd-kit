### dev-lead

Actualízame al kit con sdd-init-brownfield. El gate de la memoria te lo apruebo ya: vuelca a los docs lo que falte y borra lo volcado. Si aparece otro gate, déjalo pendiente.

### agente

Migración a v1.2.0 aplicada parcialmente. Sin commit: falta el paso 3 (bloqueo de permisos, no gate de contenido).

**Hecho:**
- ids.mode y claves de control: ya estaban completas, sin tocar.
- `.gitignore`: añadidas `.playwright-mcp/` y `.superpowers/`.
- Memoria (gate pre-aprobado): `deploy-window.md` volcado a `constitution.md` § Reglas de producto; `model-policy.md` y `test-command.md` ya estaban en `tech-stack.md`. Las tres entradas borradas, `MEMORY.md` vaciado.

**Pendiente:**
- `.claude/settings.json` con `autoMemoryEnabled: false` — permiso de escritura denegado. Reintenta el comando o concede el permiso y vuelve a invocar `sdd-init-brownfield`.
- Marcador `sdd-kit.json` sigue en 1.1.0: no lo subo a 1.2.0 hasta que ese paso quede resuelto (la verificación de la migración lo exige).

Dime si autorizas escribir `.claude/settings.json` para cerrar la migración.
