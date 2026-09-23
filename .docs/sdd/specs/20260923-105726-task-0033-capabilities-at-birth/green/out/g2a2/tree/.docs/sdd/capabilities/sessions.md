# Capacidad — sessions

## Requisitos

### Una sesión empieza en fase de trabajo

- GIVEN una configuración con `workMinutes`
- WHEN se crea una sesión nueva
- THEN la sesión arranca en fase `work` con `remainingSeconds = workMinutes * 60` y `paused = false`

### El tiempo restante baja segundo a segundo

- GIVEN una sesión activa y no pausada con `remainingSeconds > 1`
- WHEN transcurre un tick
- THEN `remainingSeconds` baja en 1 y la fase no cambia

### Una sesión pausada no consume tiempo

- GIVEN una sesión con `paused = true`
- WHEN transcurre un tick
- THEN la sesión queda igual

### Agotar el trabajo abre un descanso corto o largo

- GIVEN una sesión en fase `work` con `remainingSeconds <= 1`
- WHEN transcurre un tick
- THEN `completed` sube en 1 y la sesión pasa a `long-break` si `completed % pomodorosPerSet === 0`, si no a `short-break`, con el tiempo restante de esa fase

### Agotar un descanso vuelve a trabajo

- GIVEN una sesión en fase `short-break` o `long-break` con `remainingSeconds <= 1`
- WHEN transcurre un tick
- THEN la sesión pasa a `work` con `remainingSeconds = workMinutes * 60`

### La tecla p alterna pausa

- GIVEN una sesión activa
- WHEN el usuario pulsa `p`
- THEN `paused` invierte su valor y el resto de la sesión no cambia

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, dentro del proceso `pomo start`; no persiste entre ejecuciones
- **Idioma de los nombres**: claves internas (`phase`, `remainingSeconds`, `paused`, `completed`) en inglés
- **Límites**: `workMinutes`, `shortBreakMinutes`, `longBreakMinutes` acotados por la capacidad `settings`; `pomodorosPerSet` sin tope propio
- **Avisos**: no aplica (lo cubre la capacidad `notifications`)
- **Regla ante conflicto**: no aplica

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
