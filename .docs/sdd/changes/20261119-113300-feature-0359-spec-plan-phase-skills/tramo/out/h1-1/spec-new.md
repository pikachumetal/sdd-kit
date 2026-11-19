---
id: 20261119-160359-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` enseña todas las salas libres en esa franja. Con el cambio, `libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (`Sur`), y sin `--planta` sigue enseñando todas (`Sur`). Para eso cada sala pasa a tener una planta anotada en el código.

Validación: dev-lead — lo usa una persona desde la terminal y la planta de cada sala es un dato suyo.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

> Propuesta de review: nivel bajo (un comando, una función, 2 tasks); una lente de coherencia entre spec y código bastaría; la opción mínima es no revisar y deja sin cubrir el reparto de plantas, que es un dato del dev-lead.

1. **Planta de cada sala: Norte → 1, Sur → 2** — **pendiente**: nadie dijo en qué planta está cada sala; es un dato del dev-lead y debe corregirse en la validación. Si cambia, hay que revisar los GIVEN de los escenarios con `(planta N)` y los `--planta` de sus WHEN.
   - **`libres` ignora el día** (hoy compara solo la franja): los «lun» de los GIVEN son de los datos de prueba, no de la consulta.
2. **Capacidad nueva `room-availability`** — hoy no hay `capabilities/`; el comportamiento de `libres` no está escrito en ninguna parte.
3. **Forma de la opción: `--planta <número>`**, en cualquier posición respecto a la franja (`libres --planta 2 10:00-12:00` = `libres 10:00-12:00 --planta 2`) — la opción se llama `--planta` (dev-lead); el valor separado por espacio y la libertad de posición son mías.
4. **Planta sin salas** (`--planta 9`) → salida vacía, igual que cuando no hay ninguna libre hoy — mantiene el comportamiento existente; no invento un aviso.
5. **`--planta` sin valor o no numérico** → `planta no válida: usa --planta <número>` — texto mío.
6. **Sin tope de plantas ni nombres de planta** (`bajo`, `sótano`): solo números enteros — mínimo suficiente con dos salas.
7. **Valor de `--planta`: entero ≥ 1 sin signo ni decimales** (formato `^[1-9][0-9]*---
id: 20261119-160359-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` enseña todas las salas libres en esa franja. Con el cambio, `libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (`Sur`), y sin `--planta` sigue enseñando todas (`Sur`). Para eso cada sala pasa a tener una planta anotada en el código.

Validación: dev-lead — lo usa una persona desde la terminal y la planta de cada sala es un dato suyo.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

> Propuesta de review: nivel bajo (un comando, una función, 2 tasks); una lente de coherencia entre spec y código bastaría; la opción mínima es no revisar y deja sin cubrir el reparto de plantas, que es un dato del dev-lead.

1. **Planta de cada sala: Norte → 1, Sur → 2** — **pendiente**: nadie dijo en qué planta está cada sala; es un dato del dev-lead y debe corregirse en la validación.
2. **Capacidad nueva `room-availability`** — hoy no hay `capabilities/`; el comportamiento de `libres` no está escrito en ninguna parte.
3. **Forma de la opción: `--planta <número>`**, en cualquier posición respecto a la franja (`libres --planta 2 10:00-12:00` = `libres 10:00-12:00 --planta 2`) — la opción se llama `--planta` (dev-lead); el valor separado por espacio y la libertad de posición son mías.
4. **Planta sin salas** (`--planta 9`) → salida vacía, igual que cuando no hay ninguna libre hoy — mantiene el comportamiento existente; no invento un aviso.
5. **`--planta` sin valor o no numérico** → `planta no válida: usa --planta <número>` — texto mío.
6. **Sin tope de plantas ni nombres de planta** (`bajo`, `sótano`): solo números enteros — mínimo suficiente con dos salas.
7. **Valor de `--planta`: entero ≥ 1 sin signo ni decimales** ; `0`, `02`, `-1`, `2.5`, `alta`, `10:00-12:00` → no válido) y **`--planta` repetida → no válida** — hallazgo de la review; el límite lo pongo yo.
8. **Salida de `libres` tal cual hoy**: nombres en el orden de `rooms`, separados por `, `, una línea — es lo que hace hoy `freeRooms(...).join(', ')`; no cambia.
9. **El error de planta no válida tiene prioridad** sobre cualquier otra salida, también sin franja; la franja no se valida (deuda ya anotada).
10. **Enfoque**: dato `floor` en cada sala y filtro en `freeRooms`, frente a un mapa aparte sala→planta y a filtrar por prefijo del nombre (ver Approach).
11. **Coherencia** — `capability merge` sobre una copia: 6 requisitos y 5 reglas añadidos (tras la review) a `room-availability.md`, sin rechazos; `git grep` de `planta`/`rooms`: solo `src/app.js` (ya en la tabla). Corregido un THEN: la planta vacía se prueba con `--planta 1` porque los datos actuales solo reservan `Norte`.
### Hallazgos de la review

- **Aceptado** (Crítico) — «Planta sin salas libres» mezclaba dos casos → dos escenarios, el de planta inexistente con `Sur` libre para que se vea que el filtro actúa.
- **Aceptado** — sin formato de salida ni regresión sin `--planta` → decisión 8, Reglas y escenario de regresión con varias libres.
- **Aceptado** — límites de `--planta` abiertos → decisión 7 y escenarios.
- **Aceptado** — faltaban reglas de la capacidad por nombre → completadas.
- **Aceptado** — decisiones sueltas en el cuerpo → 7, 8 y 9.
- **Aceptado** — Reglas fijaban el reparto pendiente → remiten a la decisión 1.
- **Aceptado** — frontmatter y tabla de aprobación incoherentes → alineados (`approved`, aprobada por delegación).
- **Aceptado** — «planta» no está en la terminología → va a «Términos resueltos» para que el cierre la añada a `PRODUCT.md`.
- **Aceptado** (2.ª ronda) — escenario del aviso que prima, regex de `--planta`, `floor` fuera de las Reglas, y el día que `libres` ignora anotado en ✋ 1.
- **Rechazado** (2.ª ronda) — esperar a confirmar el reparto de plantas antes de aprobar → la aprobación por delegación del dev-lead es explícita y el dato pendiente queda en ✋ 1 para su validación.
- **Rechazado** — declarar las otras funciones que leen `rooms` → `git grep rooms` solo da `freeRooms`; `reservar`, `cancelar` y `anular` no leen `rooms` (`reservar` ni valida la sala).

- Política de modelos (solo en `delegate`): revisores de la spec: los que fije `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación — «Apruebo la spec por delegación, nos vemos en la validación»
- Parar tras spec y plan, antes de implementar — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` devuelve todas las salas libres sin decir dónde están: con más salas, quien reserva tiene que saber de memoria en qué planta está cada una. Se quiere poder pedir solo las de su planta. Éxito: `libres 10:00-12:00 --planta 2` devuelve solo salas de la planta 2 libres a esa hora, y `libres 10:00-12:00` devuelve exactamente lo de hoy. Anti-goal: que sin `--planta` cambie algo de lo que ya se ve.

## Scope

- Entra: `--planta <número>` en `libres`; cada sala con su planta.
- No entra: mostrar la planta en la salida; filtrar `reservar`, `cancelar` o `anular` por planta; gestión de plantas desde la terminal; validar el formato de la franja (deuda ya anotada).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de `{ name, floor }` | `src/app.js:2`, `freeRooms` (`src/app.js:5`) | Approach: es interno, la salida de `libres` no cambia |
| La franja deja de ser siempre `params[0]` de `libres` | `src/app.js:27` | Decisión 3 y requisito «Filtrar libres por planta» |

- Filas que implementa: nada: comprobado con `grep -ri planta` sobre el repo (sin resultados).

## Approach

- A. Campo `floor` en cada sala y filtro en `freeRooms` — cuesta tocar la forma de `rooms`; un solo sitio de verdad.
- B. Mapa aparte `{ Norte: 1, Sur: 2 }` — no toca `rooms`, pero dos listas que mantener a la vez.
- C. Deducir la planta del nombre — no hay convención de nombres, descartado.
- Elegido: A — el dato vive junto a la sala; es el cambio más pequeño sin duplicar la lista.

`libres` separa los parámetros: `--planta <n>` se extrae donde esté y lo restante, primer parámetro, es la franja.

## Dónde se prueba

- Filtrado, opción en cualquier posición, planta sin salas, valor inválido: unitarios en `test/app.test.js` vía `run('libres', …)`, como el test actual de `libres`.
- Sin `--planta` igual que hoy: el test existente «libres excluye la sala reservada en la franja», que no cambia.

## Términos y ADR

- Términos resueltos: **Planta** — piso del edificio donde está una sala; entero ≥ 1. El cierre la añade a la terminología de `PRODUCT.md`.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres de una franja

- GIVEN `Norte` (planta 1) reservada lun 10:00-12:00 y `Sur` (planta 2) sin reservas
- WHEN `libres 10:00-12:00`
- THEN `Sur`

#### ADDED — Filtrar libres por planta

- GIVEN `Norte` (planta 1) y `Sur` (planta 2), ambas sin reservas a las 14:00-16:00
- WHEN `libres 14:00-16:00 --planta 2`
- THEN `Sur`
- AND `libres --planta 2 14:00-16:00` devuelve `Sur`

#### ADDED — Sin `--planta`, todas las libres

- GIVEN `Norte` y `Sur` sin reservas a las 14:00-16:00
- WHEN `libres 14:00-16:00`
- THEN `Norte, Sur` (orden de `rooms`, separadas por `, `, una línea)

#### ADDED — Planta con todas sus salas reservadas

- GIVEN `Norte` (planta 1) reservada lun 10:00-12:00 y `Sur` (planta 2) libre
- WHEN `libres 10:00-12:00 --planta 1`
- THEN salida vacía

#### ADDED — Planta sin salas

- GIVEN `Norte` (planta 1) y `Sur` (planta 2), `Sur` libre a las 10:00-12:00
- WHEN `libres 10:00-12:00 --planta 9`
- THEN salida vacía

#### ADDED — Planta no válida

- GIVEN cualquier estado
- WHEN `libres 10:00-12:00 --planta`, `--planta alta`, `--planta 0`, `--planta 02`, `--planta -1`, `--planta 2.5`, `--planta 10:00-12:00` o `--planta 1 --planta 2`
- THEN `planta no válida: usa --planta <número>`

#### ADDED — El aviso de planta prima

- GIVEN cualquier estado
- WHEN `libres --planta 0` (sin franja)
- THEN `planta no válida: usa --planta <número>`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la planta de cada sala está en `rooms` de `src/app.js` (valores concretos: ✋ 1, pendientes).
- **Idioma de los nombres**: la opción de la interfaz es `--planta`, en castellano.
- **Límites**: planta = entero ≥ 1 sin signo ni decimales; sin nombres de planta.
- **Avisos**: `planta no válida: usa --planta <número>`.
- **Regla ante conflicto**: `--planta` repetida es no válida; el aviso prima sobre el resto de la salida.

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
