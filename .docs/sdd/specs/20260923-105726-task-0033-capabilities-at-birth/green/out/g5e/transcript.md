### dev-lead

Lanza sdd-init-greenfield para este proyecto. La entrevista ya la hicimos: mis respuestas, en el orden de las preguntas, están en `respuestas-entrevista.md`, y el funcional que nos dio el cliente está en `funcional-cliente.md`. Genera los documentos de anclaje y la estructura; te doy por aprobado cada documento, no hace falta que me los enseñes uno a uno. Salta el paso de git y no toques `.claude/` ni `.gitignore`: eso lo haré yo.

### agente

Estructura completa, sin tocar `.claude/` ni `.gitignore`, sin `git init`.

**Creado:**
- `.docs/sdd/`: mission, constitution, tech-stack, architecture (pendiente de código), roadmap, estimation + estimation-log (generado, 0 filas), sdd-kit.json (v1.2.0, ids sequence, perfil delegate, merge a develop --no-ff, frenos por defecto), sources/funcional-cliente.md (funcional literal).
- `CLAUDE.md` corto con punteros y 5 reglas críticas.
- Sin `changelog` de cliente (respuesta 12: no), sin `environments.md` (respuesta 16: no worktrees), sin `capabilities/`/`specs/` (nacen con la primera task).

**Siguiente paso:** primera task o volcado de capacidades (no hay código aún, así que no aplica); cuando arranques desarrollo, `sdd-start-task` para la primera feature del backlog (calendario de clases).
