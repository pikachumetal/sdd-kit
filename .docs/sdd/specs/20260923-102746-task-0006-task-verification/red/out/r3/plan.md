---
id: 20260923-090000-task-0012-status-filter
task: 0012
title: Plan de implementación — Filtrar la lista de reservas por estado
spec: ./spec.md
status: draft
created: 2026-09-23
---

# Plan de implementación — Filtrar la lista de reservas por estado

> Compatible con `superpowers:writing-plans`. Ejecución: `superpowers:subagent-driven-development`
> (default del kit); una task va en línea solo si lo declara con motivo en su campo `Ejecución`.

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Sonnet 5, effort medio, para las dos tasks — ambas interpretan la spec y escriben código nuevo (no son mecánicas), en dos subsistemas distintos (backend / frontend).
2. Ejecución: agente por defecto (`subagent-driven-development`); ninguna task se desvía a en línea.
3. Enum `BookingStatus` con `Confirmed = 0`: así el valor por defecto que EF pone en la columna de la migración (0) cumple «las reservas existentes pasan a Confirmed» sin SQL a medida. `Pending` se fija explícito en el `Booking` de C#, para que las altas nuevas (que sí pasan por `SaveChanges`) escriban ese valor en vez de depender del default de columna.
4. El enum se serializa como string (`JsonStringEnumConverter` puesto directamente en el enum, sin tocar configuración global — este repo no tiene `Program.cs` visible), para que la API hable en los mismos nombres que la spec (`Confirmed`/`Pending`/`Cancelled`) y el frontend no traduzca números.
5. El escenario «las reservas existentes pasan a Confirmed tras la migración» se verifica por revisión del código generado de la migración, no por test automático: la única fixture visible (`SqlServerApiFactory.SeedAsync`/`CreateClient`) no ofrece forma de simular una fila insertada antes de que la columna existiera. Detalle en Riesgos (§1.7).
6. Coste estimado: 3-4 h de implementación entre las dos tasks — backend pequeño (una columna + un filtro) y frontend pequeño (un componente nuevo), dado el tamaño del repo visible.

**Goal**: filtrar la lista de reservas por estado (`Confirmed`, `Pending`, `Cancelled`) de extremo a extremo — dato en BD, filtro en la API, selector en la lista.

**Architecture**: el estado vive como columna en `Bookings` (migración EF Core) y se expone en `GET /bookings?status=` con binding de enum estándar de minimal API; el frontend añade un componente `app-status-select` que controla un signal y se lo pasa a `httpResource` para recomponer la URL. Sin capa de traducción intermedia: el mismo nombre de estado viaja de BD a API a UI.

**Tech Stack**: backend/ (.NET 9 minimal API, EF Core 9, SQL Server); frontend/ (Angular 20, signals, `httpResource`).

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Los tres estados son exactamente `Confirmed`, `Pending`, `Cancelled` — no añadir un cuarto estado ni sinónimos (spec, decisión 1).
- El filtro vive en la API (`GET /bookings?status=`); no se filtra en el cliente (spec, decisión 2).
- El selector es un componente propio `app-status-select`, con «Todos» como opción por defecto (spec, decisión 3).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (constitution Art. 5).
- Texto de interfaz en castellano (constitution Art. 4): las opciones del selector («Todos», «Confirmada», «Pendiente», «Cancelada»).
- Comandos que deben quedar en verde: `moon run :test`, `moon run frontend:check` (constitution Art. 2).

### De proceso

- Política de modelos: declarar modelo y effort por task; gama media (Sonnet) como suelo si hay que interpretar prosa (constitution Art. 6).
- Ejecución por defecto: `superpowers:subagent-driven-development`; una task en línea solo con motivo declarado.
- Mensajes de commit: tipo/scope en inglés (`feat(backend):`, `feat(frontend):`), título y cuerpo en castellano.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sí — un enum, una columna, un query param, un componente. Sin capas intermedias (sin DTO, sin servicio HTTP dedicado, siguiendo el patrón actual de `httpResource` inline).
- [x] **YAGNI gate**: no se abstrae nada con menos de 3 usos; no hay `BookingService`, `StatusFilterStrategy` ni nada por el estilo.
- [x] **Brownfield gate**: retrocompatible — `GET /bookings` sin `status` sigue devolviendo todas (lo exige el propio THEN de la spec); respeta el patrón existente (minimal API inline, `httpResource` inline, componentes standalone); sin refactor fuera de scope.
- [x] **Constitution check**: Art. 1 (flujo SDD, rama `feature/0012` ya creada), Art. 2 (`moon run :test` / `moon run frontend:check` en cada task), Art. 3 (git-flow), Art. 4 (castellano en UI), Art. 5 (calidad de código), Art. 6 (modelo y effort declarados).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `backend/src/Bookings.Api/Data/BookingStatus.cs` — enum de los tres estados.
- `backend/src/Bookings.Api/Migrations/*_AddBookingStatus.cs` (+ `.Designer.cs`) — generados por `dotnet ef migrations add`, timestamp asignado al generarlos.
- `frontend/src/app/bookings/status-select.component.ts` (+ `.css`) — componente `app-status-select`.
- `frontend/src/app/bookings/status-select.component.spec.ts` — tests del selector.

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs:1-10` — añade la propiedad `Status`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs:6-17` — añade el query param `status` y el filtro.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs:1-19` — añade los tests de filtro y de estado por defecto.
- `docs/api.md:1-9` — documenta el parámetro `status`.
- `frontend/src/app/bookings/booking.ts:1-5` — añade `status` y el tipo `BookingStatus`.
- `frontend/src/app/bookings/booking-list.component.ts:1-18` — añade el selector y pasa `status` a `httpResource`.
- `frontend/src/app/bookings/booking-list.component.spec.ts:1-18` — añade `status` al booking de prueba y un test de filtro.

**NO se tocan**:

- `backend/src/Bookings.Api/Data/BookingsDb.cs` — la columna nueva se infiere por convención de EF Core (propiedad no anulable → `NOT NULL`); no hace falta `OnModelCreating` ni `IEntityTypeConfiguration`.

### 1.2 Modelo de datos

Columna nueva en `Bookings`: `Status int NOT NULL DEFAULT 0`. `0` = `Confirmed` (ver decisión 3). Sin índice: el volumen de reservas no lo justifica (YAGNI).

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api` (comando de `tech-stack.md`). La migración generada debe traer:

```csharp
migrationBuilder.AddColumn<int>(
    name: "Status",
    table: "Bookings",
    type: "int",
    nullable: false,
    defaultValue: 0);
```

### 1.4 Contratos API

`GET /bookings?status=<Confirmed|Pending|Cancelled>&page=<n>`:
- `status` es opcional; sin él, se devuelven todas (comportamiento actual).
- Valor no reconocido → 400, por el binding de enum estándar de minimal API (sin código a medida).
- La respuesta sigue siendo la lista de `Booking` tal cual (sin DTO ni envoltorio), ahora con el campo `status` como string (`"Confirmed"`, `"Pending"`, `"Cancelled"`).

### 1.5 UX

`app-status-select` sobre la lista: un `<select>` nativo con las opciones «Todos» (valor vacío, por defecto), «Confirmada», «Pendiente», «Cancelada». Se deshabilita mientras `bookings.isLoading()` es `true`. Colores con las mismas variables CSS que ya usa `booking-list.component.css` (`--text`, `--surface`), para que el aspecto en tema claro/oscuro sea igual sin variables nuevas.

### 1.6 Dependencias

Ninguna: sin librerías nuevas ni specs previas de las que depender.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `SqlServerApiFactory` (fixture Testcontainers) no es visible en este repo recortado; no se sabe cómo aplica migraciones en tests | media | alto (los tests podrían no ver la columna) | Task 1 asume su contrato actual tal como lo usa el test existente (`SeedAsync(params Booking[])`, `CreateClient()`); si el implementador descubre que no aplica migraciones automáticamente, es un ruling — registrarlo y ajustar sin tocar la spec |
| El escenario «existentes → Confirmed» no tiene test automático posible con la fixture visible | baja | medio | Verificar por revisión del código generado de la migración (Task 1, paso de verificación), en vez de con un test |
| Serializar el enum como string depende de `System.Text.Json.Serialization`, y no hay `Program.cs` visible para confirmar si ya hay opciones JSON globales que choquen | baja | bajo | Poner `[JsonConverter(typeof(JsonStringEnumConverter))]` en el propio enum, sin depender de configuración global |

### 1.8 Rollout

Directo. La migración se aplica junto al despliegue del backend; el mecanismo exacto de aplicación (startup vs. paso de CI) no es visible en este repo recortado — usar el que ya tenga el proyecto real.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Backend: estado de la reserva, migración y filtro en la API

**Modelo**: Sonnet 5, effort medio — interpreta la spec (enum, migración, binding de query param) y escribe código nuevo.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escritos y commiteados antes de despachar.

```csharp
[Fact]
public async Task Filters_bookings_by_status()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Cancelled },
        new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 10, 0, 0), End = new(2026, 9, 1, 11, 0, 0), Status = BookingStatus.Confirmed });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=Cancelled");

    Assert.Single(bookings!);
    Assert.Equal("Sala 1", bookings![0].Room);
}

[Fact]
public async Task Without_status_returns_all_bookings()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = BookingStatus.Cancelled },
        new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 10, 0, 0), End = new(2026, 9, 1, 11, 0, 0), Status = BookingStatus.Confirmed });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

    Assert.Equal(2, bookings!.Count);
}

[Fact]
public async Task New_booking_defaults_to_pending_status()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 3", Start = new(2026, 9, 1, 8, 0, 0), End = new(2026, 9, 1, 9, 0, 0) });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=Pending");

    Assert.Single(bookings!);
    Assert.Equal("Sala 3", bookings![0].Room);
}
```

**Interfaces**:
- Consume: nada.
- Produce: enum `Bookings.Api.Data.BookingStatus` (`Confirmed = 0`, `Pending = 1`, `Cancelled = 2`, serializado como string en JSON); propiedad `Booking.Status` (tipo `BookingStatus`, default `Pending`); `GET /bookings?status=<Confirmed|Pending|Cancelled>` (opcional, sin él devuelve todas).

**Ficheros**: crear `backend/src/Bookings.Api/Data/BookingStatus.cs`; modificar `backend/src/Bookings.Api/Data/Booking.cs`, `backend/src/Bookings.Api/BookingsEndpoints.cs`, `docs/api.md`; generar migración en `backend/src/Bookings.Api/Migrations/`.

- [ ] **Step 1: Enum de estado**

```csharp
// backend/src/Bookings.Api/Data/BookingStatus.cs
using System.Text.Json.Serialization;

namespace Bookings.Api.Data;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum BookingStatus
{
    Confirmed = 0,
    Pending = 1,
    Cancelled = 2,
}
```

- [ ] **Step 2: Propiedad `Status` en `Booking`**

```csharp
// backend/src/Bookings.Api/Data/Booking.cs
namespace Bookings.Api.Data;

public class Booking
{
    public int Id { get; set; }
    public string Room { get; set; } = "";
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string Owner { get; set; } = "";
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
}
```

- [ ] **Step 3: Migración**

Ejecutar en `backend/src/Bookings.Api`:

```bash
dotnet ef migrations add AddBookingStatus
```

Abrir el fichero generado en `Migrations/` y confirmar que `Up()` incluye `AddColumn<int>(name: "Status", table: "Bookings", nullable: false, defaultValue: 0)`. Es la pieza que cumple «las reservas existentes pasan a Confirmed» (§1.7): no hay test automático para este paso, la verificación es esta lectura.

- [ ] **Step 4: Filtro en el endpoint**

```csharp
// backend/src/Bookings.Api/BookingsEndpoints.cs
using Bookings.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Bookings.Api;

public static class BookingsEndpoints
{
    public static void MapBookings(this WebApplication app)
    {
        app.MapGet("/bookings", async (BookingsDb db, int page = 1, BookingStatus? status = null) =>
        {
            var query = db.Bookings.AsQueryable();
            if (status is not null)
            {
                query = query.Where(b => b.Status == status);
            }

            return await query
                .OrderBy(b => b.Start)
                .Skip((page - 1) * 20)
                .Take(20)
                .ToListAsync();
        });
    }
}
```

- [ ] **Step 5: Documentar el parámetro**

```markdown
<!-- docs/api.md -->
# API de reservas

## `GET /bookings`

Lista las reservas ordenadas por inicio, 20 por página. Se puede filtrar por estado.

| Parámetro | Tipo | Por defecto |
| --- | --- | --- |
| `page` | entero | 1 |
| `status` | `Confirmed` \| `Pending` \| `Cancelled` | sin filtrar (todas) |
```

- [ ] **Step 6: Build**

Comando: `moon run backend:test`. Esperado: verde, incluyendo los tres tests nuevos.

- [ ] **Step 7: Commit**

```bash
git add backend/src/Bookings.Api backend/tests/Bookings.Tests docs/api.md
git commit -m "feat(backend): filtrar reservas por estado"
```

---

### Task 2 — Frontend: selector de estado en la lista

**Modelo**: Sonnet 5, effort medio — interpreta la spec (estados normal/foco/deshabilitado, tema claro/oscuro) y escribe un componente nuevo.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos y commiteados antes de despachar.

```typescript
// frontend/src/app/bookings/status-select.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { StatusSelectComponent } from './status-select.component';

describe('StatusSelectComponent', () => {
  it('emite el estado elegido', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'Cancelled';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('Cancelled');
  });

  it('emite null al elegir "Todos"', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.componentInstance.value.set('Cancelled');
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = '';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('se deshabilita cuando el input disabled es true', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.disabled).toBe(true);
  });
});
```

```typescript
// añadir a frontend/src/app/bookings/booking-list.component.spec.ts
it('filtra las reservas por el estado elegido', async () => {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  const fixture = TestBed.createComponent(BookingListComponent);
  fixture.detectChanges();

  const httpMock = TestBed.inject(HttpTestingController);
  httpMock.expectOne('/api/bookings').flush([]);
  await fixture.whenStable();

  const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
  select.value = 'Cancelled';
  select.dispatchEvent(new Event('change'));
  fixture.detectChanges();

  httpMock.expectOne('/api/bookings?status=Cancelled')
    .flush([{ id: 2, room: 'Sala 2', start: '10:00', status: 'Cancelled' }]);
  await fixture.whenStable();
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
});
```

**Interfaces**:
- Consume: `GET /bookings?status=<Confirmed|Pending|Cancelled>` (Task 1); valores de estado como string (`"Confirmed"`, `"Pending"`, `"Cancelled"`).
- Produce: tipo `BookingStatus` (`'Confirmed' | 'Pending' | 'Cancelled'`) en `frontend/src/app/bookings/booking.ts`; `StatusSelectComponent` (selector `app-status-select`) con `value = model<BookingStatus | null>(null)` y `disabled = input(false)`.

**Ficheros**: crear `frontend/src/app/bookings/status-select.component.ts`, `status-select.component.css`, `status-select.component.spec.ts`; modificar `booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`.

- [ ] **Step 1: Tipo `BookingStatus` y campo `status` en `Booking`**

```typescript
// frontend/src/app/bookings/booking.ts
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Booking {
  id: number;
  room: string;
  start: string;
  status: BookingStatus;
}
```

- [ ] **Step 2: Componente `StatusSelectComponent`**

```typescript
// frontend/src/app/bookings/status-select.component.ts
import { Component, input, model } from '@angular/core';
import type { BookingStatus } from './booking';

@Component({
  selector: 'app-status-select',
  template: `
    <select class="status-select" [value]="value() ?? ''" [disabled]="disabled()" (change)="onChange($event)">
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
    const selected = (event.target as HTMLSelectElement).value;
    this.value.set(selected === '' ? null : (selected as BookingStatus));
  }
}
```

```css
/* frontend/src/app/bookings/status-select.component.css */
.status-select {
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--text);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
}

.status-select:focus-visible {
  outline: 2px solid var(--text);
  outline-offset: 2px;
}

.status-select:disabled {
  opacity: 0.6;
}
```

- [ ] **Step 3: Cablear el selector en la lista**

```typescript
// frontend/src/app/bookings/booking-list.component.ts
import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Booking, BookingStatus } from './booking';
import { StatusSelectComponent } from './status-select.component';

@Component({
  selector: 'app-booking-list',
  imports: [StatusSelectComponent],
  template: `
    <app-status-select [value]="status()" (valueChange)="status.set($event)" [disabled]="bookings.isLoading()" />
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
  readonly bookings = httpResource<Booking[]>(() => {
    const status = this.status();
    return status ? `/api/bookings?status=${status}` : '/api/bookings';
  });
}
```

- [ ] **Step 4: Ajustar el booking de prueba existente**

En `booking-list.component.spec.ts`, el `flush` del test `lists the bookings returned by the API` pasa a incluir el campo `status`:

```typescript
TestBed.inject(HttpTestingController).expectOne('/api/bookings')
  .flush([{ id: 1, room: 'Sala 1', start: '09:00', status: 'Confirmed' }]);
```

- [ ] **Step 5: Build**

Comando: `moon run frontend:check`. Esperado: verde (lint + `tsc --noEmit`).

- [ ] **Step 6: Verificación**

Comando: `moon run frontend:test`. Esperado: verde, incluyendo los tests nuevos de `StatusSelectComponent` y el de filtro en `BookingListComponent`.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/app/bookings
git commit -m "feat(frontend): selector de estado en la lista de reservas"
```

---

## 3. Validación final

- [ ] Build verde con `moon run :test` y `moon run frontend:check`
- [ ] Verificación de los cuatro escenarios ADDED de la spec (§2 de `spec.md`)
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cada reserva tiene un estado» (migración, default `Confirmed`/`Pending`) → Task 1. ✓
- ADDED «La API filtra por estado» → Task 1. ✓
- ADDED «La lista se filtra con un selector» (tema claro/oscuro, normal/foco/deshabilitado) → Task 2. ✓
- ADDED «La API documenta el filtro» → Task 1, Step 5. ✓
- Scope «No entra: cambiar el estado desde la interfaz» → confirmado, ninguna task añade edición de estado. ✓
