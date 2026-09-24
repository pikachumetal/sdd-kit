# SDD ledger — plan: .docs/sdd/specs/20260923-090000-task-0012-status-filter/plan.md

Spec: `.docs/sdd/specs/20260923-090000-task-0012-status-filter/spec.md` (aprobada, dev-lead, 2026-09-23). Perfil: `delegate`. Integración: `develop`. Rama: `feature/0012`.
Workspace (Windows): `C:\Users\pikac\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0026\a6e2ad97-c324-4ac6-9f87-080fc6f05e05\scratchpad\runs\g-w-1\.superpowers\sdd\plan`

## Setup (2026-09-24)

- Merge-base con `develop`: `0412060`. Apertura juntada en `1ddd680` (spec + plan + tasks.md + tests RED; antes 2 commits `4be5dce`, `ba7edc3`; árbol idéntico). Sin merges en el rango, sin remoto: guardas OK.
- Base movida (comprobada antes del Task 1): `git diff <merge-base> develop -- .docs/sdd/roadmap.md` vacío; `git diff --name-only <merge-base> develop` vacío. `develop` == merge-base. Sin freno de alcance. **Repetir las dos comprobaciones antes de despachar la Task 2.**
- Sin `.docs/sdd/environments.md`: no hay `env:setup`. Sin remoto: no hay `git fetch`.
- Restricciones «De código» (viajan literales en TODO encargo: implementador, revisor de task, re-revisión, revisor final, con la cabecera de `encargo-revision.md`):
  - Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important. *(Art. 5, literal.)*
  - Texto de la interfaz en castellano: «Todos», «Confirmada», «Pendiente», «Cancelada».
  - Valores del enum, literales: `Confirmed`, `Pending`, `Cancelled`.
- «De proceso» (no viaja): modelo `sonnet`/effort medio en implementadores; revisores: gama media como suelo (Art. 6), declarar modelo y effort al despachar; revisor final, el más capaz disponible.

## Scan pre-despacho

| Par / task | Qué produce / consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 | T1 produce `GET /bookings?status=` con `status` texto; T2 lo consume por HTTP | Sin ficheros compartidos. Contrato = texto `Confirmed\|Pending\|Cancelled`. OK |
| Task 1 (texto vs sí misma) | El test deserializa `List<Booking>` con `GetFromJsonAsync` (opciones web por defecto, sin converter) | `HasConversion<string>()` solo afecta a la BD; sin `JsonStringEnumConverter` la API emite número y el test no lee texto. Ver Ruling 2 |
| Task 1 (test vs repo) | El test usa `SqlServerApiFactory`, `SeedAsync`, `SeedRawAsync` | Ninguno está en el repo (tampoco hay csproj ni `Program.cs`; el test de la 0011 ya asume `SeedAsync`). Ver Ruling 3 |
| Task 1 (migración) | `AddBookingStatus` con `defaultValue: "Confirmed"`; enum `Confirmed=0` | No hay `HasDefaultValue` en el modelo, así que `Pending` lo fija el inicializador de CLR; el default de BD solo cubre filas antiguas. Coherente con la spec. OK |
| Task 2 (test vs plan) | `status-select` spec fija `setInput('disabled', true)`; list spec fija `componentInstance.status.set('Cancelled')` | El plan solo declara `model<BookingStatus\|null>`; faltan el input `disabled` y la señal `status` de la lista. Ver Ruling 4 |
| Task 2 (Ficheros) | El plan no lista `booking-list.component.css` | Solo se necesita si el selector cambia el layout de la lista; permitido tocarlo solo por la alineación pedida en «Verificación visual». Ver Ruling 5 |
| Todas | Cada escenario de la spec tiene su task (plan §4) | OK: 4 escenarios, 2 tasks |

## Rulings

- Ruling 1: los tests RED de las dos tasks están commiteados en el commit de apertura, no sin commitear como pide el paso 6 — el plan ya lo declaraba («escritos y commiteados») y el usuario los dio por commiteados — cuesta: el commit de cada task no contiene sus tests; se compensa apuntando `BASE` tras el commit de apertura y comparando `git diff 1ddd680 -- <rutas de tests>` al volver el implementador (sin copia fuera del repo: el commit hace de copia). En el encargo, la sección «Tests RED» dice «commiteados; no los modifiques; commitea solo tu implementación con `git add` de rutas explícitas».
- Ruling 2: `BookingStatus` lleva `[JsonConverter(typeof(JsonStringEnumConverter))]` — `BookingStatus.cs` es fichero de la Task 1, cumple «`status` como texto» del plan y hace que el test lea el texto — cuesta: si el equipo prefiere configurarlo globalmente en `Program.cs`, un cambio de una línea.
- Ruling 3: el implementador de la Task 1 NO crea `SqlServerApiFactory`, `SeedAsync` ni `SeedRawAsync` ni un csproj: no están en el plan y el test de la 0011 ya los asume fuera del repo — cuesta: `dotnet build backend` puede no ejecutarse; si no hay proyecto que compilar, el implementador para y lo reporta con el mensaje literal (BLOCKED), no lo inventa. Aviso al usuario en la presentación.
- Ruling 4: la Task 2 añade `input<boolean>('disabled')` en `app-status-select` y `readonly status = signal<BookingStatus | null>(null)` en `BookingListComponent`, con `<app-status-select [(value)]="status" [disabled]="bookings.isLoading()">` en su plantilla — los tests RED (contrato) los exigen y el plan los describe en prosa («deshabilitado mientras `bookings.isLoading()`») — cuesta: nada visible; el nombre del `model` lo elige el implementador (no lo fija ningún test).
- Ruling 5: `booking-list.component.css` no está en «Ficheros» de la Task 2; se permite tocarlo solo para la alineación/separación del selector con la lista — cuesta: si el revisor lo ve como salida del plan, va a «Me salí del plan en…». Si toca algo más que eso, es ruling nuevo.
- Ruling 6: orden de ejecución — la Task 2 se despacha tras juntar el commit de la Task 1 (revisión limpia), mientras corre `moon run backend:test` en segundo plano; el encargo de la Task 2 prohíbe `dotnet`, `moon run backend:*` y `moon run :test` — no comparten ficheros — cuesta: si `backend:test` falla, se abre la ronda de fix de la Task 1 sobre un árbol donde ya hay commit de la Task 2.

## Progreso

- Task 1: pending — BASE = `1ddd680` (apertura), a apuntar de nuevo con `git rev-parse HEAD` justo antes de despachar.
- Task 2: pending — BASE = commit juntado de la Task 1.
- Revisión final de rama: pending — MERGE_BASE = `0412060`.
- Gate de cierre (hilo principal, una vez): `moon run :test` y `moon run frontend:check`.
