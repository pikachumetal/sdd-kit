---
id: 20261111-195716-feature-0012-informes
feature: 0012
title: Informes de ocupación de salas
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de salas

🦆 Con el comando nuevo de informes ves cuatro tablas de una vez: cuántas reservas tiene cada sala, cuántas tiene cada día de la semana, qué franjas se reservan más y qué salas nadie ha reservado. Hoy solo hay una reserva, en Norte el lunes de 10:00 a 12:00: verías Norte con 1 y Sur con 0, el lunes con 1, la franja de 10:00 a 12:00 en cabeza y Sur como sala que nadie ha reservado. Si pides los informes de una sola sala, las cuatro tablas se limitan a ella. Si no hay reservas, cada tabla dice «sin reservas». Solo suman las reservas vigentes: las canceladas y las anuladas no cuentan.

Validación: dev-lead — es una salida que una persona lee en la terminal; el agente no puede juzgar si la tabla se entiende.

## Capacidades

- Nuevas: `booking-reports` — informes de texto sobre las reservas: ocupación por sala, por día, franjas y salas sin reservar, con filtro por sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-reports`), contrato público (el comando y su opción son la interfaz que usa el cliente) · tamaño: ~150 líneas en 4 ficheros (código, tests, spec y capacidad)
- Dominio (sonnet): si «solo cuentan las reservas vigentes» y «sin reservas» son coherentes entre las cuatro vistas, también con `--sala` (señal: capacidad nueva)
- Técnica (sonnet): si los THEN de las tablas (alineado, orden, tope de 3 franjas) se pueden comprobar con `run` sembrando datos con `bookings` exportado (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la segunda lente (el orden y los empates de las tablas)

1. Enfoque: una función por vista que cuenta las reservas vigentes y un formateador común de tablas, frente a un único recorrido que calcula las cuatro vistas o a una tabla por fichero (ver Approach).
2. Capacidad nueva `booking-reports` (slug en inglés, kebab-case): no hay capacidades vivas y el comportamiento nuevo no encaja en otra.
3. Solo cuentan las reservas con estado vigente (`active`): las canceladas y las anuladas no suman en ninguna vista. Nadie dijo qué cuenta; es lo coherente con `libres`, que ignora las no vigentes.
4. «Ocupación» es el número de reservas, no un porcentaje: no hay horario de apertura que dé el 100 %.
5. `informes` sin opciones enseña las cuatro vistas seguidas, en este orden: «Ocupación por sala», «Ocupación por día de la semana», «Franjas más reservadas», «Salas que nadie ha reservado», cada una con su título y una línea en blanco entre vistas.
6. Formato de la tabla: una fila de cabecera y una por dato, columnas separadas por ` | `, cada celda rellena con espacios a la derecha hasta el ancho de su columna salvo la última; el ancho de una columna es la longitud máxima entre su cabecera y sus celdas. Cabeceras: `sala | reservas`, `día | reservas`, `franja | reservas`, `sala`.
7. Ocupación por sala: todas las salas, en el orden de la lista de salas, también con 0. Por día: los siete días, en orden de semana, con las siglas de los datos (`lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`), también con 0. El «también con 0» vale solo si hay alguna reserva vigente en el ámbito de la vista; si no, la vista dice `sin reservas` (punto 10).
8. Franjas más reservadas: solo franjas con al menos una reserva, de más a menos reservas, desempate comparando el texto de la franja tal como está guardado (orden ascendente), y un tope de 3 filas aplicado después de ordenar (decisión mía, a validar: nadie dijo 3).
9. Salas que nadie ha reservado: las que no tienen ninguna reserva vigente; si hay reservas y todas las salas tienen alguna, la vista dice `ninguna` (literal mío, a validar). Dos reservas iguales cuentan las dos.
10. `sin reservas` sustituye a la tabla (el título se queda). En las vistas 1 a 3, cuando no hay reservas vigentes en su ámbito (todas las salas, o la sala de `--sala`). En la vista 4, solo cuando no hay ninguna reserva vigente en ninguna sala (decisión mía, a validar): con cero reservas no lista todas las salas, porque el dev-lead pidió «sin reservas» en cada vista. Una sala con solo reservas canceladas o anuladas cuenta como sin reservas vigentes; si todas están así, es el caso «ninguna reserva vigente».
11. Con `--sala <nombre>`, las vistas 1 a 3 cuentan solo esa sala (la 1 enseña solo su fila), y la 4 enseña la sala si no tiene reservas vigentes y `ninguna` si las tiene; pero si no hay ninguna reserva vigente en ninguna sala, dice `sin reservas`.
12. `--sala` con una sala que no existe: `sala desconocida: <nombre>` y nada más. `--sala` sin nombre: `uso: informes [--sala <nombre>]`. El nombre de sala distingue mayúsculas (`norte` → `sala desconocida: norte`), y lo que siga a `--sala` se toma como el nombre; cualquier otro argumento se ignora. La lista de salas es la de `src/app.js` (`rooms`: Norte, Sur) y fija el orden de la vista 1 y contra qué se decide «desconocida». Nadie dijo qué hacer.
13. Los tests siembran datos exportando `bookings` desde `src/app.js` (hoy es una constante interna y no hay forma de crear reservas) y vaciándola y rellenándola en cada test; no cambia el comportamiento. El informe lee de cada reserva `room`, `day`, `slot` y `status`, con `status` igual a `active` (vigente), `cancelled` o `voided`: es la forma que ya tienen los datos.
14. Repaso de coherencia: corregí el punto 10 y el 11 (el escenario de `--sala Sur` contradecía «sin reservas por ámbito» en la vista 4) y añadí el escenario de `--sala Sur` sin ninguna reserva. Delta probado en una copia: `capability merge` añade 6 requisitos y las 5 reglas de `booking-reports`, sin rechazos.
- Política de modelos: dos revisores de la spec, ambos sonnet (la spec no toca reglas de negocio ni roles) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Técnica:
- **Aceptado** — Crítico: «también con 0» contradice `sin reservas` con ámbito vacío → punto 7: el 0 vale solo si hay reservas vigentes en el ámbito.
- **Rechazado** — Crítico: el padding de la vista por día no se prueba → la alineación la prueban los escenarios de sala y de franjas (anchos distintos); en la vista por día todas las celdas miden 3 y la última columna no lleva relleno.
- **Aceptado** — ancho de columna indefinido → punto 6: longitud máxima entre cabecera y celdas.
- **Aceptado** — desempate de franjas → punto 8: texto tal como está guardado, tope tras ordenar.
- **Aceptado** — el tope no se prueba tras ordenar → escenario de franjas nuevo (la franja de 2 reservas que aparece al final entra y `14:00-16:00` queda fuera).
- **Aceptado** — `--sala Sur` frente a la fila con 0 → mismo cambio que el primero.
- **Aceptado** — sembrar `bookings` → punto 13: se vacía y se rellena en cada test. **Rechazado** lo del `console.log` al importar: los tests actuales ya importan `run` de `src/app.js`.
- **Aceptado** — forma de la reserva → punto 13: `room`, `day`, `slot`, `status`.
- **Rechazado** — quitar la línea de la fusión de prueba (decisión 14): el repaso de coherencia exige escribirla aquí.
- **Aceptado** — mayúsculas y lo que sigue a `--sala` → punto 12.

Dominio:
- **Aceptado** — la vista 4 con `--sala` no distingue «no hay reservas en ninguna sala» → Approach: recibe también si existe alguna reserva vigente; escenario `--sala Norte` con reservas solo en Sur.
- **Aceptado** — la atribución al dev-lead del punto 10 era mía → ahora es decisión mía, a validar.
- **Aceptado** — solo reservas no vigentes → escenario nuevo y punto 10.
- **Aceptado** — «Regla ante conflicto» era una regla de recuento → ahora `no aplica`, y el recuento va en «Dónde viven los datos».
- **Aceptado** — Intent prometía más que las vistas 1 y 2 → Intent ajustado.
- **Aceptado** — aviso `ninguna` con `--sala` → redactado por ámbito.
- **Aceptado** — THEN de franjas con `--sala Norte` sin valores → fijado con datos.
- **Aceptado** — Scope sin la capacidad ni el texto de `salas` → añadidos.
- **Rechazado** — de dónde sale `active` → sale del código (`findBooking` en `src/app.js`) y va en el punto 13.
- **Rechazado** — «`PRODUCT.md` no existe» → existe en la raíz del repositorio y se leyó.

Segunda ronda (un revisor, sonnet): todo aceptado salvo lo marcado.
- **Aceptado** — literales del escenario de la cancelada, escenarios de `--sala norte` y `--sala --foo`, solo canceladas/anuladas y vigente más anulada, franjas completas en los GIVEN, y marca «a validar» en el tope de 3 y en `ninguna` → hecho.
- **Aceptado** — el export de `bookings` consta en «Lo que se retira o cambia de forma»; en qué task nace cada pieza → Approach; origen de la lista de salas → punto 12.
- **Aceptado, a medias** — argumentos sobrantes (`informes foo`, `--sala` repetido): decido que se ignoran, sin escenario. `--sala ""` cae en «sala desconocida: ». «Dos reservas iguales cuentan las dos» pasa a ser el punto 9, sin escenario propio.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas (ocupación por sala, por día de la semana, franjas más reservadas y salas que nadie ha reservado) — «un comando informes con cuatro vistas»
- Opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- Salida en tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy el responsable no tiene forma de saber cómo se usan las salas: tiene que mirar reserva a reserva. Quiere un resumen en la terminal. Es un éxito si, con las reservas de hoy, `informes` enseña el recuento por sala y por día (en orden fijo, no por uso), las franjas más reservadas y qué sala no usa nadie. Sería un fallo que una vista cuente reservas canceladas o anuladas, o que `--sala` deje una vista sin filtrar.

## Scope

- Entra: el comando `informes` con sus cuatro vistas y `--sala`, en `src/app.js`; sus tests en `test/informes.test.js`; exportar `bookings`; la capacidad `capabilities/booking-reports.md`, que crea el cierre. El texto `salas` de un comando desconocido no cambia.
- No entra: informes por rango de fechas, exportar a fichero o `.ics` (fila 0004), porcentajes de ocupación, ordenar o filtrar por otra cosa que no sea la sala, cambios a `libres`, `cancelar` o `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira: `informes` es un comando nuevo y `run` sigue devolviendo `salas` para un comando desconocido | `src/app.js:30-36` (`run`) | Scope |
| Un export nuevo, `bookings` (sin cambio de comportamiento): hoy `src/app.js` solo exporta `cancelBooking`, `voidBooking` y `run` | `src/app.js:3` | Scope y punto 13 |

- Filas que implementa: nada (0012 no tiene fila en el roadmap): comprobado con `git grep -n -i informes`, sin resultados

## Approach

- A: una función por vista (`porSala`, `porDia`, `franjas`, `sinReservar`) que recibe las reservas vigentes ya filtradas por `--sala`, más un formateador común de tablas — cada vista se prueba sola y coincide con el plan de una task por vista; cuesta un formateador compartido que las cuatro tasks tocan.
- B: un solo recorrido de las reservas que rellena las cuatro vistas — menos código, pero no cabe en tasks separadas y cualquier error afecta a las cuatro.
- C: una tabla por fichero en `src/` — rompe «un solo fichero de entrada» de `architecture.md`.
- Elegido: A — encaja con la partición en 5 tasks del dev-lead y con la arquitectura de un solo fichero. El formateador común y la exportación de `bookings` nacen en la task 1 (ocupación por sala, que también crea el comando `informes`); la task 5 añade `--sala`, su filtro y los mensajes `sala desconocida` y `uso`.

El filtro `--sala` se aplica una vez, antes de las vistas: las vistas 1 a 3 reciben solo las reservas de esa sala; la 4 recibe además la lista de salas filtrada y si existe alguna reserva vigente en cualquier sala (para decidir entre `sin reservas` y la lista). Las funciones y el formateador viven en `src/app.js`.

## Dónde se prueba

- Las cuatro vistas, `--sala` y los mensajes: con `run('informes', [...])`, como `test/cancel.test.js` y `test/app.test.js`; los datos se siembran con `bookings` exportado.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas vigentes, no porcentaje · franja — el texto `HH:MM-HH:MM` de la reserva
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-reports`

#### ADDED — Las cuatro vistas del informe

- GIVEN reservas vigentes: Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00; y una cancelada: Norte mie 09:00-10:00
- WHEN `informes`
- THEN la salida son las cuatro vistas, en este orden y separadas por una línea en blanco: «Ocupación por sala», «Ocupación por día de la semana», «Franjas más reservadas» y «Salas que nadie ha reservado»
- AND la reserva cancelada no suma en ninguna: la vista 1 dice `Norte | 2` y `Sur   | 1`, la vista 2 dice `mie | 0` y la vista 3 no tiene la franja `09:00-10:00`

#### ADDED — Ocupación por sala

- GIVEN las reservas vigentes Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN `informes`
- THEN la vista dice, tras su título: `sala  | reservas`, `Norte | 2`, `Sur   | 1`
- GIVEN ninguna reserva vigente
- WHEN `informes`
- THEN la vista dice, tras su título, `sin reservas`
- GIVEN solo una reserva Norte lun 10:00-12:00 cancelada y otra Sur mar 14:00-16:00 anulada
- WHEN `informes`
- THEN las vistas 1 a 3 dicen, tras su título, `sin reservas`
- GIVEN la reserva vigente Norte lun 10:00-12:00 y la anulada Norte mar 10:00-12:00
- WHEN `informes`
- THEN la vista 1 dice `Norte | 1` y `Sur   | 0`

#### ADDED — Ocupación por día de la semana

- GIVEN las reservas vigentes Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN `informes`
- THEN la vista dice, tras su título: `día | reservas`, `lun | 2`, `mar | 1`, `mie | 0`, `jue | 0`, `vie | 0`, `sab | 0`, `dom | 0`
- GIVEN ninguna reserva vigente
- WHEN `informes`
- THEN la vista dice, tras su título, `sin reservas`

#### ADDED — Franjas más reservadas

- GIVEN las reservas vigentes Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00, Sur mar 09:00-10:00, Sur mie 16:00-18:00 y Norte jue 16:00-18:00
- WHEN `informes`
- THEN la vista dice: `franja      | reservas`, `10:00-12:00 | 2`, `16:00-18:00 | 2`, `09:00-10:00 | 1`; la franja `14:00-16:00` queda fuera por el tope de 3 filas, tras ordenar
- GIVEN ninguna reserva vigente
- WHEN `informes`
- THEN la vista dice, tras su título, `sin reservas`

#### ADDED — Salas que nadie ha reservado

- GIVEN la única reserva vigente Norte lun 10:00-12:00
- WHEN `informes`
- THEN la vista dice: `sala`, `Sur`
- GIVEN reservas vigentes en Norte y en Sur
- WHEN `informes`
- THEN la vista dice, tras su título, `ninguna`
- GIVEN ninguna reserva vigente
- WHEN `informes`
- THEN la vista dice, tras su título, `sin reservas`
- GIVEN solo reservas canceladas o anuladas
- WHEN `informes`
- THEN la vista dice, tras su título, `sin reservas`

#### ADDED — Informes de una sola sala

- GIVEN las reservas vigentes Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN `informes --sala Norte`
- THEN «Ocupación por sala» solo tiene la fila `Norte | 2`; los días `lun` y `mar` tienen 1 cada uno; «Franjas más reservadas» dice `franja      | reservas`, `10:00-12:00 | 2`; y «Salas que nadie ha reservado» dice `ninguna`
- GIVEN la única reserva vigente Sur lun 14:00-16:00
- WHEN `informes --sala Norte`
- THEN las vistas 1 a 3 dicen `sin reservas` y «Salas que nadie ha reservado» enseña `sala`, `Norte`
- GIVEN la única reserva vigente Norte lun 10:00-12:00
- WHEN `informes --sala Sur`
- THEN las vistas 1 a 3 dicen `sin reservas` y «Salas que nadie ha reservado» enseña `sala`, `Sur`
- GIVEN ninguna reserva vigente
- WHEN `informes --sala Sur`
- THEN las cuatro vistas dicen, tras su título, `sin reservas`
- GIVEN cualquier reserva
- WHEN `informes --sala Oeste`
- THEN la salida es `sala desconocida: Oeste`
- GIVEN cualquier reserva
- WHEN `informes --sala norte`
- THEN la salida es `sala desconocida: norte`
- GIVEN cualquier reserva
- WHEN `informes --sala --foo`
- THEN la salida es `sala desconocida: --foo`
- GIVEN cualquier reserva
- WHEN `informes --sala`
- THEN la salida es `uso: informes [--sala <nombre>]`

#### Reglas de la capacidad — booking-reports

- **Dónde viven los datos**: en memoria, la lista de reservas de `src/app.js`; el informe no guarda nada y solo cuenta las reservas vigentes (las canceladas y las anuladas no suman)
- **Idioma de los nombres**: castellano en títulos, cabeceras y mensajes; siglas de día como en los datos
- **Límites**: 3 franjas como máximo en «Franjas más reservadas»
- **Avisos**: `sin reservas` cuando no hay reservas vigentes en el ámbito de la vista (en la vista 4, cuando no hay ninguna en ninguna sala); `ninguna` si hay alguna reserva vigente en alguna sala y ninguna sala del ámbito (todas, o la de `--sala`) está sin reservas vigentes; `sala desconocida: <nombre>` (se decide contra la lista de salas); `uso: informes [--sala <nombre>]`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
