# Tech Stack — Gimnasio Norte · Reservas de clases

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Backend | .NET / ASP.NET Core | 9 |
| Frontend | Angular | 20 |
| Base de datos | PostgreSQL (gestionado por el proveedor de hosting) | por decidir en el hosting |
| Migraciones | EF Core | según versión de .NET 9 |

## Comandos

- **Build**: `dotnet build` (backend) · `ng build` (frontend)
- **Tests**: `dotnet test` (backend) · `ng test` (frontend)
- **Arrancar**: `dotnet run` (backend) · `ng serve` (frontend)

## Testing

Sin código todavía. Aplica `superpowers:test-driven-development` desde la primera task: test primero, y smoke manual documentado solo donde no haya test automático posible.

## Decisiones abiertas

- Framework de test del backend — opciones: xUnit · NUnit · MSTest — quién decide: equipo
- Framework de test del frontend — opciones: Jasmine/Karma (default Angular) · Jest — quién decide: equipo
