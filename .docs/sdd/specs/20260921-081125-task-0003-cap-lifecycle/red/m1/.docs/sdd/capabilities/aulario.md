# Capacidad — aulario

## Requisitos

### El proyecto arranca con un solo comando
- GIVEN un clon limpio del repositorio
- WHEN el desarrollador ejecuta `docker compose up`
- THEN la API responde en `http://localhost:3000/health` con `200`

### Cada worktree tiene su base de datos
- GIVEN dos worktrees del repositorio abiertos a la vez
- WHEN cada uno arranca la API
- THEN cada uno usa su propio fichero `data/aulario-<worktree>.db`

### Las migraciones se aplican al arrancar
- GIVEN una base de datos con migraciones pendientes
- WHEN arranca la API
- THEN se aplican en orden y se registran en la tabla `migrations`
- AND una migración que falla detiene el arranque con el nombre de la migración

### La suite pasa antes de cada commit
- GIVEN un cambio en `src/`
- WHEN el desarrollador hace commit
- THEN el hook ejecuta `npm test` y rechaza el commit si falla

## Historial

- 2026-09-11 — task 0001 — ADDED El proyecto arranca con un solo comando
- 2026-09-12 — task 0002 — ADDED Cada worktree tiene su base de datos
- 2026-09-12 — task 0002 — ADDED La suite pasa antes de cada commit
- 2026-09-15 — task 0003 — ADDED Las migraciones se aplican al arrancar
