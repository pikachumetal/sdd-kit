# SDD ledger — plan: .docs/sdd/specs/20260923-090000-task-0012-status-filter/plan.md

Spec: `.docs/sdd/specs/20260923-090000-task-0012-status-filter/spec.md` (aprobada, dev-lead, 2026-09-23). Perfil: `delegate`. Modo: full.
Rama: `feature/0012`. Base de integración: `develop` (sin remoto). BASE de la rama = `b419555`. Apertura = `654dd38` (spec + plan + tasks.md + tests RED; junté los 2 commits previos `514bd58`, `a7ee1a9`).
Workspace: `C:\Users\pikac\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0026\a6e2ad97-c324-4ac6-9f87-080fc6f05e05\scratchpad\runs\g-w-3\.superpowers\sdd\plan` (ruta POSIX convertida con `cygpath -w`).
Sin `.docs/sdd/environments.md`: no hay `env:setup`. Trabajo en el worktree actual (ya aislado, rama `feature/0012`).

## Comprobaciones previas al despacho

- Fila 0012 del roadmap en la base: `git diff <merge-base> develop -- .docs/sdd/roadmap.md` vacío. Sin cambio → sin freno.
- Ficheros de las tasks cruzados con `git diff --name-only <merge-base> develop`: vacío. Sin coincidencias → sin freno.
- Guardas de juntado del apertura: sin merges en el rango, sin ramas remotas. Juntado hecho.
- Tests RED: ya commiteados en el apertura (el kit prevé no commitearlos hasta la task; ruling abajo). Copia de referencia en `red-tests/` (dentro del workspace git-ignorado, no fuera del repo). Comparar al volver cada implementador: `git diff --no-index red-tests/<f> <ruta>`, o `git diff 654dd38 -- <ruta>`.

## Modelos y ejecución (plan §Tasks)

| Task | Modelo | Ejecución | Verificación | Lenta | Visual |
| --- | --- | --- | --- | --- | --- |
| 1 | sonnet, effort medio | agente | `dotnet build backend` | `moon run backend:test` (17–21 min, hilo principal en segundo plano tras la entrega) | — |
| 2 | sonnet, effort medio | agente | `moon run frontend:test` y `moon run frontend:check` | — | `/bookings` en navegador real, claro/oscuro; sin navegador → «no probado» |

Revisores: gama media como suelo (Art. 6); revisor final, el más capaz disponible. Todos los encargos llevan `## Restricciones de código` (bloque «De código» íntegro) como primera sección.

## Scan previo (pares de tasks y tasks consigo mismas)

| Fila | Qué se comprueba | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 | ficheros compartidos | Ninguno: T1 solo backend/docs, T2 solo frontend. |
| T1 → T2 | interfaz `GET /bookings?status=` con `status` como texto | El plan dice que `HasConversion<string>()` deja el estado como texto, pero eso es solo la columna. El JSON de la API serializa el enum como número por defecto → T2 recibiría enteros. **Ruling 1.** |
| T1 | tests vs código | `Filters_by_status` y la migración concuerdan con el plan. «Sin `status`, todas» no tiene test propio (lo cubre `Lists_bookings_ordered_by_start`, que no siembra estados). THEN de `docs/api.md` sin test: se revisa en la review de la task. |
| T1 | ficheros | Crea migración `AddBookingStatus`; el resto ya existe. `HasConversion<string>()` sin `HasDefaultValue` en el modelo: el default `Confirmed` vive solo en la migración. **Ruling 2.** |
| T1 | entorno | `SqlServerApiFactory`, `SeedAsync` y `SeedRawAsync` no están definidos en el repo (los usan `BookingsEndpointsTests` y `BookingStatusTests`); tampoco hay `.csproj`. **Ruling 3.** |
| T2 | tests vs código | `status-select.component.spec.ts` fija un input `disabled`; `booking-list.component.spec.ts` fija un signal `status` en el componente lista. El plan solo declara `model<BookingStatus \| null>(null)` como interfaz producida. **Ruling 4.** |
| T2 | ficheros | Crea `status-select.component.ts/.css`; modifica `booking.ts`, `booking-list.component.ts`. Coherente con su texto. |

## Rulings

- Ruling 1: T1 marca `BookingStatus` con `[JsonConverter(typeof(JsonStringEnumConverter))]` en `BookingStatus.cs` (ya está en «Ficheros») — la spec y la Task 2 exigen `status` como texto en la API, y el atributo hace que también el test lo deserialice como texto — si falla, T2 recibe números y el filtro «Cancelled» no casa.
- Ruling 2: T1 no añade `HasDefaultValue` al modelo; `Confirmed` solo en `defaultValue` de la migración — así las reservas nuevas salen `Pending` desde el código y las filas antiguas `Confirmed` — si se añade al modelo, EF trataría `Confirmed` (valor 0, el del CLR por defecto) como «sin valor» y podría pisarlo.
- Ruling 3: `SqlServerApiFactory`/`SeedAsync`/`SeedRawAsync` y el `.csproj` no existen en este checkout. No es de esta task: el implementador de T1 no los crea ni los inventa; si `dotnet build backend` no encuentra proyecto, lo reporta con el mensaje literal y para. Coste si me equivoco: T1 queda bloqueada hasta saber dónde vive el fixture.
- Ruling 4: el encargo de T2 nombra el contrato completo que fijan los tests: `app-status-select` con `model` (valor) e `input` `disabled`; `BookingListComponent.status` como `signal<BookingStatus | null>` que el selector escribe. Es interno, no cambia la salida observable ni la spec.
- Ruling 5: los tests RED quedaron commiteados en el apertura, no sin commitear como prevé el kit; el implementador no los commitea de nuevo. Su rango de task (`654dd38..HEAD`) no los incluye; la comparación con la copia sigue valiendo para detectar cambios.

## Tareas

Task 1: pending
Task 2: pending
