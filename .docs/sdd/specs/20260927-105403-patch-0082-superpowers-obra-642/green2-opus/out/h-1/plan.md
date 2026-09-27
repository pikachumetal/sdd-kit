---
id: 20260927-134630-feature-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: son 2 tasks con un único contrato entre ellas (el campo `status` como texto), así que una sesión que las encadena sale más barata que un implementador y un revisor por task. La revisión independiente llega al final, con el modelo más capaz.
2. **Modelo**: la sesión que ejecuta va bien en gama media (Sonnet, effort medium), porque el plan ya fija el diseño. Para la revisión final: `subagent_type: sdd-kit:effort-high` + `model: opus`; una revisión de rama con migración justifica el tier alto. No hay implementadores despachados.
3. **`status` inválido → 400** (salida observable que la spec no fija): `GET /bookings?status=Foo` o `?status=99` responden `400 Bad Request`, no una lista vacía. Los valores se aceptan sin distinguir mayúsculas y minúsculas (`cancelled` = `Cancelled`).
4. **`status` en la respuesta como texto** (salida observable): cada reserva del JSON lleva `"status": "Confirmed" | "Pending" | "Cancelled"`, no el número del enum. El selector depende de ello.
5. **Etiquetas del selector en castellano** (Art. 4): «Todos», «Confirmada», «Pendiente» y «Cancelada», bajo la etiqueta visible «Estado». La lista no muestra el estado de cada reserva, porque la spec no lo pide.
6. **Selector con `<select>` nativo** dentro de `app-status-select`: foco, teclado y `disabled` los da la plataforma, sin librería.
7. **Migración**: la columna `Status` se guarda como texto (`nvarchar(16)`), y la migración la crea con `defaultValue: "Confirmed"` para rellenar las filas existentes. Las reservas nuevas salen con `Pending` porque es el valor inicial de la propiedad en C#, no un default del modelo EF.
8. **Riesgo alto: no sé cómo se crea el esquema.** En el árbol no aparecen `Program.cs`, `SqlServerApiFactory` ni la carpeta `Migrations/`. Si no hay historial de migraciones (el esquema sale de `EnsureCreated`), aplicar una migración en una BD real falla, porque la tabla ya existe. En ese caso la Task 1 para antes de crear la migración y lo pregunta: es el rollout de la BD, no un ruling.
9. **Coste estimado**: unas 3 h de implementación. La mayor parte del reloj se va en la suite de backend (17-21 min) y en la verificación visual. En tokens, una sesión en Sonnet más una revisión final en Opus.

**Goal**: guardar el estado de cada reserva, filtrar `GET /bookings` por estado y elegirlo en la lista con un selector.

**Architecture**: un enum `BookingStatus` persistido como texto con una migración EF, un parámetro de query opcional en el endpoint, que filtra antes de paginar, y un componente `app-status-select` que alimenta la URL del `httpResource` de la lista. El filtro va en el servidor porque la lista está paginada.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit con Testcontainers · Angular 20 (signals, `httpResource`), Vitest con jsdom · moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks con un solo contrato entre ellas y un fallo lo detecta la revisión final antes del merge. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Tres estados cerrados: `Confirmed`, `Pending`, `Cancelled`; las reservas existentes pasan a `Confirmed` en la migración.
- El filtro va en la API (`GET /bookings?status=`), no en el cliente: la lista está paginada.
- El selector es un componente propio, `app-status-select`, con la opción «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.
- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Ejecución native: la sesión implementa las dos tasks con `superpowers:executing-plans` y su ledger. Solo se despacha la revisión final.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con referencia a 0012; un commit por hito (`commit-milestones.md`), sin `--no-verify`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: `<select>` nativo, parámetro de query opcional y una sola migración.
- [x] **YAGNI gate**: ninguna abstracción nueva; el componente propio lo pide la spec.
- [x] **Brownfield gate**: `GET /bookings` sin `status` responde lo mismo que hoy, solo añade el campo `status`; `page` no cambia.
- [x] **Constitution check**: Art. 2 en §3, Art. 3 (rama `feature/0012`), Art. 4 (etiquetas), Art. 5 (en «De código») y Art. 6 (modelos declarados).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — el enum y su serialización como texto.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ designer y snapshot) — la columna `Status`.
- `backend/tests/Bookings.Tests/BookingStatusMigrationTests.cs` — el relleno de las filas existentes.
- `frontend/src/app/bookings/status-select.component.ts` / `.css` / `.spec.ts` — el selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — la propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — la conversión a texto.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — el parámetro `status`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — los tests del filtro.
- `docs/api.md` — el parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — el tipo `BookingStatus`.
- `frontend/src/app/bookings/booking-list.component.ts` / `.spec.ts` — el selector y la URL.

**NO se tocan**:

- `moon.yml` — los comandos ya existen.
- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva sus propios estilos.

### 1.2 Modelo de datos

`Bookings.Status`: `nvarchar(16) NOT NULL`, con los valores `Confirmed`, `Pending` y `Cancelled`.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. En el `AddColumn` generado, cambia `defaultValue: ""` por `defaultValue: "Confirmed"`.

### 1.4 Contratos API

`GET /bookings?page=<int>&status=<Confirmed|Pending|Cancelled>`. `status` es opcional y no distingue mayúsculas y minúsculas. Un valor que no es un estado responde 400. La respuesta es la de hoy, con `"status": "<estado>"` en cada reserva.

### 1.5 UX

`<label>Estado <select>` con «Todos» (valor vacío, por defecto), «Confirmada», «Pendiente» y «Cancelada». Mientras la lista carga, el `<select>` está `disabled`.

### 1.6 Dependencias

Ninguna nueva. `JsonStringEnumConverter<T>` viene de `System.Text.Json`, que ya está en el runtime.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Sin historial de migraciones (esquema por `EnsureCreated`) | media | alto | La Task 1 lo comprueba antes de crear la migración y, si falta, para y pregunta (decisión 8). |
| La BD de tests es compartida por la clase: las reservas de un test se ven en otro | alta | medio | Cada test siembra con `Room` propio y comprueba por `Room` o `Id`, nunca por recuento total. |
| Un `Enum.TryParse` sin `IsDefined` acepta `"99"` | media | medio | Hay un test que exige 400 para `status=99`. |
| El tema oscuro no se activa en el navegador de verificación | baja | bajo | Emular `prefers-color-scheme: dark` o poner la clase o el atributo de tema que use la app; se anota cuál. |

### 1.8 Rollout

La migración se aplica con el despliegue del backend, antes que el frontend. El frontend nuevo contra un backend viejo solo ignora el filtro.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD y filtro en la API

**Modelo**: la propia sesión (Native), en gama media: Sonnet, effort medium. No se despacha.
**Tests RED**: el hilo principal, con TDD, en `backend/tests/Bookings.Tests/BookingStatusMigrationTests.cs` y `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`. Guarda una copia fuera del repo antes del código.
**Superficies**: BD · backend · docs
**Verificación**: `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingsEndpointsTests|FullyQualifiedName~BookingStatusMigrationTests"` (los tests de la task; el arranque del contenedor tarda unos minutos).
**Se prueba en la aplicación**: con `moon run backend:run`, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo reservas con `"status": "Cancelled"`, `GET /bookings` las devuelve todas, cada una con su `status`, y `GET /bookings?status=Foo` responde 400.

**Interfaces**:
- Consume: nada.
- Produce: `enum BookingStatus { Confirmed, Pending, Cancelled }` en `Bookings.Api.Data`, serializado como texto; `Booking.Status`; `GET /bookings?status=` según el contrato de abajo.

Contrato: `GET /bookings?page=<int>&status=<Confirmed|Pending|Cancelled>`. `status` es opcional y no distingue mayúsculas y minúsculas. Un valor que no es un estado definido responde 400. Cada reserva del JSON lleva `"status": "<estado>"`.

**Ficheros**: crear `Data/BookingStatus.cs`, la migración `AddBookingStatus` y `BookingStatusMigrationTests.cs`; modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs`, `BookingsEndpointsTests.cs` y `docs/api.md`.

- [ ] **Step 0: Comprobar el esquema** — mira cómo crean el esquema `Program.cs` y `SqlServerApiFactory`: `Database.MigrateAsync()` o `EnsureCreated`, y si existe `Migrations/`. Sin historial de migraciones, para y pregunta antes de seguir (decisión 8 del plan).
- [ ] **Step 1: Tests RED** — cada test siembra con su propio `Room`:
  - `Existing_bookings_become_confirmed_when_migrating`: en una BD nueva del mismo contenedor, `IMigrator.MigrateAsync("<migración anterior>")`, un `INSERT` en SQL crudo de una reserva con `Room = "Sala previa"`, después `MigrateAsync()` y `Assert.Equal(BookingStatus.Confirmed, booking.Status)`. Si `SqlServerApiFactory` no expone la cadena de conexión del contenedor, añádele `public string ConnectionString`.
  - `New_bookings_are_created_pending`: siembra sin `Status`, lee de la BD y `Assert.Equal(BookingStatus.Pending, booking.Status)`.
  - `Filters_bookings_by_status`: siembra una reserva por estado y hace `GET /bookings?status=Cancelled`; `Assert.All(result, b => Assert.Equal(BookingStatus.Cancelled, b.Status))` y contiene la cancelada sembrada.
  - `Returns_all_statuses_without_filter`: `GET /bookings` contiene los tres `Id` sembrados.
  - `Accepts_status_in_any_case`: `?status=cancelled` → 200, con la cancelada sembrada.
  - `Rejects_unknown_status` (theory: `Foo`, `99`): `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)`.
  - `Serializes_status_as_text`: el JSON crudo de `GET /bookings?status=Pending` contiene `"status":"Pending"`.
- [ ] **Step 2: Implementación**:
  - `BookingStatus.cs`: `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))] public enum BookingStatus { Confirmed, Pending, Cancelled }`.
  - `Booking.cs`: `public BookingStatus Status { get; set; } = BookingStatus.Pending;`.
  - `BookingsDb.cs`: en `OnModelCreating`, `Property(b => b.Status).HasConversion<string>().HasMaxLength(16)`, sin `HasDefaultValue`.
  - La migración, como en §1.3: `defaultValue: "Confirmed"`.
  - `BookingsEndpoints.cs`: `MapGet("/bookings", (BookingsDb db, int page = 1, string? status = null))`. Parsea con `Enum.TryParse<BookingStatus>(status, ignoreCase: true, …)` más `Enum.IsDefined`; si no es un estado, `Results.BadRequest()`. Filtra antes de `OrderBy`/`Skip`/`Take`.
  - `docs/api.md`: una fila `status` | texto: `Confirmed`, `Pending` o `Cancelled`, sin distinguir mayúsculas | todas. Debajo, una frase: un valor que no es un estado responde 400, y cada reserva de la respuesta lleva su `status`.
- [ ] **Step 3: Build** — `dotnet build backend`. Esperado: sin errores ni warnings nuevos.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: 8 tests en verde (7 nuevos más `Lists_bookings_ordered_by_start`).
- [ ] **Step 5: Commit de la task** — `feat(backend): estado de la reserva y filtro por estado en GET /bookings (0012)`.

### Task 2 — Selector de estado en la lista

**Modelo**: la propia sesión (Native), en gama media: Sonnet, effort medium. No se despacha.
**Tests RED**: el hilo principal, con TDD, en `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`. Guarda una copia fuera del repo antes del código.
**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`
**Verificación visual**: lista de reservas en `http://localhost:4200`, con el backend de la Task 1 en `:5080` · estados normal, con foco (Tab) y deshabilitado (mientras carga: red lenta o respuesta retenida) · temas claro y oscuro · qué mirar: texto del select y de la etiqueta sobre `--surface` con contraste ≥ 4,5:1; indicador de foco visible, con contraste ≥ 3:1; deshabilitado distinguible del normal, con el texto ≥ 3:1; la etiqueta y el select alineados en su línea base y con la misma separación al borde de la lista en los dos temas. Una captura por estado y tema, 6 en total.
**Se prueba en la aplicación**: el usuario abre la lista, elige «Cancelada» en «Estado» y ve solo las reservas canceladas; vuelve a «Todos» y ve todas.

**Interfaces**:
- Consume: `GET /api/bookings?status=<Confirmed|Pending|Cancelled>`, donde cada reserva lleva `status` como texto; sin `status`, devuelve todas.
- Produce: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'` y `Booking.status: BookingStatus` en `booking.ts`; el componente `app-status-select` con `value = model<BookingStatus | null>(null)` y `disabled = input(false)`.

**Ficheros**: crear `status-select.component.ts` / `.css` / `.spec.ts`; modificar `booking.ts`, `booking-list.component.ts` y `booking-list.component.spec.ts`.

- [ ] **Step 1: Tests RED**:
  - `status-select`: `it('offers Todos selected by default and the three states')`: las opciones son `['Todos', 'Confirmada', 'Pendiente', 'Cancelada']` y `select.value === ''`. `it('emits the chosen state')`: cambiar a `Cancelled` deja `value()` en `'Cancelled'`, y volver a vacío lo deja en `null`. `it('disables the select when disabled')`: con `disabled = true`, `select.disabled === true`.
  - `booking-list`: `it('requests the chosen status')`: al elegir `Cancelled`, `expectOne('/api/bookings?status=Cancelled')`, y se pintan los `li` de la respuesta. `it('requests all bookings with Todos')`: `expectOne('/api/bookings')`; es el test que ya existe y sigue igual. `it('disables the selector while loading')`: antes del `flush`, `select.disabled === true`, y después, `false`.
- [ ] **Step 2: Implementación**:
  - `status-select.component.ts`: `selector: 'app-status-select'`, un `<label>` «Estado» que envuelve un `<select>` nativo con las cuatro opciones de arriba (valor `''` para «Todos»). Estilos con `var(--text)`, `var(--surface)` y `:focus-visible`.
  - `booking-list.component.ts`: `status = signal<BookingStatus | null>(null)`; `httpResource<Booking[]>(() => ({ url: '/api/bookings', params: <status o vacío> }))`; `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` encima de la lista.
- [ ] **Step 3: Build** — `moon run frontend:check`. Esperado: sin errores.
- [ ] **Step 4: Verificación** — los comandos de «Verificación», en verde. Después, la verificación visual del hilo, con Playwright (el MCP o un script con el paquete `playwright`): las medidas en estilos computados y las 6 capturas fuera de git. La app se para por su PID o su puerto.
- [ ] **Step 5: Commit de la task** — `feat(frontend): selector de estado en la lista de reservas (0012)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (incluye `backend:test`, de 17 a 21 min: se lanza en segundo plano) y `moon run frontend:check`.
- [ ] Smoke por THEN de la spec, con evidencia `ejecución real` para la API (incluido provocar el 400) y para el selector.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado (las existentes pasan a `Confirmed` y las nuevas se crean con `Pending`) → Task 1: `Existing_bookings_become_confirmed_when_migrating` y `New_bookings_are_created_pending`. ✓
- La API filtra por estado; sin `status`, las devuelve todas → Task 1: `Filters_bookings_by_status` y `Returns_all_statuses_without_filter`. ✓
- La lista se filtra con un selector → Task 2: `requests the chosen status`. ✓
- Claro y oscuro, en los estados normal, con foco y deshabilitado (mientras carga) → Task 2: `disables the selector while loading` más la verificación visual. ✓
- La API documenta `status` y sus tres valores → Task 1, Step 2 (`docs/api.md`). ✓
- Cambiar el estado desde la interfaz → N/A (fuera del Scope). ✓
- Review Focus (la spec no los fija; los cubren tests): `status` con otras mayúsculas o minúsculas, `status` inválido o numérico, `status` en la respuesta como texto, BD de tests compartida (siembra por `Room`), el filtro antes de paginar (lo cubre `Filters_bookings_by_status` con reservas de otros tests en la BD).
