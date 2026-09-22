# Tech Stack — salas

- Node 22, sin dependencias externas. Entrada: `src/app.js`, que enruta comandos; `src/slots.js` aporta el parseo de franjas (`isValidSlot`). Cualquier comando que reciba una franja debe importar `isValidSlot` en vez de repetir la expresión regular.
- Tests: `node --test` (carpeta `test/`).
- Git: git-flow (`main`, `develop`, `feature/<id>`).
