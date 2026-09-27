# Capacidad — timer

## Requisitos

### Ciclo de fases del pomodoro

- GIVEN un temporizador recién creado con la configuración cargada
- WHEN arranca
- THEN empieza en fase `work` con la duración de `workMinutes`

### Transición a descanso corto o largo

- GIVEN que termina una fase `work`
- WHEN se completa el pomodoro número N
- THEN si N es múltiplo de `pomodorosPerSet` pasa a `long-break` con `longBreakMinutes`, si no a `short-break` con `shortBreakMinutes`

### Vuelta a trabajo tras un descanso

- GIVEN que termina una fase de descanso (corta o larga)
- WHEN se agota su tiempo
- THEN vuelve a fase `work` con `workMinutes`, sin incrementar el contador de completados

### Pausa y reanudación

- GIVEN un temporizador en marcha
- WHEN el usuario alterna pausa
- THEN el temporizador congela su cuenta atrás hasta que se alterna de nuevo

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, dentro del proceso (`src/timer.js`); no aplica persistencia
- **Idioma de los nombres**: claves de fase en inglés (`work`, `short-break`, `long-break`)
- **Límites**: minutos de cada fase acotados por la validación de [[config]] (1–120)
- **Avisos**: no aplica (lo cubre [[notify]])
- **Regla ante conflicto**: no aplica
