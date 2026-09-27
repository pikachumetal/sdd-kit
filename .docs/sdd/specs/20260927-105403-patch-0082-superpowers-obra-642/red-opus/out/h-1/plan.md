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

1. **Dos tasks, partidas por superficie**: Task 1 lleva la BD, la API y `docs/api.md`, y Task 2 el selector y la lista. La orientación del kit es hacer tasks verticales, pero aquí la Task 1 se puede probar sola contra la API (`GET /bookings?status=Cancelled` en `http://localhost:5080`). Además, `backend:test` tarda entre 17 y 21 min, y partir evita que la task de frontend dependa de esa suite.
2. **Ejecución Native**: son 2 tasks y comparten un solo contrato, el campo `status` como string. Un fallo en ese contrato se ve en la Task 2 y en la revisión final. La sesión que ejecuta va bien en gama media (Sonnet, effort medium). La revisión final la hace `sdd-kit:effort-high` + `model: opus`.
3. **Estado como enum `BookingStatus` guardado como string** (`HasConversion<string>()`, `nvarchar(16)`) y serializado como string (`JsonStringEnumConverter<BookingStatus>` en el propio enum). Así la BD se lee sin tabla de códigos y el frontend recibe `"Cancelled"`, no `2`.
4. **Estado por defecto**: las reservas existentes quedan `Confirmed` por el `defaultValue: "Confirmed"` del `AddColumn` de la migración. Las nuevas se crean `Pending` por el inicializador de la entidad (`= BookingStatus.Pending`). No se configura `HasDefaultValue` en el modelo: con él, EF omitiría el valor CLR por defecto en el INSERT.
5. **`status` desconocido en la API → 400**. La spec no lo fija. Aplica a `?status=Foo` (falla el binding) y a `?status=9`, un número fuera del enum (guarda `Enum.IsDefined`). Sin la guarda, `?status=9` devolvería una lista vacía con 200.
6. **Selector con `<select>` nativo** dentro de `app-status-select`. Las etiquetas van en castellano (Art. 4): «Todos», «Confirmada», «Pendiente», «Cancelada». Los valores enviados son los de la API. El foco, el teclado y la accesibilidad vienen de la plataforma.
7. **⚠️ Riesgo alto: no hay migraciones versionadas.** No existen `backend/src/Bookings.Api/Migrations/`, `Program.cs`, `.csproj` ni `SqlServerApiFactory`, aunque el test la usa. Un `dotnet ef migrations add` crearía la tabla entera, no solo la columna. El plan crea primero una migración baseline `InitialCreate` (el schema actual) y después `AddBookingStatus`. **Necesito que me digas cómo se crea hoy la BD en los entornos reales.** Si se crea con `EnsureCreated`, `InitialCreate` fallará allí porque la tabla ya existe. Antes del despliegue habría que marcarla como aplicada en `__EFMigrationsHistory` (§1.8).
8. **Coste estimado**: ~3 h de implementación. A eso se suman ~20 min de `backend:test` en segundo plano y la revisión final con Opus, que es un solo despacho.

**Goal**: Guardar el estado de cada reserva, filtrarlo en `GET /bookings?status=` y elegirlo desde un selector en la lista.

**Architecture**: La columna `Status` y el filtro viven en el backend. El filtro se aplica antes de paginar, porque la lista está paginada (decisión 2 de la spec). El frontend añade `app-status-select` y reconstruye la URL del `httpResource` a partir de un signal `status`.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit con Testcontainers; Angular 20 (signals, `httpResource`), Vitest con jsdom; moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks con un único contrato entre ellas (`status` como string) y un fallo se detecta en la Task 2 o en la revisión final. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Tres estados cerrados: `Confirmed`, `Pending`, `Cancelled`; las reservas existentes pasan a `Confirmed` en la migración.
- El filtro va en la API (`GET /bookings?status=`), no en el cliente: la lista está paginada.
- El selector es un componente propio, `app-status-select`, con la opción «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.
- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Ejecución Native (ver línea `Ejecución`); revisión final con `sdd-kit:effort-high` + `model: opus`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, referenciando `0012`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: `<select>` nativo; enum en lugar de tabla de estados; sin servicio nuevo en el frontend.
- [x] **YAGNI gate**: el único componente nuevo lo pide la spec; no se añade cambio de estado (fuera de Scope).
- [x] **Brownfield gate**: `GET /bookings` sin `status` responde igual que hoy, con un campo nuevo en el JSON; se respeta el patrón `httpResource` y minimal API.
- [x] **Constitution check**: Art. 2 se cumple con la verificación por task y el gate de §3; Art. 4 (castellano) en etiquetas y docs; Art. 5 en Restricciones de código.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs`: el enum `BookingStatus`.
- `backend/src/Bookings.Api/Migrations/*_InitialCreate.cs`: la migración baseline del schema actual.
- `backend/src/Bookings.Api/Migrations/*_AddBookingStatus.cs`: la columna `Status`.
- `backend/tests/Bookings.Tests/BookingStatusMigrationTests.cs`: el escenario de la migración.
- `frontend/src/app/bookings/status-select.component.ts`, `status-select.component.css` y `status-select.component.spec.ts`: el componente `app-status-select`.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs`: la propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs`: `OnModelCreating` con la conversión a string.
- `backend/src/Bookings.Api/BookingsEndpoints.cs`: el parámetro `status` y el 400.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`: los tests del filtro.
- `docs/api.md`: la fila `status`.
- `frontend/src/app/bookings/booking.ts`: el tipo `BookingStatus` y el campo `status`.
- `frontend/src/app/bookings/booking-list.component.ts` y `booking-list.component.spec.ts`: el selector y la URL.

**NO se tocan**:

- `booking-list.component.css`: el selector trae sus propios estilos.
- `moon.yml`: no cambian las tasks.

### 1.2 Modelo de datos

`Bookings.Status nvarchar(16) NOT NULL`, con los valores `Confirmed | Pending | Cancelled`.

### 1.3 Migraciones

Se generan con `dotnet ef migrations add <Nombre>` en `backend/src/Bookings.Api`:

1. `InitialCreate`, generada sobre el modelo sin cambios.
2. `AddBookingStatus`, generada tras añadir la propiedad. Se edita a mano el `AddColumn` para poner `defaultValue: "Confirmed"`.

### 1.4 Contratos API

`GET /bookings?page=<int>&status=<Confirmed|Pending|Cancelled>`:

- `status` es opcional. Sin él, la API devuelve todas las reservas.
- Con un valor fuera de los tres, responde `400`.
- El filtro se aplica antes de `OrderBy/Skip/Take`.
- Cada reserva del JSON lleva `"status": "Confirmed"`, como string.

### 1.5 UX

- `app-status-select` es un `<select>` con una `<label>` visible, «Estado». Va encima de la `<ul>` de la lista.
- Opciones: «Todos» (valor vacío, seleccionada por defecto), «Confirmada», «Pendiente» y «Cancelada».
- El selector está deshabilitado mientras `bookings.isLoading()`.
- Los colores salen de `var(--text)` y `var(--surface)`.
- El foco se ve con `outline: 2px solid var(--text)`.

### 1.6 Dependencias

Ninguna nueva. `Microsoft.EntityFrameworkCore.Design` y la herramienta `dotnet-ef` tienen que estar disponibles. Si faltan, se instalan como herramienta local.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La BD real se creó con `EnsureCreated` y `InitialCreate` falla | Media | Alto | Decisión 7: confirmar con el dev-lead; insertar la fila de `InitialCreate` en `__EFMigrationsHistory` antes del despliegue |
| Faltan `Program.cs`, `.csproj` y `SqlServerApiFactory` en el repo | Alta | Medio | La Task 1 lo comprueba al abrir; si no están, es un freno y se pregunta, sin inventarlos |
| `SqlServerApiFactory` crea el schema con `EnsureCreated`, no con migraciones | Media | Medio | El test de migración usa su propia BD y `IMigrator`, sin depender de la factory |

### 1.8 Rollout

Despliegue directo: aplicar `AddBookingStatus` antes de desplegar el frontend. Si la BD real no tiene historial de migraciones, se inserta antes la fila de `InitialCreate` (ver Riesgos).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD, filtro en la API y documentación

**Modelo**: sesión (Native), en gama media: Sonnet con effort medium.
**Tests RED**: TDD del propio hilo, en `backend/tests/Bookings.Tests/BookingStatusMigrationTests.cs` y `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`. Se guarda una copia fuera del repo antes de escribir el código.
**Superficies**: BD · backend · docs
**Verificación**: `dotnet build backend/src/Bookings.Api` y `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingStatusMigrationTests|FullyQualifiedName~BookingsEndpointsTests"`
**Verificación lenta**: `moon run backend:test`, entre 17 y 21 min.
**Se prueba en la aplicación**: con `moon run backend:run`, `curl "http://localhost:5080/bookings?status=Cancelled"` devuelve solo reservas con `"status": "Cancelled"`, sin `status` devuelve todas y `?status=Foo` responde `400`. La pantalla aún no cambia.

**Interfaces**:
- Consume: nada.
- Produce:
  - `enum BookingStatus { Confirmed, Pending, Cancelled }` en `Bookings.Api.Data`, con `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))]`.
  - `Booking.Status : BookingStatus`, con `= BookingStatus.Pending`.
  - En el JSON, `"status": "Confirmed" | "Pending" | "Cancelled"`.
  - `GET /bookings?status=<nombre>`, que responde `400` si el nombre no es válido.

**Ficheros**: los de backend y `docs/api.md` de §1.1.

- [ ] **Step 0: Comprobar el andamiaje**: localizar `Program.cs`, el `.csproj` y `SqlServerApiFactory`, y ver cómo crea el schema la factory. Si no existen, es un freno de alcance: parar y preguntar.
- [ ] **Step 1: Tests RED**:
  - `BookingStatusMigrationTests.Existing_bookings_become_confirmed`:
    1. En una BD propia del contenedor (`Initial Catalog=Bookings_Migration`), ejecutar `MigrateAsync("InitialCreate")`.
    2. Insertar una fila con SQL crudo, sin `Status`.
    3. Ejecutar `MigrateAsync()`.
    4. Comprobar `Assert.Equal(BookingStatus.Confirmed, booking.Status)`.
  - `BookingStatusMigrationTests.New_bookings_are_created_pending`: guardar `new Booking { Room = "Sala 1", ... }` sin `Status`, recargarla con un contexto nuevo y comprobar `Assert.Equal(BookingStatus.Pending, reloaded.Status)`.
  - `BookingsEndpointsTests.Filters_by_status`: sembrar una reserva de cada estado y pedir `GET /bookings?status=Cancelled`. Esperado: `Assert.All(bookings, b => Assert.Equal(BookingStatus.Cancelled, b.Status))` y `Assert.Single(bookings)`.
  - `BookingsEndpointsTests.Without_status_returns_all`: con la misma siembra, `GET /bookings` devuelve `Assert.Equal(3, bookings.Count)`.
  - `BookingsEndpointsTests.Filter_applies_before_paging`: sembrar 21 `Cancelled` y 1 `Pending`. `GET /bookings?status=Cancelled&page=2` devuelve `Assert.Single(bookings)`.
  - `BookingsEndpointsTests.Unknown_status_is_bad_request`: `[Theory]` con `"Foo"` y `"9"`. Esperado: `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)`.
  - Si la factory comparte BD entre tests, cada test limpia la tabla o filtra por sus propias salas.
- [ ] **Step 2: Implementación**:
  1. Crear `BookingStatus`.
  2. Añadir `Booking.Status`.
  3. En `BookingsDb.OnModelCreating`, `Property(b => b.Status).HasConversion<string>().HasMaxLength(16)`.
  4. Crear las migraciones de §1.3.
  5. En `MapBookings`, añadir el parámetro `BookingStatus? status = null`. Si `status is { } s && !Enum.IsDefined(s)`, devolver `Results.BadRequest()`. Si no, aplicar `Where(b => b.Status == s)` antes de `OrderBy`.
- [ ] **Step 3: Docs**: en `docs/api.md`, añadir la fila `` | `status` | `Confirmed`, `Pending` o `Cancelled` | todas | `` y la frase «Con `status`, solo las reservas de ese estado; con otro valor, `400`.».
- [ ] **Step 4: Build y Verificación**: los comandos de «Verificación». Esperado: verde. Después, el hilo lanza `moon run backend:test` en segundo plano.
- [ ] **Step 5: Commit de la task**: `feat(backend): estado de reserva y filtro por estado en GET /bookings (0012)`.

### Task 2 — Selector de estado en la lista

**Modelo**: sesión (Native), en gama media: Sonnet con effort medium.
**Tests RED**: TDD del propio hilo, en `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`. Se guarda una copia fuera del repo.
**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`
**Verificación visual**: la lista en `http://localhost:4200`, con la API de la Task 1 en marcha.
- Estados del selector: normal, con foco (entrar con Tab) y deshabilitado (retrasando la respuesta de `/api/bookings`).
- Temas: claro y oscuro, con el mecanismo de variables CSS del proyecto. Si depende de `prefers-color-scheme`, se emula con `colorScheme` de Playwright.
- Qué mirar: contraste del texto del selector ≥ 4,5:1, contraste del outline de foco ≥ 3:1 y la etiqueta «Estado» alineada con el selector. En deshabilitado, que se note que lo está.
- Una captura por estado y tema.

**Se prueba en la aplicación**: el usuario abre la lista y elige «Cancelada» en el selector. La lista muestra solo las reservas canceladas. Al volver a «Todos», se ven todas.

**Interfaces**:
- Consume: del JSON de `GET /api/bookings`, `status: 'Confirmed' | 'Pending' | 'Cancelled'`. Con `?status=<nombre>`, la API devuelve solo ese estado.
- Produce:
  - En `booking.ts`, `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'` y `Booking.status: BookingStatus`.
  - `StatusSelectComponent`, con selector `app-status-select`, `value = model<BookingStatus | null>(null)` y `disabled = input(false)`.

**Ficheros**: los de frontend de §1.1.

- [ ] **Step 1: Tests RED**:
  - `status-select`, «shows Todos first and selected»: las opciones son `['Todos', 'Confirmada', 'Pendiente', 'Cancelada']` y el valor inicial es `''`.
  - `status-select`, «emits the chosen status»: al cambiar el `<select>` a `Cancelled`, `value()` es `'Cancelled'`, y con «Todos» es `null`.
  - `status-select`, «is disabled when disabled input is true»: `select.disabled === true`.
  - `booking-list`, «requests all bookings by default»: `expectOne('/api/bookings')`. El test existente se mantiene.
  - `booking-list`, «filters by the chosen status»: elegir `Cancelled` hace `expectOne('/api/bookings?status=Cancelled')`, que se responde con una reserva. Se espera 1 `li`.
  - `booking-list`, «disables the selector while loading»: antes del `flush`, el `<select>` está `disabled`, y después no.
- [ ] **Step 2: Implementación**:
  1. Crear `StatusSelectComponent` según §1.5. Las etiquetas salen de un array `{ value, label }`.
  2. En `BookingListComponent`, añadir `readonly status = signal<BookingStatus | null>(null)`.
  3. La URL del `httpResource` pasa a ser `() => this.status() ? `/api/bookings?status=${this.status()}` : '/api/bookings'`.
  4. En la plantilla, `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />`.
- [ ] **Step 3: Build y Verificación**: los comandos de «Verificación». Esperado: verde.
- [ ] **Step 4: Verificación visual**, hecha por el hilo. Se arranca `frontend:serve` y `backend:run` guardando su PID o su puerto, y se paran por ese PID o puerto.
- [ ] **Step 5: Commit de la task**: `feat(frontend): selector de estado en la lista de reservas (0012)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`.
- [ ] Smoke con una fila por THEN de la spec. Los THEN de la API y del selector, con `ejecución real`.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- «Cada reserva tiene un estado» (las existentes, `Confirmed`; las nuevas, `Pending`) → Task 1: `Existing_bookings_become_confirmed` y `New_bookings_are_created_pending`. ✓
- «La API filtra por estado» (solo canceladas; sin `status`, todas) → Task 1: `Filters_by_status` y `Without_status_returns_all`. ✓
- «La lista se filtra con un selector» (filtra; claro y oscuro; normal, foco y deshabilitado) → Task 2: tests de `booking-list` y `status-select`, más la Verificación visual. ✓
- «La API documenta el filtro» (`status` y sus tres valores) → Task 1, Step 3. ✓
- Casos que la spec no cubre, con su test:
  - filtro combinado con paginación → `Filter_applies_before_paging`;
  - `status` desconocido o numérico → `Unknown_status_is_bad_request`;
  - selector usable mientras carga → «disables the selector while loading».
- «No entra: cambiar el estado desde la interfaz» → N/A: no hay endpoint ni control de edición. ✓
