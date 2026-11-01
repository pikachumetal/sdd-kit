# Tech Stack — salas

- Node 22, sin dependencias externas. Un solo fichero de entrada: `src/app.js`.
- Git: git-flow (`main`, `develop`, `feature/<id>`).

## Testing

- **Suites**: `node --test` · ~1 s · unitario
- **CI de la base**: `.github/workflows/ci.yml` · `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha`
