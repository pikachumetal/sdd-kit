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

1. **Dos tasks**: Task 1 = estado en BD + filtro en la API + `docs/api.md`; Task 2 = selector en la lista. — Task 1 llega hasta una interfaz que el usuario puede probar (la respuesta HTTP de la API). Task 2 toca otra superficie (frontend) y no necesita la suite de backend, que tarda de 17 a 21 min. Un revisor puede rechazar una task y aprobar la otra.
2. **Ejecución Native** — son 2 tasks en secuencia, con una sola interfaz entre ellas (el parámetro `status` y sus tres valores). Un fallo se detecta en la revisión final y en la validación, así que no hace falta revisar cada task por separado.
3. **Modelo** — la sesión que ejecuta va bien en gama media (Sonnet, effort medium). Esta sesión es Opus: antes de decir «sigue», cambia con `/model`. Revisor final: `sdd-kit:effort-high` + `model: opus`.
4. **`BookingStatus` es un enum C#** que se guarda en BD como texto (`HasConversion<string>()`, `nvarchar(16)`) y sale en el JSON como texto (`[JsonConverter(typeof(JsonStringEnumConverter))]` en el enum). — Así la BD, el JSON y el query param usan los mismos tres literales. **Salida observable nueva**: cada reserva de `GET /bookings` lleva un campo `status` (`"Confirmed"`, `"Pending"` o `"Cancelled"`).
5. **`?status=` con un valor desconocido (`Archived`) → 400**, que da el binding de minimal API. **`?status=` vacío** se trata como ausente y devuelve todas. La spec no fija ninguno de los dos casos.
6. **Migración `AddBookingStatus`**: la columna se crea con default `Confirmed` para rellenar las filas existentes, y en el mismo `Up` se quita ese default. Las reservas nuevas quedan en `Pending` por el valor inicial de la propiedad C#. — Si la BD conservara el default `Confirmed`, un insert hecho fuera de EF contradiría la spec.
7. **Textos del selector**: etiqueta «Estado»; opciones «Todos» (valor vacío, por defecto), «Confirmada», «Pendiente» y «Cancelada». Los valores que se envían son los literales en inglés.
8. **Selector con `<select>` nativo** dentro de `app-status-select`. — Foco, teclado y deshabilitado vienen del navegador. El tema lo dan `var(--text)` y `var(--surface)`, las mismas variables que ya usa la lista.
9. **Riesgo alto: al repo le faltan piezas.** No hay `Program.cs`, `.csproj`, carpeta `Migrations/` ni `SqlServerApiFactory`, ni configuración de Angular (`angular.json`, `package.json`). Si al empezar la Task 1 no hay una migración base, no se crea una `InitialCreate` por mi cuenta: aplicarla sobre una BD con la tabla ya creada es una decisión de rollout. Se para como freno de alcance.
10. **Coste**: ~3,5 h de implementación. Solo se despacha un subagente, el revisor final Opus, de orden 100–200 k tokens.

**Goal**: guardar el estado de cada reserva, filtrar `GET /bookings` por `status` y añadir a la lista el selector `app-status-select` que usa ese filtro.

**Architecture**: el filtro se aplica en la consulta EF, antes de paginar, porque la lista está paginada (decisión 2 de la spec). El frontend no filtra: `httpResource` recalcula la URL a partir de una signal con el estado elegido. El selector es un componente de presentación con `model()` para el valor e `input()` para el deshabilitado.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit + Testcontainers. Angular 20 con signals y `httpResource`, Vitest + jsdom. Tema claro y oscuro con variables CSS.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks en secuencia con una sola interfaz entre ellas y la revisión final de rama las cubre. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.
- Texto de la interfaz y de los documentos en castellano.
- Tres estados cerrados, literales exactos: `Confirmed`, `Pending`, `Cancelled`.
- El filtro va en la API (`GET /bookings?status=`), no en el cliente.
- El selector es un componente propio, `app-status-select`, con la opción «Todos» por defecto.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores. `fable` y `opus xhigh`, nunca sin justificación escrita.
- Ejecución: Native (arriba). El revisor final lleva el bloque «De código» al principio del encargo.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; un commit por task al quedar limpia su revisión; terminan con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (o el modelo de la sesión que commitea).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: `<select>` nativo, binding de enum de minimal API para el 400, sin servicio intermedio en el frontend.
- [x] **YAGNI gate**: no se añaden un `BookingsService`, un DTO ni un tipo `Booking.status` en el frontend: la lista no lo pinta.
- [x] **Brownfield gate**: retrocompatible. Sin `status`, `GET /bookings` devuelve lo mismo que hoy, más el campo `status`. `page` no cambia.
- [x] **Constitution check**: art. 2 (verde por task, con las superficies de cada una; el gate completo en §3), art. 3 (git-flow), art. 4 (textos en castellano), art. 5 (en «De código») y art. 6 (en «De proceso»).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `BookingStatus { Confirmed, Pending, Cancelled }` con `[JsonConverter(typeof(JsonStringEnumConverter))]`.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ `Designer` y snapshot actualizado) — con `dotnet ef migrations add AddBookingStatus`.
- `backend/tests/Bookings.Tests/BookingStatusTests.cs` — tests de la Task 1.
- `frontend/src/app/bookings/status-select.component.ts` y `status-select.component.css` — `app-status-select`.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — `public BookingStatus Status { get; set; } = BookingStatus.Pending;`
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating`: `Status` con `HasConversion<string>()` y `HasMaxLength(16)`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `BookingStatus? status` y `Where` antes de `OrderBy/Skip/Take`.
- `docs/api.md` — fila `status` en la tabla de `GET /bookings`.
- `frontend/src/app/bookings/booking.ts` — `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';`
- `frontend/src/app/bookings/booking-list.component.ts` — signal `status`, URL con `status` y el selector.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — tests de la Task 2.

**NO se tocan**:

- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — su test sigue valiendo tal cual.
- `moon.yml` — los comandos existentes bastan.
- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva sus propios estilos.

### 1.2 Modelo de datos

`Bookings.Status`: `nvarchar(16) NOT NULL`, valores `Confirmed` | `Pending` | `Cancelled`.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. Después se edita el `Up` generado:

```csharp
migrationBuilder.AddColumn<string>(name: "Status", table: "Bookings", maxLength: 16, nullable: false, defaultValue: "Confirmed");
migrationBuilder.AlterColumn<string>(name: "Status", table: "Bookings", maxLength: 16, nullable: false,
    oldClrType: typeof(string), oldMaxLength: 16, oldDefaultValue: "Confirmed");
```

`Down`: `DropColumn("Status", "Bookings")`.

### 1.4 Contratos API

`GET /bookings?page=<int, 1>&status=<Confirmed|Pending|Cancelled, opcional>`

- Sin `status`, o con `status=` vacío: todas las reservas, paginadas como hoy.
- Con `status`: solo las de ese estado; primero se filtra y después se pagina.
- Con otro valor: `400`.
- Cada elemento añade `"status": "<literal>"`.

### 1.5 UX

- La lista muestra encima `<label>Estado <select>` con «Todos» · «Confirmada» · «Pendiente» · «Cancelada».
- El selector está deshabilitado mientras `bookings.isLoading()`.
- El foco se ve con `:focus-visible` (`outline: 2px solid currentColor; outline-offset: 2px`).
- El color sale de `var(--text)` y el fondo de `var(--surface)`, así que cambia con el tema. El borde es `1px solid currentColor`.

### 1.6 Dependencias

Ninguna librería nueva. `JsonStringEnumConverter` viene de `System.Text.Json` y `httpResource` de `@angular/common/http`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| No hay migración base en el repo | alta (no se ve `Migrations/`) | alto: `migrations add` generaría la creación de la tabla entera | Paso 0 de la Task 1: si falta, se para con freno de alcance y no se crea `InitialCreate` |
| Faltan `Program.cs`, `SqlServerApiFactory` y la configuración de Angular | alta | medio: puede que no compile ni arranque | Paso 0 de cada task: comprobarlo; si falta, se para con el error concreto |
| Los tests comparten la BD (`IClassFixture`) y los datos de un test afectan a otro | media | medio: aserciones frágiles | Cada test siembra salas con prefijo propio (`0012-…`) y solo mira sus salas; la paginación se prueba con fechas del año 2000, anteriores a cualquier otra |
| No se sabe cómo se activa el tema oscuro | media | bajo | En la verificación visual: la clase o el atributo que use la app o, si no, `prefers-color-scheme` emulado con Playwright |

### 1.8 Rollout

Directo. La migración rellena las filas existentes con `Confirmed` y el despliegue la aplica antes que la API nueva, como las anteriores.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD, filtro en la API y documentación

**Modelo**: la sesión (Native), recomendada en gama media (Sonnet, effort medium).
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingStatusTests.cs`, TDD de la propia sesión, con una copia fuera del repo antes de implementar.
**Superficies**: BD · backend · docs
**Verificación**: `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingStatusTests"` · `Select-String -Path docs/api.md -Pattern 'status','Confirmed','Pending','Cancelled'` (las cuatro, en la sección de `GET /bookings`)
**Verificación lenta**: si el `dotnet test` filtrado pasa de 10 min, por el arranque de Testcontainers, se lanza en segundo plano.
**Se prueba en la aplicación**: con `moon run backend:run`, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo reservas con `"status": "Cancelled"`, sin `status` devuelve todas y `?status=Archived` responde 400.

**Interfaces**:
- Consume: nada.
- Produce: `GET /bookings?status=<Confirmed|Pending|Cancelled>`. Cada elemento de la respuesta lleva `"status": "<literal>"`. Un valor desconocido responde `400`.

**Ficheros**: crear `Data/BookingStatus.cs`, la migración `AddBookingStatus` y `BookingStatusTests.cs`. Modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs` y `docs/api.md`.

- [ ] **Step 0: Precondiciones** — ¿existen `backend/src/Bookings.Api/Migrations/` con al menos una migración, el `.csproj`, `Program.cs` y `SqlServerApiFactory`? Si falta la migración base: **freno de alcance, se para** (ver decisión 9). Si falta otra pieza: se para con el error concreto.
- [ ] **Step 1: Tests RED** en `BookingStatusTests` (`IClassFixture<SqlServerApiFactory>`, siembra con `factory.SeedAsync`, salas con prefijo `0012-`):
  - `Existing_bookings_become_confirmed_after_migration` — `IMigrator.Migrate("<migración anterior>")`, se inserta una fila con SQL crudo (sin `Status`), `Migrate()`. Assert: `Status == BookingStatus.Confirmed`.
  - `New_bookings_are_created_pending` — se siembra `new Booking { Room = "0012-new", … }` sin `Status`. Assert: la reserva de `GET /bookings` tiene `Status == BookingStatus.Pending`.
  - `Filters_bookings_by_status` — se siembran `0012-f-c` (Confirmed), `0012-f-p` (Pending) y `0012-f-x` (Cancelled). En `GET /bookings?status=Cancelled`, todas las reservas son `Cancelled` y de las salas `0012-f-*` solo aparece `0012-f-x`.
  - `Returns_all_statuses_without_filter` — mismas tres salas `0012-a-*`. En `GET /bookings`, están las tres.
  - `Treats_empty_status_as_no_filter` — `GET /bookings?status=` → 200, y están las tres salas `0012-a-*`.
  - `Rejects_unknown_status` — `GET /bookings?status=Archived` → `HttpStatusCode.BadRequest`.
  - `Paginates_after_filtering` — 25 reservas `Pending` en el año 2000 y 1 `Confirmed` en 1999. `GET /bookings?status=Pending&page=1` → `Count == 20` y todas `Pending`.
- [ ] **Step 2: Ejecutar RED** — el comando de «Verificación». Esperado: no compila (`BookingStatus` no existe).
- [ ] **Step 3: Implementación** — `BookingStatus.cs`; `Booking.Status` con valor inicial `Pending`; `HasConversion<string>().HasMaxLength(16)` en `BookingsDb.OnModelCreating`; migración según §1.3; en `MapGet`, parámetro `BookingStatus? status` y `.Where(b => status == null || b.Status == status)` antes de `OrderBy`; en `docs/api.md`, fila `| \`status\` | \`Confirmed\`, \`Pending\` o \`Cancelled\` | todas |` y una frase: otro valor responde 400.
- [ ] **Step 4: Build** — `dotnet build backend/src/Bookings.Api`. Esperado: 0 errores.
- [ ] **Step 5: Verificación** — los comandos de «Verificación». Esperado: 7 tests en verde y los cuatro literales en `docs/api.md`. Comparar los RED con su copia (`git diff --no-index`).
- [ ] **Step 6: Commit de la task** — `feat(backend): filtrar reservas por estado en GET /bookings (0012)`.

### Task 2 — Selector de estado en la lista

**Modelo**: la sesión (Native), recomendada en gama media (Sonnet, effort medium).
**Tests RED**: hilo principal · `frontend/src/app/bookings/booking-list.component.spec.ts`, TDD de la propia sesión, con una copia fuera del repo antes de implementar.
**Superficies**: frontend
**Verificación**: `moon run frontend:test` · `moon run frontend:check`
**Verificación visual**: `http://localhost:4200`, la lista de reservas · estados normal, con foco (Tab hasta el selector) y deshabilitado (con la petición retenida) · temas claro y oscuro · mirar: texto y borde del selector legibles sobre el fondo (contraste del texto ≥ 4,5:1 en normal y con foco), alineación con la lista, separación a los bordes y contorno de foco visible. Una captura por estado y tema, guardada fuera de git.
**Se prueba en la aplicación**: con backend y frontend arrancados, el usuario elige «Cancelada» y la lista muestra solo las canceladas. Con «Todos» vuelven todas. Mientras carga, el selector está deshabilitado.

**Interfaces**:
- Consume: `GET /api/bookings?status=<Confirmed|Pending|Cancelled>`. Sin `status`, todas.
- Produce: `StatusSelectComponent`, selector `app-status-select`, con `value = model<BookingStatus | ''>('')` y `disabled = input(false)`. En `booking.ts`: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'`.

**Ficheros**: crear `status-select.component.ts` y `status-select.component.css`. Modificar `booking.ts`, `booking-list.component.ts` y `booking-list.component.spec.ts`.

- [ ] **Step 0: Precondiciones** — ¿arrancan `moon run frontend:test` y `frontend:check` con el test actual? Si no, se para con el error concreto.
- [ ] **Step 1: Tests RED** en `booking-list.component.spec.ts`. El test actual se queda igual.
  - `shows «Todos» selected by default` — `select` con `value === ''` y la opción seleccionada con el texto `Todos`.
  - `requests bookings filtered by the selected status` — tras el primer `flush`, se pone `select.value = 'Cancelled'` y se lanza `change`. Se espera `expectOne('/api/bookings?status=Cancelled')`; con un `flush` de 1 reserva → 1 `li`.
  - `requests all bookings again when «Todos» is selected` — `Cancelled` y luego `''` → `expectOne('/api/bookings')`.
  - `disables the selector while loading` — antes del primer `flush`, `select.disabled === true`; después, `false`.
- [ ] **Step 2: Ejecutar RED** — `moon run frontend:test`. Esperado: fallan los 4 nuevos (no hay `select`).
- [ ] **Step 3: Implementación** — `StatusSelectComponent` según «Interfaces», con el `<label>` y las opciones de §1.5; estilos de §1.5 en su CSS. En `BookingListComponent`: `readonly status = signal<BookingStatus | ''>('')`, `httpResource` con `url: '/api/bookings'` y `params` que solo lleva `status` si no está vacío, y `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` antes de la `<ul>`.
- [ ] **Step 4: Build** — `moon run frontend:check`. Esperado: 0 errores de lint y de `tsc`.
- [ ] **Step 5: Verificación** — `moon run frontend:test`. Esperado: 5 tests en verde. Comparar los RED con su copia (`git diff --no-index`).
- [ ] **Step 6: Verificación visual** — la de arriba, con Playwright: el MCP si está en la sesión y, si no, un script con el paquete `playwright`. Se arranca guardando el PID o el puerto y se para por ese PID o puerto.
- [ ] **Step 7: Commit de la task** — `feat(frontend): selector de estado en la lista de reservas (0012)`.

---

## Estimación y esfuerzo

- Tipo: fullstack (con migración)
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 3,5 h (Task 1: 2 h, Task 2: 1,5 h), sin contar la suite de backend del gate (17–21 min)
- Base de la estimación: 2 tasks, con piezas del repo que no se ven (riesgos 1 y 2)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (frontend + backend, ~20 min) y `moon run frontend:check`.
- [ ] Revisor final: `sdd-kit:effort-high` + `model: opus`, con «De código» al principio del encargo.
- [ ] Smoke por THEN de la spec, con ejecución real: `GET /bookings?status=Cancelled`, sin `status`, `?status=Archived` → 400, selector en el navegador, `docs/api.md`.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado: las existentes pasan a `Confirmed` y las nuevas se crean con `Pending` → Task 1 (`Existing_bookings_become_confirmed_after_migration`, `New_bookings_are_created_pending`). ✓
- La API filtra por estado; sin `status`, todas → Task 1 (`Filters_bookings_by_status`, `Returns_all_statuses_without_filter`). ✓
- La lista se filtra con un selector → Task 2 (tests de petición filtrada y de «Todos»). ✓
- El selector se ve y se usa igual en tema claro y oscuro, en normal, con foco y deshabilitado → Task 2 (`disables the selector while loading` y «Verificación visual»). ✓
- La API documenta `status` y sus tres valores → Task 1 (Step 3 y `Select-String` en «Verificación»). ✓
- No entra cambiar el estado desde la interfaz → N/A: no hay control de edición. ✓

**Review Focus** (casos que la spec no cubre, cada uno con su test):

1. `?status=Archived` → 400, no 200 con todas → Task 1 `Rejects_unknown_status`.
2. `?status=` vacío → todas → Task 1 `Treats_empty_status_as_no_filter`.
3. Con filtro y paginación, primero se filtra y después se pagina → Task 1 `Paginates_after_filtering`.
4. Volver a «Todos» quita el parámetro de la petición → Task 2 `requests all bookings again when «Todos» is selected`.
5. El selector no queda deshabilitado tras cargar → Task 2 `disables the selector while loading`.
