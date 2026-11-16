---
id: 20261112-162456-feature-0012-libres-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` lista todas las salas libres de la oficina. Con el cambio, `libres 10:00-12:00 --planta 2` solo lista las de la planta 2 (`Sur`), y sin `--planta` todo sigue igual que hoy (`Sur`). Para que funcione, cada sala pasa a tener una planta en los datos del programa: propongo Norte en la 1 y Sur en la 2, y es lo primero que tienes que validar.

Validación: dev-lead — es una orden que usa una persona desde la terminal; nadie ha dicho que la valide el agente.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`room-availability`), contrato público (la opción `--planta` de la orden `libres`) · tamaño: ~15 líneas en 3 ficheros
- Dominio y técnica (sonnet): si el escenario de `--planta` sin valor y el de planta inexistente dicen lo mismo que hace el código, y si la capacidad nueva no contradice el comportamiento actual de `libres` (señal: capacidad nueva)
- Mínimo razonable: ningún revisor — deja sin mirar que cada THEN de `--planta` (sin valor, planta inexistente) coincida con lo que hará el código

1. Enfoque: mapa de planta por sala dentro de `src/app.js`, frente a un fichero de configuración y a codificar la planta en el nombre (ver Approach) — es el único sitio donde viven hoy las salas.
2. Plantas de las salas: Norte → planta 1, Sur → planta 2 — los datos no traen planta y nadie la dijo; es un dato de ejemplo que cambia en cuanto me digas las reales.
3. Nombre de la capacidad: `room-availability` (inglés kebab-case) — hoy no hay capacidades; esta recoge `libres` entero para que el delta tenga dónde vivir.
4. La planta es un número entero, escrito `--planta 2` (con espacio, no `--planta=2`) — es la forma de las otras opciones de la orden (`--cada-semana`) y la más corta.
5. `--planta` puede ir antes o después de la franja; la franja es el primer argumento que no es la opción ni su valor — evita que `libres --planta 2 10:00-12:00` lea `--planta` como franja.
6. Una planta sin salas (`--planta 9`) o `--planta` sin valor devuelven lo mismo que hoy cuando no queda ninguna sala libre: una línea vacía, sin aviso nuevo — no inventar textos de error; validar el valor es la deuda ya anotada de «sin validación de formato» y queda fuera. Regla única: el valor es el argumento que sigue a `--planta`, sea cual sea (también si parece una franja); si no hay ninguno, no coincide con ninguna sala. `--planta` repetido o argumentos sobrantes quedan fuera (`No entra`).
7. Los textos de salida no cambian: salas separadas por `, ` en el orden `Norte, Sur` — es el formato actual.
8. La planta se compara como texto: `--planta 02` o `--planta 2.0` no coinciden con la planta 2 — evita validar o convertir el valor, que queda fuera.
9. Los GIVEN de la spec usan Norte en la planta 1 y Sur en la 2 como datos de ejemplo hasta que valides las plantas reales (decisión 2); si cambian, se reescriben los escenarios.
- Política de modelos: revisor de la spec sonnet (1) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Repaso de coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: acepta `room-availability` con 3 requisitos añadidos y las 5 reglas, sin rechazos. `git grep` de `libres`, `rooms`, `freeRooms`, `planta` y `0012` en todo el repo: solo `src/app.js`, `test/app.test.js` y `CHANGELOG.md:10` (ver tabla de lo que cambia de forma).

### Hallazgos de la review

- **Aceptado** — Crítico: `--planta` sin valor no tenía regla de parseo → decisión 6 fija una regla única (el valor es el argumento que sigue; sin él, no coincide con ninguna sala) y el escenario pasa a su propio requisito.
- **Aceptado** — Crítico: Scope y decisión 6 podían leerse como contradictorios → una sola regla, escrita como decisión mía.
- **Aceptado** — falta el caso positivo de la planta 1 y los AND acumulados en un requisito → `libres 14:00-16:00 --planta 1` da `Norte`; el delta se parte en «Libres por planta» y «Libres con una planta que no coincide con ninguna sala».
- **Aceptado** — comparación como texto sin declarar → decisión 8 y escenario `--planta 02`.
- **Aceptado** — tests existentes → Scope y «Dónde se prueba»: el test actual no se edita y es regresión.
- **Aceptado** — «Límites» sin justificar, GIVEN de ejemplo y cita de línea del changelog → las tres corregidas (decisión 9).
- **Aceptado** — el mínimo razonable describía un hueco ya cerrado → reescrito.
- **Rechazado** — separar el requisito sin filtro como captura de lo existente: no hay `capabilities/` donde contrastarlo y el test actual de `libres` ya es esa regresión (queda dicho en «Dónde se prueba»).

Segunda ronda (un revisor sonnet, sin Críticos):

- **Aceptado** — `libres --planta 14:00-16:00` sin definir → decisión 6 y un AND que lo fija (se lee como planta, sin franja).
- **Aceptado** — recuento desfasado del merge de prueba (3 requisitos, no 2), literal de la salida vacía (cadena vacía, como hoy), numeración de decisiones, «Avisos: ninguno», `--planta` repetido fuera de alcance, gate y test-primero en «Dónde se prueba», evidencia de que `rooms` solo la lee `freeRooms`.
- **Rechazado** — separar el orden de argumentos en su propio requisito: es un solo comportamiento de parseo y los AND ya nombran cada caso.
- **Rechazado** — fundir las dos líneas de review del bloque: son la propuesta (qué se miró) y el mínimo (qué se deja), no dos descripciones.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `libres <franja>` devuelve todas las salas libres de la oficina, y quien está en una planta tiene que descartar a ojo las de otras. Se quiere poder pedir solo las de su planta, sin cambiar lo que ya hace la orden. Es un éxito si `libres 10:00-12:00 --planta 2` devuelve solo salas de la planta 2 y `libres 10:00-12:00` devuelve exactamente lo de hoy; sería un fracaso que la orden sin `--planta` cambiara su salida.

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta de cada sala en los datos de `src/app.js`; tests nuevos en `test/app.test.js`. El test actual de `libres` no se edita y debe seguir en verde.
- No entra: validar el valor de `--planta` (ausente, no numérico, con ceros a la izquierda, inexistente: no coinciden con ninguna sala; `--planta` repetido o con argumentos sobrantes); mostrar la planta en la salida; filtrar otras órdenes (`reservar`, `cancelar`, `anular`) por planta; el filtro por día (`libres` hoy ignora el día).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de salas con planta (`git grep rooms`: solo la definición y `freeRooms`; `reservar`, `cancelar` y `anular` no la leen); `freeRooms(slot)` pasa a `freeRooms(slot, planta)` | `src/app.js:2`, `src/app.js:5-6`, `src/app.js:28` | Scope: es interno, no cambia lo que ve quien usa la orden |
| La invocación de `libres` gana una opción | `CHANGELOG.md` (la línea de la entrega anterior, `salas libres 10:00-12:00`) | Scope: el changelog lo escribe el corte de la release, no esta feature |

- Filas que implementa: nada — comprobado con `git grep -n "0012" -- . ':!.docs/sdd/changes'`, sin resultados; la feature no tiene fila en `ROADMAP.md`.

## Approach

- **A. Mapa de planta junto a las salas en `src/app.js`** — `rooms` pasa a objetos `{ name, floor }`; el filtro es una condición más en `freeRooms`. Cuesta tocar la forma de `rooms`, que es interna y solo la lee `freeRooms`.
- B. Fichero de configuración de salas — nada lo pide: hoy las salas viven en `src/app.js`, sin dependencias ni ficheros externos (`architecture.md`), y un fichero nuevo es más superficie para dos salas.
- C. Codificar la planta en el nombre (`Norte-1`) — cambia el nombre que ven `reservar`, `cancelar` y `anular`, que no entran.
- Elegido: A — es el cambio mínimo, no añade ficheros y deja los nombres de sala como están.

Detalle que fija A: `libres` separa de `params` la opción `--planta` y su valor; lo que queda, en orden, es la franja. Sin `--planta`, el filtro por planta no se aplica. Con ella, se compara el valor con la planta de cada sala como texto (`"2"` coincide con `2`).

## Dónde se prueba

- `libres` sin `--planta`, con `--planta` en cada orden, planta con sala libre y planta sin salas, `--planta` sin valor, `--planta 02`: llamando a `run('libres', [...])`, como el test actual de `libres` en `test/app.test.js`, que queda sin editar y sirve de regresión del requisito sin filtro. Los tests nuevos se escriben antes que el código y el gate de cierre es `node --test && node scripts/lint.mjs` entero en verde (constitución, regla 2).

## Términos y ADR

- Términos resueltos: **Planta** — piso del edificio donde está una sala; número entero. ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin filtro de planta

- GIVEN las salas Norte (planta 1) y Sur (planta 2), y una reserva activa de Norte en la franja `10:00-12:00`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND con una franja sin reservas, `libres 14:00-16:00`, la salida es `Norte, Sur`

#### ADDED — Libres por planta

- GIVEN las salas Norte (planta 1) y Sur (planta 2), y una reserva activa de Norte en la franja `10:00-12:00`
- WHEN se ejecuta `libres 14:00-16:00 --planta 1`
- THEN la salida es `Norte`
- AND `libres 14:00-16:00 --planta 2` da `Sur`
- AND `libres 10:00-12:00 --planta 2` da `Sur`
- AND `libres 10:00-12:00 --planta 1` da una línea vacía, porque la única sala de la planta 1 está reservada
- AND `libres --planta 2 14:00-16:00` da `Sur`, igual que con la opción detrás de la franja

#### ADDED — Libres con una planta que no coincide con ninguna sala

- GIVEN las salas Norte (planta 1) y Sur (planta 2), sin reservas en `14:00-16:00`
- WHEN se ejecuta `libres 14:00-16:00 --planta 9`
- THEN la salida es la cadena vacía, sin aviso (lo mismo que devuelve hoy `run('libres', ...)` cuando no queda ninguna sala libre)
- AND `libres 14:00-16:00 --planta` (sin valor) da una línea vacía
- AND `libres 14:00-16:00 --planta 02` da una línea vacía, porque la planta se compara como texto
- AND `libres --planta 14:00-16:00` da una línea vacía: `14:00-16:00` se lee como la planta y no queda franja

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: las salas y su planta, en memoria, en `src/app.js` (la constitución no fija reglas de producto; es lo que hay hoy).
- **Idioma de los nombres**: castellano (`libres`, `--planta`).
- **Límites**: sin rango ni validación del número de planta (`9`, `-1` y `02` son valores posibles que no coinciden con ninguna sala); la deuda «sin validación del formato» de `debt.md` cubre el resto.
- **Avisos**: ninguno; una planta sin salas libres no avisa, devuelve una línea vacía.
- **Regla ante conflicto**: no aplica.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
