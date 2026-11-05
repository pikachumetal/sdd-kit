# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Git: git-flow (`main`, `develop`, `feature/<id>`).

## Testing

- **Suites**: `unit` · `node --test test/app.test.js` · ~1 s · unitario
- `bookings:test` y `rooms:test` · las tareas del gate de cierre · ~1 s · integración
