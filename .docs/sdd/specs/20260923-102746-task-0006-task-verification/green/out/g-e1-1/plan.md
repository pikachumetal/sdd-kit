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

1. **Modelo y effort**: Sonnet, effort medio, en las tres tasks — cumple el suelo del art. 6 de la constitution (gama media); el código va ya escrito en el plan, así que el trabajo del implementador es mecánico.
2. **Ejecución**: agente por task (default del kit); no se declara ninguna en línea. Qué approach exacto (subagente por task vs. sesión nativa) lo confirma el usuario en el handoff de este mismo mensaje.
3. **Estado como `string`, no `enum`**: `Booking` ya modela `Room`/`Owner` como `string`; un enum exigiría `JsonStringEnumConverter` para que la API siga sirviendo `"Confirmed"` en vez de `0`. Un `string` con los tres valores literales de la spec evita esa pieza extra.
4. **Backfill de la migración**: se verifica leyendo el `Up()` generado (`AddColumn` con `defaultValue: "Confirmed"`), no con un test automático — el fixture del repo (`SqlServerApiFactory`) no expone una vía para sembrar una fila "anterior a la migración" sin pasar por EF, que ya aplicaría el default de C# (`"Pending"`).
5. **Riesgo alto**: ninguno — cambio aditivo (columna nueva, parámetro opcional, componente nuevo), sin tocar contratos existentes.
6. **Coste estimado**: ~2h de implementación (0.5h + 0.5h + 1h por task) repartidas en 3 tasks; del orden de 100-200k tokens en total entre implementadores y revisores (gama media, tasks pequeñas).

**Goal**: que la lista de reservas se pueda filtrar por estado (`Confirmed`, `Pending`, `Cancelled`) desde la API y desde un selector en la interfaz.

**Architecture**: columna `Status` (string) en `Booking` con default `"Pending"` en el modelo y `"Confirmed"` como default de columna en la migración (para las filas existentes); el endpoint `GET /bookings` acepta `status` opcional y filtra antes de paginar; el frontend añade un componente `app-status-select` que controla un signal consumido por la URL de `httpResource`.

**Tech Stack**: .NET 9 minimal API + EF Core 9 sobre SQL Server (migraciones con `dotnet ef`); Angular 20 con signals y `httpResource`; tests con xUnit/Testcontainers en backend y Vitest/jsdom en frontend.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Tres estados cerrados y con esos nombres exactos: `Confirmed`, `Pending`, `Cancelled` (spec, decisión 1).
- El filtro vive en la API (`GET /bookings?status=`), nunca en el cliente (spec, decisión 2).
- El selector es un componente propio `app-status-select`, con «Todos» como opción por defecto (spec, decisión 3).
- Texto de interfaz y documentos en castellano (constitution, art. 4).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (constitution, art. 5).

### De proceso

- Política de modelos: gama media como suelo para implementadores y revisores; `fable` y `opus xhigh` solo con justificación escrita (constitution, art. 6).
- Ejecución por defecto: agente por task (`subagent-driven-development`), salvo que el usuario, en el handoff, elija sesión nativa.
- Commits: convención del proyecto, referenciando la task `0012`.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: sí — `string` en vez de `enum`, sin capa de validación adicional, sin servicio nuevo para el filtro.
- [ ] **YAGNI gate**: sin abstracciones nuevas; el filtro reutiliza el `Where` existente y el patrón `httpResource` ya presente.
- [ ] **Brownfield gate**: retrocompatible (columna y parámetro nuevos, nada se elimina); sigue el patrón de minimal API y de componente standalone ya usado en `BookingListComponent`.
- [ ] **Constitution check**: cumple arts. 2 (verde al cerrar), 4 (castellano), 5 (calidad de código) y 6 (modelos) de `.docs/sdd/constitution.md`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `frontend/src/app/bookings/status-select.component.ts` — componente `app-status-select`: signal de valor seleccionado + opción «Todos».
- `frontend/src/app/bookings/status-select.component.css` — estilos del selector en tema claro/oscuro y sus estados.
- `frontend/src/app/bookings/status-select.component.spec.ts` — tests del componente.
- `backend/src/Bookings.Api/Migrations/*_AddBookingStatus.cs` — migración EF (nombre y timestamp los pone `dotnet ef migrations add`).

**Modificar**:

- `backend/src/Bookings.Api/Data/Booking.cs` — añade `Status`.
- `backend/src/Bookings.Api/BookingsEndpoints.cs` — añade el parámetro `status` al `GET /bookings`.
- `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs` — tests del filtro y del default.
- `docs/api.md` — documenta el parámetro `status`.
- `frontend/src/app/bookings/booking.ts` — añade `status` a la interfaz `Booking`.
- `frontend/src/app/bookings/booking-list.component.ts` — integra `app-status-select` y el signal de estado en la URL de `httpResource`.
- `frontend/src/app/bookings/booking-list.component.spec.ts` — tests del filtrado y del estado deshabilitado.

**NO se tocan**:

- `backend/src/Bookings.Api/Data/BookingsDb.cs` — `Status` es `string`, no necesita conversión ni configuración de modelo.

### 1.2 Modelo de datos

Columna `Bookings.Status` — `nvarchar`, `NOT NULL`. Default de aplicación (C#): `"Pending"`, para las reservas nuevas. Default de columna en la migración: `"Confirmed"`, para las filas que ya existían antes de aplicarla — EF siempre manda el valor de C# en el `INSERT`, así que el default de columna solo aplica a las filas backfileadas por la propia migración.

### 1.3 Migraciones

`dotnet ef migrations add AddBookingStatus` en `backend/src/Bookings.Api` (comando de `tech-stack.md`).

### 1.4 Contratos API

`GET /bookings?status={Confirmed|Pending|Cancelled}&page={n}` — `status` opcional; sin él, se listan todas. Cada `Booking` de la respuesta gana el campo `"status"`.

### 1.5 UX

`app-status-select` sobre la lista, con las opciones «Todos» (valor por defecto), «Confirmada», «Pendiente», «Cancelada». Deshabilitado mientras `bookings.isLoading()`.

### 1.6 Dependencias

Ninguna nueva: reutiliza EF Core, minimal API, `httpResource` y el patrón de componente standalone ya presentes.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un `status` desconocido en la query rompe el endpoint o devuelve todas las reservas en vez de ninguna | media | baja | Test explícito: `status` no reconocido → lista vacía, no 500 (Task 2) |
| El backfill de la migración no se puede probar en automático con el fixture actual | media | baja | Verificación manual del `Up()` generado, documentada como paso propio en vez de test (Task 1) |

### 1.8 Rollout

Directo: sin toggle, sin orden de despliegue especial.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Estado de la reserva en BD

**Modelo**: Sonnet, effort medio — cambio mecánico (propiedad + migración), código ya escrito abajo.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escrito y commiteado antes de despachar.

**Superficies**: BD, backend.
**Verificación**: `moon run backend:test`.
**Verificación lenta**: `moon run backend:test` — 17-21 min (`tech-stack.md`); el hilo principal la lanza en segundo plano al entregar la task y sigue con la revisión mientras corre.

**Interfaces**:
- Consume: nada.
- Produce: `Booking.Status` (`string`, default `"Pending"`) — lo consume Task 2 (filtro) y Task 3 (interfaz `Booking` del frontend).

**Ficheros**: modificar `backend/src/Bookings.Api/Data/Booking.cs`; crear la migración en `backend/src/Bookings.Api/Migrations/`.

- [ ] **Step 1: Escribir el test que falla**

```csharp
[Fact]
public async Task New_booking_defaults_to_pending_status()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 5", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0) });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

    Assert.Equal("Pending", bookings!.Single(b => b.Room == "Sala 5").Status);
}
```

Añadir `using System.Linq;` si no está ya en el fichero.

- [ ] **Step 2: Confirmar que falla**

Run: `moon run backend:test`
Esperado: FAIL — `Booking` no tiene la propiedad `Status`, no compila.

- [ ] **Step 3: Añadir la propiedad**

```csharp
namespace Bookings.Api.Data;

public class Booking
{
    public int Id { get; set; }
    public string Room { get; set; } = "";
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string Owner { get; set; } = "";
    public string Status { get; set; } = "Pending";
}
```

- [ ] **Step 4: Generar la migración**

Run: `dotnet ef migrations add AddBookingStatus` (desde `backend/src/Bookings.Api`)

Revisar el `Up()` generado: debe tener `migrationBuilder.AddColumn<string>(name: "Status", table: "Bookings", nullable: false, defaultValue: "Confirmed")`. Si `dotnet ef` no le pone `defaultValue`, añadirlo a mano en el fichero de migración generado — sin este valor, las reservas anteriores al cambio se quedan sin poder distinguirse de las nuevas.

- [ ] **Step 5: Build**

Run: `moon run backend:check` (o el build del proyecto si no existe ese target)
Esperado: verde, sin errores.

- [ ] **Step 6: Verificación**

Run: `moon run backend:test` (en segundo plano, ver «Verificación lenta»)
Esperado: PASS, incluido `New_booking_defaults_to_pending_status`.

- [ ] **Step 7: Commit**

```bash
git add backend/src/Bookings.Api/Data/Booking.cs backend/src/Bookings.Api/Migrations backend/tests/Bookings.Tests/BookingsEndpointsTests.cs
git commit -m "feat(backend): añadir estado a la reserva (task 0012)"
```

---

### Task 2 — La API filtra por estado y lo documenta

**Modelo**: Sonnet, effort medio — cambio mecánico (parámetro + `Where`), código ya escrito abajo.
**Tests RED**: hilo principal · `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, escrito y commiteado antes de despachar.

**Superficies**: backend, docs.
**Verificación**: `moon run backend:test`.
**Verificación lenta**: `moon run backend:test` — 17-21 min; el hilo principal la lanza en segundo plano al entregar la task.

**Interfaces**:
- Consume: `Booking.Status` (`string`, Task 1).
- Produce: `GET /bookings?status=` — lo consume Task 3 desde el frontend.

**Ficheros**: modificar `backend/src/Bookings.Api/BookingsEndpoints.cs`, `backend/tests/Bookings.Tests/BookingsEndpointsTests.cs`, `docs/api.md`.

- [ ] **Step 1: Escribir los tests que fallan**

```csharp
[Fact]
public async Task Filters_bookings_by_status()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = "Cancelled" },
        new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 11, 0, 0), End = new(2026, 9, 1, 12, 0, 0), Status = "Pending" });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=Cancelled");

    Assert.Single(bookings!);
    Assert.Equal("Sala 1", bookings![0].Room);
}

[Fact]
public async Task Returns_all_statuses_when_status_not_given()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 3", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = "Cancelled" },
        new Booking { Room = "Sala 4", Start = new(2026, 9, 1, 11, 0, 0), End = new(2026, 9, 1, 12, 0, 0), Status = "Pending" });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

    Assert.True(bookings!.Count >= 2);
}

[Fact]
public async Task Returns_empty_list_for_unknown_status()
{
    await factory.SeedAsync(
        new Booking { Room = "Sala 6", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0), Status = "Pending" });

    var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=NoExiste");

    Assert.Empty(bookings!);
}

[Fact]
public async Task Combines_status_filter_with_pagination()
{
    var cancelled = Enumerable.Range(0, 25)
        .Select(i => new Booking { Room = $"Sala {i}", Start = new DateTime(2026, 9, 1, 8, 0, 0).AddMinutes(i), End = new DateTime(2026, 9, 1, 9, 0, 0).AddMinutes(i), Status = "Cancelled" })
        .ToArray();
    await factory.SeedAsync(cancelled);

    var page2 = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=Cancelled&page=2");

    Assert.Equal(5, page2!.Count);
}
```

- [ ] **Step 2: Confirmar que fallan**

Run: `moon run backend:test`
Esperado: FAIL — el endpoint no acepta `status` y devuelve siempre todas las reservas.

- [ ] **Step 3: Filtrar en el endpoint**

```csharp
using Bookings.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Bookings.Api;

public static class BookingsEndpoints
{
    public static void MapBookings(this WebApplication app)
    {
        app.MapGet("/bookings", async (BookingsDb db, int page = 1, string? status = null) =>
            await db.Bookings
                .Where(b => status == null || b.Status == status)
                .OrderBy(b => b.Start)
                .Skip((page - 1) * 20)
                .Take(20)
                .ToListAsync());
    }
}
```

- [ ] **Step 4: Documentar el parámetro**

En `docs/api.md`, añadir una fila a la tabla de `GET /bookings`:

```markdown
| `status` | `Confirmed` \| `Pending` \| `Cancelled` | (todas) |
```

- [ ] **Step 5: Build**

Run: `moon run backend:check`
Esperado: verde, sin errores.

- [ ] **Step 6: Verificación**

Run: `moon run backend:test` (en segundo plano)
Esperado: PASS, incluidos los cuatro tests nuevos.

- [ ] **Step 7: Commit**

```bash
git add backend/src/Bookings.Api/BookingsEndpoints.cs backend/tests/Bookings.Tests/BookingsEndpointsTests.cs docs/api.md
git commit -m "feat(backend): filtrar reservas por estado en la API (task 0012)"
```

---

### Task 3 — Selector de estado en la lista

**Modelo**: Sonnet, effort medio — componente nuevo pequeño + integración, código ya escrito abajo.
**Tests RED**: hilo principal · `frontend/src/app/bookings/status-select.component.spec.ts` y `frontend/src/app/bookings/booking-list.component.spec.ts`, escritos y commiteados antes de despachar.

**Superficies**: frontend.
**Verificación**: `moon run frontend:test`, `moon run frontend:check`.
**Verificación visual**: sí — `app-booking-list` en `http://localhost:4200` (o la ruta que la monte); mirar el selector en tema claro y oscuro, en normal, con foco (tab) y deshabilitado (mientras `bookings.isLoading()` está a `true`, p. ej. limitando la red en devtools).

**Interfaces**:
- Consume: `Booking.status` (Task 2, vía `GET /bookings?status=`).
- Produce: `StatusSelectComponent` con `model<string | null>('value')` e `input<boolean>('disabled')`, selector `app-status-select` — no lo consume ninguna task posterior.

**Ficheros**: crear `frontend/src/app/bookings/status-select.component.ts`, `status-select.component.css`, `status-select.component.spec.ts`; modificar `frontend/src/app/bookings/booking.ts`, `booking-list.component.ts`, `booking-list.component.spec.ts`.

- [ ] **Step 1: Escribir los tests que fallan**

`frontend/src/app/bookings/status-select.component.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { StatusSelectComponent } from './status-select.component';

describe('StatusSelectComponent', () => {
  it('empieza en "Todos" (valor null)', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBeNull();
  });

  it('emite el estado elegido', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'Cancelled';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('Cancelled');
  });

  it('se deshabilita cuando `disabled` es true', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.disabled).toBe(true);
  });
});
```

Añadir a `frontend/src/app/bookings/booking-list.component.spec.ts` (junto al test existente, dentro del mismo `describe`):

```typescript
  it('filtra por estado a través de la API', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(BookingListComponent);
    fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne('/api/bookings').flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'Cancelled';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    TestBed.inject(HttpTestingController).expectOne('/api/bookings?status=Cancelled').flush([]);
  });

  it('vuelve a pedir todas las reservas al elegir "Todos" tras haber filtrado', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(BookingListComponent);
    fixture.detectChanges();
    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne('/api/bookings').flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'Cancelled';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock.expectOne('/api/bookings?status=Cancelled').flush([]);

    select.value = '';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock.expectOne('/api/bookings').flush([]);
  });
```

- [ ] **Step 2: Confirmar que fallan**

Run: `moon run frontend:test`
Esperado: FAIL — `status-select.component.ts` no existe; `BookingListComponent` no tiene selector ni signal de estado.

- [ ] **Step 3: Crear el selector**

`frontend/src/app/bookings/status-select.component.ts`:

```typescript
import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-status-select',
  template: `
    <select
      [value]="value() ?? ''"
      [disabled]="disabled()"
      (change)="value.set($any($event.target).value || null)">
      <option value="">Todos</option>
      <option value="Confirmed">Confirmada</option>
      <option value="Pending">Pendiente</option>
      <option value="Cancelled">Cancelada</option>
    </select>
  `,
  styleUrl: './status-select.component.css',
})
export class StatusSelectComponent {
  readonly value = model<string | null>(null);
  readonly disabled = input(false);
}
```

`frontend/src/app/bookings/status-select.component.css`:

```css
select {
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--text);
  padding: 4px 8px;
}

select:focus-visible {
  outline: 2px solid var(--text);
  outline-offset: 1px;
}

select:disabled {
  opacity: 0.5;
}
```

- [ ] **Step 4: Integrarlo en la lista**

`frontend/src/app/bookings/booking.ts`:

```typescript
export interface Booking {
  id: number;
  room: string;
  start: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}
```

`frontend/src/app/bookings/booking-list.component.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Booking } from './booking';
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
  readonly status = signal<string | null>(null);
  readonly bookings = httpResource<Booking[]>(() =>
    this.status() ? `/api/bookings?status=${this.status()}` : '/api/bookings');
}
```

`inject` deja de usarse en `booking-list.component.ts` (ya no hacía falta: `httpResource` no lo necesita en este fichero) — quitar el import si el linter lo marca.

- [ ] **Step 5: Build**

Run: `moon run frontend:check`
Esperado: verde, sin errores de lint ni de `tsc`.

- [ ] **Step 6: Verificación**

Run: `moon run frontend:test`
Esperado: PASS, incluidos los tests nuevos.

- [ ] **Step 7: Verificación visual**

Levantar `moon run frontend:serve`, abrir la lista de reservas y comprobar el selector en tema claro y oscuro: alineación y contraste en normal, con foco (tab) y deshabilitado (limitar la red en devtools para pillarlo cargando).

- [ ] **Step 8: Commit**

```bash
git add frontend/src/app/bookings/status-select.component.ts frontend/src/app/bookings/status-select.component.css frontend/src/app/bookings/status-select.component.spec.ts frontend/src/app/bookings/booking.ts frontend/src/app/bookings/booking-list.component.ts frontend/src/app/bookings/booking-list.component.spec.ts
git commit -m "feat(frontend): selector de estado en la lista de reservas (task 0012)"
```

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run :test` y `moon run frontend:check` (constitution, art. 2).
- [ ] Verificación de los criterios de éxito de la spec: los cuatro escenarios «ADDED» de `booking-list` en `spec.md`.
- [ ] Spec satisfecha: cada requisito tiene su task (ver §4).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`).

---

## 4. Self-review (cobertura spec → tasks)

- «Cada reserva tiene un estado» (migración + default `Pending`/`Confirmed`) → Task 1. ✓
- «La API filtra por estado» → Task 2. ✓
- «La API documenta el filtro» → Task 2 (Step 4, `docs/api.md`). ✓
- «La lista se filtra con un selector» (incl. temas claro/oscuro, normal/foco/deshabilitado) → Task 3. ✓
- «No entra: cambiar el estado desde la interfaz» → N/A, el selector solo filtra (confirmado en spec, Scope). ✓
