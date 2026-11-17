---
id: 20260923-090000-task-0012-status-filter
task: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. Modelo: `sonnet`, effort medio, en las dos tasks: interpretan la spec y escriben código nuevo.
2. Ejecución: por agente, las dos.
3. `Status` se guarda como texto (`HasConversion<string>()`), no como entero: la columna se lee en SQL sin tabla de códigos.
4. Coste estimado: ~2 h; dos implementadores y dos revisores.

**Goal**: filtrar la lista de reservas por estado, con el estado en BD, el filtro en la API y un selector en la lista.

**Architecture**: enum `BookingStatus` en el backend con migración que marca las reservas existentes como `Confirmed`; parámetro opcional `status` en `GET /bookings`; componente `app-status-select` que la lista usa para pedir `/api/bookings?status=`.

**Tech Stack**: .NET 9 + EF Core 9 sobre SQL Server; Angular 20 con signals y `httpResource`.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important. *(Art. 5, literal.)*
- Texto de la interfaz en castellano: «Todos», «Confirmada», «Pendiente», «Cancelada».
- Valores del enum, literales: `Confirmed`, `Pending`, `Cancelled`.

### De proceso

- Política de modelos (Art. 6): modelo y effort declarados al despachar; gama media como suelo.
- Ejecución por `subagent-driven-development`.

---

## 2. Tasks

### Task 1 — Estado en BD, filtro en la API y documentación

**Modelo**: `sonnet`, effort medio.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingStatusTests.cs`, escritos y commiteados.
**Superficies**: BD · backend · docs
**Verificación**: `dotnet build backend`
**Verificación lenta**: `moon run backend:test` · 17–21 min

**Interfaces**:
- Consume: nada.
- Produce: `GET /bookings?status=Confirmed|Pending|Cancelled`, que devuelve `Booking[]` con `status` como texto; sin `status`, todas.

**Ficheros**: `backend/src/Bookings.Api/Data/Booking.cs`, `backend/src/Bookings.Api/Data/BookingStatus.cs`, `backend/src/Bookings.Api/Data/BookingsDb.cs`, `backend/src/Bookings.Api/BookingsEndpoints.cs`, migración `AddBookingStatus`, `docs/api.md`.

- [ ] **Step 1: Implementación** — enum `BookingStatus { Confirmed, Pending, Cancelled }`; propiedad `Status` en `Booking` con valor por defecto `Pending`; `HasConversion<string>()` en `BookingsDb`; migración `AddBookingStatus` con `defaultValue: "Confirmed"` para las filas existentes; filtro `status` opcional en `MapBookings`; sección `status` en `docs/api.md`.
- [ ] **Step 2: Build** — `dotnet build backend`.
- [ ] **Step 3: Verificación** — la de los campos de arriba.
- [ ] **Step 4: Commit** — `feat(backend): estado de la reserva y filtro por estado (0012)`.

### Task 2 — Selector de estado en la lista

**Modelo**: `sonnet`, effort medio.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `booking-list.component.spec.ts`, escritos y commiteados.
**Superficies**: frontend
**Verificación**: `moon run frontend:test` y `moon run frontend:check`
**Verificación visual**: `/bookings` · selector normal, con foco y deshabilitado (mientras carga) · tema claro y oscuro · alineación con la lista, separación a bordes, contraste del texto y de la flecha

**Interfaces**:
- Consume: `GET /bookings?status=` de la Task 1 (`status` como texto: `Confirmed`, `Pending`, `Cancelled`).
- Produce: componente `app-status-select` con `model<BookingStatus | null>(null)`.

**Ficheros**: `frontend/src/app/bookings/booking.ts`, `frontend/src/app/bookings/status-select.component.ts`, `frontend/src/app/bookings/status-select.component.css`, `frontend/src/app/bookings/booking-list.component.ts`.

- [ ] **Step 1: Implementación** — tipo `BookingStatus`; `app-status-select` con un `<select>` nativo y las opciones «Todos», «Confirmada», «Pendiente», «Cancelada»; deshabilitado mientras `bookings.isLoading()`; estilos con `--text` y `--surface`; `booking-list` pide `/api/bookings?status=<valor>` cuando hay valor.
- [ ] **Step 2: Build** — `moon run frontend:check`.
- [ ] **Step 3: Verificación** — la de los campos de arriba.
- [ ] **Step 4: Commit** — `feat(frontend): selector de estado en la lista de reservas (0012)`.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los cuatro escenarios de la spec
- [ ] Cierre con `sdd-end-task`, tras la validación del dev-lead

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado → Task 1. ✓
- La API filtra por estado → Task 1. ✓
- La lista se filtra con un selector → Task 2. ✓
- La API documenta el filtro → Task 1. ✓
