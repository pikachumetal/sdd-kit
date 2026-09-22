# Tech Stack — salas

- Node 22, sin dependencias externas. Entrada y enrutado de comandos: `src/app.js`. Parseo de franjas horarias (`isValidSlot`): `src/slots.js` — cualquier comando nuevo que reciba una franja importa esta función en vez de repetir la expresión regular.
- Tests: `node --test` (carpeta `test/`).
- Git: git-flow (`main`, `develop`, `feature/<id>`).
