# SDD ledger — plan: .docs/sdd/specs/20260923-090000-task-0012-status-filter/plan.md

Spec: ./spec.md (aprobada, dev-lead, 2026-09-23). Perfil: delegate. Rama: feature/0012. Integración: develop (sin remoto).
Apertura commiteada: fad5d09 (spec + plan + tasks.md + tests RED). BASE Task 1: fad5d09.
Copias de los tests RED (contrato, fuera del repo): red-copies/t1 (BookingStatusTests.cs), red-copies/t2 (status-select + booking-list specs). Comparar con `git diff --no-index` al volver cada implementador.

## Comprobaciones previas al despacho

- Fila 0012 del roadmap cambiada en develop: no (diff vacío; develop == merge-base 0412060).
- Ficheros de la base cruzados con «Ficheros» de las tasks: ninguno (develop no avanzó).
- Guardas de juntado: sin merges en el rango, sin remoto ni commits publicados. Apertura juntada.
- environments.md: no existe, sin `env:setup`.

## Pre-flight scan (conflictos del plan)

| Par / task | Qué produce vs consume, o coherencia interna | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 | T1 produce `GET /bookings?status=` con `status` como texto; T2 consume `/api/bookings?status=` | Coherente. Sin ficheros compartidos (backend vs frontend). |
| T1 ↔ T2 (verificación) | T1 lleva verificación lenta `moon run backend:test` (17–21 min) | T2 puede despacharse durante ella: no comparte ficheros. Su encargo prohíbe `dotnet`, `moon run backend:*` y `moon run :test`. |
| T1 interna | 3 tests RED vs código del plan: enum, `Status` default `Pending`, `HasConversion<string>`, migración `defaultValue: "Confirmed"`, filtro | Coherente: `Pending` es el default del modelo, `Confirmed` el de la migración (filas existentes); tests y spec lo esperan así. |
| T1 interna | Tests usan `SqlServerApiFactory`, `SeedAsync`, `SeedRawAsync` | Ninguno definido en el repo (`SeedAsync` ya lo usa BookingsEndpointsTests.cs). RED por compilación. Ruling 1. |
| T2 interna | Test de `status-select` hace `setInput('disabled', true)` | El plan solo declara `model<BookingStatus \| null>`; falta el input `disabled`. Ruling 2. |
| T2 interna | Test de `booking-list` hace `componentInstance.status.set('Cancelled')` | El plan no nombra el signal `status` de la lista. Ruling 3. |
| T2 interna | «Ficheros» vs pasos | Coherente. Los specs ya existen (RED). |
| Plan ↔ spec | 4 escenarios de la spec, cada uno con su task | Coherente. |

Ruling: `SqlServerApiFactory`/`SeedAsync`/`SeedRawAsync` no existen en el repo; el implementador de T1 los crea como fichero de soporte nuevo en `backend/tests/Bookings.Tests/`, sin tocar los tests RED — sin ellos T1 no compila — coste si me equivoco: un fichero de soporte que mover o borrar. (`git log --all -S SqlServerApiFactory` no lo encuentra en ninguna rama.)
Ruling: T2 añade `disabled = input(false)` a `app-status-select` y `booking-list` lo enlaza a `bookings.isLoading()` — lo exigen el test RED y la spec; el plan omitió la interfaz — coste si me equivoco: renombrar un input.
Ruling: T2 añade `status = signal<BookingStatus | null>(null)` en `booking-list`, enlazado al `model` del selector; el resource pide `/api/bookings?status=<valor>` solo si hay valor — lo exige el test RED de la lista — coste si me equivoco: renombrar un signal.
Ruling: los tests RED de las dos tasks ya estaban commiteados en el commit del plan; los dejo en el commit de apertura (fad5d09) y las tasks no los vuelven a commitear — reescribir el trabajo del dev-lead no aporta nada y el contrato se compara con las copias — coste si me equivoco: los commits de task no muestran sus tests RED.

## Tasks

- Task 1: pending — sonnet, effort medio. Verificación: `dotnet build backend`. Lenta (fondo, hilo principal): `moon run backend:test`.
- Task 2: pending — sonnet, effort medio. Verificación: `moon run frontend:test` y `moon run frontend:check`. Visual: `/bookings` en navegador real antes de marcarla hecha.

Antes de despachar T1: `git rev-parse HEAD` como BASE, `task-brief`, encargo con la cabecera de encargo-revision.md.
Cierre: `moon run :test` + `moon run frontend:check` una vez en la validación final.
