---
id: 20260929-120000-feature-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-29
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort por task** — Task 1 (BD, API y docs): `sdd-kit:effort-medium` + `sonnet`, con la migración y el binding del enum hay que interpretar prosa. Task 2 (selector): `sdd-kit:effort-medium` + `sonnet`, un componente y su cableado. Revisor final de rama: `sdd-kit:effort-high` + `opus`, también con dos tasks.
2. **Ejecución** — Native: dos tasks pequeñas y secuenciales, la 2 consume el contrato de la 1 (`status` como texto), y un implementador fresco por task costaría más que la revisión final que ya cubre la rama.
3. **Dos tasks verticales, no por capas** — la 1 llega hasta la API documentada y se prueba con una petición; la 2 pone el selector sobre ella.
4. **Valores de `status` que la spec no fija** — sin distinguir mayúsculas y minúsculas; vacío = sin filtro; cualquier otro valor, incluidos los numéricos (`1`) y las listas (`Confirmed,Pending`), responde 400. Sin esto `Enum.TryParse` aceptaría `1` y `99`. El 400 es salida observable nueva: valídalo o dime otro comportamiento.
5. **El estado viaja como texto** en el JSON y se guarda como texto en BD (`HasConversion<string>()`): el contrato del selector y de `docs/api.md` es `"Cancelled"`, no un número.
6. **Orden del enum `Confirmed`, `Pending`, `Cancelled`** con `Confirmed` como valor 0: la migración rellena con `Confirmed` las filas existentes y `Booking.Status` se inicializa a `Pending` en C#, valor distinto del por defecto del enum, así EF lo envía y no cae en el valor por defecto de la columna.
7. **Riesgo alto: el repo no trae `Migrations/` ni `Program.cs`.** El Step 1 de la Task 1 comprueba con `dotnet ef migrations list` que hay una migración base; si no la hay, para con `NEEDS_CONTEXT` en lugar de generar el esquema entero como si fuera un cambio.
8. **Riesgo: `tech-stack.md` no tiene `§Frontend`** y la spec lo cambia lo que se ve. La verificación visual de la Task 2 queda «composición no medida: `tech-stack.md` no declara detector en §Frontend» y se hace con capturas; proponer `§Frontend` (detector, Playwright, acceso) es del dev-lead.
9. **Coste estimado** — ~2,5 h, de las que ~40 min son esperar `backend:test` (17–21 min) dos veces: una en segundo plano en la Task 1 y otra en el gate final. Native: unos 2–3 M de tokens de sesión más el revisor final.

**Goal**: cada reserva tiene un estado, `GET /bookings?status=` filtra por él y la lista tiene un selector para elegirlo.

**Architecture**: `Booking.Status` (enum guardado como texto) con una migración que rellena `Confirmed`; el filtro se aplica en la consulta antes de paginar; `app-status-select` es un componente sin lógica de datos que expone el valor elegido y `BookingListComponent` lo pasa como parámetro de `httpResource`.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit con Testcontainers; Angular 20 con signals y `httpResource`, Vitest.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks secuenciales con un contrato compartido pequeño. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Calidad de código (Art. 5 de la constitution, literal): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.
- Estados cerrados, con estos nombres exactos: `Confirmed`, `Pending`, `Cancelled`.
- Las reservas existentes pasan a `Confirmed` en la migración; las nuevas se crean con `Pending`.
- El filtro va en la API (`GET /bookings?status=`), no en el cliente.
- El selector es `app-status-select` con la opción «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.

### De proceso

- Política de modelos (Art. 6): al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Modo de ejecución por defecto: el de la línea `Ejecución`.
- Commits con el ticket `0012` en el mensaje.

## Review Focus

Entradas que la spec no nombra y que ninguno de sus escenarios ejercita, de la más a la menos probable; cada una tiene su test en la task que lleva el código.

1. `status=cancelled` (minúsculas) → debe devolver las canceladas, no un 400 ni una lista vacía. Task 1.
2. `status=1`, `status=99` o `status=Confirmed,Pending` → 400, no un filtro por el valor numérico ni un 500. Task 1.
3. `status=Cancelled&page=2` con 21 canceladas y 1 confirmada → la página 2 tiene 1 reserva; la paginación cuenta sobre el filtrado, no sobre todas. Task 1.
4. El JSON de cada reserva lleva `"status":"Cancelled"` como texto, no `2`; sin eso el selector y `docs/api.md` no coinciden con la API. Task 1.
5. Elegir un estado sin reservas → la lista queda vacía sin error, y si la petición falla el selector se reactiva en vez de quedarse deshabilitado. Task 2.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un enum, un parámetro y un componente; sin librería de formularios ni servicio nuevo.
- [x] **YAGNI gate**: nada se abstrae; `app-status-select` tiene un solo uso y la spec lo fija así.
- [x] **Brownfield gate**: retrocompatible (sin `status` devuelve lo de antes, con el campo nuevo en cada reserva); sigue el patrón de `BookingsEndpoints` y `httpResource`; sin refactor fuera de scope, el `page ≤ 0` existente no se toca.
- [x] **Constitution check**: Art. 2 (gate en §3), Art. 4 (textos en castellano), Art. 5 (helpers pequeños), Art. 6 (modelos declarados).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `BookingStatus { Confirmed, Pending, Cancelled }`.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` — generada con `dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`.
- `frontend/src/app/bookings/status-select.component.ts` — selector `app-status-select`.
- `frontend/src/app/bookings/status-select.component.css` — estilos con las variables de tema existentes.
- `frontend/src/app/bookings/status-select.component.spec.ts` — tests del selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating` con la conversión a texto.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status` y el 400.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro.
- `docs/api.md` — parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — campo `status` y el tipo `BookingStatus`.
- `frontend/src/app/bookings/booking-list.component.ts` — selector y parámetro del recurso.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — tests del filtrado en la lista.

**NO se tocan**:

- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva su propio CSS.
- `moon.yml` y `tech-stack.md` — sin comandos ni stack nuevos.

### 1.2 Modelo de datos

`Booking.Status: BookingStatus`, guardado como `nvarchar` (`HasConversion<string>()`), no nulo. Sin valor por defecto en el modelo: el `Confirmed` de las filas existentes lo pone la migración.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. La columna se añade con `defaultValue: "Confirmed"` para rellenar lo existente.

### 1.4 Contratos API

`GET /bookings?page=<int>&status=<Confirmed|Pending|Cancelled>` → 200 con la lista, cada reserva con `"status": "<valor>"`. `status` inválido → 400. Sin `status` o vacío, todas.

### 1.5 UX

Selector nativo `<select>` con las opciones Todos, Confirmada, Pendiente, Cancelada, encima de la lista. Etiqueta visible «Estado». Deshabilitado mientras carga el recurso. Solo variables de tema ya definidas (`--text`, `--surface`); foco con el contorno del navegador o uno propio con contraste suficiente en los dos temas.

### 1.6 Dependencias

Ninguna nueva. La Task 2 consume el contrato de la Task 1.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| No hay migración base en el repo | Media | Alto | Step 1 de la Task 1 lo comprueba y para |
| `Enum.TryParse` acepta números y listas | Alta | Medio | Validar con `Enum.IsDefined` y rechazar lo que no sea un nombre; test en RED |
| EF usa el valor por defecto de la columna en vez de `Pending` | Media | Alto | `Confirmed` es el 0 del enum y `Status` se inicializa a `Pending`; test de reserva nueva |
| `backend:test` tarda 17–21 min | Cierta | Bajo | «Verificación lenta»: en segundo plano, con vigía de silencio |

### 1.8 Rollout

Directo: la migración se aplica antes de desplegar la API; el frontend nuevo funciona contra la API nueva.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva y filtro en la API

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native, la sesión; esto rige si se retoma con subagentes)
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes del código y sin commitear: van en el commit de la task; Native: TDD del propio hilo

Tests, con el `SeedAsync` y el `CreateClient` de `SqlServerApiFactory` que ya usa el test existente:

- `New_bookings_are_created_as_pending`: se siembra una `Booking` sin `Status` y `GET /bookings` la devuelve con `Status == BookingStatus.Pending`.
- `Migration_backfills_existing_bookings_as_confirmed`: migrar hasta la migración anterior, insertar una fila con SQL y migrar hasta `AddBookingStatus`; `Assert.Equal(BookingStatus.Confirmed, booking.Status)`.
- `Filters_bookings_by_status`: con una reserva por estado, `GET /bookings?status=Cancelled` → una reserva y `Assert.All(bookings, b => Assert.Equal(BookingStatus.Cancelled, b.Status))`.
- `Without_status_returns_all_bookings`: con una por estado, `GET /bookings` → `Assert.Equal(3, bookings.Count)`.
- `Status_filter_ignores_case`: `?status=cancelled` → la misma reserva que `?status=Cancelled`.
- `Unknown_status_returns_bad_request`: `?status=Foo`, `?status=1`, `?status=99`, `?status=Confirmed,Pending` → `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)`.
- `Empty_status_returns_all_bookings`: `?status=` → las tres.
- `Pagination_applies_after_filter`: 21 canceladas y 1 confirmada, `?status=Cancelled&page=2` → `Assert.Single(bookings)`.
- `Status_is_serialized_as_text`: el cuerpo de `GET /bookings?status=Cancelled` contiene `"status":"Cancelled"`.

**Superficies**: BD · backend · docs
**Verificación**: `dotnet build` en `backend/src/Bookings.Api` (step 2); la suite está en «Verificación lenta»
**Verificación lenta**: `moon run backend:test` · 17–21 min; la lanza el hilo principal en segundo plano tras el commit de la task, con su vigía de silencio
**Se prueba en la aplicación**: con la API arrancada (`moon run backend:run`, puerto 5080, tras comprobar que está libre): `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo las canceladas, cada una con `"status": "Cancelled"`; sin `status`, todas; `?status=Foo` da 400.

**Interfaces**:
- Consume: nada.
- Produce: `enum BookingStatus { Confirmed, Pending, Cancelled }` en `Bookings.Api.Data`; `Booking.Status` (`BookingStatus`, por defecto `Pending`); `GET /bookings?status=` con los valores `Confirmed`, `Pending`, `Cancelled` (sin distinguir mayúsculas y minúsculas), y cada reserva con `"status": "<valor>"` en texto.

**Ficheros**: crear `Data/BookingStatus.cs` y la migración; modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs`, `BookingsEndpointsTests.cs`, `docs/api.md`

- [ ] **Step 1: Comprobar la base** — en `backend/src/Bookings.Api`, `dotnet ef migrations list`. Esperado: al menos una migración anterior. Si no hay ninguna, parar y volver con `NEEDS_CONTEXT`: no se genera el esquema entero como si fuera este cambio.
- [ ] **Step 2: Tests RED y su copia** — los tests de arriba escritos y en rojo (no compilan hasta que exista `BookingStatus`); copia fuera del repo para compararla al cerrar.
- [ ] **Step 3: Implementación** —
  - `BookingStatus.cs`: `public enum BookingStatus { Confirmed, Pending, Cancelled }`.
  - `Booking.cs`: `public BookingStatus Status { get; set; } = BookingStatus.Pending;`.
  - `BookingsDb.cs`: `protected override void OnModelCreating(ModelBuilder modelBuilder)` con `modelBuilder.Entity<Booking>().Property(b => b.Status).HasConversion<string>();`.
  - Migración `AddBookingStatus` con `dotnet ef migrations add AddBookingStatus`; en el `AddColumn` de `Status`, `nullable: false, defaultValue: "Confirmed"`.
  - `BookingsEndpoints.cs`: el manejador pasa a `async (BookingsDb db, int page = 1, string? status = null)` y devuelve `IResult`; un helper `internal static bool TryParseStatus(string? raw, out BookingStatus? status)` devuelve `true` con `null` si `raw` es nulo o vacío, y con el estado si `Enum.TryParse(raw, ignoreCase: true, out var parsed)` acierta **y** `raw` no empieza por un dígito ni por signo **y** `Enum.IsDefined(parsed)`. Sin coincidencia → `Results.BadRequest()`. El `Where` por estado va antes de `OrderBy`, `Skip` y `Take`.
  - El JSON escribe el enum como texto: `JsonStringEnumConverter` en `ConfigureHttpJsonOptions` del arranque de la API (el fichero de arranque no está en el repo: si no se encuentra, decorar el enum con `[JsonConverter(typeof(JsonStringEnumConverter))]`).
  - `docs/api.md`: fila `status` en la tabla de `GET /bookings`, tipo «`Confirmed`, `Pending` o `Cancelled`», por defecto «todas», y una línea que dice que cualquier otro valor da 400.
- [ ] **Step 4: Build** — `dotnet build` en `backend/src/Bookings.Api`. Esperado: verde, sin errores.
- [ ] **Step 5: Comparar los RED** — `git diff --no-index` entre la copia y los tests; un cambio que no sea de formato es un ruling del ledger.
- [ ] **Step 6: Commit de la task** — `feat(0012): estado de la reserva y filtro por estado en la API`. Después `task-done` con `dotnet build`, y el hilo lanza `moon run backend:test` en segundo plano; si falla, abre la ronda de fix de esta task.

### Task 2 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos antes del código y sin commitear: van en el commit de la task

Tests:

- `status-select` · `offers Todos, Confirmada, Pendiente and Cancelada with Todos selected`: cuatro `option`, `select.value === ''`.
- `status-select` · `emits the chosen status`: elegir `Cancelled` deja `component.value()` en `'Cancelled'`.
- `status-select` · `is disabled when told so`: con `disabled = true`, `select.disabled === true`.
- `booking-list` · `requests only the chosen status`: elegir Cancelada → `expectOne('/api/bookings?status=Cancelled')`; con Todos, `expectOne('/api/bookings')` sin parámetro.
- `booking-list` · `disables the selector while loading`: antes de `flush`, `select.disabled === true`; tras `flush`, `false`.
- `booking-list` · `re-enables the selector when the request fails`: `flush` con 500 → `select.disabled === false`.
- `booking-list` · `shows an empty list when no booking has that status`: `flush([])` → cero `li` y sin error.

**Superficies**: frontend
**Verificación**: `moon run frontend:test`, `moon run frontend:check`
**Verificación visual**: pantalla de la lista de reservas en `http://localhost:4200` (`moon run frontend:serve`, tras comprobar que el puerto está libre) con la API en 5080 · estados: normal, con foco y deshabilitado (mientras carga; se fuerza con la red en lento) · temas: claro y oscuro · criterio: el selector «Estado» se ve encima de la lista con las opciones Todos, Confirmada, Pendiente y Cancelada; en oscuro el texto y el fondo usan `--text` y `--surface`, con contraste ≥ 4,5:1; el foco se distingue en los dos temas; deshabilitado se distingue del normal. Sin detector declarado: «composición no medida: `tech-stack.md` no declara detector en §Frontend».
**Se prueba en la aplicación**: el usuario abre la lista, elige «Cancelada» en el selector y solo ve las reservas canceladas; vuelve a «Todos» y las ve todas.

**Interfaces**:
- Consume: `GET /api/bookings?status=<Confirmed|Pending|Cancelled>` (proxy de `GET /bookings`), con `status` como texto en cada reserva; sin `status`, todas.
- Produce: `type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'` y `Booking.status: BookingStatus` en `booking.ts`; `StatusSelectComponent` con selector `app-status-select`, `value = model<BookingStatus | ''>('')` y `disabled = input(false)`.

**Ficheros**: crear `status-select.component.ts`, `.css`, `.spec.ts`; modificar `booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`

- [ ] **Step 1: Tests RED y su copia** — los tests de arriba en rojo; copia fuera del repo.
- [ ] **Step 2: Implementación** —
  - `booking.ts`: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';` y `status: BookingStatus` en `Booking`.
  - `status-select.component.ts`: `<label>` «Estado» y `<select>` con `[value]="value()"`, `[disabled]="disabled()"` y `(change)` que escribe `value.set(...)`; las opciones salen de una constante de pares `[valor, etiqueta]` con `['', 'Todos']` primero.
  - `booking-list.component.ts`: `readonly status = signal<BookingStatus | ''>('')`; el recurso pasa a `httpResource<Booking[]>(() => ({ url: '/api/bookings', params: this.status() ? { status: this.status() } : undefined }))`; la plantilla añade `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` encima de la lista.
  - `status-select.component.css`: solo `--text` y `--surface` y un estilo de foco visible; sin colores literales.
- [ ] **Step 3: Verificación** — `moon run frontend:test` y `moon run frontend:check`. Esperado: verde, sin errores de lint ni de `tsc`.
- [ ] **Step 4: Comparar los RED** — `git diff --no-index` contra la copia.
- [ ] **Step 5: Verificación visual** — el hilo mira la lista en un navegador real con Playwright, en 390×844 y 1280×800, una captura por estado y tema; las guarda fuera de git hasta la validación. Para la aplicación por su PID o puerto.
- [ ] **Step 6: Commit de la task** — `feat(0012): selector de estado en la lista de reservas`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los criterios de éxito de la spec (§2): una fila por THEN con `suite`, `ejecución real` o `no probado`; el 400 y el filtro se provocan de verdad contra la API arrancada
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cada reserva tiene un estado» (migración a `Confirmed`, nuevas `Pending`) → Task 1: `Migration_backfills_existing_bookings_as_confirmed`, `New_bookings_are_created_as_pending`. ✓
- ADDED «La API filtra por estado» (con y sin `status`) → Task 1: `Filters_bookings_by_status`, `Without_status_returns_all_bookings`. ✓
- ADDED «La lista se filtra con un selector» (tema claro y oscuro; normal, foco, deshabilitado) → Task 2: tests de la lista y verificación visual. ✓
- ADDED «La API documenta el filtro» → Task 1: `docs/api.md`, comprobado en el smoke leyendo la sección. ✓
- Decisión 1 (tres estados cerrados) → Task 1, `BookingStatus`. ✓
- Decisión 2 (filtro en la API) → Task 1; la Task 2 solo pasa el parámetro. ✓
- Decisión 3 (`app-status-select`, «Todos» por defecto) → Task 2. ✓
- «No entra: cambiar el estado desde la interfaz» → N/A, ningún endpoint de escritura. ✓
- Review Focus 1–4 → Task 1; 5 → Task 2. ✓
