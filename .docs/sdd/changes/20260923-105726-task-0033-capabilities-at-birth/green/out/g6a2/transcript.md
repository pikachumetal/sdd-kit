### dev-lead

Lanza sdd-init-brownfield en este proyecto. Te doy por aprobado cada documento, no hace falta que me los enseñes uno a uno. Salta el paso de git y no toques `.claude/` ni `.gitignore`: eso lo haré yo.

### agente

Repo pequeño, inventario hecho: Node.js CLI (`pomo`), sin dependencias, sin tests reales (el script `test` existe pero no hay ficheros de test), config en `~/.pomodororc`, histórico en `~/.pomodoro-history.json`, ramas `main` (estable) y `develop` (integración) distintas.

Antes de generar los documentos necesito tus respuestas a estas preguntas (todas en un turno, tal como pediste):

1. **Ids de tasks**: ¿`tracker` (ids de gestor de tickets) o `sequence` (numeración propia)? Si no sabes, dejo `tracker`.
2. **Perfil de control**: `pair` / `delegate` / `unattended`. Recomiendo `delegate` (para en spec, desvíos y validación; sin gate en el plan).
3. **Merge a `develop`**: ¿`--no-ff` y que una persona borre el worktree después? Recomiendo sí, por lo dicho arriba.
4. **Frenos**: ¿valen los de por defecto (máx. 3 agentes en paralelo, aviso a los 8 min de silencio entre pasos o 20 en comando largo)? Recomiendo sí.
5. **Changelog**: ¿lo llevamos (`changelog.md`)?
6. Si sí a la 5: ¿también novedades de cliente (`client-changelog.md`)?
7. **Proyecto de referencia**: ¿este proyecto replica patrones de otro repo? Si no, dejo "no aplica".
