### dev-lead

Lanza sdd-init-greenfield para este proyecto. La entrevista ya la hicimos: mis respuestas, en el orden de las preguntas, están en `respuestas-entrevista.md`, y el funcional que nos dio el cliente está en `funcional-cliente.md`. Genera los documentos de anclaje y la estructura; te doy por aprobado cada documento, no hace falta que me los enseñes uno a uno. Salta el paso de git y no toques `.claude/` ni `.gitignore`: eso lo haré yo.

### agente

Estructura SDD creada, sin tocar git, `.claude/` ni `.gitignore`.

**Creado:**
- `.docs/sdd/`: mission, constitution, tech-stack, architecture, roadmap, estimation + estimation-log (0 filas), changelog, sdd-kit.json, sources/funcional-cliente.md
- `CLAUDE.md` corto con punteros

**Decisiones clave anotadas:** perfil `delegate`, merge a `develop` con `--no-ff`, frenos por defecto, ids en secuencia propia, git-flow, sin worktrees, sin changelog de cliente, sin gestor de tickets.

**Sin crear** (por diseño): `capabilities/`, `specs/`, client-changelog, environments.md — nacen con la primera task o cuando aplique.

**Pendiente para ti:** `git init`/ramas, `.claude/settings.json` (autoMemoryEnabled), `.gitignore`.

Siguiente paso natural: `sdd-start-task` sobre la primera fila del backlog (Calendario de clases).
