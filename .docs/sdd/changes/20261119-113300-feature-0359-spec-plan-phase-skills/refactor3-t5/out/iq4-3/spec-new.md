---
id: 20261119-165657-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: dev-lead (por delegación)
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada

🦆 Cuando reservas una sala y ese día ya está casi llena, el comando te lo dice: `reservar Norte lun 14:00-15:00` responde `reservada Norte lun 14:00-15:00` y, debajo, `aviso: Norte está muy ocupada el lun (4 reservas)`. La reserva se hace igual; el aviso solo informa. Por dentro, tras guardar la reserva se cuenta cuántas activas tiene esa sala ese día y se compara con un tope.

Validación: dev-lead — es lo que ve quien usa la terminal; hay que leer el texto del aviso y decidir si el tope es razonable.

## Capacidades

- Nuevas: `room-occupancy-warning` — cuándo y cómo se avisa de que una sala está muy ocupada.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Delegaste la aprobación de la spec y no hay entrevista: todo lo de abajo es propuesta mía. Los puntos marcados «pendiente» son los que solo tú podías contestar.

1. **Qué es «muy ocupada»** — *pendiente*. Propongo: una sala tiene ≥ 4 reservas activas el mismo día. Las reservas no tienen un catálogo de franjas ni horario de apertura, así que no se puede medir «porcentaje de horas»; contar reservas es lo único medible hoy (`bookings` en `src/app.js`). El 4 es un número mío, sin dato detrás.
2. **Dónde sale el aviso** — *pendiente*. Propongo: al reservar, no al consultar `libres`. `libres` no recibe día (solo franja), así que no sabría de qué día avisar. Efecto: hay que añadir `reservar <sala> <día> <franja>`, que hoy no existe (solo hay el stub `--cada-semana`).
3. **Texto del aviso**: `aviso: <sala> está muy ocupada el <día> (<n> reservas)`, en una línea aparte tras `reservada <sala> <día> <franja>`. Castellano por constitution §4. Los dos literales son míos.
4. **El aviso no bloquea**: la reserva se crea siempre. Nadie pidió un límite, solo avisar.
5. **Se avisa al alcanzar el tope y por encima** (4.ª, 5.ª…), contando la reserva recién creada. Las reservas `cancelled` y `voided` no cuentan (como `findBooking`).
6. **Sin aviso al cancelar ni anular**, y el stub `--cada-semana` no se toca.
7. **Tope en una constante** `OCCUPANCY_THRESHOLD = 4` de `src/app.js`, no configurable por comando ni por entorno. Un solo usuario (PRODUCT.md).
8. **Reserva sobre franja ya ocupada**: fuera de alcance; `reservar` nuevo no valida solapes (hoy tampoco hay). Lo apunto como no-objetivo, no como decisión del dev-lead.
9. Enfoque: A, frente a B y C (ver Approach).
10. Capacidad nueva `room-occupancy-warning` (kebab-case en inglés).
11. **`run` devuelve varias líneas** unidas con un salto de línea cuando hay aviso (hoy devuelve una); `libres`, `cancelar` y `anular` no cambian.
12. **Errores de `reservar`**: sin los tres argumentos → `uso: reservar <sala> <día> <franja>`; sala que no está en `rooms` → `sala desconocida: <sala>`. El día no se valida (hoy `cancelar` tampoco valida días y son texto libre: `lun`). Ambos literales son míos.
13. **Comportamiento de reservar**: crea la reserva con `status: 'active'` y responde `reservada <sala> <día> <franja>`; es un requisito de esta capacidad porque aún no hay capacidad de reservas (`capabilities/` vacío).
14. **Orden de errores de `reservar`**: primero el uso (argumentos), luego la sala desconocida.

Verificación y coordinación:
- Prueba del delta sobre una copia de `.docs/sdd`: `capability merge` → 7 requisitos añadidos y 6 reglas (Límites, Roles y acceso, Idioma de los nombres, Regla ante conflicto, Avisos, Dónde viven los datos) en `room-occupancy-warning.md`, sin rechazos.
- Coherencia: `reservar --cada-semana` conserva su rama actual (`src/app.js:29`); la nueva rama de `reservar <sala> <día> <franja>` va después y solo se toma sin `--cada-semana`.
- Política de modelos (delegate): sin revisores de spec con modelo propio salvo lo que dicte `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

Un revisor (Sonnet, siete puntos; señales: capacidad nueva · ~50 líneas · sin contrato público ni `MODIFIED`; mínimo razonable: el mismo).

- **Aceptado** (Crítico) — faltaban Idioma y Conflicto de las cinco reglas → añadidos a «Reglas de la capacidad».
- **Aceptado** (Crítico) — sin escenario de la 5.ª reserva → ADDED «Se avisa también por encima del tope».
- **Aceptado** — `reservar` sin requisito propio ni errores → ADDED «Reservar crea la reserva…» y decisiones 12 y 13.
- **Aceptado** — `voided` sin cubrir → el GIVEN del escenario de canceladas incluye una `voided`.
- **Aceptado** — decisiones sin ✋ (salida multilínea) y mezcla de viñetas con la lista → decisión 11 y bloque «Verificación y coordinación» aparte.
- **Aceptado** — tope y rangos válidos → Límites cita la constante y las salas válidas.
### Segunda ronda (Sonnet, tras dos Críticos aceptados)

- **Aceptado** (Crítico) — la prueba del merge citaba 4+3 → rehecha: 6 requisitos y 5 reglas.
- **Aceptado** (Crítico) — el escenario de reservar usaba `libres`, que no recibe día → ahora comprueba con `cancelar`.
- **Aceptado** — criterio de éxito ambiguo, escenario «por sala y día» doble, ANDs de «queda creada», no-objetivos (franja, mayúsculas, nombre), orden de errores, «Roles y acceso: no aplica», `--cada-semana` fijado en No entra.
- **Rechazado** — segunda capacidad `room-booking`: son dos tasks sobre un fichero y el dev-lead no la pidió; se funde con su porqué (decisión 13) y se separa cuando exista una capacidad de reservas.
- **Rechazado** — «operations.md no verificado»: existe y dice «reservas en memoria».

### Primera ronda

- **Rechazado** — pasar `reservar` a MODIFIED de una capacidad de reservas → `capabilities/` está vacío (`capability index`: «Sin capacidades»), no hay nada que modificar.
- **Rechazado** — renombrar `bookings`/`room`/`occupancy` → son identificadores reales de `src/app.js`; la prosa del usuario ya usa «reserva» y «sala».
- **Rechazado** — nota de contratos: `bookings` y `run` son internos de un solo fichero sin consumidores (architecture.md); lo único visible, la salida multilínea, es la decisión 11.
- **Aceptado** — `approvers`/Aprobaciones: el aprobador es el dev-lead por delegación, no el autor → se rellena al aprobar.

### Decisiones tomadas con el dev-lead

- La spec se aprueba por delegación y se valida con ella al final — «Apruebo la spec por delegación, nos vemos en la validación»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy no hay forma de saber que una sala está saturada un día salvo mirar las reservas a mano. Quien reserva (el propio dev-lead, único usuario) quiere enterarse en el momento de reservar de que esa sala ya va cargada ese día, para decidir si prefiere otra. Éxito: la reserva que deja a Norte con 4 activas el lunes muestra el aviso; la que la deja con 3, no. Anti-goal: que el aviso impida reservar o ensucie la salida cuando no toca.

## Scope

- Entra: comando `reservar <sala> <día> <franja>` que crea la reserva; aviso tras reservar si la sala alcanza el tope ese día.
- No entra: `--cada-semana` (conserva su salida; lo cubre el test existente), validar la franja (`reservar Norte lun xyz` la acepta), distinguir sala por mayúsculas (`norte` es sala desconocida), guardar a nombre de quién se reserva (la reserva de hoy no tiene ese campo), bloquear reservas, avisar en `libres`, avisos por correo (fila 0008), validar solapes, tope configurable, aviso al cancelar.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira | — | — |

- Filas que implementa: nada: comprobado con `grep -n "ocupad" ROADMAP.md src test` (sin resultados relevantes; el 0012 no tiene fila, lo reservó `sdd id next`).

## Approach

- A. Contar al reservar: tras añadir la reserva, contar activas de esa sala y día y añadir la línea de aviso — una función pura `occupancy(room, day)`, cabe en `src/app.js`; se prueba sola.
- B. Aviso en `libres` — descartado: `libres` no conoce el día.
- C. Comando aparte `ocupacion <sala> <día>` — descartado: hay que acordarse de ejecutarlo; no avisa «cuando» está ocupada.
- Elegido: A — es el único momento en que sala y día están a la vez y el usuario puede reaccionar. Lo elegí yo (delegate, sin pregunta de enfoque).

`reservar` devuelve texto de varias líneas separadas por `\n` (`run` ya devuelve una cadena que `console.log` imprime).

## Dónde se prueba

- Aviso al llegar al tope y por encima: `run('reservar', [...])` en `test/app.test.js`, como los tests actuales de `run`.
- No aviso por debajo del tope, no cuentan canceladas/anuladas: mismo fichero (el estado se prepara con `cancelBooking`/`voidBooking`, ya exportadas).
- Texto exacto: en esos mismos tests, comparando la cadena.

## Términos y ADR

- Términos resueltos: **muy ocupada** — sala con ≥ 4 reservas activas en un día (propuesta, ver ✋ 1).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-occupancy-warning`

#### ADDED — Aviso al alcanzar el tope de reservas del día

- GIVEN Norte tiene 3 reservas activas el lun (`09:00-10:00`, `10:00-11:00`, `11:00-12:00`)
- WHEN `reservar Norte lun 14:00-15:00`
- THEN la salida es `reservada Norte lun 14:00-15:00` y, en otra línea, `aviso: Norte está muy ocupada el lun (4 reservas)`
- AND la reserva queda creada

#### ADDED — Se avisa también por encima del tope

- GIVEN Norte tiene 4 reservas activas el lun
- WHEN `reservar Norte lun 15:00-16:00`
- THEN la salida es `reservada Norte lun 15:00-16:00` y, en otra línea, `aviso: Norte está muy ocupada el lun (5 reservas)`

#### ADDED — Sin aviso por debajo del tope

- GIVEN Norte tiene 1 reserva activa el lun
- WHEN `reservar Norte lun 14:00-15:00`
- THEN la salida es solo `reservada Norte lun 14:00-15:00`
- AND la reserva queda creada (`cancelar Norte lun` responde `cancelada Norte lun`)

#### ADDED — Las reservas anuladas o canceladas no cuentan

- GIVEN Norte tiene 4 reservas el lun: 2 `active`, 1 `cancelled` y 1 `voided`
- WHEN `reservar Norte lun 14:00-15:00`
- THEN la salida es solo `reservada Norte lun 14:00-15:00` (2 activas + la nueva = 3, por debajo del tope)
- AND la reserva queda creada

#### ADDED — Reservar crea la reserva y valida sus argumentos

- GIVEN Norte sin reservas el mar
- WHEN `reservar Norte mar 09:00-10:00`
- THEN la salida es `reservada Norte mar 09:00-10:00` y después `cancelar Norte mar` responde `cancelada Norte mar` (la reserva existe)
- AND `reservar Norte mar` responde `uso: reservar <sala> <día> <franja>` y `reservar Este mar 09:00-10:00` responde `sala desconocida: Este`, sin crear reserva

#### ADDED — El aviso es por sala y por día

- GIVEN Norte tiene 4 reservas activas el lun
- WHEN `reservar Sur lun 14:00-15:00`
- THEN sin aviso: la salida es solo `reservada Sur lun 14:00-15:00`

#### ADDED — El aviso no cruza días

- GIVEN Norte tiene 4 reservas activas el lun
- WHEN `reservar Norte mar 14:00-15:00`
- THEN sin aviso: la salida es solo `reservada Norte mar 14:00-15:00`

#### Reglas de la capacidad — room-occupancy-warning

- **Límites**: tope 4 reservas activas por sala y día, constante `OCCUPANCY_THRESHOLD` (propuesta pendiente, ✋ 1 y 7); salas válidas: las de `rooms` (Norte, Sur); el día es texto libre.
- **Roles y acceso**: no aplica — un solo usuario (PRODUCT.md).
- **Idioma de los nombres**: textos de la interfaz en castellano (constitution §4); nombre de la capacidad en inglés kebab-case.
- **Regla ante conflicto**: no aplica — el aviso no bloquea y `reservar` no valida solapes (✋ 8).
- **Avisos**: `aviso: <sala> está muy ocupada el <día> (<n> reservas)`.
- **Dónde viven los datos**: en memoria, `bookings` (operations.md).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| dev-lead | 2026-11-19 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
