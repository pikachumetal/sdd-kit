---
id: 20260923-090000-feature-0012-status-filter
feature: "0012"
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Modelo/effort**: Task 1 y Task 2 con `sdd-kit:effort-medium` + `model: sonnet` — hay que interpretar la spec (contrato API, tokens de tema), gama media basta; ninguna trae el código ya escrito.
2. **Ejecución**: `native` — 2 tasks con interfaz simple (un query param `status`), sin dependencia cruzada de código entre ellas; un fallo aquí no es costoso. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con `subagent-driven-development` sobre el mismo ledger.
3. **Estado en BD como string** (`HasConversion<string>()`), no como entero: así `status=Cancelled` en la URL es directamente el valor de columna, sin tabla de traducción.
4. **Backfill vs. valor nuevo**: la migración pone `Confirmed` como default de columna (cubre las filas existentes y cualquier insert que no fije el campo); la entidad `Booking` fija `Status = BookingStatus.Pending` en su inicializador, así toda reserva creada por la app manda el valor explícito y no hereda el default de columna. Es la única forma de dar defaults distintos a "fila vieja" y "fila nueva" con una sola columna.
5. **`status` inválido → 400**, no 500 ni "todas": la spec no lo dice, pero un valor que no es de los tres es un error del cliente, no un filtro vacío.
6. **`status` case-insensitive** en el parseo (`Enum.TryParse<BookingStatus>(valor, ignoreCase: true, ...)`), aunque la documentación solo publique los tres valores en PascalCase: evita un 400 innecesario por mayúsculas.
7. **Riesgo alto**: ninguno — tabla de reservas de una app interna, migración de una sola columna con default, sin dato que perder.
8. **Coste estimado**: ~2h de implementación (Task 1 ~1h, Task 2 ~1h); sin despacho de subagentes en esta sesión (ejecución native), así que no aplica orden de magnitud en tokens.

**Goal**: Que la lista de reservas se pueda filtrar por estado (confirmada, pendiente, cancelada) desde la API y desde un selector en la pantalla.

**Architecture**: Estado como columna nueva en `Booking` (enum guardado como string), filtro opcional por query string en el endpoint existente `GET /bookings`, y un componente Angular standalone (`app-status-select`) que añade `status` a la URL reactiva de `booking-list`.

**Tech Stack**: Backend .NET 9 minimal API + EF Core 9 sobre SQL Server (migraciones con `dotnet ef`); frontend Angular 20 con signals y `httpResource`, temas claro/oscuro por variables CSS.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks pequeñas y de bajo acoplamiento (ver decisión 2).

## Restricciones globales

### De código

- Tres estados cerrados y solo esos: `Confirmed`, `Pending`, `Cancelled` (spec, decisión 1).
- El filtro vive en la API, nunca en el cliente (spec, decisión 2): el frontend no descarga todo y filtra en memoria.
- El selector es un componente propio `app-status-select`, con «Todos» como opción por defecto (spec, decisión 3).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (constitution, art. 5).
- Texto de interfaz y documentos en castellano (constitution, art. 4); los valores de la API (`Confirmed`/`Pending`/`Cancelled`) van en inglés porque son el contrato, no texto de interfaz.

### De proceso

- Gama media (Sonnet, effort medium) como suelo para implementadores y revisores (constitution, art. 6).
- Todo verde al cerrar la feature: `moon run :test` y `moon run frontend:check` (constitution, art. 2) — gate único en §3, no por task.
- Commits: uno por task al quedar limpia su revisión, referenciando `0012`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una columna, un query param, un componente. Sin capa de abstracción extra.
- [x] **YAGNI gate**: no hay nada con menos de 3 usos que se esté abstrayendo.
- [x] **Constitution check**: respeta arts. 2, 4, 5 y 6 (ver Restricciones globales).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Confirmed | Pending | Cancelled`.
- `frontend/src/app/bookings/status-select.component.ts` — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.css` — estilos del selector (temas + foco + disabled).
- `frontend/src/app/bookings/status-select.component.spec.ts` — sus tests.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating` con la conversión a string y el default de columna.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status` opcional y su filtro.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro y del backfill.
- `frontend/src/app/bookings/booking.ts` — añade `status` al tipo `Booking`.
- `frontend/src/app/bookings/booking-list.component.ts` — usa `app-status-select` y añade `status` a la URL de `httpResource`.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — test del filtrado end-to-end del listado.
- `docs/api.md` — documenta el parámetro `status`.

**NO se tocan**:

- Paginación (`page`) del endpoint — la spec no la cambia, solo se combina con `status`.

### 1.2 Modelo de datos

`Booking` gana `public BookingStatus Status { get; set; } = BookingStatus.Pending;`. `BookingStatus` es `enum BookingStatus { Pending, Confirmed, Cancelled }`. En `BookingsDb.OnModelCreating`: `modelBuilder.Entity<Booking>().Property(b => b.Status).HasConversion<string>().HasDefaultValue(BookingStatus.Confirmed);` — el default de columna es para el backfill (decisión 4); el valor de C# (`Pending`) es el que manda la app en cada insert nuevo porque EF siempre envía un valor explícito para una propiedad con valor asignado.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` desde `backend/src/Bookings.Api`. La migración generada añade la columna `Status` (`nvarchar(20)`) con `defaultValue: "Confirmed"` — cubre las filas anteriores al cambio (spec, THEN "Cada reserva tiene un estado").

### 1.4 Contratos API

`GET /bookings?status=<Confirmed|Pending|Cancelled>&page=<n>`:

- `status` ausente o vacío → sin filtrar, como hoy.
- `status` con uno de los tres valores (case-insensitive) → solo esas reservas, combinado con la paginación existente.
- `status` con cualquier otro valor → `400 Bad Request` con el cuerpo `{ "error": "status inválido" }`.

### 1.5 UX

`app-status-select`: un `<select>` nativo con las opciones `Todos` (valor `''`, por defecto), `Confirmada` (`Confirmed`), `Pendiente` (`Pending`), `Cancelada` (`Cancelled`). Expone un `input` de tipo `string` para el valor seleccionado y un `output` que emite el valor de la API al cambiar. Usa las variables de tema ya existentes (`--text`, `--surface`, mismas que `booking-list.component.css`) para el estado normal; añade `--focus` (borde en `:focus-visible`) y atenúa con `opacity` en `:disabled` — sin variables nuevas si el tema no las define, solo el mecanismo ya usado. `booking-list.component.ts` coloca el `<app-status-select>` sobre la lista, guarda el valor en un signal y lo añade a la URL de `httpResource` (`/api/bookings?status=<valor>` o `/api/bookings` si es `''`); el `<select>` se deshabilita mientras `bookings.isLoading()` es verdadero.

### 1.6 Dependencias

Ninguna: reutiliza EF Core (ya en el proyecto) y `httpResource` (ya usado en `booking-list.component.ts`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `status` inválido no contemplado por la spec deja pasar cualquier string a la query | Media | Bajo (endpoint interno) | 400 explícito (decisión 5), con test |
| `moon run backend:test` tarda 17–21 min (tech-stack.md) y se cuela como verificación de task | Alta si no se marca | Bajo | Declarado como «Verificación lenta» en la Task 1: lo lanza el hilo principal en segundo plano |

### 1.8 Rollout

Directo: se despliega con el resto de la rama al mergear `develop`. Sin toggle — la migración es aditiva y la app sigue sirviendo `GET /bookings` sin `status` igual que hoy.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD, filtro en la API y su documentación

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes de despachar, sin commitear (van en el commit de la task)

```csharp
[Fact]
public async Task Filters_by_status()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Cancelled },
        new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 10, 0, 0), End = new(2026, 9, 1, 11, 0, 0), Status = BookingStatus.Confirmed });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=Cancelled");

    Assert.Single(bookings!);
    Assert.Equal("Sala 1", bookings![0].Room);
}

[Fact]
public async Task Without_status_returns_all()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Cancelled },
        new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 10, 0, 0), End = new(2026, 9, 1, 11, 0, 0), Status = BookingStatus.Confirmed });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

    Assert.Equal(2, bookings!.Count);
}

[Fact]
public async Task Invalid_status_returns_400()
{
    var response = await factory.CreateClient().GetAsync("/bookings?status=Archived");

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
}

[Fact]
public async Task Status_is_case_insensitive()
{
    await factory.SeedAsync(new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Cancelled });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=cancelled");

    Assert.Single(bookings!);
}

[Fact]
public async Task Existing_rows_backfill_to_confirmed()
{
    await factory.ExecuteSqlAsync(
        "INSERT INTO Bookings (Room, Start, [End], Owner) VALUES ('Sala 3', '2026-09-01T09:00:00', '2026-09-01T10:00:00', '')");

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

    Assert.Equal(BookingStatus.Confirmed, bookings!.Single(b => b.Room == "Sala 3").Status);
}
```

> `SeedAsync` y `factory` ya existen en el patrón de test actual (`BookingsEndpointsTests.cs`); `ExecuteSqlAsync` es nuevo — un helper de `SqlServerApiFactory` que ejecuta SQL crudo contra la conexión del contenedor, para probar el default de columna sin pasar por EF.

**Superficies**: BD, backend, docs
**Verificación**: `moon run backend:test`
**Verificación lenta**: `moon run backend:test` — 17 a 21 min; lo lanza el hilo principal en segundo plano al entregar la task, mientras corre su revisión
**Se prueba en la aplicación**: no, porque no hay pantalla propia en esta task — se prueba en la Task 2, que es quien la consume desde la lista

**Interfaces**:
- Consume: nada
- Produce: `GET /bookings?status=<Confirmed|Pending|Cancelled>` (200 con la lista filtrada, o sin filtrar si `status` está vacío/ausente; 400 si no es uno de los tres valores); tipo `Booking` con el campo nuevo `Status: BookingStatus` (serializado como string: `"Confirmed" | "Pending" | "Cancelled"`)

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`; modificar `backend/src/Bookings.Api/Data/Booking.cs`, `backend/src/Bookings.Api/Data/BookingsDb.cs`, `backend/src/Bookings.Api/BookingsEndpoints.cs`, `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, `docs/api.md`; migración generada bajo `backend/src/Bookings.Api/Migrations/`

- [ ] **Step 1: Escribir los tests RED** de arriba en `BookingsEndpointsTests.cs`
- [ ] **Step 2: Ejecutar y comprobar que fallan** — `moon run backend:test` — esperado: FAIL (no compila: `Status` y `BookingStatus` no existen)
- [ ] **Step 3: Implementar** — crear `BookingStatus.cs`; añadir `Status` a `Booking`; en `BookingsDb.OnModelCreating`, la conversión a string y el default `Confirmed`; generar la migración `AddBookingStatus`; en `BookingsEndpoints.MapBookings`, añadir `string? status = null`, parsear con `Enum.TryParse<BookingStatus>(status, ignoreCase: true, out var parsed)`, devolver `Results.BadRequest(new { error = "status inválido" })` si `status` no es vacío y el parseo falla, y filtrar con `.Where(b => b.Status == parsed)` cuando parsea
- [ ] **Step 4: Build** — `dotnet build` sobre `backend/` — esperado: verde
- [ ] **Step 5: Verificación** — `moon run backend:test` (17–21 min, en segundo plano) — esperado: los 5 tests nuevos y los existentes en verde
- [ ] **Step 6: Documentar** — añadir a `docs/api.md` la fila `status` en la tabla de parámetros de `GET /bookings`, con sus tres valores
- [ ] **Step 7: Commit de la task** — un commit, mensaje referenciando `0012`

### Task 2 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos antes de despachar, sin commitear (van en el commit de la task)

```typescript
// status-select.component.spec.ts
it('emits the API value for the chosen option', () => {
  const fixture = TestBed.createComponent(StatusSelectComponent);
  fixture.detectChanges();
  const emitted: string[] = [];
  fixture.componentInstance.statusChange.subscribe((v: string) => emitted.push(v));

  const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
  select.value = 'Cancelled';
  select.dispatchEvent(new Event('change'));

  expect(emitted).toEqual(['Cancelled']);
});

it('disables while loading', () => {
  const fixture = TestBed.createComponent(StatusSelectComponent);
  fixture.componentRef.setInput('disabled', true);
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('select').disabled).toBe(true);
});
```

```typescript
// booking-list.component.spec.ts — se añade a la suite existente
it('re-requests with the chosen status and clears it back to "Todos"', async () => {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  const fixture = TestBed.createComponent(BookingListComponent);
  fixture.detectChanges();
  const http = TestBed.inject(HttpTestingController);
  http.expectOne('/api/bookings').flush([]);

  fixture.nativeElement.querySelector('select').value = 'Cancelled';
  fixture.nativeElement.querySelector('select').dispatchEvent(new Event('change'));
  await fixture.whenStable();

  http.expectOne('/api/bookings?status=Cancelled').flush([]);

  fixture.nativeElement.querySelector('select').value = '';
  fixture.nativeElement.querySelector('select').dispatchEvent(new Event('change'));
  await fixture.whenStable();

  http.expectOne('/api/bookings').flush([]);
});
```

**Superficies**: frontend
**Verificación**: `moon run frontend:test`, `moon run frontend:check`
**Verificación visual**: lista de reservas (`/`) — selector en normal, con foco (`Tab`) y deshabilitado (mientras `bookings.isLoading()`), en tema claro y en tema oscuro — mirar alineación, separación a bordes y contraste
**Se prueba en la aplicación**: sí — el usuario abre la lista, elige «Cancelada» en el selector y ve solo las reservas canceladas; vuelve a «Todos» y ve la lista completa

**Interfaces**:
- Consume: de Task 1 — `GET /bookings?status=<Confirmed|Pending|Cancelled>` (200, lista filtrada; ausente/`''` = sin filtrar)
- Produce: nada (última task)

**Ficheros**: crear `frontend/src/app/bookings/status-select.component.ts`, `status-select.component.css`, `status-select.component.spec.ts`; modificar `frontend/src/app/bookings/booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`

- [ ] **Step 1: Escribir los tests RED** de arriba
- [ ] **Step 2: Ejecutar y comprobar que fallan** — `moon run frontend:test` — esperado: FAIL (`StatusSelectComponent` no existe; el listado aún no pide con `status`)
- [ ] **Step 3: Implementar `StatusSelectComponent`** — standalone, `input<boolean>('disabled')`, `output<string>('statusChange')`, template con un `<select>` y las 4 opciones (`Todos`→`''`, `Confirmada`→`Confirmed`, `Pendiente`→`Pending`, `Cancelada`→`Cancelled`); estilos en `status-select.component.css` con `--text`/`--surface` y `:focus-visible`/`:disabled`
- [ ] **Step 4: Añadir `status: string` a `Booking`** en `booking.ts`
- [ ] **Step 5: Implementar en `BookingListComponent`** — signal `status` (inicial `''`), `<app-status-select>` en el template ligado a ese signal y a `bookings.isLoading()`, `httpResource` recalculando la URL como `` `/api/bookings${status() ? `?status=${status()}` : ''}` ``
- [ ] **Step 6: Build** — `moon run frontend:check` — esperado: verde
- [ ] **Step 7: Verificación** — `moon run frontend:test` — esperado: verde
- [ ] **Step 8: Verificación visual** — abrir la lista, comprobar el selector en normal/foco/disabled y en ambos temas; capturas fuera de git
- [ ] **Step 9: Commit de la task** — un commit, mensaje referenciando `0012`

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los 4 THEN de la spec con ejecución real (no solo suite): filtrar por `Cancelled`, pedir sin `status`, elegir en el selector, leer `docs/api.md`
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4)
- [ ] Cierre de rama según `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — Cada reserva tiene un estado → Task 1 (migración + test `Existing_rows_backfill_to_confirmed`). ✓
- ADDED — La API filtra por estado → Task 1 (`Filters_by_status`, `Without_status_returns_all`). ✓
- ADDED — La lista se filtra con un selector → Task 2 (`StatusSelectComponent` + integración en `BookingListComponent`, verificación visual en los dos temas). ✓
- ADDED — La API documenta el filtro → Task 1, Step 6 (`docs/api.md`). ✓
- Decisión de spec "el filtro va en la API, no en el cliente" → Task 2 usa `status` en la URL de `httpResource`, no un `.filter()` local. ✓
- "No entra: cambiar el estado desde la interfaz" → ninguna task añade un endpoint de escritura de estado ni un control para cambiarlo. ✓
