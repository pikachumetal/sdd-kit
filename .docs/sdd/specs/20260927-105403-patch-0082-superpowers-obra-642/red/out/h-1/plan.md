---
id: 20260927-000000-feature-0012-status-filter
feature: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-27
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort** — Task 1 y Task 2: `sdd-kit:effort-medium` + `model: sonnet` (gama media, suelo de la constitution art. 6; ninguna de las dos tasks trae el código ya escrito ni es un arreglo mecánico).
2. **Ejecución**: `native`, porque el plan tiene solo 2 tasks con dependencia lineal (Task 2 consume el endpoint de Task 1), riesgo bajo y una sola superficie nueva por task; no compensa el coste de un subagente por task. Corre bien en gama media (Sonnet, effort medium); el revisor final va en el modelo más capaz.
3. **Backfill de la migración**: la columna `Status` se añade con `defaultValue: "Confirmed"` a nivel de columna SQL. Cubre las filas existentes (spec, THEN 1) sin necesidad de un `UPDATE` aparte; las filas nuevas siempre se insertan con el valor que fija el código C# (`Pending`), así que el default de columna nunca las alcanza.
4. **Persistencia del enum**: como texto (`HasConversion<string>()`, columna `nvarchar(20)`), no como entero — evita que un cambio de orden en el enum reordene los valores ya guardados.
5. **Coste estimado**: ~3h de implementación (2 tasks pequeñas, sin ambigüedad de requisitos), bajo riesgo.

**Goal**: Guardar el estado de cada reserva y dejar que la API y la lista se filtren por él.

**Architecture**: Columna nueva en `Bookings` con conversión a texto; la API añade un parámetro de query que se traduce en un `Where` antes de paginar; el frontend añade un componente selector nativo que cambia la URL que consume `booking-list` vía `httpResource`.

**Tech Stack**: .NET 9 minimal API + EF Core 9 sobre SQL Server (backend); Angular 20 con signals y `httpResource` (frontend). Ver `.docs/sdd/tech-stack.md`.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Enum de estado con exactamente estos tres valores y esta grafía: `Confirmed`, `Pending`, `Cancelled` (spec, decisión 1).
- El filtro vive en la API (`GET /bookings?status=`), nunca en el cliente (spec, decisión 2).
- Selector propio `app-status-select`, con "Todos" como opción por defecto (spec, decisión 3).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (constitution art. 5).
- Texto de interfaz y de documentos en castellano (constitution art. 4); los literales de estado que viajan a la API quedan en inglés, tal cual los fija la spec.

### De proceso

- Política de modelos: gama media (Sonnet, effort medium) como suelo para implementadores y revisores (constitution art. 6).
- Ejecución: `native` (ver «Decisiones que he tomado yo», punto 2).
- Convención de commits: git-flow, rama `feature/0012`; `moon run :test` y `moon run frontend:check` en verde al cerrar cada task (constitution art. 2).

## Review Focus

1. `status` con un valor no reconocido en la query (`?status=Foo`) → debe responder 400, no devolver "todas" ni 500. Cubierto en Task 1.
2. Filtro y paginación combinados: `Skip`/`Take` deben aplicarse sobre el subconjunto ya filtrado, no antes. Cubierto en Task 1.
3. Una fila insertada sin `Status` explícito debe quedar en `Confirmed` (el default de columna), no en el default de C# (`Pending`) ni en nulo. Cubierto en Task 1.
4. Los valores que envía el selector deben coincidir letra por letra con los que acepta la API (`Confirmed`/`Pending`/`Cancelled`), no con las etiquetas en castellano que ve el usuario. Cubierto en Task 2.
5. El selector debe quedar deshabilitado mientras la lista está cargando, para no disparar un cambio de filtro con la petición anterior todavía en vuelo. Cubierto en Task 2.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — enum + `Where` + `<select>` nativo, sin capas nuevas.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos; no hay librería de selects nueva (rung 4 de la ladder: `<select>` nativo).
- [x] **Constitution check**: respeta arts. 2, 4, 5 y 6 (ver Restricciones globales).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Confirmed | Pending | Cancelled`.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ `.Designer.cs`, actualiza `BookingsDbModelSnapshot.cs`) — generados por `dotnet ef migrations add AddBookingStatus`.
- `frontend/src/app/bookings/status-select.component.ts` — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.css` — estilos con las variables de tema existentes.
- `frontend/src/app/bookings/status-select.component.spec.ts` — tests.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `OnModelCreating` con la conversión a texto.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — parámetro `status` y filtro.
- `backend/src/Bookings.Api/Program.cs` — enum serializado como texto en JSON (el implementador comprueba si ya hay un `JsonStringEnumConverter` global antes de añadir uno nuevo).
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro y del backfill.
- `frontend/src/app/bookings/booking.ts` — añade `status: BookingStatus`.
- `frontend/src/app/bookings/booking-list.component.ts` y `.spec.ts` — usa el selector, deriva la URL del estado elegido.
- `docs/api.md` — documenta el parámetro `status`.

**NO se tocan**:

- `Room`, `Start`, `End`, `Owner` de `Booking` — sin cambios de tipo ni de nombre.
- La paginación existente (`page`, tamaño fijo 20) — la spec no la cambia.

### 1.2 Modelo de datos

`Booking.Status: BookingStatus`, default en C# `Pending`. Persistido con `.HasConversion<string>().HasMaxLength(20)` (holgado para `Cancelled`, 9 caracteres). La migración añade la columna con `defaultValue: "Confirmed"` a nivel SQL — cubre el backfill sin `UPDATE` aparte (ver «Decisiones que he tomado yo», punto 3).

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api` (tech-stack.md). La migración generada debe incluir, en `Up()`:

```csharp
migrationBuilder.AddColumn<string>(
    name: "Status",
    table: "Bookings",
    type: "nvarchar(20)",
    nullable: false,
    defaultValue: "Confirmed");
```

### 1.4 Contratos API

`GET /bookings?status=<Confirmed|Pending|Cancelled>` (opcional). Sin `status`, comportamiento actual: todas, paginadas. Con un valor no reconocido, el binding del enum en minimal API falla antes de entrar al handler y responde 400.

```csharp
app.MapGet("/bookings", async (BookingsDb db, int page = 1, BookingStatus? status = null) =>
    await db.Bookings
        .Where(b => status == null || b.Status == status)
        .OrderBy(b => b.Start)
        .Skip((page - 1) * 20)
        .Take(20)
        .ToListAsync());
```

Respuesta: mismo shape de `Booking`, con el campo `status` nuevo serializado como texto (`"Confirmed"`, `"Pending"`, `"Cancelled"`).

### 1.5 UX

`<select>` nativo dentro de `app-status-select` (ladder rung 4: nada de librería de dropdown). Opciones, etiqueta en castellano · valor exacto que viaja a la API:

| Etiqueta | Valor |
| --- | --- |
| Todos | `''` |
| Confirmada | `Confirmed` |
| Pendiente | `Pending` |
| Cancelada | `Cancelled` |

Deshabilitado mientras `bookings.isLoading()` es `true`. Usa las mismas variables CSS de tema que `booking-list.component.css` (`--text`, `--surface`), coherente en claro y oscuro.

### 1.6 Dependencias

Ninguna nueva. `<select>` nativo cubre el selector (ladder rung 4); `httpResource` ya está en uso para la petición reactiva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El `JsonStringEnumConverter` no está configurado globalmente y el enum se serializa como número | Media | Alto — rompe el contrato con el frontend | Task 1 comprueba `Program.cs` antes de tocarlo; test de integración asegura que la respuesta trae el texto, no el número |
| Migración corre sobre una BD con reservas previas fuera de este repo (entorno real) | Baja | Alto si el backfill fallara | `defaultValue` de columna es una operación SQL estándar, sin lógica de aplicación de por medio |

### 1.8 Rollout

Directo: se integra en `develop` tras el cierre de la feature (git-flow), sin toggle ni entrega escalonada.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva en BD y filtro en la API

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos antes de despachar y sin commitear (van en el commit de la task)

- `Filters_by_status_and_applies_pagination_after_filtering` — siembra reservas en los tres estados más de 20 `Cancelled`; pide `GET /bookings?status=Cancelled&page=2`; espera solo canceladas y el `Skip` aplicado sobre el subconjunto ya filtrado (Review Focus 2).
- `Returns_all_bookings_when_status_is_omitted` — siembra los tres estados; pide `GET /bookings` sin `status`; espera las tres.
- `Rejects_unknown_status_with_400` — pide `GET /bookings?status=Foo`; espera `400 Bad Request` (Review Focus 1).
- `Column_default_sets_confirmed_for_rows_inserted_without_status` — inserta una fila con SQL crudo omitiendo la columna `Status`; lee con EF; espera `Confirmed` (Review Focus 3, spec THEN 1).

**Superficies**: BD, backend, docs
**Verificación**: `moon run backend:test`
**Verificación lenta**: sí — `moon run backend:test` (Testcontainers, 17–21 min); el hilo principal la lanza en segundo plano al entregar la task y sigue con la revisión mientras corre
**Se prueba en la aplicación**: sí — con `moon run backend:run`, `curl http://localhost:5080/bookings?status=Cancelled` devuelve solo las canceladas; `curl http://localhost:5080/bookings` (sin `status`) devuelve todas, paginadas igual que antes

**Interfaces**:
- Consume: nada (primera task).
- Produce: `GET /bookings?status=<Confirmed|Pending|Cancelled>` (query param opcional); shape de respuesta `{ id: number, room: string, start: string, status: 'Confirmed' | 'Pending' | 'Cancelled' }[]`. Task 2 consume este contrato.

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`, migración `AddBookingStatus`; modificar `Booking.cs`, `BookingsDb.cs`, `BookingsEndpoints.cs`, `Program.cs` (solo si falta el converter), `BookingsEndpointsTests.cs`, `docs/api.md`

- [ ] **Step 1: Escribir los 4 tests RED** listados arriba en `BookingsEndpointsTests.cs`.
- [ ] **Step 2: Ejecutar `moon run backend:test` y verificar que fallan** (no compila: `Booking` no tiene `Status` todavía).
- [ ] **Step 3: Implementar `BookingStatus` en `Data/BookingStatus.cs`** — enum `Confirmed`, `Pending`, `Cancelled`, ese orden y esa grafía.
- [ ] **Step 4: Añadir `Status` a `Booking.cs`** — `public BookingStatus Status { get; set; } = BookingStatus.Pending;`
- [ ] **Step 5: Configurar la conversión en `BookingsDb.cs`** — override `OnModelCreating(ModelBuilder builder)` con `builder.Entity<Booking>().Property(b => b.Status).HasConversion<string>().HasMaxLength(20);`
- [ ] **Step 6: Generar la migración** — `dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`; comprobar que `Up()` trae el `AddColumn` de §1.3 con `defaultValue: "Confirmed"`.
- [ ] **Step 7: Añadir el parámetro `status` al endpoint** en `BookingsEndpoints.cs`, con el `Where` de §1.4.
- [ ] **Step 8: Comprobar `Program.cs`** — si no serializa enums como texto, añadir `builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));` (o el registro equivalente que ya use el proyecto para `JsonSerializerOptions`).
- [ ] **Step 9: Ejecutar `moon run backend:test` y verificar que los 4 tests nuevos, y los previos, pasan.**
- [ ] **Step 10: Documentar `status` en `docs/api.md`** — nueva fila en la tabla de parámetros: `status` · texto (`Confirmed`/`Pending`/`Cancelled`) · sin filtro.
- [ ] **Step 11: Commit** de la task (§ commit-milestones.md del kit).

### Task 2 — Selector de estado en la lista de reservas

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos antes de despachar y sin commitear

- `Renders_the_four_options_with_todos_selected_by_default` — `status-select.component.spec.ts`: comprueba las 4 opciones (etiqueta y `value`) y que el valor inicial es `''`.
- `Emits_the_exact_api_literal_when_an_option_is_chosen` — `status-select.component.spec.ts`: selecciona "Cancelada"; espera que el valor emitido/actualizado sea `'Cancelled'`, no la etiqueta (Review Focus 4).
- `Is_disabled_while_the_list_is_loading` — `status-select.component.spec.ts`: con `loading` a `true` vía `input`, el `<select>` queda `disabled` (Review Focus 5).
- `Requests_bookings_with_exact_status_literal_and_without_status_on_todos` — `booking-list.component.spec.ts`: al cambiar el estado seleccionado, `httpResource` pide `/api/bookings?status=Cancelled`; al volver a "Todos", pide `/api/bookings` sin `status` (Review Focus 4).

**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`
**Verificación visual**: sí — pantalla de la lista de reservas, con el selector; estados normal, con foco y deshabilitado (mientras carga); tema claro y tema oscuro; mirar alineación, separación a bordes y contraste
**Se prueba en la aplicación**: sí — con `moon run frontend:serve` y el backend de la Task 1 corriendo, el usuario abre la lista de reservas, elige "Cancelada" en el selector y ve solo las reservas canceladas; vuelve a "Todos" y ve todas otra vez

**Interfaces**:
- Consume: `GET /bookings?status=<Confirmed|Pending|Cancelled>` de Task 1; tipo `Booking` con el campo `status: 'Confirmed' | 'Pending' | 'Cancelled'`.
- Produce: nada (última task).

**Ficheros**: crear `status-select.component.ts`, `.css`, `.spec.ts`; modificar `booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`

- [ ] **Step 1: Escribir los 4 tests RED** listados arriba.
- [ ] **Step 2: Ejecutar `moon run frontend:test` y verificar que fallan** (el componente y el campo `status` no existen).
- [ ] **Step 3: Añadir `status: 'Confirmed' | 'Pending' | 'Cancelled'` a la interfaz `Booking`** en `booking.ts`; exportar el tipo como `BookingStatus`.
- [ ] **Step 4: Implementar `StatusSelectComponent`** (`selector: 'app-status-select'`) en `status-select.component.ts` — `<select>` nativo con las 4 opciones de §1.5, `value = model<BookingStatus | ''>('')`, `loading = input(false)`, `[disabled]="loading()"`.
- [ ] **Step 5: Estilos en `status-select.component.css`** reusando `var(--text)` y `var(--surface)` como en `booking-list.component.css`.
- [ ] **Step 6: Conectar el selector en `BookingListComponent`** — añade `app-status-select` al template, un signal de estado, y deriva la URL de `httpResource` (`` `/api/bookings${status() ? `?status=${status()}` : ''}` ``); pasa `[loading]="bookings.isLoading()"`.
- [ ] **Step 7: Ejecutar `moon run frontend:test` y `moon run frontend:check`, verificar verde.**
- [ ] **Step 8: Verificación visual** — arrancar `moon run frontend:serve`, mirar el selector en claro/oscuro y en sus tres estados, con captura por combinación.
- [ ] **Step 9: Commit** de la task.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los criterios de éxito de la spec (los 4 THEN de `booking-list`)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Spec THEN 1 (migración → `Confirmed` en existentes, `Pending` en nuevas) → Task 1. ✓
- Spec THEN 2 (`GET /bookings?status=` filtra) → Task 1. ✓
- Spec THEN 3 (selector filtra la lista, se ve y se usa igual en claro/oscuro y en sus tres estados) → Task 2. ✓
- Spec THEN 4 (`docs/api.md` documenta `status`) → Task 1, Step 10. ✓
- Decisión 1 (tres estados cerrados) → `BookingStatus` enum, Task 1. ✓
- Decisión 2 (filtro en la API, no en el cliente) → Task 1 (`Where` en el endpoint); Task 2 solo cambia la URL, no filtra en memoria. ✓
- Decisión 3 (`app-status-select`, "Todos" por defecto) → Task 2. ✓
- Scope: "No entra: cambiar el estado desde la interfaz" → ninguna task añade una mutación de estado; confirmado. ✓
