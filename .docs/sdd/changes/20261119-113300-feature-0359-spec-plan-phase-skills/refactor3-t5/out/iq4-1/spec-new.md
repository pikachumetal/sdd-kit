---
id: 20261119-165045-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada

🦆 Hoy no hay forma de saber de un vistazo qué salas están a punto de llenarse. Con este cambio, `node src/app.js ocupadas lun` dice `muy ocupada: Norte lun (3 reservas)` si Norte tiene 3 o más reservas activas ese día, y `ninguna sala muy ocupada lun` si no hay ninguna. Por dentro, cuenta las reservas activas por sala y día y las compara con un umbral fijo.

Validación: dev-lead — es salida de la herramienta, y quien la usa y la desarrolla es una sola persona (PRODUCT.md).

## Capacidades

- Nuevas: `room-occupancy` — aviso de las salas muy ocupadas en un día.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet), lente completa — señales: capacidad nueva · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`).
- Completa (sonnet): que umbral, textos y escenarios coinciden entre decisiones y delta, y que de dónde salen las reservas está dicho (señal: capacidad nueva).
- Mínimo razonable: sin review — deja sin mirar contradicciones entre escenarios y reglas.

Coherencia: `git grep -iE "ocupad|0012"` fuera de `changes/` → sin resultados; `sdd capability merge` sobre una copia → rc 0 (detalle en la última línea de este bloque).

1. **«Muy ocupada» = 3 o más reservas activas de esa sala en ese día** — nadie definió el término; 3 es una propuesta. **Pendiente**: el dev-lead confirma el número en la validación.
2. **Dónde se ve: comando nuevo `ocupadas <día>`** — `libres` solo recibe franja, sin día, y `reservar` es hoy un stub que no crea reservas, así que no hay un momento de reserva real donde avisar. **Pendiente**: si querías el aviso al reservar o dentro de `libres`, se cambia.
3. **Textos literales**: `muy ocupada: <sala> <día> (<n> reservas)`, una línea por sala en orden de `rooms` (Norte, Sur); `ninguna sala muy ocupada <día>` si no hay ninguna; `falta el día` si se ejecuta sin día. Castellano por la constitution (art. 4).
4. **Solo cuentan reservas `active`** — canceladas y anuladas liberan la sala, como ya hace `findBooking`.
5. **El umbral es una constante en `src/app.js`**, no configurable — un solo usuario, sin ajustes.
6. **Enfoque**: A, frente a B y C (ver Approach).
7. **Capacidad nueva `room-occupancy`** (inglés, kebab-case por la regla del kit) — el proyecto no tiene `capabilities/`; se crea al cerrar.
8. **De dónde salen las reservas**: del array en memoria `bookings` de `src/app.js` (operations: sin base de datos). No cambia su estructura ni `findBooking`. Para que los tests monten el GIVEN, se exporta `bookings` y los tests lo vacían y siembran antes de cada caso. Detalle que va al plan.
9. **Función pura `busyRooms(day)`** que devuelve las salas con su cuenta; `run('ocupadas', [día])` solo da formato. Un día desconocido no se valida: da `ninguna sala muy ocupada <día>`.
10. **Cierre**: se añade la fila 0012 al ROADMAP y el término «Sala muy ocupada» a la Terminology de PRODUCT.md al cerrar, con el umbral que el dev-lead haya confirmado en la validación (no el propuesto), igual que en `capabilities/room-occupancy.md`.
- Política de modelos (`delegate`): un revisor de la spec (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
- Fusión del delta sobre una copia: `sdd capability merge` rc 0, `room-occupancy.md` con 7 requisitos y 5 reglas añadidos, sin rechazos.

### Hallazgos de la review

- **Aceptado (Crítico)** — no se dice de dónde salen las reservas → decisión 8 y Scope.
- **Aceptado** — faltan «dónde viven los datos», «idioma» y «conflicto» → añadidas a las reglas.
- **Aceptado** — escenario mezclado y sin anulada → separado (cancelada, anulada, otro día).
- **Aceptado** — sin escenario de dos salas, de 4 reservas ni de día ausente → añadidos.
- **Aceptado** — `status`/aprobación incoherentes → aprobada por delegación abajo.
- **Aceptado** — decisiones del cuerpo fuera de ✋ → decisiones 8 y 9; el «aviso» es la línea de `ocupadas`.
- **Aceptado** — registro del comando y cierre no listados → Scope y decisión 10.
- **Aceptado (Menor)** — idioma de nombres → regla declarada; capacidad en inglés por el kit.
- **Aceptado (Menor)** — término en PRODUCT.md → decisión 10.
- **Aceptado (Menor)** — «quien reserva» chocaba con un solo usuario → Validación e Intent reescritos.
- Segunda ronda (un revisor sonnet), sin Críticos: **Aceptado** la cuarta reserva sin franja → AND con día y franja; **Aceptado** el cierre copia el umbral confirmado → decisión 10; **Aceptado** argumentos de más y grafías del día → «No entra».

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, 2026-11-19 — «apruebo la spec por delegación, nos vemos en la validación»
- Perfil `delegate` — «Perfil delegate.»

## Intent

Hoy `libres` dice qué salas están libres en una franja, pero nada avisa de que una sala se está llenando. Quien reserva (el único usuario) quiere saberlo antes de intentarlo. Éxito: dado un día, la herramienta nombra las salas con 3 o más reservas activas. Anti-goal: que cuente reservas canceladas, anuladas o de otro día.

## Scope

- Entra: comando `ocupadas <día>` registrado en `run`; función `busyRooms`; constante de umbral; exportar `bookings` para los tests; tests; al cerrar, fila 0012 en ROADMAP, término en PRODUCT.md y `capabilities/room-occupancy.md`.
- No entra: aviso al reservar o en `libres`; avisos por correo (fila 0008); umbral configurable; validar ni normalizar el día (`Lun` no es `lun`), ni argumentos de más (`ocupadas lun mar` usa solo `lun`); franjas parciales.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. `run` gana una rama `ocupadas`; `bookings` pasa a exportarse | `src/app.js` | Scope y decisión 8 |

- Filas que implementa: 0012 (sin fila en el ROADMAP todavía; se añade al cerrar) → nada más lo nombra: comprobado con `git grep -iE "ocupad|0012" -- . ':!.docs/sdd/changes'` → sin resultados

## Approach

- A. Comando nuevo `ocupadas <día>` — una función pura `busyRooms(day)` que cuenta reservas activas por sala; se prueba sola y no toca `libres`.
- B. Añadir el aviso a la salida de `libres` — `libres` no conoce el día, habría que cambiar su firma y romper su test.
- C. Avisar al reservar — `reservar` es hoy un stub; habría que construir antes la creación de reservas.
- Elegido: A — es lo único que se puede dar sin tocar comportamiento existente.

## Dónde se prueba

- Todos los escenarios: unitarios en `test/app.test.js` vía `run('ocupadas', [día])`, como los de `libres`, sembrando `bookings` antes de cada caso.

## Términos y ADR

- Términos resueltos: **sala muy ocupada** — sala con 3 o más reservas activas en un día (propuesta, pendiente)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Aviso de sala muy ocupada

- GIVEN Norte con reservas activas el lunes en 08:00-10:00, 10:00-12:00 y 12:00-14:00, y Sur sin ninguna
- WHEN se ejecuta `ocupadas lun`
- THEN sale `muy ocupada: Norte lun (3 reservas)` y nada de Sur
- AND si Norte tiene además una cuarta reserva activa el lunes en 14:00-16:00, sale `muy ocupada: Norte lun (4 reservas)`

#### ADDED — Varias salas muy ocupadas

- GIVEN Norte y Sur con 3 reservas activas cada una el lunes
- WHEN se ejecuta `ocupadas lun`
- THEN salen dos líneas, Norte primero y Sur después

#### ADDED — Sin salas muy ocupadas

- GIVEN Norte con 2 reservas activas el lunes
- WHEN se ejecuta `ocupadas lun`
- THEN sale `ninguna sala muy ocupada lun`

#### ADDED — Las canceladas no cuentan

- GIVEN Norte con 2 reservas activas y 1 cancelada el lunes
- WHEN se ejecuta `ocupadas lun`
- THEN sale `ninguna sala muy ocupada lun`

#### ADDED — Las anuladas no cuentan

- GIVEN Norte con 2 reservas activas y 1 anulada el lunes
- WHEN se ejecuta `ocupadas lun`
- THEN sale `ninguna sala muy ocupada lun`

#### ADDED — Solo cuenta el día pedido

- GIVEN Norte con 2 reservas activas el lunes y 1 activa el martes
- WHEN se ejecuta `ocupadas lun`
- THEN sale `ninguna sala muy ocupada lun`

#### ADDED — Falta el día

- GIVEN cualquier estado de reservas
- WHEN se ejecuta `ocupadas` sin día
- THEN sale `falta el día`

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: en memoria, array `bookings` de `src/app.js` (sin base de datos)
- **Idioma de los nombres**: textos de interfaz en castellano; identificadores de código y nombre de la capacidad en inglés
- **Límites**: umbral de «muy ocupada» = 3 reservas activas por sala y día
- **Avisos**: `muy ocupada: <sala> <día> (<n> reservas)` · `ninguna sala muy ocupada <día>` · `falta el día`
- **Regla ante conflicto**: varias salas por encima del umbral → una línea por sala, en orden de `rooms`; un día desconocido no es error: da `ninguna sala muy ocupada <día>`

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
