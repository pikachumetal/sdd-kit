# Copiar el molde falla con `ENOENT`

Al arrancar el segundo sujeto, `cp` dio `ENOENT: no such file or directory` sobre `node_modules\.pnpm\vitest@3.2.4\node_modules\vitest\dist\chunks\runner.js`, y el fichero existe en el molde. Sucede solo en la copia que cuelga del scratchpad de la sesión de la feature 0044, cuyo nombre de worktree es largo: la ruta de destino pasa de 260.

Perdí 40 minutos mirando permisos y Defender. Con la copia colgando de `D:\r` no falla.
