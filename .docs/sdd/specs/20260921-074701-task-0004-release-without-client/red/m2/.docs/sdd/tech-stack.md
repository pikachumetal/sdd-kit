# Tech Stack — salas

- Node 22. Entrada: `src/app.js`. La versión vive en `package.json`.
- Tests: `npm test` (`node --test`).
- **Versión**: se cambia siempre con `node scripts/set-version.mjs <X.Y.Z>`, que actualiza `package.json` y la cabecera de `src/app.js`. No se edita a mano.
- Git: git-flow (`main`, `develop`, `feature/<id>`).
