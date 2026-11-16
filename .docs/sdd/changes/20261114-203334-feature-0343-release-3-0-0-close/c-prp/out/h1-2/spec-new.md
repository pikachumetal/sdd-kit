---
id: 20261116-112124-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: approved
created: 2026-11-16
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-16
---

# Spec — Filtrar libres por planta

🦆 Hoy `salas libres 10:00-12:00` lista todas las salas libres de la franja, estén en la planta que estén. Con `--planta 1` solo saldrán las de esa planta: `salas libres 14:00-16:00 --planta 1` dará `Norte`. Sin `--planta`, todo sigue igual. Para eso cada sala pasa a tener una planta, y el comando la usa como filtro además de la franja.

Validación: dev-lead — es lo que usa una persona en la terminal: hay que ver las salidas con sus propios ojos.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran por planta

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (opción nueva de la interfaz de línea de comandos), capacidad nueva, datos nuevos (planta de cada sala) · tamaño: ~25 líneas en 2 ficheros
- Dominio (sonnet): si los escenarios de «Filtrar las salas libres por planta» dicen lo que una persona esperaría con una planta sin salas o con la sala ocupada, y si falta algo que `libres` sin `--planta` ya hacía (señal: capacidad nueva)
- Técnica (sonnet): si la opción en cualquier posición y el valor ausente (`--planta` al final) son consistentes con cómo `run` recibe `params` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si los mensajes y la salida vacía de «todas ocupadas» son lo que espera quien reserva

1. **Plantas de las salas: Norte en la planta 1, Sur en la planta 2** — nadie las dijo y el código no las tiene. **Pendiente de confirmar con el dev-lead: son valores de ejemplo, no las plantas reales del coworking.**
2. **La planta se escribe como número pero se compara como texto** — `--planta 1`; el valor se compara tal cual con la planta de la sala.
3. **`--planta` vale en cualquier posición**: `libres --planta 2 14:00-16:00` y `libres 14:00-16:00 --planta 2` dan lo mismo — hoy la franja es el primer argumento y no quiero que el orden rompa el comando.
4. **Planta sin salas** (`--planta 3`, o `--planta x`): `sin salas en la planta 3` — distinto de «hay salas pero están ocupadas», para que no parezca que la planta no existe cuando solo está llena.
5. **Planta con salas, todas ocupadas**: salida vacía, igual que hoy cuando no queda ninguna sala libre; no cambio ese comportamiento aquí.
6. **`--planta` sin valor**: `falta la planta: usa --planta <número>`.
7. **Capacidad nueva `room-availability`**: el comportamiento de `libres` no estaba en ninguna capacidad; la declaro con el requisito que ya existía (sin planta) y el nuevo.
8. **Enfoque**: A (planta como dato de cada sala) frente a B (tabla aparte sala→planta) y C (planta deducida del nombre); ver Approach.
9. **Valor de `--planta`**: es el argumento que sigue; falta si no hay ninguno o empieza por `--` (`--planta --otra`). Un valor con forma de franja (`libres --planta 14:00-16:00`) se toma como planta, sin intentar adivinar.
10. **`--planta` repetido**: cuenta la última.
11. **Planta como texto exacto**: `01` no coincide con `1`; `--planta ""` da `sin salas en la planta `.
12. **Precedencia**: `falta la planta`, luego `sin salas en la planta`, luego la franja. Sin franja, hoy `libres` lista todas las salas (ninguna reserva coincide con una franja ausente); con `libres --planta 1` saldrá `Norte`, sin escenario porque la franja ausente queda fuera de contrato.
13. **`run` devuelve siempre una cadena**; «ninguna libre» es la cadena vacía (hoy ya lo es).
14. **El día no cuenta**: `libres` compara solo la franja, como hoy; no lo cambio.
- Política de modelos: revisores de la spec: dos, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: añadidos los dos requisitos y las cinco reglas; `capability check` → «Capacidades válidas: 1».

### Hallazgos de la review

- **Aceptado** — Crítico técnico: un solo WHEN con varios AND → escenarios separados, uno por comportamiento
- **Aceptado** — Crítico técnico: valor con forma de franja sin especificar → escenario y decisión 9
- **Aceptado** — `--planta x` y `--planta` repetido sin escenario → escenarios «Planta sin salas» y «Valor de planta que parece una franja, y planta repetida», decisiones 9, 10 y 11
- **Aceptado** — «salida vacía» ambigua y retorno de `run` → decisión 13 y nota de datos del delta
- **Aceptado** — el día no se cruza → decisión 14 y nota de datos
- **Aceptado** — «Límites» y «Regla ante conflicto» no aplica con casos reales → rellenadas
- **Aceptado** — precedencia de errores → decisión 12 y regla «Avisos»
- **Aceptado** — plantas de ejemplo fijadas como verdad → nota en el delta que lo liga a la decisión 1
- **Rechazado** — escenario de `libres` sin franja → sin escenario a propósito (decisión 12): no hay comportamiento nuevo que prometer
- **Rechazado** — escenario de «todas ocupadas» sin `--planta` → no hay una reserva que ocupe ambas salas en los datos; queda fuera del alcance, no cambia

Segunda ronda (un revisor, sonnet):

- **Aceptado** — Crítico: `--planta ""` prometido sin escenario → escenario en «Planta sin salas»
- **Aceptado** — Crítico: la precedencia no se prueba → escenario «Sin salas» gana a la franja
- **Aceptado** — Importante: dos escenarios en un WHEN → «Valor de planta que parece una franja» y «Planta repetida» separados
- **Aceptado** — Importante: planta «número» vs texto → decisión 2 reformulada; y franja ausente → decisión 12 dice qué hace hoy
- **Aceptado** — Importante: spec aprobada con plantas inventadas → el plan pide confirmarlas antes de la Task 1 (nota en el plan; la decisión 1 sigue pendiente)
- **Rechazado** — «Listar las salas libres» como ADDED → es la capacidad nueva y esa conducta no estaba escrita en ninguna (decisión 7)
- **Rechazado** — reserva extra para «todas ocupadas sin planta» y números de línea en la tabla → por tamaño; las tasks verifican con `git grep`
- **Rechazado** — `salas libres` vs `libres` → `salas libres 10:00-12:00` es la invocación real (CHANGELOG), `libres` el subcomando que recibe `run`

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación — «Apruebo la spec por delegación, nos vemos en la validación»
- Se escribe la spec y el plan y se para antes de implementar — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres` solo filtra por franja. Con salas en varias plantas, quien busca sitio tiene que leer toda la lista y descartar las de otra planta. Éxito: `libres <franja> --planta <n>` devuelve solo las salas libres de esa planta, y sin la opción el resultado no cambia. Fracaso (aunque funcione): que `libres` sin `--planta` cambie de salida, o que una planta llena y una planta que no existe den el mismo resultado.

El porqué —qué hará la persona con ese filtro— no se dijo: supongo que elegir sala sin subir ni bajar de planta, y queda como pendiente.

## Scope

- Entra: planta de cada sala; opción `--planta <n>` en `libres`; los dos mensajes de las decisiones 4 y 6.
- No entra: reservar por planta, mostrar la planta en la salida, otras opciones de `libres`, validar el formato de la franja (deuda ya anotada).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de salas con planta | `src/app.js:2`, usado solo en `freeRooms` (`src/app.js:5`) | Scope: se cambia en la task 1; `git grep -n "rooms"` no encuentra más usos |
| `freeRooms(slot)` pasa a recibir también la planta | `src/app.js:5`, llamado solo en `run` (`src/app.js:28`) | Scope: se cambia en la task 1 |

- Filas que implementa: nada: comprobado con `git grep -n "libres" -- . ':!.docs/sdd/specs'` (solo `src/app.js`, `test/app.test.js` y la línea del `CHANGELOG.md` de la 0006, que lo escribe el cierre de release).

## Approach

- A. La planta es un dato de cada sala (`{ name: 'Norte', floor: '1' }`) — un cambio pequeño; una sala nueva ya trae su planta.
- B. Tabla aparte nombre→planta — dos sitios que mantener a la vez y se pueden desincronizar.
- C. Deducir la planta del nombre — Norte y Sur no dicen nada de la planta.
- Elegido: A — es la única que mantiene el dato junto a la sala; el proyecto vive en un solo fichero y en memoria.

`run('libres', params)`: saca de `params` la opción `--planta` y su valor (en cualquier posición); la franja es el primer argumento restante. `freeRooms(slot, floor)` filtra primero por planta si hay, y luego por franja como hasta ahora.

## Dónde se prueba

- Todos los comportamientos de `libres`: llamando a `run('libres', [...])` en `test/app.test.js`, como el test existente de `libres`.

## Términos y ADR

- Términos resueltos: **Planta** — el piso del edificio en que está una sala; se escribe en la opción como número.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

> Datos de los escenarios: salas Norte (planta 1) y Sur (planta 2) y una reserva activa de Norte el lunes en `10:00-12:00`. La planta de cada sala es la decisión 1, pendiente de confirmar: si cambia, cambian estos escenarios. `libres` no mira el día: una reserva activa ocupa su franja en cualquier día (como hoy). La salida de `run` es siempre una cadena, y la de «ninguna libre» es la cadena vacía.

#### ADDED — Listar las salas libres de una franja

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale `Sur`
- AND con `libres 14:00-16:00` sale `Norte, Sur`

#### ADDED — Filtrar las salas libres por planta

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres 14:00-16:00 --planta 1`
- THEN sale `Norte`
- AND con `libres --planta 2 14:00-16:00` sale `Sur`

#### ADDED — Planta con salas, todas ocupadas

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres 10:00-12:00 --planta 1`
- THEN sale la cadena vacía, porque Norte está ocupada en esa franja

#### ADDED — Planta sin salas

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres 14:00-16:00 --planta 3`
- THEN sale `sin salas en la planta 3`
- AND con `--planta x` sale `sin salas en la planta x`
- AND con `--planta 01` sale `sin salas en la planta 01`, porque la planta se compara como texto exacto
- AND con `--planta ""` (argumento vacío) sale `sin salas en la planta `, porque un argumento vacío es un valor presente

#### ADDED — «Sin salas» gana a la franja

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres 10:00-12:00 --planta 3`
- THEN sale `sin salas en la planta 3` y no la cadena vacía

#### ADDED — Planta sin valor

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres 14:00-16:00 --planta`
- THEN sale `falta la planta: usa --planta <número>`
- AND con `libres 14:00-16:00 --planta --otra` sale lo mismo

#### ADDED — Valor de planta que parece una franja

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres --planta 14:00-16:00`
- THEN sale `sin salas en la planta 14:00-16:00`, porque el argumento que sigue a `--planta` es su valor

#### ADDED — Planta repetida

- GIVEN las salas y la reserva de los datos de arriba
- WHEN se ejecuta `libres 14:00-16:00 --planta 1 --planta 2`
- THEN sale `Sur`, porque cuenta la última

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, la planta dentro de cada sala de `src/app.js`
- **Idioma de los nombres**: castellano (`libres`, `--planta`, mensajes)
- **Límites**: el valor de `--planta` es el argumento siguiente, salvo que falte o empiece por `--`; se compara como texto exacto con la planta de la sala; si se repite, cuenta la última
- **Avisos**: `sin salas en la planta <valor>` si ninguna sala tiene esa planta; `falta la planta: usa --planta <número>` si la opción no trae valor; una planta con salas todas ocupadas no avisa y devuelve la cadena vacía. Precedencia: «falta la planta», luego «sin salas», luego la franja
- **Regla ante conflicto**: gana la última `--planta`

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-16 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
