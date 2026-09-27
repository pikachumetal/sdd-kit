---
id: 20260923-090000-task-0012-status-filter
task: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-23
---

# Plan de implementación — Filtrar la lista de reservas por estado

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Sonnet, effort medio, en las dos tasks — hay que interpretar prosa de spec (diseño de migración, contrato de filtro, UX del selector), gama media es el suelo de la constitution y no hay motivo para más.
2. Ejecución: agente (`subagent-driven-development`, default del kit) en las dos tasks.
3. `Status` se persiste como cadena (`HasConversion<string>`), no como entero: la spec usa los nombres (`Confirmed`, `Pending`, `Cancelled`) como valor del query param, y así el filtro de la API y el valor en BD son el mismo literal sin tabla de traducción.
4. Backfill de reservas existentes vía DEFAULT de columna en la migración (`'Confirmed'`); las reservas nuevas fijan `Pending` explícito en la entidad C# (`Status { get; set; } = BookingStatus.Pending`), que EF envía como valor explícito y pisa el DEFAULT de columna. No hay endpoint de creación todavía: este default solo se ejerce hoy al sembrar datos en tests, pero es el comportamiento que pide la spec para cuando exista.
5. Dos tasks, no tres: la documentación de `docs/api.md` entra en la task de backend (mismo endpoint, mismo commit temático) en vez de una task aparte de una línea.
6. Riesgo alto: ninguno — cambio de schema aditivo (columna nueva, sin borrar ni renombrar), sin migración de datos irreversible.
7. Coste estimado: ~3h de implementación (backend ~1.5h, frontend ~1.5h); spec+plan ya consumidos.

**Goal**: añadir estado a la reserva y dejar filtrar la lista por ese estado, en API y en el selector del frontend.

**Architecture**: columna `Status` en `Booking` con backfill por migración; el endpoint `GET /bookings` admite `status` opcional y filtra en el `Where` antes de paginar; el frontend añade un componente `app-status-select` que controla un signal consumido por el `httpResource` de la lista.

**Tech Stack**: backend .NET 9 minimal API + EF Core 9 sobre SQL Server (`dotnet ef migrations add`); frontend Angular 20 con signals y `httpResource`. Ver `.docs/sdd/tech-stack.md`.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Tres estados cerrados, literales exactos: `Confirmed`, `Pending`, `Cancelled` (spec, decisión 1).
- Filtro solo en la API vía `GET /bookings?status=`, nunca en el cliente (spec, decisión 2).
- Selector como componente propio `app-status-select`, con «Todos» de opción por defecto (spec, decisión 3).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad).
- Funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación.

### De proceso

- Modelo y effort se declaran al despachar cada task (ver Decisiones que he tomado yo, punto 1); gama media como suelo.
- Ejecución por defecto: `subagent-driven-development`; en línea solo si una task lo declara con motivo.
- Commits con la convención del proyecto (tipo/scope en inglés, cuerpo en castellano) y atribución a Claude Sonnet 5.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — columna + filtro + selector, sin capa de abstracción nueva.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos; no hay endpoint de cambio de estado (fuera de scope) ni gestión de estados dinámica.
- [x] **Brownfield gate**: aditivo, no rompe `GET /bookings` sin `status`; sigue el patrón existente de minimal API + EF Core; sin refactor oportunista.
- [x] **Constitution check**: respeta Art. 2 (todo verde), Art. 4 (castellano en interfaz), Art. 5 (calidad de código), Art. 6 (modelos declarados).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Confirmed`, `Pending`, `Cancelled`.
- `frontend/src/app/bookings/status-select.component.ts` — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.css` — estilos del selector (variables CSS de tema).
- `backend/tests/Bookings.Tests/BookingsStatusFilterTests.cs` — tests del filtro y del default de estado.
- `frontend/src/app/bookings/status-select.component.spec.ts` — tests del selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `Status`.
- `backend/src/Bookings.Api/Data/BookingsDb.cs` — configura la conversión `Status` a cadena.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — añade el parámetro `status` opcional al `GET /bookings`.
- `frontend/src/app/bookings/booking.ts` — añade `status` a la interfaz `Booking`.
- `frontend/src/app/bookings/booking-list.component.ts` — usa `app-status-select` y pasa el estado elegido al `httpResource`.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — cubre el filtrado desde la lista.
- `docs/api.md` — documenta el parámetro `status`.

**NO se tocan**:

- `frontend/src/app/bookings/booking-list.component.css` — el selector lleva su propio fichero de estilos; la lista no cambia de layout.

### 1.2 Modelo de datos

`Booking.Status` (enum `BookingStatus`, valor por defecto `Pending` en la entidad), persistido como `nvarchar` vía `HasConversion<string>()` en `BookingsDb.OnModelCreating`.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api`. La migración añade la columna `Status` `NOT NULL` con `DEFAULT 'Confirmed'` (backfill de las reservas existentes); las reservas creadas por la app en adelante llevan `Pending` explícito desde la entidad, que pisa el default de columna.

### 1.4 Contratos API

`GET /bookings?status={Confirmed|Pending|Cancelled}&page={n}` — `status` opcional; sin él, devuelve las reservas de todos los estados (comportamiento actual). Con un valor fuera del enum, ASP.NET Core responde `400` por binding fallido (comportamiento por defecto del framework, sin código nuevo).

### 1.5 UX

`app-status-select`: `<select>` nativo con las opciones «Todos» (valor vacío, por defecto), «Confirmada», «Pendiente», «Cancelada» — etiquetas en castellano (Art. 4), valor enviado a la API en el literal inglés del enum. Usa las variables CSS de tema (`--text`, `--surface`, etc., como `booking-list.component.css`) para verse igual en claro/oscuro. Deshabilitado mientras `bookings.isLoading()`.

### 1.6 Dependencias

Ninguna nueva: EF Core 9 y Angular 20 ya están en el stack; `<select>` nativo, sin librería de UI adicional.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El backfill por DEFAULT de columna no aplica a filas existentes si SQL Server trata la migración como dos pasos (add column nullable + backfill + not null) | Baja | Medio | Test de integración (Testcontainers) que siembra una reserva antes de aplicar la migración y comprueba que queda en `Confirmed` |
| Binding de enum en el query string acepta valores en minúsculas/mayúsculas de forma inconsistente | Baja | Bajo | Test que pide `status=Cancelled` con el literal exacto de la spec; no se prueban variantes de casing fuera de scope |

### 1.8 Rollout

Directo: migración se aplica al desplegar el backend (mecanismo existente del proyecto), sin toggle.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva: BD, filtro y documentación

**Modelo**: Sonnet, effort medio — hay que traducir la decisión de backfill (spec + este plan) a migración EF Core real, gama media es el suelo de la constitution.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsStatusFilterTests.cs`, escritos y commiteados antes de despachar.

**Superficies**: BD, backend, docs.
**Verificación**: `moon run backend:test`.
**Verificación lenta**: `moon run backend:test` (Testcontainers sobre SQL Server, 17–21 min) — el hilo principal la lanza en segundo plano al entregar la task.

**Interfaces**:
- Consume: nada.
- Produce: `Booking.Status` (enum `BookingStatus { Confirmed, Pending, Cancelled }`, persistido como cadena); `GET /bookings` acepta `status` opcional del mismo enum.

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`, `backend/tests/Bookings.Tests/BookingsStatusFilterTests.cs`, la migración `AddBookingStatus`; modificar `backend/src/Bookings.Api/Data/Booking.cs`, `backend/src/Bookings.Api/Data/BookingsDb.cs`, `backend/src/Bookings.Api/BookingsEndpoints.cs`, `docs/api.md`.

- [ ] **Step 1: Implementación** — enum `BookingStatus`; `Booking.Status` con default `Pending`; `HasConversion<string>()` en `BookingsDb`; migración `AddBookingStatus` con `DEFAULT 'Confirmed'`; `GET /bookings` filtra por `status` cuando viene informado; `docs/api.md` documenta el parámetro y sus tres valores.
- [ ] **Step 2: Build** — `dotnet build` del proyecto backend. Esperado: verde, sin errores.
- [ ] **Step 3: Verificación** — `moon run backend:test` (incluye `BookingsStatusFilterTests`). Esperado: verde.
- [ ] **Step 4: Commit** — `feat(backend): añadir estado a la reserva y filtro en GET /bookings`, referenciando 0012.

---

### Task 2 — Selector de estado en la lista

**Modelo**: Sonnet, effort medio — UX definida por la spec pero la integración con `httpResource` y el estado deshabilitado exige criterio, gama media es el suelo de la constitution.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y ampliación de `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos y commiteados antes de despachar.

**Superficies**: frontend.
**Verificación**: `moon run frontend:test`, `moon run frontend:check`.
**Verificación visual**: lista de reservas (`/`) — selector visible y usable en tema claro y oscuro, en estado normal, con foco (`:focus-visible`) y deshabilitado mientras carga.

**Interfaces**:
- Consume: `GET /bookings?status=` de la Task 1 (query param opcional, valores `Confirmed | Pending | Cancelled`).
- Produce: nada (última task).

**Ficheros**: crear `frontend/src/app/bookings/status-select.component.ts`, `frontend/src/app/bookings/status-select.component.css`, `frontend/src/app/bookings/status-select.component.spec.ts`; modificar `frontend/src/app/bookings/booking.ts`, `frontend/src/app/bookings/booking-list.component.ts`, `frontend/src/app/bookings/booking-list.component.spec.ts`.

- [ ] **Step 1: Implementación** — `app-status-select` con las opciones «Todos» / «Confirmada» / «Pendiente» / «Cancelada», signal de salida con el valor del enum en inglés (o vacío para «Todos»); `booking-list.component.ts` mantiene el estado elegido en un signal y lo añade a la URL del `httpResource` solo cuando no está vacío; selector deshabilitado mientras `bookings.isLoading()`.
- [ ] **Step 2: Build** — `moon run frontend:check` (lint + `tsc --noEmit`). Esperado: verde.
- [ ] **Step 3: Verificación** — `moon run frontend:test`. Esperado: verde.
- [ ] **Step 4: Commit** — `feat(frontend): filtrar la lista de reservas por estado`, referenciando 0012.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check`.
- [ ] Verificación de los criterios de éxito de la spec (delta de comportamiento de `booking-list`).
- [ ] Spec satisfecha: cada escenario tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`).

---

## 4. Self-review (cobertura spec → tasks)

- Cada reserva tiene un estado (migración + default) → Task 1. ✓
- La API filtra por estado → Task 1. ✓
- La lista se filtra con un selector → Task 2. ✓
- La API documenta el filtro → Task 1. ✓
