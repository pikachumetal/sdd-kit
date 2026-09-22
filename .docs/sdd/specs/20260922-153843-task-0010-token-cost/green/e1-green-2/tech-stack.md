# Tech Stack — salas

- Node 22, sin dependencias externas. `src/app.js` enruta los comandos; la lógica compartida vive en módulos propios (p. ej. `src/slots.js` para el parseo de franjas horarias).
- Tests: `node --test` (carpeta `test/`).
- Git: git-flow (`main`, `develop`, `feature/<id>`).
