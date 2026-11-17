# Capacidad — history

## Requisitos

### Registro de pomodoro

- GIVEN el fin de una fase de trabajo (ver [[sessions]])
- WHEN se registra el pomodoro
- THEN se añade una entrada con marca de tiempo y minutos, descartando las entradas anteriores a 90 días

### Estadísticas por día

- GIVEN un historial de entradas registradas
- WHEN se piden las estadísticas
- THEN se agrupan por día (fecha ISO) con el total de pomodoros y de minutos de ese día

## Reglas de la capacidad

- **Dónde viven los datos**: fichero `~/.pomodoro-history.json` (array JSON)
- **Idioma de los nombres**: claves en inglés (`at`, `minutes`); días en formato ISO (`YYYY-MM-DD`)
- **Límites**: retención de 90 días
- **Avisos**: no aplica
- **Regla ante conflicto**: no aplica

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
