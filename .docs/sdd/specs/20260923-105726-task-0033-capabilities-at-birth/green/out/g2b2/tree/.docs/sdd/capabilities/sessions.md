# Capacidad — sessions

## Requisitos

### Ciclo de fases del pomodoro

- GIVEN una configuración con duraciones de trabajo/descanso y pomodoros por serie
- WHEN se completa una fase de trabajo
- THEN la sesión pasa a descanso corto, o a descanso largo si el número de pomodoros completados es múltiplo de `pomodorosPerSet`

### Cuenta atrás por segundo

- GIVEN una sesión en curso con segundos restantes
- WHEN transcurre un segundo y la sesión no está en pausa
- THEN los segundos restantes bajan en uno, y al llegar a cero la sesión avanza a la siguiente fase

### Pausa y reanudación

- GIVEN una sesión en curso
- WHEN el usuario pulsa `p`
- THEN la sesión alterna entre pausada y activa, y mientras está pausada la cuenta atrás no avanza

### Registro de pomodoro completado

- GIVEN que una fase de trabajo termina
- WHEN la sesión pasa a la siguiente fase
- THEN se registra un pomodoro completado con la duración de trabajo configurada (ver [[history]])

### Salida del proceso

- GIVEN una sesión en curso
- WHEN el usuario pulsa `q`
- THEN el proceso termina

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria, en el objeto de la sesión; no persiste entre ejecuciones
- **Idioma de los nombres**: claves de fase en inglés kebab-case (`work`, `short-break`, `long-break`)
- **Límites**: no aplica (las duraciones se validan en [[settings]])
- **Avisos**: no aplica (delegado a [[notifications]])
- **Regla ante conflicto**: no aplica

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
