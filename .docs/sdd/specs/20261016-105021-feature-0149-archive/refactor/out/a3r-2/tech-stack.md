# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Tests: `node --test --test-concurrency=1`; los tests comparten el almacén en memoria y se pisarían en paralelo (workaround, ver su fila en la deuda técnica del [roadmap](roadmap.md)).
- Git: git-flow (`main`, `develop`, `feature/<id>`).
