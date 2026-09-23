# Capacidad — config

## Requisitos

### Valores por defecto sin fichero de configuración

- GIVEN que no existe `~/.pomodororc`
- WHEN se carga la configuración
- THEN se devuelven los valores por defecto (25/5/15 minutos, series de 4, sin horas de silencio)

### Fusión de la configuración guardada con los defaults

- GIVEN que existe `~/.pomodororc`
- WHEN se carga la configuración
- THEN se combina con los defaults y se valida cada duración en minutos

### Validación de minutos fuera de rango

- GIVEN una duración de trabajo o descanso a guardar o cargar
- WHEN no es un entero entre 1 y 120
- THEN se lanza un error y no se persiste el cambio

### Actualización parcial por comando `config`

- GIVEN cambios `clave=valor` pasados a `pomo config`
- WHEN se guardan
- THEN se fusionan sobre la configuración actual, se validan y se escriben en `~/.pomodororc`

## Reglas de la capacidad

- **Dónde viven los datos**: fichero `~/.pomodororc` (JSON) en el home del usuario
- **Idioma de los nombres**: claves en inglés camelCase (`workMinutes`, `shortBreakMinutes`, `longBreakMinutes`, `pomodorosPerSet`, `quietHours`)
- **Límites**: minutos entre 1 y 120 (entero)
- **Avisos**: no aplica
- **Regla ante conflicto**: el valor guardado en `~/.pomodororc` prevalece sobre el default; el cambio explícito de `pomo config` prevalece sobre el valor guardado
