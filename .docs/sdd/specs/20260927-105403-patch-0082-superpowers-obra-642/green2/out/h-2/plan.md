---
id: 20260923-090000-task-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Sonnet, effort medium en las dos tasks (suelo del Art. 6 de la constitution; prosa a interpretar, no arreglo mecánico) — revisor final: Sonnet, effort high (por debajo de Opus/xhigh, siguiendo "el modelo más barato que resuelva bien"; se confirma contigo antes de despachar la revisión).
2. Ejecución: **native** — solo 2 tasks, con el contrato del query param ya fijado aquí (Interfaces de la Task 1), y un error no sale caro; `subagent-driven-development` doblaría el coste sin necesidad. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final. Si esta sesión se retomó tras una compactación y quedan tasks sin `complete` en el ledger, no las hagas tú: despacha las que quedan con `subagent-driven-development` sobre el mismo ledger.
3. `Status` se guarda como enum `BookingStatus` (Pending, Confirmed, Cancelled) convertido a `string` en EF Core — el valor de texto es el que ya usa el filtro (`?status=Cancelled`), sin tabla de traducción de por medio.
4. `status` inválido en la query (no es uno de los tres valores, comparación sensible a mayúsculas como en el ejemplo de la spec) → `400 Bad Request`. La spec no lo fija; devolver la lista vacía escondería un typo del cliente de la API.
5. `ponytail:` el backfill de la migración (reservas previas → `Confirmed`) se valida con smoke manual en el cierre, no con un test automatizado — la fixture de test actual (`SqlServerApiFactory`) migra siempre a la última versión y no ofrece parar en una migración intermedia para sembrar una fila "de antes". Techo: si otra feature necesita repetir este patrón, vale la pena añadir a la fixture el control de migración parcial y sí automatizarlo.
6. Riesgo alto: ninguno (feature acotada, sin tocar lo existente salvo añadir una columna y un parámetro opcional).
7. Coste estimado: ~3-4 h de implementación (2 tasks pequeñas) + revisión final.

**Goal**: Que la lista de reservas se pueda filtrar por estado (`Confirmed` / `Pending` / `Cancelled`), con el estado guardado en BD, filtrado en la API y un selector en la pantalla.

**Architecture**: Se añade una columna `Status` a `Bookings` (migración con backfill a `Confirmed` para las filas existentes). El endpoint `GET /bookings` acepta un `status` opcional y filtra en el propio query de EF Core. El frontend añade un componente `app-status-select` que emite el estado elegido; `BookingListComponent` lo usa para recomponer la URL que consume `httpResource`.

**Tech Stack**: Monorepo moon — `backend/` .NET 9 minimal API + EF Core 9 sobre SQL Server (migración con `dotnet ef`); `frontend/` Angular 20 con signals y `httpResource`, tema claro/oscuro por variables CSS.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Tres estados cerrados: `Confirmed`, `Pending`, `Cancelled` — ni más ni menos, en ese naming exacto (spec, decisión 1).
- El filtro vive en la API (`GET /bookings?status=`), nunca en el cliente (spec, decisión 2).
- El selector es un componente propio con selector `app-status-select` (spec, decisión 3).
- Texto de interfaz y de documentos en castellano (constitution Art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; el revisor marca el incumplimiento como Important (constitution Art. 5).

### De proceso

- Gama media (Sonnet, effort medium) como suelo para implementadores y revisores; el revisor final puede subir de tier, nunca por debajo del suelo (constitution Art. 6).
- Ejecución: native (ver Decisiones que he tomado yo, punto 2).
- Mensajes de commit: tipo/scope en inglés, título y cuerpo en castellano, término técnico en inglés (convención del dev-lead).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — una columna, un parámetro de query, un componente. Sin capa nueva.
- [x] **YAGNI gate**: sin abstracciones nuevas; el enum tiene sus tres únicos usos (modelo, filtro, selector).
- [x] **Constitution check**: respeta Art. 1 (spec→plan), Art. 2 (gate de cierre en §3), Art. 4 (castellano en UI/docs), Art. 5 (calidad de código), Art. 6 (modelos).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Pending`, `Confirmed`, `Cancelled`.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` — generada con `dotnet ef migrations add AddBookingStatus`.
- `frontend/src/app/bookings/status-select.component.ts` + `.css` — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.spec.ts` — tests del selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating`: conversión de `Status` a `string`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status` opcional, filtro, 400 si es inválido.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro.
- `frontend/src/app/bookings/booking.ts` — añade `status`.
- `frontend/src/app/bookings/booking-list.component.ts` — usa `app-status-select`, recompone la URL de `httpResource`.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — test del filtrado end-to-end del componente.
- `docs/api.md` — documenta el parámetro `status`.

**NO se tocan**:

- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva su propio CSS; la lista no cambia de estilo.

### 1.2 Modelo de datos

Columna `Status` (`nvarchar`, NOT NULL) en `Bookings`, mapeada desde `BookingStatus` (`Pending` = 0, `Confirmed` = 1, `Cancelled` = 2) con `HasConversion<string>()` para que el valor en BD y en la query (`?status=Cancelled`) sean el mismo literal.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. La `Up()` generada añade la columna con `defaultValue: nameof(BookingStatus.Confirmed)`: backfillea las filas existentes a `Confirmed` (spec, THEN 1). Las altas nuevas por EF ya escriben `Pending` explícito porque `Booking.Status` lo fija en el propio modelo (`= BookingStatus.Pending`), así que no hace falta un segundo default de columna para las filas futuras.

### 1.4 Contratos API

`GET /bookings?page=&status=`:
- Sin `status`: se comporta como hoy, devuelve las tres estados.
- `status` = uno de `Confirmed` | `Pending` | `Cancelled` (coincidencia exacta, como en el ejemplo de la spec): filtra por ese valor.
- `status` con cualquier otro texto: `400 Bad Request`.
- Cada reserva de la respuesta incluye ahora `status`.

### 1.5 UX

`app-status-select`: un `<select>` con "Todos" (valor vacío, por defecto), "Confirmada" (`Confirmed`), "Pendiente" (`Pending`) y "Cancelada" (`Cancelled`) — etiquetas en castellano, valores en el literal del enum. Deshabilitado mientras `BookingListComponent` está cargando. Vive sobre la lista, en `booking-list.component.ts`.

### 1.6 Dependencias

Ninguna nueva; se apoya en la lista con paginación ya cerrada (v0.4.0).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Backfill de la migración no probado por test automatizado | baja | medio | smoke manual documentado en el cierre (ver Decisiones que he tomado yo, punto 5) |
| `status` inválido devuelto como lista vacía en vez de error, si se olvida el `TryParse` | baja | bajo | test RED explícito (`Rejects_invalid_status_with_bad_request`) en la Task 1 |

### 1.8 Rollout

Directo: la migración se aplica al desplegar el backend: no hay toggle ni orden especial.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD y filtro en la API

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes de despachar

- `Filters_bookings_by_status`: siembra una reserva `Confirmed`, una `Pending` y una `Cancelled`; `GET /bookings?status=Cancelled`; `Assert.Single(bookings)` y `Assert.Equal(BookingStatus.Cancelled, bookings[0].Status)`.
- `Returns_all_statuses_when_status_omitted`: mismas tres reservas; `GET /bookings` sin `status`; `Assert.Equal(3, bookings.Count)`.
- `Rejects_invalid_status_with_bad_request`: `GET /bookings?status=Bogus` con `HttpClient.GetAsync`; `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)`.

**Superficies**: BD · backend · docs
**Verificación**: ninguna además de la lenta (docs se revisa a mano, sin comando)
**Verificación lenta**: `moon run backend:test`, 17–21 min — lo lanza el hilo principal en segundo plano al entregar la task
**Se prueba en la aplicación**: sí — con `moon run backend:run`, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo las reservas canceladas.

**Interfaces**:
- Consume: nada (extiende el `GET /bookings` ya existente).
- Produce: `GET /bookings?status={Confirmed|Pending|Cancelled}` (parámetro opcional, exacto, 400 si no es uno de los tres); cada `Booking` de la respuesta incluye `status: string`.

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`, `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs`; modificar `backend/src/Bookings.Api/Data/Booking.cs`, `backend/src/Bookings.Api/Data/BookingsDb.cs`, `backend/src/Bookings.Api/BookingsEndpoints.cs`, `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, `docs/api.md`

- [ ] **Step 1: Implementación**
  - `BookingStatus` (enum): `Pending`, `Confirmed`, `Cancelled`.
  - `Booking.cs`: añade `public BookingStatus Status { get; set; } = BookingStatus.Pending;`.
  - `BookingsDb.cs`: añade `protected override void OnModelCreating(ModelBuilder modelBuilder)` con `modelBuilder.Entity<Booking>().Property(b => b.Status).HasConversion<string>();`.
  - Migración: `dotnet ef migrations add AddBookingStatus`; edita la `Up()` generada para que `AddColumn<string>` lleve `defaultValue: nameof(BookingStatus.Confirmed)`.
  - `BookingsEndpoints.cs`: `MapGet("/bookings", async (BookingsDb db, int page = 1, string? status = null) => ...)` — si `status` no es `null` y `Enum.TryParse<BookingStatus>(status, out var parsed)` falla, `Results.BadRequest()`; si acierta, añade `.Where(b => b.Status == parsed)` a la query antes de paginar.
  - `docs/api.md`: añade una fila a la tabla de `GET /bookings` — `status` | uno de `Confirmed`, `Pending`, `Cancelled` | (sin filtro) — y una frase explicando el 400.
- [ ] **Step 2: Build** — `dotnet build` en `backend/`. Esperado: verde, sin errores.
- [ ] **Step 3: Verificación** — lanza `moon run backend:test` en segundo plano (Verificación lenta); mientras corre, revisa a mano el diff de `docs/api.md`.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia la revisión y con `backend:test` en verde.

### Task 2 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos antes de despachar

- `status-select.component.spec.ts` → `shows "Todos" selected by default`: renderiza el componente, `expect(select.value).toBe('')`.
- `status-select.component.spec.ts` → `emits the chosen status`: selecciona `Cancelada`, espera que `statusChange` emita `'Cancelled'`.
- `status-select.component.spec.ts` → `disables while loading`: `fixture.componentRef.setInput('disabled', true)`, `expect(select.disabled).toBe(true)`.
- `booking-list.component.spec.ts` → `filters the list when a status is chosen`: monta `BookingListComponent`, selecciona `Cancelada` en `app-status-select`, `HttpTestingController.expectOne('/api/bookings?status=Cancelled')`.

**Superficies**: frontend
**Verificación**: `moon run frontend:test` (~40 s), `moon run frontend:check` (~30 s)
**Verificación visual**: pantalla de lista de reservas · selector en estados normal, con foco y deshabilitado (mientras `bookings` carga) · tema claro y tema oscuro · qué mirar: contraste del texto sobre `var(--surface)`, alineación y separación a los bordes de la lista.
**Se prueba en la aplicación**: sí — con `moon run frontend:serve` + `moon run backend:run`, en `http://localhost:4200` se elige "Cancelada" en el selector y la lista muestra solo las reservas canceladas.

**Interfaces**:
- Consume: `GET /bookings?status={Confirmed|Pending|Cancelled}` y el campo `status` de `Booking` (Task 1).
- Produce: nada que otra task consuma.

**Ficheros**: crear `frontend/src/app/bookings/status-select.component.ts`, `.css`, `.spec.ts`; modificar `frontend/src/app/bookings/booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`

- [ ] **Step 1: Implementación**
  - `booking.ts`: añade `status: 'Confirmed' | 'Pending' | 'Cancelled';` a `Booking`.
  - `status-select.component.ts`: `@Component({ selector: 'app-status-select', ... })`, `input<boolean>(false)` para `disabled`, `output<string | null>()` llamado `statusChange`; opciones `<option value="">Todos</option>`, `<option value="Confirmed">Confirmada</option>`, `<option value="Pending">Pendiente</option>`, `<option value="Cancelled">Cancelada</option>`; emite `statusChange` en `(change)`, con `null` si el valor es `""`.
  - `booking-list.component.ts`: añade `readonly status = signal<string | null>(null);`; cambia `httpResource<Booking[]>(() => ...)` para que la URL sea `` /api/bookings${this.status() ? `?status=${this.status()}` : ''} ``; añade `<app-status-select [disabled]="bookings.isLoading()" (statusChange)="status.set($event)" />` antes de la `<ul>`.
- [ ] **Step 2: Build** — `moon run frontend:check`. Esperado: verde, sin errores de lint ni de tipos.
- [ ] **Step 3: Verificación** — `moon run frontend:test` y `moon run frontend:check`, ambos en verde; verificación visual en navegador con tema claro y oscuro.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia la revisión.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check` (constitution Art. 2).
- [ ] Verificación de los cuatro THEN de la spec (migración, filtro de API, selector, docs).
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — Cada reserva tiene un estado (migración con backfill) → Task 1. ✓
- ADDED — La API filtra por estado → Task 1. ✓
- ADDED — La lista se filtra con un selector (temas, estados normal/foco/deshabilitado) → Task 2. ✓
- ADDED — La API documenta el filtro → Task 1 (docs/api.md, misma superficie backend). ✓
- Tipos consistentes: `BookingStatus` (backend) y el union type de `booking.ts` usan los mismos tres literales (`Confirmed`, `Pending`, `Cancelled`) en Task 1 y Task 2. ✓
