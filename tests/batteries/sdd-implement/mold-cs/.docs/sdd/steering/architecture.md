# Architecture — salas

## Estructura

- .NET 10, sin paquetes NuGet. Un proyecto de consola, `Reservas.csproj`: `Rooms.cs` es el dominio, `Tests.cs` sus pruebas y `Program.cs` las ejecuta y sale con 1 si alguna falla.
- Git: git-flow (`main`, `develop`, `feature/<id>`).
