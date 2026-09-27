# Capacidad — notifications

## Requisitos

### Cada fase tiene un mensaje fijo

- GIVEN una fase (`work`, `short-break`, `long-break`)
- WHEN se notifica el cambio de fase
- THEN se escribe el mensaje correspondiente: "A trabajar: empieza un pomodoro.", "Descanso corto." o "Descanso largo: has completado una serie."

### Fuera de horas de silencio suena una campana

- GIVEN que no hay horas de silencio configuradas, o la hora actual queda fuera del rango `quietHours`
- WHEN se notifica un cambio de fase
- THEN el mensaje se precede del carácter de campana (`\u0007`)

### En horas de silencio no suena la campana

- GIVEN unas `quietHours` con `from`/`to` que cubren la hora actual (el rango puede cruzar medianoche si `from > to`)
- WHEN se notifica un cambio de fase
- THEN el mensaje se escribe sin campana

## Reglas de la capacidad

- **Dónde viven los datos**: `quietHours` viene de la capacidad `settings`; no aplica almacenamiento propio
- **Idioma de los nombres**: mensajes al usuario en castellano; claves internas (`from`, `to`) en inglés
- **Límites**: `quietHours.from` y `quietHours.to` son horas de 0 a 23
- **Avisos**: la salida es siempre por stdout, un mensaje por cambio de fase
- **Regla ante conflicto**: no aplica

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
