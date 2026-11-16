---
id: 20261112-155842-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` lista todas las salas libres de la franja. Con esta feature, `libres 10:00-12:00 --planta 2` enseña solo las de la planta 2 (`Sur`), y sin `--planta` sigue enseñando todas, como ahora. Para poder filtrar, cada sala pasa a tener una planta (Norte, planta 1; Sur, planta 2: la he puesto yo). Por dentro, la lista de salas pasa de nombres sueltos a nombres con planta y `libres` filtra por ella.

Validación: dev-lead — es lo que ve y teclea quien usa la herramienta; lo observa una persona.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva, dato nuevo (la planta de cada sala, en memoria) · tamaño: ~20 líneas en 3 ficheros
- Técnica y dominio juntos (sonnet): si el delta cubre el comportamiento actual sin `--planta` y los bordes del flag (valor ausente, planta sin salas) con datos concretos (señal: capacidad nueva + dato nuevo)
- Mínimo razonable: un solo revisor ya es el mínimo; sin él quedan sin mirar los bordes del flag, que es donde se equivocaría una implementación a ojo

1. Planta de cada sala: Norte, planta 1; Sur, planta 2 — hoy las salas no tienen planta y nadie dijo cuál es cuál; es dato provisional del código y de los tests, que el dev-lead confirma o corrige en la validación; si cambian, cambian a la vez `src/app.js`, los tests y los escenarios de abajo.
2. Sintaxis: `libres <franja> --planta <n>`, con la franja primero como hoy y el valor de planta en el argumento siguiente (`--planta=2` no se admite, decisión 5) — es la forma de `reservar Norte --cada-semana`, que va con la opción suelta.
3. La planta se compara como texto exacto, sin recortar ni normalizar: `--planta 2` casa con la planta `2`; `--planta 02` o `--planta x` no casan con ninguna — evita decidir un formato numérico.
4. Una planta sin salas libres (ocupadas o inexistente) devuelve la salida vacía, como hoy una franja sin salas libres — mantiene el comportamiento actual de «nada libre». Sin aviso para una planta que no existe: validarlo exige una lista de plantas que no hay y está fuera del Scope; se rechaza.
5. `--planta` sin valor devuelve `falta la planta: usa --planta <planta>` en vez de listar todas o fallar — un filtro mal tecleado no debe parecer «todas libres». «Sin valor» = `--planta` es el último argumento, el siguiente es la cadena vacía o empieza por `--`. `--planta` puede ir en cualquier posición tras la franja; se mira solo su primera aparición (`--planta 2 --planta 1` vale 2; `--planta --planta 2` da el mensaje). `--planta=2` tampoco se admite y da el mismo mensaje. Cualquier otro argumento sobrante se ignora, como hoy.
5b. La franja es siempre el primer argumento. Si empieza por `--` (p. ej. `libres --planta 2`), la respuesta es `falta la franja: usa libres <franja>` — así un orden invertido no parece «todas libres»; el resto de franjas sigue sin validarse.
5c. «Planta» se añade a la terminología de `PRODUCT.md` (hallazgo de la review) y `rooms` y `freeRooms` conservan su nombre: son identificadores internos y el artículo 4 de la constitución cubre la interfaz y los documentos, no el código.
6. Capacidad nueva `room-availability` (no hay ninguna hoy): recoge el comportamiento actual de `libres` y el filtro, porque el filtro lo modifica y no hay dónde vivir si no.
7. Enfoque: A (sala como objeto `{ name, floor }` y filtro en `freeRooms`), frente a B (mapa aparte nombre→planta) y C (planta como prefijo del nombre) (ver Approach).
8. Fuera de alcance: el día de la reserva sigue sin entrar en `libres` (hoy solo compara franja) y `reservar` no se toca — es otro comportamiento, no de este pedido.
- Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` acepta el delta (4 requisitos añadidos y las 5 reglas, `room-availability.md` creado); `git grep` de `libres`, `rooms`, `freeRooms` y `0012` volcado en la tabla de arriba; sin literales repetidos que cambien de valor.
- Política de modelos: revisor de spec en sonnet (`sdd-kit:effort-medium`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (ver el plan) · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** (Crítico 1) — «sin valor» y mensaje con `<número>` → criterio de «sin valor» fijado, mensaje con `<planta>`, escenarios con `--planta --otra` y `--planta=2` (decisión 5)
- **Aceptado** (2) — GIVEN de «Libres sin filtro» sin datos → salas y reserva fijadas y AND «igual que antes»
- **Rechazado** (3) — fixture con tres salas → las salas son dos y añadir una cambia la salida de `libres` sin `--planta`; los cuatro casos de planta 1 y 2 en dos franjas ya distinguen filtrar por planta de filtrar por posición
- **Aceptado** (4) — planta inexistente y ocupada mezcladas → escenarios separados y `--planta 02`
- **Aceptado** (5) — `=`, repetido, orden invertido → decisiones 5 y 5b
- **Aceptado** (6) — Límites y conflicto «no aplica» → rellenos; constitución art. 4 citado
- **Aceptado** (7) — frontera Scope → solo se comprueba la presencia del valor
- **Aceptado** (8) — terminología → `PRODUCT.md` entra en el Scope (decisión 5c)
- **Aceptado** (9) — dato de planta provisional → decisión 1
- **Aceptado** (10) — dos frases de paralelismo → una

Segunda ronda (sin tercera):

- **Aceptado** (Crítico 1) — posición de `--planta` → cualquier posición tras la franja; escenario `--otra --planta 2` (decisión 5)
- **Aceptado** (Crítico 2) — `--planta` repetido sin escenario → escenarios `--planta 2 --planta 1` y `--planta --planta 2`
- **Aceptado** (3) — orden invertido sin salida fijada → `falta la franja: usa libres <franja>` y escenario «Franja ausente» (decisión 5b)
- **Aceptado** (4) — cadena vacía → cuenta como ausente y entra en el escenario
- **Rechazado** (5) — aviso para planta inexistente → exige una lista de plantas, fuera del Scope; justificado en la decisión 4
- **Aceptado** (6) — AND no verificable → sustituido por el formato `Norte, Sur`, y el GIVEN dice que el día no interviene
- **Rechazado** (7) — escenario de formato aparte → ya lo fija el AND con `Norte, Sur` separadas por coma y espacio
- **Aceptado** (8) — Límites y Avisos → completados
- **Aceptado** (9) — «2 ficheros» → 3, y excepción de idioma de `rooms` justificada (decisión 5c)
- **Aceptado** (10) — plantas provisionales → decisión 1 dice qué cambia si se corrigen

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil delegate — «Perfil delegate»
- Spec aprobada por delegación, con paro antes de implementar — «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` enseña todas las salas libres, y quien busca sitio en una planta tiene que ignorar a ojo las demás. Se quiere acotar la lista a una planta con `--planta`. Éxito: `libres 10:00-12:00 --planta 2` solo enseña salas de la planta 2 y `libres 10:00-12:00` enseña lo de siempre. Fracaso aunque funcione: que sin `--planta` la salida cambie, o que un `--planta` mal tecleado parezca «todas libres».

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta de cada sala en `src/app.js`; sus tests en `test/app.test.js`; el término «Planta» en `PRODUCT.md`; comprobar que hay valor tras `--planta` (no que la planta exista ni su formato).
- No entra: el día en `libres`, `reservar`, `cancelar`, `anular`; ficheros de configuración de salas; validar la franja más allá de que no empiece por `--` (decisión 5b) o que la planta exista.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms = ['Norte', 'Sur']` pasa a objetos con planta | `src/app.js:2`, `src/app.js:6` (`freeRooms`) | Scope y decisión 7: es interno, la salida de `libres` sin `--planta` no cambia |
| `freeRooms(slot)` gana el parámetro de planta | `src/app.js:5`, `src/app.js:28` | Scope, delta `ADDED — Libres filtra por planta` |

- Filas que implementa: 0012 (sin fila en `ROADMAP.md`; id reservado con `sdd id next --reserve`) → nada: comprobado con `git grep -n "0012" -- . ':!.docs/sdd/specs'`
- Texto vivo que nombra `libres`: `CHANGELOG.md:10` (entrada de la 0006, histórica; la nueva entrada la escribe el corte de la release) y `test/app.test.js:5` (se mantiene tal cual: es el escenario «sin planta»).

## Approach

- A: sala como objeto `{ name, floor }`, `freeRooms(slot, floor)` filtra por planta — un cambio pequeño y los dos datos viajan juntos.
- B: mapa aparte `floorOf = { Norte: '1', Sur: '2' }` — deja `rooms` intacto pero hay dos fuentes que mantener sincronizadas.
- C: planta como prefijo del nombre (`1-Norte`) — cambia los nombres que ven `reservar` y `cancelar`; descartado por tocar lo que no se pidió.
- Elegido: A — con una sola fuente para el nombre y la planta, y sin tocar lo que muestran los demás comandos. Lo eligió el agente por delegación («Apruebo la spec por delegación…»).

Parseo: `libres` toma la franja como primer argumento, como hoy; si `--planta` aparece, el argumento siguiente es la planta. La salida sigue siendo los nombres separados por `, `.

## Dónde se prueba

- `libres` con y sin `--planta`, y los bordes (planta sin salas libres, valor ausente): por `run('libres', [...])`, como los tests actuales de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: planta — nivel del edificio donde está una sala; texto, no número (decisión 3)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin filtro

- GIVEN las salas Norte y Sur, y la única reserva activa en memoria: Norte, lunes, `10:00-12:00` (el día no interviene en `libres`)
- WHEN se pide `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND `libres 14:00-16:00` da `Norte, Sur`, separadas por coma y espacio

#### ADDED — Libres filtra por planta

- GIVEN Norte en planta 1, Sur en planta 2 (dato provisional), y la reserva activa de Norte en `10:00-12:00`
- WHEN se pide `libres 14:00-16:00 --planta 1`
- THEN la salida es `Norte`
- AND `libres 14:00-16:00 --planta 2` da `Sur`
- AND `libres 10:00-12:00 --planta 1` da la salida vacía, porque Norte está reservada
- AND `libres 10:00-12:00 --planta 2` da `Sur`
- AND `libres 14:00-16:00 --otra --planta 2` da `Sur`
- AND con `--planta` repetido vale el primero: `libres 14:00-16:00 --planta 2 --planta 1` da `Sur`

#### ADDED — Planta inexistente

- GIVEN las salas de las plantas 1 y 2
- WHEN se pide `libres 14:00-16:00 --planta 3`, `--planta x` o `--planta 02`
- THEN la salida es vacía, porque la planta se compara como texto exacto

#### ADDED — Planta sin valor

- GIVEN cualquier estado
- WHEN se pide `libres 14:00-16:00 --planta`, `libres 14:00-16:00 --planta --otra`, `libres 14:00-16:00 --planta=2`, `libres 14:00-16:00 --planta ""` o `libres 14:00-16:00 --planta --planta 2`
- THEN la salida es `falta la planta: usa --planta <planta>`, sin listar salas

#### ADDED — Franja ausente

- GIVEN cualquier estado
- WHEN se pide `libres --planta 2`
- THEN la salida es `falta la franja: usa libres <franja>`, sin listar salas

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, en `src/app.js` (cada sala con su planta)
- **Idioma de los nombres**: castellano (`--planta`, mensajes), según el artículo 4 de la constitución
- **Límites**: el valor de planta se compara como texto exacto, sin recortar ni normalizar; sin máximo de plantas ni de longitud
- **Avisos**: `falta la planta: usa --planta <planta>` si `--planta` no lleva valor; `falta la franja: usa libres <franja>` si el primer argumento empieza por `--`
- **Regla ante conflicto**: un valor vacío o que empieza por `--` cuenta como ausente; con `--planta` repetido vale el primero

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada: «Apruebo la spec por delegación, nos vemos en la validación: escribe la spec y el plan y para antes de implementar» |
