---
id: 20260923-090000-task-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-29
---

# Plan de implementación — Filtrar la lista de reservas por estado

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (Native) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: las dos tasks las hace el hilo en Native con la sesión en gama media (Sonnet, effort medium): la spec ya fija los valores y el plan las firmas y los tests. El revisor final de rama va con `subagent_type: sdd-kit:effort-high` + `model: opus`, único revisor independiente de Native.
2. **Ejecución**: Native. Solo son 2 tasks y comparten un contrato (los tres nombres de estado y el formato JSON); un implementador por task no aporta nada y cuesta un contexto nuevo cada vez.
3. **Estados como texto**: `BookingStatus` (`Confirmed`, `Pending`, `Cancelled`) se guarda como `nvarchar` (`HasConversion<string>()`) y viaja en JSON como texto (`[JsonConverter(typeof(JsonStringEnumConverter))]` sobre el enum), para que la columna, la query `?status=` y el cliente Angular usen las mismas palabras.
4. **Migración `AddBookingStatus`**: EF genera `defaultValue: ""` para la columna nueva y hay que editarla a `"Confirmed"`, que es lo que hace que las reservas existentes queden confirmadas. El modelo no declara valor por defecto en BD: el `Pending` de las nuevas sale del inicializador de `Booking.Status`.
5. **Valor de `status` que la spec no fija**: se compara sin distinguir mayúsculas y minúsculas; vacío = sin filtro; cualquier otro valor (incluido un número: `status=1`) → `400 Bad Request`. Devolver todo o un 500 ante un valor inválido sería peor.
6. **Textos del selector** (la spec solo fija «Todos»): «Todos», «Confirmada», «Pendiente», «Cancelada».
7. **Partición**: 2 tasks y una sola capacidad; no se propone partir la feature. La Task 1 (BD, API y docs) no es una capa suelta: su resultado se prueba en la aplicación con la API.
8. **Riesgos altos**: (a) el repo solo trae 4 ficheros de backend y ninguna migración, `csproj`, `Program.cs` ni `SqlServerApiFactory`, que el test existente usa; el plan los da por existentes. (b) `tech-stack.md` no tiene `§Frontend`, así que la Verificación visual de la Task 2 no tiene detector ni acceso declarados.
9. **Coste estimado**: ~2 h de hilo. `backend:test` tarda 17-21 min y corre dos veces (Task 1 en segundo plano y gate final). Revisor final: unos pocos dólares en tokens.

**Goal**: cada reserva tiene un estado guardado en BD, `GET /bookings?status=` filtra por él y la lista tiene un selector que lo usa.

**Architecture**: columna `Status` en `Booking` (texto, migración con las existentes en `Confirmed`), filtro en `GET /bookings` antes de paginar, y un componente `app-status-select` que la lista enlaza a la URL del `httpResource`.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit con Testcontainers; Angular 20 con signals, Vitest, tema claro y oscuro con variables CSS.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks con un contrato compartido pequeño. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.
- Texto de la interfaz y de los documentos en castellano.
- Los tres estados son exactamente `Confirmed`, `Pending`, `Cancelled`; las reservas existentes pasan a `Confirmed` y las nuevas se crean con `Pending`.
- El filtro es `GET /bookings?status=`; sin `status`, devuelve todas.
- El selector es el componente `app-status-select`, con «Todos» por defecto.

### De proceso

- Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
- Ejecución Native: el hilo escribe los tests de cada THEN antes del código y guarda copia fuera del repo para compararla al cerrar la task.
- Commits: `feat(0012): <qué>`, en castellano y terminados con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

Entradas que la spec implica pero ningún THEN ejercita, de más a menos probable. Cada una tiene su test en la task que posee el código.

1. `?status=cancelled` (minúsculas) devuelve las canceladas, no un error → Task 1, `Status_is_case_insensitive`.
2. `?status=Archived` o `?status=1` devuelve 400, no un 500 ni todas las reservas → Task 1, `Rejects_unknown_status`.
3. Filtro con paginación: `?status=Cancelled&page=2` filtra antes de paginar → Task 1, `Filters_before_paginating`.
4. `?status=` vacío equivale a no filtrar → Task 1, `Empty_status_returns_all`.
5. Elegir un estado sin reservas deja la lista vacía sin fallar, y volver a «Todos» pide de nuevo sin `status` → Task 2, `shows_an_empty_list_for_a_status_without_bookings` y `requests_all_again_when_Todos_is_chosen`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin endpoint nuevo ni cambio de estado desde la interfaz (fuera de Scope); un enum, una columna, un parámetro y un componente.
- [x] **YAGNI gate**: `app-status-select` tiene un solo uso hoy, pero la spec lo exige como componente propio (decisión 3 aprobada); no se abstrae nada más.
- [x] **Brownfield gate**: retrocompatible (sin `status` la API responde igual, y el `expectOne('/api/bookings')` del test existente sigue valiendo); respeta el patrón `BookingsEndpoints` y `booking-list.component`; sin refactor fuera de scope.
- [x] **Constitution check**: Art. 2 (todo verde por task, con las superficies de la task), Art. 4 (castellano), Art. 5 (calidad), Art. 6 (modelos).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum con `[JsonConverter(typeof(JsonStringEnumConverter))]`.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ `.Designer.cs`, y el snapshot del contexto) — generados por `dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`, con el `defaultValue` editado a `"Confirmed"`.
- `backend/tests/Bookings.Tests/BookingStatusMigrationTests.cs` — el THEN de la migración.
- `frontend/src/app/bookings/status-select.component.ts`, `.css` y `.spec.ts` — el selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating` con la conversión a texto.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro.
- `docs/api.md` — parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — `BookingStatus`, `StatusFilter` y `Booking.status`.
- `frontend/src/app/bookings/booking-list.component.ts` — estado del filtro y URL del recurso.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — tests del filtro.

**NO se tocan**:

- `moon.yml`, `README.md` — el flujo de comandos no cambia.
- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva su propio CSS.

### 1.2 Modelo de datos

`Booking.Status`: `BookingStatus`, no nulo, inicializado a `Pending`, columna `nvarchar` con los nombres del enum.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. La columna se añade con `defaultValue: "Confirmed"` para las filas existentes.

### 1.4 Contratos API

`GET /bookings?page=<int>&status=<Confirmed|Pending|Cancelled>`: `status` sin distinguir mayúsculas y minúsculas; ausente o vacío = todas; otro valor = `400`. Cada reserva del JSON lleva `"status": "Confirmed"` (texto).

### 1.5 UX

`app-status-select` es un `<select>` nativo sobre las variables `--text` y `--surface` (tema claro y oscuro), con anillo de foco visible y aspecto deshabilitado mientras la lista carga. Opciones: «Todos» (por defecto), «Confirmada», «Pendiente», «Cancelada».

### 1.6 Dependencias

Ninguna nueva. La feature 0011 (avisos por correo) no comparte ficheros con esta según el roadmap.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El repo no trae `csproj`, `Program.cs`, migraciones previas ni `SqlServerApiFactory` | Alta | Alto: no se puede compilar ni migrar | Comprobar al abrir la Task 1; si faltan, parar y avisar en vez de inventarlos |
| El test de migración necesita la cadena de conexión de la factory | Media | Medio | Si `SqlServerApiFactory` no la expone, añadir una propiedad de solo lectura; se registra como ruling |
| `tech-stack.md` sin `§Frontend`: sin detector ni acceso | Alta | Medio: verificación visual sin detector | Mirar en navegador con Playwright y dejar «composición no medida»; proponer `§Frontend` al dev-lead |
| `httpResource('/api/...')` puede necesitar un proxy que no está en el repo | Media | Medio | Si no hay proxy, la Verificación visual responde `/api/bookings` con datos de prueba de la spec |

### 1.8 Rollout

Directo. Se despliega migración y API a la vez; el cliente antiguo sigue funcionando porque `status` es opcional.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva y filtro en la API

**Modelo**: hilo principal, sesión Native en gama media (Sonnet, effort medium). Hay que interpretar la migración y el valor por defecto; no es mecánica.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` y `backend/tests/Bookings.Tests/BookingStatusMigrationTests.cs`, escritos antes del código y sin commitear: van en el commit de la task.

**Superficies**: BD · backend · docs
**Verificación**: `dotnet build backend/src/Bookings.Api`; `rg "status" docs/api.md` debe mostrar el parámetro y los tres valores.
**Verificación lenta**: `moon run backend:test` · 17-21 min; la lanza el hilo en segundo plano tras el último cambio de la task.
**Se prueba en la aplicación**: con `moon run backend:run`, `GET http://localhost:5080/bookings?status=Cancelled` devuelve solo las canceladas, y sin `status` devuelve todas; las reservas anteriores salen `"status": "Confirmed"`.

**Interfaces**:
- Consume: `Booking` (`Id`, `Room`, `Start`, `End`, `Owner`), `BookingsDb.Bookings` y el endpoint `GET /bookings?page=` con 20 por página, ordenado por `Start`.
- Produce: `enum BookingStatus { Confirmed, Pending, Cancelled }` en `Bookings.Api.Data`; `Booking.Status` (`BookingStatus`, por defecto `Pending`); JSON con `"status": "<nombre>"`; `GET /bookings?page&status` con las reglas de §1.4.

**Ficheros**: los de §1.1 marcados backend, BD y docs.

- [ ] **Step 1: Tests RED** — en `BookingsEndpointsTests`, con `factory.SeedAsync(...)` y `Status` explícito salvo donde se indica:
  - `Filters_by_status`: siembra una reserva por estado; `GET /bookings?status=Cancelled` → 1 reserva y `Assert.All(bookings, b => Assert.Equal(BookingStatus.Cancelled, b.Status))`.
  - `Returns_all_without_status`: las mismas tres → `Assert.Equal(3, bookings.Count)`.
  - `Status_is_case_insensitive`: `?status=cancelled` → 1 cancelada.
  - `[Theory] Rejects_unknown_status` con `"Archived"` y `"1"` → `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)`.
  - `Empty_status_returns_all`: `?status=` → las 3.
  - `Filters_before_paginating`: 25 `Cancelled` y 5 `Confirmed`; `?status=Cancelled&page=2` → 5 reservas, todas `Cancelled`.
  - `New_bookings_default_to_Pending`: siembra una `Booking` sin tocar `Status` → al leerla, `BookingStatus.Pending`.

  En `BookingStatusMigrationTests`: `Existing_bookings_become_Confirmed_after_migrating` — migra una base nueva hasta la migración anterior a `AddBookingStatus` (la que precede a la que termina en ese nombre en `db.Database.GetMigrations()`), inserta una reserva con SQL directo, migra hasta la última y comprueba `Status == BookingStatus.Confirmed`.
- [ ] **Step 2: Comprobar el RED** — `dotnet build backend/tests/Bookings.Tests` falla por compilación (`BookingStatus` no existe). Guardar copia de los tests fuera del repo.
- [ ] **Step 3: Implementación**
  - `BookingStatus.cs`: el enum con el atributo `JsonConverter(typeof(JsonStringEnumConverter))`.
  - `Booking.cs`: `public BookingStatus Status { get; set; } = BookingStatus.Pending;`.
  - `BookingsDb.cs`: `protected override void OnModelCreating(ModelBuilder modelBuilder)` con `Property(b => b.Status).HasConversion<string>()`.
  - Migración: generarla y editar `defaultValue` a `"Confirmed"`.
  - `BookingsEndpoints.cs`: la lambda pasa a `async Task<IResult> (BookingsDb db, int page = 1, string? status = null)`. Un método privado `TryParseStatus(string?, out BookingStatus?)` acepta vacío como sin filtro y rechaza lo que no sea un nombre del enum (`Enum.IsDefined` tras `Enum.TryParse(..., ignoreCase: true)`, para que `"1"` no cuele). El `Where` va antes de `Skip`/`Take`.
  - `docs/api.md`: fila `status` en la tabla de `GET /bookings`, con tipo (`Confirmed`, `Pending` o `Cancelled`), sin distinguir mayúsculas, y «todas» como valor por defecto; una frase que dice que otro valor da `400`.
- [ ] **Step 4: Build** — `dotnet build backend/src/Bookings.Api`. Esperado: verde, sin errores.
- [ ] **Step 5: Verificación** — comparar los tests con la copia (`git diff --no-index`); lanzar `moon run backend:test` en segundo plano con su vigía de silencio. Esperado: todos verdes, incluidos los 8 nuevos; `rg "status" docs/api.md` muestra el parámetro y los tres valores.
- [ ] **Step 6: Commit de la task** — `feat(0012): estado de la reserva y filtro por estado en la API`, uno solo al quedar limpia su revisión, con el `Co-Authored-By` de las restricciones de proceso.

### Task 2 — Selector de estado en la lista

**Modelo**: hilo principal, sesión Native en gama media (Sonnet, effort medium). La firma y los tests determinan casi todo.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos antes del código y sin commitear.

**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`.
**Verificación visual**: pantalla `http://localhost:4200` (`moon run frontend:serve`), con la API en `http://localhost:5080` o, si no hay proxy `/api`, con la respuesta simulada de `/api/bookings` con una reserva por estado. Estados: normal, con foco, deshabilitado (durante la carga). Temas: claro y oscuro. Criterio:
  - el selector muestra «Todos» al abrir la lista;
  - el texto del selector y su fondo son legibles en los dos temas;
  - el foco por teclado se distingue a simple vista;
  - deshabilitado se ve atenuado y no responde a clics;
  - al elegir «Cancelada», la lista muestra solo la reserva cancelada.

  Pantalla de referencia: la propia lista de reservas. `tech-stack.md` no declara detector: la verificación deja «composición no medida: `tech-stack.md` no declara detector en §Frontend».
**Se prueba en la aplicación**: el usuario abre la lista, elige «Cancelada» en el selector y ve solo las reservas canceladas; vuelve a «Todos» y las ve todas.

**Interfaces**:
- Consume: `GET /api/bookings?status=<Confirmed|Pending|Cancelled>` (sin `status` para todas), que devuelve `[{ id, room, start, status }]` con `status` en texto; el `BookingListComponent` actual con `httpResource<Booking[]>(() => '/api/bookings')`.
- Produce: en `booking.ts`, `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'`, `export type StatusFilter = BookingStatus | 'All'` y `Booking.status: BookingStatus`. Componente `app-status-select` con `readonly value = model<StatusFilter>('All')` y `readonly disabled = input(false)`.

**Ficheros**: los de §1.1 marcados frontend.

- [ ] **Step 1: Tests RED**
  - `status-select.component.spec.ts`:
    - `offers Todos, Confirmada, Pendiente and Cancelada with Todos selected by default` — 4 `option` con esos textos en ese orden, y `select.value === 'All'`.
    - `emits the chosen status` — cambiar el `select` a `Cancelled` deja `value()` en `'Cancelled'`.
    - `is disabled when disabled is true` — con `disabled` en `true`, `select.disabled` es `true`.
  - `booking-list.component.spec.ts`, sobre el test existente (que sigue esperando `/api/bookings`):
    - `requests only the chosen status` — elegir `Cancelled` → `expectOne('/api/bookings?status=Cancelled')`, se sirve una reserva y hay 1 `li`.
    - `requests all again when Todos is chosen` — tras `Cancelled`, volver a `All` → `expectOne('/api/bookings')`.
    - `disables the selector while loading` — antes de servir la primera respuesta, `select.disabled` es `true`; tras servirla, `false`.
    - `shows an empty list for a status without bookings` — se sirve `[]` → 0 `li` y sin error.
- [ ] **Step 2: Comprobar el RED** — `moon run frontend:test` falla por compilación (`StatusSelectComponent` no existe). Guardar copia de los tests fuera del repo.
- [ ] **Step 3: Implementación**
  - `booking.ts`: los tipos de Interfaces y `status: BookingStatus` en `Booking`.
  - `status-select.component.ts` y `.css`: `StatusSelectComponent` con `selector: 'app-status-select'`, `<select>` nativo con las 4 opciones, enlazado a `value` y `disabled`; el CSS usa `var(--text)` y `var(--surface)`, `:focus-visible` con contorno y `:disabled` con opacidad reducida.
  - `booking-list.component.ts`: `readonly status = signal<StatusFilter>('All')`; el `httpResource` pasa a pedir `/api/bookings` si es `'All'` y `/api/bookings?status=${status()}` si no; la plantilla añade `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` encima de la lista y el componente lo importa.
- [ ] **Step 4: Build** — `moon run frontend:check`. Esperado: lint y `tsc --noEmit` verdes.
- [ ] **Step 5: Verificación** — comparar los tests con la copia; `moon run frontend:test`. Esperado: todos verdes, incluidos los 7 nuevos. Después, la Verificación visual: arrancar `moon run frontend:serve` (puerto 4200 libre antes, PID guardado, parado por PID al acabar), Playwright en claro y oscuro, capturas fuera de git.
- [ ] **Step 6: Commit de la task** — `feat(0012): selector de estado en la lista de reservas`, uno solo al quedar limpia su revisión, con el `Co-Authored-By` de las restricciones de proceso.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los criterios de éxito de la spec (§2): un smoke con una fila por THEN, y cada THEN de interfaz (respuesta de la API, selector en los dos temas) con `ejecución real`, incluido el `400` provocado con `?status=Archived`
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Revisor final en segundo plano con `sdd-kit:effort-high` + `opus`, anclado al sha de la Task 2
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cada reserva tiene un estado» → Task 1 (`Existing_bookings_become_Confirmed_after_migrating`, `New_bookings_default_to_Pending`). ✓
- ADDED «La API filtra por estado» → Task 1 (`Filters_by_status`, `Returns_all_without_status`). ✓
- ADDED «La lista se filtra con un selector» → Task 2 (tests de lista y selector, más Verificación visual en claro, oscuro, foco y deshabilitado). ✓
- ADDED «La API documenta el filtro» → Task 1 (`docs/api.md`, comprobado con `rg`). ✓
- Decisiones 1-3 de la spec → Restricciones de código, Task 1 y Task 2. ✓
- «No entra: cambiar el estado desde la interfaz» → N/A: ninguna task lo toca. ✓
- Review Focus: los 5 puntos tienen su test en Task 1 o Task 2. ✓
