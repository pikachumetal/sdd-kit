---
id: 20261111-190943-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy `salas libres 10:00-12:00` lista todas las salas libres en esa franja, estén en la planta que estén. Con esta feature, `salas libres 10:00-12:00 --planta 1` lista solo las libres de la planta 1 (p. ej. `Norte`), y sin `--planta` todo sigue igual: lista todas (`Norte, Sur`). Para que filtrar tenga sentido, cada sala pasa a tener una planta. Por dentro, `rooms` pasa de nombres a `{ name, floor }` y `libres` aparta `--planta <n>` de los argumentos antes de leer la franja.

Validación: dev-lead — es un comando que usa una persona desde la terminal y el resultado se ve ejecutándolo.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva · tamaño: ~35 líneas en 3 ficheros (`src/app.js`, `test/app.test.js`, `capabilities/room-availability.md`)
- Dominio y técnica, un solo revisor (sonnet): si el THEN de `--planta 9` (planta sin salas → vacío) se distingue de un filtro roto que lo ignora, y si los valores no válidos (`abc`, `0`, `1.5`, `14:00-16:00`) tienen escenario (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si la capacidad nueva recoge bien el comportamiento ya existente de `libres`

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario mezclaba franjas y casos vacíos → separado en escenarios con su propio GIVEN/WHEN/THEN, con `--planta 9` aparte.
- **Aceptado** — el requisito vigente se redactaba de memoria, con un AND doble → la decisión 7 lo declara supuesto, con su origen; el AND se divide en escenarios y se añade «ninguna libre → vacío».
- **Aceptado** — entero sin definir, repetida y combinaciones → decisiones 3, 5 y 6 y sus escenarios.
- **Aceptado** — precedencia y código de salida → decisión 5.
- **Aceptado en parte** — regresión de `salas`/`reservar`: la red son los tests actuales (decisión 8). No añado escenario de `salas` porque hoy devuelve el literal `salas` y no lista nada, y no quiero fijar eso. `rooms` solo aparece en `src/app.js:2` y `:6`.
- **Rechazado** — valores de planta y «punto 8 no verificable»: la planta inventada ya está en la decisión 1 para que la cambies, y la fusión sí la corrí (decisión 11).
- **Aceptado** — Límites, conflicto e idioma → Reglas de la capacidad corregidas; identificadores → decisión 9.
- **Rechazado** — mover A/B/C a decisiones con el dev-lead: el enfoque lo elegí yo (decisión 10). Aprobador TBD: se rellena al aprobar.

Segunda ronda (sonnet, sin Críticos):

- **Aceptado** — `0`, `1.5` y `01` agrupados → tres escenarios, con `01` como el que descarta un `parseInt`.
- **Aceptado** — el token tras `--planta` y la repetida con valor no válido → decisión 6, Reglas y tres escenarios (`--planta abc --planta 2`, `--planta 1 --planta`, `--planta --planta 1`).
- **Aceptado** — «salida vacía» sin fijar → decisión 4: cadena vacía `''`.
- **Aceptado en parte** — requisito vigente como supuesto mío: ya está declarado en la decisión 7, que es lo que valida el gate; no lo repito dentro del requisito, porque el texto de la capacidad no lleva procedencia.
- **Aceptado** — `PRODUCT.md`: lo edita `sdd-archive` al cerrar y queda fuera del tamaño (~35 líneas en 3 ficheros).
- **Aceptado** — rondas: un revisor y dos rondas (política de modelos ya alineada).

1. **Dato de planta (el hueco principal)**: hoy las salas no tienen planta en ningún sitio. Propongo `Norte` en planta `1` y `Sur` en planta `2`: son valores inventados por mí, **cámbialos por los reales**. Con las dos en la misma planta el filtro no se vería.
2. **Forma de la opción**: `--planta <n>` con un espacio, en cualquier posición respecto de la franja (`libres --planta 1 10:00-12:00` = `libres 10:00-12:00 --planta 1`). No admito `--planta=1`.
3. **Valor válido**: un entero positivo sin ceros a la izquierda (`^[1-9][0-9]*$`), sin tope superior. Todo lo demás (`abc`, `0`, `1.5`, `01`, y una franja como `14:00-16:00` que ocupe el sitio del valor) es no válido.
4. **Planta sin salas libres o sin salas** (`--planta 9`, o la planta 1 con `Norte` ocupada): «salida vacía» es la cadena vacía `''`, que es lo que `run('libres', …)` devuelve hoy cuando no hay ninguna libre. No invento un mensaje nuevo.
5. **Avisos de valor no válido**: `planta no válida: abc` (con el valor tal cual) y, sin valor, `planta no válida: falta el valor`. Texto mío, en castellano. Se imprimen en la salida estándar con código de salida 0, como los demás avisos del programa (`sin reserva Norte lun`). Si además falta la franja, manda el aviso de planta.
6. **`--planta` repetida**: gana la última (`--planta 1 --planta 2` = planta 2), pero se valida cada aparición: la primera no válida da el aviso. El token que sigue a `--planta` es siempre su valor, aunque empiece por `--`. Mío; la alternativa era error por repetición.
7. **Capacidad nueva `room-availability`** (slug en inglés, regla 1 de la plantilla de capacidades), con dos requisitos: el ya existente «Listado de salas libres por franja» (de la 0006; lo redacto desde el test `libres excluye la sala reservada en la franja` y el código, y es un supuesto mío que describe fielmente lo vigente) y el nuevo «Filtrar libres por planta».
8. **Sin tocar** `reservar`, `cancelar`, `anular` ni `salas`: el filtro es solo de `libres`, y sus tests actuales (`test/app.test.js`, `test/cancel.test.js`) son la red de no regresión. `salas` no muestra plantas.
9. **Identificadores**: `rooms` pasa a `{ name, floor }`, en inglés como el resto del código; el _Evitar_ de `PRODUCT.md` (room, floor) vale para el texto que ve la persona, no para identificadores.
10. **Enfoque**: A (apartar `--planta` en `run` y filtrar `freeRooms`) frente a B (analizador de opciones genérico) y C (comando nuevo `libres-planta`); ver Approach. Lo elijo yo; el dev-lead solo fijó el nombre de la opción.
11. **Pasada de coherencia**: delta probado en una copia de `.docs/sdd` con `sdd capability merge` → añade los dos requisitos y las cinco reglas de `room-availability.md`, sin rechazos (`check` solo avisa de que el fichero de la capacidad nueva aún no existe; lo crea la fusión al cerrar). `git grep` de `0012`, `planta`, `floor` y `rooms`: sin hits fuera de esta spec salvo `src/app.js:2` y `:6`.
- Política de modelos: revisor de la spec en sonnet (1, más una segunda ronda en sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `libres` devuelve todas las salas libres de la franja. Quien está en una planta quiere ver solo las de la suya. Éxito: `libres 10:00-12:00 --planta 1` devuelve solo las salas de la planta 1 libres a esa hora, y el uso actual (`libres 10:00-12:00`) devuelve exactamente lo mismo que hoy. Sería un fracaso que, sin `--planta`, cambiase la salida actual, o que `--planta 1` colara salas de otra planta.

## Scope

- Entra: asignar planta a cada sala · la opción `--planta <n>` en `libres` · el aviso de valor no válido · la capacidad `room-availability`.
- No entra: filtrar `salas` (el listado por defecto), `reservar`, `cancelar` o `anular` por planta · crear, renombrar o mover salas · filtrar por varias plantas a la vez · `--planta=1` · validar la franja horaria (está en la deuda técnica).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de `['Norte','Sur']` a objetos con planta | `src/app.js:2`, `src/app.js:6` (`freeRooms`); único uso de `rooms` (`git grep rooms`) | Scope: se implementa en la task 1; el resultado de `libres` sin `--planta` no cambia (escenarios del requisito 1) |

- Filas que implementa: nada: comprobado con `git grep -n "0012"; git grep -n -i "planta\|floor"` (sin hits fuera de esta spec).

## Approach

- A — apartar `--planta <n>` de los argumentos en `run` y pasar la planta a `freeRooms`: cambio pequeño en el único fichero de código, se prueba con `run('libres', …)`.
- B — un analizador de opciones genérico: sobra para una sola opción nueva; el proyecto no tiene dependencias y solo tiene otra opción, `--cada-semana`.
- C — comando aparte `libres-planta`: duplica `libres` y no es la opción que fijó el dev-lead.
- Elegido: A — es lo más pequeño que cumple «la opción se llama --planta».

Detalle: `run('libres', params)` quita `--planta` y su valor de `params`; el primer argumento restante es la franja, como hoy. Si `--planta` no aparece, el filtro no se aplica. La validación de la planta va antes de listar.

## Dónde se prueba

- Filtro por planta, sin filtro, valor no válido y posición de la opción: por `run('libres', [...])`, como el test actual `libres excluye la sala reservada en la franja` en `test/app.test.js`.
- Documento de la capacidad: `sdd capability check`.

## Términos y ADR

- Términos resueltos: **Planta** — el piso donde está una sala (entero positivo). _Evitar_: floor, piso. Se añadirá a `PRODUCT.md` al cerrar.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Listado de salas libres por franja

- GIVEN las salas Norte y Sur, y una reserva activa de Norte en `10:00-12:00`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN se lista `Sur`

- GIVEN las mismas salas y la misma reserva de Norte
- WHEN se ejecuta `libres 14:00-16:00`
- THEN se listan `Norte, Sur`

- GIVEN la reserva de Norte en `10:00-12:00` cancelada, y Sur reservada en `10:00-12:00`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN se lista `Norte`

- GIVEN Norte y Sur reservadas en `10:00-12:00`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es vacía

#### ADDED — Filtrar libres por planta

- GIVEN Norte en la planta 1, Sur en la planta 2, y una reserva activa de Norte en `10:00-12:00`
- WHEN se ejecuta `libres 14:00-16:00 --planta 1`
- THEN se lista `Norte`

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta 2`
- THEN se lista `Sur`

- GIVEN el mismo estado
- WHEN se ejecuta `libres --planta 2 14:00-16:00`
- THEN se lista `Sur` (la opción puede ir antes de la franja)

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00` (sin `--planta`)
- THEN se listan `Norte, Sur`

- GIVEN el mismo estado
- WHEN se ejecuta `libres 10:00-12:00 --planta 1`
- THEN la salida es vacía (Norte está ocupada, y no sale `Sur`: el filtro aparta las de otra planta)

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta 9`
- THEN la salida es vacía (y no `Norte, Sur`: el filtro no se ignora)

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta 1 --planta 2`
- THEN se lista `Sur` (gana la última)

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta abc`
- THEN responde `planta no válida: abc`

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta 0`
- THEN responde `planta no válida: 0`

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta 1.5`
- THEN responde `planta no válida: 1.5`

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta 01`
- THEN responde `planta no válida: 01` (un `parseInt` lo aceptaría: no vale)

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta abc --planta 2`
- THEN responde `planta no válida: abc` (se valida cada aparición)

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta 1 --planta`
- THEN responde `planta no válida: falta el valor`

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta --planta 1`
- THEN responde `planta no válida: --planta` (el token que sigue a `--planta` es siempre su valor)

- GIVEN el mismo estado
- WHEN se ejecuta `libres --planta 14:00-16:00`
- THEN responde `planta no válida: 14:00-16:00`

- GIVEN el mismo estado
- WHEN se ejecuta `libres 14:00-16:00 --planta` (sin valor)
- THEN responde `planta no válida: falta el valor`

- GIVEN el mismo estado
- WHEN se ejecuta `libres --planta abc` (sin franja)
- THEN responde `planta no válida: abc`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en `rooms` de `src/app.js`, en memoria (no hay base de datos, `operations.md`); cada sala lleva nombre y planta.
- **Idioma de los nombres**: castellano en lo que ve la persona (constitución, art. 4: texto de la interfaz); los identificadores de código, en inglés como los actuales.
- **Límites**: planta = entero positivo sin ceros a la izquierda, sin tope superior.
- **Avisos**: `planta no válida: <valor>` · `planta no válida: falta el valor`; salida estándar, código 0.
- **Regla ante conflicto**: `--planta` repetida → se valida cada aparición y, si todas valen, gana la última; planta no válida y franja ausente → manda el aviso de planta.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
