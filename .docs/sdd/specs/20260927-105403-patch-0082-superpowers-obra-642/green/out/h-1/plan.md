---
id: 20260923-090000-task-0012-status-filter
feature: "0012"
title: "Plan de implementación — Filtrar la lista de reservas por estado"
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **El backend no compila hoy**: `git ls-files backend/` no lista ningún `.csproj` ni `Program.cs`, y el fixture `SqlServerApiFactory` que ya usa `BookingsEndpointsTests.cs:6` no existe en el repo. Tampoco hay `.moon/workspace.yml` ni `backend/moon.yml`/`frontend/moon.yml`: `moon run backend:test` no tiene task que ejecutar. Task 1 crea el proyecto .NET mínimo y el fixture de tests porque sin eso no hay dónde aplicar la migración ni correr el test de paginación existente. Duplica el esfuerzo de Task 1 frente a "solo añadir `Status` + filtro". **No** incluyo arreglar el workspace de moon (crear `.moon/`, `backend/moon.yml`, `frontend/moon.yml`): es deuda de tooling anterior a esta feature, ajena al filtro por estado — lo dejo como riesgo para un chore aparte. Corrígeme si el proyecto real vive en otro sitio y me falta contexto.
2. **Enum `BookingStatus`** (`Confirmed`, `Pending`, `Cancelled`) mapeado a `string` en BD (`HasConversion<string>()`), para que la migración y el JSON sean legibles y no dependan del orden numérico del enum.
3. **`status` inválido en la query → 400** con los valores aceptados. La spec no lo dice; lo añado a Review Focus porque un `Enum.Parse` sin validar rompería la API con cualquier valor no reconocido.
4. **Ejecución: Native** — son 2 tasks con una interfaz simple (el contrato HTTP: el nombre `status` y sus tres valores), sin diseño que justifique un reviewer nuevo por task. Effort medio en las dos (hay prosa que interpretar: bootstrapping del proyecto, accesibilidad del selector). La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final, y su despacho se confirma contigo antes de lanzarlo, según la política de coste de tokens.
5. **Coste estimado**: Task 1 (backend + bootstrapping) ~5-6h, Task 2 (frontend) ~2h. Sin `estimation.md` en el proyecto, no relleno la sección de estimación formal del plan.

**Goal**: filtrar la lista de reservas por estado (`Confirmed`, `Pending`, `Cancelled`) en BD, API y pantalla.

**Architecture**: se añade `Status` a `Booking` con migración de backfill; `GET /bookings` acepta `status` como query param opcional y filtra antes de paginar; el frontend añade un componente `app-status-select` que controla un signal leído por el `httpResource` ya existente, así que el refetch es automático al cambiar de estado.

**Tech Stack**: .NET 9 minimal API + EF Core 9 sobre SQL Server (backend); Angular 20 standalone + signals (frontend). Ver `.docs/sdd/tech-stack.md`.

**Spec**: `./spec.md`

**Ejecución**: Native, porque son 2 tasks con contrato simple entre ellas y ningún diseño de alto riesgo; la sesión va bien en gama media (Sonnet, effort medium) y el modelo más capaz se reserva para la revisión final de rama.

## Restricciones globales

### De código

- Enum de estado cerrado a `Confirmed`, `Pending`, `Cancelled` (spec, decisión 1) — no añadir valores no pedidos.
- El filtro vive en la API, no en el cliente (spec, decisión 2): el frontend nunca filtra el array recibido, siempre pide `?status=`.
- Componente propio `app-status-select` con «Todos» por defecto (spec, decisión 3).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad) (Art. 5).
- Funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (Art. 5).
- Texto de interfaz y documentos en castellano (Art. 4): las etiquetas del selector van en castellano (Confirmada/Pendiente/Cancelada/Todos) aunque el valor que viaja a la API sea el nombre inglés del enum.

### De proceso

- Política de modelos: modelo y effort explícitos al despachar cualquier subagente; gama media como suelo (Art. 6, `.docs/sdd/constitution.md`).
- `moon run :test` y `moon run frontend:check` en verde al cerrar cada task (Art. 2) — para Task 1, con `moon run backend:test` no operativo hoy (ver decisión 1), se usa `dotnet build`/`dotnet test` directo sobre los proyectos que crea la propia task.
- Rama `feature/0012` desde `develop`, ya creada; commits con mensajes que referencian el ticket (Art. 3).

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: sí — 2 tasks, sin capas de más; el bootstrapping del backend es la única pieza no pedida por la spec, y es la mínima necesaria para que la migración exista.
- [ ] **YAGNI gate**: `app-status-select` tiene un solo uso hoy (la lista de reservas), pero la spec lo pide como componente propio explícitamente — no es abstracción especulativa.
- [ ] **Brownfield gate**: el frontend sigue el patrón ya existente (`httpResource`, standalone, sin servicio HTTP intermedio); el backend no tiene patrón previo que seguir porque no existe aún como proyecto compilable.
- [ ] **Constitution check**: respeta Art. 1 (SDD), Art. 3 (git-flow), Art. 4 (castellano), Art. 5 (calidad), Art. 6 (modelos). Art. 2 («todo verde») se satisface con las superficies de cada task; el gate completo del proyecto no puede correr hoy vía `moon run :test` por la decisión 1 — se ejecuta con los comandos directos de cada superficie.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Bookings.Api.csproj` — proyecto mínimo `Microsoft.NET.Sdk.Web`, net9.0, referencias a EF Core SQL Server.
- `backend/src/Bookings.Api/Program.cs` — host mínimo: registra `BookingsDb` con SQL Server y llama `app.MapBookings()`.
- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Confirmed`, `Pending`, `Cancelled`.
- `backend/src/Bookings.Api/Migrations/` — migración `AddBookingStatus`, generada con `dotnet ef migrations add`.
- `backend/tests/Bookings.Tests/Bookings.Tests.csproj` — proyecto de test, xUnit + Testcontainers para SQL Server.
- `backend/tests/Bookings.Tests/SqlServerApiFactory.cs` — `WebApplicationFactory<Program>` con contenedor SQL Server y `SeedAsync(params Booking[] bookings)`.
- `frontend/src/app/bookings/status-select/status-select.component.ts` — `app-status-select`, standalone.
- `frontend/src/app/bookings/status-select/status-select.component.spec.ts`.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs:3-10` — añade `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs:5-8` — `OnModelCreating` con la conversión del enum a string.
- `backend/src/Bookings.Api/BookingsEndpoints.cs:10-15` — añade el parámetro `status` y el filtro.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs:6-19` — nuevos casos (Task 1).
- `docs/api.md:1-9` — documenta `status`.
- `frontend/src/app/bookings/booking.ts:1-5` — añade `status`.
- `frontend/src/app/bookings/booking-list.component.ts:1-18` — añade el selector y el signal de filtro.
- `frontend/src/app/bookings/booking-list.component.spec.ts:1-18` — nuevos casos (Task 2).

**NO se tocan**:

- `frontend/src/app/bookings/booking-list.component.css` — el selector hereda `--text`/`--surface`, no hace falta estilo nuevo.
- `.moon/`, `backend/moon.yml`, `frontend/moon.yml` — wiring de moon inexistente; queda fuera de esta feature (decisión 1, Riesgos).

### 1.2 Modelo de datos

- `Booking.Status: BookingStatus` (nuevo), default `BookingStatus.Pending` en el modelo C#.
- `enum BookingStatus { Confirmed, Pending, Cancelled }` en `Data/BookingStatus.cs`.
- `BookingsDb.OnModelCreating`: `modelBuilder.Entity<Booking>().Property(b => b.Status).HasConversion<string>();`

### 1.3 Migraciones

Es la primera migración del proyecto (no hay ninguna previa). Desde `backend/src/Bookings.Api`:

```
dotnet ef migrations add AddBookingStatus
```

El `AddColumn` lleva `defaultValue: "Confirmed"` — backfillea las filas existentes. Las inserciones nuevas siempre viajan con `Status` explícito desde el modelo C# (`BookingStatus.Pending` por defecto), así que el default de columna no las afecta: cumple el GIVEN/WHEN/THEN de la spec (existentes → `Confirmed`, nuevas → `Pending`) sin lógica extra en la app.

### 1.4 Contratos API

```
GET /bookings?page={int}&status={Confirmed|Pending|Cancelled}
```

- Sin `status`: comportamiento actual, sin filtrar.
- `status` reconocido (case-insensitive): solo esas reservas, paginadas igual que hoy.
- `status` no reconocido: `400 Bad Request` con los tres valores válidos en el cuerpo.
- Respuesta: `Booking[]` con el campo nuevo `status` (string).

### 1.5 UX

- `app-status-select`: opción «Todos» (valor `''`, por defecto) + `Confirmada`/`Pendiente`/`Cancelada` (etiqueta en castellano, valor el nombre inglés del enum que viaja a la API).
- Deshabilitado mientras `bookings.isLoading()` es `true` (spec: estado "deshabilitado mientras carga").
- Estilos: hereda `--text`/`--surface` de `booking-list.component.css`, sin CSS propio nuevo.

### 1.6 Dependencias

- Sin specs previas de las que dependa. Sin servicios externos nuevos.
- Paquete NuGet nuevo: `Testcontainers.MsSql` (o el fixture equivalente que ya da por hecho `SqlServerApiFactory`) — no está instalado, se añade al crear `Bookings.Tests.csproj`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| No hay proyecto .NET compilable en `backend/` (confirmado: sin `.csproj`/`Program.cs`) | Alta (ya confirmado) | Alto: bloquea migración y tests | Task 1 crea el proyecto mínimo antes de tocar `Booking` |
| `SqlServerApiFactory` no existe; el test de paginación no compila hoy | Alta (ya confirmado) | Alto: el test suite de backend no corre | Task 1 lo crea (Testcontainers + `WebApplicationFactory`) como parte de su RED |
| No hay `.moon/workspace.yml` ni `moon.yml` por proyecto: `moon run backend:test`/`frontend:test` no tienen task | Alta (ya confirmado) | Medio: la constitution pide "todo verde" vía moon | Fuera de esta feature (decisión 1); Task 1 verifica con `dotnet build`/`dotnet test` directos, se recomienda un chore aparte para el workspace de moon |
| Elegir versiones de paquetes NuGet sin referencia previa en el repo | Media | Bajo: solo afecta reproducibilidad del build | Fijar versiones estables compatibles con net9.0 / EF Core 9, documentadas en el `.csproj` |

### 1.8 Rollout

Directo: se mergea a `develop` tras la validación. La migración se aplica al desplegar (sin toggle ni entorno intermedio — no hay `environments.md` en el proyecto).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Backend: proyecto EF Core, estado en BD y filtro en la API

**Modelo**: Native — lo implemento yo en esta sesión (Sonnet, effort medium); sin despacho de subagente.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes del código de producción; copia guardada fuera del repo antes de escribir la implementación.

> Un test por escenario: el existente (`Lists_bookings_ordered_by_start`, hoy no compila por falta del fixture) más los nuevos de filtro y de Review Focus #1-4.

**Superficies**: BD, backend, docs
**Verificación**: `dotnet build backend/src/Bookings.Api` · `dotnet test backend/tests/Bookings.Tests` (moon no tiene task `backend:test` operativa hoy — decisión 1)
**Se prueba en la aplicación**: sí — `dotnet run --project backend/src/Bookings.Api` y `GET http://localhost:5080/bookings?status=Cancelled`: la respuesta solo trae las canceladas; sin `status`, las devuelve todas.

**Interfaces**:
- Consume: nada (primera task).
- Produce: `GET /bookings?status={Confirmed|Pending|Cancelled}` (§1.4); `Booking` con campo `status: string`; Task 2 depende de este nombre de parámetro y de estos tres valores exactos.

**Ficheros**: crear `Bookings.Api.csproj`, `Program.cs`, `Data/BookingStatus.cs`, `Migrations/`, `Bookings.Tests.csproj`, `SqlServerApiFactory.cs`; modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs`, `BookingsEndpointsTests.cs`, `docs/api.md`.

- [ ] **Step 1: Crear el proyecto mínimo** — `Bookings.Api.csproj` (`Microsoft.NET.Sdk.Web`, net9.0, `Microsoft.EntityFrameworkCore.SqlServer`) y `Program.cs` que registra `BookingsDb` (SQL Server, cadena de conexión de configuración) y llama `app.MapBookings()`. Sin esto no hay dónde correr `dotnet ef`.
- [ ] **Step 2: Crear el fixture de tests** — `Bookings.Tests.csproj` (xUnit, `Testcontainers.MsSql`, `Microsoft.AspNetCore.Mvc.Testing`) y `SqlServerApiFactory : WebApplicationFactory<Program>` con un contenedor SQL Server (Testcontainers) y `public async Task SeedAsync(params Booking[] bookings)` que inserta y guarda cambios en `BookingsDb`.
- [ ] **Step 3: Escribir los tests RED** en `BookingsEndpointsTests.cs`:
  - `Filters_bookings_by_status`: siembra reservas en los tres estados, pide `/bookings?status=Cancelled`, `Assert.All(bookings, b => Assert.Equal("Cancelled", b.Status))`.
  - `Returns_all_bookings_without_status`: siembra en dos estados, pide `/bookings` sin `status`, `Assert.Equal(2, bookings.Count)`.
  - `Rejects_unknown_status`: pide `/bookings?status=Foo`, `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)`.
  - `Accepts_status_case_insensitive`: pide `/bookings?status=cancelled`, mismo resultado que con `Cancelled`.
  - `Returns_empty_list_when_no_match`: siembra sin ninguna `Cancelled`, pide `/bookings?status=Cancelled`, `Assert.Empty(bookings)`.
  - `Applies_status_filter_before_pagination`: siembra 25 `Pending` y pide `/bookings?status=Pending&page=2`, comprueba que la página 2 tiene 5 resultados (25 - 20).
- [ ] **Step 4: Confirmar que fallan** — `dotnet test backend/tests/Bookings.Tests` → FAIL (falta `Status`/`BookingStatus`/filtro).
- [ ] **Step 5: Implementar** — `BookingStatus` enum (`Confirmed`, `Pending`, `Cancelled`); `Booking.Status` (`BookingStatus`, default `Pending`); `BookingsDb.OnModelCreating` con `HasConversion<string>()`; `BookingsEndpoints.MapBookings`:

```csharp
app.MapGet("/bookings", async Task<IResult> (BookingsDb db, int page = 1, string? status = null) =>
{
    BookingStatus? parsed = null;
    if (status is not null)
    {
        if (!Enum.TryParse<BookingStatus>(status, ignoreCase: true, out var value))
            return Results.BadRequest($"status debe ser uno de: {string.Join(", ", Enum.GetNames<BookingStatus>())}");
        parsed = value;
    }

    var query = db.Bookings.AsQueryable();
    if (parsed is not null)
        query = query.Where(b => b.Status == parsed);

    var bookings = await query.OrderBy(b => b.Start).Skip((page - 1) * 20).Take(20).ToListAsync();
    return Results.Ok(bookings);
});
```

- [ ] **Step 6: Migración** — `dotnet ef migrations add AddBookingStatus` desde `backend/src/Bookings.Api`; comprobar en el fichero generado que `AddColumn` lleva `defaultValue: "Confirmed"` (§1.3).
- [ ] **Step 7: Build** — `dotnet build backend/src/Bookings.Api` y `dotnet build backend/tests/Bookings.Tests`. Esperado: verde.
- [ ] **Step 8: Verificación** — `dotnet test backend/tests/Bookings.Tests`. Esperado: todo verde, incluido `Lists_bookings_ordered_by_start` (ya existía, antes no compilaba).
- [ ] **Step 9: Documentar la API** — en `docs/api.md`, añadir a la tabla de `GET /bookings` la fila `status` (`Confirmed`/`Pending`/`Cancelled`, sin valor por defecto — no filtra) y una frase sobre el `400` con valor no reconocido.
- [ ] **Step 10: Commit de la task** — uno solo, con la revisión limpia.

### Task 2 — Frontend: selector de estado en la lista

**Modelo**: Native — lo implemento yo en esta sesión (Sonnet, effort medium); sin despacho de subagente.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos antes del código; copia guardada fuera del repo.

**Superficies**: frontend
**Verificación**: `moon run frontend:test` · `moon run frontend:check`
**Verificación visual**: pantalla de la lista de reservas (`/`) · estados normal, con foco y deshabilitado (mientras `bookings.isLoading()`) · tema claro y oscuro · mirar alineación, separación a bordes y contraste del selector.
**Se prueba en la aplicación**: sí — con `moon run backend:run` y `moon run frontend:serve`, el usuario elige un estado en el selector y la lista muestra solo las reservas de ese estado.

**Interfaces**:
- Consume: `GET /bookings?status={Confirmed|Pending|Cancelled}` y el campo `status: string` de `Booking` (Task 1).
- Produce: nada (última task).

**Ficheros**: crear `status-select/status-select.component.ts`, `status-select/status-select.component.spec.ts`; modificar `booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`.

- [ ] **Step 1: Escribir los tests RED**:
  - `status-select.component.spec.ts` — `renders the four options with Spanish labels` (Todos, Confirmada, Pendiente, Cancelada); `emits the chosen value via the value model` (selecciona `Cancelled`, comprueba que el `model` se actualiza); `is disabled when the disabled input is true`.
  - `booking-list.component.spec.ts` — `refetches with the status query param when the user picks a status` (`HttpTestingController.expectOne('/api/bookings?status=Cancelled')` tras simular la selección); `keeps requesting without status param when "Todos" is selected`.
- [ ] **Step 2: Confirmar que fallan** — `moon run frontend:test` → FAIL (no existe `app-status-select` ni el signal de filtro).
- [ ] **Step 3: Implementar** `StatusSelectComponent` (`frontend/src/app/bookings/status-select/status-select.component.ts`), selector `app-status-select`, standalone:
  - `value = model<'' | 'Confirmed' | 'Pending' | 'Cancelled'>('')`.
  - `disabled = input(false)`.
  - `<select>` con las 4 `<option>` (`''` → "Todos", `Confirmed` → "Confirmada", `Pending` → "Pendiente", `Cancelled` → "Cancelada"), `[disabled]="disabled()"`, `(change)` actualiza `value`.
- [ ] **Step 4: Añadir `status: string` a `Booking`** en `booking.ts:1-5`.
- [ ] **Step 5: Cablear en `BookingListComponent`**:
  - `statusFilter = signal<'' | 'Confirmed' | 'Pending' | 'Cancelled'>('')`.
  - `bookings = httpResource<Booking[]>(() => { const status = this.statusFilter(); return status ? \`/api/bookings?status=${status}\` : '/api/bookings'; })`.
  - Template: `<app-status-select [(value)]="statusFilter" [disabled]="bookings.isLoading()" />` antes de la `<ul>`.
- [ ] **Step 6: Verificación** — `moon run frontend:test` y `moon run frontend:check`. Esperado: verde.
- [ ] **Step 7: Verificación visual** — arrancar `moon run frontend:serve` (guardar el PID/puerto para pararlo después por ese medio, nunca por nombre de proceso), abrir `http://localhost:4200`, comprobar el selector en tema claro y oscuro, en foco (`Tab`) y deshabilitado (recargando la lista); capturas fuera de git.
- [ ] **Step 8: Commit de la task** — uno solo, con la revisión limpia.

---

## 3. Validación final

- [ ] Gate de cierre: `dotnet build`/`dotnet test` de `backend/` + `moon run frontend:test` + `moon run frontend:check` (el gate completo vía `moon run :test` no es operativo hoy — decisión 1; se ejecuta con estos comandos directos).
- [ ] Verificación de los 4 THEN de la spec (§Delta de comportamiento), uno por uno, con `ejecución real`.
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4).
- [ ] Revisor final: `sdd-kit:effort-medium` + modelo Sonnet (gama media resuelve la revisión de 2 tasks; no justifica el modelo más caro) — se confirma contigo antes de despachar, por la política de coste de tokens.
- [ ] Cierre de rama según `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- ADDED "Cada reserva tiene un estado" (migración + default `Confirmed`/`Pending`) → Task 1. ✓
- ADDED "La API filtra por estado" → Task 1. ✓
- ADDED "La lista se filtra con un selector" (con estados normal/foco/deshabilitado, claro/oscuro) → Task 2. ✓
- ADDED "La API documenta el filtro" → Task 1, Step 9. ✓
- Review Focus #1 (`status` no reconocido → 400) → Task 1, `Rejects_unknown_status`. ✓
- Review Focus #2 (`status` case-insensitive) → Task 1, `Accepts_status_case_insensitive`. ✓
- Review Focus #3 (filtro antes de paginar) → Task 1, `Applies_status_filter_before_pagination`. ✓
- Review Focus #4 (sin resultados → `[]`) → Task 1, `Returns_empty_list_when_no_match`. ✓
- Review Focus #5 (selector deshabilitado mientras carga) → Task 2, `is disabled when the disabled input is true` + verificación visual. ✓
- "No entra: cambiar el estado desde la interfaz" (spec, Scope) → N/A, ninguna task añade esa acción. ✓
