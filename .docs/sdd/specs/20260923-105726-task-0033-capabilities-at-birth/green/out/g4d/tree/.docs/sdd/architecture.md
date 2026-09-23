# Arquitectura — pomodoro-cli

- `bin/cli.js`: comandos `start`, `stats`, `config`.
- `src/timer.js`: máquina de fases (trabajo, descanso corto, descanso largo).
- `src/config.js`: lectura y validación de `~/.pomodororc`.
- `src/notify.js`: avisos y horas de silencio.
- `src/history.js`: historial y estadísticas por día.
