---
id: 20260929-192656-feature-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-29
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Riesgo alto, bloqueante: la infraestructura de tests del backend no está en el repo.** `BookingsEndpointsTests.cs` usa `SqlServerApiFactory` y `factory.SeedAsync(...)`, pero ni esa clase ni los `.csproj`, `Program.cs` o una carpeta `Migrations/` están versionados. Sin ellos la Task 1 no compila ni se puede verificar. Antes de arrancar hace falta saber dónde viven; si hay que crearlos, es alcance nuevo y va por la fila «Desvío».
2. **Riesgo alto: puede que no haya ninguna migración anterior.** Si el esquema se creó con `EnsureCreated`, `AddBookingStatus` sería la primera migración y generaría la tabla entera, con lo que fallaría sobre las bases que ya existen. Si pasa eso, se para (freno de alcance) en vez de escribir una migración base.
3. **Estado como `enum BookingStatus { Confirmed, Pending, Cancelled }` guardado como texto** (`HasConversion<string>()`, `nvarchar(16)`) y serializado en JSON como texto (`JsonStringEnumConverter`): la API y el frontend hablan con los nombres de la spec y no con 0/1/2.
4. **Relleno de la migración**: la columna se añade con `defaultValue: "Confirmed"` (así se rellenan las filas existentes) y, en la misma migración, se quita el default de la BD. Las reservas nuevas salen como `Pending` por el inicializador de la entidad (`Status = BookingStatus.Pending`). Hoy no hay endpoint de alta: «las nuevas se crean con `Pending`» se prueba guardando con EF.
5. **Filtro de la API**, que la spec no fija: `status` no distingue mayúsculas de minúsculas; vacío o ausente devuelve todas; un valor desconocido responde 400 (ValidationProblem), no 500 ni la lista entera. El filtro se aplica **antes** de paginar.
6. **Textos del selector** (Art. 4): la etiqueta es «Estado» y las opciones son «Todos», «Confirmada», «Pendiente» y «Cancelada». Es un `<select>` nativo dentro de `app-status-select`, deshabilitado mientras `bookings.isLoading()`.
7. **Falta `§Frontend` en `tech-stack.md`** y la spec no lo propuso. Propuesta: Detector `impeccable`, navegador Playwright (script con el paquete `playwright` si no está el MCP), Acceso: sin login (en el código no hay autenticación). Si la validas, se escribe en `tech-stack.md` en el commit de apertura. Si no, la verificación visual de la Task 2 queda como «composición no medida».
8. **Ejecución: Native**. Son 2 tasks, y la única interfaz entre ellas es el contrato JSON de `GET /bookings?status=`, que se copia en las dos tasks. Un error que se cuele lo encuentra la revisión final de rama. La sesión va bien en gama media: antes de decir «sigue», baja con `/model` a Sonnet con effort medium. El revisor final va con `sdd-kit:effort-high` + `opus`.
9. **Modelos, si se cambia a subagent**: Task 1 `sdd-kit:effort-medium` + `sonnet` (migración y EF con decisiones que hay que leer en prosa); Task 2 `sdd-kit:effort-medium` + `sonnet`.
10. **Coste**: ~3,5 h de implementación, más los 17–21 min de `backend:test` en el gate. En Native, sin despachos por task: solo el revisor final.

**Goal**: guardar el estado de cada reserva, filtrar `GET /bookings` por `status` y añadir en la lista un selector que la filtra.

**Architecture**: una columna `Status` de tipo texto con su migración, y un parámetro opcional `status` en el `MapGet` existente, filtrado antes de `Skip/Take`. En el frontend, un componente `app-status-select` con un `model()` y la URL del `httpResource` de la lista, que depende de esa señal.

**Tech Stack**: .NET 9 minimal API, EF Core 9 sobre SQL Server, xUnit + Testcontainers; Angular 20 (signals, `httpResource`), Vitest + jsdom.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks con una sola interfaz (el contrato JSON) copiada en ambas · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Estados, literales exactos: `Confirmed`, `Pending`, `Cancelled`. Las reservas existentes pasan a `Confirmed` y las nuevas se crean con `Pending`.
- Filtro en la API (`GET /bookings?status=`), no en el cliente. Sin `status` se devuelven todas.
- El selector es el componente `app-status-select`, con la opción «Todos» por defecto.
- Texto de la interfaz y de los documentos en castellano.
- Calidad de código (Art. 5): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.

### De proceso

- Política de modelos (Art. 6): al despachar se declaran modelo y effort, con gama media como suelo para revisores e implementadores. El revisor final va con `sdd-kit:effort-high` + `opus`.
- Modo de ejecución: native (ver la línea «Ejecución»).
- Commits con el ticket `0012` y la atribución `Co-Authored-By` del harness.

## Review Focus

1. **Filtro y paginación juntos**: con `?status=Cancelled&page=1` y 25 reservas `Pending` anteriores, se espera la cancelada, no una página vacía. Lo cubre la Task 1, `Filters_before_paginating`.
2. **Valor de `status` escrito a mano**: con `?status=cancelled` se esperan las canceladas; con `?status=Foo`, un 400 y no la lista entera ni un 500. Lo cubre la Task 1, `Status_is_case_insensitive` y `Unknown_status_returns_400`.
3. **El estado en el JSON como número**: el frontend compara con `'Cancelled'`, así que un `0/1/2` rompería el filtro en silencio. Lo cubre la Task 1, `Serializes_status_as_text`.
4. **El selector se queda deshabilitado tras un error de la API**: el usuario ya no puede cambiar de filtro. Lo cubre la Task 2, `re-enables the selector when the request fails`.
5. **Volver a «Todos» después de filtrar**: se espera la petición sin `status`, no `?status=` ni `?status=null`. Lo cubre la Task 2, `requests all bookings when Todos is chosen again`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: `<select>` nativo, un parámetro opcional en el endpoint que ya existe y ningún servicio nuevo.
- [x] **YAGNI gate**: no se abstrae nada; `app-status-select` lo pide la spec.
- [x] **Brownfield gate**: retrocompatible (sin `status`, la respuesta es la misma más el campo nuevo `status`). Respeta los patrones del módulo: `MapBookings` y `httpResource`. Sin refactor fuera de scope.
- [x] **Constitution check**: Art. 2 (verde por superficie en cada task y el gate completo en §3), Art. 3 (`feature/0012`), Art. 4 (textos en castellano) y Art. 5 (en las Restricciones de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — el enum, con el convertidor JSON a texto.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ `.Designer.cs` y el snapshot actualizado) — la columna y su relleno.
- `backend/tests/Bookings.Tests/BookingStatusMigrationTests.cs` — el escenario de la migración.
- `frontend/src/app/bookings/status-select.component.ts` y `.css` — el selector.
- `frontend/src/app/bookings/status-select.component.spec.ts`.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — la propiedad `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — la conversión a texto en `OnModelCreating`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — el parámetro `status`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — los tests del filtro.
- `docs/api.md` — la fila del parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — el tipo `BookingStatus` y el campo `status`.
- `frontend/src/app/bookings/booking-list.component.ts`, `.spec.ts` — el selector y la URL dependiente del filtro.

**NO se tocan**:

- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva sus propios estilos.
- `moon.yml` — no hay tareas nuevas.

### 1.2 Modelo de datos

`Bookings.Status nvarchar(16) NOT NULL`, con valores `Confirmed | Pending | Cancelled`.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. En `Up`, primero `AddColumn` con `defaultValue: "Confirmed"` y después `AlterColumn` sin default. En `Down`, `DropColumn`.

### 1.4 Contratos API

`GET /bookings?page=<int=1>&status=<Confirmed|Pending|Cancelled>` (sin distinguir mayúsculas de minúsculas, opcional). Cada elemento lleva `"status": "Confirmed" | "Pending" | "Cancelled"`, y un `status` desconocido responde 400.

### 1.5 UX

Encima de la lista va `<label>Estado <select>`, con las opciones «Todos» (valor vacío), «Confirmada», «Pendiente» y «Cancelada». El selector usa `var(--text)` y `var(--surface)`, así que va igual en claro y en oscuro. El foco es visible (`outline: 2px solid currentColor`) y el estado deshabilitado se atenúa (`opacity: .6`, `cursor: not-allowed`).

### 1.6 Dependencias

`SqlServerApiFactory` (fuera del repo, ver decisión 1) y un proxy `/api` → `http://localhost:5080` en el servidor de desarrollo, que ya existe porque la lista funciona.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La infraestructura de tests del backend no está en el repo | alta | alto | Preguntarlo antes de la Task 1 (decisión 1). |
| No hay migración previa (esquema creado con `EnsureCreated`) | media | alto | Freno de alcance: se para, sin escribir la migración base. |
| `SqlServerApiFactory` comparte la BD entre tests y los datos se acumulan | media | medio | Cada test siembra con una `Room` propia y filtra el resultado por ella. Si `SeedAsync` no aísla y rompe `Lists_bookings_ordered_by_start`, es un ruling. |
| La verificación del backend es lenta (Testcontainers) | alta | bajo | En la task, `dotnet test` con filtro; la suite entera solo en §3. |

### 1.8 Rollout

Directo. La migración se aplica en el despliegue, antes de arrancar la API nueva.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado en BD y filtro en la API

**Modelo**: Native, lo hace el hilo. Si se cambia a subagent: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: el hilo, en `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` y `BookingStatusMigrationTests.cs`, escritos antes del código.
**Superficies**: BD · backend · docs
**Verificación**: `dotnet test backend/tests/Bookings.Tests --filter "FullyQualifiedName~BookingsEndpointsTests|FullyQualifiedName~BookingStatusMigrationTests"`
**Se prueba en la aplicación**: con `moon run backend:run`, `curl "http://localhost:5080/bookings?status=Cancelled"` devuelve solo reservas con `"status":"Cancelled"`, y `?status=Foo` responde 400. Todavía no hay pantalla.

**Interfaces**:
- Consume: nada.
- Produce: `enum BookingStatus { Confirmed, Pending, Cancelled }` en `Bookings.Api.Data`, y `Booking.Status` (por defecto `Pending`). Contrato: `GET /bookings?status=<Confirmed|Pending|Cancelled>`, sin distinguir mayúsculas de minúsculas y opcional, con un 400 si el valor es desconocido. Cada elemento del JSON lleva `"status":"Confirmed"|"Pending"|"Cancelled"`.

**Ficheros**: crear `Data/BookingStatus.cs`, `Migrations/*_AddBookingStatus*`, `tests/.../BookingStatusMigrationTests.cs`; modificar `Data/Booking.cs`, `Data/BookingsDb.cs`, `BookingsEndpoints.cs`, `tests/.../BookingsEndpointsTests.cs`, `docs/api.md`.

- [ ] **Step 1: Tests RED** (cada uno siembra con su propia `Room`):
  - `Migration_sets_existing_bookings_to_Confirmed`: migra con `IMigrator.MigrateAsync("<migración anterior>")`, inserta una fila por SQL, migra a la última y `Assert.Equal(BookingStatus.Confirmed, booking.Status)`.
  - `New_booking_is_saved_as_Pending`: `db.Add(new Booking { Room = "T-new", ... })`, `SaveChanges` y, al releerla, `Assert.Equal(BookingStatus.Pending, saved.Status)`.
  - `Filters_by_status`: una reserva por estado; `GET /bookings?status=Cancelled` y `Assert.All(mine, b => Assert.Equal(BookingStatus.Cancelled, b.Status)); Assert.Single(mine)`.
  - `Without_status_returns_all`: tres sembradas, `Assert.Equal(3, mine.Count)`.
  - `Status_is_case_insensitive`: `?status=cancelled` y `Assert.Single(mine)`.
  - `Unknown_status_returns_400`: `Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode)` con `?status=Foo`.
  - `Filters_before_paginating`: 25 `Pending` con `Start` anterior y 1 `Cancelled` posterior; `?status=Cancelled&page=1` y `Assert.Single(mine)`.
  - `Serializes_status_as_text`: `Assert.Contains("\"status\":\"Cancelled\"", await client.GetStringAsync("/bookings?status=Cancelled"))`.
- [ ] **Step 2: Ejecutar** el comando de «Verificación». Esperado: FAIL por compilación (`BookingStatus` no existe). Guarda una copia de los tests fuera del repo.
- [ ] **Step 3: Implementación**
  - `BookingStatus.cs`: `[JsonConverter(typeof(JsonStringEnumConverter<BookingStatus>))] public enum BookingStatus { Confirmed, Pending, Cancelled }`.
  - `Booking.Status { get; set; } = BookingStatus.Pending`.
  - `BookingsDb.OnModelCreating`: `Status` con `HasConversion<string>().HasMaxLength(16)`.
  - La migración `AddBookingStatus`, como dice la decisión 4.
  - `MapGet("/bookings", (BookingsDb db, int page = 1, string? status = null))`: `status` vacío o nulo no filtra; `Enum.TryParse<BookingStatus>(status, ignoreCase: true, ...)` fallido devuelve `Results.ValidationProblem` con la clave `status`; el `Where` va antes de `OrderBy/Skip/Take`.
  - `docs/api.md`: fila `| \`status\` | texto: \`Confirmed\`, \`Pending\` o \`Cancelled\` (sin distinguir mayúsculas) | todas |`, más la frase «Un valor desconocido responde 400.»
- [ ] **Step 4: Build** — `dotnet build backend/src/Bookings.Api`. Esperado: sin errores.
- [ ] **Step 5: Verificación** — el comando de «Verificación». Esperado: todos en verde, con `Lists_bookings_ordered_by_start` incluido. Compara los tests con la copia (`git diff --no-index`).
- [ ] **Step 6: Commit de la task** — `feat(0012): estado de la reserva y filtro por estado en la API`.

### Task 2 — Selector de estado en la lista

**Modelo**: Native, lo hace el hilo. Si se cambia a subagent: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`.
**Tests RED**: el hilo, en `frontend/src/app/bookings/status-select.component.spec.ts` y `booking-list.component.spec.ts`, escritos antes del código.
**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`
**Verificación visual**: la lista de reservas en `http://localhost:4200`, en 1280x800 y 390x844. Estados del selector: normal, con foco (tabulando hasta él) y deshabilitado (con la respuesta de `/api/bookings` retenida). Temas claro y oscuro. Criterio: la etiqueta «Estado» y el valor elegido se leen en los dos temas; el foco se ve como un contorno; el estado deshabilitado se distingue del normal; elegir «Cancelada» deja en la lista solo reservas canceladas. Pantalla de referencia: la lista actual.
**Se prueba en la aplicación**: con `backend:run` y `frontend:serve`, el usuario elige «Cancelada» y la lista muestra solo las canceladas; con «Todos» vuelve a verlas todas.

**Interfaces**:
- Consume: `GET /api/bookings?status=<Confirmed|Pending|Cancelled>` (sin el parámetro, todas). Cada elemento lleva `status: 'Confirmed' | 'Pending' | 'Cancelled'`.
- Produce: `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'` y `Booking.status: BookingStatus` en `booking.ts`. `StatusSelectComponent` (selector `app-status-select`) con `value = model<BookingStatus | null>(null)` y `disabled = input(false)`.

**Ficheros**: crear `status-select.component.ts`, `.css`, `.spec.ts`; modificar `booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`.

- [ ] **Step 1: Tests RED**
  - `status-select`: `renders Todos first and selected by default`: los textos de las opciones son `['Todos', 'Confirmada', 'Pendiente', 'Cancelada']` y `select.value === ''`. `sets the model to the chosen status`: al elegir `Pending`, `value()` es `'Pending'`; al volver a «Todos», `value()` es `null`. `is labelled Estado`: `label.textContent` contiene `Estado`.
  - `booking-list`: `requests only the chosen status`: elegir `Cancelled` y hacer `expectOne('/api/bookings?status=Cancelled')`. `requests all bookings when Todos is chosen again`: tras `Cancelled`, elegir «Todos» y hacer `expectOne('/api/bookings')`. `disables the selector while loading`: `select.disabled` es `true` antes del `flush` y `false` después. `re-enables the selector when the request fails`: tras un `flush` con `{ status: 500, statusText: 'Error' }`, `select.disabled` es `false`.
- [ ] **Step 2: Ejecutar** `moon run frontend:test`. Esperado: FAIL (no existe `app-status-select`). Guarda una copia de los tests fuera del repo.
- [ ] **Step 3: Implementación**
  - `booking.ts`: el tipo y el campo, según «Interfaces».
  - `StatusSelectComponent`: un `<label>Estado <select>` nativo con las opciones «Todos» (`''` ↔ `null`), «Confirmada», «Pendiente» y «Cancelada», y `[disabled]="disabled()"`. Los estilos, según §1.5: `color: var(--text); background: var(--surface)`, foco `outline: 2px solid currentColor` y deshabilitado `opacity: .6; cursor: not-allowed`.
  - `BookingListComponent`: `readonly status = signal<BookingStatus | null>(null)`; `httpResource` con `() => ({ url: '/api/bookings', params: this.status() ? { status: this.status()! } : {} })`; en la plantilla, `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />` encima de la `<ul>`.
- [ ] **Step 4: Build** — `moon run frontend:check`. Esperado: sin errores.
- [ ] **Step 5: Verificación** — `moon run frontend:test`. Esperado: verde, también `lists the bookings returned by the API`. Compara los tests con la copia.
- [ ] **Step 6: Verificación visual** — el hilo, con el método de `frontend-verification.md`: el detector de `§Frontend` si se aprueba la decisión 7 y, si no, «composición no medida». Una captura por estado y tema, guardada fuera de git.
- [ ] **Step 7: Commit de la task** — `feat(0012): selector de estado en la lista de reservas`.

---

## Estimación y esfuerzo

- Tipo: fullstack
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 3,5h (Task 1: 2h con la migración; Task 2: 1,5h con la verificación visual)
- Base de la estimación: 2 tasks; la incertidumbre está en la infraestructura de tests y las migraciones que faltan en el repo.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` (el backend tarda 17–21 min, así que se lanza en segundo plano) y `moon run frontend:check`.
- [ ] Verificación de los 4 escenarios de la spec, con evidencia por THEN.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado (migración a `Confirmed`, las nuevas `Pending`) → Task 1 (`Migration_sets_existing_bookings_to_Confirmed`, `New_booking_is_saved_as_Pending`). ✓
- La API filtra por estado; sin `status`, todas → Task 1 (`Filters_by_status`, `Without_status_returns_all`). ✓
- La lista se filtra con un selector, igual en claro y oscuro, en normal, con foco y deshabilitado → Task 2 (tests y verificación visual). ✓
- La API documenta el filtro → Task 1, Step 3 (`docs/api.md`). Lo comprueba el revisor final leyendo la doc. ✓
- Cambiar el estado desde la interfaz → N/A (fuera de scope en la spec). ✓
- Perfil `delegate`: sin gate de plan; cada escenario tiene su task (comprobado arriba).
