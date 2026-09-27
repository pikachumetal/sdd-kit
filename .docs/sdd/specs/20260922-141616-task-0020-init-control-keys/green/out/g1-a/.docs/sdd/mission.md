# Misión — statusline

## Por qué existe

Claude Code permite configurar una statusline personalizada que se pinta al pie de la sesión. Este proyecto es esa statusline: recibe por stdin el JSON de estado de la sesión (modelo activo, directorio de trabajo, coste acumulado) y devuelve una línea de texto formateada con esos datos.

## Usuarios y roles

- **Desarrollador que usa Claude Code**: configura `statusline.js` como comando de statusline en su Claude Code y ve, en cada sesión, el modelo activo, la rama git del directorio de trabajo y el coste acumulado.

## Qué es y qué no es

- **Es**: un script Node ejecutable que lee JSON por stdin y escribe una línea de texto por stdout.
- **No es**: no persiste estado, no hace red, no depende de paquetes externos, no es un plugin instalable ni un servidor.

## Dominio (lenguaje del proyecto)

- **Statusline**: la línea de texto que Claude Code pinta al pie de la sesión, generada por este script.
- **Sesión**: el JSON de entrada que Claude Code pasa por stdin, con `model`, `workspace.current_dir` y `cost.total_cost_usd`.
