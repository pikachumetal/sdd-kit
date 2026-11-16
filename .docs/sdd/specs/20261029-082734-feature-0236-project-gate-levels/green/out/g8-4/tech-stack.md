# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Git: git-flow (`main`, `develop`, `feature/<id>`).
- Almacén de reservas en memoria (`src/app.js`): no sobrevive entre invocaciones de la CLI; un smoke que encadene `cancelar` y `canceladas` va en un solo proceso. Comportamiento en [bookings](capabilities/bookings.md).
