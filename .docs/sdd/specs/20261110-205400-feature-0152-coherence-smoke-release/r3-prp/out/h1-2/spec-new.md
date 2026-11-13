---
id: 20261111-200105-feature-0012-libres-por-planta
feature: 0012
title: Filtrar salas libres por planta
mode: full
status: approved
created: 2026-11-11
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-11
---

# Spec — Filtrar salas libres por planta

🦆 Hoy `salas libres 10:00-12:00` enseña todas las salas libres en esa franja. Con esta feature, `salas libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (con los datos de hoy, `Sur`); sin `--planta` todo sigue igual y salen todas las libres (`Sur`, porque `Norte` está reservada en esa franja). Para saber qué sala está en qué planta, cada sala pasa a llevar su número de planta.

Validación: dev-lead — es una opción de comando que usa una persona; lo que sale por la terminal lo valida quien la usa.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran (por planta).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva, datos nuevos (planta de cada sala) · tamaño: ~15 líneas de código y ~25 de tests en 2 ficheros, sin `MODIFIED` ni contrato público de otro módulo
- Revisor único (sonnet), siete puntos: si «sin libres en la planta» (salida vacía) no se confunde con «planta inexistente» (señal: capacidad nueva) y si leer `--planta <n>` en cualquier posición deja la franja como primer argumento posicional (señal: datos nuevos)
- Mínimo razonable: ese mismo revisor — con menos, sin revisión, quedarían sin mirar los dos huecos de arriba

1. **Planta de cada sala**: `Norte` en la planta 1 y `Sur` en la planta 2. Nadie dijo qué sala está en qué planta; son valores inventados que el dev-lead debe corregir si no son los reales. Viven en la lista de salas de `src/app.js`, que es donde viven hoy las salas (memoria, sin base de datos).
2. **Forma de la opción**: `--planta <número>` (separada por espacio, como `--cada-semana`; no admito `--planta=2`), en cualquier posición tras el comando; la franja sigue siendo el primer argumento que no es la opción.
3. **Sin libres en la planta**: si la planta existe pero no hay sala libre, la salida es vacía, igual que hoy cuando no queda ninguna libre.
4. **Planta que no existe**: `salas libres 10:00-12:00 --planta 9` imprime `no existe la planta 9`.
5. **`--planta` sin número**: imprime `--planta necesita un número de planta` si falta el valor o no son solo dígitos (`--planta 10:00-12:00`, `--planta 2.5`, `--planta -1`). `--planta 0` es un número y cae en «planta inexistente».
5 bis. **Orden de validación, canal y repetición**: el aviso de repetición gana a todos; después el del valor (punto 5); después el de planta inexistente (punto 4). El valor que sigue a `--planta` se consume siempre, aunque parezca una franja, y su aviso gana sobre el caso «sin franja». Los avisos salen por la salida estándar y no cambian el código de salida, como el resto de respuestas de `run`. `--planta` repetido imprime `--planta solo se admite una vez`. Un valor con ceros delante (`--planta 02`) equivale a `2`.
5 ter. **Sin franja**: hoy `salas libres` sin franja saca todas las salas (`Norte, Sur`), porque ninguna reserva coincide con una franja inexistente; con `--planta 2` sale `Sur`. No hay aviso nuevo. Varias salas en una planta saldrían en el orden de la lista, separadas por `, ` (con los datos de hoy solo se observa sin `--planta`). El listado nunca muestra la planta, solo el nombre de la sala.
6. **Capacidad nueva**: `room-availability` (slug en inglés, kebab-case). Recoge también el comportamiento que `libres` ya tiene hoy (excluir la sala reservada en la franja), porque no existe ninguna capacidad que lo describa y el filtro cuelga de él.
7. **Enfoque**: A (elegido), frente a B y C (ver Approach).
8. **Documentos**: añado «Planta» al vocabulario de `PRODUCT.md` y una línea al `CHANGELOG.md` (el proyecto lo lleva en `[Unreleased]`). No hay `§Frontend`: es una terminal y no cambia ninguna pantalla.
9. **Delta probado en una copia**: `sdd capability merge` sobre una copia de `.docs/sdd` añade `room-availability` con 7 requisitos y sus 5 reglas, y `sdd capability check` da «Capacidades válidas: 1», sin avisos. Antes de repartir los THEN en 7 requisitos, «Libres de una planta» pasaba de 500 caracteres.
- Política de modelos (solo en `delegate`): un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (ver plan) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** (Crítico) — `--planta` con franja ausente u orden de avisos sin fijar → decisión 5 bis y escenarios «Planta sin número» y «Planta repetida»
- **Aceptado** — salida vacía sin escenario propio → «Planta sin salas libres»
- **Aceptado** — valores no enteros (`2.5`, `0`, `-1`) → decisión 5 y límites
- **Aceptado** — canal, código de salida y `--planta` repetido sin decidir → decisión 5 bis
- **Aceptado** — «Libres de una franja» ya existe y falta «ninguna libre» → nota y AND nuevo
- **Aceptado** — fila de roadmap inexistente → aclarado en «Filas que implementa»
- **Aceptado** — «piso» en la definición de Planta → reescrita; la tarea 2 comprueba el vocabulario con `git grep`
- **Aceptado** — Límites y varias salas por planta → «Límites» y decisión 5 ter
- **Rechazado** — separar la política de revisión de las decisiones: la forma del bloque la fija `review-spec.md`; el `status` pasa a `approved` al aprobarla
- **Aceptado** — listado sin planta → AND en «Libres de una planta»
- Segunda ronda (sin Críticos, no hay tercera):
  - **Aceptado** — orden entre los tres avisos, valor consumido siempre, `-1`, `0` y `02` → decisión 5 bis y escenarios
  - **Aceptado** — «sin franja» sin definir → decisión 5 ter y AND (hoy sale `Norte, Sur`)
  - **Aceptado** — «Planta sin salas libres» con una sola sala en el GIVEN → GIVEN completo y AND de otra franja
  - **Aceptado** — varias salas por planta intestable → se dice en 5 ter y se observa el orden sin `--planta`
  - **Rechazado** — sacar la política de modelos de la lista: es la línea que `delegate` exige en ✋ y las revisiones finales no son alcance, son política del plan

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación — «Apruebo la spec por delegación, nos vemos en la validación» (2026-11-11)
- Parar antes de implementar — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres` devuelve todas las salas libres de la franja, aunque la persona solo quiera las de su planta. Quien reserva tiene que descartar a ojo las de otras plantas. Éxito: con `--planta N` solo salen las libres de esa planta, y sin la opción la salida es idéntica a la de hoy. Fracaso aunque «funcione»: que sin `--planta` cambie la salida, o que una planta inexistente parezca «ninguna sala libre».

## Scope

- Entra: `--planta <número>` en `libres`; la planta de cada sala; los avisos de planta inexistente y de opción sin número; la capacidad `room-availability`; vocabulario y changelog.
- No entra: reservar, cancelar o anular con planta; mostrar la planta en el listado; filtrar por otro criterio; guardar las plantas fuera de memoria.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de salas con planta | `src/app.js:2`, `src/app.js:6` (`freeRooms`) | Scope y decisión 1: se cambia en la Task 1 |
| `freeRooms(slot)` recibe también la planta | `src/app.js:6`, `src/app.js:28` (`run`) | Scope: Task 1 |
| Salida de `libres` sin `--planta` | `test/app.test.js:5` | Sin cambio: ese test debe seguir verde tal cual (requisito «Libres de una franja») |

- Filas que implementa: ninguna: el roadmap no tiene fila para esta feature (el id 0012 lo reservó `sdd id next --reserve`); comprobado con `git grep -nE "rooms|libres|planta" -- . ":!.docs/sdd/specs"` (solo `src/app.js`, `test/app.test.js` y `CHANGELOG.md:10`, que describe el comando sin la opción y no se cambia).

## Approach

- A: filtrar en `freeRooms` por la planta de cada sala, que pasa a ser un objeto `{ name, planta }` — cambia un literal y una función; se prueba por `run`, como los tests actuales.
- B: mantener `rooms` como nombres y un mapa aparte nombre→planta — dos estructuras que hay que mantener a la vez; no gana nada con 2 salas.
- C: filtrar en `run` después de `freeRooms` — mezcla la lectura de argumentos con la regla de disponibilidad y duplica el cálculo de «planta existe».
- Elegido: A — el menor cambio, y la planta vive junto a la sala a la que pertenece.

Cómo: `run('libres', params)` extrae `--planta` y su valor de `params` (en cualquier posición); lo que queda es la franja (`params[0]` de lo restante). Sin `--planta`, el comportamiento es el de hoy.

## Dónde se prueba

- Filtro por planta, planta inexistente, opción sin número y sin filtro: por `run('libres', …)`, como `libres excluye la sala reservada en la franja` de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: Planta — altura del edificio en la que está una sala; número entero (1, 2…). _Evitar_: nivel, piso.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres de una franja

> Comportamiento que ya existe hoy: se documenta, no es código nuevo.

- GIVEN `Norte` reservada en `10:00-12:00` y `Sur` sin reserva
- WHEN `salas libres 10:00-12:00`
- THEN sale `Sur`
- AND si todas están reservadas en la franja, la salida es vacía
- AND `salas libres 14:00-16:00` sale `Norte, Sur` (orden de la lista, separadas por `, `)
- AND `salas libres` sin franja sale `Norte, Sur`

#### ADDED — Libres de una planta

- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2, `Norte` reservada en `10:00-12:00`
- WHEN `salas libres 10:00-12:00 --planta 2`
- THEN sale `Sur`
- AND `salas libres 14:00-16:00 --planta 1` sale `Norte`
- AND `--planta` antes de la franja (`salas libres --planta 2 10:00-12:00`) da el mismo resultado que después
- AND la salida lleva solo el nombre de la sala (`Sur`), nunca su planta

#### ADDED — Planta sin franja o con ceros

- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2
- WHEN `salas libres --planta 2` (sin franja)
- THEN sale `Sur`
- AND `salas libres 10:00-12:00 --planta 02` da el mismo resultado que con `--planta 2`

#### ADDED — Planta sin salas libres

- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2, `Norte` reservada en `10:00-12:00`
- WHEN `salas libres 10:00-12:00 --planta 1`
- THEN no se imprime nada (salida vacía)
- AND no sale `no existe la planta 1`
- AND con otra franja libre el filtro no está vacío siempre: `salas libres 14:00-16:00 --planta 1` sale `Norte` (ver «Libres de una planta»)

#### ADDED — Planta que no existe

- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2
- WHEN `salas libres 10:00-12:00 --planta 9`
- THEN sale `no existe la planta 9`
- AND `--planta 0` sale `no existe la planta 0`

#### ADDED — Planta sin número

- GIVEN las salas de siempre
- WHEN `salas libres 10:00-12:00 --planta`
- THEN sale `--planta necesita un número de planta`
- AND con un valor que no son solo dígitos (`salas libres --planta 10:00-12:00`, `--planta 2.5`, `--planta -1`) sale el mismo aviso: el valor se consume aunque parezca una franja
- AND `salas libres 10:00-12:00 --planta x --planta 2` sale el aviso de repetición, no este

#### ADDED — Planta repetida

- GIVEN las salas de siempre
- WHEN `salas libres 10:00-12:00 --planta 1 --planta 2`
- THEN sale `--planta solo se admite una vez`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la planta de cada sala está en la lista de salas de `src/app.js`, en memoria; sin base de datos.
- **Idioma de los nombres**: castellano (`--planta`, mensajes).
- **Límites**: la planta es un entero (solo dígitos) que coincide con la planta de alguna sala.
- **Avisos**: `no existe la planta <n>`, `--planta necesita un número de planta` y `--planta solo se admite una vez`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-11 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
