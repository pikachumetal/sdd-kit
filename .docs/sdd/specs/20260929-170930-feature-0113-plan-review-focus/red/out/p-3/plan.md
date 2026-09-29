---
id: 20260923-090000-task-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-29
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Dos tasks**, no una: Task 1 lleva el estado de la BD a la API y su documentación, y Task 2 el selector de la lista. Son superficies distintas, un revisor puede rechazar una y aprobar la otra, y la Task 1 ya se puede probar sobre la API por HTTP.
2. **Modelo y effort**: la Task 1 va con `sdd-kit:effort-high` + `sonnet`, porque la migración y el valor por defecto del enum en EF tienen una trampa (riesgo R1). La Task 2 va con `sdd-kit:effort-medium` + `sonnet`. La revisión final de rama va con `sdd-kit:effort-high` + `opus`.
3. **Ejecución: Native**. Son dos tasks que solo comparten un contrato JSON pequeño (`status` como texto). El revisor final en Opus cubre la rama entera, y es lo más barato. La sesión que ejecuta va bien en gama media (Sonnet, effort medium).
4. **`status` desconocido → 400**, con el cuerpo `"status debe ser Confirmed, Pending o Cancelled"`. `status` vacío o ausente → todas. La comparación no distingue mayúsculas y minúsculas y solo acepta nombres: `?status=2` es 400. La spec no fija nada de esto.
5. **El estado se guarda como texto** (`nvarchar(16)`) y se serializa en JSON como texto (`"Cancelled"`). Así el front compara cadenas y la BD se lee sin tabla de códigos.
6. **Textos del selector**: la etiqueta es «Estado» y las opciones son «Todos», «Confirmada», «Pendiente» y «Cancelada», en castellano por el Art. 4. La spec solo fija «Todos».
7. **Art. 2 («todo verde al cerrar cada task»)**: cada task corre los comandos de sus superficies. `moon run :test` (el backend tarda 17–21 min) y `moon run frontend:check` van una vez, en §3.
8. **Verificación visual sin detector**: `tech-stack.md` no tiene `§Frontend` y la spec aprobada no lo propuso. La Task 2 se mira con un script de Playwright y la validación dirá «composición no medida: `tech-stack.md` no declara detector en §Frontend». Si quieres un detector, dilo antes de la Task 2: sería un cambio a `tech-stack.md`.
9. **Riesgo alto**: no hay carpeta `Migrations/` en el repo (R2). Si `AddBookingStatus` fuera la primera migración, intentaría crear una tabla `Bookings` que ya existe en producción.
10. **Coste estimado**: unas 3 h de implementación, más los 17–21 min de la suite de backend en §3. La revisión final (1 despacho de Opus) cuesta del orden de 1–3 $.

**Goal**: guardar el estado de cada reserva, filtrar por él en `GET /bookings` y elegirlo con un selector en la lista.

**Architecture**: un enum `BookingStatus` en `Booking`, persistido como texto con una migración que pone `Confirmed` a las reservas existentes. El endpoint filtra antes de paginar. En el front, un componente `app-status-select` con un `model()` que la lista pasa como parámetro de `httpResource`.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit con Testcontainers; Angular 20 con signals, Vitest con jsdom.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks con un contrato pequeño entre ellas y la revisión final de rama en Opus cubre las dos. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Estados, literales exactos: `Confirmed`, `Pending`, `Cancelled`. Las reservas existentes pasan a `Confirmed` en la migración y las nuevas se crean con `Pending`.
- El filtro va en la API (`GET /bookings?status=`), no en el cliente.
- El selector es el componente `app-status-select`, con la opción «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.
- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Ejecución: native (línea `Ejecución`).
- Commits: convención del proyecto con el ticket (`feat(0012): …`), terminados en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un enum, un parámetro de consulta y un `<select>`, sin librerías nuevas.
- [x] **YAGNI gate**: `app-status-select` es un componente porque la spec lo fija, no por reutilización.
- [x] **Brownfield gate**: `GET /bookings` sin `status` responde lo mismo que antes, más el campo `status`; `page` se mantiene. Se respeta el patrón del módulo (minimal API en `BookingsEndpoints.cs`, `httpResource` en la lista).
- [x] **Constitution check**: Art. 4 (castellano), Art. 5 (calidad), Art. 6 (modelos) aplicados; Art. 2 interpretado en la decisión 7.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — el enum, serializado como texto.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` — columna `Status`, con `Confirmed` para las filas existentes.
- `frontend/src/app/bookings/status-select.component.ts` (+ `.css`, `.spec.ts`) — el selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — conversión a texto y longitud.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro.
- `docs/api.md` — parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — tipo `BookingStatus` y campo `status`.
- `frontend/src/app/bookings/booking-list.component.ts` y `.spec.ts` — selector y petición filtrada.

**NO se tocan**:

- `moon.yml` — los comandos existentes bastan.
- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva sus propios estilos.

### 1.2 Modelo de datos

`Booking.Status : BookingStatus`, con `Pending` como valor inicial en C#. Columna `Status nvarchar(16) NOT NULL`. En el modelo de EF no hay `HasDefaultValue`, así que EF siempre envía el valor (ver R1).

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. Se edita a mano: `defaultValue: "Confirmed"` en el `AddColumn`, para que las filas existentes queden en `Confirmed`.

### 1.4 Contratos API

`GET /bookings?page=<int=1>&status=<Confirmed|Pending|Cancelled>`:

- `200` con un array de `{ id, room, start, end, owner, status }`, donde `status` es texto. El filtro se aplica antes de paginar.
- `400` si `status` no es uno de los tres nombres (sin distinguir mayúsculas; los números no valen).
- `status` ausente o vacío → todas.

### 1.5 UX

Un `<select>` con la etiqueta «Estado» encima de la lista, con las opciones «Todos» (por defecto), «Confirmada», «Pendiente» y «Cancelada». Está deshabilitado mientras carga la lista y usa `var(--text)` y `var(--surface)`, así que sigue al tema claro y al oscuro.

### 1.6 Dependencias

Ninguna nueva. `SqlServerApiFactory` y su `SeedAsync` existen en el proyecto de tests, pero no están en este repo; ver R2 y R3.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| R1 — Si el modelo configura `HasDefaultValue(Confirmed)`, EF no envía el valor CLR por defecto del enum y las reservas nuevas se guardarían como `Confirmed` | media | alto | El default solo va en la migración; el test `New_bookings_are_created_pending` lo fija |
| R2 — No hay `Migrations/` en el repo: si `AddBookingStatus` fuera la primera migración, crearía `Bookings` de cero | media | alto | Antes de generarla, mirar cómo crea el esquema `SqlServerApiFactory` y producción. Si no hay historial de migraciones, es un freno: no generarla y volver al dev-lead |
| R3 — `IClassFixture` comparte la BD entre tests y `SeedAsync` puede no limpiarla | alta | medio | Cada test siembra con una `Room` propia y afirma solo sobre sus filas |

### 1.8 Rollout

Directo: la migración se aplica en el despliegue del backend antes que el front.

### 1.9 Excepciones a la constitution

Ninguna. El Art. 2 se cumple por superficies (decisión 7).

### 1.10 Foco de revisión

Entradas que la spec no nombra y que más probablemente romperían algo; cada una tiene su test en la task dueña:

1. `status` que no es un estado (`foo`, `7`, `2`) → 400, no todas las reservas ni un 500. Task 1: `Unknown_status_returns_bad_request`.
2. `status` en minúsculas o vacío (`cancelled`, `status=`) → filtra igual, o devuelve todas si va vacío. Task 1: `Status_filter_ignores_case`, `Empty_status_returns_all`.
3. Filtro con paginación → la página 2 de las canceladas trae canceladas, no las que quedan de la página global. Task 1: `Filters_before_paging`.
4. El estado viaja como texto en el JSON (`"Cancelled"`, no `2`) → el front lo compara con cadenas. Task 1: `Serializes_status_as_text`.
5. Cambio rápido del selector → la lista muestra el último estado elegido, no la respuesta que llegue tarde. Task 2: `shows the last chosen status when changed quickly`.

---

## 2. Tasks

### Task 1 — Estado en BD, filtro en la API y documentación

**Modelo**: `subagent_type: sdd-kit:effort-high` + `model: sonnet` (en Native la ejecuta la sesión; el despacho aplica si se cambia a subagent)
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`; en Native, TDD del propio hilo
**Superficies**: BD · backend · docs
**Verificación**: `dotnet test backend/tests/Bookings.Tests --filter FullyQualifiedName~BookingsEndpointsTests`. Si pasa de 10 min, va en segundo plano como verificación lenta.
**Se prueba en la aplicación**: con `moon run backend:run`, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo reservas con `"status": "Cancelled"`, `?status=foo` devuelve 400 y sin `status` salen todas.

**Interfaces**:
- Consume: nada.
- Produce: el JSON de `GET /bookings` con `status` como texto (`"Confirmed" | "Pending" | "Cancelled"`) y el parámetro de consulta `status` con esos valores.

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs` y `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs`; modificar `Booking.cs`, `BookingsDb.cs`, `BookingsEndpoints.cs`, `BookingsEndpointsTests.cs` y `docs/api.md`.

- [ ] **Step 0: Comprobar el esquema (R2)** — mirar cómo crean el esquema `SqlServerApiFactory` y producción. Si no hay historial de migraciones, parar y volver al dev-lead sin generar la migración.
- [ ] **Step 1: Tests RED** — en `BookingsEndpointsTests.cs`, cada test siembra con una `Room` propia y filtra la respuesta por ella (R3):
  ```csharp
  [Fact] Existing_bookings_become_confirmed_after_migration
  // IMigrator: migrar a la migración anterior a AddBookingStatus, INSERT por SQL, migrar a AddBookingStatus
  Assert.Equal(BookingStatus.Confirmed, booking.Status);

  [Fact] New_bookings_are_created_pending        // siembra sin fijar Status
  Assert.Equal(BookingStatus.Pending, mine.Single().Status);

  [Fact] Filters_bookings_by_status              // una por estado, GET /bookings?status=Cancelled
  Assert.All(mine, b => Assert.Equal(BookingStatus.Cancelled, b.Status)); Assert.Single(mine);

  [Fact] Without_status_returns_all_states       // GET /bookings
  Assert.Equal(3, mine.Count);

  [Fact] Status_filter_ignores_case              // ?status=cancelled
  Assert.Single(mine);

  [Fact] Empty_status_returns_all                // ?status=
  Assert.Equal(3, mine.Count);

  [Theory, InlineData("foo"), InlineData("7"), InlineData("2")] Unknown_status_returns_bad_request
  Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

  [Fact] Filters_before_paging                   // 25 Cancelled + 5 Confirmed intercaladas por Start, ?status=Cancelled&page=2
  Assert.Equal(5, mine.Count); Assert.All(mine, b => Assert.Equal(BookingStatus.Cancelled, b.Status));

  [Fact] Serializes_status_as_text               // GetStringAsync("/bookings?status=Cancelled")
  Assert.Contains("\"status\":\"Cancelled\"", json);
  ```
  `Filters_before_paging` necesita que las 30 filas sean las únicas de la página. Si la fixture no se limpia, siembra con `Start` anteriores a todo lo demás (año 2000).
- [ ] **Step 2: Implementación**
  - `public enum BookingStatus { Confirmed, Pending, Cancelled }` con `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))]`.
  - `Booking.Status { get; set; } = BookingStatus.Pending;`
  - `BookingsDb.OnModelCreating`: `Property(b => b.Status).HasConversion<string>().HasMaxLength(16)`, sin `HasDefaultValue` (R1).
  - Migración `AddBookingStatus` con `defaultValue: "Confirmed"`.
  - `MapGet("/bookings", (BookingsDb db, int page = 1, string? status = null))` en `BookingsEndpoints.cs`. Devuelve `Results<Ok<List<Booking>>, BadRequest<string>>`. El `Where` va antes de `OrderBy/Skip/Take`. `status` se resuelve contra `Enum.GetNames<BookingStatus>()` con `StringComparison.OrdinalIgnoreCase`: `Enum.TryParse` acepta números. Si no coincide, 400 con `"status debe ser Confirmed, Pending o Cancelled"`.
  - `docs/api.md`: fila `status` en la tabla (`texto` · todas) y una línea con sus tres valores, que se compara sin distinguir mayúsculas y que otro valor da 400.
- [ ] **Step 3: Build** — `dotnet build backend/src/Bookings.Api`. Esperado: sin errores ni avisos nuevos.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: todos los tests en verde. `Select-String -Path docs/api.md -Pattern 'Confirmed','Pending','Cancelled'` encuentra los tres valores.
- [ ] **Step 5: Commit de la task** — `feat(0012): estado de la reserva y filtro en la API`.

### Task 2 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet` (en Native la ejecuta la sesión)
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts`, `frontend/src/app/bookings/booking-list.component.spec.ts`; en Native, TDD del propio hilo
**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`
**Verificación visual**: la lista en `http://localhost:4200`, con el backend de la Task 1 o un `page.route` que responda `/api/bookings`. Estados: normal, con foco (Tab) y deshabilitado (la respuesta retenida con `page.route`). Temas: claro y oscuro (`page.emulateMedia({ colorScheme })` o el mecanismo que use la app). Criterio:
  - el selector muestra la etiqueta «Estado» y el valor «Todos» al abrir;
  - el texto contrasta ≥ 4,5:1 con su fondo en los dos temas;
  - con foco se ve un contorno de ≥ 2 px;
  - deshabilitado se distingue (opacidad < 1) y no se abre.
  - Pantalla de referencia: la lista actual.
**Se prueba en la aplicación**: el usuario abre la lista, elige «Cancelada» y solo ve las canceladas; vuelve a «Todos» y las ve todas.

**Interfaces**:
- Consume: de la Task 1, `GET /api/bookings?status=<Confirmed|Pending|Cancelled>` y cada reserva con `status` como texto.
- Produce: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'` en `booking.ts`; `Booking.status: BookingStatus`; `StatusSelectComponent` (`app-status-select`) con `value = model<BookingStatus | ''>('')` y `disabled = input(false)`.

**Ficheros**: crear `status-select.component.ts`, `.css` y `.spec.ts`; modificar `booking.ts`, `booking-list.component.ts` y `booking-list.component.spec.ts`, todos en `frontend/src/app/bookings/`.

- [ ] **Step 1: Tests RED**
  ```ts
  // status-select.component.spec.ts
  it('shows Todos and the three states')     // textos de las option
  expect(texts).toEqual(['Todos', 'Confirmada', 'Pendiente', 'Cancelada']);
  expect(values).toEqual(['', 'Confirmed', 'Pending', 'Cancelled']);
  it('updates its value when the user picks a state')
  expect(component.value()).toBe('Cancelled');
  it('is disabled when disabled is true')
  expect(select.disabled).toBe(true);

  // booking-list.component.spec.ts
  it('requests all bookings with Todos')
  expectOne(r => r.url === '/api/bookings' && !r.params.has('status'));
  it('requests the chosen status')           // elige Cancelled
  expectOne(r => r.url === '/api/bookings' && r.params.get('status') === 'Cancelled').flush([{ id: 3, room: 'Sala 3', start: '11:00', status: 'Cancelled' }]);
  expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
  it('disables the selector while loading')  // antes del flush
  expect(select.disabled).toBe(true);
  it('shows the last chosen status when changed quickly')  // Cancelled y después Pending, sin flush entre medias
  expect(cancelledReq.cancelled).toBe(true);
  // flush de Pending → la lista muestra la de Pending
  ```
  El test existente `lists the bookings returned by the API` sigue pasando sin cambiar su `expectOne('/api/bookings')`.
- [ ] **Step 2: Implementación**
  - `booking.ts`: el tipo `BookingStatus` y el campo `status`.
  - `StatusSelectComponent` (selector `app-status-select`) con un `<label>` «Estado» y un `<select>` enlazado a `value`, con `[disabled]="disabled()"`. Estilos en `status-select.component.css` con `var(--text)`, `var(--surface)`, `:focus-visible` con `outline: 2px solid var(--text)` y `:disabled` con `opacity: 0.6`.
  - `BookingListComponent`: `readonly status = signal<BookingStatus | ''>('')`. `httpResource` con `() => ({ url: '/api/bookings', params: this.status() ? { status: this.status() } : {} })`. `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` va encima de la `<ul>`.
- [ ] **Step 3: Build** — `moon run frontend:check`. Esperado: sin errores de lint ni de tipos.
- [ ] **Step 4: Verificación** — `moon run frontend:test`, todo en verde, y después la «Verificación visual», con una captura por estado y tema guardada fuera de git.
- [ ] **Step 5: Commit de la task** — `feat(0012): selector de estado en la lista de reservas`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (frontend ~40 s, backend 17–21 min, en segundo plano) y `moon run frontend:check`.
- [ ] Verificación de los escenarios de la spec, una fila por THEN con su evidencia (`suite`, `ejecución real` o `no probado`). El 400 de `?status=foo` se provoca de verdad.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado (migración → `Confirmed`, nuevas → `Pending`) → Task 1 (`Existing_bookings_become_confirmed_after_migration`, `New_bookings_are_created_pending`). ✓
- La API filtra por estado; sin `status`, todas → Task 1 (`Filters_bookings_by_status`, `Without_status_returns_all_states`). ✓
- La lista se filtra con un selector → Task 2 (`requests the chosen status`). ✓
- El selector en tema claro y oscuro, normal, con foco y deshabilitado mientras carga → Task 2 (`disables the selector while loading` y la Verificación visual). ✓
- La API documenta `status` y sus tres valores → Task 1, Step 2 y Step 4. ✓
- Cambiar el estado desde la interfaz → N/A (fuera de alcance en la spec). ✓
- Foco de revisión: las cinco entradas tienen su test en la task dueña (§1.10). ✓
