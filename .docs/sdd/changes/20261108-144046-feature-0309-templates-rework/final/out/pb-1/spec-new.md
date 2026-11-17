---
id: 20261109-095041-feature-0012-informes
feature: 0012
title: Informes de ocupación de las salas
mode: full
profile: delegate
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de las salas

🦆 Hoy no hay forma de ver cuánto se usan las salas. Con `informes` verás, en una tabla de texto, cuántas reservas tiene cada sala (`Norte | 3`, `Sur | 0`), cuáles caen en cada día de la semana, qué franjas se piden más y qué salas nadie ha reservado. `informes --sala Norte` hace lo mismo solo con esa sala. Por dentro son funciones puras que reciben la lista de reservas, así que se prueban con datos inventados.

Validación: dev-lead — la salida la lee una persona y su formato (columnas, títulos, orden) solo se juzga viéndola.

## Capacidades

- Nuevas: `booking-reports` — los informes de ocupación de las salas que escribe `informes`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-reports`) · tamaño: ~170 líneas en 3 ficheros (`src/app.js`, `test/informes.test.js`, la capacidad)
- Dominio (sonnet): si los THEN de las cuatro vistas y de `--sala` salen de las decisiones 3–9, y si las cinco reglas de `booking-reports` están declaradas (señal: capacidad nueva)
- Técnica (sonnet): si la salida literal de cada escenario (columnas, relleno, orden, empates) sale a mano de las decisiones 4–7, y qué toca `run` (señal: capacidad nueva)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin cubrir el reparto de lentes: lo que uno de los dos no mire con la otra lente (p. ej. los literales de la tabla)

1. Capacidad nueva `booking-reports` (inglés, kebab-case): no existe ninguna capacidad y `informes` es un sustantivo del dominio propio, no un ticket.
2. Enfoque: funciones puras con `reservas` y `salas` por parámetro, frente a leer el estado del módulo o a un fichero nuevo `src/informes.js` (ver Approach).
3. «Reserva» en los cuatro informes son solo las `active`: las `cancelled` y `voided` no cuentan (una cancelada ya no ocupa la sala).
4. Los literales de las vistas: títulos «Ocupación por sala», «Ocupación por día de la semana», «Franjas más reservadas», «Salas sin reservas»; cabeceras `sala`, `día`, `franja`, `reservas`.
5. Orden: salas en el orden en que están declaradas (Norte, Sur); días lun, mar, mié, jue, vie, sáb, dom, **los siete aunque tengan 0, también con `--sala`**; franjas por reservas descendente y, en empate, por franja ascendente comparando cadenas (`<`, sin localización: `9:00-10:00` queda detrás de `10:00-12:00` porque la franja no se valida, deuda del roadmap); sin tope de filas.
6. Una reserva con un día fuera de esos siete cuenta en las demás vistas y en ninguna fila de la vista por día: el día no se valida hoy (deuda del roadmap «Sin validación del formato de franja horaria»). Vocabulario de días: `sin medir` — en el código solo aparecen `lun` y `mar` (los tests) y no hay hoy ninguna orden que cree reservas; escribo `mié` y `sáb` con tilde porque el castellano las lleva, y si el futuro `reservar` guardara `mie` o `sab` caerían en este caso.
7. Formato de la tabla: cabecera y filas con las columnas separadas por ` | `, cada celda rellena con espacios a la derecha hasta la más ancha de su columna (la última sin relleno); sin línea de guiones; una línea en blanco entre vistas.
8. «Salas sin reservas» sin ninguna fila que enseñar escribe `ninguna`.
9. «Sin reservas» se aplica **tras** filtrar: si no queda ninguna reserva activa (en total, o de la sala pedida) las cuatro vistas, cada una con su título, dicen `sin reservas` en vez de la tabla. Así `--sala Sur`, con Sur sin reservas, da «sin reservas» en las cuatro y no la lista «Salas sin reservas: Sur».
10. `--sala` con una sala que no existe escribe solo `sala desconocida: Oeste`; `--sala` sin valor (al final, o con `""`), solo `falta el nombre de la sala`. El valor es el parámetro que sigue a `--sala`, sea cual sea (`--sala --x` da `sala desconocida: --x`). El nombre se compara exacto (`Norte`, no `norte`).
11. Orden de las comprobaciones: primero `--sala` (falta de nombre, sala desconocida), después se filtra y por último «sin reservas». Así `informes --sala Oeste`, aunque no haya reservas, da `sala desconocida: Oeste`. `informes` no admite más argumentos; cualquier otro se ignora (como hacen hoy los demás comandos).
12. Contrato: `informes(reservas, salas, sala)` devuelve una sola cadena, las vistas unidas por una línea en blanco; `run('informes', params)` busca `--sala` en cualquier posición de `params`, y la rama `informes` va antes de la salida final `'salas'`. Los ayudantes `contar` y de tabla son internos.
13. Reparto en 5 tasks, dentro de lo dicho con el dev-lead: la Task 1 (ocupación por sala) crea también el ayudante de tabla, «sin reservas», la función `informes` y el cableado de `run`; las Tasks 2–4 son las otras tres vistas; la Task 5 es `--sala` con sus dos avisos.
14. Tests: en `test/informes.test.js`, que no llama a `cancelar` ni toca el estado del módulo (`node --test` ejecuta cada fichero en su proceso). El gate de cierre `node --test && node scripts/lint.mjs` queda en verde (sin tabuladores en `src/app.js`).
15. Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` añade los requisitos y las 5 reglas de `booking-reports`, y `capability check` da «Capacidades válidas: 1». Los datos de los escenarios son de prueba; Norte y Sur son las salas ya declaradas en el producto.

### Hallazgos de la review

- **Aceptado** — Con `--sala` la vista por día debía decir si siguen los siete días → el THEN de «Filtrar» lista los siete y la decisión 5 lo dice (dominio 1, técnica 1).
- **Aceptado** — «Salas sin reservas» no fijaba cabecera ni dónde salen `ninguna` y `sin reservas` → el delta escribe las líneas exactas (dominio 3, técnica 2).
- **Aceptado** — Los AND de empate y de `ninguna` no traían reservas completas → fixtures literales en el delta (dominio 6, técnica 3).
- **Aceptado** — Decisiones 3, 6, 10 y 11 sin escenario → escenarios nuevos «Reservas anuladas y días fuera de la semana» y «Nombre de sala exacto», más la precedencia (dominio 4 y 7, técnica 4 y 6).
- **Aceptado** — `run('informes')` con las reservas del módulo sin THEN, y fichero de test ambiguo → escenario «Informes con las reservas del sistema» y decisión 14 (técnica 5).
- **Aceptado** — Reparto de 5 tasks sin dueño para ayudantes y avisos → decisión 13 (dominio 5, técnica 10).
- **Aceptado** — Vocabulario de días y comparación de franjas → decisiones 5 y 6, con `sin medir` (técnica 7 y 8).
- **Aceptado** — Gate con lint y orden de la rama de `run` → decisiones 12 y 14 (técnica 9).
- **Aceptado** — Idioma, conflicto y límites de las reglas, y la frase de ✋ 15 → reglas reescritas (dominio 2, 8, 9 y 10).
- **Aceptado** — Contrato de `--sala` y de la cadena de retorno fuera de ✋ → decisiones 10–12 (técnica 6).

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas»
- La opción `--sala` filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy el único dato de ocupación es `libres <franja>`; no se ve qué salas, días o franjas se usan más ni cuáles se desaprovechan. Con `informes` el responsable de las salas decide a la vista de una tabla. Es un éxito si, con las reservas de los escenarios de abajo, cada vista sale exactamente como dice su THEN. Fracasaría, aunque funcionara, si contara reservas canceladas o anuladas como ocupación, o si `--sala` dejara una vista sin filtrar.

## Scope

- Entra: el comando `informes` en `src/app.js` con las cuatro vistas, la opción `--sala`, los avisos de las decisiones 8–11, sus tests en `test/informes.test.js`, el gate `node --test && node scripts/lint.mjs` en verde y la capacidad `booking-reports`.
- No entra: otros formatos de salida (JSON, CSV), rango de fechas, tope de filas, validar el formato del día o de la franja, filtrar por día o franja, cambiar `libres`, `reservar`, `cancelar` o `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | `informes` es un comando nuevo; `run` gana una rama y la rama final `'salas'` no cambia |

- Filas que implementa: nada: comprobado con `git grep -niE "informes?|0012|ocupaci" -- . ':!.docs/sdd/specs'` (sin resultados); la 0012 está reservada sin fila en el roadmap.

## Approach

- A. Funciones puras exportadas, `informes(reservas, salas, sala)` y una por vista, en `src/app.js`; `run('informes', params)` solo les pasa los datos del módulo. Cuesta una firma con datos por parámetro, distinta de `freeRooms`, que lee el módulo; a cambio cada vista se prueba con reservas inventadas sin tocar el estado compartido.
- B. Leer `bookings` y `rooms` del módulo, como `freeRooms`. Cuesta que los tests solo vean la reserva `Norte lun 10:00-12:00`, y `cancelar` es la única forma de mutarla (la reserva semanal de `reservar` no crea nada): no se pueden probar ni el orden ni los empates.
- C. Un fichero nuevo `src/informes.js`. Cuesta romper «Un solo fichero de entrada: `src/app.js`» sin motivo: el cambio es de ~60 líneas.
- Elegido: A — es la única que permite probar las cuatro vistas con datos concretos, y no toca nada de lo existente.

Fija además: las vistas devuelven texto (una cadena), `informes` las une con una línea en blanco; hay un ayudante de tabla compartido (decisión 7) y un ayudante `contar` (agrupa y cuenta reservas activas); `run` lee `--sala` de `params` (`['--sala', 'Norte']`, en cualquier posición).

## Dónde se prueba

- Las cuatro vistas, el orden, los empates, el filtro y los avisos: llamando a `informes(reservas, salas, sala)` con reservas inventadas, en `test/informes.test.js`, con `node:test` como los tests actuales.
- El comando completo: `run('informes', [])` y `run('informes', ['--sala', 'Sur'])` con las reservas del módulo (`Norte lun 10:00-12:00`), también en `test/informes.test.js` y sin mutar el estado (escenario «Informes con las reservas del sistema»). El estado vacío se prueba con `informes([], ['Norte', 'Sur'])`.
- La salida real a la vista, en una validación del dev-lead en la terminal: `node src/app.js informes`.

## Términos y ADR

- Términos resueltos: ocupación — nº de reservas activas de una sala, día o franja | ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-reports`

#### ADDED — Informe de ocupación por sala

- GIVEN las salas Norte y Sur y estas reservas: `Norte lun 10:00-12:00 active`, `Norte lun 14:00-16:00 active`, `Norte mar 10:00-12:00 active`, `Sur mar 10:00-12:00 cancelled`
- WHEN se pide `informes`
- THEN la vista «Ocupación por sala» tiene las filas `Norte | 3` y `Sur | 0`, en ese orden
- AND la reserva cancelada de Sur no cuenta

#### ADDED — Informe de ocupación por día de la semana

- GIVEN las mismas reservas
- WHEN se pide `informes`
- THEN la vista «Ocupación por día de la semana» tiene siete filas: `lun | 2`, `mar | 1`, `mié | 0`, `jue | 0`, `vie | 0`, `sáb | 0` y `dom | 0`, en ese orden

#### ADDED — Informe de franjas más reservadas

- GIVEN las mismas reservas
- WHEN se pide `informes`
- THEN la vista «Franjas más reservadas» tiene las filas `10:00-12:00 | 2` y `14:00-16:00 | 1`
- AND con solo `Norte lun 14:00-16:00 active` y `Sur lun 09:00-10:00 active` (insertadas en ese orden), las filas son `09:00-10:00 | 1` y `14:00-16:00 | 1`: en empate, por franja ascendente

#### ADDED — Informe de salas sin reservas

- GIVEN las mismas reservas
- WHEN se pide `informes`
- THEN la vista «Salas sin reservas» sale como las líneas `Salas sin reservas`, `sala`, `Sur`
- AND con solo `Norte lun 09:00-10:00 active` y `Sur mar 14:00-16:00 active`, sale como las líneas `Salas sin reservas`, `ninguna`

#### ADDED — Sin reservas

- GIVEN ninguna reserva activa: ninguna reserva, o solo `Norte lun 10:00-12:00 cancelled`
- WHEN se pide `informes`
- THEN cada una de las cuatro vistas, con su título en una línea y `sin reservas` en la siguiente, en lugar de la tabla: `Ocupación por sala`, `sin reservas`, línea en blanco, `Ocupación por día de la semana`, `sin reservas`, y así las dos últimas

#### ADDED — Filtrar los informes por sala

- GIVEN las reservas de ejemplo y la sala Norte
- WHEN se pide `informes --sala Norte`
- THEN «Ocupación por sala» tiene solo la fila `Norte | 3`; «Ocupación por día de la semana» tiene las siete filas, `lun | 2`, `mar | 1` y las otras cinco a `0`; «Franjas más reservadas», solo `10:00-12:00 | 2` y `14:00-16:00 | 1`; «Salas sin reservas», `ninguna`
- AND con `informes --sala Sur`, Sur sin reservas activas, las cuatro vistas dicen `sin reservas`
- AND `informes x --sala Norte` da lo mismo

#### ADDED — Sala desconocida o sin nombre

- GIVEN las salas Norte y Sur
- WHEN se pide `informes --sala Oeste`
- THEN la salida es `sala desconocida: Oeste` y ninguna vista
- AND con `informes --sala` la salida es `falta el nombre de la sala`
- AND `informes --sala norte` da `sala desconocida: norte` (el nombre se compara exacto)
- AND `informes --sala Oeste` sin ninguna reserva activa da `sala desconocida: Oeste`, no `sin reservas`: se valida `--sala` antes de filtrar

#### ADDED — Formato de tabla

- GIVEN las reservas de «Ocupación por sala»
- WHEN se pide `informes`
- THEN la vista «Ocupación por sala» sale como las líneas `Ocupación por sala`, `sala  | reservas`, `Norte | 3`, `Sur   | 0`
- AND entre una vista y la siguiente hay una línea en blanco

#### ADDED — Reservas anuladas y días fuera de la semana

- GIVEN `Norte lun 10:00-12:00 voided`, `Norte lun 14:00-16:00 active` y `Sur xyz 10:00-12:00 active` (`xyz` no es un día de la semana)
- WHEN se pide `informes`
- THEN la anulada no cuenta: «Ocupación por sala» tiene `Norte | 1` y `Sur | 1`
- AND la reserva del día `xyz` cuenta en las salas y en las franjas (`10:00-12:00 | 1`, `14:00-16:00 | 1`) y en ninguna de las siete filas de «Ocupación por día de la semana», donde `lun` es `1` y las otras seis, `0`

#### ADDED — Informes con las reservas del sistema

- GIVEN las reservas con las que arranca el sistema: `Norte lun 10:00-12:00 active`
- WHEN se pide `informes`
- THEN «Ocupación por sala» tiene `Norte | 1` y `Sur | 0`, «Ocupación por día de la semana» tiene `lun | 1` y las otras seis a `0`, «Franjas más reservadas» tiene `10:00-12:00 | 1` y «Salas sin reservas» tiene `Sur`
- AND `informes --sala Sur` da las cuatro vistas con `sin reservas`

#### Reglas de la capacidad — booking-reports

- **Dónde viven los datos**: en memoria, las reservas del proceso (`operations.md`)
- **Idioma de los nombres**: castellano en el comando, la opción, los títulos, las cabeceras y los avisos; los identificadores del código (`bookings`, `rooms`, los estados `active`, `cancelled`, `voided`) y el nombre de esta capacidad quedan en inglés, como están
- **Límites**: ninguno; sin tope de filas ni de longitud del nombre, y el ancho de cada columna crece con su celda más larga
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <nombre>`, `falta el nombre de la sala`
- **Regla ante conflicto**: no aplica: el informe solo lee, no hay escrituras que arbitrar

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
