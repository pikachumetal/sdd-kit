# Capacidad — history

## Requisitos

### Completar un pomodoro de trabajo se registra

- GIVEN que una sesión termina una fase `work`
- WHEN la fase cambia a un descanso
- THEN se añade una entrada `{ at: <timestamp>, minutes: workMinutes }` al historial

### El historial descarta entradas antiguas al registrar

- GIVEN un historial con entradas de más de 90 días respecto al momento de un nuevo registro
- WHEN se registra un pomodoro
- THEN las entradas con más de 90 días se descartan antes de guardar la entrada nueva

### Sin fichero de historial se parte de vacío

- GIVEN que `~/.pomodoro-history.json` no existe
- WHEN se lee el historial
- THEN se devuelve una lista vacía

### Las estadísticas se agrupan por día

- GIVEN un historial de entradas con `at` y `minutes`
- WHEN se piden las estadísticas
- THEN se agrupan por día (`YYYY-MM-DD` en hora local a UTC vía `toISOString`), sumando `pomodoros` y `minutes` por día

## Reglas de la capacidad

- **Dónde viven los datos**: fichero `~/.pomodoro-history.json` (JSON), en el home del usuario
- **Idioma de los nombres**: claves en inglés (`at`, `minutes`, `pomodoros`)
- **Límites**: retención de 90 días (`RETENTION_DAYS`)
- **Avisos**: el comando `pomo stats` imprime una línea por día: `<día>  <pomodoros> pomodoros  <minutos> min`
- **Regla ante conflicto**: no aplica

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
