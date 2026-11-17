# Capacidad — history

## Requisitos

### Registro de un pomodoro completado

- GIVEN que una fase `work` termina
- WHEN se registra el pomodoro
- THEN se añade una entrada con marca de tiempo y minutos trabajados al historial persistido

### Purga de entradas fuera de retención

- GIVEN el historial existente
- WHEN se registra un nuevo pomodoro
- THEN se descartan las entradas anteriores a 90 días antes de escribir el fichero

### Estadísticas agrupadas por día

- GIVEN el historial persistido
- WHEN se piden estadísticas
- THEN se agrupan por día (`YYYY-MM-DD`) sumando pomodoros y minutos de cada uno

## Reglas de la capacidad

- **Dónde viven los datos**: fichero `~/.pomodoro-history.json` en el home del usuario
- **Idioma de los nombres**: claves en inglés (`at`, `minutes`)
- **Límites**: retención de 90 días
- **Avisos**: no aplica
- **Regla ante conflicto**: no aplica
