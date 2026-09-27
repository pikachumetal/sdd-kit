# SDD ledger — plan: .docs/sdd/specs/20260923-090000-task-0012-status-filter/plan.md

Spec: ./spec.md (aprobada por dev-lead 2026-09-23). Perfil: delegate. Rama: feature/0012. Integración: develop (sin remoto).
Apertura: bda7823 (spec + plan + tasks.md + tests RED, juntados desde 514bd58 y a7ee1a9; sin merges, sin publicar). BASE task 1 = bda7823.
Modelo de despacho (plan, decisión 1): sonnet, effort medio, implementadores y revisores; revisor final: modelo más capaz (política superpowers), a confirmar con el usuario antes de paralelizar/costear.

## Comprobaciones previas (paso 6)

- Base: `develop` == merge-base (b419555); ningún commit nuevo en develop → fila 0012 del roadmap y ficheros de las tasks sin cambios en la base. Sin freno de alcance.
- Entorno: no existe `.docs/sdd/environments.md` → sin `env:setup`.
- Workspace `.superpowers/` ignorado por git.

## Tabla del escaneo de conflictos

| Par / task | Qué produce vs consume | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 | T1 produce `GET /bookings?status=` con `status` texto; T2 lo consume vía `/api/bookings?status=` | Sin ficheros compartidos (backend vs frontend). Contrato coherente con la spec. Orden T1 → T2 secuencial. |
| T1 consigo | Plan: `Verificación: dotnet build backend`; tests RED usan `SqlServerApiFactory`, `SeedAsync`, `SeedRawAsync` | Esas tres piezas NO existen en el repo (ni fábrica ni helpers; `BookingsEndpointsTests` ya usaba `SeedAsync`). `dotnet build backend` puede no compilar los tests. Ver Ruling 1. |
| T1 consigo | Test `Existing_bookings_are_confirmed…` exige que la migración marque `Confirmed`; `Confirmed` es el valor 0 del enum | El default `Pending` de la propiedad y el `defaultValue: "Confirmed"` de la migración deben ir solo en la migración/propiedad, sin `HasDefaultValue` en el modelo (con valor 0 EF omitiría la columna). Va en el encargo. |
| T2 consigo | Test de `booking-list` hace `fixture.componentInstance.status.set('Cancelled')`; plan no nombra `status` en `booking-list` | Falta en el plan: `booking-list` expone `status = signal<BookingStatus \| null>(null)` (o model) y la URL pasa a `/api/bookings?status=<v>` solo con valor. Ver Ruling 2. |
| T2 consigo | Test de `status-select` usa `setInput('disabled', true)`; plan solo declara `model<BookingStatus\|null>` | Falta `disabled = input(false)`. Ver Ruling 2. |
| T2 ↔ base | `booking.ts` no tiene `status` en `Booking` | Añadir tipo `BookingStatus` y `status` a `Booking` (dentro de la lista de ficheros de T2). |

## Rulings

Ruling 1: `SqlServerApiFactory`/`SeedRawAsync` ausentes en el árbol — el encargo de T1 manda al implementador NO inventarlos ni tocar los tests; si el build de tests no compila por eso lo reporta como concern (BLOCKED por contexto) — la spec manda y los tests son contrato; el coste si me equivoco: T1 vuelve como NEEDS_CONTEXT, una vuelta.
Ruling 2: el hilo principal fija en el encargo de T2 `status` en `booking-list` (signal, default null) y `disabled = input(false)` en `app-status-select` — los tests RED son el contrato y el plan calla; el coste si me equivoco: renombrar dos identificadores.
Ruling 3: los tests RED ya estaban commiteados (a7ee1a9) al llegar a este paso, y quedan dentro del commit de apertura (bda7823) en vez de en el commit de cada task — el kit los quiere sin commitear, pero deshacerlo reescribiría trabajo que el usuario dio por hecho; el BASE = bda7823 hace de copia de referencia: cualquier cambio del implementador en un test aparece en `BASE..HEAD` y va al revisor. Coste si me equivoco: el diff de la task no contiene sus tests nuevos.

## Tasks

Task 1: pending — verificación lenta `moon run backend:test` (17–21 min) la lanza el hilo principal en segundo plano al entregar.
Task 2: pending — verificación visual en navegador (`/bookings`, claro/oscuro, normal/foco/deshabilitado) tras su revisión; sin navegador → «no probado» en tasks.md.

## Restricciones «De código» (viajan íntegras en cada encargo, cabecera de encargo-revision.md)

Ver plan.md § Restricciones globales / De código. «De proceso» no viaja.
