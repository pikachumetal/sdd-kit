# Misión — pomodoro-cli

## Por qué existe

Temporizador Pomodoro para terminal. Da ciclos de trabajo/descanso (`pomo start`), guarda el histórico de pomodoros completados (`pomo stats`) y deja configurar duraciones y horas de silencio (`pomo config`), todo sin salir de la consola ni depender de red.

## Usuarios y roles

- **Usuario de terminal**: arranca, pausa y consulta sus propios pomodoros desde su máquina.

## Qué es y qué no es

- **Es**: CLI de un solo usuario, con persistencia local en ficheros del home (`~/.pomodororc`, `~/.pomodoro-history.json`).
- **No es**: no tiene interfaz gráfica, no sincroniza entre máquinas ni usuarios, no depende de red ni de servicios externos.

## Dominio (lenguaje del proyecto)

- **Pomodoro**: bloque de trabajo enfocado (`workMinutes`, 25 min por defecto) seguido de un descanso.
- **Fase (phase)**: estado actual del temporizador — `work` · `short-break` · `long-break`.
- **Set**: conjunto de `pomodorosPerSet` pomodoros tras el cual toca descanso largo en vez de corto.
- **Quiet hours**: franja horaria configurable en la que se omite el bell sonoro de la notificación.
