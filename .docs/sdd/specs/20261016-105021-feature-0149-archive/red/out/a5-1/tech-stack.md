# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Git: git-flow (`main`, `develop`, `feature/<id>`).
- Testing: gate de cierre `node --test --test-concurrency=1`. Los tests comparten el almacén de reservas en memoria (`src/app.js`) y en paralelo se pisan; hasta aislar el almacén por test, se ejecutan en serie.
