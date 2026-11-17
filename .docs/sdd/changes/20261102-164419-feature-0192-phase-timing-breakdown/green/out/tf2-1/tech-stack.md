# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Git: git-flow (`main`, `develop`, `feature/<id>`).
- El almacén de reservas vive en memoria, por proceso: lo que una invocación de la CLI guarda no lo ve la siguiente, y los tests comparten ese estado (gate con `--test-concurrency=1`, ver la deuda del roadmap). Persistirlo: 0014.
