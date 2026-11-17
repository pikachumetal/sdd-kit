# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Git: git-flow (`main`, `develop`, `feature/<id>`).
- Almacén de reservas en memoria, por proceso. Workaround: los tests corren con `--test-concurrency=1` para no pisarse sobre él; ver su fila en la deuda técnica de `roadmap.md`.
