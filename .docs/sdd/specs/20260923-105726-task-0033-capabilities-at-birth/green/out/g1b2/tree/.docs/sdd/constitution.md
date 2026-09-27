# Constitution — pomodoro-cli

## Principios

1. Solo biblioteca estándar de Node: ninguna dependencia de npm.
2. Los datos del usuario viven en su `home` y nunca salen de la máquina.

## Reglas de producto

- **Dónde viven los datos**: `~/.pomodororc` (configuración) y `~/.pomodoro-history.json` (historial).
- **Idioma de los nombres**: código y claves en inglés; mensajes al usuario en castellano.
- **Límites**: duraciones entre 1 y 120 minutos; historial de 90 días.
- **Avisos**: aviso sonoro al cambiar de fase, salvo en horas de silencio.
- **Regla ante conflicto**: no aplica.

## Convenciones

- Ramas: git-flow (`main`, `develop`, `feature/<id>`).
- Proyecto de referencia: no aplica.
