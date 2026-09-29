---
id: 20260929-194012-feature-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-29
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Dos tasks**: Task 1 lleva el estado de la BD a la API y su documentación; Task 2, el selector en la lista. No es una rebanada única porque la Task 1 ya se prueba sola en la aplicación (la spec fija su THEN sobre `GET /bookings`) y porque un revisor puede rechazar el selector (sus estados y temas) y aprobar la API.
2. **Modelo y effort**: las dos tasks con `sdd-kit:effort-medium` + `sonnet` si se despachan (hay que interpretar prosa, sin algoritmo difícil). El revisor final de rama, con `sdd-kit:effort-high` + `opus`.
3. **Ejecución: Native**: 2 tasks, con el contrato entre ellas (`?status=` y sus tres valores) fijado en el plan; un fallo en producción se ve enseguida en la lista y se corrige con otro patch. Nadie lo había fijado en `sdd-kit.json` ni en `sdd-kit.local.json`.
4. **El estado se guarda como texto** (`nvarchar(16)`, `HasConversion<string>()`), no como entero: se lee en la BD y no depende del orden del enum.
5. **Migración `AddBookingStatus`**: añade la columna con el valor por defecto `'Confirmed'` para rellenar las filas que ya hay y después lo quita; el `Pending` de las reservas nuevas sale de la entidad (`= BookingStatus.Pending`). Así el snapshot de EF y la BD no quedan distintos.
6. **Parseo de `status`**: no distingue mayúsculas de minúsculas. `status=` vacío equivale a no enviarlo. Un valor que no es uno de los tres nombres (también un número como `2`, que `Enum.TryParse` aceptaría) devuelve 400 con los tres valores válidos. El filtro se aplica antes de paginar.
7. **El enum se serializa como texto** (`[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))]` en el enum): la respuesta dice `"status": "Cancelled"`, igual que el parámetro. Se pone en el enum porque `Program.cs` no está en el repo.
8. **Textos del selector**: etiqueta «Estado» y opciones «Todos», «Confirmada», «Pendiente», «Cancelada» (Art. 4). A la API van `Confirmed`, `Pending` y `Cancelled`. Con «Todos» se pide `/api/bookings` sin `status`, la misma petición que hay hoy.
9. **Riesgo alto: el repo está incompleto**. No tiene `Program.cs`, ningún `.csproj`, ninguna carpeta `Migrations/` ni el `SqlServerApiFactory` que usa el test, y en el frontend no hay `angular.json` ni rutas. El plan supone que existen fuera de lo que veo. Si al abrir la Task 1 no hay una migración anterior, `migrations add` generaría la tabla entera: es un freno de alcance y paro antes de crearla.
10. **Falta `§Frontend` en `tech-stack.md`**, y la spec no lo propuso. Lo propongo aquí: detector `npx impeccable detect {url} --viewport {viewport}`, Playwright con un script del paquete `playwright`, viewports `1280x800` y `390x844`, acceso `sin login` (no hay autenticación en el código) y temas con `colorScheme` de Playwright (el mecanismo de tema no está en el repo, está por confirmar). No lo escribo en `tech-stack.md` sin tu visto bueno. Sin él, la verificación visual de la Task 2 lleva «composición no medida: `tech-stack.md` no declara detector en §Frontend».
11. **Coste estimado**: unas 3 h de implementación (1,5 h la Task 1, 1 h la Task 2 y 0,5 h la validación), más ~20 min de la suite de backend en el gate. En Native el único despacho es el revisor final (Opus), del orden de 1–3 $.
12. **Review Focus**: 5 entradas que la spec no fija, cada una con su comportamiento esperado y su test. Están en su sección.

**Goal**: cada reserva tiene un estado guardado en BD, la API filtra `GET /bookings` por `status` y la lista lo elige con `app-status-select`.

**Architecture**: un enum `BookingStatus` en la entidad, guardado como texto y rellenado por la migración. El endpoint existente recibe `status` como texto y lo parsea en una función aparte antes de paginar. En el frontend, un componente de selector con `model()` alimenta la URL del `httpResource` de la lista.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit + Testcontainers; Angular 20 con signals y Vitest.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks con el contrato entre ellas fijado en el plan y un error que llegara a producción se ve y se corrige barato. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Estados, literales: `Confirmed`, `Pending`, `Cancelled`. Las reservas que ya existen pasan a `Confirmed` y las nuevas se crean con `Pending`.
- Filtro: `GET /bookings?status=<estado>`; sin `status`, todas.
- Selector: componente `app-status-select`, con «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.
- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Ejecución: Native (ver cabecera). El revisor final va con `sdd-kit:effort-high` + `opus`.
- Git-flow: `feature/0012` desde `develop`; un commit por task, con `(0012)` en el mensaje.

## Review Focus

- `status=cancelled` (en minúsculas) → las mismas reservas que `Cancelled` · Task 1, `Filters_status_ignoring_case`
- `status=Foo` o `status=2` → 400 con los tres valores válidos, ni la lista entera ni un 500 · Task 1, `Rejects_unknown_status`
- `status=Cancelled&page=2` → la segunda página de las canceladas, porque se filtra antes de paginar · Task 1, `Paginates_after_filtering`
- `status=` vacío → todas, igual que sin el parámetro · Task 1, `Empty_status_returns_all`
- Volver a «Todos» tras elegir un estado → se vuelve a pedir `/api/bookings` sin `status` · Task 2, `requests all bookings again when Todos is chosen`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un enum, un parámetro y un `<select>` nativo; sin librería de UI.
- [x] **YAGNI gate**: `app-status-select` tiene un uso, pero es una decisión aprobada en la spec (decisión 3).
- [x] **Brownfield gate**: sin `status`, el endpoint responde igual que hoy. El test actual de la lista sigue esperando `/api/bookings`. No se refactoriza nada fuera del alcance.
- [x] **Constitution check**: Art. 2 con la verificación por task y el gate en §3; Art. 4 con los textos en castellano; Art. 5 en «De código».

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — el enum y su conversor JSON.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ el snapshot actualizado) — la columna y el relleno.
- `frontend/src/app/bookings/status-select.component.ts` (+ `.css`, `.spec.ts`) — `app-status-select`.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — la conversión a texto en `OnModelCreating`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — los tests nuevos.
- `docs/api.md` — el parámetro `status`.
- `frontend/src/app/bookings/booking-list.component.ts` (+ `.spec.ts`, `.css`) — el selector y la URL con el filtro.
- `frontend/src/app/bookings/booking.ts` — `status`.

**NO se tocan**:

- La paginación: `page` y el tamaño de 20 se quedan como están.
- Cambiar el estado desde la interfaz: está en el «No entra» de la spec.

### 1.2 Modelo de datos

`Booking.Status : BookingStatus`, la columna `Status nvarchar(16) NOT NULL`, sin valor por defecto en la BD cuando acaba la migración.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. Después se retoca `Up`: `AddColumn` con `defaultValue: "Confirmed"`, seguido de un `AlterColumn` que quita el valor por defecto. `Down` borra la columna.

### 1.4 Contratos API

`GET /bookings?page=<int>&status=<Confirmed|Pending|Cancelled>`. `status` no distingue mayúsculas de minúsculas y, vacío o ausente, devuelve todas. Si no es válido, responde 400 `ProblemDetails` con `detail` = `status debe ser Confirmed, Pending o Cancelled`. Cada reserva de la respuesta lleva `"status": "<nombre>"`.

### 1.5 UX

Encima de la lista, un `<select>` nativo con la etiqueta «Estado». Mientras la lista carga está deshabilitado. Toma los colores de `var(--text)` y `var(--surface)`, y el foco se ve con `outline` en los dos temas.

### 1.6 Dependencias

Ninguna nueva. La Task 2 depende del contrato de la Task 1.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| No hay migración base y `migrations add` genera la tabla entera | media (no hay `Migrations/` en el repo) | alto | Se comprueba al abrir la Task 1; si no la hay, es un freno de alcance y se para |
| `SqlServerApiFactory` no expone cómo sembrar filas antiguas sin `Status` | media | medio | El test de la migración usa `IMigrator` y SQL crudo, a través de un `IServiceScope` de la factory |
| La suite de backend (17–21 min) alarga cada ronda de fix | alta | bajo | Durante la task solo corre el filtro de `BookingsEndpointsTests`, en segundo plano |

### 1.8 Rollout

Directo. La migración rellena `Confirmed` en el despliegue y no deja ninguna ventana de datos a medias.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD y filtro en la API

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (si se despacha; en Native, la sesión)
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes del código, con una copia guardada fuera del repo
**Superficies**: BD · backend · docs
**Verificación**: `dotnet build backend/tests/Bookings.Tests`
**Verificación lenta**: `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingsEndpointsTests"` · varios minutos (Testcontainers)
**Se prueba en la aplicación**: con `moon run backend:run` y reservas en los tres estados, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo las canceladas, sin `status` las devuelve todas y `?status=Foo` responde 400.

**Interfaces**:
- Consume: nada.
- Produce: `enum BookingStatus { Confirmed, Pending, Cancelled }` (serializado como texto) · `Booking.Status` · `GET /bookings?status=<nombre>` con el contrato de §1.4.

**Ficheros**: crear `Data/BookingStatus.cs` y la migración `AddBookingStatus`; modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs`, `BookingsEndpointsTests.cs` y `docs/api.md`.

- [ ] **Step 0: Comprobar la base** — que existen `Migrations/` con al menos una migración, `Program.cs` y `SqlServerApiFactory`. Si falta la migración base, freno de alcance: se para.
- [ ] **Step 1: Tests RED** (xUnit; siembra con `factory.SeedAsync`):

```csharp
// Existing_bookings_become_confirmed_after_migration: IMigrator.MigrateAsync(<migración anterior>),
// INSERT por SQL crudo sin Status, MigrateAsync("AddBookingStatus"), leer la fila:
Assert.Equal(BookingStatus.Confirmed, booking.Status);
// New_bookings_are_created_pending:
Assert.Equal(BookingStatus.Pending, new Booking().Status);
// Filters_by_status: siembra una por estado, GET /bookings?status=Cancelled
Assert.All(bookings, b => Assert.Equal(BookingStatus.Cancelled, b.Status)); Assert.Single(bookings);
// Returns_all_without_status: GET /bookings
Assert.Equal(3, bookings.Count);
// Filters_status_ignoring_case: ?status=cancelled → Assert.Single(bookings)
// Empty_status_returns_all: ?status= → Assert.Equal(3, bookings.Count)
// [Theory, InlineData("Foo"), InlineData("2")] Rejects_unknown_status:
Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
Assert.Contains("Confirmed, Pending o Cancelled", await response.Content.ReadAsStringAsync());
// Paginates_after_filtering: 21 Cancelled + 1 Confirmed, ?status=Cancelled&page=2
Assert.Single(bookings); Assert.Equal(BookingStatus.Cancelled, bookings[0].Status);
```

  Cada test siembra con salas propias (`"T1-…"`) o limpia la tabla: la factory se comparte entre los tests de la clase, así que los recuentos dependen de sembrar aislados.
- [ ] **Step 2: Implementación**
  - `BookingStatus.cs`: `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))] public enum BookingStatus { Confirmed, Pending, Cancelled }`.
  - `Booking.Status { get; set; } = BookingStatus.Pending;`.
  - `BookingsDb.OnModelCreating`: `Property(b => b.Status).HasConversion<string>().HasMaxLength(16)`.
  - Migración según §1.3.
  - `BookingsEndpoints`: `MapGet("/bookings", (BookingsDb db, int page = 1, string? status = null) => …)`, con el filtro antes de `OrderBy/Skip/Take`. `private static bool TryParseStatus(string? raw, out BookingStatus? status)` compara contra `Enum.GetNames<BookingStatus>()` con `StringComparison.OrdinalIgnoreCase`; con un valor inválido, `Results.Problem(detail: "status debe ser Confirmed, Pending o Cancelled", statusCode: 400)`.
  - `docs/api.md`: una fila `status` en la tabla (texto · todas), los tres valores y el 400.
- [ ] **Step 3: Build** — `dotnet build backend/tests/Bookings.Tests`, en verde.
- [ ] **Step 4: Verificación** — la verificación lenta en segundo plano: los tests de la clase en verde, los nuevos incluidos.
- [ ] **Step 5: Commit de la task** — `feat(0012): estado de la reserva y filtro por estado en la API`.

### Task 2 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (si se despacha; en Native, la sesión)
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `booking-list.component.spec.ts`, escritos antes del código, con una copia guardada fuera del repo
**Superficies**: frontend
**Verificación**: `moon run frontend:test` · `moon run frontend:check`
**Verificación visual**: la lista de reservas (`moon run frontend:serve`, `http://localhost:4200`) · estados del selector: normal, con foco y deshabilitado (mientras carga) · temas claro y oscuro · criterio: el selector muestra la etiqueta «Estado» y las opciones «Todos», «Confirmada», «Pendiente» y «Cancelada»; en los dos temas el texto se lee sobre el fondo, el foco se ve y el deshabilitado se distingue del normal; al elegir «Cancelada» la lista muestra solo las canceladas · pantalla de referencia: la lista actual
**Se prueba en la aplicación**: con la API y el frontend arrancados, el usuario elige «Cancelada» y la lista se queda solo con las canceladas; con «Todos» vuelven todas.

**Interfaces**:
- Consume: `GET /bookings?status=<Confirmed|Pending|Cancelled>`; sin `status`, todas (servido como `/api/bookings`).
- Produce: `type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'` en `booking.ts`; `StatusSelectComponent` (`app-status-select`) con `value = model<BookingStatus | null>(null)` y `disabled = input(false)`.

**Ficheros**: crear `status-select.component.ts`, `.css` y `.spec.ts`; modificar `booking.ts`, `booking-list.component.ts`, `.spec.ts` y `.css`.

- [ ] **Step 1: Tests RED** (Vitest + `HttpTestingController`):

```ts
// status-select: 'shows Todos and the three states'
expect(options.map(o => o.textContent.trim())).toEqual(['Todos', 'Confirmada', 'Pendiente', 'Cancelada']);
// status-select: 'is disabled when disabled is true' → expect(select.disabled).toBe(true)
// booking-list: 'requests only the chosen status' → elegir Cancelled en el select
http.expectOne('/api/bookings?status=Cancelled').flush([{ id: 3, room: 'Sala 3', start: '11:00', status: 'Cancelled' }]);
expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
// booking-list: 'disables the selector while loading' → antes del flush
expect(select.disabled).toBe(true);
// booking-list: 'requests all bookings again when Todos is chosen' → Cancelled, flush, luego Todos
http.expectOne('/api/bookings');
```

  El test actual `lists the bookings returned by the API` se queda como está.
- [ ] **Step 2: Implementación**
  - `booking.ts`: `status: BookingStatus` en `Booking`, además del tipo.
  - `StatusSelectComponent`: un `<label>` «Estado» y un `<select>` nativo; la opción «Todos» tiene el valor vacío, que corresponde a `null`.
  - `BookingListComponent`: `readonly status = signal<BookingStatus | null>(null)`; la URL del `httpResource` es `'/api/bookings'` o `` `/api/bookings?status=${status}` ``; `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` encima de la `<ul>`.
  - CSS: `color: var(--text)`, `background: var(--surface)` y un `:focus-visible` con `outline` visible.
- [ ] **Step 3: Build** — `moon run frontend:check`, en verde.
- [ ] **Step 4: Verificación** — `moon run frontend:test` en verde, y después la verificación visual (en el hilo, tras la revisión).
- [ ] **Step 5: Commit de la task** — `feat(0012): selector de estado en la lista de reservas`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (el backend tarda 17–21 min, en segundo plano) y `moon run frontend:check`.
- [ ] Smoke con una fila por THEN de la spec: `ejecución real` para la API (incluido el 400 provocado) y para el selector.
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4).
- [ ] Cierre con `sdd-end-feature`, tras la validación del dev-lead.

---

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado (las existentes `Confirmed`, las nuevas `Pending`) → Task 1, `Existing_bookings_become_confirmed_after_migration` y `New_bookings_are_created_pending`. ✓
- La API filtra por estado; sin `status`, todas → Task 1, `Filters_by_status` y `Returns_all_without_status`. ✓
- La lista se filtra con el selector; se ve igual en los dos temas y en los estados normal, con foco y deshabilitado → Task 2, `requests only the chosen status` y `disables the selector while loading`, más la «Verificación visual». ✓
- La API documenta el filtro → Task 1, Step 2 (`docs/api.md`), comprobado en la revisión. ✓
- Cambiar el estado desde la interfaz → N/A (está en el «No entra» de la spec). ✓
- Review Focus → Task 1, `Filters_status_ignoring_case`, `Rejects_unknown_status`, `Paginates_after_filtering` y `Empty_status_returns_all`; Task 2, `requests all bookings again when Todos is chosen`. ✓
