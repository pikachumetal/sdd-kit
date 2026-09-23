### dev-lead

Lanza sdd-init-brownfield en este proyecto. Para las preguntas de la entrevista (ids, perfil de control, merge, frenos, changelog, proyecto de referencia), toma siempre la opción recomendada por defecto sin preguntarme nada. Te doy por aprobado cada documento generado, no hace falta que me los enseñes uno a uno. Salta el paso de git y no toques `.claude/` ni `.gitignore`: eso lo haré yo.

### agente

Todo listo, sin tocar git (queda en tu mano), `.claude/` ni `.gitignore`.

**Onboarding SDD completo — pomodoro-cli**

Documentos en `.docs/sdd/`: `mission.md`, `tech-stack.md`, `architecture.md`, `constitution.md`, `roadmap.md`, `changelog.md`, `estimation.md`, `estimation-log.md`, `sdd-kit.json`. `CLAUDE.md` reducido a punteros. Sin `capabilities/`/`specs/` (nacen con la primera task).

Entrevista, opción recomendada en todo:
- ids: `tracker`
- perfil de control: `delegate`
- merge a `develop`: `--no-ff`, sin auto-borrar worktree
- frenos: defaults (3 agentes paralelo, 8/20 min silencio)
- changelog: sí; client-changelog: no (sin evidencia de entregas a cliente)
- proyecto de referencia: no aplica

Hallazgos del código (no ideal, real):
- `package.json` declara `node --test` pero no hay ningún fichero de test → deuda técnica en roadmap.
- Sin dependencias de producción, sin `engines.node` fijado → decisión abierta en tech-stack.
- Constitution marca convenciones (idioma, ramas, commits) como propuesta: solo un commit de historial, poca base para confirmarlas con certeza.

Siguiente: primera task real usa `sdd-start-task` y ya arranca sobre esta base.
