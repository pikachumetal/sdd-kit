# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Git: git-flow (`main`, `develop`, `feature/<id>`).
- Gate de cierre: `node --test --test-concurrency=1`. Workaround: los tests comparten el almacén de reservas en memoria y compiten entre sí; ver la fila de deuda del roadmap (feature 0010).
