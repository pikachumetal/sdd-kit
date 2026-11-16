---
id: 20261111-191356-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: approved
created: 2026-11-11
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-11
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres <franja>` lista todas las salas libres del edificio. Con este cambio, `libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2: con Norte (planta 1) reservada y Sur (planta 2) libre, sale `Sur`. Sin `--planta` el listado es el de siempre: `Norte, Sur` si ninguna está reservada. Para poder filtrar, cada sala pasa a tener una planta; en el código es un campo más de cada sala, y el filtro se aplica sobre el listado que ya existe.

Validación: dev-lead — la salida de `libres` la lee una persona en la terminal, y la planta de cada sala es un dato inventado por el agente que solo el dev-lead puede confirmar.

## Capacidades

- Nuevas: `room-availability` — qué salas hay libres en una franja y cómo se filtran.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-availability`), contrato público (la opción `--planta` y la salida de `libres` las usa quien teclea el comando), datos (cada sala gana el campo planta) · tamaño: ~25 líneas en 2 ficheros (`src/app.js`, tests)
- Dominio (sonnet): si los tres requisitos de `room-availability` dejan algún caso de `--planta` sin decir (planta sin salas, `--planta` antes de la franja) y si «sin `--planta`, todas» coincide con el `libres` de hoy (señal: capacidad nueva). Sonnet porque no hay roles ni reglas de negocio de permisos.
- Técnica (sonnet): si separar `--planta` sin romper `params[0]` como franja es viable en `run` y si el campo `planta` de `rooms` toca algo más que `freeRooms` (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar si hay casos de planta que la spec no cubre

1. Planta de cada sala: Norte = planta 1, Sur = planta 2 — nadie dijo en qué planta está cada sala; son datos de ejemplo para poder filtrar, cámbialos si no es así.
2. Valor de `--planta`: un entero positivo escrito en decimal, sin signo, sin ceros a la izquierda, sin decimales y sin tope superior (`2`, `10`; no `+2`, `02`, `1.5`, `2abc`, `1e1`), en la forma `--planta 2` con espacio — es la forma de opción suelta con espacio que ya reconoce `run` en `reservar --cada-semana` (`src/app.js:29`); `--planta=2` no se admite y da el error del punto 5.
3. Posición de la opción: `--planta <n>` puede ir antes o después de la franja; la franja es el primer argumento que no es la opción ni su valor. Argumentos de más se ignoran, como hoy. Sin franja (`libres --planta 2`) no se valida nada: hoy `libres` sin franja lista todas las salas (`Norte, Sur`, porque ninguna reserva tiene franja vacía) y con `--planta` lista las de esa planta.
4. Planta con salas pero todas ocupadas, o planta sin ninguna sala (`--planta 9`): la salida es la cadena vacía — no invento un texto nuevo para esos casos.
5. Texto de error: `planta no válida: usa un número entero positivo` cuando el valor de `--planta` no cumple el punto 2, falta (`--planta` al final), es la franja (`--planta 14:00-16:00`), la opción va repetida (`--planta 1 --planta 2`) o se escribe `--planta=2` — literal mío, en castellano por el Art. 4 de la constitution; el dev-lead lo confirma en la validación. El error sale por la salida normal con código 0, como `sin reserva Norte lun`; no hay stderr ni código distinto de 0. La planta se valida antes de listar; la franja sigue sin validarse, como hoy.
6. Capacidad nueva `room-availability` (slug en inglés, kebab-case) — el proyecto no tiene capacidades y `libres` no está documentado como comportamiento vivo; el delta recoge también el comportamiento sin `--planta` para fijarlo.
7. Término nuevo «Planta» en `PRODUCT.md`, y «Sala» pasa a decir que tiene una planta (lo escribe el cierre): nivel del edificio donde está la sala. Evitar: «piso», «floor». El `CHANGELOG.md` lo escribe el corte de la release; el proyecto no tiene ayuda de uso ni README que liste `libres`.
8. Enfoque: A (campo `planta` en cada sala) frente a B (mapa aparte de plantas) y C (deducir la planta del nombre) — ver Approach.
9. Las «Reglas de la capacidad» valen lo escrito abajo; la constitution no tiene «Reglas de producto» de las que sacarlas.
10. Sin escenario de «ninguna sala libre sin filtro»: el código no tiene forma de crear reservas (`reservar` devuelve un texto fijo) y el estado inicial solo tiene la de Norte; el caso «planta con salas, todas ocupadas» se cubre con `--planta 1` en `10:00-12:00`.
11. Repaso de coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: añade los tres requisitos y las cinco reglas de `room-availability.md`, sin rechazos. Sin ✋ de «sin medir».
12. Aislamiento de los tests: `node --test` corre cada fichero en su proceso, así que `test/libres.test.js` parte del estado inicial sin reset ni cambio de contrato.
- Política de modelos: revisores de la spec: dominio sonnet + técnica sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

**Aceptado** — Técnica 1 (Crítico): formas no enteras sin THEN → escenario «Planta no válida» con `1.5`, `2abc`, `02`, `+2`, `--planta=2` y regla de validación `/^[1-9]\d*$/` en el Approach.
**Aceptado** — Técnica 2 (Crítico): `--planta` sin valor frente a valor que es la franja → decisión 5 y THEN `libres --planta 14:00-16:00`; `libres --planta 2` sin franja, decisión 3 y THEN.
**Aceptado** — Técnica 4: `--planta` repetido y argumentos de más → decisiones 3 y 5, THEN del repetido.
**Aceptado** — Técnica 3: estado inicial no fijado → los GIVEN dicen «solo hay la reserva de Norte, lun, 10:00-12:00».
**Aceptado en parte** — Técnica 5: no se pueden crear reservas para el caso «todas ocupadas sin filtro» → decisión 10.
**Aceptado** — Técnica 6: `git grep -n "rooms"` da solo `src/app.js:2` y `src/app.js:6` → tabla de «Lo que se retira» corregida; `reservar` no lee `rooms`, no hace falta escenario de regresión.
**Aceptado** — Técnica 7: aislamiento → decisión 12.
**Aceptado** — Técnica 8 y Dominio 9: orden y separador, e idioma por tipo de nombre → Reglas de la capacidad.
**Aceptado** — Técnica 9 y Dominio 7: documentación y definición de «Sala» → decisión 7.
**Aceptado** — Dominio 3, 4, 5 y 6: límite preciso, texto «entero positivo», casos repetido y sin franja, orden de validación → decisiones 2, 3 y 5 y Reglas.
**Aceptado** — Dominio 1 y 2: el requisito sin filtro fija el comportamiento actual y su GIVEN no usa plantas → texto del requisito.
**Aceptado** — Dominio 10: el literal queda para confirmar en la validación → decisión 5.
**Ronda 2 — aceptado** — 1 (planta de varios dígitos sin escenario → `--planta 10`), 2 y 3 (sin franja y «como hoy» sin evidencia → decisiones 3, 4 y 10 y THEN con `libres` sin franja), 4 (canal del error → decisión 5: salida normal, código 0), 5 (definición de Planta sin la palabra evitada → decisión 7), 6 (justificación citada con `src/app.js:29` → decisión 2), 7 (conflicto de dos `--planta` → Reglas), 9 (el día de la reserva no influye → Scope y GIVEN sin «lun»).
**Ronda 2 — rechazado** — 8: el dev-lead de esta spec es el dueño del proyecto (PRODUCT.md: «La uso yo: la desarrollo, la pruebo y la despliego»); no hay otro rol que definir. 10: igual que Dominio 8, repetir los valores es deliberado; cambiar una planta es una búsqueda en la spec.
**Rechazado** — Dominio 8: repetir los valores Norte 1 / Sur 2 → se quedan en la decisión 1, el Scope y el Delta porque cada sitio los usa como dato concreto de un escenario.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- La spec se aprueba por delegación — «Apruebo la spec por delegación, nos vemos en la validación»
- Se escriben spec y plan y se para antes de implementar — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` devuelve todas las salas libres del edificio, y quien está en una planta tiene que descartar a ojo las de otras. El cambio es que `libres` acepte `--planta <n>` y enseñe solo las de esa planta. Éxito: `libres 10:00-12:00 --planta 2` devuelve solo salas de la planta 2, y `libres 10:00-12:00` devuelve lo mismo que hoy. Fracaso aunque «funcione»: que sin `--planta` cambie el listado, o que una planta mal escrita devuelva todas las salas como si no hubiera filtro.

## Scope

- Entra: la opción `--planta <n>` en `libres`; el campo planta de cada sala (Norte 1, Sur 2); el texto de error de planta no válida; la actualización de `PRODUCT.md` por el cierre; la capacidad `room-availability`.
- No entra: filtrar `reservar`, `cancelar` o `anular` por planta; que `libres` tenga en cuenta el día (hoy solo mira la franja, y no se toca: el día de la reserva de prueba no influye en la salida); ordenar o agrupar la salida por planta; listar las plantas que existen; altas de salas nuevas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. `rooms` pasa de lista de nombres a lista de salas con planta (interno) | `src/app.js:2` y `src/app.js:6` (`rooms`, único uso, en `freeRooms`) | Scope: se adapta en la Task 1; la salida no cambia |

- Filas que implementa: nada: comprobado con `git grep -n -i "planta\|libres" -- . ':!.docs/sdd/specs'` (solo `CHANGELOG.md:10`, `src/app.js:28` y `test/app.test.js:5-6`, que usan `libres` sin planta y siguen valiendo) y `git grep -n "rooms"` (solo `src/app.js:2` y `src/app.js:6`)

## Approach

- A — campo `planta` en cada sala (`rooms = [{ name: 'Norte', planta: 1 }, …]`) y `freeRooms(slot, planta)` con la planta opcional — cuesta cambiar la forma de `rooms`, que solo usa `freeRooms` en el fichero.
- B — un mapa aparte `plantas = { Norte: 1, Sur: 2 }` — no toca `rooms`, pero deja el dato de la sala en dos sitios y se desincroniza al añadir una sala.
- C — deducir la planta del nombre — no hay regla en los nombres (Norte, Sur): descartada.
- Elegido: A — un dato vive en un sitio y el filtro es una línea más en `freeRooms`.

Partes del cómo que fija A: `run('libres', params)` separa `--planta` y su valor de los demás argumentos y toma como franja el primer argumento restante; el valor se valida con `/^[1-9]\d*$/` sobre el texto completo antes de filtrar y, si no es válido, `run` devuelve el texto de error sin listar nada. Una opción que empieza por `--planta=` o una segunda `--planta` dan el mismo error.

## Dónde se prueba

- `libres` con y sin `--planta`, valor no válido y orden de los argumentos: llamando a `run('libres', [...])`, como los tests de `test/app.test.js` actuales; un fichero nuevo `test/libres.test.js`.

## Términos y ADR

- Términos resueltos: Planta — nivel del edificio donde está la sala; evitar «piso», «floor»
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin filtro de planta

> Fija el comportamiento que `libres` ya tiene hoy; no cambia con este cambio.

- GIVEN el estado inicial: solo hay una reserva, la de Norte en 10:00-12:00
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND `libres 14:00-16:00` da `Norte, Sur`
- AND `libres` sin franja da `Norte, Sur`

#### ADDED — Libres por planta

- GIVEN el estado inicial (solo hay una reserva, la de Norte en 10:00-12:00), con Norte en la planta 1 y Sur en la planta 2
- WHEN `libres 14:00-16:00 --planta 2`
- THEN la salida es `Sur`
- AND `libres 14:00-16:00 --planta 1` da `Norte`
- AND `libres --planta 2 14:00-16:00` da `Sur` (la opción puede ir antes de la franja)
- AND `libres --planta 2` da `Sur` y `libres --planta 1` da `Norte` (sin franja no se valida nada)
- AND `libres 14:00-16:00 --planta 10` da la cadena vacía, y no el error: 10 es un entero positivo válido
- AND `libres 10:00-12:00 --planta 1` da la cadena vacía, porque Norte está reservada
- AND `libres 14:00-16:00 --planta 9` da la cadena vacía, porque no hay salas en la planta 9

#### ADDED — Planta no válida

- GIVEN el estado inicial
- WHEN `libres 14:00-16:00` con cada una de estas opciones: `--planta` (sin valor), `--planta a`, `--planta 0`, `--planta -1`, `--planta 1.5`, `--planta 2abc`, `--planta 02`, `--planta +2`, `--planta=2`, `--planta 1 --planta 2`; y `libres --planta 14:00-16:00`
- THEN la salida es `planta no válida: usa un número entero positivo` y no se lista ninguna sala

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, en `src/app.js`: cada sala con su nombre y su planta (Norte 1, Sur 2)
- **Idioma de los nombres**: la interfaz (opción `--planta`, mensajes) en castellano; el campo de código `planta`, en castellano; el slug de la capacidad, en inglés
- **Límites**: la planta es un entero positivo en decimal, sin signo, sin ceros a la izquierda y sin tope superior; la salida lista las salas en el orden de `rooms`, separadas por `, `
- **Avisos**: `planta no válida: usa un número entero positivo` cuando `--planta` no trae un entero positivo, va repetida o se escribe `--planta=<n>`; la planta se valida antes de listar y la franja no se valida
- **Regla ante conflicto**: dos `--planta` en la misma llamada: error de planta no válida, no gana ninguna

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-11 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
