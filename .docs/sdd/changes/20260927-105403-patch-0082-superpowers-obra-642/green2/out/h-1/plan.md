---
id: 20260923-090000-feature-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: `sdd-kit:effort-medium` + `model: sonnet` en las 3 tasks — ninguna exige juicio arquitectónico (opus) y ninguna es puro mecánico (low): cambio de esquema, filtro con validación y un componente nuevo piden interpretar la spec.
2. Ejecución: **subagent-driven**, porque el nombre del estado se repite en dos lenguajes de la pila (enum de C# y literal de TypeScript) y hay una migración de datos: una revisión independiente por task atrapa un desajuste de nombre o un backfill mal hecho antes de que llegue a la siguiente task, cosa que una única revisión final no haría a tiempo.
3. Decisión técnica que la spec no fija: el estado se guarda en BD como `nvarchar` vía `HasConversion<string>()`, no como `int`, para que el valor de la query (`?status=Cancelled`) y el de BD sean el mismo literal sin tabla de traducción.
4. Riesgo alto: el backfill de reservas antiguas a `Confirmed` depende del `defaultValueSql` de la migración (nivel BD), no de código de aplicación — ningún test unitario de C# lo cubre, solo el test de integración de la Task 1.
5. Coste estimado: ~4h de implementación (migración + filtro con 4 tests + componente nuevo con 2 tests), en 3 subagentes effort medium.

**Goal**: cada reserva guarda un estado (`Confirmed` | `Pending` | `Cancelled`) filtrable desde la API y desde un selector en la lista.

**Architecture**: columna `Status` en `Bookings` con backfill a nivel de BD (`defaultValueSql`) para no tocar código de aplicación para las filas viejas; el endpoint existente añade un parámetro `status` opcional; el frontend añade un componente de selector que controla la query del `httpResource` ya existente.

**Tech Stack**: backend .NET 9 minimal API + EF Core 9 / SQL Server; frontend Angular 20 con signals; ver `.docs/sdd/tech-stack.md`.

**Spec**: `./spec.md`

**Ejecución**: subagent, porque el motivo de la decisión 2 de arriba (nombres duplicados entre lenguajes + migración de datos) pide una revisión fresca por task, no una sola al final.

## Restricciones globales

### De código

- Tres estados cerrados y sus nombres exactos: `Confirmed`, `Pending`, `Cancelled` (spec, decisión 1).
- El filtro vive en la API (`GET /bookings?status=`), nunca en el cliente (spec, decisión 2).
- El selector es un componente propio `app-status-select`, opción por defecto "Todos" (spec, decisión 3).
- Texto de interfaz y de documentos en castellano (constitution, art. 4); los nombres de código (enum, propiedades, selectores) van en inglés.
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (constitution, art. 5).

### De proceso

- Gama media (Sonnet, effort medium) como suelo para revisores e implementadores (constitution, art. 6).
- Rama `feature/0012` desde `develop`, ya creada.
- El gate completo (`moon run :test`, `moon run frontend:check`) corre una vez, en la validación final — no en cada task (constitution, art. 2, aplicado con las superficies de cada task).

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: sí — una columna, un parámetro de query, un componente. Sin capas nuevas.
- [ ] **YAGNI gate**: no se abstrae nada con menos de 3 usos (el enum tiene exactamente los 3 valores que fija la spec).
- [ ] **Brownfield gate**: retrocompatible (`GET /bookings` sin `status` sigue devolviendo todo); sigue el patrón existente (minimal API, `httpResource`, un fichero por endpoint/componente).
- [ ] **Constitution check**: arts. 2, 4, 5 y 6 respetados (ver Restricciones globales).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Confirmed | Pending | Cancelled`.
- `frontend/src/app/bookings/booking-status.ts` — tipo `BookingStatus` y la lista de opciones del selector (con "Todos").
- `frontend/src/app/bookings/status-select.component.ts` (+ `.css`) — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.spec.ts` — sus tests.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating` con la conversión a string.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status` en `GET /bookings`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro y del backfill.
- `docs/api.md` — documenta el parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — añade `status: BookingStatus`.
- `frontend/src/app/bookings/booking-list.component.ts` (+ `.css`, `.spec.ts`) — usa el selector y filtra la petición.

**NO se tocan**:

- `frontend/src/app/bookings/booking-list.component.css` estructura general — solo se añade la fila del selector, sin rehacer el layout existente.

### 1.2 Modelo de datos

Columna nueva `Bookings.Status nvarchar(20) NOT NULL`, con `defaultValueSql`/`defaultValue` de migración `'Confirmed'` (para que las filas sin valor explícito, es decir las anteriores a la migración, lean `Confirmed`) y valor por defecto en el modelo C# `BookingStatus.Pending` (para que toda fila nueva que inserte la aplicación lleve `Pending`, aunque el default de columna sea otro: EF Core siempre envía el valor explícito en el INSERT).

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. La migración generada añade la columna con `defaultValue: "Confirmed"` (o `defaultValueSql` equivalente); `Down()` la elimina.

### 1.4 Contratos API

`GET /bookings?status=<Confirmed|Pending|Cancelled>` (case-insensitive). Sin `status`: todas las reservas, igual que hoy. Con `status` que no coincide con ningún valor del enum: `400 Bad Request`, sin cuerpo. Con `status` válido: mismo shape de respuesta que hoy (`List<Booking>`, ahora con el campo `status`), filtrado y paginado igual que antes.

### 1.5 UX

Selector `app-status-select` en la cabecera de la lista: un `<select>` con las opciones "Todos" (valor por defecto), "Confirmada", "Pendiente", "Cancelada". Deshabilitado mientras `bookings.isLoading()` es `true`. Estilos con las variables de tema ya usadas (`var(--text)`, `var(--surface)`), visibles y usables en claro y oscuro, en estado normal, con foco y deshabilitado.

### 1.6 Dependencias

Ninguna (autocontenida dentro de la feature 0012).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El backfill de reservas antiguas no aplica por un `defaultValue` mal escrito en la migración | Baja | Alto (datos incorrectos) | Test de integración de Task 1 que inserta una fila sin `Status` explícito y comprueba que se lee como `Confirmed` |
| Selector ilegible o inusable en tema oscuro (primer componente de este tipo en el repo, sin patrón previo) | Media | Medio (UX) | Verificación visual manual en los dos temas y los tres estados antes de cerrar la Task 3 |

### 1.8 Rollout

Directo: la migración se aplica al desplegar, junto con el resto del cambio. Sin toggle.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva en BD

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes de despachar, sin commitear (van en el commit de la task)

```csharp
[Fact]
public void New_booking_defaults_to_pending()
{
    var booking = new Booking { Room = "Sala 1", Start = default, End = default };
    Assert.Equal(BookingStatus.Pending, booking.Status);
}

[Fact]
public async Task Existing_rows_without_explicit_status_backfill_to_confirmed()
{
    using var scope = factory.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<BookingsDb>();
    await db.Database.ExecuteSqlRawAsync(
        "INSERT INTO Bookings (Room, Start, [End], Owner) VALUES ('Sala 9', '2026-01-01T09:00', '2026-01-01T10:00', 'x')");

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

    Assert.Contains(bookings!, b => b.Room == "Sala 9" && b.Status == BookingStatus.Confirmed);
}
```

**Superficies**: BD, backend
**Verificación**: `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingsEndpointsTests"` — esperado: verde
**Verificación lenta**: mismo comando de arriba · estimado 5–15 min (arranque de Testcontainers); lo lanza el hilo principal en segundo plano mientras corre la revisión de la task
**Se prueba en la aplicación**: no, porque es una migración de datos sin cambio visible: la Task 3 es la que se prueba de punta a punta.

**Interfaces**:
- Consume: nada
- Produce: `BookingStatus` (enum: `Confirmed`, `Pending`, `Cancelled`) en `Bookings.Api.Data`; `Booking.Status` (tipo `BookingStatus`, default C# `Pending`); columna `Bookings.Status nvarchar(20) NOT NULL DEFAULT 'Confirmed'`

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`; modificar `backend/src/Bookings.Api/Data/Booking.cs`, `backend/src/Bookings.Api/Data/BookingsDb.cs`, `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`; crear la migración con `dotnet ef migrations add AddBookingStatus`

- [ ] **Step 1: Implementación** — `BookingStatus` enum con los tres valores en ese orden. En `Booking.cs`, añade `public BookingStatus Status { get; set; } = BookingStatus.Pending;`. En `BookingsDb.cs`, añade `protected override void OnModelCreating(ModelBuilder modelBuilder)` con `modelBuilder.Entity<Booking>().Property(b => b.Status).HasConversion<string>();`. Genera la migración `AddBookingStatus` y edita `Up()` para que el `AddColumn` lleve `defaultValue: "Confirmed"` (tipo `nvarchar(20)`, `nullable: false`); `Down()` elimina la columna.
- [ ] **Step 2: Build** — `dotnet build backend/src/Bookings.Api`. Esperado: verde, sin errores.
- [ ] **Step 3: Verificación** — comando de arriba. Esperado: los dos tests nuevos en verde.
- [ ] **Step 4: Commit de la task** — uno solo, tras revisión limpia.

---

### Task 2 — La API filtra por estado

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes de despachar, sin commitear

```csharp
[Fact]
public async Task Filters_bookings_by_status()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Cancelled },
        new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 10, 0, 0), End = new(2026, 9, 1, 11, 0, 0), Status = BookingStatus.Confirmed });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=Cancelled");

    var single = Assert.Single(bookings!);
    Assert.Equal("Sala 1", single.Room);
}

[Fact]
public async Task Returns_all_statuses_without_filter()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Cancelled },
        new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 10, 0, 0), End = new(2026, 9, 1, 11, 0, 0), Status = BookingStatus.Confirmed });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

    Assert.Equal(2, bookings!.Count);
}

[Fact]
public async Task Status_filter_is_case_insensitive()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Pending });

    var response = await factory.CreateClient().GetAsync("/bookings?status=pending");

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    Assert.Single((await response.Content.ReadFromJsonAsync<List<Booking>>())!);
}

[Fact]
public async Task Returns_bad_request_for_unknown_status()
{
    var response = await factory.CreateClient().GetAsync("/bookings?status=Foo");

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
}
```

> Review Focus: valor de `status` desconocido → 400 (no 500 ni lista vacía); `status` en minúsculas → filtra igual, sin 400. Los dos, cubiertos arriba.

**Superficies**: backend, docs
**Verificación**: `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingsEndpointsTests"` — esperado: verde (6 tests: los 2 de Task 1 + estos 4)
**Verificación lenta**: mismo comando · estimado 5–15 min (arranque de Testcontainers)
**Se prueba en la aplicación**: no, porque es infraestructura de API sin cambio visible: la Task 3 la consume y se prueba de punta a punta ahí.

**Interfaces**:
- Consume: `Booking.Status` y `BookingStatus` de la Task 1
- Produce: `GET /bookings?status=<Confirmed|Pending|Cancelled>` (case-insensitive; sin parámetro = todas; valor inválido = `400`); `docs/api.md` documentando ese parámetro

**Ficheros**: modificar `backend/src/Bookings.Api/BookingsEndpoints.cs`, `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, `docs/api.md`

- [ ] **Step 1: Implementación** — cambia la firma de `MapGet("/bookings", ...)` a `async Task<Results<Ok<List<Booking>>, BadRequest>> (BookingsDb db, int page = 1, string? status = null)` (añade `using Microsoft.AspNetCore.Http.HttpResults;`). Con `status` no nulo, `Enum.TryParse<BookingStatus>(status, ignoreCase: true, out var parsed)`; si falla, `TypedResults.BadRequest()`; si acierta, filtra `Where(b => b.Status == parsed)` antes de `OrderBy`/`Skip`/`Take` ya existentes. Añade a `docs/api.md` una fila `status` en la tabla de parámetros (tipo: uno de `Confirmed`, `Pending`, `Cancelled`; por defecto: vacío = todas) y una frase sobre el `400` en valor inválido, en castellano.
- [ ] **Step 2: Build** — `dotnet build backend/src/Bookings.Api`. Esperado: verde.
- [ ] **Step 3: Verificación** — comando de arriba. Esperado: los 6 tests en verde.
- [ ] **Step 4: Commit de la task** — uno solo, tras revisión limpia.

---

### Task 3 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos antes de despachar, sin commitear

```typescript
// status-select.component.spec.ts
it('empieza en "Todos" y cambia el status al elegir una opción', () => {
  const fixture = TestBed.createComponent(StatusSelectComponent);
  fixture.detectChanges();

  const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
  select.value = 'Cancelled';
  select.dispatchEvent(new Event('change'));
  fixture.detectChanges();

  expect(fixture.componentInstance.status()).toBe('Cancelled');
});

it('se deshabilita cuando disabled es true', () => {
  const fixture = TestBed.createComponent(StatusSelectComponent);
  fixture.componentRef.setInput('disabled', true);
  fixture.detectChanges();

  const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
  expect(select.disabled).toBe(true);
});
```

```typescript
// booking-list.component.spec.ts — añadir al fichero existente
it('pide las reservas filtradas por el estado elegido', async () => {
  const fixture = TestBed.createComponent(BookingListComponent);
  fixture.detectChanges();
  TestBed.inject(HttpTestingController).expectOne('/api/bookings').flush([]);
  await fixture.whenStable();

  const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
  select.value = 'Cancelled';
  select.dispatchEvent(new Event('change'));
  fixture.detectChanges();

  TestBed.inject(HttpTestingController)
    .expectOne('/api/bookings?status=Cancelled')
    .flush([{ id: 1, room: 'Sala 1', start: '2026-09-01T09:00', status: 'Cancelled' }]);
  await fixture.whenStable();
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
});
```

> Review Focus: el selector debe verse y usarse igual en tema claro/oscuro y en normal/foco/deshabilitado (spec) — sin test automático (es visual); cubierto por la Verificación visual de abajo, no omitirla.

**Superficies**: frontend
**Verificación**: `moon run frontend:test`, `moon run frontend:check` — esperado: verde
**Verificación visual**: lista de reservas, con el selector visible · estados normal / foco (`Tab` hasta el `<select>`) / deshabilitado (mientras `bookings.isLoading()`) · temas claro y oscuro · mirar contraste y que la opción "Todos" sea la marcada al cargar
**Se prueba en la aplicación**: sí — el usuario abre la lista, elige "Cancelada" en el selector y ve solo las reservas canceladas; vuelve a "Todos" y las ve todas.

**Interfaces**:
- Consume: contrato de la Task 2 (`GET /bookings?status=<Confirmed|Pending|Cancelled>`, sin parámetro = todas)
- Produce: `StatusSelectComponent` (`app-status-select`), `model<BookingStatus | null>('status')`, `input<boolean>('disabled')`; `BookingListComponent.status: WritableSignal<BookingStatus | null>`

**Ficheros**: crear `frontend/src/app/bookings/booking-status.ts`, `frontend/src/app/bookings/status-select.component.ts`, `frontend/src/app/bookings/status-select.component.css`, `frontend/src/app/bookings/status-select.component.spec.ts`; modificar `frontend/src/app/bookings/booking.ts`, `frontend/src/app/bookings/booking-list.component.ts`, `frontend/src/app/bookings/booking-list.component.css`, `frontend/src/app/bookings/booking-list.component.spec.ts`

- [ ] **Step 1: Implementación** — `booking-status.ts`: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';` y `export const BOOKING_STATUS_OPTIONS: { value: BookingStatus | null; label: string }[]` con `{ value: null, label: 'Todos' }` primero y las tres opciones en castellano (`Confirmada`, `Pendiente`, `Cancelada`). `booking.ts`: añade `status: BookingStatus;`. `StatusSelectComponent` (standalone, selector `app-status-select`): `status = model<BookingStatus | null>(null)`, `disabled = input<boolean>(false)`, plantilla `<select>` con `@for` sobre `BOOKING_STATUS_OPTIONS`, `[disabled]="disabled()"`, `(change)` actualiza `status`. `BookingListComponent`: añade `status = signal<BookingStatus | null>(null)`, cambia el `httpResource` para que su factory devuelva la URL con `?status=<valor>` solo si `status()` no es `null`, añade `<app-status-select [(status)]="status" [disabled]="bookings.isLoading()" />` en la plantilla.
- [ ] **Step 2: Build** — `moon run frontend:check`. Esperado: verde, sin errores de lint ni de tipos.
- [ ] **Step 3: Verificación** — `moon run frontend:test`. Esperado: todos los tests en verde (los nuevos y los existentes).
- [ ] **Step 4: Commit de la task** — uno solo, tras revisión limpia y verificación visual hecha.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los 4 escenarios de la spec (§Delta de comportamiento)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — Cada reserva tiene un estado → Task 1. ✓
- ADDED — La API filtra por estado → Task 2. ✓
- ADDED — La lista se filtra con un selector → Task 3. ✓
- ADDED — La API documenta el filtro → Task 2 (Step 1, `docs/api.md`). ✓
- Decisión 1 (tres estados cerrados, backfill a `Confirmed`) → Task 1. ✓
- Decisión 2 (filtro en API, no en cliente) → Task 2 (el frontend de Task 3 solo consume el parámetro, no filtra localmente). ✓
- Decisión 3 (`app-status-select`, opción "Todos" por defecto) → Task 3. ✓
- No entra: cambiar el estado desde la interfaz → ninguna task lo añade (confirmado en spec, Scope). ✓
