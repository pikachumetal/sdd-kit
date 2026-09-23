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

1. Modelo y effort — Task 1 (backend) y Task 2 (frontend): `sonnet`, effort medio. Ambas tasks interpretan prosa de la spec sobre código existente sin patrón previo que copiar tal cual (migración nueva, componente nuevo); gama media es el suelo del Art. 6 de la constitution y no hay motivo para `fable` ni `opus xhigh`.
2. Ejecución: agente por defecto (`superpowers:subagent-driven-development`); ninguna task va en línea.
3. Decisión técnica que la spec no fija: el enum `BookingStatus` en C# se declara `Pending, Confirmed, Cancelled` (orden que da a `Pending` el valor 0, el default natural de una entidad nueva); el backfill de filas existentes a `Confirmed` se fija en la migración con `defaultValue`, no en el default del tipo — así una reserva nueva creada en código (`Status = BookingStatus.Pending`) no depende de qué default tenga la columna.
4. Decisión técnica que la spec no fija: el enum se mapea a `int` en EF Core (el default de EF Core), no a `string`; el parámetro de query `status` se sigue leyendo por nombre (`Confirmed`, `Pending`, `Cancelled`) porque el model binding de rutas/query de ASP.NET Core en minimal API convierte un enum nullable por nombre sin config adicional.
5. Riesgo alto: ninguno — cambio de schema aditivo (columna nueva con default), sin tocar datos ni endpoints existentes fuera del añadido.
6. Coste estimado: 2 tasks, complejidad baja-media cada una; sin `estimation.md` en el proyecto, no aplica la sección de estimación en horas.

**Goal**: Añadir un estado a cada reserva, filtrar por él en la API y dejar que la lista lo filtre con un selector.

**Architecture**: El estado vive como columna nueva en `Bookings` (enum `BookingStatus`, mapeado a `int`). El endpoint `GET /bookings` gana un parámetro opcional `status` que añade un `Where` a la consulta ya paginada. En el frontend, un componente `app-status-select` nuevo expone el estado elegido por `model()`; `BookingListComponent` lo lee y lo mete en la URL que consume `httpResource`.

**Tech Stack**: Backend .NET 9 minimal API + EF Core 9 sobre SQL Server (migración con `dotnet ef migrations add`); frontend Angular 20 con signals (`model()`, `httpResource`) y variables CSS de tema (`--text`, `--surface`).

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Los tres estados son exactamente `Confirmed`, `Pending`, `Cancelled` — sin sinónimos ni traducciones en el código (spec, decisión 1).
- El parámetro de filtro en la API es `status`, en `GET /bookings` (spec, decisión 2 y escenario "La API filtra por estado").
- El selector es un componente propio de selector `app-status-select`, con "Todos" como opción por defecto (spec, decisión 3).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros; early returns; sin duplicación (constitution, Art. 5).
- Comandos que el cambio deja en verde: `moon run backend:test`, `moon run frontend:test`, `moon run frontend:check`, `moon run :test` (tech-stack.md).

### De proceso

- Política de modelos: gama media (`sonnet`) como suelo para implementadores y revisores; `fable` y `opus xhigh` exigen justificación escrita, y ninguna task de este plan la necesita (constitution, Art. 6).
- Ejecución por defecto: `superpowers:subagent-driven-development`; una task solo va en línea si lo declara con motivo.
- Perfil de control vigente: `delegate` (`sdd-kit.json`) — para en la spec, los desvíos y la validación; sin gate en este plan.
- Commits: convención del proyecto (git-flow), referenciando la task `0012`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — columna + enum + `Where` condicional en el backend; un componente de selector con `model()` en el frontend. Sin capa nueva.
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos — el enum tiene 3 valores fijos que la spec cierra, no una lista abierta.
- [x] **Brownfield gate**: retrocompatible (columna con backfill, endpoint sin `status` sigue devolviendo todo); sigue el patrón existente (`BookingsEndpoints.MapBookings`, `httpResource` en el componente); sin refactor fuera de scope.
- [x] **Constitution check**: respeta Art. 1 (flujo SDD), Art. 2 (`moon run :test` y `frontend:check` en verde), Art. 4 (textos en castellano: opciones del selector), Art. 5 (calidad de código), Art. 6 (modelos).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum `Pending`, `Confirmed`, `Cancelled`.
- `backend/src/Bookings.Api/Migrations/<timestamp>_AddBookingStatus.cs` (+ snapshot) — generado por `dotnet ef migrations add AddBookingStatus`.
- `frontend/src/app/bookings/status-select.component.ts` — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.css` — estilos del selector (normal, foco, deshabilitado, claro/oscuro).
- `frontend/src/app/bookings/status-select.component.spec.ts` — test del componente.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `public BookingStatus Status { get; set; } = BookingStatus.Pending;`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — añade el parámetro `status` y el filtro.
- `docs/api.md` — documenta el parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — añade `export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';` y el campo `status: BookingStatus` en `Booking`.
- `frontend/src/app/bookings/booking-list.component.ts` — añade el signal de estado elegido, usa `app-status-select` y mete `status` en la URL de `httpResource`.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — cubre el nuevo escenario de filtrado.

**NO se tocan**:

- `backend/src/Bookings.Api/Data/BookingsDb.cs` — el `DbSet<Booking>` ya expone la columna nueva vía EF Core sin cambios en el `DbContext`.
- El mecanismo de paginación (`page`, `Skip`/`Take`) — la spec no lo toca; el filtro se compone con él, no lo sustituye.

### 1.2 Modelo de datos

Columna nueva `Status int NOT NULL` en `Bookings`, mapeada al enum `BookingStatus` (`Pending = 0`, `Confirmed = 1`, `Cancelled = 2`). Backfill de filas existentes al valor `Confirmed` (1) vía `defaultValue` de la migración; las filas nuevas las inserta la aplicación con `Status = Pending` explícito.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api` (tech-stack.md). La migración:

```csharp
migrationBuilder.AddColumn<int>(
    name: "Status",
    table: "Bookings",
    type: "int",
    nullable: false,
    defaultValue: 1); // BookingStatus.Confirmed — backfill de reservas existentes
```

### 1.4 Contratos API

`GET /bookings?status=<Confirmed|Pending|Cancelled>` (opcional, se combina con `page`):

- Sin `status`: devuelve todas las reservas de la página pedida (comportamiento actual, sin cambios).
- Con `status`: devuelve solo las reservas de ese estado, mismo orden (`Start` ascendente) y paginación.
- Valor de `status` fuera de los tres nombres: 400 (comportamiento por defecto del model binding de ASP.NET Core al fallar el `TryParse` del enum; no se añade validación propia).

### 1.5 UX

`app-status-select`: un `<select>` con las opciones "Todos" (valor vacío → sin filtro), "Confirmada" (`Confirmed`), "Pendiente" (`Pending`), "Cancelada" (`Cancelled`), en castellano. Expone el valor elegido con `model<BookingStatus | null>(null)` para que `BookingListComponent` lo lea con `[(value)]`. Se deshabilita mientras `bookings.isLoading()` es `true`. Estilos con `var(--text)` / `var(--surface)` (igual que `booking-list.component.css`) más `:focus-visible` y `:disabled`, para que se vea y use igual en tema claro y oscuro.

### 1.6 Dependencias

Ninguna externa nueva. Task 2 (frontend) consume el contrato de Task 1 (frontend): nombre del parámetro `status` y sus tres valores exactos.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La migración se aplica sobre una BD con reservas ya canceladas o pendientes por otro medio (no aplica: la columna no existe hasta ahora) | Baja | Bajo | El backfill a `Confirmed` es la decisión explícita de la spec para todo lo anterior a la migración; no hay estado previo que preservar |
| Model binding del enum en la query falla con un valor fuera de los tres nombres y devuelve 400 sin mensaje claro | Media | Bajo | Documentado en §1.4; no lo pide ningún escenario de la spec, no se añade validación extra |

### 1.8 Rollout

Directo: la migración se aplica al desplegar el backend (mecanismo existente del proyecto), sin toggle ni orden especial — es aditiva y retrocompatible.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva: columna, migración, filtro en la API y documentación

**Modelo**: `sonnet`, effort medio — interpreta la spec sobre un endpoint y una entidad existentes, sin ambigüedad de diseño.
**Tests RED**: hilo principal · `backend/src/Bookings.Api.Tests/BookingsEndpointsTests.cs` (o el fichero de test existente del endpoint, si el proyecto ya lo tiene), escritos y commiteados antes de despachar.

**Interfaces**:
- Consume: nada.
- Produce: enum `BookingStatus { Pending, Confirmed, Cancelled }` en `Bookings.Api.Data`; propiedad `Booking.Status` (tipo `BookingStatus`, default `Pending`); parámetro de query `status` en `GET /bookings` (tipo `BookingStatus?`, sin filtrar si es `null`).

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`, migración `AddBookingStatus`; modificar `backend/src/Bookings.Api/Data/Booking.cs`, `backend/src/Bookings.Api/BookingsEndpoints.cs`, `docs/api.md`.

- [ ] **Step 1: Crear el enum**

```csharp
namespace Bookings.Api.Data;

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
}
```

- [ ] **Step 2: Añadir la propiedad a `Booking`**

```csharp
public BookingStatus Status { get; set; } = BookingStatus.Pending;
```

- [ ] **Step 3: Generar la migración**

Comando: `dotnet ef migrations add AddBookingStatus` (en `backend/src/Bookings.Api`).
Editar la migración generada para que el `AddColumn<int>` de `Status` lleve `defaultValue: 1` (backfill a `Confirmed`).

- [ ] **Step 4: Filtrar en el endpoint**

```csharp
app.MapGet("/bookings", async (BookingsDb db, int page = 1, BookingStatus? status = null) =>
    await db.Bookings
        .Where(b => status == null || b.Status == status)
        .OrderBy(b => b.Start)
        .Skip((page - 1) * 20)
        .Take(20)
        .ToListAsync());
```

- [ ] **Step 5: Documentar el parámetro**

Añadir a `docs/api.md`, en la tabla de `GET /bookings`:

```markdown
| `status` | `Confirmed` \| `Pending` \| `Cancelled` | (sin filtro) |
```

- [ ] **Step 6: Build y test**

Comando: `moon run backend:test`.
Esperado: verde, incluyendo el test RED de Task 1 escrito por el hilo principal antes del despacho.

- [ ] **Step 7: Commit**

```bash
git add backend/src/Bookings.Api docs/api.md
git commit -m "feat(backend): filtrar reservas por estado (task 0012)"
```

---

### Task 2 — Selector de estado en la lista de reservas

**Modelo**: `sonnet`, effort medio — componente nuevo con signals sobre un patrón (`httpResource`) ya presente en el componente que modifica.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y ampliación de `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos y commiteados antes de despachar.

**Interfaces**:
- Consume: de Task 1, el parámetro de query `status` de `GET /bookings` con los valores exactos `Confirmed`, `Pending`, `Cancelled` (sin `status`, la API devuelve todas).
- Produce: componente `StatusSelectComponent` (selector `app-status-select`), con `model<BookingStatus | null>('value')` e `input<boolean>('disabled')`; tipo `BookingStatus` en `frontend/src/app/bookings/booking.ts`.

**Ficheros**: crear `frontend/src/app/bookings/status-select.component.ts`, `status-select.component.css`, `status-select.component.spec.ts`; modificar `frontend/src/app/bookings/booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`.

- [ ] **Step 1: Tipo de estado en `booking.ts`**

```typescript
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Booking {
  id: number;
  room: string;
  start: string;
  status: BookingStatus;
}
```

- [ ] **Step 2: Componente `app-status-select`**

```typescript
import { Component, input, model } from '@angular/core';
import { BookingStatus } from './booking';

@Component({
  selector: 'app-status-select',
  template: `
    <select [disabled]="disabled()" [value]="value() ?? ''" (change)="onChange($event)">
      <option value="">Todos</option>
      <option value="Confirmed">Confirmada</option>
      <option value="Pending">Pendiente</option>
      <option value="Cancelled">Cancelada</option>
    </select>
  `,
  styleUrl: './status-select.component.css',
})
export class StatusSelectComponent {
  readonly value = model<BookingStatus | null>(null);
  readonly disabled = input(false);

  onChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    this.value.set(raw === '' ? null : (raw as BookingStatus));
  }
}
```

- [ ] **Step 3: Estilos del selector**

```css
select {
  color: var(--text);
  background: var(--surface);
}

select:focus-visible {
  outline: 2px solid var(--text);
}

select:disabled {
  opacity: 0.6;
}
```

- [ ] **Step 4: Usar el selector en la lista**

```typescript
import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Booking, BookingStatus } from './booking';
import { StatusSelectComponent } from './status-select.component';

@Component({
  selector: 'app-booking-list',
  imports: [StatusSelectComponent],
  template: `
    <app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />
    <ul class="booking-list">
      @for (booking of bookings.value() ?? []; track booking.id) {
        <li>{{ booking.room }} · {{ booking.start }}</li>
      }
    </ul>
  `,
  styleUrl: './booking-list.component.css',
})
export class BookingListComponent {
  readonly status = signal<BookingStatus | null>(null);
  readonly bookings = httpResource<Booking[]>(() =>
    this.status() ? `/api/bookings?status=${this.status()}` : '/api/bookings',
  );
}
```

- [ ] **Step 5: Build y test**

Comando: `moon run frontend:test` y `moon run frontend:check`.
Esperado: verde, incluyendo los tests RED de Task 2 escritos por el hilo principal antes del despacho.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/bookings
git commit -m "feat(frontend): selector de estado en la lista de reservas (task 0012)"
```

---

## 3. Validación final

- [ ] Build verde con `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los 4 escenarios de la spec (columna + backfill, filtro en la API, selector en la lista, documentación)
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4)
- [ ] Cierre de rama según `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED — Cada reserva tiene un estado → Task 1. ✓
- ADDED — La API filtra por estado → Task 1. ✓
- ADDED — La lista se filtra con un selector → Task 2. ✓
- ADDED — La API documenta el filtro → Task 1. ✓
- No entra: cambiar el estado desde la interfaz → N/A (confirmado en spec, ningún componente de este plan escribe `Status`). ✓
