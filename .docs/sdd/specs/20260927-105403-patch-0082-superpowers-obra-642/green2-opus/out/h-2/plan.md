---
id: 20260927-134644-task-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Riesgo alto: el checkout no compila tal cual.** En git y en disco faltan `Program.cs`, los `.csproj`, `SqlServerApiFactory`, la carpeta `Migrations/` y el workspace de Angular (`angular.json`, `package.json`). Antes de la Task 1 hay que confirmar que existen en `develop` o en otro sitio; si hay que crearlos, agranda el Scope y es un desvío (`## Enmiendas`), no un ruling.
2. **Dos tasks**: Task 1 lleva BD, API y `docs/api.md`; Task 2 lleva el selector. La Task 1 se puede probar en la aplicación por HTTP (`GET /bookings?status=` es una superficie pública documentada), así que no es partir por capas sin nada que probar.
3. **Ejecución: Native**, recomendada por el handoff: son 2 tasks, la segunda solo consume el nombre del parámetro `status` y sus tres valores, y un fallo se detecta en la revisión final de rama. Revisión final: `sdd-kit:effort-high` + `model: opus`.
4. **Modelo de la sesión**: esta sesión va en Opus 5.5. En Native la sesión implementa las dos tasks y va bien en gama media: cambia a Sonnet con effort medium (`/model`) antes de la Task 1.
5. **Estado guardado como texto** (`HasConversion<string>()`, longitud máxima 16), no como entero: la columna se entiende sin el código y el orden del enum deja de importar.
6. **Backfill de la migración**: la migración `AddBookingStatus`, generada con `dotnet ef migrations add`, se edita a mano para que `AddColumn` lleve `defaultValue: "Confirmed"`. Así las filas existentes quedan `Confirmed`. Las nuevas salen `Pending` por el inicializador de la entidad (`Status = BookingStatus.Pending`). Límite: un `INSERT` en SQL que no pase por EF recibe `Confirmed` por el default de la columna.
7. **Contrato del parámetro `status`** (la spec no lo fija, cambia la salida observable): acepta solo los tres nombres, sin distinguir mayúsculas; si viene vacío, se trata como ausente; si trae otro valor, incluido un número como `1`, la API responde `400` con el texto `status debe ser Confirmed, Pending o Cancelled`. La respuesta JSON lleva `status` como texto (`"Cancelled"`), con `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))]` sobre el enum, para no tocar `Program.cs`.
8. **Textos del selector** (castellano, Art. 4): etiqueta «Estado»; opciones «Todos», «Confirmada», «Pendiente» y «Cancelada». La spec solo fija «Todos».
9. **Selector nativo**: `app-status-select` envuelve un `<select>` con `<label>`, sin librería. El foco, el teclado y la accesibilidad los da el navegador. El CSS usa solo las variables de tema que ya existen (`--text`, `--surface`).
10. **Coste estimado**: ~3,5 h de implementación, de las que ~20 min son la suite de backend de la Task 1 y ~20 min el gate de cierre. La revisión final en Opus cuesta del orden de 1-3 $.

**Goal**: guardar el estado de cada reserva, filtrar `GET /bookings` por `status` y añadir el selector `app-status-select` a la lista.

**Architecture**: un enum `BookingStatus` en la entidad, guardado como texto, con una migración que rellena las filas existentes. El endpoint filtra antes de paginar. La lista de Angular pasa el valor del selector como query param de su `httpResource`, así el filtro sigue en el servidor aunque la lista esté paginada.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit con Testcontainers; Angular 20 con signals y `httpResource`, Vitest con jsdom; moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks casi independientes (la Task 2 solo consume el parámetro `status`) y el diseño va entero en el plan. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Tres estados cerrados: `Confirmed`, `Pending`, `Cancelled`; las reservas existentes pasan a `Confirmed` en la migración.
- El filtro va en la API (`GET /bookings?status=`), no en el cliente: la lista está paginada.
- El selector es un componente propio, `app-status-select`, con la opción «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.
- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores. `fable` y `opus xhigh` no se usan sin justificación escrita.
- Ejecución: native (ver cabecera).
- Commits: `feat(backend): …` / `feat(frontend): …`, título y cuerpo en castellano, referenciando 0012, con la línea `Co-Authored-By` de la sesión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: `<select>` nativo, enum con conversión a texto, sin capa de servicio nueva.
- [x] **YAGNI gate**: sin abstracción nueva, salvo el componente que pide la spec.
- [x] **Brownfield gate**: `GET /bookings` sin `status` responde lo mismo que hoy, con el campo `status` añadido; la paginación de 20 no cambia.
- [x] **Constitution check**: Art. 2 se cumple con la verificación de cada task y el gate completo va en §3; Art. 4 (castellano) y Art. 5 (calidad) están en «De código»; Art. 6 está en «De proceso».

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (y su `.Designer.cs`) — columna `Status` con backfill `Confirmed`.
- `backend/tests/Bookings.Tests/BookingStatusTests.cs` — escenarios de estado, filtro y migración.
- `frontend/src/app/bookings/status-select.component.ts` + `.css` + `.spec.ts` — el selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — enum `BookingStatus` y propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating` con la conversión a texto.
- `backend/src/Bookings.Api/Migrations/BookingsDbModelSnapshot.cs` — lo regenera `dotnet ef`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status`, filtro y 400.
- `docs/api.md` — parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — tipo `BookingStatus`.
- `frontend/src/app/bookings/booking-list.component.ts` y su `.spec.ts` — selector y query param.

**NO se tocan**:

- `Program.cs` — el enum se serializa como texto con un atributo, no con la configuración global.
- `moon.yml` — sin tareas nuevas.
- `booking-list.component.css` — el estilo del selector va en su propio componente.

### 1.2 Modelo de datos

`Bookings.Status`: `nvarchar(16) NOT NULL`, valores `Confirmed` | `Pending` | `Cancelled`.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`; editar `AddColumn` para que lleve `defaultValue: "Confirmed"`.

### 1.4 Contratos API

`GET /bookings?page=<int>&status=<Confirmed|Pending|Cancelled>`
- `200`: lista de reservas, cada una con `"status": "<nombre>"`.
- `400`: `status debe ser Confirmed, Pending o Cancelled`.

### 1.5 UX

Etiqueta «Estado» y un `<select>` sobre la lista, con «Todos» seleccionado al abrir. Mientras carga la lista, el selector está deshabilitado.

### 1.6 Dependencias

Ninguna nueva. Hacen falta los ficheros de proyecto de la decisión 1.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Faltan `Program.cs`, `.csproj`, `SqlServerApiFactory`, `Migrations/` y el workspace de Angular | alta (confirmado en este checkout) | bloquea la Task 1 | comprobar `develop` antes de la Task 1; si hay que crearlos, es un desvío |
| No hay migración anterior (la BD se crea con `EnsureCreated`) | media | el test de backfill no puede migrar «desde antes» | si pasa, es freno: la spec pide migración sobre datos existentes |
| `SqlServerApiFactory` comparte la BD entre los tests de una clase | alta | los recuentos fallan | aserciones por sala única y `Assert.All`, nunca por recuento global |
| Mecanismo del tema (clase o `prefers-color-scheme`) desconocido | media | la verificación visual no alterna el tema | mirarlo en el `styles.css` global al arrancar la Task 2 |

### 1.8 Rollout

Directo. La migración se aplica en el despliegue del backend, antes que el frontend.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva y filtro en la API

**Modelo**: Native, lo hace la sesión (gama media: Sonnet, effort medium). Si se despacha tras una compactación: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingStatusTests.cs`, escritos antes del código y sin commitear, con copia fuera del repo.
**Superficies**: BD · backend · docs
**Verificación**: `dotnet build backend/tests/Bookings.Tests`
**Verificación lenta**: `moon run backend:test` · 17-21 min
**Se prueba en la aplicación**: con `moon run backend:run`, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo reservas con `"status": "Cancelled"`; sin `status` las devuelve todas; `?status=Archived` responde 400.

**Interfaces**:
- Consume: nada.
- Produce: `GET /bookings?status=<Confirmed|Pending|Cancelled>`; campo JSON `status` como texto; 400 si el valor no es uno de los tres.

**Ficheros**: `Data/Booking.cs`, `Data/BookingsDb.cs`, `Migrations/*`, `BookingsEndpoints.cs`, `docs/api.md`, `tests/Bookings.Tests/BookingStatusTests.cs`.

- [ ] **Step 1: Tests RED** en `BookingStatusTests(SqlServerApiFactory factory) : IClassFixture<SqlServerApiFactory>`. Cada test siembra salas con nombre único (`$"S-{Guid.NewGuid()}"`):
  - `Existing_bookings_become_confirmed_after_migration`: migra la BD a la migración anterior a `AddBookingStatus` (`IMigrator.MigrateAsync("<anterior>")`), inserta una fila con SQL, migra hasta el final → `Assert.Equal(BookingStatus.Confirmed, stored.Status)`.
  - `New_bookings_are_created_pending`: guarda `new Booking { Room = room, … }` con EF y lo relee → `Assert.Equal(BookingStatus.Pending, stored.Status)`.
  - `Filters_by_status`: siembra una sala por estado y pide `/bookings?status=Cancelled` → `Assert.All(result, b => Assert.Equal(BookingStatus.Cancelled, b.Status))` y `Assert.Contains(result, b => b.Room == cancelledRoom)`.
  - `Returns_all_statuses_without_filter`: `/bookings` contiene las tres salas sembradas.
  - `Status_filter_ignores_case`: `/bookings?status=cancelled` contiene `cancelledRoom`.
  - `Empty_status_returns_all`: `/bookings?status=` contiene las tres salas.
  - `Rejects_unknown_status` con `[Theory]` y los valores `"Archived"` y `"1"` → `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)`.
  - `Serializes_status_as_text`: el cuerpo de `/bookings?status=Cancelled` contiene `"status":"Cancelled"`.
- [ ] **Step 2: Implementación**
  - `Booking.cs`: `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))] public enum BookingStatus { Confirmed, Pending, Cancelled }`; en `Booking`, `public BookingStatus Status { get; set; } = BookingStatus.Pending;`.
  - `BookingsDb.cs`: `OnModelCreating` → `Property(b => b.Status).HasConversion<string>().HasMaxLength(16)`.
  - Migración `AddBookingStatus`: generarla y poner `defaultValue: "Confirmed"` en `AddColumn`.
  - `BookingsEndpoints.cs`: `app.MapGet("/bookings", ListBookings)` con `static async Task<IResult> ListBookings(BookingsDb db, int page = 1, string? status = null)`: filtra (`Where`) antes de `OrderBy`/`Skip`/`Take`. Helper `static bool TryParseStatus(string? value, out BookingStatus? status)`: vacío o nulo da `true` con `null`; los tres nombres sin distinguir mayúsculas; los números no son nombres. Si falla → `Results.BadRequest("status debe ser Confirmed, Pending o Cancelled")`.
  - `docs/api.md`: fila `status` en la tabla (`Confirmed`, `Pending` o `Cancelled`; sin distinguir mayúsculas; por defecto, todas) y una línea que dice que otro valor responde 400.
- [ ] **Step 3: Build** — `dotnet build backend/tests/Bookings.Tests`. Esperado: verde.
- [ ] **Step 4: Verificación** — la verificación lenta, `moon run backend:test`: la lanza el hilo principal en segundo plano. Esperado: los 9 casos nuevos y `Lists_bookings_ordered_by_start` en verde.
- [ ] **Step 5: Commit de la task** — `feat(backend): estado de la reserva y filtro por estado en GET /bookings (0012)`.

### Task 2 — Selector de estado en la lista

**Modelo**: Native, lo hace la sesión (gama media: Sonnet, effort medium). Si se despacha tras una compactación: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `booking-list.component.spec.ts`, escritos antes del código y sin commitear, con copia fuera del repo.
**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`
**Verificación visual**: la lista de reservas (`moon run frontend:serve`, `http://localhost:4200`; `/api/bookings` interceptado con `page.route` para no depender de SQL Server y para retrasar la respuesta en el estado deshabilitado) · estados normal, con foco (Tab) y deshabilitado (mientras carga) · temas claro y oscuro · mirar: contraste del texto del selector con su fondo ≥ 4,5:1, contraste del borde y del indicador de foco con el fondo de la página ≥ 3:1, indicador de foco visible (`outline-width` > 0), selector alineado con el borde izquierdo de la lista, y deshabilitado distinguible del estado normal.
**Se prueba en la aplicación**: en la lista, el usuario elige «Cancelada» y ve solo las reservas canceladas; vuelve a «Todos» y las ve todas.

**Interfaces**:
- Consume: `GET /api/bookings?status=<Confirmed|Pending|Cancelled>` (proxy a `GET /bookings` de la Task 1); sin `status`, todas.
- Produce: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';` en `booking.ts`; componente `app-status-select` con `value = model<BookingStatus | ''>('')` y `disabled = input(false)`.

**Ficheros**: crear `status-select.component.ts`, `.css` y `.spec.ts`; modificar `booking.ts`, `booking-list.component.ts` y `booking-list.component.spec.ts`.

- [ ] **Step 1: Tests RED**
  - `status-select.component.spec.ts` › `offers «Todos» and the three states`: los textos de las opciones son `['Todos', 'Confirmada', 'Pendiente', 'Cancelada']`, los valores `['', 'Confirmed', 'Pending', 'Cancelled']`, y el seleccionado al crear es `''`.
  - › `is labelled «Estado»`: el `<select>` tiene una `<label>` asociada con el texto `Estado`.
  - `booking-list.component.spec.ts` › `requests all bookings with «Todos»`: la primera petición a `/api/bookings` tiene `req.request.params.has('status') === false`.
  - › `filters the list by the chosen status`: tras hacer flush de la primera, pone `select.value = 'Cancelled'` y lanza `change` → `expectOne(r => r.url === '/api/bookings' && r.params.get('status') === 'Cancelled')`; flush de 1 reserva → `querySelectorAll('li').length === 1`.
  - › `disables the selector while loading`: antes del flush, `select.disabled === true`; después, `false`.
  - El test que ya existe (`lists the bookings returned by the API`) sigue en verde sin cambios.
- [ ] **Step 2: Implementación**
  - `booking.ts`: el tipo `BookingStatus`.
  - `StatusSelectComponent` (selector `app-status-select`), con plantilla inline como `booking-list`: `<label>Estado <select [disabled]="disabled()" (change)="…">` con las cuatro opciones de arriba; estilos en `status-select.component.css` solo con `var(--text)` y `var(--surface)`, `:focus-visible` con `outline` y `:disabled` distinguible.
  - `BookingListComponent`: `readonly status = signal<BookingStatus | ''>('')`; `httpResource<Booking[]>(() => ({ url: '/api/bookings', params: this.status() ? { status: this.status() } : {} }))`; en la plantilla, `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` sobre la `<ul>`.
- [ ] **Step 3: Build** — `moon run frontend:check`. Esperado: verde.
- [ ] **Step 4: Verificación** — `moon run frontend:test`. Esperado: los 5 casos nuevos y el existente en verde. Después, la verificación visual en el hilo principal.
- [ ] **Step 5: Commit de la task** — `feat(frontend): selector de estado en la lista de reservas (0012)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (incluye backend, ~20 min) y `moon run frontend:check`.
- [ ] Verificación de cada THEN de la spec con ejecución real (API arrancada y lista en el navegador).
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4).
- [ ] Cierre de rama con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cada reserva tiene un estado» (backfill `Confirmed`, nuevas `Pending`) → Task 1 (`Existing_bookings_become_confirmed_after_migration`, `New_bookings_are_created_pending`). ✓
- ADDED «La API filtra por estado» (solo canceladas; sin `status`, todas) → Task 1 (`Filters_by_status`, `Returns_all_statuses_without_filter`). ✓
- ADDED «La lista se filtra con un selector» (filtra; temas y estados normal, foco y deshabilitado) → Task 2 (tests + verificación visual). ✓
- ADDED «La API documenta el filtro» → Task 1, Step 2 (`docs/api.md`). ✓
- No entra «cambiar el estado desde la interfaz» → ninguna task lo toca. ✓
- Casos que la spec no nombra (mayúsculas, valor vacío, valor desconocido o numérico, serialización como texto) → Task 1, con tests propios (decisión 7). ✓
