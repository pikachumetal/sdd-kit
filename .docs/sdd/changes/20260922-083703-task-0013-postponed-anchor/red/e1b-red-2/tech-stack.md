# Tech Stack — salas

- Node 22, sin dependencias externas.
- Tests: `node --test` (carpeta `test/`).
- Git: git-flow (`main`, `develop`, `feature/<id>`).

## Estructura de ficheros

- `src/app.js` enruta los comandos; ya no es el único fichero de código.
- `src/slots.js` — parseo y validación de franjas (`isValidSlot`). Todo comando que reciba una franja
  horaria debe importar `isValidSlot` en vez de repetir la expresión regular.
