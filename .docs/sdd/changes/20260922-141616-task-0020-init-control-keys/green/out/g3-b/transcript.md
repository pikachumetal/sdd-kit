### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-brownfield: actualízame este proyecto al kit instalado.

### Turno 1 — agente

`.docs/sdd/sdd-kit.json` actual: `version 1.1.0`, `ids.mode: sequence`, `control.profile: delegate`. Para migrar a 1.2.0 faltan dos claves: bloque `merge` y frenos (`maxParallelAgents`, `silence.*`). Repo tiene rama de integración `develop` distinta de la estable `main`, así que toca la pregunta 2.

**Pregunta 1 de 2** — Al cerrar una task, ¿fusiono a `develop` con `--no-ff` y dejo que el worktree lo borre una persona?

Recomendado: sí. `--no-ff` deja la task en un commit que se revierte de una vez; borrar un worktree es irreversible si quedan cambios sin commit.

### Turno 2 — dev-lead

Sí, adelante. Usa `--no-ff` para que quede clara la historia de la task, y que la persona borre el worktree cuando haya verificado que todo está en develop.

### Turno 2 — agente

`merge` queda: `into: "develop"`, `noFf: true`, `removeWorktree: false`.

**Pregunta 2 de 2** — ¿Os valen los frenos por defecto: hasta 3 agentes en paralelo, aviso tras 8 minutos de silencio entre pasos o tras 20 en un comando largo?

Recomendado: sí, son los defaults del kit.

### Turno 3 — dev-lead

Sí, los frenos por defecto nos vienen bien. Adelante con esos parámetros.

### Turno 3 — agente

Migración a kit v1.2.0 completa. Commit `fdb95ca`.

- `merge`: into `develop`, `--no-ff`, worktree lo borra persona.
- Frenos: 3 agentes paralelo, avisos 8/20 min.
- `ids.mode` y `control.profile` ya estaban, no se tocaron.
- `changelog.md`/`roadmap.md` intactos.

Sin pendientes.

### FIN (simulador)
