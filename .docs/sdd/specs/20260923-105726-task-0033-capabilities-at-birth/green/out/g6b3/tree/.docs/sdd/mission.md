# Misión — pomodoro-cli

## Por qué existe

CLI de terminal para trabajar con el método pomodoro: arranca un temporizador de ciclos trabajo/descanso, avisa por sonido al cambiar de fase y guarda un historial de pomodoros completados. Sin interfaz gráfica ni red: todo vive en la terminal y en el home del usuario.

## Usuarios y roles

- **Usuario de terminal**: ejecuta `pomo start` para trabajar con el temporizador, `pomo stats` para ver su historial y `pomo config` para ajustar duraciones.

## Qué es y qué no es

- **Es**: un temporizador pomodoro de línea de comandos, de un único usuario, con configuración y estadísticas persistidas en ficheros locales.
- **No es**: no tiene interfaz gráfica, no sincroniza en la nube, no es multiusuario, no expone red ni API.

## Dominio (lenguaje del proyecto)

- **Pomodoro**: un ciclo de trabajo (`workMinutes`) completado.
- **Fase**: estado del temporizador — `work`, `short-break` o `long-break`.
- **Serie**: número de pomodoros (`pomodorosPerSet`) tras los que la pausa es larga en vez de corta.
- **Quiet hours**: franja horaria en la que el aviso sonoro se silencia.
