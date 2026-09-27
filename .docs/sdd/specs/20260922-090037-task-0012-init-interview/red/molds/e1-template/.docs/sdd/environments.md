# Entornos por worktree — reservas

Cada worktree levanta su PostgreSQL en Docker con puerto derivado del nombre de la rama.

- `moon run :env-setup` crea la BD y escribe `.sdd-env.json`.
- `moon run :env-clean` la borra.
- `moon run :env-preflight` comprueba Docker y puertos.
