# Capacidad — notifications

## Requisitos

### Mensaje por fase

- GIVEN una fase de sesión (`work`, `short-break`, `long-break`)
- WHEN se notifica el cambio de fase
- THEN se imprime por salida estándar el mensaje correspondiente a esa fase

### Horas de silencio

- GIVEN un rango de horas de silencio configurado
- WHEN la hora actual cae dentro de ese rango, incluso si el rango cruza la medianoche
- THEN se omite el timbre (BEL) pero se mantiene el mensaje de texto

## Reglas de la capacidad

- **Dónde viven los datos**: no aplica; no persiste nada
- **Idioma de los nombres**: claves de fase en inglés kebab-case (`work`, `short-break`, `long-break`); mensajes al usuario en castellano
- **Límites**: no aplica
- **Avisos**: timbre ASCII BEL salvo en horas de silencio; el mensaje de texto se emite siempre
- **Regla ante conflicto**: no aplica

## Historial

- 2026-09-23 — init — ADDED volcado inicial desde el código
