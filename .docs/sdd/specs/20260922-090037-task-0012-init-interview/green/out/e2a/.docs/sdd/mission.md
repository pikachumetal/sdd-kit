# Mission

## Por qué existe

`statusline` pinta, en una sola línea de la statusline de Claude Code, el modelo activo, la rama git y el coste acumulado de la sesión — sin que el desarrollador tenga que salir de Claude Code para consultarlo.

## Usuarios y roles

Rol único: el desarrollador que ejecuta Claude Code en su propia máquina. Sin roles ni permisos diferenciados. Varias personas pueden usarlo, pero cada una corre su propia instancia, independiente de las demás — no hay estado ni configuración compartida entre usuarios.

## Dominio y módulos

- **Entrada** (`statusline.js`): lee el JSON de sesión que Claude Code pasa por stdin.
- **Formato** (`lib/format.js`): da forma a modelo y coste.
- **Git** (`lib/git.js`): obtiene la rama actual.
- **Orquestador** (`statusline.js`): compone los tres segmentos (modelo · rama · coste) y escribe la línea por stdout.

Sin configuración por usuario ni temas de color: el alcance se mantiene al mínimo — modelo, rama y coste, nada más.
