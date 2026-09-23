# Capacidad — settings

## Requisitos

### Valores por defecto

- GIVEN que no existe el fichero `~/.pomodororc`
- WHEN se carga la configuración
- THEN se usan los valores por defecto (25/5/15 minutos, 4 pomodoros por serie, sin horas de silencio)

### Validación de minutos

- GIVEN un valor de `workMinutes`, `shortBreakMinutes` o `longBreakMinutes`
- WHEN se carga o se guarda la configuración y el valor no es un entero entre 1 y 120
- THEN se lanza un error y no se persiste el cambio

### Actualización parcial vía comando

- GIVEN pares `clave=valor` pasados al comando `pomo config`
- WHEN se ejecuta el comando
- THEN se fusionan con la configuración existente, se valida el resultado y se persiste en `~/.pomodororc`

## Reglas de la capacidad

- **Dónde viven los datos**: fichero `~/.pomodororc` (JSON)
- **Idioma de los nombres**: claves en inglés camelCase (`workMinutes`, `shortBreakMinutes`, `longBreakMinutes`, `pomodorosPerSet`, `quietHours`)
- **Límites**: minutos enteros entre 1 y 120
- **Avisos**: no aplica
- **Regla ante conflicto**: los valores del fichero sobrescriben los valores por defecto; los cambios pasados a `saveConfig` sobrescriben lo ya cargado

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
