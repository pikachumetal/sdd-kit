# Misión — statusline

## Por qué existe

Statusline personalizada para Claude Code: sustituye la línea de estado por defecto mostrando el modelo activo, la rama git y el coste de la sesión en una sola línea.

## Usuarios y roles

- **Desarrollador que usa Claude Code**: consume la línea de estado en su terminal/IDE.

## Qué es y qué no es

- **Es**: un script Node ejecutable que Claude Code invoca pasándole el JSON de la sesión por stdin, y que imprime una línea formateada por stdout.
- **No es**: un plugin de Claude Code, un servicio persistente, ni una herramienta de configuración de statuslines de terceros.

## Dominio (lenguaje del proyecto)

- **Statusline**: línea de estado que Claude Code renderiza, generada ejecutando este script con el JSON de la sesión por stdin.
- **input.model**: objeto de la sesión con el modelo activo (se usa `display_name`).
- **input.workspace.current_dir**: directorio de trabajo actual de la sesión, usado para resolver la rama git.
- **input.cost.total_cost_usd**: coste acumulado de la sesión en USD.
