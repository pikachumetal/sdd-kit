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

1. Modelo y effort de las dos tasks: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` — hay que interpretar prosa (migración con backfill, componente accesible en dos temas), sin código ya escrito; el art. 6 de la constitution fija gama media como suelo.
2. Ejecución: **native** — solo 2 tasks con dependencia secuencial estricta (el frontend consume el endpoint que crea el backend), sin paralelismo real que aproveche subagentes; la sesión ya corre en Sonnet (gama media), así que no hace falta reservar un modelo más capaz para el final.
3. Decisión técnica que la spec no fija: `Status` se persiste como **string** (`HasConversion<string>()`), no como índice numérico — el mismo nombre (`Cancelled`, `Pending`, `Confirmed`) viaja por query, JSON y BD sin tabla de traducción.
4. Riesgo alto: la migración hace un backfill (`UPDATE` masivo) sobre datos existentes — es irreversible sin backup. Mitigación en Rollout.
5. Coste estimado: ~5,5 h (Task 1 ~3 h, Task 2 ~2,5 h); sin despacho a subagentes no hay coste adicional en tokens.

**Goal**: permitir filtrar la lista de reservas por estado (confirmada, pendiente, cancelada) desde la API y desde un selector en la pantalla.

**Architecture**: se añade un estado a `Booking` persistido como string; `GET /bookings` acepta `status` opcional y lo aplica antes de paginar; el frontend añade un componente `app-status-select` que controla un signal consumido por el `httpResource` existente de la lista.

**Tech Stack**: backend .NET 9 minimal API + EF Core 9 sobre SQL Server (`backend/src/Bookings.Api`); frontend Angular 20 con signals (`frontend/src/app/bookings`); moon como task runner.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks dependientes en línea (backend → frontend) y la sesión ya va en gama media.

## Restricciones globales

### De código

- Tres estados cerrados: `Pending`, `Confirmed`, `Cancelled` (spec, decisión 1) — sin añadir un cuarto valor.
- El filtro vive en la API (`GET /bookings?status=`), nunca en el cliente (spec, decisión 2).
- El selector es un componente propio `app-status-select`, con «Todos» como opción por defecto (spec, decisión 3).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).
- Funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (constitution, art. 5).
- Texto de interfaz y documentos en castellano (constitution, art. 4).

### De proceso

- Gama media (Sonnet, effort medium) como suelo para implementador y revisor (constitution, art. 6).
- Ejecución nativa para esta feature (ver decisión 2 de arriba); sin despacho a subagentes.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, referenciando `0012`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — enum + columna string, sin capa de traducción extra.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos; no se añade endpoint de cambio de estado (fuera de scope).
- [x] **Constitution check**: respeta art. 2 (todo verde al cerrar cada task), art. 4 (castellano), art. 5 (calidad de código), art. 6 (gama media).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Pending`, `Confirmed`, `Cancelled`.
- `frontend/src/app/bookings/status-select.component.ts` — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.css` — estilos con variables CSS de tema, igual que `booking-list.component.css`.
- `frontend/src/app/bookings/status-select.component.spec.ts` — test del selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating` con la conversión a string.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status` opcional en `GET /bookings`.
- `backend/src/Bookings.Api/Program.cs` — enums como string en la serialización JSON (`JsonStringEnumConverter`).
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — test del filtro.
- `docs/api.md` — documenta `status`.
- `frontend/src/app/bookings/booking.ts` — añade `status` a `Booking`.
- `frontend/src/app/bookings/booking-list.component.ts` — usa `app-status-select` y filtra el `httpResource`.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — cubre el filtrado.

**NO se tocan**:

- La paginación (`page`) de `GET /bookings` — se combina con el filtro sin cambiar su contrato actual.
- No se crea endpoint de creación ni de cambio de estado — la spec lo excluye explícitamente (Scope, «No entra»).

### 1.2 Modelo de datos

`Booking` gana `public BookingStatus Status { get; set; } = BookingStatus.Pending;`. Columna `nvarchar` vía `HasConversion<string>()`, sin longitud máxima especial (el valor más largo, `Confirmed`, cabe en cualquier default).

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. Tras generarla, editar el `Up()`: después del `AddColumn` con default `'Pending'`, añadir `migrationBuilder.Sql("UPDATE Bookings SET Status = 'Confirmed'");` para que las reservas anteriores a la migración queden `Confirmed` (spec, escenario 1) y las que se creen después mantengan el default `Pending`.

### 1.4 Contratos API

`GET /bookings?status={Pending|Confirmed|Cancelled}` (opcional, combinable con `page`). Sin `status`, comportamiento actual (todas, paginadas). Con un valor fuera de los tres, ASP.NET Core minimal API responde 400 por fallo de binding del enum — no hace falta validación manual.

### 1.5 UX

`app-status-select`: un `<select>` nativo con las cuatro opciones (`Todos` + los tres estados), «Todos» seleccionado por defecto. Estados a cubrir en el CSS con variables de tema (igual patrón que `--text`/`--surface`): normal, con foco (`:focus-visible`), deshabilitado (`:disabled`, mientras `bookings.isLoading()`).

### 1.6 Dependencias

Ninguna nueva: EF Core y Angular ya están en el stack.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El `UPDATE` de backfill se aplica sobre una BD sin backup reciente | Baja | Alto | Probar la migración en local contra una copia antes del despliegue (Rollout) |
| Un cliente externo de la API asumía que `status` no existía y rompe al recibir el campo nuevo en el JSON | Baja | Medio | Es un campo añadido, no uno modificado; no rompe contratos existentes |

### 1.8 Rollout

Directo: la migración se aplica al desplegar el backend (igual que las anteriores); no hay toggle. Antes de desplegar a un entorno con datos reales, ejecutar la migración contra una copia para confirmar el backfill.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva en BD y filtro en la API

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` (nuevo `[Fact] Filters_bookings_by_status`), escritos antes de despachar, sin commitear.

**Superficies**: BD · backend · docs
**Verificación**: `moon run backend:test`
**Verificación lenta**: `moon run backend:test` · 17-21 min — se lanza en segundo plano al entregar la task.
**Se prueba en la aplicación**: sí, con un cliente HTTP (sin pantalla propia todavía): con `moon run backend:run` levantado, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo las reservas canceladas; sin `status`, las devuelve todas igual que hoy.

**Interfaces**:
- Consume: nada.
- Produce: `GET /bookings` acepta `status` opcional (`Pending` | `Confirmed` | `Cancelled`); el JSON de cada reserva incluye `"status": "<valor>"` como string. `Booking.Status` (backend) es `BookingStatus`.

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`; modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs`, `Program.cs`, `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, `docs/api.md`.

- [ ] **Step 1: Test RED** — en `BookingsEndpointsTests.cs`, `Filters_bookings_by_status`: siembra una reserva `Cancelled` y una `Confirmed` (via `factory.SeedAsync`, igual que el test existente pero fijando `Status`), pide `GetFromJsonAsync<List<Booking>>("/bookings?status=Cancelled")` y comprueba que la lista devuelta tiene 1 elemento con `Room` de la cancelada.
- [ ] **Step 2: Implementación** — `BookingStatus` enum (`Pending`, `Confirmed`, `Cancelled`); `Booking.Status` con default `BookingStatus.Pending`; en `BookingsDb.OnModelCreating`, `modelBuilder.Entity<Booking>().Property(b => b.Status).HasConversion<string>();`; en `BookingsEndpoints.MapBookings`, añadir parámetro `BookingStatus? status = null` y `.Where(b => status == null || b.Status == status)` antes del `OrderBy`; en `Program.cs`, `builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));`. Migración: `dotnet ef migrations add AddBookingStatus` y editar el `Up()` según §1.3. En `docs/api.md`, añadir a la tabla de `GET /bookings` la fila `status` (opcional, valores `Pending` / `Confirmed` / `Cancelled`).
- [ ] **Step 3: Build** — compila el backend. Esperado: sin errores.
- [ ] **Step 4: Verificación** — `moon run backend:test`. Esperado: verde, incluido `Filters_bookings_by_status`.
- [ ] **Step 5: Commit de la task** — un commit, tras revisión limpia: `feat(backend): filtrar reservas por estado en la API #0012`.

### Task 2 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y ampliación de `booking-list.component.spec.ts`, escritos antes de despachar, sin commitear.

**Superficies**: frontend
**Verificación**: `moon run frontend:test`, `moon run frontend:check`
**Verificación visual**: pantalla `booking-list` (`http://localhost:4200`) · estados normal, con foco, deshabilitado (mientras `bookings.isLoading()`) · temas claro y oscuro · qué mirar: alineación del selector con la lista, separación a bordes, contraste del texto sobre `--surface` en ambos temas.
**Se prueba en la aplicación**: sí — con `moon run frontend:serve` y el backend de la Task 1 corriendo, el usuario abre la lista, elige «Cancelada» en el selector y ve solo las reservas canceladas; al volver a «Todos» ve todas otra vez.

**Interfaces**:
- Consume: `GET /bookings?status=` de la Task 1; `Booking` (backend) sirve `status` como string (`Pending` | `Confirmed` | `Cancelled`).
- Produce: `app-status-select` con `input()` `value: 'all' | 'Pending' | 'Confirmed' | 'Cancelled'` (default `'all'`) y `output()` `valueChange: EventEmitter<'all' | 'Pending' | 'Confirmed' | 'Cancelled'>`.

**Ficheros**: crear `status-select.component.ts`, `status-select.component.css`, `status-select.component.spec.ts`; modificar `booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`.

- [ ] **Step 1: Test RED** — `status-select.component.spec.ts`: renderiza el componente, comprueba que la opción por defecto es «Todos», que cambiar el `<select>` a «Cancelada» emite `valueChange` con `'Cancelled'`, y que con `disabled` a `true` el `<select>` queda deshabilitado. En `booking-list.component.spec.ts`, un test nuevo que simula elegir «Cancelada» en el selector y comprueba que la petición HTTP siguiente es a `/api/bookings?status=Cancelled`.
- [ ] **Step 2: Implementación** — `Booking` (frontend) gana `status: 'Pending' | 'Confirmed' | 'Cancelled'`. `StatusSelectComponent`: `<select>` con las opciones `Todos` (`value=""`), `Pendiente`, `Confirmada`, `Cancelada`; `input()` `value`, `input()` `disabled`, `output()` `valueChange`. `BookingListComponent`: un signal `status = signal<'all' | ...>('all')`; `httpResource` pasa a `() => ({ url: '/api/bookings', params: { status: status() === 'all' ? undefined : status() } })`; el template añade `<app-status-select [value]="status()" [disabled]="bookings.isLoading()" (valueChange)="status.set($event)" />` antes de la lista.
- [ ] **Step 3: Build** — `moon run frontend:check`. Esperado: sin errores de lint ni de tipos.
- [ ] **Step 4: Verificación** — `moon run frontend:test`. Esperado: verde.
- [ ] **Step 5: Commit de la task** — un commit, tras revisión limpia: `feat(frontend): selector de estado en la lista de reservas #0012`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`.
- [ ] Verificación de los criterios de éxito de la spec (los cuatro escenarios de «Delta de comportamiento»).
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado (migración + backfill) → Task 1. ✓
- La API filtra por estado → Task 1. ✓
- La lista se filtra con un selector → Task 2. ✓
- La API documenta el filtro → Task 1 (`docs/api.md`). ✓
- «No entra: cambiar el estado desde la interfaz» → ninguna task añade un endpoint ni un control de escritura de estado. ✓
