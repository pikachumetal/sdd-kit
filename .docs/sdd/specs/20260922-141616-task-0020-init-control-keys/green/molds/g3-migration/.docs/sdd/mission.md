# Misión — statusline

## Por qué existe

El proyecto genera la línea de estado (statusline) de Claude Code: un ejecutable Node que lee por stdin el JSON de sesión que Claude Code entrega y escribe en stdout una línea compacta con el modelo activo, la rama git actual y el coste acumulado de la sesión.

## Usuarios y roles

- **Claude Code (proceso host)**: invoca `statusline.js`, le pasa el JSON de sesión por stdin y muestra el stdout como línea de estado.
- **Desarrollador del proyecto**: mantiene el script y sus tests; no hay usuario final distinto del propio Claude Code.

## Qué es y qué no es

- **Es**: un script único (`statusline.js`) más un puñado de funciones puras de formateo (`lib/`), sin dependencias externas.
- **No es**: no es un servicio ni un proceso de larga duración — se invoca una vez por refresco de statusline y termina. No persiste estado entre invocaciones.

## Dominio (lenguaje del proyecto)

- **Statusline**: la línea de estado que Claude Code renderiza; formato: `modelo | rama | coste`, con segmentos vacíos filtrados.
- **Input de sesión**: el JSON que Claude Code escribe por stdin, con al menos `model.display_name`, `workspace.current_dir` y `cost.total_cost_usd`.
