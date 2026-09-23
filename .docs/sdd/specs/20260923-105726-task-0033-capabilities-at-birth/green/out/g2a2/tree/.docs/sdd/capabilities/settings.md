# Capacidad — settings

## Requisitos

### Sin fichero de configuración se usan los valores por defecto

- GIVEN que `~/.pomodororc` no existe
- WHEN se cargan las settings
- THEN se devuelven `workMinutes=25`, `shortBreakMinutes=5`, `longBreakMinutes=15`, `pomodorosPerSet=4`, `quietHours=null`

### Las settings guardadas se combinan con los defaults

- GIVEN un `~/.pomodororc` con algunas claves
- WHEN se cargan las settings
- THEN el resultado es el default sobrescrito solo por las claves presentes en el fichero

### Los minutos fuera de rango se rechazan

- GIVEN un valor de `workMinutes`, `shortBreakMinutes` o `longBreakMinutes` que no es entero, o que es menor que 1, o mayor que 120
- WHEN se cargan o se guardan las settings
- THEN se lanza un error con el nombre del campo y el rango válido

### Guardar cambios los persiste y devuelve el resultado

- GIVEN unas settings actuales y un conjunto de cambios válidos (`clave=valor`)
- WHEN se guardan
- THEN se escribe en `~/.pomodororc` la combinación de settings actuales más cambios, y se devuelve ese resultado

## Reglas de la capacidad

- **Dónde viven los datos**: fichero `~/.pomodororc` (JSON), en el home del usuario
- **Idioma de los nombres**: claves en inglés (`workMinutes`, `shortBreakMinutes`, `longBreakMinutes`, `pomodorosPerSet`, `quietHours`)
- **Límites**: minutos entre 1 y 120, enteros
- **Avisos**: el comando `pomo config` imprime el resultado final en JSON
- **Regla ante conflicto**: el valor más reciente guardado gana; no hay merge de conflictos concurrentes

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
