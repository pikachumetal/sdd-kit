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

1. **Dos tasks, cada una probable en la aplicación**: Task 1 es BD + API + `docs/api.md` (se prueba con `GET /bookings?status=Cancelled`); Task 2 es el selector y la lista. No se parte la feature: 2 tasks.
2. **Modelo y effort**: las dos tasks con `sdd-kit:effort-medium` + `sonnet`. El código es acotado y el plan fija firmas y valores; gama media es el suelo del Art. 6. Revisor final de rama: `sdd-kit:effort-high` + `opus`.
3. **Ejecución: Native**. Son 2 tasks en serie, y la 2 depende del contrato JSON de la 1 (`status` como texto). La revisión final en Opus es la única revisión independiente. La sesión va bien en Sonnet con effort medium.
4. **Estado guardado como texto** (`nvarchar(16)`, `HasConversion<string>()`) y serializado en JSON por nombre (`"Confirmed"`). Así la BD se lee sin tabla de códigos y el frontend recibe el mismo literal que envía en `?status=`.
5. **Migración sin valor por defecto en BD**: se añade la columna como nullable, se hace `UPDATE … SET Status = 'Confirmed'` y después pasa a `NOT NULL`. Las reservas nuevas salen `Pending` por el inicializador de la entidad. No uso `HasDefaultValue(Pending)`: EF omitiría el valor cuando coincide con el default del CLR y la BD pondría otro.
6. **`status` inválido → 400** con `ValidationProblem` y el mensaje «Valores válidos: Confirmed, Pending, Cancelled». No ignoro el filtro en silencio. También son 400 los valores numéricos (`status=1`), aunque `Enum.TryParse` los aceptaría. `status` vacío o ausente devuelve todas.
7. **Etiquetas del selector**: «Todos», «Confirmada», «Pendiente», «Cancelada», con la etiqueta de campo «Estado». Lleva un `<select>` nativo, que da el foco y el deshabilitado accesibles sin código propio.
8. **Falta `§Frontend` en `tech-stack.md`** y la spec aprobada no la propuso. Propuesta, que se escribe en `tech-stack.md` al empezar la Task 2 si no dices otra cosa:
   - URL: `http://localhost:4200`
   - Detector: `npx impeccable@<versión fijada> detect {url} --viewport {viewport}`, fallo con código 2
   - Viewports: `1280x800` y `390x844`
   - Runner: Playwright
   - Acceso: `sin login`, porque en el código no hay autenticación
   - Temas: `prefers-color-scheme`, emulado con `colorScheme` de Playwright; hay que confirmarlo, porque el código visible no dice cómo se activa el oscuro
   - Pantalla de referencia: la lista de reservas
9. **Riesgo alto: no hay carpeta `Migrations/`** en `backend/src/Bookings.Api`. Si el proyecto crea el esquema con `EnsureCreated` y no con migraciones, `migrations add` genera una migración inicial de toda la tabla, y el escenario «se aplica la migración» cambia de naturaleza. Es un freno de alcance: la Task 1 lo comprueba primero y, si es así, para.
10. **Coste estimado**: ~3 h de implementación, más ~20 min de `backend:test`. Revisión final: un despacho en Opus, del orden de 1–2 $.
11. **Review Focus**: 5 entradas que la spec no fija, con su comportamiento esperado (valor desconocido, numérico, minúsculas, vacío, paginación del filtrado). Están en la sección de abajo, cada una con su test.

**Goal**: guardar el estado de cada reserva, filtrarlo en `GET /bookings?status=` y elegirlo desde la lista con un selector.

**Architecture**: un enum `BookingStatus` en la entidad, persistido como texto con una migración que marca las existentes como `Confirmed`. El endpoint filtra antes de paginar, porque la lista está paginada. En el frontend, un componente `app-status-select` con `model()` alimenta un `signal` de la lista, y el `httpResource` se recalcula con el parámetro.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit + Testcontainers; Angular 20 con signals y `httpResource`, Vitest con jsdom.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks en serie cuyo contrato (el JSON de `status`) comparten, y el plan ya fija el diseño. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Estados, literales exactos: `Confirmed`, `Pending`, `Cancelled`. Las reservas existentes pasan a `Confirmed` en la migración y las nuevas se crean con `Pending`.
- El filtro va en la API (`GET /bookings?status=`), no en el cliente.
- El selector es el componente `app-status-select`, con la opción «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.
- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Modo de ejecución: native (línea `Ejecución`).
- Git-flow: `feature/0012` desde `develop`; commits con el id `0012`.

## Review Focus

- `GET /bookings?status=Foo` → 400 con los estados válidos, no la lista entera · Task 1, `Rejects_unknown_status`
- `GET /bookings?status=1` → 400; un número no es un estado aunque `Enum.TryParse` lo acepte · Task 1, `Rejects_numeric_status`
- `GET /bookings?status=cancelled` (en minúsculas) → las mismas canceladas que con `Cancelled` · Task 1, `Filters_status_case_insensitively`
- `GET /bookings?status=` (vacío) → todas, igual que sin parámetro · Task 1, `Empty_status_returns_all`
- `GET /bookings?status=Pending&page=2` con 21 pendientes y 5 confirmadas → 1 reserva: se pagina sobre el conjunto ya filtrado · Task 1, `Paginates_within_the_filtered_status`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un enum, un parámetro opcional y un `<select>` nativo; sin librería de UI.
- [x] **YAGNI gate**: `app-status-select` lo pide la spec; no se abstrae un «filtro genérico».
- [x] **Brownfield gate**: sin `status`, `GET /bookings` responde como antes (más el campo `status`); se respeta el patrón de `MapBookings` y de `httpResource`; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 2 (verde por superficie en cada task; gate completo en §3), Art. 4 (castellano en la UI y en `docs/api.md`), Art. 5 (en «De código»), Art. 6 (modelo y effort por task).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — el enum, con la serialización JSON por nombre.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ snapshot) — la columna y el backfill.
- `backend/tests/Bookings.Tests/BookingStatusTests.cs` — la migración y el estado por defecto.
- `frontend/src/app/bookings/status-select.component.ts` / `.css` / `.spec.ts` — el selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — la propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — la conversión a texto.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — el parámetro `status`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — los tests del filtro.
- `docs/api.md` — el parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — el tipo `BookingStatus` y el campo.
- `frontend/src/app/bookings/booking-list.component.ts` / `.spec.ts` — el selector y el parámetro de la petición.
- `.docs/sdd/tech-stack.md` — `§Frontend` (decisión 8).

**NO se tocan**:

- `moon.yml` — los comandos ya cubren las dos superficies.
- `booking-list.component.css` — el selector lleva sus propios estilos.

### 1.2 Modelo de datos

`Bookings.Status nvarchar(16) NOT NULL`, con los valores `Confirmed | Pending | Cancelled`.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. El `Up` generado se edita así: `AddColumn` nullable, `Sql("UPDATE [Bookings] SET [Status] = 'Confirmed'")` y `AlterColumn` a `nullable: false`. El `Down` hace `DropColumn`.

### 1.4 Contratos API

`GET /bookings?page=<int=1>&status=<Confirmed|Pending|Cancelled>`. Sin distinguir mayúsculas y minúsculas; vacío o ausente devuelve todas. Cada reserva lleva `"status": "<nombre>"`. Si el valor no es válido → `400` con `ValidationProblem`: `{ "errors": { "status": ["Valores válidos: Confirmed, Pending, Cancelled"] } }`.

### 1.5 UX

Encima de la lista, `<label>Estado <select>` con «Todos» (valor nulo), «Confirmada», «Pendiente» y «Cancelada». Se deshabilita mientras `bookings.isLoading()`. Colores con `var(--text)` / `var(--surface)` y foco visible con `:focus-visible`.

### 1.6 Dependencias

Ninguna nueva. Depende de la paginación de la v0.4.0, ya en `develop`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El esquema no se gestiona con migraciones (no hay `Migrations/`) | media | alto | La Task 1 lo comprueba antes de nada; si no hay historial, freno de alcance y parada |
| `backend:test` tarda 17–21 min | alta | medio | «Verificación» con `--filter`; la suite entera va en «Verificación lenta», en segundo plano |
| El tema oscuro no se activa como supone la decisión 8 | media | bajo | Confirmarlo al escribir `§Frontend`, antes de la verificación visual |

### 1.8 Rollout

Directo. La migración va antes de desplegar la API; el frontend, después de la API, porque sin ella el parámetro se ignoraría.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD y filtro en la API

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`. En Native la ejecuta la sesión.
**Tests RED**: Native, TDD del propio hilo en `backend/tests/Bookings.Tests/BookingStatusTests.cs` y `BookingsEndpointsTests.cs`, con una copia fuera del repo antes del código.
**Superficies**: BD · backend · docs
**Verificación**: `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingStatusTests|FullyQualifiedName~BookingsEndpointsTests"` → todos en verde.
**Verificación lenta**: `moon run backend:test` · 17–21 min
**Se prueba en la aplicación**: con `moon run backend:run`, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo reservas con `"status": "Cancelled"`, y `?status=Foo` devuelve 400.

**Interfaces**:
- Consume: nada.
- Produce: `enum BookingStatus { Pending, Confirmed, Cancelled }`, serializado por nombre; `Booking.Status`; `GET /bookings?status=` con el contrato de abajo.

**Ficheros**: crear `Data/BookingStatus.cs`, `Migrations/*_AddBookingStatus.cs`, `tests/.../BookingStatusTests.cs`; modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs`, `tests/.../BookingsEndpointsTests.cs`, `docs/api.md`.

- [ ] **Step 0: Freno** — `ls backend/src/Bookings.Api/Migrations`. Si no existe o no tiene migraciones previas, para: el escenario de la migración necesita historial (decisión 9).
- [ ] **Step 1: Tests RED** (siembra con `factory.SeedAsync`):
  - `Existing_bookings_become_confirmed_after_migration`: migra a la migración anterior a `AddBookingStatus` con `db.GetService<IMigrator>().MigrateAsync(<anterior>)`, inserta una reserva por SQL, migra a `AddBookingStatus` y comprueba `Assert.Equal(BookingStatus.Confirmed, booking.Status)`.
  - `New_bookings_are_created_pending`: `Assert.Equal(BookingStatus.Pending, new Booking().Status)`, y lo mismo tras guardarla y releerla de BD.
  - `Filters_by_status`: siembra una por estado; `GET /bookings?status=Cancelled` → `Assert.All(list, b => Assert.Equal(BookingStatus.Cancelled, b.Status))` y `Assert.Single(list)`.
  - `Without_status_returns_all`: con la misma siembra, `Assert.Equal(3, list.Count)`.
  - `Serializes_status_as_name`: el JSON crudo contiene `"status":"Confirmed"`.
  - Review Focus: `Rejects_unknown_status` (`Foo` → `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)` y el cuerpo contiene `Valores válidos: Confirmed, Pending, Cancelled`), `Rejects_numeric_status` (`1` → 400), `Filters_status_case_insensitively` (`cancelled` → solo canceladas), `Empty_status_returns_all` (`status=` → 3), `Paginates_within_the_filtered_status` (21 `Pending` + 5 `Confirmed`, `?status=Pending&page=2` → `Assert.Single(list)`).
- [ ] **Step 2: Implementación**:
  - `public enum BookingStatus { Pending, Confirmed, Cancelled }` con `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))]`.
  - `Booking.Status { get; set; } = BookingStatus.Pending`.
  - En `BookingsDb.OnModelCreating`: `Property(b => b.Status).HasConversion<string>().HasMaxLength(16)`.
  - La migración, según §1.3 (nullable → `UPDATE` → `NOT NULL`).
  - `MapGet("/bookings", (BookingsDb db, int page = 1, string? status = null))`, que devuelve `Results<Ok<List<Booking>>, ValidationProblem>`. Filtra antes de `OrderBy/Skip/Take`.
  - `static bool TryParseStatus(string? raw, out BookingStatus? status)`: vacío → `true` con `null`; un número o un nombre desconocido → `false`; sin distinguir mayúsculas y minúsculas.
  - `docs/api.md`: fila `status` | texto | todas, con los tres valores y el 400.
- [ ] **Step 3: Build** — `dotnet build backend/src/Bookings.Api` → sin errores ni avisos nuevos.
- [ ] **Step 4: Verificación** — el comando de «Verificación» → verde. El hilo lanza en segundo plano `moon run backend:test` → verde.
- [ ] **Step 5: Commit de la task** — `feat(0012): estado de la reserva y filtro por estado en la API`.

### Task 2 — Selector de estado en la lista

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`. En Native la ejecuta la sesión.
**Tests RED**: Native, TDD del propio hilo en `status-select.component.spec.ts` y `booking-list.component.spec.ts`, con una copia fuera del repo antes del código.
**Superficies**: frontend · docs (`tech-stack.md`)
**Verificación**: `moon run frontend:test` y `moon run frontend:check` → verde.
**Verificación visual**: la lista de reservas (`http://localhost:4200`). Estados del selector: normal, con foco (teclado) y deshabilitado (mientras carga). Temas claro y oscuro. Criterio:
- El selector muestra «Estado» y las opciones «Todos», «Confirmada», «Pendiente», «Cancelada».
- Con «Cancelada» elegida, la lista muestra solo las canceladas.
- En los dos temas, texto y fondo usan `--text` y `--surface`, y el foco se ve.
- Deshabilitado se distingue del normal.

Pantalla de referencia: la lista de reservas actual. Con la API de la Task 1 arrancada y datos en los tres estados.
**Se prueba en la aplicación**: el usuario abre la lista, elige «Cancelada» en «Estado» y ve solo las reservas canceladas; vuelve a «Todos» y ve todas.

**Interfaces**:
- Consume: `GET /api/bookings?status=<Confirmed|Pending|Cancelled>`, y cada reserva con `status: 'Confirmed' | 'Pending' | 'Cancelled'`.
- Produce: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'`, `Booking.status: BookingStatus`, y el componente `StatusSelectComponent` (`app-status-select`) con `value = model<BookingStatus | null>(null)` y `disabled = input(false)`.

**Ficheros**: crear `status-select.component.{ts,css,spec.ts}`; modificar `booking.ts`, `booking-list.component.{ts,spec.ts}`, `.docs/sdd/tech-stack.md`.

- [ ] **Step 0: `§Frontend`** — escribe en `tech-stack.md` la propuesta de la decisión 8, con la versión de impeccable fijada y el mecanismo de tema comprobado en `frontend/src`.
- [ ] **Step 1: Tests RED**:
  - `status-select`, `renders Todos and the three statuses`: los textos de las opciones son `['Todos', 'Confirmada', 'Pendiente', 'Cancelada']`.
  - `status-select`, `updates value when an option is chosen`: al elegir «Cancelada», `value()` es `'Cancelled'`; al elegir «Todos», `null`.
  - `status-select`, `disables the select`: con `disabled` a `true`, `select.disabled` es `true`.
  - `booking-list`, `requests the chosen status`: al elegir `'Cancelled'`, `expectOne(r => r.url === '/api/bookings' && r.params.get('status') === 'Cancelled')`; tras `flush` de una cancelada, un `li`.
  - `booking-list`, `requests all bookings without status for Todos`: `expectOne(r => r.url === '/api/bookings' && !r.params.has('status'))`.
  - `booking-list`, `disables the selector while loading`: antes del `flush`, `select.disabled` es `true`; después, `false`.
- [ ] **Step 2: Implementación**:
  - El `StatusSelectComponent` de «Produce», con un `<select>` nativo dentro de `<label>Estado</label>`. Etiquetas: `Confirmed` → «Confirmada», `Pending` → «Pendiente», `Cancelled` → «Cancelada».
  - En `BookingListComponent`: `readonly status = signal<BookingStatus | null>(null)`. `httpResource` con `() => ({ url: '/api/bookings', params: status ? { status } : {} })`. En la plantilla, `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />`.
  - CSS: `var(--text)` / `var(--surface)`; `:focus-visible` con `outline: 2px solid currentColor`; `:disabled` con `opacity: .6` y `cursor: not-allowed`.
- [ ] **Step 3: Build** — `moon run frontend:check` → sin errores.
- [ ] **Step 4: Verificación** — el comando de «Verificación» → verde. Después, la verificación visual en el navegador: el detector de `§Frontend` en los dos viewports y una captura por estado y tema.
- [ ] **Step 5: Commit de la task** — `feat(0012): selector de estado en la lista de reservas`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (incluye `backend:test`, de 17 a 21 min) y `moon run frontend:check`.
- [ ] Verificación de los criterios de éxito de la spec: una fila de smoke por THEN, con ejecución real contra `backend:run` + `frontend:serve`.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

Perfil `delegate`: sin gate de plan. Cada escenario de la spec tiene su task:

- Cada reserva tiene un estado (migración → `Confirmed`; nuevas → `Pending`) → Task 1, `Existing_bookings_become_confirmed_after_migration` y `New_bookings_are_created_pending`. ✓
- La API filtra por estado; sin `status`, todas → Task 1, `Filters_by_status` y `Without_status_returns_all`. ✓
- La lista se filtra con un selector; claro y oscuro; normal, foco y deshabilitado → Task 2, `requests_the_chosen_status`, `disables the selector while loading` y su «Verificación visual». ✓
- La API documenta el filtro → Task 1, Step 2 (`docs/api.md`); se comprueba en la revisión y en el smoke. ✓
- Cambiar el estado desde la interfaz → N/A (fuera del Scope de la spec). ✓
- Review Focus → Task 1, `Rejects_unknown_status`, `Rejects_numeric_status`, `Filters_status_case_insensitively`, `Empty_status_returns_all` y `Paginates_within_the_filtered_status`. ✓
