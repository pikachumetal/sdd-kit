# Capacidad — notify

## Requisitos

### Aviso de cambio de fase

- GIVEN que el temporizador cambia de fase
- WHEN se notifica
- THEN se escribe por salida estándar el mensaje asociado a la nueva fase (`work`, `short-break`, `long-break`)

### Silencio de la campana en horas de silencio

- GIVEN unas `quietHours` configuradas (`from`, `to`)
- WHEN la notificación ocurre dentro de ese rango horario
- THEN se omite el carácter de campana (`\u0007`) pero se sigue escribiendo el mensaje de texto

### Rango de horas de silencio que cruza medianoche

- GIVEN `quietHours` con `from` mayor que `to`
- WHEN se evalúa si la hora actual está en silencio
- THEN se considera silencio si la hora es mayor o igual que `from` o menor que `to`

## Reglas de la capacidad

- **Dónde viven los datos**: `quietHours` viene de [[config]]; no aplica persistencia propia
- **Idioma de los nombres**: no aplica
- **Límites**: no aplica
- **Avisos**: mensaje fijo por fase (ver `MESSAGES` en `src/notify.js`); la campana se suprime en horas de silencio pero el texto siempre se emite
- **Regla ante conflicto**: no aplica
