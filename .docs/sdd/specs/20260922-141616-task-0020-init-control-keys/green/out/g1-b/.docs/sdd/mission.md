# Misión — statusline

## Por qué existe

Genera la línea de estado (`statusline`) que Claude Code muestra en la CLI. Lee por `stdin` el JSON de la sesión actual y compone una línea legible con modelo activo, rama git del directorio de trabajo y coste acumulado de la sesión, para que el usuario tenga esa información sin salir del terminal.

## Usuarios y roles

- **Usuario de Claude Code**: configura este script como `statusline` en su instalación y lo ve renderizado en cada turno de la CLI.

## Qué es y qué no es

- **Es**: un script Node ejecutable (`statusline.js`) sin dependencias externas, que transforma el JSON de sesión de Claude Code en una línea de texto.
- **No es**: no es un plugin ni una extensión de Claude Code con ciclo de vida propio; no persiste estado entre invocaciones; no gestiona configuración ni instalación (eso lo hace la CLI de Claude Code al apuntar a este script).

## Dominio (lenguaje del proyecto)

- **statusline**: línea de texto que la CLI de Claude Code invoca a este script para generar y muestra en su interfaz.
- **JSON de sesión**: objeto que Claude Code pasa por `stdin` con, entre otros, `model.display_name`, `workspace.current_dir` y `cost.total_cost_usd`.
- **Modelo**: nombre visible del modelo activo en la sesión (`model.display_name`).
- **Coste**: gasto acumulado de la sesión en USD (`cost.total_cost_usd`), formateado a dos decimales.
