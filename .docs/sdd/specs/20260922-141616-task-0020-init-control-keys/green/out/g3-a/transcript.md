### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-brownfield: actualízame este proyecto al kit instalado.

### Turno 1 — agente

`control.profile` ya está fijado (`delegate`), así que esa pregunta se salta. Quedan dos preguntas pendientes del bloque de claves de control, una por turno.

**Pregunta 2 de 2 (merge):** al cerrar una task, ¿fusiono a `develop` (rama de integración vista en el repo) con `--no-ff` y dejo que el worktree lo borre una persona?

Recomendado: sí — `--no-ff` deja la task en un commit reversible de una vez, y borrar un worktree es irreversible si quedan cambios sin commit.

### Turno 2 — dev-lead

Sí, adelante. Fusiona a `develop` con `--no-ff` y que borre el worktree el que lo creó — así queda todo traceable.

### Turno 2 — agente

Anotado: `merge.into: "develop"`, `merge.noFf: true`, `merge.removeWorktree: false`.

**Pregunta 3 de 2 (frenos):** ¿valen frenos por defecto — hasta 3 agentes en paralelo, aviso tras 8 minutos de silencio entre pasos o tras 20 en comando largo?

Recomendado: sí, son los defaults del kit.

### Turno 3 — dev-lead

Sí, adelante con los frenos por defecto. Son los que necesitamos.

### Turno 3 — agente

Proyecto migrado v1.1.0 → v1.2.0. Commit `bf985b1`.

- `ids.mode: sequence` ya estaba, sin cambio.
- `control.profile: delegate` ya estaba, sin cambio.
- Nuevo: frenos por defecto (3 agentes paralelos, aviso 8min/20min) y `merge` a `develop` con `--no-ff`, borrado de worktree manual.
- Sin gates pendientes. `changelog.md` y `roadmap.md` intactos.

### FIN (simulador)
