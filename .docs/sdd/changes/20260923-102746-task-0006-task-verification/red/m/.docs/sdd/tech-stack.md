# Tech Stack — reservas

- **Monorepo con moon**: `frontend/` (Angular 20, signals, tema claro y oscuro con variables CSS) y `backend/` (.NET 9, minimal API, EF Core 9 sobre SQL Server).
- **Comandos**:
  - `moon run frontend:test` — Vitest con jsdom, ~40 s.
  - `moon run frontend:check` — lint y `tsc --noEmit`, ~30 s.
  - `moon run frontend:serve` — servidor de desarrollo en `http://localhost:4200`.
  - `moon run backend:test` — xUnit con Testcontainers sobre SQL Server; tarda entre 17 y 21 min.
  - `moon run backend:run` — API en `http://localhost:5080`.
  - `moon run :test` — todos los `test` del monorepo (frontend y backend).
- **Migraciones**: `dotnet ef migrations add <Nombre>` en `backend/src/Bookings.Api`.
- **Git**: git-flow (`main`, `develop`, `feature/<id>`).
