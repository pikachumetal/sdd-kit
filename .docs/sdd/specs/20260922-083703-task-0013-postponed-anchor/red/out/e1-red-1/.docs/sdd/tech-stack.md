# Tech Stack — salas

- Node 22, sin dependencias externas. Entrada: `src/app.js` (enruta los comandos). Parseo/validación de franjas horarias: `src/slots.js` (`isValidSlot`) — cualquier comando nuevo que reciba una franja debe importarla, no repetir la expresión regular.
- Tests: `node --test` (carpeta `test/`).
- Git: git-flow (`main`, `develop`, `feature/<id>`).
