---
id: 20261115-194129-feature-0012-libres-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: approved
created: 2026-11-15
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-15
---

# Spec — Filtrar libres por planta

🦆 Hoy `salas libres 10:00-12:00` lista todas las salas libres de esa franja, sean de la planta que sean (ahora: `Sur`). Con el cambio, `salas libres 14:00-16:00 --planta 2` enseña solo las libres de la planta 2 (`Sur`), y sin `--planta` todo sigue igual (`Norte, Sur`). Si la planta no es un número como `1` o `2`, avisa con `planta no válida: usa un número, p. ej. --planta 1` en vez de listarlo todo. Para que esto sea posible, cada sala pasa a tener una planta: Norte en la 1 y Sur en la 2 (suposición mía, ver ✋). Por dentro, la lista de salas deja de ser una lista de nombres y guarda nombre y planta.

Validación: dev-lead — es un comando que usa una persona y ve su salida; la frase de delegación no nombra `agente`.

## Capacidades

- Nuevas: `room-availability` — qué salas salen libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-availability`), contrato público (la opción `--planta` del comando `libres`), datos nuevos (la planta de cada sala) · tamaño: ~25 líneas en 2 ficheros (`src/app.js` y `test/app.test.js`)
- Dominio (sonnet): si los THEN de `--planta` cubren el filtro con una sala ocupada y una planta sin salas, y si la planta asignada a Norte y Sur está declarada como suposición (señal: datos nuevos)
- Técnica (sonnet): si el análisis de argumentos admite `--planta` antes o después de la franja sin romper la franja como primer argumento, y qué pasa con `--planta` sin valor (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si la planta de cada sala y las salidas de borde son decisiones inventadas sin declarar

1. Enfoque: A, frente a B y C (ver Approach).
2. Plantas de las salas: Norte = 1, Sur = 2 — nadie dijo en qué planta está cada sala; es lo mínimo para que el filtro distinga algo con las dos salas que hay. **Suposición pendiente de tu validación.**
3. Forma de la opción: `--planta <n>`, con el valor separado por un espacio, no `--planta=<n>` (esa forma no se reconoce: se trata como cualquier otro texto, y queda fuera de este cambio).
4. Valor de `--planta`: es siempre el argumento que viene justo después. Una planta válida es un entero positivo escrito solo con dígitos y sin cero a la izquierda (`1`, `2`, `10`); no lo son `0`, `-1`, `1.5`, `+1`, `01`, `alta`, ni una franja como `14:00-16:00`.
5. Posición: `--planta <n>` puede ir antes o después de la franja; la franja es el primer argumento que queda al quitar la opción y su valor.
6. `--planta` repetida → el mismo aviso que un valor no válido (solo se admite una vez).
7. Planta sin salas libres (por ejemplo `--planta 3`) → salida vacía (`''`), igual que hoy cuando no queda ninguna sala libre (`run` devuelve `[].join(', ')`, que es `''`); no se inventa un mensaje.
8. Aviso: `planta no válida: usa un número, p. ej. --planta 1` es el valor que devuelve `run`, y se imprime como cualquier otra salida; no lista ninguna sala. Callarse y listar todas escondería el error. Si la franja también está mal (`foo`), gana el aviso: la franja no se valida.
9. Sin franja, `libres --planta 2` filtra solo por planta: es lo que ya hace `libres` sin franja (no mira reservas) más el filtro.
10. Capacidad nueva `room-availability` (slug en inglés, kebab-case): hoy ninguna capacidad recoge `libres`. Su primer escenario documenta comportamiento que ya existe (la línea de base) y los demás son el cambio. Las «Reglas de la capacidad» llevan mis valores salvo el idioma, que sale de la constitution (art. 4).
11. `§Frontend`: no aplica, es una CLI sin pantalla.
- Política de modelos: dos revisores de spec (dominio y técnica) en sonnet y, si un Crítico aceptado lo pide, un tercero en sonnet; en paralelo hasta `control.maxParallelAgents` (3); ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan; sin otros despachos en paralelo.
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: sin rechazos, crea `room-availability.md` (la spec de arriba ya lleva los cambios de la review).

### Hallazgos de la review

- **Aceptado** — Dominio 1: el escenario base se presenta como nuevo → decisión 10 lo declara línea de base.
- **Aceptado** — Dominio 2: el idioma sale de la constitution → decisión 10 y reglas.
- **Aceptado** — Dominio 3: las plantas son suposición → marcado en decisión 2 y en las reglas; quitada la ruta del fichero.
- **Aceptado** — Dominio 4 y Técnica 1: «entero» sin definir → decisión 4 y escenarios nuevos para `0`, `-1`, `1.5`.
- **Aceptado** — Dominio 5: `--planta` repetido sin escenario → decisión 6 y escenario. `--planta=2`: queda fuera, dicho en la decisión 3 y en «No entra».
- **Aceptado** — Dominio 6 y Técnica 5: dónde sale el aviso → decisión 8; la salida vacía es `''`.
- **Aceptado** — Dominio 7: «no aplica» sin motivo → razón en las reglas.
- **Aceptado** — Técnica 2: `--planta` seguido de una franja → decisión 4 y escenario.
- **Aceptado** — Técnica 3: un «o» agrupaba dos entradas → escenarios separados, con el AND de que `--planta 2` no avisa.
- **Aceptado** — Técnica 4: sin franja → decisión 9 y AND en «Libres de una planta».
- **Aceptado** — Técnica 6: el aviso y «entero» no estaban en ✋; «2 ficheros» sin explicar → decisiones 4 y 8, y tamaño aclarado.
- **Aceptado** — Técnica 9: el GIVEN de planta sin salas no declaraba que Sur está libre → corregido.
- **Aceptado** — Técnica 8: cómo prepara el test el GIVEN → «Dónde se prueba».
- **Aceptado** — Dominio 9: el término «Planta» no está en `PRODUCT.md` → lo añade el cierre (la sección «Términos y ADR»), incluida la definición de Sala.
- **Ronda 2 (sin tercera ronda)**:
  - **Aceptado** — 2: orden de evaluación fijado en Approach (primero valor, luego franja).
  - **Aceptado** — 3: añadido `--planta 1 --planta 1` y `--planta 1 --planta` al escenario de repetición.
  - **Aceptado** — 4: los GIVEN de los avisos declaran Norte y Sur sin reservas en 14:00-16:00.
  - **Aceptado** — 5: comprobado hoy: `run('libres', [])` y `run('libres', ['foo'])` devuelven `Norte, Sur` y una lista vacía se une como `''` (`[].join(', ')`), que es lo que `run` devuelve; citado en la decisión 7.
  - **Aceptado** — 6: escenario base de `libres` sin franja ni `--planta` (`Norte, Sur`, verificado hoy).
  - **Aceptado** — 7: el aviso gana si franja y planta están mal (AND con `foo --planta alta`).
  - **Aceptado** — 8: el orden de salida es el de `rooms`, anotado en «Límites».
  - **Aceptado** — 9: quitados los números de línea de «Lo que se retira».
  - **Aceptado** — 10: `status` y «Aprobaciones» registran la aprobación por delegación al cerrar la revisión.
  - **Parcial** — 1: el escenario «Libres de una franja» ya lo cubre el test actual de `libres` (`test/app.test.js`, pasa hoy: suite 4/4); ningún test nuevo lo repite.
- **Rechazado** — Dominio 8 y 10: la franja inválida junto a `--planta` ya no existe como caso (cualquier texto es una franja que no coincide con ninguna reserva, igual que hoy); los ejemplos `3` y `alta` ya son escenarios.
- **Rechazado** — Técnica 7: con los datos fijos no hay dos salas en la misma planta, así que no se puede probar el orden dentro de una planta; el orden y el separador (`Norte, Sur`) los fija el AND de «Libres de una planta» sin filtro, y `freeRooms` es la única función que lee `rooms` (`git grep -n "rooms"`).

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta».
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas».
- Perfil `delegate` — «Perfil delegate».
- Spec aprobada por delegación — «Apruebo la spec por delegación, nos vemos en la validación» (2026-11-15).
- Parar antes de implementar — «escribe la spec y el plan y para antes de implementar».

## Intent

Quien reserva suele querer una sala de su planta. Hoy `libres` devuelve todas las libres y hay que filtrarlas a ojo. Éxito: `salas libres 14:00-16:00 --planta 2` devuelve solo las libres de la planta 2, y `salas libres 14:00-16:00` devuelve exactamente lo de hoy. Anti-objetivo: que un `--planta` mal escrito devuelva todas las salas sin avisar.

## Scope

- Entra: opción `--planta <n>` en `libres`; cada sala con su planta; el aviso de planta no válida.
- No entra: filtrar `reservar`, `cancelar` o `anular` por planta; mostrar la planta en la salida; varias plantas a la vez; la forma `--planta=<n>`; alta de salas nuevas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de `{ name, floor }` | `src/app.js`: su declaración y su único uso, la función `freeRooms` (`git grep -n "rooms" -- src test` solo da esas dos líneas de `src/app.js`) | Scope; es interno, la salida de `libres` sin `--planta` no cambia |

- Filas que implementa: 0012 → nada: comprobado con `git grep -n "0012" -- . ':!.docs/sdd/specs'`

## Approach

- A: añadir la planta a cada sala (`rooms` como objetos) y filtrar en `freeRooms` con un argumento opcional; el análisis de argumentos de `libres` en `run` — cambio mínimo en `src/app.js`, un solo fichero de entrada como fija `architecture.md`.
- B: una tabla aparte `floors = { Norte: 1, Sur: 2 }` que `freeRooms` consulta — no toca la forma de `rooms`, pero deja el dato de cada sala en dos sitios que pueden desincronizarse al añadir una sala.
- C: un módulo `src/rooms.js` — `architecture.md` fija un solo fichero de entrada y con dos salas sería una abstracción de un solo uso.
- Elegido: A — el dato vive junto a la sala, sin módulo ni tabla paralela.

Lo que fija A: `freeRooms(slot, floor)` recibe la planta como número o `undefined`; `run('libres', params)` hace, en este orden: busca `--planta` en `params`; toma el argumento siguiente como valor y lo valida (decisión 4; si falta, no es válido o la opción aparece más de una vez, devuelve el aviso); quita la opción y su valor; y solo entonces toma como franja el primer argumento restante.

## Dónde se prueba

- `libres` con y sin `--planta`, planta sin salas, valores no válidos, opción repetida y orden de argumentos: por `run('libres', [...])`, como el test actual de `libres` en `test/app.test.js`. Los tests usan los datos fijos de `src/app.js` (Norte y Sur, y la reserva de Norte en `10:00-12:00` que ya existe) y no llaman a `reservar`.

## Términos y ADR

- Términos resueltos: planta — el piso de la oficina donde está una sala (Evitar: piso, floor); la Sala de `PRODUCT.md` pasa a incluir su planta.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres de una franja

- GIVEN Norte con una reserva activa en 10:00-12:00 y Sur sin reservas (comportamiento que ya existe: línea de base)
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es `Sur`

#### ADDED — Libres de una planta

- GIVEN Norte en la planta 1, Sur en la planta 2, y ninguna reserva en la franja 14:00-16:00
- WHEN se ejecuta `libres 14:00-16:00 --planta 2`
- THEN la salida es `Sur`
- AND con `libres 14:00-16:00 --planta 1` la salida es `Norte`
- AND con `libres --planta 2 14:00-16:00` la salida es `Sur`
- AND con `libres --planta 2` (sin franja) la salida es `Sur`
- AND con `libres 14:00-16:00` sin `--planta` la salida es `Norte, Sur`
- AND con `libres` sin franja ni `--planta` la salida es `Norte, Sur` (como hoy)

#### ADDED — La planta no rescata una sala ocupada

- GIVEN Norte (planta 1) con una reserva activa en 10:00-12:00
- WHEN se ejecuta `libres 10:00-12:00 --planta 1`
- THEN la salida está vacía (`''`)

#### ADDED — Planta sin salas

- GIVEN Norte ocupada en 10:00-12:00, Sur libre en 10:00-12:00, y salas solo en las plantas 1 y 2
- WHEN se ejecuta `libres 10:00-12:00 --planta 3`
- THEN la salida está vacía (`''`)

#### ADDED — Planta sin valor

- GIVEN Norte y Sur sin reservas en 14:00-16:00
- WHEN se ejecuta `libres 14:00-16:00 --planta`
- THEN la salida es `planta no válida: usa un número, p. ej. --planta 1`
- AND con `libres --planta 14:00-16:00` la salida es la misma

#### ADDED — Planta que no es un entero positivo

- GIVEN Norte y Sur sin reservas en 14:00-16:00
- WHEN se ejecuta `libres 14:00-16:00 --planta alta`
- THEN la salida es `planta no válida: usa un número, p. ej. --planta 1`
- AND con `--planta 0`, `--planta -1`, `--planta 1.5` y `--planta 01` la salida es la misma
- AND con `libres foo --planta alta` la salida es la misma (el aviso gana a una franja que no coincide con nada)
- AND con `--planta 2` la salida no es el aviso, es `Sur`

#### ADDED — Planta repetida

- GIVEN Norte y Sur sin reservas en 14:00-16:00
- WHEN se ejecuta `libres 14:00-16:00 --planta 1 --planta 2`
- THEN la salida es `planta no válida: usa un número, p. ej. --planta 1`
- AND con `--planta 1 --planta 1` y con `--planta 1 --planta` la salida es la misma

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la planta de cada sala es un dato fijo del programa; Norte en la 1 y Sur en la 2 (suposición mía, pendiente de validar).
- **Idioma de los nombres**: castellano (`libres`, `--planta`), por el art. 4 de la constitution.
- **Límites**: la planta es un entero positivo escrito solo con dígitos y sin cero a la izquierda; cualquier otro valor, o repetir la opción, es una planta no válida. El orden de salida es el de `rooms` (`Norte, Sur`), separado por `, `.
- **Avisos**: `planta no válida: usa un número, p. ej. --planta 1`, devuelto como salida de `run`.
- **Regla ante conflicto**: no aplica: la franja no se valida (hoy un texto que no coincide con ninguna reserva cuenta como libre) y no hay otro valor que pueda chocar con la planta.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-15 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
