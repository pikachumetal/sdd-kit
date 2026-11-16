# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Tests: `node --test --test-concurrency=1`. Workaround de la carrera de los tests sobre el almacén compartido en memoria; la suite tarda el doble. Deuda en [roadmap.md](roadmap.md#deuda-técnica).
- Git: git-flow (`main`, `develop`, `feature/<id>`).
