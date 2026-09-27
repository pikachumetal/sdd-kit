# reservas — guía para Claude

Documentación de anclaje en `.docs/sdd/`.

## Reglas operativas

- Todas las tareas se lanzan con moon: `moon run frontend:dev`, `moon run backend:dev`, `moon run :test`.
- Nunca `npm install` dentro de `frontend/`: `moon run frontend:install`.
- El entorno de un worktree se prepara con `moon run :env-setup` (ver `.docs/sdd/environments.md`).
- Auth: JWT emitido por el backend; nunca guardar el token en `localStorage`.
- Migraciones EF Core solo con `moon run backend:migrate`.
- Ramas: `feature/<id>` desde `develop`, `hotfix/<id>` desde `main`.
- Tickets: Jira, formato `RES-123`. Las tasks se numeran con el id de Jira (`tracker`).
